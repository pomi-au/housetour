/*
 * Downlight planning and the tour's room-masked light pool, for the house model (pomi.house_model.v1).
 *
 *   planDownlights(json, options) -> { rooms, lights, grid }
 *     Rooms come from a raster of the slab: wall rectangles (grown 20 mm) are solid, cells with no roof above are
 *     outside, and the remaining floor cells flood-fill into rooms. Each room is decomposed into rectangles, gets a
 *     ceiling height from the roof planes and the surrounding wall tops, and a grid of downlights per rectangle:
 *     spacing = clamp(ceiling height, 1.6, 2.6) m, one row for narrow rooms, edge offset half a spacing, lights
 *     within 0.45 m of a wall nudged inward, lights closer than 1.2 m merged. Plan metres throughout.
 *
 *   createRoomMask(poolSize) -> { patch(material, surface), setRoom(slot, boxes, yLo, yHi, unmasked), haloSlot, scale }
 *     The tour's shader gate: each pooled spot light and its halo evaluate only inside their room's two boxes.
 *
 *   buildDownlightFixtures(lights, frame) -> { bezel, lens, trim } instanced recessed fittings at every light.
 */
import * as THREE from 'three';

// ---------------------------------------------------------------- room finding and light placement
export function planDownlights(json, options = {}) {
  const o = { cell: 0.1, wallGrow: 0.03, minArea: 1.5, spacingMin: 1.6, spacingMax: 2.6, wallClear: 0.45, mergeDistance: 1.2, ceilingAllowance: 0.30, maxPerRoom: 12, ...options };
  const elements = (json.elements || []).filter(el => Array.isArray(el.vertices) && Array.isArray(el.faces));
  const slabs = elements.filter(el => el.category === 'slab'), walls = elements.filter(el => el.category === 'wall'), roofs = elements.filter(el => el.category === 'roof');
  if (!slabs.length) return { rooms: [], lights: [], grid: null };
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of slabs) for (const [x, y] of el.vertices) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const c = o.cell, W = Math.ceil((x1 - x0) / c) + 1, H = Math.ceil((y1 - y0) / c) + 1;
  const state = new Uint8Array(W * H);            // 0 outside, 1 floor, 2 wall
  const roofZ = new Float32Array(W * H).fill(NaN); // lowest roof surface above the cell
  const wallTop = new Float32Array(W * H);         // top of the wall in a wall cell
  const idx = (i, j) => j * W + i;
  const toCell = (x, y) => [Math.floor((x - x0) / c), Math.floor((y - y0) / c)];
  const centre = (i, j) => [x0 + (i + 0.5) * c, y0 + (j + 0.5) * c];

  // Rasterise a plan triangle: callback per covered cell with barycentric weights.
  const rasterTriangle = (a, b, d, fn) => {
    const minI = Math.max(0, Math.floor((Math.min(a[0], b[0], d[0]) - x0) / c)), maxI = Math.min(W - 1, Math.floor((Math.max(a[0], b[0], d[0]) - x0) / c));
    const minJ = Math.max(0, Math.floor((Math.min(a[1], b[1], d[1]) - y0) / c)), maxJ = Math.min(H - 1, Math.floor((Math.max(a[1], b[1], d[1]) - y0) / c));
    const det = (b[0] - a[0]) * (d[1] - a[1]) - (d[0] - a[0]) * (b[1] - a[1]);
    if (Math.abs(det) < 1e-12) return;
    for (let j = minJ; j <= maxJ; j++) for (let i = minI; i <= maxI; i++) {
      const [px, py] = centre(i, j);
      const l1 = ((b[0] - px) * (d[1] - py) - (d[0] - px) * (b[1] - py)) / det;
      const l2 = ((d[0] - px) * (a[1] - py) - (a[0] - px) * (d[1] - py)) / det;
      const l3 = 1 - l1 - l2;
      if (l1 >= -1e-6 && l2 >= -1e-6 && l3 >= -1e-6) fn(i, j, l1, l2, l3);
    }
  };
  // Slab top faces are floor.
  for (const el of slabs) {
    const top = Math.max(...el.vertices.map(v => v[2]));
    for (const f of el.faces) {
      const v = f.map(k => el.vertices[k]);
      if (v.some(p => p[2] < top - 0.01)) continue;
      rasterTriangle(v[0], v[1], v[2], (i, j) => { state[idx(i, j)] = 1; });
    }
  }
  // Roof faces: the lowest surface above each cell.
  for (const el of roofs) for (const f of el.faces) {
    const v = f.map(k => el.vertices[k]);
    rasterTriangle(v[0], v[1], v[2], (i, j, l1, l2, l3) => {
      const z = l1 * v[0][2] + l2 * v[1][2] + l3 * v[2][2], k = idx(i, j);
      if (Number.isNaN(roofZ[k]) || z < roofZ[k]) roofZ[k] = z;
    });
  }
  // Walls: plan rectangles grown so leaves and junctions touch.
  for (const el of walls) {
    let wx0 = Infinity, wy0 = Infinity, wx1 = -Infinity, wy1 = -Infinity, top = 0;
    for (const [x, y, z] of el.vertices) { wx0 = Math.min(wx0, x); wx1 = Math.max(wx1, x); wy0 = Math.min(wy0, y); wy1 = Math.max(wy1, y); top = Math.max(top, z); }
    const [i0, j0] = toCell(wx0 - o.wallGrow, wy0 - o.wallGrow), [i1, j1] = toCell(wx1 + o.wallGrow, wy1 + o.wallGrow);
    for (let j = Math.max(0, j0); j <= Math.min(H - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(W - 1, i1); i++) { const k = idx(i, j); state[k] = 2; wallTop[k] = Math.max(wallTop[k], top); }
  }
  // Doors and windows close their openings for the room search (the walls of a house model may already be cut).
  for (const f of json.fixtures || []) {
    const [px, py] = f.position || [];
    if (!Number.isFinite(px) || !Number.isFinite(py) || !(f.width_m > 0)) continue;
    const alongX = Math.abs((Number(f.rotation_deg) || 0) % 180) < 45;
    const w = f.width_m / 2 + o.wallGrow, d = (f.depth_m > 0 ? f.depth_m : 0.3) / 2 + o.wallGrow;
    const [i0, j0] = toCell(px - (alongX ? w : d), py - (alongX ? d : w)), [i1, j1] = toCell(px + (alongX ? w : d), py + (alongX ? d : w));
    const top = Number.isFinite(f.head_m) ? f.head_m : 2.1;
    for (let j = Math.max(0, j0); j <= Math.min(H - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(W - 1, i1); i++) { const k = idx(i, j); if (state[k] !== 2) { state[k] = 2; wallTop[k] = top; } }
  }
  // Floor with no roof above is outside (porch, court).
  for (let k = 0; k < W * H; k++) if (state[k] === 1 && Number.isNaN(roofZ[k])) state[k] = 0;

  // Flood fill the floor cells into rooms.
  const room = new Int32Array(W * H).fill(-1);
  const rooms = [];
  const stack = [];
  for (let s = 0; s < W * H; s++) {
    if (state[s] !== 1 || room[s] >= 0) continue;
    const cells = [];
    stack.push(s); room[s] = rooms.length;
    while (stack.length) {
      const k = stack.pop(); cells.push(k);
      const i = k % W, j = (k - i) / W;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
        const nk = idx(ni, nj);
        if (state[nk] === 1 && room[nk] < 0) { room[nk] = rooms.length; stack.push(nk); }
      }
    }
    rooms.push({ id: `room-${rooms.length + 1}`, cells });
  }
  // Drop the small ones (cavities, cupboards).
  const kept = [];
  for (const r of rooms) {
    if (r.cells.length * c * c < o.minArea) { for (const k of r.cells) room[k] = -1; continue; }
    kept.push(r);
  }
  kept.forEach((r, n) => { r.index = n; for (const k of r.cells) room[k] = n; });

  const median = arr => { if (!arr.length) return NaN; const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
  // Largest rectangle of set cells in a mask (histogram method), as [i0, j0, i1, j1] inclusive.
  const largestRect = (mask) => {
    const heights = new Int32Array(W);
    let best = { area: 0 };
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) heights[i] = mask[idx(i, j)] ? heights[i] + 1 : 0;
      const st = [];
      for (let i = 0; i <= W; i++) {
        const h = i < W ? heights[i] : 0;
        let start = i;
        while (st.length && st[st.length - 1][1] > h) {
          const [s0, sh] = st.pop();
          const area = sh * (i - s0);
          if (area > best.area) best = { area, i0: s0, i1: i - 1, j0: j - sh + 1, j1: j };
          start = s0;
        }
        st.push([start, h]);
      }
    }
    return best.area ? best : null;
  };
  const wallClearCells = Math.ceil(o.wallClear / c);
  const nearWall = (i, j, r = wallClearCells) => {
    for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
      const ni = i + di, nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= W || nj >= H) return true;
      if (state[idx(ni, nj)] !== 1 && di * di + dj * dj <= r * r) return true;
    }
    return false;
  };

  const lights = [];
  for (const r of kept) {
    // Ceiling: the roof underside less the allowance, capped by the tops of the walls around the room.
    const roofs = [], tops = [];
    for (const k of r.cells) {
      roofs.push(roofZ[k]);
      const i = k % W, j = (k - i) / W;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nk = idx(i + di, j + dj); if (state[nk] === 2 && wallTop[nk] > 0) tops.push(wallTop[nk]); }
    }
    // Flat ceiling at the lower of the surrounding wall tops and the lowest roof point over the room. Walls of
    // clearly different heights around the room mean a raking ceiling: the roof underside is then the ceiling.
    const roofMin = Math.min(...roofs), wallCeil = tops.length ? median(tops) : Infinity;
    r.ceiling = Math.min(Math.max(2.2, Math.min(roofMin - 0.05, wallCeil)), 4.0);
    r.raked = tops.length > 0 && Math.max(...tops) - Math.min(...tops) > 0.6 && roofMin > r.ceiling + 0.6;
    r.area = r.cells.length * c * c;
    // Rectangle decomposition: peel the largest rectangle until 90 % of the room is covered.
    const mask = new Uint8Array(W * H);
    for (const k of r.cells) mask[k] = 1;
    let remaining = r.cells.length;
    r.rects = [];
    while (remaining > r.cells.length * 0.1 && r.rects.length < 8) {
      const b = largestRect(mask);
      if (!b || b.area * c * c < 0.8) break;
      for (let j = b.j0; j <= b.j1; j++) for (let i = b.i0; i <= b.i1; i++) { mask[idx(i, j)] = 0; }
      remaining -= b.area;
      r.rects.push({ x0: x0 + b.i0 * c, y0: y0 + b.j0 * c, x1: x0 + (b.i1 + 1) * c, y1: y0 + (b.j1 + 1) * c, area: b.area * c * c });
    }
    // Room boxes for the light mask: the two largest rectangles, grown into the walls.
    r.boxes = r.rects.slice(0, 2).map(q => [q.x0 - 0.3, q.y0 - 0.3, q.x1 + 0.3, q.y1 + 0.3]);
    // Lights per rectangle.
    const spacing = Math.min(o.spacingMax, Math.max(o.spacingMin, r.ceiling));
    const roomLights = [];
    for (const q of r.rects) {
      const w = q.x1 - q.x0, d = q.y1 - q.y0;
      const spots = [];
      if (Math.min(w, d) < 1.6) {
        const alongX = w >= d, L = Math.max(w, d), n = Math.max(1, Math.round(L / 2.2));
        for (let k = 0; k < n; k++) { const t = (k + 0.5) / n; spots.push(alongX ? [q.x0 + t * w, (q.y0 + q.y1) / 2] : [(q.x0 + q.x1) / 2, q.y0 + t * d]); }
      } else {
        const cols = Math.max(1, Math.round(w / spacing)), rows = Math.max(1, Math.round(d / spacing));
        for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) spots.push([q.x0 + (a + 0.5) * w / cols, q.y0 + (b + 0.5) * d / rows]);
      }
      for (const [sx, sy] of spots) {
        // Keep clear of the walls: nudge to the nearest clear cell of this room within 1 m, else drop the light.
        let [i, j] = toCell(sx, sy), ok = room[idx(i, j)] === r.index && !nearWall(i, j);
        if (!ok) {
          const reach = Math.round(1.0 / c);
          let best = null;
          for (let dj = -reach; dj <= reach && !best; dj++) for (let di = -reach; di <= reach; di++) {
            const ni = i + di, nj = j + dj;
            if (ni < 0 || nj < 0 || ni >= W || nj >= H || room[idx(ni, nj)] !== r.index || nearWall(ni, nj)) continue;
            const dist = di * di + dj * dj;
            if (!best || dist < best.dist) best = { i: ni, j: nj, dist };
          }
          if (!best) continue;
          i = best.i; j = best.j; ok = true;
        }
        const [px, py] = ok ? centre(i, j) : [sx, sy];
        if (roomLights.some(l => Math.hypot(l.x - px, l.y - py) < o.mergeDistance)) continue;
        roomLights.push({ x: px, y: py });
      }
    }
    // Ceiling at each light: the roof plane there for a raked room, else the flat ceiling.
    for (const l of roomLights) {
      const [i, j] = toCell(l.x, l.y);
      const z = r.raked ? Math.min(roofZ[idx(i, j)] - 0.15, 4.0) : r.ceiling;
      lights.push({ x: l.x, y: l.y, z, room: r.index });
    }
    r.lights = roomLights.length;
    if (roomLights.length > o.maxPerRoom) console.warn(`[lighting] ${r.id}: ${roomLights.length} lights over ${r.area.toFixed(1)} m2`);
    if (!roomLights.length) console.warn(`[lighting] ${r.id}: no light fits (${r.area.toFixed(1)} m2)`);
    delete r.cells;
  }
  return { rooms: kept, lights, grid: { x0, y0, cell: c, W, H, state, room } };
}

