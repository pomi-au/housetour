/*
 * Surface builders for the house model (pomi.house_model.v1): slab, footing, wall, roof, fascia, glazing.
 *
 * Model frame: x, y are plan metres, z is up from the slab top. World frame: three.js, y up, plan y toward -z,
 * centred by `frame = { cx, cy }`. Every builder takes the element data and a material and returns a Mesh
 * (walls may return several pieces) with flat normals, world-metre UVs for the relief textures, and a BVH for
 * raycasting when three-mesh-bvh is patched in.
 *
 *   buildSlab(el, material, frame)              buildFooting(el, material, frame)
 *   buildWall(el, openings, material, frame)    buildRoof(el, material, frame)
 *   buildFascia(eaveLine, material, frame)      buildGlazing(opening, material, frame)
 *   openingBoxes(fixtures, { doorOpening })     plan rectangles and sill..head of every fixture
 *   floorTriangles(mesh, y)                     upward faces at a height, for the floor reflector
 */
import * as THREE from 'three';

export const planToWorld = ([x, y, z], frame) => [x - frame.cx, z, -(y - frame.cy)];

// A mesh from plan-frame vertices and faces: non-indexed, flat normals, UVs along the dominant face plane.
export function meshFromFaces(vertices, faces, material, frame, userData = {}) {
  const pos = [], uv = [];
  for (const tri of faces) {
    if (!Array.isArray(tri) || tri.length < 3) continue;
    const a = planToWorld(vertices[tri[0]], frame), b = planToWorld(vertices[tri[1]], frame), c = planToWorld(vertices[tri[2]], frame);
    const n = new THREE.Vector3().crossVectors(new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), new THREE.Vector3(c[0] - a[0], c[1] - a[1], c[2] - a[2]));
    if (n.lengthSq() < 1e-14) continue;
    n.normalize();
    const nx = Math.abs(n.x), ny = Math.abs(n.y), nz = Math.abs(n.z);
    for (const p of [a, b, c]) {
      pos.push(p[0], p[1], p[2]);
      if (ny >= nx && ny >= nz) uv.push(p[0], p[2]); else if (nx >= nz) uv.push(p[2], p[1]); else uv.push(p[0], p[1]);
    }
  }
  if (!pos.length) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  geo.computeBoundsTree?.();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.userData = userData;
  return mesh;
}

// Upward faces of a mesh at height y (world), as a flat [x, z, x, z, x, z, ...] list.
export function floorTriangles(mesh, y, tol = 0.01) {
  const p = mesh.geometry.attributes.position.array, n = mesh.geometry.attributes.normal.array, out = [];
  for (let i = 0; i < p.length; i += 9) {
    if (n[i + 1] < 0.9) continue;
    if (Math.abs(p[i + 1] - y) > tol || Math.abs(p[i + 4] - y) > tol || Math.abs(p[i + 7] - y) > tol) continue;
    out.push(p[i], p[i + 2], p[i + 3], p[i + 5], p[i + 6], p[i + 8]);
  }
  return out;
}

// A closed prism over a plan polygon (no holes) between two height functions, as plan-frame vertices and faces.
export function prism(contour, zTop, zBot) {
  const pts = contour.map(([x, y]) => new THREE.Vector2(x, y));
  if (THREE.ShapeUtils.isClockWise(pts)) pts.reverse();
  const tris = THREE.ShapeUtils.triangulateShape(pts, []);
  const n = pts.length, vertices = [], faces = [];
  for (const p of pts) vertices.push([p.x, p.y, zTop(p.x, p.y)]);
  for (const p of pts) vertices.push([p.x, p.y, zBot(p.x, p.y)]);
  for (const [a, b, c] of tris) { faces.push([a, b, c]); faces.push([n + a, n + c, n + b]); }
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; faces.push([i, n + i, n + j]); faces.push([i, n + j, j]); }
  return { vertices, faces };
}

