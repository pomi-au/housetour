/*
 * Sliding glass door: aluminium frame, a fixed glazed leaf and a sliding glazed leaf on the inner track.
 *
 *   createSlidingDoor({ width, height, depth, position, rotationDeg, materials, slide: 'L' | 'R' })
 *   -> Group; origin at the opening centre at floor level, x along the width, z across the wall.
 *   group.userData.fixture.toggle() slides the moving leaf over the fixed one; step(dt) animates it.
 * The frame fills the wall opening `width` x `height`. Wider openings get more panels (stackers), one moving.
 */
import * as THREE from 'three';
import { placeFixture, defaultMaterials, box, motion, easeInOut } from './common.js';

export const SLIDER_FRAME = { bar: 0.05, depth: 0.10, leafBar: 0.045, leafDepth: 0.035, glass: 0.006 };

export function createSlidingDoor({ width = 1.8, height = 2.1, depth = 0.23, position = [0, 0, 0], rotationDeg = 0, materials = defaultMaterials(), slide = 'L', duration = 1.2, label = '' } = {}) {
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
  const leafGroup = (x, z) => {
    const g = new THREE.Group(); g.position.set(x, f.bar, z);
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
    kind: 'sliding door', label, width, height, meshes, leaf: moving,
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
