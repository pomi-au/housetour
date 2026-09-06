/*
 * Shared helpers for the fixture modules (hinged door, window, sliding door).
 *
 * Every fixture is a function that returns a three.js Group placed by `position` and `rotationDeg`:
 *   local x runs along the opening width, y up, z across the wall; the origin is the opening centre at sill level.
 *   rotationDeg 0 = width along world x, 90 = width along world -z (plan +y), as the house model's rotation_deg.
 * Operable fixtures carry `group.userData.fixture = { kind, toggle(sideSign), step(dt), moving, open }`.
 */
import * as THREE from 'three';

export function placeFixture(group, position = [0, 0, 0], rotationDeg = 0) {
  group.position.set(position[0], position[1], position[2]);
  group.rotation.set(0, THREE.MathUtils.degToRad(rotationDeg), 0);
  return group;
}

// Default surfaces, replaced by the caller's own materials (the viewer passes the tour's finishes).
export function defaultMaterials() {
  return {
    frame: new THREE.MeshStandardMaterial({ color: 0x2b2e30, roughness: 0.35, metalness: 0.6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.6 }),
    sill: new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.6 }),
    paint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }),
    metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.28, metalness: 0.92 })
  };
}

// A box mesh centred at (x, y, z) with the fixture's shadow flags; the BVH is built when three-mesh-bvh is patched in.
export function box(w, h, d, x, y, z, material) {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.computeBoundsTree?.();
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Motion state shared by the operable fixtures: progress 0..1 runs toward target over `duration` seconds.
export function motion(duration = 0.9) {
  return {
    open: false, progress: 0, target: 0, moving: false, duration,
    set(open) { this.open = open; this.target = open ? 1 : 0; this.moving = true; },
    advance(dt) {
      if (!this.moving) return false;
      const step = dt / this.duration;
      this.progress = this.target > this.progress ? Math.min(this.target, this.progress + step) : Math.max(this.target, this.progress - step);
      if (this.progress === this.target) this.moving = false;
      return true;
    }
  };
}
