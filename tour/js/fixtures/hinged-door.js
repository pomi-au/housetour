/*
 * Hinged door: the standard door of tour.html, lifted from the residence engine.
 *
 * The residence engine (residence-model.js) builds every hinged door of the tour: Metro 95 frame, jambs,
 * leaf, butt hinges, lever set. `extractStandardDoor(window.RESIDENCE)` reads door D04 back in door-local
 * coordinates (u along the leaf from the hinge, v up, n across the wall) split into the fixed frame and the
 * swinging leaf with its hardware. `createHingedDoor` places that model at any width: the hinge half keeps
 * its shape, the strike half is shifted by the width difference, so hardware is never stretched.
 *
 *   createHingedDoor({ model, width: 0.82, hinge: 'L' | 'R', position, rotationDeg, materials })
 *   -> Group; group.userData.fixture.toggle(sideSign) swings the leaf away from the given side (+1 = local +z).
 *   openingFor(model, width) -> { width, height } the wall opening the frame needs.
 */
import * as THREE from 'three';
import { placeFixture, defaultMaterials, motion, easeInOut } from './common.js';

// Engine plan coordinates of the reference door: hinge point and the direction the closed leaf runs.
export const STANDARD_DOOR = { id: 'D04', hinge: [6.645, 0, 2.535], leafWidth: 0.72, dir: [0, -1] };

export function extractStandardDoor(R, ref = STANDARD_DOOR) {
  if (!R) return null;
  const items = R.meshes.filter(m => m.name.startsWith(`${ref.id}-`) && m.count && !m.physicalOnly);
  if (!items.length) return null;
  const h = R.toWorld(...ref.hinge);
  const [dx, dz] = ref.dir;
  const parts = { fixed: new Map(), leaf: new Map() };
  let u0 = Infinity, u1 = -Infinity, top = 0, depth = 0;
  for (const item of items) {
    const kind = R.materialKindForItem(item) === 4 ? 'metal' : 'paint';
    const group = item.transformWhen ? parts.leaf : parts.fixed;
    if (!group.has(kind)) group.set(kind, { pos: [], nor: [], col: [] });
    const g = group.get(kind);
    const c = new THREE.Color().setRGB(...R.resolvedItemColor(item).slice(0, 3), THREE.SRGBColorSpace);
    const p = item.shadowPositions, n = item.renderNormals;
    const local = i => { const wx = p[i] - h[0], wz = p[i + 2] - h[2]; return [wx * dx + wz * dz, p[i + 1], -wx * dz + wz * dx]; };
    const localN = i => [n[i] * dx + n[i + 2] * dz, n[i + 1], -n[i] * dz + n[i + 2] * dx];
    for (let t = 0; t < p.length; t += 9) {
      // The engine never culls, so orient every triangle to its render normal (as the tour does).
      const a = local(t), b = local(t + 3), cc = local(t + 6), ln = localN(t);
      const gx = (b[1] - a[1]) * (cc[2] - a[2]) - (b[2] - a[2]) * (cc[1] - a[1]);
      const gy = (b[2] - a[2]) * (cc[0] - a[0]) - (b[0] - a[0]) * (cc[2] - a[2]);
      const gz = (b[0] - a[0]) * (cc[1] - a[1]) - (b[1] - a[1]) * (cc[0] - a[0]);
      const order = gx * ln[0] + gy * ln[1] + gz * ln[2] >= 0 ? [0, 3, 6] : [0, 6, 3];
      for (const k of order) {
        const v = local(t + k), vn = localN(t + k);
        g.pos.push(v[0], v[1], v[2]); g.nor.push(vn[0], vn[1], vn[2]); g.col.push(c.r, c.g, c.b);
        if (!item.transformWhen) { u0 = Math.min(u0, v[0]); u1 = Math.max(u1, v[0]); top = Math.max(top, v[1]); depth = Math.max(depth, Math.abs(v[2])); }
      }
    }
  }
  return { parts, u0, u1, top, depth, leafWidth: ref.leafWidth, geometries: new Map() };
}

// The wall opening a door of this width needs: the frame's outer extent, the frame's height.
export function openingFor(model, width) {
  return { width: model.u1 - model.u0 + (width - model.leafWidth) + 0.006, height: model.top + 0.004 };
}

// Geometries for one leaf width, cached on the model: hinge half kept, strike half shifted.
function geometriesFor(model, width) {
  const key = width.toFixed(3);
  if (model.geometries.has(key)) return model.geometries.get(key);
  const shift = width - model.leafWidth, split = model.leafWidth / 2;
  const out = { fixed: [], leaf: [] };
  for (const part of ['fixed', 'leaf']) {
    for (const [kind, g] of model.parts[part]) {
      const pos = Float32Array.from(g.pos);
      for (let i = 0; i < pos.length; i += 3) if (pos[i] > split) pos[i] += shift;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(g.nor, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(g.col, 3));
      geo.computeBoundsTree?.();
      out[part].push({ geo, kind });
    }
  }
  model.geometries.set(key, out);
  return out;
}

export function createHingedDoor({ model, width = 0.82, hinge = 'R', position = [0, 0, 0], rotationDeg = 0, materials = defaultMaterials(), duration = 0.9, label = '' } = {}) {
  if (!model) throw new Error('createHingedDoor needs the standard door model (extractStandardDoor)');
  const g = geometriesFor(model, width);
  const group = placeFixture(new THREE.Group(), position, rotationDeg);
  // The body holds the model with its hinge at the body origin and the leaf along +x. Hinge 'L' puts the
  // hinge at the opening's -x end; 'R' turns the body round so the hinge sits at +x.
  const right = hinge === 'R';
  const frameCentre = (model.u0 + model.u1 + (width - model.leafWidth)) / 2;
  const body = new THREE.Group();
  body.rotation.y = right ? Math.PI : 0;
  body.position.x = right ? frameCentre : -frameCentre;
  const leaf = new THREE.Group();
  const meshes = [];
  const add = (parent, { geo, kind }) => { const m = new THREE.Mesh(geo, materials[kind]); m.castShadow = true; m.receiveShadow = true; parent.add(m); meshes.push(m); };
  g.fixed.forEach(x => add(body, x));
  g.leaf.forEach(x => add(leaf, x));
  body.add(leaf);
  group.add(body);
  const m = motion(duration);
  let dir = 1;
  const fixture = {
    kind: 'hinged door', label, width, hinge, meshes, leaf,
    get open() { return m.open; }, get moving() { return m.moving; }, get progress() { return m.progress; },
    // Swing away from the side given in group-local z (+1 = the local +z side). A closing door keeps its direction.
    toggle(sideSign = 1) {
      if (!m.open) dir = (sideSign > 0 ? 1 : -1) * (right ? -1 : 1);
      m.set(!m.open);
    },
    step(dt) {
      if (!m.advance(dt)) return false;
      leaf.rotation.y = dir * Math.PI / 2 * easeInOut(m.progress);
      return true;
    }
  };
  group.userData.fixture = fixture;
  return group;
}
