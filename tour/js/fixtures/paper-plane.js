/*
 * Paper plane: a small folded dart (three.js primitives, no assets) for the fly-around mode.
 *
 *   createPaperPlane({ span = 0.26, length = 0.30, materials }) -> Group; nose toward local -z, wings in the
 *   x/z plane folded up a little, a keel below. group.userData.bank(angle) rolls it.
 */
import * as THREE from 'three';

export function createPaperPlane({ span = 0.26, length = 0.30, materials = {} } = {}) {
  const paper = materials.paper || new THREE.MeshStandardMaterial({ color: 0xf7f6f1, emissive: 0x8e8c86, roughness: 0.85, metalness: 0, side: THREE.DoubleSide });
  const shade = materials.shade || new THREE.MeshStandardMaterial({ color: 0xe4e2dc, emissive: 0x6e6c66, roughness: 0.85, metalness: 0, side: THREE.DoubleSide });
  const group = new THREE.Group();
  const nose = new THREE.Vector3(0, 0, -length / 2), tail = length / 2, dihedral = 0.16;
  const tri = (a, b, c, material) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, material);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  };
  // Two wings from the nose to the trailing tips, rising toward the tips; inner panels along the fold; a keel.
  for (const s of [-1, 1]) {
    const tip = new THREE.Vector3(s * span / 2, dihedral * span / 2, tail);
    const root = new THREE.Vector3(0, 0, tail);
    tri(nose, tip, root, s > 0 ? paper : shade);
    const inner = new THREE.Vector3(s * span * 0.12, -0.02, tail);
    tri(nose, root, inner, shade);
  }
  tri(nose, new THREE.Vector3(0, 0, tail), new THREE.Vector3(0, -0.045, tail * 0.9), shade);   // keel
  group.userData.bank = angle => { group.rotation.z = angle; };
  return group;
}