export function buildSlab(el, material, frame) {
  return meshFromFaces(el.vertices, el.faces, material, frame, { id: el.id, category: 'slab', floor: true });
}
export function buildFooting(el, material, frame) {
  return meshFromFaces(el.vertices, el.faces, material, frame, { id: el.id, category: 'footing' });
}
export function buildRoof(el, material, frame) {
  return meshFromFaces(el.vertices, el.faces, material, frame, { id: el.id, category: 'roof', role: el.role });
}

// Opening boxes from the fixtures: plan rectangle (width along the wall, depth across) and sill..head.
// `doorOpening(width)` gives the frame opening of a hinged door ({ width, height }) when a door model exists;
// the hinge then sits at the -x end for 'L' and the +x end for 'R' (x along the opening, seen from -z).
export function openingBoxes(fixtures, { doorOpening = null } = {}) {
  const out = [];
  for (const f of fixtures || []) {
    const [px, py] = f.position || [];
    if (!Number.isFinite(px) || !Number.isFinite(py) || !(f.width_m > 0)) continue;
    const rotation = Number(f.rotation_deg) || 0;
    const alongX = Math.abs(rotation % 180) < 45;
    let w = f.width_m / 2;
    const d = (f.depth_m > 0 ? f.depth_m : 0.3) / 2 + 0.02;
    let sill = Number.isFinite(f.sill_m) ? f.sill_m : 0;
    let head = Number.isFinite(f.head_m) ? f.head_m : sill + (f.height_m > 0 ? f.height_m : 2.1);
    const hinged = /hinged/.test(f.kind || '') && !!doorOpening;
    if (hinged) { const o = doorOpening(f.width_m); w = o.width / 2; sill = 0; head = o.height; }
    out.push({ id: f.id, kind: f.kind || '', label: f.label || '', alongX, rotation, cx: px, cy: py, width: f.width_m, depth: f.depth_m || 0.23,
      hinged, hinge: f.hinge === 'L' ? 'L' : 'R',
      x0: px - (alongX ? w : d), x1: px + (alongX ? w : d), y0: py - (alongX ? d : w), y1: py + (alongX ? d : w), z0: sill, z1: head });
  }
  return out;
}