// ---------------------------------------------------------------- the tour's room mask
// Each pooled spot light is confined to its room by a shader gate on the room's bounds (two boxes plus a height
// range per light); its halo point light shares the slot. Point lights past the pool are free.
export function createRoomMask(pool) {
  const uniforms = {
    uRoomBoxA: { value: Array.from({ length: pool }, () => new THREE.Vector4()) },
    uRoomBoxB: { value: Array.from({ length: pool }, () => new THREE.Vector4()) },
    uRoomY: { value: Array.from({ length: pool }, () => new THREE.Vector2()) },
    uHaloSlot: { value: Array.from({ length: pool + 4 }, (_, i) => Math.min(i, pool - 1)) }
  };
  const scale = { floor: { value: 0.6 }, wall: { value: 1.0 }, screen: { value: 0.2 } };
  function spotLoopWithRoomGate() {
    const chunk = THREE.ShaderChunk.lights_fragment_begin;
    const start = chunk.indexOf('#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )');
    const end = chunk.indexOf('#pragma unroll_loop_end', start);
    let loop = chunk.slice(start, end)
      .replace('spotLight = spotLights[ i ];', 'spotLight = spotLights[ i ];\n\t\tif ( roomMask( UNROLLED_LOOP_INDEX, roomWorldPos ) > 0.0 ) {')
      .replace('getSpotLightInfo( spotLight, geometryPosition, directLight );', 'getSpotLightInfo( spotLight, geometryPosition, directLight );\n\t\tdirectLight.color *= uLightScale;')
      .replace('RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t\t}');
    let out = chunk.slice(0, start) + loop + chunk.slice(end);
    const ps = out.indexOf('#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )');
    const pe = out.indexOf('#pragma unroll_loop_end', ps);
    const ploop = out.slice(ps, pe)
      .replace('pointLight = pointLights[ i ];', `pointLight = pointLights[ i ];\n\t\tif ( UNROLLED_LOOP_INDEX >= ${pool} || roomMask( uHaloSlot[ UNROLLED_LOOP_INDEX ], roomWorldPos ) > 0.0 ) {`)
      .replace('RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t\t}');
    return out.slice(0, ps) + ploop + out.slice(pe);
  }
  function patch(material, surface = 'wall') {
    material.onBeforeCompile = shader => {
      shader.uniforms.uLightScale = scale[surface] || scale.wall;
      shader.uniforms.uRoomBoxA = uniforms.uRoomBoxA;
      shader.uniforms.uRoomBoxB = uniforms.uRoomBoxB;
      shader.uniforms.uRoomY = uniforms.uRoomY;
      shader.uniforms.uHaloSlot = uniforms.uHaloSlot;
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <lights_fragment_begin>', 'vec3 roomWorldPos = cameraPosition + ( -vViewPosition ) * mat3( viewMatrix );\n#include <lights_fragment_begin>')
        .replace('#include <common>', `#include <common>
uniform float uLightScale;
uniform vec4 uRoomBoxA[${pool}];
uniform vec4 uRoomBoxB[${pool}];
uniform vec2 uRoomY[${pool}];
uniform int uHaloSlot[${pool + 4}];
float roomMask(int i, vec3 vRoomPos) {
  vec4 a = uRoomBoxA[i]; vec4 b = uRoomBoxB[i]; vec2 y = uRoomY[i];
  bool inA = vRoomPos.x >= a.x && vRoomPos.x <= a.z && vRoomPos.z >= a.y && vRoomPos.z <= a.w;
  bool inB = vRoomPos.x >= b.x && vRoomPos.x <= b.z && vRoomPos.z >= b.y && vRoomPos.z <= b.w;
  bool inY = vRoomPos.y >= y.x && vRoomPos.y <= y.y;
  return (inY && (inA || inB)) ? 1.0 : 0.0;
}`)
        .replace('#include <lights_fragment_begin>', spotLoopWithRoomGate());
    };
    material.customProgramCacheKey = () => 'roommask' + pool + surface;
    return material;
  }
  // World-space boxes ([x0, z0, x1, z1] each) and height range for a slot; unmasked = no box at all.
  function setRoom(slot, boxes, yLo, yHi, unmasked = false) {
    const a = uniforms.uRoomBoxA.value[slot], b = uniforms.uRoomBoxB.value[slot], y = uniforms.uRoomY.value[slot];
    if (unmasked) { a.set(-1e9, -1e9, 1e9, 1e9); b.set(1e9, 1e9, 1e9, 1e9); y.set(-1e9, 1e9); return; }
    const set = (v, box) => { if (!box) v.set(1e9, 1e9, 1e9, 1e9); else v.set(Math.min(box[0], box[2]), Math.min(box[1], box[3]), Math.max(box[0], box[2]), Math.max(box[1], box[3])); };
    set(a, boxes?.[0]); set(b, boxes?.[1]);
    if (!boxes?.length) y.set(1e9, 1e9); else y.set(yLo, yHi);
  }
  return { pool, uniforms, scale, patch, setRoom, haloSlot: uniforms.uHaloSlot.value };
}

