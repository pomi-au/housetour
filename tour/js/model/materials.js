/*
 * Materials and procedural textures, the tour's surface set (tour.js) as a reusable factory.
 *
 *   const mats = createMaterials({ renderer, glassStrength: 2.4 });
 *   mats.materialFor('clear_brick', spec, 'facebrick')   -> MeshStandardMaterial by material family and finish
 *   mats.fixtures                                        -> { frame, glass, sill, paint, metal } for the fixture modules
 *   mats.grassTexture(), mats.streetTexture(), mats.lightPoolTexture()
 *   mats.setGlass(strength)                              -> window reflection strength on every glass material
 *
 * Every texture is a canvas generated at run time: no image files, no embedded data.
 */
import * as THREE from 'three';

const PHYSICAL_ONLY = ['clearcoat', 'clearcoatRoughness', 'sheen', 'sheenRoughness', 'specularIntensity', 'transmission', 'thickness', 'ior', 'reflectivity'];

export function createMaterials({ renderer, physical = false, glassStrength = 2.4, patch = null } = {}) {
  const maxAniso = renderer ? renderer.capabilities.getMaxAnisotropy() : 1;
  const reliefTextures = {}, albedoTextures = {}, surfaceTextures = {};
  const glassMaterials = [];
  let glass = glassStrength;

  // Flat surfaces need none of the physical layers: the standard shader draws them the same for less work.
  // `patch(material, surface)` (the room mask of model/lighting.js) is applied to every material made here;
  // surface 'floor' or 'wall' picks the direct-light scale the tour's sliders drive.
  function surfaceMaterial(params, surface = 'wall') {
    const m = physical ? new THREE.MeshPhysicalMaterial(params) : new THREE.MeshStandardMaterial((() => { const p = { ...params }; for (const k of PHYSICAL_ONLY) delete p[k]; return p; })());
    return patch ? patch(m, surface) : m;
  }

  // Procedural relief maps: fine fibre grain for carpet, soft plaster for walls, coarse grain for render.
  function reliefTexture(name, size, passes) {
    if (reliefTextures[name]) return reliefTextures[name];
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, size, size);
    let seed = name.length * 7919;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (const [count, radius, strength] of passes) {
      for (let i = 0; i < count; i++) {
        const v = Math.round(128 + (rnd() - 0.5) * 2 * strength);
        ctx.fillStyle = `rgba(${v},${v},${v},0.5)`;
        ctx.beginPath(); ctx.arc(rnd() * size, rnd() * size, radius * (0.5 + rnd()), 0, Math.PI * 2); ctx.fill();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = maxAniso;
    reliefTextures[name] = t;
    return t;
  }
  // Faint colour map built from a relief map so the grain stays visible under flat light.
  function albedoFromRelief(relief, mean, depth) {
    const key = `${mean}|${depth}|${relief.uuid}`;
    if (albedoTextures[key]) return albedoTextures[key];
    const src = relief.image, size = src.width;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d');
    const d = src.getContext('2d').getImageData(0, 0, size, size).data;
    const o = ctx.createImageData(size, size);
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.max(0, Math.min(255, Math.round(mean + (d[i] - 128) * depth)));
      o.data[i] = o.data[i + 1] = o.data[i + 2] = v; o.data[i + 3] = 255;
    }
    ctx.putImageData(o, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.repeat.copy(relief.repeat);
    albedoTextures[key] = t;
    return t;
  }
  const renderRelief = () => reliefTexture('render', 512, [[9000, 3, 120], [3000, 6, 90], [800, 14, 60]]);
  const paintRelief = () => { const t = reliefTexture('paint', 512, [[4000, 10, 70], [12000, 4, 60], [30000, 1.5, 50]]); t.repeat.set(1.5, 1.5); return t; };
  const carpetRelief = () => { const t = reliefTexture('carpet', 512, [[20000, 1.5, 120], [6000, 3, 100], [2500, 6, 90], [600, 12, 70]]); t.repeat.set(3, 3); return t; };

  const common = { side: THREE.DoubleSide };   // model winding is not guaranteed; both faces light correctly
  // The tour's finishes, one function each, reusable on their own.
  const finishes = {
    concrete: (spec) => { const b = renderRelief(); return surfaceMaterial({ ...common, color: 0x9e9c97, roughness: spec?.roughness ?? 0.9, metalness: spec?.metalness ?? 0, envMapIntensity: 0.3, map: albedoFromRelief(b, 250, 0.4), bumpMap: b, bumpScale: 0.10 }, 'floor'); },
    ceiling: () => surfaceMaterial({ ...common, color: 0xe6e3dd, roughness: 1.0, metalness: 0, envMapIntensity: 0.15 }),
    brick: (spec) => { const b = renderRelief(); return surfaceMaterial({ ...common, color: 0xa86a5a, roughness: spec?.roughness ?? 0.95, metalness: 0, envMapIntensity: 0.3, map: albedoFromRelief(b, 250, 0.4), bumpMap: b, bumpScale: 0.10 }); },
    render: () => { const b = renderRelief(); return surfaceMaterial({ ...common, color: 0xe9e4da, roughness: 0.95, metalness: 0, envMapIntensity: 0.3, map: albedoFromRelief(b, 250, 0.4), bumpMap: b, bumpScale: 0.10 }); },
    paint: (spec) => { const b = paintRelief(); return surfaceMaterial({ ...common, color: new THREE.Color(1.06, 1.06, 1.06), roughness: spec?.roughness ?? 0.86, metalness: spec?.metalness ?? 0, envMapIntensity: 0.4, map: albedoFromRelief(b, 251, 0.12), bumpMap: b, bumpScale: 0.045 }); },
    carpet: () => { const b = carpetRelief(); return surfaceMaterial({ ...common, roughness: 1, metalness: 0, envMapIntensity: 0.25, map: albedoFromRelief(b, 240, 0.9), bumpMap: b, bumpScale: 0.08 }, 'floor'); },
    tile: (spec) => surfaceMaterial({ ...common, color: 0xdedbd4, roughness: spec?.roughness ?? 0.18, metalness: 0, envMapIntensity: 0.6 }, 'floor'),
    timber: (spec) => surfaceMaterial({ ...common, color: 0xb48a58, roughness: spec?.roughness ?? 0.55, metalness: 0, envMapIntensity: 0.35 }),
    metal: (spec) => surfaceMaterial({ ...common, color: 0xb9bcbf, roughness: spec?.roughness ?? 0.28, metalness: spec?.metalness ?? 0.92, envMapIntensity: 1.2 }),
    roof: () => surfaceMaterial({ ...common, color: 0x5f6468, roughness: 0.55, metalness: 0.35, envMapIntensity: 0.6 }),
    fascia: () => surfaceMaterial({ ...common, color: 0xf2f0ea, roughness: 0.5, metalness: 0, envMapIntensity: 0.35 }),
    glass: () => {
      const m = new THREE.MeshPhysicalMaterial({ ...common, color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.6, specularIntensity: 1.0 });
      m.userData.baseEnv = 1.0; m.envMapIntensity = glass; glassMaterials.push(m); return patch ? patch(m, 'wall') : m;
    }
  };
  // Finish by material family, library id, finish word and key.
  function finishFor(key, spec, finish) {
    const family = `${finish || ''} ${spec?.library_material_family || ''} ${spec?.library_material_id || ''} ${key}`.toLowerCase();
    if (/roof_sheet|colorbond|roofing/.test(family)) return 'roof';
    if (/fascia|gutter/.test(family)) return 'fascia';
    if (/glass|glazing/.test(family)) return 'glass';
    if (/metal|steel|alumin|zinc/.test(family)) return 'metal';
    if (/timber|wood|pine|hardwood|joist|stud/.test(family)) return 'timber';
    if (/carpet/.test(family)) return 'carpet';
    if (/tile|ceramic|porcelain/.test(family)) return 'tile';
    if (/^render\b/.test(family)) return 'render';
    if (/brick|masonry|block/.test(family)) return 'brick';
    if (/concrete|slab|footing|cement|screed/.test(family)) return 'concrete';
    return 'paint';
  }
  const cache = new Map();
  function materialFor(key, spec, finish) {
    const cacheKey = `${key}|${finish || ''}|${JSON.stringify(spec || null)}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const m = finishes[finishFor(key, spec, finish)](spec);
    if (spec && spec.opaque === false && !m.transparent) { m.transparent = true; m.opacity = 0.5; m.depthWrite = false; }
    cache.set(cacheKey, m);
    return m;
  }
  function setGlass(strength) { glass = strength; for (const m of glassMaterials) m.envMapIntensity = m.userData.baseEnv * glass; }

  // Fixture surfaces: dark aluminium frames, clear glass, painted sill; vertex-coloured paint and metal for the door model.
  const fixtures = {
    frame: surfaceMaterial({ color: 0x2b2e30, roughness: 0.35, metalness: 0.6, envMapIntensity: 0.8 }),
    glass: finishes.glass(),
    sill: surfaceMaterial({ color: 0xe8e4dc, roughness: 0.6, metalness: 0, envMapIntensity: 0.35 }),
    paint: surfaceMaterial({ vertexColors: true, roughness: 0.55, metalness: 0, clearcoat: 0.08, clearcoatRoughness: 0.5, envMapIntensity: 0.4 }),
    leaf: surfaceMaterial({ color: 0xf4f2ee, roughness: 0.35, metalness: 0, envMapIntensity: 0 }),
    metal: surfaceMaterial({ vertexColors: true, roughness: 0.28, metalness: 0.92, envMapIntensity: 1.2 })
  };

  // Ground surfaces: grass, asphalt with a dashed centre line, a lamp light pool.
  function grassTexture() {
    if (surfaceTextures.grass) return surfaceTextures.grass;
    const size = 512, cv = document.createElement('canvas'); cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#4f6a2f'; ctx.fillRect(0, 0, size, size);
    let seed = 4242; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 26000; i++) {
      const g = 90 + Math.floor(rnd() * 70), r = 55 + Math.floor(rnd() * 40), b = 25 + Math.floor(rnd() * 30);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`; ctx.lineWidth = 1 + rnd() * 1.5;
      const x = rnd() * size, y = rnd() * size, h = 4 + rnd() * 9, dx = (rnd() - 0.5) * 4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y - h); ctx.stroke();
    }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(200, 200); t.anisotropy = maxAniso;
    surfaceTextures.grass = t; return t;
  }
  function streetTexture() {
    if (surfaceTextures.street) return surfaceTextures.street;
    const w = 256, h = 256, cv = document.createElement('canvas'); cv.width = w; cv.height = h;   // one tile = 6 m x 5.5 m
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#3b3b3d'; ctx.fillRect(0, 0, w, h);
    let seed = 99; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 9000; i++) { const v = 45 + Math.floor(rnd() * 40); ctx.fillStyle = `rgba(${v},${v},${v + 3},0.6)`; ctx.fillRect(rnd() * w, rnd() * h, 2, 2); }
    ctx.fillStyle = '#d9d2b0'; ctx.fillRect(w * 0.1, h / 2 - 3, w * 0.5, 6);
    ctx.fillStyle = '#cfcfcf'; ctx.fillRect(0, 2, w, 3); ctx.fillRect(0, h - 5, w, 3);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(320 / 6, 1); t.anisotropy = maxAniso;
    surfaceTextures.street = t; return t;
  }
  // Pre-rendered street lamp light: one map over the whole streetscape, every lamp head (height h, warm) added
  // with an inverse-square falloff and the cosine of incidence on the ground, so pools overlap and sum as real
  // light would. Rendered once at build time into a canvas; no lights at run time.
  function lampLightMap(lamps, { size = 2048, extent = 320, height = 4.9, power = 55, reach = 16 } = {}) {
    const cv = document.createElement('canvas'); cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(size, size), d = img.data;
    const mpp = extent / size, r = Math.ceil(reach / mpp);
    const acc = new Float32Array(size * size);
    for (const l of lamps) {
      const cx = (l.x + extent / 2) / mpp, cy = (l.z + extent / 2) / mpp;
      const i0 = Math.max(0, Math.floor(cx - r)), i1 = Math.min(size - 1, Math.ceil(cx + r)), j0 = Math.max(0, Math.floor(cy - r)), j1 = Math.min(size - 1, Math.ceil(cy + r));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const dx = (i - cx) * mpp, dz = (j - cy) * mpp, d2 = dx * dx + dz * dz;
        if (d2 > reach * reach) continue;
        const dist2 = d2 + height * height;
        acc[j * size + i] += power * height / (dist2 * Math.sqrt(dist2));   // E = P cos(theta) / r^2
      }
    }
    for (let k = 0; k < size * size; k++) {
      const v = 1 - Math.exp(-acc[k]);                                       // soft roll-off into white
      d[k * 4] = Math.round(255 * v); d[k * 4 + 1] = Math.round(210 * v); d[k * 4 + 2] = Math.round(138 * v); d[k * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = maxAniso;
    t.userData.extent = extent;
    return t;
  }
  function lightPoolTexture() {
    if (surfaceTextures.pool) return surfaceTextures.pool;
    const size = 128, cv = document.createElement('canvas'); cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(cv); surfaceTextures.pool = t; return t;
  }

  return { surfaceMaterial, reliefTexture, albedoFromRelief, finishes, finishFor, materialFor, setGlass, glassMaterials, fixtures, grassTexture, streetTexture, lightPoolTexture, lampLightMap };
}