// A wall crossed by openings is rebuilt from its plan rectangle and top edge as pieces around the holes:
// full-height pieces between openings, a piece above each head and one below each sill. Walls that are not a
// plain rectangle in plan, or that no opening crosses, keep the file's mesh.
export function buildWall(el, openings, material, frame) {
  const userData = { id: el.id, category: 'wall', role: el.role, finish: el.finish };
  const pieces = cutWall(el, openings);
  if (!pieces) { const m = meshFromFaces(el.vertices, el.faces, material, frame, userData); return m ? [m] : []; }
  return pieces.map((p, i) => meshFromFaces(p.vertices, p.faces, material, frame, { ...userData, id: `${el.id}-${i + 1}`, cut: true })).filter(Boolean);
}
export function cutWall(el, openings) {
  const V = el.vertices;
  let px0 = Infinity, py0 = Infinity, px1 = -Infinity, py1 = -Infinity, bottom = Infinity;
  for (const [x, y, z] of V) { px0 = Math.min(px0, x); px1 = Math.max(px1, x); py0 = Math.min(py0, y); py1 = Math.max(py1, y); bottom = Math.min(bottom, z); }
  const eps = 0.002;
  if (!V.every(([x, y]) => Math.abs(x - px0) < eps || Math.abs(x - px1) < eps || Math.abs(y - py0) < eps || Math.abs(y - py1) < eps)) return null;
  const alongX = (px1 - px0) >= (py1 - py0);
  const A0 = alongX ? px0 : py0, A1 = alongX ? px1 : py1, B0 = alongX ? py0 : px0, B1 = alongX ? py1 : px1;
  const cuts = [];
  for (const o of openings || []) {
    const ox0 = Math.max(px0, o.x0), ox1 = Math.min(px1, o.x1), oy0 = Math.max(py0, o.y0), oy1 = Math.min(py1, o.y1);
    if (ox1 - ox0 < 0.005 || oy1 - oy0 < 0.005) continue;
    const across = alongX ? oy1 - oy0 : ox1 - ox0;
    if (across < (B1 - B0) * 0.5) continue;                  // clips a corner only: not a hole through this wall
    cuts.push({ a0: alongX ? ox0 : oy0, a1: alongX ? ox1 : oy1, z0: o.z0, z1: o.z1 });
  }
  if (!cuts.length) return null;
  cuts.sort((p, q) => p.a0 - q.a0);
  const merged = [];
  for (const c of cuts) {
    const last = merged[merged.length - 1];
    if (last && c.a0 < last.a1 - 0.001) { last.a1 = Math.max(last.a1, c.a1); last.z0 = Math.min(last.z0, c.z0); last.z1 = Math.max(last.z1, c.z1); }
    else merged.push({ ...c });
  }
  const pts = V.filter(v => v[2] > bottom + 0.01).map(v => [alongX ? v[0] : v[1], v[2]]).sort((p, q) => p[0] - q[0]);
  if (!pts.length) return null;
  const zTop = (x, y) => {
    const t = alongX ? x : y;
    if (t <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, z0] = pts[i - 1], [t1, z1] = pts[i]; return t1 - t0 < 1e-6 ? Math.max(z0, z1) : z0 + (z1 - z0) * (t - t0) / (t1 - t0); }
    return pts[pts.length - 1][1];
  };
  const topMin = Math.min(...pts.map(p => p[1]));
  const rect = (a0, a1) => alongX ? [[a0, B0], [a1, B0], [a1, B1], [a0, B1]] : [[B0, a0], [B1, a0], [B1, a1], [B0, a1]];
  const pieces = [];
  const piece = (a0, a1, zLo, zHi) => { if (a1 - a0 > 0.002) pieces.push(prism(rect(a0, a1), zHi || zTop, () => zLo)); };
  let cursor = A0;
  for (const c of merged) {
    if (c.a0 > cursor + 0.001) piece(cursor, c.a0, bottom);
    if (c.z1 < topMin - 0.005) piece(c.a0, c.a1, c.z1);
    if (c.z0 > bottom + 0.005) piece(c.a0, c.a1, bottom, () => c.z0);
    cursor = Math.max(cursor, c.a1);
  }
  if (cursor < A1 - 0.001) piece(cursor, A1, bottom);
  return pieces;
}

// A fascia board hanging from an eave height line ({ start: [x, y, z], end: [x, y, z] }).
export const FASCIA = { depth: 0.18, thick: 0.03, rise: 0.02 };
export function buildFascia(line, material, frame) {
  const a = line.start, b = line.end;
  if (!Array.isArray(a) || !Array.isArray(b)) return null;
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  if (len < 1e-4) return null;
  const nx = -dy / len * FASCIA.thick / 2, ny = dx / len * FASCIA.thick / 2;
  const contour = [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
  const zAt = (x, y) => a[2] + (b[2] - a[2]) * ((x - a[0]) * dx + (y - a[1]) * dy) / (len * len);
  const p = prism(contour, (x, y) => zAt(x, y) + FASCIA.rise, (x, y) => zAt(x, y) - FASCIA.depth);
  return meshFromFaces(p.vertices, p.faces, material, frame, { id: line.id || 'eave', category: 'fascia' });
}

// A plain glass pane filling an opening box (for openings with no fixture module).
export function buildGlazing(o, material, frame) {
  const t = 0.003;
  const contour = o.alongX ? [[o.x0, o.cy - t], [o.x1, o.cy - t], [o.x1, o.cy + t], [o.x0, o.cy + t]] : [[o.cx - t, o.y0], [o.cx + t, o.y0], [o.cx + t, o.y1], [o.cx - t, o.y1]];
  const p = prism(contour, () => o.z1, () => o.z0);
  const m = meshFromFaces(p.vertices, p.faces, material, frame, { id: `${o.id}-glass`, category: 'glazing' });
  if (m) m.castShadow = false;
  return m;
}