// ---------------------------------------------------------------- recessed fittings (as tour.js)
export function buildDownlightFixtures(lights, frame) {
  const n = Math.max(1, lights.length);
  const bezelGeo = new THREE.TorusGeometry(0.046, 0.007, 10, 36); bezelGeo.rotateX(Math.PI / 2);
  const bezel = new THREE.InstancedMesh(bezelGeo, new THREE.MeshPhysicalMaterial({ color: 0xf6f6f4, roughness: 0.35, metalness: 0.05 }), n);
  const lensGeo = new THREE.CircleGeometry(0.04, 28); lensGeo.rotateX(Math.PI / 2);
  const lens = new THREE.InstancedMesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), n);
  const trimGeo = new THREE.CylinderGeometry(0.048, 0.052, 0.03, 36, 1, true);
  const trim = new THREE.InstancedMesh(trimGeo, new THREE.MeshPhysicalMaterial({ color: 0xdedcd6, roughness: 0.6, side: THREE.BackSide }), n);
  const m = new THREE.Matrix4();
  lights.forEach((l, i) => {
    const x = l.x - frame.cx, z = -(l.y - frame.cy), ceilingY = l.z;
    m.makeTranslation(x, ceilingY - 0.004, z); bezel.setMatrixAt(i, m);
    m.makeTranslation(x, ceilingY - 0.012, z); lens.setMatrixAt(i, m);
    m.makeTranslation(x, ceilingY + 0.012, z); trim.setMatrixAt(i, m);
    lens.setColorAt(i, new THREE.Color(0.95, 0.9, 0.8));
  });
  bezel.count = lens.count = trim.count = lights.length;
  bezel.castShadow = false; lens.castShadow = false; trim.castShadow = false;
  for (const o of [bezel, lens, trim]) o.raycast = () => {};
  return { bezel, lens, trim };
}
