/*
 * Skeleton: the tour's procedural closet skeleton (three.js primitives, no assets), as a fixture module.
 *
 *   createSkeleton({ materials }) -> Group, 1.7 m tall, standing, facing +z; group.userData.height = 1.7.
 *   popIn(group, { from, to, scale, duration }) -> { step(dt) } moves and grows it from `from` to `to`.
 * The bone material carries a faint emissive so the bones read in a dark cupboard.
 */
import * as THREE from 'three';
import { easeInOut } from './common.js';

const boneMaterial = () => new THREE.MeshStandardMaterial({ color: 0xe6dfcd, roughness: 0.6, metalness: 0, emissive: 0x3d3730 });

  export function buildSkull(bone = boneMaterial()) {
  const g = new THREE.Group();
  const dark = new THREE.MeshBasicMaterial({ color: 0x101010 });
  const add = (geo, x, y, z, mat = bone) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
  add(new THREE.SphereGeometry(0.095, 20, 16), 0, 0, 0).scale.set(1, 1.1, 1.05);
  add(new THREE.BoxGeometry(0.10, 0.05, 0.085), 0, -0.085, 0.02);
  add(new THREE.SphereGeometry(0.02, 8, 6), -0.035, 0.01, 0.085, dark);
  add(new THREE.SphereGeometry(0.02, 8, 6), 0.035, 0.01, 0.085, dark);
  add(new THREE.BoxGeometry(0.075, 0.012, 0.03), 0, -0.065, 0.075, dark);
  return g;
}
export function createSkeleton() {
  const g = new THREE.Group();
  const bone = boneMaterial();
  const add = (geo, x, y, z, mat = bone) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // A bone between two joints: a cylinder aligned to the segment.
  const link = (a, b, r) => {
    const d = b.clone().sub(a), len = d.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.85, len, 8), bone);
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    m.castShadow = true; g.add(m); return m;
  };
  const joint = (p, r) => add(new THREE.SphereGeometry(r, 10, 8), p.x, p.y, p.z);
  const skull = buildSkull(bone); skull.position.y = 1.60; g.add(skull);
  // Spine: neck to pelvis.
  for (let i = 0; i < 20; i++) add(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 8), 0, 0.97 + i * 0.028, 0);
  // Rib cage: rings around the spine, sternum in front, clavicles above.
  const ribs = [0.10, 0.125, 0.14, 0.15, 0.15, 0.145, 0.13, 0.11];
  ribs.forEach((r, i) => { const ring = add(new THREE.TorusGeometry(r, 0.007, 6, 28), 0, 1.16 + i * 0.038, 0.02); ring.rotation.x = Math.PI / 2; ring.scale.z = 0.7; });
  add(new THREE.BoxGeometry(0.03, 0.26, 0.015), 0, 1.30, 0.125);
  link(V(0, 1.45, 0.02), V(-0.18, 1.45, -0.01), 0.008); link(V(0, 1.45, 0.02), V(0.18, 1.45, -0.01), 0.008);
  // Pelvis.
  const pelvis = add(new THREE.TorusGeometry(0.12, 0.022, 8, 24), 0, 0.95, 0); pelvis.rotation.x = Math.PI / 2; pelvis.scale.z = 0.6;
  add(new THREE.BoxGeometry(0.06, 0.09, 0.03), 0, 0.93, -0.05);
  // Arms and legs, hanging loosely.
  for (const sgn of [-1, 1]) {
    const sh = V(sgn * 0.19, 1.45, 0), el = V(sgn * 0.215, 1.15, -0.02), wr = V(sgn * 0.22, 0.89, 0.03);
    joint(sh, 0.03); link(sh, el, 0.016); joint(el, 0.024);
    link(el, wr, 0.011); link(el.clone().add(V(sgn * 0.012, 0, 0.012)), wr.clone().add(V(sgn * 0.008, 0, 0.008)), 0.008);
    add(new THREE.BoxGeometry(0.055, 0.08, 0.018), wr.x, wr.y - 0.05, wr.z);
    for (let f = 0; f < 4; f++) add(new THREE.CylinderGeometry(0.005, 0.004, 0.07, 6), wr.x - 0.02 + f * 0.013, wr.y - 0.125, wr.z);
    const hip = V(sgn * 0.09, 0.93, 0), kn = V(sgn * 0.095, 0.51, 0.01), an = V(sgn * 0.09, 0.06, -0.01);
    joint(hip, 0.03); link(hip, kn, 0.02); joint(kn, 0.032);
    link(kn, an, 0.016); link(kn.clone().add(V(sgn * 0.02, 0, -0.01)), an.clone().add(V(sgn * 0.015, 0, -0.005)), 0.008);
    joint(an, 0.022); add(new THREE.BoxGeometry(0.075, 0.04, 0.2), an.x, 0.025, 0.07);
  }
  skull.rotation.z = 0.12; skull.rotation.x = 0.08;
  g.userData.height = 1.7;
  return g;
}
// Pop-in: the skeleton lunges from `from` to `to` (world) while growing to `scale`, then holds.
export function popIn(group, { from, to, scale = 1, yaw = 0, duration = 0.35 } = {}) {
  let t = 0;
  group.visible = true;
  group.rotation.y = yaw;
  group.position.copy(from); group.scale.setScalar(scale * 0.6);
  return {
    step(dt) {
      if (t >= 1) return false;
      t = Math.min(1, t + dt / duration);
      const k = easeInOut(t);
      group.position.lerpVectors(from, to, k);
      group.scale.setScalar(scale * (0.6 + 0.4 * k));
      return true;
    }
  };
}
