/*
 * Sliding glass door: aluminium frame, a fixed glazed leaf and a sliding glazed leaf on the inner track.
 *
 *   createSlidingDoor({ width, height, depth, position, rotationDeg, materials, slide: 'L' | 'R', panel: 'glass' | 'mirror', mirrorSide })
 *   panel 'mirror' is the robe slider: solid painted leaves with a glossy 25 % planar mirror on the room side
 *   (mirrorSide = +1 for local +z). The mirrors are Reflectors the host renders itself (fixture.mirrors, each
 *   with userData.renderMirror), so reflections show one bounce and skip what the host hides.
 *   -> Group; origin at the opening centre at floor level, x along the width, z across the wall.
 *   group.userData.fixture.toggle() slides the moving leaf over the fixed one; step(dt) animates it.
 * The frame fills the wall opening `width` x `height`. Wider openings get more panels (stackers), one moving.
 */
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { placeFixture, defaultMaterials, box, motion, easeInOut } from './common.js';

export const SLIDER_FRAME = { bar: 0.05, depth: 0.10, leafBar: 0.045, leafDepth: 0.035, glass: 0.006 };

export function createSlidingDoor({ width = 1.8, height = 2.1, depth = 0.23, position = [0, 0, 0], rotationDeg = 0, materials = defaultMaterials(), slide = 'L', duration = 1.2, label = '', panel = 'glass', mirrorSide = 1, mirrorAlpha = 0.25 } = {}) {
  const group = placeFixture(new THREE.Group(), position, rotationDeg);
  const f = SLIDER_FRAME, w = width, h = height, d = Math.min(f.depth, depth);
  const meshes = [];
  const add = (parent, m) => { parent.add(m); meshes.push(m); return m; };
  add(group, box(w, f.bar, d, 0, f.bar / 2, 0, materials.frame));               // track
  add(group, box(w, f.bar, d, 0, h - f.bar / 2, 0, materials.frame));           // head
  add(group, box(f.bar, h - 2 * f.bar, d, -w / 2 + f.bar / 2, h / 2, 0, materials.frame));
  add(group, box(f.bar, h - 2 * f.bar, d, w / 2 - f.bar / 2, h / 2, 0, materials.frame));
  // Panels: two up to 3 m, then one more per 1.5 m. The moving leaf is the one at the `slide` end.
  const panels = Math.max(2, Math.ceil((w - 0.1) / 1.5));
  const inner = w - 2 * f.bar, panelW = inner / panels + 0.03, panelH = h - 2 * f.bar;
  const mirrors = [];
  const leafGroup = (x, z) => {
    const g = new THREE.Group(); g.position.set(x, f.bar, z); group.add(g);
    if (panel === 'mirror') {
      // Solid robe leaf in a slim frame, mirror glass on the room face.
      add(g, box(panelW, panelH, f.leafDepth, 0, panelH / 2, 0, materials.leaf || materials.sill));
      add(g, box(panelW, 0.02, f.leafDepth + 0.004, 0, 0.01, 0, materials.frame));
      add(g, box(panelW, 0.02, f.leafDepth + 0.004, 0, panelH - 0.01, 0, materials.frame));
      add(g, box(0.02, panelH, f.leafDepth + 0.004, -panelW / 2 + 0.01, panelH / 2, 0, materials.frame));
      add(g, box(0.02, panelH, f.leafDepth + 0.004, panelW / 2 - 0.01, panelH / 2, 0, materials.frame));
      const mirror = new Reflector(new THREE.PlaneGeometry(panelW - 0.05, panelH - 0.05), { textureWidth: 512, textureHeight: 512, clipBias: 0.003, color: 0xd8dcde });
      mirror.material.fragmentShader = mirror.material.fragmentShader.replace(/,\s*1\.0\s*\);/, `, ${mirrorAlpha.toFixed(2)} );`);
      mirror.material.transparent = true; mirror.material.depthWrite = false; mirror.renderOrder = 2;
      mirror.position.set(0, panelH / 2, mirrorSide * (f.leafDepth / 2 + 0.0015));
      if (mirrorSide < 0) mirror.rotation.y = Math.PI;
      mirror.userData.renderMirror = mirror.onBeforeRender;
      mirror.onBeforeRender = () => {};
      mirror.userData.fresh = false;
      g.add(mirror); mirrors.push(mirror);
      return g;
    }
    add(g, box(panelW, f.leafBar, f.leafDepth, 0, f.leafBar / 2, 0, materials.frame));
    add(g, box(panelW, f.leafBar, f.leafDepth, 0, panelH - f.leafBar / 2, 0, materials.frame));
    add(g, box(f.leafBar, panelH, f.leafDepth, -panelW / 2 + f.leafBar / 2, panelH / 2, 0, materials.frame));
    add(g, box(f.leafBar, panelH, f.leafDepth, panelW / 2 - f.leafBar / 2, panelH / 2, 0, materials.frame));
    const pane = add(g, box(panelW - 2 * f.leafBar, panelH - 2 * f.leafBar, f.glass, 0, panelH / 2, 0, materials.glass));
    pane.castShadow = false;
    return g;
  };
  const leaves = [];
  for (let i = 0; i < panels; i++) {
    const x = -inner / 2 + (inner / panels) * (i + 0.5);
    leaves.push(leafGroup(x, (i % 2 === 0 ? -1 : 1) * f.leafDepth * 0.6));
  }
  const movingIndex = slide === 'L' ? 0 : panels - 1;
  const moving = leaves[movingIndex];
  const rest = moving.position.x, travel = (slide === 'L' ? 1 : -1) * (inner / panels - 0.06);
  const m = motion(duration);
  const fixture = {
    kind: 'sliding door', label, width, height, meshes, leaf: moving, mirrors, panel,
    get open() { return m.open; }, get moving() { return m.moving; }, get progress() { return m.progress; },
    toggle() { m.set(!m.open); },
    step(dt) {
      if (!m.advance(dt)) return false;
      moving.position.x = rest + travel * easeInOut(m.progress);
      return true;
    }
  };
  group.userData.fixture = fixture;
  return group;
}
