/*
 * Window: aluminium frame with a glass pane, a mullion every 0.9 m of width, and a sill board.
 *
 *   createWindow({ width, height, depth, position, rotationDeg, materials })
 *   -> Group; origin at the opening centre at sill level, x along the width, z across the wall.
 * The frame fills the wall opening `width` x `height` exactly. Not operable.
 */
import * as THREE from 'three';
import { placeFixture, defaultMaterials, box } from './common.js';

export const WINDOW_FRAME = { bar: 0.05, depth: 0.10, glass: 0.006, sill: 0.03 };

export function createWindow({ width = 1.2, height = 1.2, depth = 0.23, position = [0, 0, 0], rotationDeg = 0, materials = defaultMaterials(), label = '' } = {}) {
  const group = placeFixture(new THREE.Group(), position, rotationDeg);
  const f = WINDOW_FRAME, w = width, h = height, d = Math.min(f.depth, depth);
  const meshes = [];
  const add = m => { group.add(m); meshes.push(m); return m; };
  add(box(w, f.bar, d, 0, f.bar / 2, 0, materials.frame));                    // bottom rail
  add(box(w, f.bar, d, 0, h - f.bar / 2, 0, materials.frame));                // head
  add(box(f.bar, h - 2 * f.bar, d, -w / 2 + f.bar / 2, h / 2, 0, materials.frame));   // jambs
  add(box(f.bar, h - 2 * f.bar, d, w / 2 - f.bar / 2, h / 2, 0, materials.frame));
  const bays = Math.max(1, Math.round(w / 0.9));
  for (let i = 1; i < bays; i++) add(box(0.04, h - 2 * f.bar, d, -w / 2 + (w / bays) * i, h / 2, 0, materials.frame));
  const pane = add(box(w - 2 * f.bar, h - 2 * f.bar, f.glass, 0, h / 2, 0, materials.glass));
  pane.castShadow = false;
  // Sill board on the inside face (local -z) and a drip on the outside.
  add(box(w + 0.08, f.sill, 0.12, 0, -f.sill / 2, -depth / 2 - 0.04, materials.sill));
  group.userData.fixture = { kind: 'window', label, width, height, meshes, moving: false, open: false };
  return group;
}
