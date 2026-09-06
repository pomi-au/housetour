/*
 * Plan model viewer (model.html).
 *
 * Loads building model JSON files and shows them the way tour.html shows the residence. Files can be combined:
 * slab and footing (foma.005_01, triangle meshes), wall envelopes (foma.005_03, triangle meshes per segment) and
 * the roof envelope (foma.005_02, planar underside surfaces and eave lines, built here into thin roof prisms and
 * fascia boards). Any file whose entries carry mesh.vertices_m / mesh.triangle_indices loads too. The view is
 * a bird's-eye overview that opens as a plan view and turns over into the isometric view, then a first-person
 * walk when a floor is clicked. Render settings, procedural textures, daylight, floor reflection, lawn, streets
 * and street lamps are the tour's; there is no neighbourhood.
 *
 * Coordinates: JSON x, y are plan metres, z is up. Here x -> x, z -> y, y -> -z, centred on the model footprint.
 * Build: cd tour/build && npm run build   ->  tour/js/plan.bundle.js
 */
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

(() => {
  'use strict';

  // ---------------------------------------------------------------- constants (as tour.js)
  const EYE_HEIGHT = 1.70;
  const PLAYER_RADIUS = 0.28;
  const STEP_MAX = 0.30;
  const WALK_SPEED = 1.45, RUN_SPEED = 2.8;
  const GRAVITY = 9.81;
  const TOUCH = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const RENDER = { dpr: TOUCH ? 1 : 1.25, reflection: 0.3, reflectEvery: 2, sunShadow: 1024, lessOften: true, direct: true };
  const TUNE_DEFAULTS = { power: 9, floor: 0.6, wall: 1.0, base: 1.0, exposure: 0.5, hour: 14, clock: 1, glass: 2.4, halo: 0.15 };
  const SIM_SECONDS_PER_REAL_SECOND = 3600 / 2.5;
  const TUNE_KEY = 'residence.tour.lighting.v1';   // shared with tour.html, so both pages show the same light
  const tune = { ...TUNE_DEFAULTS };
  try { Object.assign(tune, JSON.parse(localStorage.getItem(TUNE_KEY) || '{}')); } catch (_) { /* no storage */ }
  tune.clock = 1;
  const glassMaterials = [];
  const BASE_FOV = 68;
  let zoomTarget = 1, zoomLevel = 1;
  const GROUND_BELOW_FLOOR = 0.15;   // lawn surface below the slab top, as the tour's ground sits below its floor datum

  // ---------------------------------------------------------------- DOM
  const body = document.body;
  const tourCanvas = document.getElementById('tour-scene');
  const hint = document.getElementById('tour-hint');
  const stats = document.getElementById('tour-stats');
  const crosshair = document.getElementById('tour-crosshair');
  const loading = document.getElementById('tour-loading');
  const exitButton = document.getElementById('tour-exit');
  const tunePanel = document.getElementById('tour-tune');
  const loadPanel = document.getElementById('plan-load');
  const loadStatus = document.getElementById('plan-status');
  const fileInput = document.getElementById('plan-file');
  const openButton = document.getElementById('plan-open');
  const modelName = document.getElementById('plan-name');

  body.dataset.touch = TOUCH ? 'true' : 'false';
  const OVERVIEW_HINT = TOUCH ? 'Tap the floor to walk on it · drag to orbit · pinch to zoom' : 'Click the floor to walk on it · drag to orbit · scroll to zoom · right-drag to pan';
  const WALK_HINT = TOUCH ? 'Drag to look · pinch to zoom · buttons walk' : '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Shift</kbd> run · mouse look · <kbd>T</kbd> lighting · <kbd>Esc</kbd> exit';

  let mode = 'overview';
  let hintTimer = 0;
  function showHint(html, autoHide = true) {
    hint.innerHTML = html;
    hint.dataset.hidden = 'false';
    clearTimeout(hintTimer);
    if (autoHide) hintTimer = setTimeout(() => { hint.dataset.hidden = 'true'; }, 7000);
  }

  // ---------------------------------------------------------------- renderer (as tour.js)
  const renderer = new THREE.WebGLRenderer({ canvas: tourCanvas, antialias: true, powerPreference: 'high-performance', stencil: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.08, 1200);
  camera.rotation.order = 'YXZ';
  const scene = new THREE.Scene();
  {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.3;
    pmrem.dispose();
  }
  const envTarget = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, type: THREE.HalfFloatType });
  const envCamera = new THREE.CubeCamera(0.1, 60, envTarget);
  let envFrame = 0;

  function applyQuality() {
    const dpr = Math.min(window.devicePixelRatio || 1, RENDER.dpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
    world.sun.shadow.mapSize.set(RENDER.sunShadow, RENDER.sunShadow); world.sun.shadow.map?.dispose(); world.sun.shadow.map = null;
    if (built) built.reflector.getRenderTarget().setSize(Math.max(2, Math.round(w * RENDER.reflection)), Math.max(2, Math.round(h * RENDER.reflection)));
    renderer.shadowMap.needsUpdate = true;
  }
  window.addEventListener('resize', applyQuality);

  // ---------------------------------------------------------------- procedural textures (as tour.js)
  const reliefTextures = {};
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
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    reliefTextures[name] = t;
    return t;
  }
  const albedoTextures = {};
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
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.repeat.copy(relief.repeat);
    albedoTextures[key] = t;
    return t;
  }
  const surfaceTextures = {};
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
    t.repeat.set(200, 200); t.anisotropy = renderer.capabilities.getMaxAnisotropy();
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
    t.repeat.set(320 / 6, 1); t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    surfaceTextures.street = t; return t;
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

  // ---------------------------------------------------------------- materials (the tour's surface set, keyed by material family)
  const PHYSICAL_ONLY = ['clearcoat', 'clearcoatRoughness', 'sheen', 'sheenRoughness', 'specularIntensity', 'transmission', 'thickness', 'ior', 'reflectivity'];
  function surfaceMaterial(params) {
    const p = { ...params }; for (const k of PHYSICAL_ONLY) delete p[k];
    return new THREE.MeshStandardMaterial(p);
  }
  const materialCache = new Map();
  function materialFor(key, spec, usage) {
    const cacheKey = key + '|' + JSON.stringify(spec || null);
    if (materialCache.has(cacheKey)) return materialCache.get(cacheKey);
    const family = `${spec?.library_material_family || ''} ${spec?.library_material_id || ''} ${usage?.semanticClass || ''} ${key}`.toLowerCase();
    const rough = Number.isFinite(spec?.roughness) ? spec.roughness : null;
    const metal = Number.isFinite(spec?.metalness) ? spec.metalness : null;
    const common = { side: THREE.DoubleSide };   // JSON winding is not guaranteed; both faces light correctly
    let m;
    if (/roof_sheet|colorbond|roofing/.test(family)) {
      m = surfaceMaterial({ ...common, color: 0x5f6468, roughness: 0.55, metalness: 0.35, envMapIntensity: 0.6 });
    } else if (/fascia|gutter/.test(family)) {
      m = surfaceMaterial({ ...common, color: 0xf2f0ea, roughness: 0.5, metalness: 0, envMapIntensity: 0.35 });
    } else if (/glass|glazing/.test(family)) {
      m = new THREE.MeshPhysicalMaterial({ ...common, color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.6, specularIntensity: 1.0 });
      m.userData.baseEnv = 1.0; m.envMapIntensity = tune.glass; glassMaterials.push(m);
    } else if (/metal|steel|alumin|colorbond|zinc/.test(family)) {
      m = surfaceMaterial({ ...common, color: 0xb9bcbf, roughness: rough ?? 0.28, metalness: metal ?? 0.92, envMapIntensity: 1.2 });
    } else if (/timber|wood|pine|hardwood|joist|stud/.test(family)) {
      m = surfaceMaterial({ ...common, color: 0xb48a58, roughness: rough ?? 0.55, metalness: 0, envMapIntensity: 0.35 });
    } else if (/carpet/.test(family)) {
      const bumpMap = reliefTexture('carpet', 512, [[20000, 1.5, 120], [6000, 3, 100], [2500, 6, 90], [600, 12, 70]]);
      bumpMap.repeat.set(3, 3);
      m = surfaceMaterial({ ...common, roughness: 1, metalness: 0, envMapIntensity: 0.25, map: albedoFromRelief(bumpMap, 240, 0.9), bumpMap, bumpScale: 0.08 });
    } else if (/tile|ceramic|porcelain/.test(family)) {
      m = surfaceMaterial({ ...common, color: 0xdedbd4, roughness: rough ?? 0.18, metalness: 0, envMapIntensity: 0.6 });
    } else if (/brick|masonry|block/.test(family)) {
      const bumpMap = reliefTexture('render', 512, [[9000, 3, 120], [3000, 6, 90], [800, 14, 60]]);
      m = surfaceMaterial({ ...common, color: 0xa86a5a, roughness: rough ?? 0.95, metalness: 0, envMapIntensity: 0.3, map: albedoFromRelief(bumpMap, 250, 0.4), bumpMap, bumpScale: 0.10 });
    } else if (/concrete|slab|footing|cement|screed|render/.test(family)) {
      // Concrete: the tour's rendered-wall relief over a grey base, roughness from the file.
      const bumpMap = reliefTexture('render', 512, [[9000, 3, 120], [3000, 6, 90], [800, 14, 60]]);
      m = surfaceMaterial({ ...common, color: 0x9e9c97, roughness: rough ?? 0.9, metalness: metal ?? 0, envMapIntensity: 0.3, map: albedoFromRelief(bumpMap, 250, 0.4), bumpMap, bumpScale: 0.10 });
    } else {
      // Anything else: the tour's painted wall finish.
      const bumpMap = reliefTexture('paint', 512, [[4000, 10, 70], [12000, 4, 60], [30000, 1.5, 50]]);
      bumpMap.repeat.set(1.5, 1.5);
      m = surfaceMaterial({ ...common, color: new THREE.Color(1.06, 1.06, 1.06), roughness: rough ?? 0.86, metalness: metal ?? 0, envMapIntensity: 0.4, map: albedoFromRelief(bumpMap, 251, 0.12), bumpMap, bumpScale: 0.045 });
    }
    if (spec && spec.opaque === false && !m.transparent) { m.transparent = true; m.opacity = 0.5; m.depthWrite = false; }
    materialCache.set(cacheKey, m);
    return m;
  }

  // ---------------------------------------------------------------- model JSON -> meshes
  // Every object in the file that carries a triangle mesh becomes one solid, whatever list it sits in.
  // A wall segment carries no material of its own: the key is inherited from the enclosing wall envelope.
  function collectSolids(json) {
    const out = [];
    const visit = (node, path, material) => {
      if (Array.isArray(node)) { node.forEach(n => visit(n, path, material)); return; }
      if (!node || typeof node !== 'object') return;
      const mat = node.material_key || material;
      const mesh = node.mesh;
      if (mesh && Array.isArray(mesh.vertices_m) && Array.isArray(mesh.triangle_indices)) {
        out.push({ id: node.slab_id || node.footing_id || node.segment_id || node.wall_leaf_id || node.component_id || node.id || path, list: path, material: mat || 'default', mesh, top: node.top_z_m, bottom: node.bottom_z_m });
        return;
      }
      for (const [k, v] of Object.entries(node)) if (k !== 'inputs' && k !== 'material_library' && k !== 'artifacts') visit(v, path ? `${path}.${k}` : k, mat);
    };
    visit(json, '', null);
    return out.concat(roofSolids(json));
  }
  // A closed prism over a plan polygon (no holes) between two height functions, as a JSON-frame mesh.
  function prismSolid(id, list, material, contour, zTop, zBot) {
    const pts = contour.map(([x, y]) => new THREE.Vector2(x, y));
    if (THREE.ShapeUtils.isClockWise(pts)) pts.reverse();
    const tris = THREE.ShapeUtils.triangulateShape(pts, []);
    const n = pts.length, vertices_m = [], triangle_indices = [];
    for (const p of pts) vertices_m.push([p.x, p.y, zTop(p.x, p.y)]);
    for (const p of pts) vertices_m.push([p.x, p.y, zBot(p.x, p.y)]);
    for (const [a, b, c] of tris) { triangle_indices.push([a, b, c]); triangle_indices.push([n + a, n + c, n + b]); }
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; triangle_indices.push([i, n + i, n + j]); triangle_indices.push([i, n + j, j]); }
    return { id, list, material, mesh: { vertices_m, triangle_indices } };
  }
  // Roof envelope (foma.005_02): each underside surface is a plane z = gx*x + gy*y + intercept over its outline.
  // The sheet is drawn as a 50 mm prism on that plane; every eave height line gets a fascia board.
  const ROOF_SHEET = 0.05, FASCIA_DEPTH = 0.18, FASCIA_THICK = 0.03;
  function roofSolids(json) {
    const out = [];
    for (const sf of json.roof_underside_envelope?.surfaces || []) {
      const poly = sf.polygon_model_xy_m;
      if (!Array.isArray(poly) || poly.length < 3 || !Array.isArray(sf.gradient_xy)) continue;
      const [gx, gy] = sf.gradient_xy, c = Number(sf.intercept) || 0, nz = Number(sf.normal_z) || 1, thk = Number(sf.sheet_thickness_m) || 0;
      const under = (x, y) => gx * x + gy * y + c - nz * thk;
      out.push(prismSolid(sf.surface_id || 'roof', 'roof_underside_envelope.surfaces', 'roof_sheet', poly, (x, y) => under(x, y) + ROOF_SHEET, under));
    }
    for (const e of json.eave_height_lines || []) {
      const seg = e.segment_model_xyz_m;
      if (!Array.isArray(seg) || seg.length !== 2) continue;
      const [a, b] = seg, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      if (len < 1e-4) continue;
      const nx = -dy / len * FASCIA_THICK / 2, ny = dx / len * FASCIA_THICK / 2;
      const contour = [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
      const zAt = (x, y) => a[2] + (b[2] - a[2]) * ((x - a[0]) * dx + (y - a[1]) * dy) / (len * len);
      out.push(prismSolid(e.eave_height_line_id || 'eave', 'eave_height_lines', 'fascia', contour, (x, y) => zAt(x, y) + 0.02, (x, y) => zAt(x, y) - FASCIA_DEPTH));
    }
    return out;
  }

  // ---------------------------------------------------------------- static world: sky, sun, lawn, streets
  const world = {};
  const worldRoot = new THREE.Group();
  scene.add(worldRoot);
  {
    const sunDir = new THREE.Vector3(0.48, 0.82, 0.31).normalize();
    const sun = new THREE.DirectionalLight(0xfff0d1, 3.4);
    sun.position.copy(sunDir).multiplyScalar(45);
    sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 5, far: 100 });
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.22; sun.shadow.radius = 6; sun.shadow.blurSamples = 12;
    sun.shadow.autoUpdate = false;
    worldRoot.add(sun, sun.target);
    const moon = new THREE.Mesh(new THREE.SphereGeometry(12, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.93, 1.0), fog: false }));
    moon.visible = false;
    worldRoot.add(moon);
    const hemi = new THREE.HemisphereLight(new THREE.Color(0.42, 0.52, 0.72), new THREE.Color(0.30, 0.29, 0.26), 2.8);
    const ambient = new THREE.AmbientLight(new THREE.Color(0.26, 0.25, 0.24), 0);
    worldRoot.add(hemi, ambient);
    const sky = new Sky();
    sky.scale.setScalar(4000);
    const su = sky.material.uniforms;
    su.turbidity.value = 4; su.rayleigh.value = 1.6; su.mieCoefficient.value = 0.004; su.mieDirectionalG.value = 0.8;
    su.sunPosition.value.copy(sunDir);
    worldRoot.add(sky);
    const grass = grassTexture();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), surfaceMaterial({ map: grass, bumpMap: grass, bumpScale: 0.03, roughness: 1, metalness: 0, color: 0xffffff }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    worldRoot.add(ground);
    Object.assign(world, { sun, moon, hemi, ambient, sky, ground, houseCenter: new THREE.Vector3(), daylight: 1, streetscape: null, groundY: 0 });
  }

  // Streets between the lots, street lamps lit at dusk, and a hedge around our lot with a driveway gap on the
  // north side. The lot pitch grows with the model so the streets clear it. Nothing here collides, casts or reflects.
  function buildStreetscape(root, lot, groundY) {
    const m = new THREE.Matrix4(), c = new THREE.Color();
    const seedRnd = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };
    const pitch = Math.max(24, Math.ceil(Math.max(lot.x1 - lot.x0, lot.z1 - lot.z0) + 8));
    const asphalt = new THREE.MeshLambertMaterial({ map: streetTexture(), color: 0xffffff });
    const streetLen = 320, streetW = 5.5;
    const streetGeo = new THREE.PlaneGeometry(streetLen, streetW); streetGeo.rotateX(-Math.PI / 2);
    const streets = [];
    for (let k = -6; k <= 5; k++) streets.push({ x: 0, z: k * pitch + pitch / 2, along: 'x' });
    for (let k = -6; k <= 5; k++) streets.push({ x: k * pitch + pitch / 2, z: 0, along: 'z' });
    const streetMesh = new THREE.InstancedMesh(streetGeo, asphalt, streets.length);
    streets.forEach((st, k) => { m.makeRotationY(st.along === 'x' ? 0 : Math.PI / 2); m.setPosition(st.x, groundY + 0.02, st.z); streetMesh.setMatrixAt(k, m); });
    streetMesh.receiveShadow = true; streetMesh.frustumCulled = false; streetMesh.raycast = () => {};
    root.add(streetMesh);

    const lampPos = [];
    for (let k = -6; k <= 5; k++) for (let i = -6; i <= 6; i++) lampPos.push({ x: i * pitch, z: k * pitch + pitch / 2 + streetW / 2 + 0.6 });
    const pole = new THREE.CylinderGeometry(0.05, 0.08, 5.0, 8); pole.translate(0, 2.5, 0);
    const arm = new THREE.BoxGeometry(0.08, 0.08, 1.4); arm.translate(0, 4.95, -0.7);
    const lampGeo = mergeGeometries([pole, arm]);
    const lamps = new THREE.InstancedMesh(lampGeo, new THREE.MeshLambertMaterial({ color: 0x3a3d40 }), lampPos.length);
    const headGeo = new THREE.BoxGeometry(0.55, 0.16, 0.32); headGeo.translate(0, 4.9, -1.35);
    const heads = new THREE.InstancedMesh(headGeo, new THREE.MeshBasicMaterial({ color: 0x555555, toneMapped: false }), lampPos.length);
    const poolGeo = new THREE.PlaneGeometry(11, 11); poolGeo.rotateX(-Math.PI / 2); poolGeo.translate(0, 0.04, -2.0);
    const pools = new THREE.InstancedMesh(poolGeo, new THREE.MeshBasicMaterial({ map: lightPoolTexture(), color: 0xffd28a, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }), lampPos.length);
    lampPos.forEach((p, k) => { m.identity(); m.setPosition(p.x, groundY, p.z); lamps.setMatrixAt(k, m); heads.setMatrixAt(k, m); pools.setMatrixAt(k, m); });
    for (const o of [lamps, heads, pools]) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; o.raycast = () => {}; root.add(o); }
    const lampLights = [];
    for (const p of lampPos.filter(p => p.x === 0 && Math.abs(p.z) < pitch)) {
      const light = new THREE.PointLight(0xffd28a, 0, 26, 1.6);
      light.position.set(p.x, groundY + 4.9, p.z - 1.35);
      light.castShadow = false; root.add(light); lampLights.push(light);
    }

    const hedgeGeo = new THREE.BoxGeometry(1.0, 1.1, 0.7); hedgeGeo.translate(0, 0.55, 0);
    const hedgeSpots = [];
    const run = (x0, z0, x1, z1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0))); for (let i = 0; i <= n; i++) hedgeSpots.push({ x: x0 + (x1 - x0) * i / n, z: z0 + (z1 - z0) * i / n, yaw: Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2 }); };
    run(lot.x0, lot.z1, lot.x1, lot.z1);
    run(lot.x1, lot.z1, lot.x1, lot.z0);
    run(lot.x0, lot.z1, lot.x0, lot.z0);
    run(lot.x0, lot.z0, lot.driveX0, lot.z0);
    run(lot.driveX1, lot.z0, lot.x1, lot.z0);
    const hedge = new THREE.InstancedMesh(hedgeGeo, new THREE.MeshLambertMaterial({ color: 0x3f6a2e }), hedgeSpots.length);
    hedgeSpots.forEach((h, k) => { m.makeRotationY(h.yaw); m.setPosition(h.x, groundY, h.z); hedge.setColorAt(k, c.setRGB(0.85 + seedRnd(k, 1) * 0.3, 0.9 + seedRnd(k, 2) * 0.2, 0.8)); hedge.setMatrixAt(k, m); });
    hedge.castShadow = false; hedge.receiveShadow = true; hedge.frustumCulled = false; hedge.raycast = () => {};
    root.add(hedge);
    return { heads, pools, lampLights };
  }

  // ---------------------------------------------------------------- model build
  let built = null;
  let LOT = { x0: -20, x1: 20, z0: -20, z1: 20, driveX0: -2.5, driveX1: 2.5 };

  function disposeBuilt() {
    if (!built) return;
    scene.remove(built.root);
    built.root.traverse(o => { if (o.geometry) { o.geometry.disposeBoundsTree?.(); o.geometry.dispose(); } });
    built.reflector.dispose?.();
    built = null;
  }

  function buildModel(layers) {
    const solids = layers.flatMap(l => collectSolids(l.json).map(s => ({ ...s, layer: l.name })));
    if (!solids.length) throw new Error('No mesh, roof surface or eave line found');
    const name = layers.map(l => l.name).join(' + ');
    const materials = Object.assign({}, ...layers.map(l => l.json.materials || {}));
    const usage = new Map(layers.flatMap(l => l.json.material_library?.materialUsage || []).map(u => [u.materialKey, u]));
    disposeBuilt();
    // Footprint centre in plan, so the model sits on the origin of the lawn and streets.
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const s of solids) for (const [x, y, z] of s.mesh.vertices_m) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    // Floor level: the highest slab top in the file (the walkable surface), else the top of everything.
    const slabs = solids.filter(s => /slab/.test(s.list) || /slab/.test(s.material));
    const floorTop = Math.max(...(slabs.length ? slabs : solids).map(s => Number.isFinite(s.top) ? s.top : -Infinity), slabs.length ? -Infinity : z1);
    const groundY = (Number.isFinite(floorTop) ? floorTop : z1) - GROUND_BELOW_FLOOR;
    const root = new THREE.Group();
    const meshes = [], floorTris = [];
    let triangles = 0;
    for (const s of solids) {
      const V = s.mesh.vertices_m, T = s.mesh.triangle_indices;
      const pos = [], uv = [];
      const w = ([x, y, z]) => [x - cx, z, -(y - cy)];   // plan (x, y) with z up -> three.js (x, y up, z)
      for (const tri of T) {
        if (!Array.isArray(tri) || tri.length < 3) continue;
        const a = w(V[tri[0]]), b = w(V[tri[1]]), c = w(V[tri[2]]);
        const n = new THREE.Vector3().crossVectors(new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), new THREE.Vector3(c[0] - a[0], c[1] - a[1], c[2] - a[2]));
        if (n.lengthSq() < 1e-14) continue;
        n.normalize();
        for (const p of [a, b, c]) {
          pos.push(p[0], p[1], p[2]);
          // World-metre UVs along the face plane, so the relief maps tile without seams (as the tour).
          const nx = Math.abs(n.x), ny = Math.abs(n.y), nz = Math.abs(n.z);
          if (ny >= nx && ny >= nz) uv.push(p[0], p[2]); else if (nx >= nz) uv.push(p[2], p[1]); else uv.push(p[0], p[1]);
        }
        // Upward faces at the floor level carry the planar reflection.
        if (Math.abs(n.y) > 0.9 && Math.abs(a[1] - floorTop) < 0.01 && Math.abs(b[1] - floorTop) < 0.01 && Math.abs(c[1] - floorTop) < 0.01) floorTris.push(a[0], a[2], b[0], b[2], c[0], c[2]);
        triangles++;
      }
      if (!pos.length) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.computeVertexNormals();   // non-indexed: flat face normals
      geo.computeBoundsTree();
      const mesh = new THREE.Mesh(geo, materialFor(s.material, materials[s.material], usage.get(s.material)));
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.userData = { id: s.id, list: s.list, material: s.material, layer: s.layer, floor: /slab/.test(s.list) || /slab/.test(s.material) };
      root.add(mesh); meshes.push(mesh);
    }

    // Planar floor mirror, the tour's shader, on the slab top.
    const mpos = [];
    for (let i = 0; i < floorTris.length; i += 2) mpos.push(floorTris[i], -floorTris[i + 1], 0);
    const mirrorGeo = new THREE.BufferGeometry();
    mirrorGeo.setAttribute('position', new THREE.Float32BufferAttribute(mpos.length ? mpos : [0, 0, 0, 0, 0, 0, 0, 0, 0], 3));
    mirrorGeo.computeVertexNormals();
    const reflector = new Reflector(mirrorGeo, {
      textureWidth: 512, textureHeight: 512, clipBias: 0.004, type: THREE.HalfFloatType, multisample: 0,
      shader: {
        name: 'FloorMirror',
        uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, strength: { value: 0.55 }, rough: { value: 0.30 } },
        vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorldPos;
          void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPos = wp.xyz; vUv = textureMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * wp; }`,
        fragmentShader: `uniform sampler2D tDiffuse; uniform float strength; uniform float rough; varying vec4 vUv; varying vec3 vWorldPos;
          float hash13(vec3 p) { p = fract(p * vec3(443.897, 441.423, 437.195)); p += dot(p, p.yzx + 19.19); return fract((p.x + p.y) * p.z); }
          float vnoise(vec3 p) {
            vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            float n000 = hash13(i), n100 = hash13(i + vec3(1,0,0)), n010 = hash13(i + vec3(0,1,0)), n110 = hash13(i + vec3(1,1,0));
            float n001 = hash13(i + vec3(0,0,1)), n101 = hash13(i + vec3(1,0,1)), n011 = hash13(i + vec3(0,1,1)), n111 = hash13(i + vec3(1,1,1));
            return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y), mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
          }
          void main() {
            vec3 V = normalize(cameraPosition - vWorldPos);
            float ndv = max(V.y, 1e-3);
            float F = 0.04 + (max(1.0 - rough, 0.04) - 0.04) * pow(1.0 - ndv, 5.0);
            float grain = vnoise(vec3(vWorldPos.x * 7.0, vWorldPos.z * 240.0, 1.7)) - 0.5;
            float fine = vnoise(vec3(vWorldPos.x * 45.0, vWorldPos.z * 900.0, 3.1)) - 0.5;
            float speck = hash13(vWorldPos * 700.0) - 0.5;
            vec2 j = vec2(grain * 0.008 + fine * 0.003, grain * 0.026 + fine * 0.008) + speck * rough * 0.01;
            vec4 uv = vUv;
            uv.xy += j * uv.w;
            float o = 0.0022 * rough * 6.0 * uv.w;
            vec3 c = texture2DProj(tDiffuse, uv).rgb * 0.4
              + (texture2DProj(tDiffuse, uv + vec4(o, 0.0, 0.0, 0.0)).rgb + texture2DProj(tDiffuse, uv - vec4(o, 0.0, 0.0, 0.0)).rgb
              + texture2DProj(tDiffuse, uv + vec4(0.0, o * 0.6, 0.0, 0.0)).rgb + texture2DProj(tDiffuse, uv - vec4(0.0, o * 0.6, 0.0, 0.0)).rgb) * 0.15;
            float blur = smoothstep(0.05, 0.6, rough);
            gl_FragColor = vec4(c * F * strength * (1.0 - blur * 0.5) * 2.2, 1.0);
          }`
      }
    });
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = floorTop + 0.004;
    reflector.material.blending = THREE.AdditiveBlending;
    reflector.material.transparent = true;
    reflector.material.depthWrite = false;
    reflector.userData.renderMirror = reflector.onBeforeRender;
    reflector.onBeforeRender = () => {};
    reflector.visible = mpos.length > 0;
    root.add(reflector);

    // Lot around the footprint, driveway gap centred on the north side; streets and lamps beyond it.
    const hx = (x1 - x0) / 2, hz = (y1 - y0) / 2;
    LOT = { x0: -hx - 5, x1: hx + 5, z0: -hz - 5, z1: hz + 5, driveX0: -2.5, driveX1: 2.5 };
    world.ground.position.y = groundY;
    world.groundY = groundY;
    world.houseCenter.set(0, floorTop, 0);
    world.sun.target.position.copy(world.houseCenter);
    const half = Math.max(24, Math.max(hx, hz) + 8);
    Object.assign(world.sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half });
    world.sun.shadow.camera.updateProjectionMatrix();
    if (world.streetscape) { worldRoot.remove(world.streetscape.root); }
    const streetRoot = new THREE.Group();
    world.streetscape = { root: streetRoot, ...buildStreetscape(streetRoot, LOT, groundY) };
    worldRoot.add(streetRoot);

    scene.add(root);
    const box = new THREE.Box3(new THREE.Vector3(-hx, z0, -hz), new THREE.Vector3(hx, z1, hz));
    built = { root, meshes, reflector, floorTop, groundY, box, triangles, name, solids: solids.length };
    lastSunUpdate = -1;
    applyQuality();
    modelName.textContent = `${name} · ${solids.length} solids · ${triangles} triangles`;
    document.title = `${layers[0].name} · Plan model`;
    console.info(`[plan] model: ${solids.length} solids, ${triangles} triangles, floor at ${floorTop.toFixed(3)} m`);
    return built;
  }

  // ---------------------------------------------------------------- overview orbit camera
  // Pose as the tour's engine camera: yaw, pitch (camera elevation, pi/2 = plan view), distance, target.
  const orbit = { yaw: 0, pitch: Math.PI / 2, distance: 40, target: new THREE.Vector3(0, 0, 0) };
  function applyOrbit() {
    const { yaw, pitch, distance, target } = orbit;
    camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance, target.y + Math.sin(pitch) * distance, target.z + Math.cos(yaw) * Math.cos(pitch) * distance);
    camera.rotation.set(-pitch, yaw, 0);
  }
  function fitOverview() {
    if (!built) return;
    const size = built.box.getSize(new THREE.Vector3());
    orbit.target.set(0, built.floorTop, 0);
    orbit.distance = Math.max(size.x, size.z) * 0.62 / Math.tan(THREE.MathUtils.degToRad(BASE_FOV) / 2) + size.y;
  }
  const isoPose = () => ({ yaw: -0.62, pitch: 0.66, distance: orbit.distance, target: orbit.target.clone() });
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const cameraPose = () => ({ yaw: orbit.yaw, pitch: orbit.pitch, distance: orbit.distance, target: orbit.target.clone() });
  let flying = null;
  function flyCamera(from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      let dyaw = to.yaw - from.yaw;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      flying = now => {
        const k = easeInOut(Math.min(1, (now - start) / duration));
        orbit.yaw = from.yaw + dyaw * k;
        orbit.pitch = from.pitch + (to.pitch - from.pitch) * k;
        orbit.distance = Math.exp(Math.log(from.distance) + (Math.log(to.distance) - Math.log(from.distance)) * k);
        orbit.target.copy(from.target).lerp(to.target, k);
        if (k >= 1) { flying = null; resolve(); }
      };
    });
  }
  let introRunning = false;
  async function overviewIntro() {
    if (!built || mode !== 'overview') return;
    fitOverview();
    orbit.yaw = 0; orbit.pitch = Math.PI / 2; orbit.distance *= 1.05;
    applyOrbit();
    introRunning = true;
    await new Promise(r => setTimeout(r, 600));
    await flyCamera(cameraPose(), isoPose(), 2200);
    introRunning = false;
  }

  // ---------------------------------------------------------------- player (as tour.js)
  const player = { x: 0, z: 0, footY: 0, eyeY: 0, yaw: 0, pitch: 0, vx: 0, vz: 0, vy: 0, grounded: true, bob: 0, speed: 0 };
  const keys = new Set();
  const raycaster = new THREE.Raycaster();
  raycaster.firstHitOnly = true;
  const tmpOrigin = new THREE.Vector3(), tmpDir = new THREE.Vector3();
  function colliders() { return built ? [...built.meshes, world.ground] : [world.ground]; }
  function probe(ox, oy, oz, dx, dy, dz, far) {
    tmpOrigin.set(ox, oy, oz); tmpDir.set(dx, dy, dz).normalize();
    raycaster.set(tmpOrigin, tmpDir); raycaster.near = 0; raycaster.far = far;
    const hits = raycaster.intersectObjects(colliders(), true);
    return hits.length ? hits[0] : null;
  }
  function blocked(dx, dz) {
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) return false;
    for (const h of [0.42, 0.95, 1.55]) if (probe(player.x, player.footY + h, player.z, dx, 0, dz, len + PLAYER_RADIUS)) return true;
    const nx = -dz / len, nz = dx / len;
    for (const s of [-0.6, 0.6]) if (probe(player.x + nx * PLAYER_RADIUS * s, player.footY + 0.95, player.z + nz * PLAYER_RADIUS * s, dx, 0, dz, len + PLAYER_RADIUS * 0.7)) return true;
    return false;
  }
  function moveHorizontal(dx, dz) {
    if (!blocked(dx, dz)) { player.x += dx; player.z += dz; return; }
    if (Math.abs(dx) > 1e-6 && !blocked(dx, 0)) { player.x += dx; player.vz = 0; return; }
    if (Math.abs(dz) > 1e-6 && !blocked(0, dz)) { player.z += dz; player.vx = 0; return; }
    player.vx = 0; player.vz = 0;
  }
  function groundHeight() {
    const hit = probe(player.x, player.footY + 1.1, player.z, 0, -1, 0, 6);
    return hit ? hit.point.y : null;
  }
  function stepPlayer(dt) {
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    const strafe = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
    if (forward || strafe) zoomTarget = 1;
    zoomLevel += (zoomTarget - zoomLevel) * Math.min(1, dt * 10);
    const fov = BASE_FOV / zoomLevel;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const speed = run ? RUN_SPEED : WALK_SPEED;
    let tx = 0, tz = 0;
    if (forward || strafe) {
      const len = Math.hypot(forward, strafe);
      const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
      tx = ((-sy * forward) + (cy * strafe)) / len * speed;
      tz = ((-cy * forward) - (sy * strafe)) / len * speed;
    }
    const accel = (forward || strafe) ? 14 : 18;
    const k = 1 - Math.exp(-accel * dt);
    player.vx += (tx - player.vx) * k;
    player.vz += (tz - player.vz) * k;
    const dx = player.vx * dt, dz = player.vz * dt;
    const prevX = player.x, prevZ = player.z;
    if (Math.hypot(dx, dz) > 1e-5) moveHorizontal(dx, dz);
    if (player.x < LOT.x0 + 0.4) { player.x = LOT.x0 + 0.4; player.vx = 0; }
    if (player.x > LOT.x1 - 0.4) { player.x = LOT.x1 - 0.4; player.vx = 0; }
    if (player.z < LOT.z0 + 0.4) { player.z = LOT.z0 + 0.4; player.vz = 0; }
    if (player.z > LOT.z1 - 0.4) { player.z = LOT.z1 - 0.4; player.vz = 0; }
    player.speed = Math.hypot(player.vx, player.vz);
    let g = groundHeight();
    if (g !== null && g - player.footY > STEP_MAX + 0.05) { player.x = prevX; player.z = prevZ; player.vx = player.vz = 0; g = groundHeight(); }
    if (g !== null) {
      if (g > player.footY + 1e-4) { player.footY = Math.min(g, player.footY + Math.max(2.2, player.speed * 2.5) * dt); player.vy = 0; player.grounded = true; }
      else if (g < player.footY - 1e-4) {
        player.vy -= GRAVITY * dt;
        player.footY += player.vy * dt;
        if (player.footY <= g) { player.footY = g; player.vy = 0; player.grounded = true; } else player.grounded = false;
      } else { player.vy = 0; player.grounded = true; }
    }
    const bobAmount = player.grounded ? Math.min(1, player.speed / WALK_SPEED) : 0;
    player.bob += dt * (run ? 11.5 : 8.6) * bobAmount;
    const bobY = Math.sin(player.bob) * 0.016 * bobAmount;
    const bobX = Math.cos(player.bob * 0.5) * 0.008 * bobAmount;
    player.eyeY = player.footY + EYE_HEIGHT + bobY;
    camera.position.set(player.x + Math.cos(player.yaw) * bobX, player.eyeY, player.z - Math.sin(player.yaw) * bobX);
    camera.rotation.set(player.pitch, player.yaw, 0);
  }

  // ---------------------------------------------------------------- daylight (as tour.js)
  let indoor = 0;
  let lastSunUpdate = -1;
  let sunShadowTimer = 0;
  function updateDaylight(dt) {
    if (tune.clock) { tune.hour = (tune.hour + dt * SIM_SECONDS_PER_REAL_SECOND / 3600) % 24; }
    const h = tune.hour;
    const dayT = (h - 6) / 12;
    const sunElev = Math.sin(dayT * Math.PI) * THREE.MathUtils.degToRad(65);
    const sunAz = Math.PI + dayT * Math.PI;
    const dirFrom = (elev, az) => new THREE.Vector3(Math.sin(az) * Math.cos(elev), Math.sin(elev), -Math.cos(az) * Math.cos(elev)).normalize();
    const sunDir = dirFrom(sunElev, sunAz);
    const nightT = ((h + 6) % 24) / 12;
    const moonElev = Math.sin(nightT * Math.PI) * THREE.MathUtils.degToRad(50);
    const moonDir = dirFrom(moonElev, Math.PI + nightT * Math.PI);
    const daylight = THREE.MathUtils.clamp(Math.sin(sunElev) * 2.2 + 0.08, 0, 1);
    world.daylight = daylight;
    if (world.streetscape) {
      const sc = world.streetscape, night = 1 - daylight;
      sc.heads.material.color.setRGB(0.33 + 0.67 * night, 0.33 + 0.55 * night, 0.33 + 0.25 * night);
      sc.pools.material.opacity = 0.6 * night;
      for (const l of sc.lampLights) l.intensity = 40 * night;
    }
    const { sun, sky, moon, hemi, houseCenter } = world;
    const sunUp = sunElev > -0.02;
    const light = sunUp ? sunDir : moonDir;
    sun.position.copy(houseCenter).addScaledVector(light, 45);
    const warmth = THREE.MathUtils.clamp(Math.sin(sunElev) * 3, 0, 1);
    if (sunUp) { sun.color.setRGB(1.0, 0.72 + 0.22 * warmth, 0.45 + 0.4 * warmth); sun.intensity = 3.4 * daylight; }
    else { sun.color.setRGB(0.62, 0.72, 1.0); sun.intensity = 0.22 * THREE.MathUtils.clamp(Math.sin(moonElev) * 2, 0, 1); }
    sky.material.uniforms.sunPosition.value.copy(sunDir);
    sky.material.uniforms.turbidity.value = 4 + (1 - daylight) * 6;
    moon.position.copy(houseCenter).addScaledVector(moonDir, 850);
    moon.visible = moonElev > 0 && !sunUp;
    hemi.color.setRGB(0.42 * daylight + 0.05, 0.52 * daylight + 0.06, 0.72 * daylight + 0.12);
    hemi.groundColor.setRGB(0.30 * daylight + 0.02, 0.29 * daylight + 0.02, 0.26 * daylight + 0.03);
    sunShadowTimer += dt;
    if (lastSunUpdate < 0 || (sunShadowTimer >= 1.0 && Math.abs(h - lastSunUpdate) > 0.05)) {
      sunShadowTimer = 0; lastSunUpdate = h; sun.shadow.needsUpdate = true; renderer.shadowMap.needsUpdate = true;
    }
  }
  function updateEnvironment(dt) {
    updateDaylight(dt);
    const ceiling = mode === 'walk' ? probe(camera.position.x, camera.position.y, camera.position.z, 0, 1, 0, 3.2) : null;
    indoor += ((ceiling ? 1 : 0) - indoor) * (1 - Math.exp(-4 * dt));
    const dl = 0.06 + 0.94 * world.daylight;
    renderer.toneMappingExposure = (0.92 + 0.18 * indoor) * tune.exposure;
    world.hemi.intensity = (2.8 * (1 - indoor) + 1.6 * indoor * tune.base) * dl;
    world.ambient.intensity = 0.7 * indoor * tune.base * dl;
    scene.environmentIntensity = 0.55;
  }

  // ---------------------------------------------------------------- frame loop
  let lastTime = 0, frames = 0, fpsTime = 0, fps = 0;
  let lastPoseKey = '', sceneDirty = 3;
  function frame(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    if (mode === 'walk') stepPlayer(dt);
    else { if (flying) flying(time); applyOrbit(); }
    updateEnvironment(dt);
    const poseKey = `${camera.position.x.toFixed(3)}|${camera.position.y.toFixed(3)}|${camera.position.z.toFixed(3)}|${camera.rotation.x.toFixed(4)}|${camera.rotation.y.toFixed(4)}|${zoomLevel.toFixed(3)}`;
    if (poseKey !== lastPoseKey || tune.clock) sceneDirty = 3;
    lastPoseKey = poseKey;
    const changing = !RENDER.lessOften || sceneDirty > 0;
    if (sceneDirty > 0) sceneDirty--;
    envFrame++;
    if (changing && (RENDER.lessOften || envFrame % 4 === 0)) {
      // Live environment map from the eye, one cube face per frame (mirror hidden).
      const hidden = built && built.reflector.visible ? [built.reflector] : [];
      hidden.forEach(o => { o.visible = false; });
      envCamera.position.copy(camera.position);
      if (RENDER.lessOften) {
        envCamera.updateMatrixWorld(true);
        const face = envFrame % 6;
        const currentTarget = renderer.getRenderTarget(), currentTone = renderer.toneMapping, currentXr = renderer.xr.enabled;
        const mips = envTarget.texture.generateMipmaps;
        renderer.toneMapping = THREE.NoToneMapping; renderer.xr.enabled = false;
        envTarget.texture.generateMipmaps = face === 5 ? mips : false;
        renderer.setRenderTarget(envTarget, face);
        renderer.render(scene, envCamera.children[face]);
        envTarget.texture.generateMipmaps = mips;
        renderer.setRenderTarget(currentTarget);
        renderer.toneMapping = currentTone; renderer.xr.enabled = currentXr;
      } else {
        envCamera.update(renderer, scene);
      }
      hidden.forEach(o => { o.visible = true; });
      scene.environment = envTarget.texture;
    }
    if (built && built.reflector.geometry.attributes.position.count > 3) {
      // Floor reflection: one bounce, skipped while the floor is out of view (looking up).
      const r = built.reflector;
      const floorInView = mode !== 'walk' || player.pitch < 0.42;
      r.visible = floorInView;
      if (!floorInView) r.userData.fresh = false;
      if (floorInView && (envFrame % RENDER.reflectEvery === 0 || !r.userData.fresh) && (changing || !r.userData.fresh)) {
        r.userData.renderMirror.call(r, renderer, scene, camera, r.geometry, r.material, null);
        r.userData.fresh = true;
      }
    }
    renderer.render(scene, camera);
    frames++; fpsTime += dt;
    if (fpsTime >= 0.5) {
      fps = Math.round(frames / fpsTime); frames = 0; fpsTime = 0;
      if (tuningOpen && tune.clock) syncTunePanel();
      const hh = Math.floor(tune.hour), mm = Math.floor((tune.hour - hh) * 60);
      stats.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} · ${fps} fps${mode === 'walk' ? ` · ${player.footY >= (built?.floorTop ?? 0) - 0.02 ? 'On the slab' : 'On the lawn'}` : ''}`;
    }
  }
  function benchmark(n = 60, move = false) {
    const gl = renderer.getContext();
    lastTime = performance.now();
    const t0 = performance.now();
    for (let i = 0; i < n; i++) { if (move) { player.yaw += 0.0005; orbit.yaw += 0.0005; } frame(lastTime + 16.7); }
    gl.finish();
    return Math.round((performance.now() - t0) / n * 100) / 100;
  }
  function setQuality(patch) { Object.assign(RENDER, patch); applyQuality(); }

  // ---------------------------------------------------------------- enter / exit walk (as tour.js)
  let entering = false;
  let overviewPoseBefore = null;
  function floorHitAt(clientX, clientY) {
    if (!built) return null;
    const ndc = new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera); raycaster.near = 0; raycaster.far = 2000;
    raycaster.firstHitOnly = false;   // the roof and walls are in the way: look through them for a floor
    const hits = raycaster.intersectObjects(built.meshes, true);
    raycaster.firstHitOnly = true;
    for (const h of hits) {
      const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
      if (n.y < 0.7) continue;                                   // a side face or an underside
      if (!h.object.userData.floor && h.point.y > built.floorTop + 0.6) continue;   // a roof face, not a floor
      return { x: h.point.x, y: h.point.y, z: h.point.z };
    }
    return null;
  }
  async function enterWalk(point) {
    if (mode !== 'overview' || entering || !built) return;
    entering = true;
    try {
      zoomTarget = zoomLevel = 1; camera.fov = BASE_FOV; camera.updateProjectionMatrix();
      const from = cameraPose();
      overviewPoseBefore = from;
      player.yaw = from.yaw; player.pitch = 0;
      player.x = point.x; player.z = point.z; player.footY = point.y; player.vx = player.vz = player.vy = 0; player.bob = 0;
      for (let i = 0; i < 6 && blocked(0.001, 0) && blocked(0, 0.001); i++) { player.x += 0.15 * Math.sin(player.yaw); player.z += 0.15 * Math.cos(player.yaw); }
      await flyCamera(from, { yaw: from.yaw, pitch: 0.0, distance: 0.12, target: new THREE.Vector3(player.x, player.footY + EYE_HEIGHT, player.z) }, 1500);
      mode = 'walk';
      body.dataset.tourMode = 'walk';
      stepPlayer(0.016);
      renderer.shadowMap.needsUpdate = true;
      world.sun.shadow.needsUpdate = true;
      showHint(WALK_HINT);
      try { Promise.resolve(tourCanvas.requestPointerLock?.({ unadjustedMovement: true })).catch(() => tourCanvas.requestPointerLock?.()); } catch (_) { /* touch */ }
    } catch (err) {
      console.error('[plan] failed to enter walking mode', err);
      showHint('Walking view failed to start. See the browser console.', false);
      mode = 'overview'; body.dataset.tourMode = 'overview';
    } finally { entering = false; }
  }
  function exitWalk() {
    if (mode !== 'walk') return;
    mode = 'overview';
    setTuning(false);
    if (document.pointerLockElement === tourCanvas) document.exitPointerLock();
    keys.clear();
    body.dataset.tourMode = 'overview';
    const eyePose = { yaw: player.yaw, pitch: -player.pitch, distance: 0.12, target: new THREE.Vector3(player.x, player.footY + EYE_HEIGHT, player.z) };
    const back = overviewPoseBefore || { yaw: player.yaw, pitch: 0.66, distance: 30, target: new THREE.Vector3(player.x, player.footY, player.z) };
    Object.assign(orbit, { yaw: eyePose.yaw, pitch: eyePose.pitch, distance: eyePose.distance }); orbit.target.copy(eyePose.target);
    entering = true;
    flyCamera(eyePose, back, 1400).then(() => { entering = false; });
    showHint(OVERVIEW_HINT);
  }
  exitButton.addEventListener('click', exitWalk);

  // ---------------------------------------------------------------- lighting panel (as tour.js)
  let tuningOpen = false;
  function syncTunePanel() {
    for (const input of tunePanel.querySelectorAll('input[type="range"]')) {
      input.value = tune[input.name];
      if (input.name === 'hour') { const hh = Math.floor(tune.hour), mm = Math.floor((tune.hour - hh) * 60); input.nextElementSibling.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; }
      else input.nextElementSibling.textContent = Number(tune[input.name]).toFixed(input.step.includes('.') ? 2 : 1);
    }
    tunePanel.querySelector('input[name="clock"]').checked = !!tune.clock;
  }
  function applyTune() {
    for (const m of glassMaterials) m.envMapIntensity = m.userData.baseEnv * tune.glass;
    try { localStorage.setItem(TUNE_KEY, JSON.stringify(tune)); } catch (_) { /* no storage */ }
  }
  tunePanel.addEventListener('input', e => {
    if (e.target.name === 'clock') { tune.clock = e.target.checked ? 1 : 0; applyTune(); return; }
    if (e.target.name in tune) { tune[e.target.name] = Number(e.target.value); if (e.target.name === 'hour') tune.clock = 0; applyTune(); syncTunePanel(); }
  });
  tunePanel.querySelector('[data-reset]').addEventListener('click', () => { Object.assign(tune, TUNE_DEFAULTS); applyTune(); syncTunePanel(); });
  tunePanel.addEventListener('keydown', e => e.stopPropagation());
  function setTuning(open) {
    tuningOpen = open;
    tunePanel.hidden = !open;
    if (open) { syncTunePanel(); if (document.pointerLockElement === tourCanvas) document.exitPointerLock(); }
  }
  syncTunePanel(); applyTune();

  // ---------------------------------------------------------------- input
  let heldLock = false;
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === tourCanvas) { heldLock = true; return; }
    if (mode === 'walk' && heldLock && !tuningOpen) exitWalk();
    heldLock = false;
  });
  document.addEventListener('pointerlockerror', () => { /* drag-look fallback */ });
  window.addEventListener('keydown', e => {
    if (e.target === fileInput) return;
    if (e.code === 'KeyT') { setTuning(!tuningOpen); return; }
    if (mode !== 'walk') return;
    if (e.code === 'Escape') { if (tuningOpen) { setTuning(false); return; } exitWalk(); return; }
    keys.add(e.code);
    if (/^(Arrow|Key[WASD]|Shift)/.test(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys.delete(e.code); });
  window.addEventListener('wheel', e => {
    if (tuningOpen || e.target !== tourCanvas) return;
    e.preventDefault();
    if (mode === 'walk') zoomTarget = THREE.MathUtils.clamp(zoomTarget * Math.exp(-e.deltaY * 0.0015), 1, 4);
    else if (!flying) orbit.distance = THREE.MathUtils.clamp(orbit.distance * Math.exp(e.deltaY * 0.0015), 2, 400);
  }, { passive: false });
  window.addEventListener('blur', () => keys.clear());

  // Walk: mouse look with pointer lock, drag fallback. Overview: drag orbits, right-drag pans, a short click on
  // a floor starts the walk.
  let dragging = false, lastX = 0, lastY = 0;
  function look(dx, dy) {
    player.yaw -= dx * 0.0021;
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch - dy * 0.0021));
  }
  const pointers = new Map();
  let press = null, pinch = null;
  tourCanvas.addEventListener('contextmenu', e => e.preventDefault());
  tourCanvas.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') { pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomTarget, distance: orbit.distance }; press = null; } }
    if (mode === 'walk') {
      if (e.pointerType !== 'touch' && document.pointerLockElement !== tourCanvas) { dragging = true; lastX = e.clientX; lastY = e.clientY; tourCanvas.requestPointerLock?.(); }
      if (e.pointerType === 'touch') { dragging = true; lastX = e.clientX; lastY = e.clientY; }
      return;
    }
    if (pointers.size > 1) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    press = { x: e.clientX, y: e.clientY, t: performance.now(), button: e.button, mod: e.shiftKey || e.ctrlKey || e.altKey || e.metaKey, pan: e.button === 2 || e.button === 1 || e.shiftKey };
    tourCanvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  tourCanvas.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' && pointers.has(e.pointerId)) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y) / pinch.d;
        if (mode === 'walk') zoomTarget = THREE.MathUtils.clamp(pinch.zoom * d, 1, 4); else orbit.distance = THREE.MathUtils.clamp(pinch.distance / d, 2, 400);
        return;
      }
    }
    if (mode === 'walk') {
      if (document.pointerLockElement === tourCanvas) look(e.movementX, e.movementY);
      else if (dragging) { const k = e.pointerType === 'touch' ? 2.2 : 1; look((e.clientX - lastX) * k, (e.clientY - lastY) * k); lastX = e.clientX; lastY = e.clientY; }
      return;
    }
    if (!dragging || flying) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 6) press.moved = true;
    if (press?.pan) {
      const s = orbit.distance * 0.0016;
      const right = new THREE.Vector3(Math.cos(orbit.yaw), 0, -Math.sin(orbit.yaw)), fwd = new THREE.Vector3(-Math.sin(orbit.yaw), 0, -Math.cos(orbit.yaw));
      orbit.target.addScaledVector(right, -dx * s).addScaledVector(fwd, dy * s);
    } else {
      orbit.yaw -= dx * 0.006;
      orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + dy * 0.006, 0.06, Math.PI / 2 - 0.001);
    }
  });
  const endPointer = e => {
    if (e.pointerType === 'touch') { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; }
    dragging = pointers.size > 0;
    if (mode !== 'overview' || !press) return;
    const p = press; press = null;
    if (p.moved || p.mod || p.pan || performance.now() - p.t > 450) return;
    const floor = floorHitAt(e.clientX, e.clientY);
    if (floor) enterWalk(floor);
  };
  tourCanvas.addEventListener('pointerup', endPointer);
  tourCanvas.addEventListener('pointercancel', endPointer);
  const mobileBar = document.getElementById('tour-mobile');
  for (const button of mobileBar.querySelectorAll('button')) {
    const move = button.dataset.move;
    const code = move === 'forward' ? 'KeyW' : 'KeyS';
    const pressKey = e => { e.preventDefault(); if (move) { keys.add(code); button.dataset.active = 'true'; } };
    const release = () => { if (move) { keys.delete(code); button.dataset.active = 'false'; } };
    button.addEventListener('pointerdown', pressKey);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('contextmenu', e => e.preventDefault());
  }

  // ---------------------------------------------------------------- loading
  // Layers: every loaded file adds to the model (slab, walls, roof), rebuilt together so they share one centre.
  const layers = [];
  function setStatus(text, error = false) { loadStatus.textContent = text; loadStatus.dataset.error = error ? 'true' : 'false'; }
  async function loadJson(json, name, { intro = true } = {}) {
    if (mode === 'walk') exitWalk();
    loading.dataset.active = 'true';
    await new Promise(r => setTimeout(r, 30));
    const kept = layers.filter(l => l.name !== name);
    try {
      buildModel([...kept, { name, json }]);
      layers.length = 0; layers.push(...kept, { name, json });
      loadPanel.hidden = true;
      openButton.hidden = false;
      setStatus(`Loaded: ${layers.map(l => l.name).join(', ')}`);
      showHint(OVERVIEW_HINT);
      if (intro) overviewIntro(); else fitOverview();
    } catch (err) {
      console.error('[plan] load failed', err);
      setStatus(`Cannot show ${name}: ${err.message}`, true);
      loadPanel.hidden = false;
    } finally { loading.dataset.active = 'false'; }
  }
  async function loadFiles(files) {
    let first = !built;
    for (const file of files || []) {
      setStatus(`Reading ${file.name}…`);
      try { await loadJson(JSON.parse(await file.text()), file.name, { intro: first }); first = false; }
      catch (err) { setStatus(`Cannot read ${file.name}: ${err.message}`, true); }
    }
  }
  async function loadUrl(url) {
    let first = !built;
    for (const one of String(url).split(',').map(u => u.trim()).filter(Boolean)) {
      setStatus(`Loading ${one}…`);
      try { const res = await fetch(one); if (!res.ok) throw new Error(`HTTP ${res.status}`); await loadJson(await res.json(), one.split('/').pop() || one, { intro: first }); first = false; }
      catch (err) { setStatus(`Cannot load ${one}: ${err.message}`, true); loadPanel.hidden = false; }
    }
  }
  function clearModel() {
    if (mode === 'walk') exitWalk();
    layers.length = 0; disposeBuilt();
    modelName.textContent = ''; setStatus(''); openButton.hidden = true; loadPanel.hidden = false;
  }
  fileInput.addEventListener('change', () => { loadFiles([...fileInput.files]); fileInput.value = ''; });
  openButton.addEventListener('click', () => { loadPanel.hidden = false; });
  loadPanel.querySelector('[data-close]').addEventListener('click', () => { if (built) loadPanel.hidden = true; });
  loadPanel.querySelector('[data-clear]').addEventListener('click', clearModel);
  window.addEventListener('dragover', e => { e.preventDefault(); body.dataset.dragging = 'true'; });
  window.addEventListener('dragleave', e => { if (!e.relatedTarget) body.dataset.dragging = 'false'; });
  window.addEventListener('drop', e => { e.preventDefault(); body.dataset.dragging = 'false'; loadFiles([...e.dataTransfer.files]); });

  // ---------------------------------------------------------------- start
  applyQuality();
  applyOrbit();
  lastTime = performance.now();
  renderer.setAnimationLoop(frame);
  const src = new URLSearchParams(location.search).get('src');
  if (src) loadUrl(src); else setStatus('');

  window.PlanTour = Object.freeze({ load: loadJson, loadUrl, clear: clearModel, layers, enterWalk, exitWalk, benchmark, setQuality, RENDER, THREE, get mode() { return mode; }, get player() { return player; }, get orbit() { return orbit; }, get camera() { return camera; }, get scene() { return scene; }, get built() { return built; } });
})();
