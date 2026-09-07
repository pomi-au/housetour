/*
 * Plan model viewer (model.html).
 *
 * Loads a house model JSON (schema pomi.house_model.v1) and shows it the way tour.html shows the residence.
 * The surfaces come from model/surfaces.js (slab, footing, wall cut around the openings, roof, fascia), the
 * finishes from model/materials.js (the tour's surface set), and the fixtures from fixtures/*.js: the standard
 * hinged door lifted from the residence engine, windows and sliding doors. Doors and sliders open on click. The view is
 * Coordinates: JSON x, y are plan metres, z is up. Here x -> x, z -> y, y -> -z, centred on the model footprint.
 * Build: cd tour/build && npm run build   ->  tour/js/plan.bundle.js
 */
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { createMaterials } from './model/materials.js';
import { buildSlab, buildFooting, buildWall, buildRoof, buildFascia, buildGlazing, buildCeiling, openingBoxes, floorTriangles } from './model/surfaces.js';
import { planDownlights, createRoomMask, buildDownlightFixtures, bakeLightMaps } from './model/lighting.js';
import { extractStandardDoor, createHingedDoor, openingFor as doorOpeningFor } from './fixtures/hinged-door.js';
import { createWindow } from './fixtures/window.js';
import { createSlidingDoor } from './fixtures/sliding-door.js';
import { createSkeleton, popIn } from './fixtures/skeleton.js';
import { createPaperPlane } from './fixtures/paper-plane.js';

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
  const RENDER = { dpr: TOUCH ? 1 : 1.25, reflection: 0.3, reflectEvery: 2, sunShadow: 1024, lessOften: true, direct: true, lights: 32, shadowSpots: TOUCH ? 2 : 3, shadowSize: 512, haloLights: true };
  const SPOT_POOL = RENDER.lights;   // pooled downlights; the nearest fixtures take a slot, the rest wait
  const TUNE_DEFAULTS = { power: 9, floor: 0.6, wall: 1.0, base: 1.0, exposure: 0.5, hour: 14, clock: 1, glass: 2.4, halo: 0.15 };
  let confinedVolume = 8.0;   // m3: a door into a space this small or smaller has a skeleton behind it
  let mappedLights = true;    // the walk renders from baked light maps (direct plus bounce light); L switches to the run-time spot pool
  const SIM_SECONDS_PER_REAL_SECOND = 3600 / 2.5;
  const TUNE_KEY = 'residence.tour.lighting.v1';   // shared with tour.html, so both pages show the same light
  const tune = { ...TUNE_DEFAULTS };
  try { Object.assign(tune, JSON.parse(localStorage.getItem(TUNE_KEY) || '{}')); } catch (_) { /* no storage */ }
  tune.clock = 1;
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
  const WALK_HINT = TOUCH ? 'Stick walks and turns · hold a drag to keep turning · pinch to zoom · ✋ opens doors' : '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Shift</kbd> run · mouse look · click doors · <kbd>T</kbd> lighting · <kbd>Esc</kbd> exit';

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

  // ---------------------------------------------------------------- materials (model/materials.js)
  const roomMask = createRoomMask(SPOT_POOL + 1);   // the last slot stays unmasked for the walker's lantern
  const FREE_SLOT = SPOT_POOL;
  roomMask.setRoom(FREE_SLOT, [], 0, 0, true);
  roomMask.scale.floor.value = tune.floor; roomMask.scale.wall.value = tune.wall;
  const mats = createMaterials({ renderer, glassStrength: tune.glass, patch: roomMask.patch });
  const { surfaceMaterial } = mats;
  // The standard hinged door, read from the residence engine that model.html loads hidden.
  const doorModel = extractStandardDoor(window.RESIDENCE);
  if (doorModel) console.info(`[plan] standard door from the residence engine: frame ${doorModel.u0.toFixed(3)}..${doorModel.u1.toFixed(3)} m, ${doorModel.top.toFixed(3)} m high`);
  else console.warn('[plan] residence engine not loaded: hinged doors stay open holes');

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
    const grass = mats.grassTexture();
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
    const asphalt = new THREE.MeshLambertMaterial({ map: mats.streetTexture(), color: 0xffffff });
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
    lampPos.forEach((p, k) => { m.identity(); m.setPosition(p.x, groundY, p.z); lamps.setMatrixAt(k, m); heads.setMatrixAt(k, m); });
    // Lamp light on the ground: one pre-rendered map (materials.lampLightMap) on a plane just above the roads, added
    // over the surfaces and faded in at dusk. No run-time lights: the map is rendered once here.
    const lightMap = mats.lampLightMap(lampPos.map(p => ({ x: p.x, z: p.z - 1.35 })), { extent: streetLen, height: 4.9 });
    const poolGeo = new THREE.PlaneGeometry(streetLen, streetLen); poolGeo.rotateX(-Math.PI / 2);
    const pools = new THREE.Mesh(poolGeo, new THREE.MeshBasicMaterial({ map: lightMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    pools.position.y = groundY + 0.045;
    for (const o of [lamps, heads, pools]) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; o.raycast = () => {}; root.add(o); }
    const lampLights = [];

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

  function buildModel(json, name) {
    if (!Array.isArray(json.elements)) throw new Error('not a house model: no elements list (expected schema pomi.house_model.v1)');
    const elements = json.elements.filter(el => Array.isArray(el.vertices) && Array.isArray(el.faces));
    if (!elements.length) throw new Error('No element with vertices and faces found');
    const materials = json.materials || {};
    disposeBuilt();
    // Footprint centre in plan, so the model sits on the origin of the lawn and streets.
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const el of elements) for (const [x, y, z] of el.vertices) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    const frame = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
    const slabs = elements.filter(el => el.category === 'slab');
    const floorTop = slabs.length ? Math.max(...slabs.flatMap(el => el.vertices.map(v => v[2]))) : z1;
    const groundY = floorTop - GROUND_BELOW_FLOOR;
    const openings = openingBoxes(json.fixtures, { doorOpening: doorModel ? w => doorOpeningFor(doorModel, w) : null });
    const root = new THREE.Group();
    const meshes = [], fixtures = [], fixtureMeshes = [], floorTris = [];
    const matFor = el => mats.materialFor(el.material || 'default', materials[el.material], el.finish);
    const place = (m, list) => { if (!m) return; root.add(m); list.push(m); };
    // Surfaces (model/surfaces.js).
    for (const el of elements) {
      switch (el.category) {
        case 'slab': { const m = buildSlab(el, matFor(el), frame); place(m, meshes); if (m) floorTris.push(...floorTriangles(m, floorTop)); break; }
        case 'footing': place(buildFooting(el, matFor(el), frame), meshes); break;
        case 'wall': for (const m of buildWall(el, openings, matFor(el), frame)) place(m, meshes); break;
        case 'roof': place(buildRoof(el, mats.materialFor('roof_sheet', materials.roof_sheet, null), frame), meshes); break;
        default: place(buildRoof(el, matFor(el), frame), meshes);
      }
    }
    for (const line of json.guides?.eave_height_lines || []) place(buildFascia(line, mats.finishes.fascia(), frame), meshes);
    const lighting = planDownlights(json);
    // Fixtures (fixtures/*.js): each opening gets its module by kind, placed at the opening centre at sill level.
    for (const o of openings) {
      const position = [o.cx - frame.cx, floorTop + o.z0, -(o.cy - frame.cy)];
      const height = o.z1 - o.z0;
      let g = null;
      if (o.hinged) g = createHingedDoor({ model: doorModel, width: o.width, hinge: o.hinge, position, rotationDeg: o.rotation, materials: mats.fixtures, label: o.label });
      else if (/sliding/.test(o.kind)) {
        // A robe slider (internal, not a stacker) gets solid mirrored leaves; a patio slider stays glazed.
        const w = o.x1 - o.x0 > o.y1 - o.y0 ? o.x1 - o.x0 : o.y1 - o.y0;
        // Inside means not open ground 0.9 m beyond the face: a room or a wall (a shallow robe's back) both count.
        const inside = side => { const gg = lighting.grid; if (!gg) return false; const dAcross = (o.depth || 0.23) / 2 + 0.9; const px = o.cx + (o.alongX ? 0 : side * dAcross), py = o.cy + (o.alongX ? side * dAcross : 0); const i = Math.floor((px - gg.x0) / gg.cell), j = Math.floor((py - gg.y0) / gg.cell); return i >= 0 && j >= 0 && i < gg.W && j < gg.H && gg.state[j * gg.W + i] !== 0; };
        const internal = /internal|robe|wardrobe/i.test(o.label) || (w < 3 && !/stacker/i.test(o.label) && inside(-1) && inside(1));
        g = createSlidingDoor({ width: w, height, depth: o.depth, position, rotationDeg: o.rotation, materials: mats.fixtures, label: o.label, panel: internal ? 'mirror' : 'glass', mirrorSide: 1 });
      }
      else if (/window|glass/.test(o.kind)) g = createWindow({ width: o.x1 - o.x0 > o.y1 - o.y0 ? o.x1 - o.x0 : o.y1 - o.y0, height, depth: o.depth, position, rotationDeg: o.rotation, materials: mats.fixtures, label: o.label });
      if (!g) { if (/window|sliding|glass/.test(o.kind)) place(buildGlazing(o, mats.fixtures.glass, frame), meshes); continue; }
      g.userData.fixture.id = o.id;
      root.add(g); fixtures.push(g);
      fixtureMeshes.push(...g.userData.fixture.meshes);
    }
    // Downlights (model/lighting.js): rooms from the walls and roof, a flat ceiling per room, a fitting per light and
    // the tour's pooled spot lights with halos, confined to their room by the mask.
    const ceilingMaterial = mats.finishes.ceiling();
    for (const r of lighting.rooms) {
      if (r.raked) continue;   // the roof underside is the ceiling
      r.rects.forEach((q, k) => place(buildCeiling([q.x0, q.y0, q.x1, q.y1], r.ceiling - 0.001 * k, ceilingMaterial, frame), meshes));
    }
    const leds = lighting.lights.map(l => ({
      world: [l.x - frame.cx, l.z + floorTop, -(l.y - frame.cy)], room: lighting.rooms[l.room], roomIndex: l.room,
      boxes: l.boxes.map(b => [b[0] - frame.cx, -(b[3] - frame.cy), b[2] - frame.cx, -(b[1] - frame.cy)]),
      yLo: floorTop - 0.45, yHi: floorTop + lighting.rooms[l.room].ceiling + 0.35
    }));
    // Confined spaces: a hinged door with a small region (CONFINED_VOLUME or less) on one side gets the skeleton.
    const g = lighting.grid;
    const spaceAt = (wx, wz) => { if (!g) return null; const px = wx + frame.cx, py = -wz + frame.cy; const i = Math.floor((px - g.x0) / g.cell), j = Math.floor((py - g.y0) / g.cell); if (i < 0 || j < 0 || i >= g.W || j >= g.H) return null; const n = g.smallAt[j * g.W + i]; return n >= 0 ? lighting.small[n] : null; };
    const confined = [];
    for (const fx of fixtures) {
      const f = fx.userData.fixture;
      if (f.kind !== 'hinged door' && !(f.kind === 'sliding door' && f.panel === 'mirror')) continue;
      fx.updateMatrixWorld(true);
      for (const side of [-1, 1]) {
        const p = fx.localToWorld(new THREE.Vector3(0, 0.5, side * ((f.depth || 0.23) / 2 + 0.2)));
        const space = spaceAt(p.x, p.z);
        if (space) {
          f.smallSpace = { space, side }; confined.push({ door: f.label, space: space.id, volume: +space.volume.toFixed(2) });
          // A robe's mirrors face the room, away from the robe.
          for (const mr of f.mirrors || []) { mr.position.z = -side * Math.abs(mr.position.z); mr.rotation.y = side < 0 ? 0 : Math.PI; }
          break;
        }
      }
    }
    if (confined.length) console.info('[plan] doors into small spaces (skeleton at or under ' + confinedVolume + ' m3):', confined);
    const skeleton = createSkeleton();
    skeleton.visible = false;
    root.add(skeleton);
    const fittings = buildDownlightFixtures(lighting.lights.map(l => ({ ...l, z: l.z + floorTop })), frame);
    root.add(fittings.bezel, fittings.lens, fittings.trim);
    const spots = [];
    for (let i = 0; i < Math.min(SPOT_POOL, Math.max(1, leds.length)); i++) {
      const light = RENDER.haloLights
        ? new THREE.SpotLight(0xffffff, 0, 6.5, THREE.MathUtils.degToRad(55), 0.36, 2.0)
        : new THREE.SpotLight(0xffffff, 0, 6.5, THREE.MathUtils.degToRad(64), 0.65, 2.0);
      light.target = new THREE.Object3D();
      light.castShadow = false;
      light.shadow.mapSize.set(RENDER.shadowSize, RENDER.shadowSize);
      light.shadow.autoUpdate = false;
      light.shadow.bias = -0.0004; light.shadow.normalBias = 0.03; light.shadow.camera.near = 0.1;
      light.shadow.radius = 4;
      const halo = RENDER.haloLights ? new THREE.PointLight(0xffffff, 0, 5.0, 2.0) : null;
      if (halo) halo.castShadow = false;
      light.userData = { led: null, target: 0, current: 0, halo };
      root.add(light, light.target); if (halo) root.add(halo); spots.push(light);
    }
    let triangles = 0;
    for (const m of [...meshes, ...fixtureMeshes]) triangles += m.geometry.attributes.position.count / 3;

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
    root.updateMatrixWorld(true);
    const box = new THREE.Box3(new THREE.Vector3(-hx, z0, -hz), new THREE.Vector3(hx, z1, hz));
    const mirrors = fixtures.flatMap(fx => fx.userData.fixture.mirrors || []);
    built = { root, meshes, fixtures, fixtureMeshes, reflector, mirrors, floorTop, groundY, box, triangles, name, solids: meshes.length, lighting, leds, spots, lens: fittings.lens, frame, openings, baked: null, skeleton, skeletonDoor: null, skeletonPop: null, confined };
    if (mappedLights) setMappedLights(true);
    lastSunUpdate = -1;
    applyQuality();
    const doors = fixtures.filter(g => g.userData.fixture.kind === 'hinged door').length;
    modelName.textContent = `${json.job || name} · ${meshes.length} surfaces · ${openings.length} openings · ${doors} doors · ${lighting.rooms.length} rooms · ${leds.length} downlights · ${Math.round(triangles / 1000)}k triangles`;
    document.title = `${json.job || name} · House model`;
    console.info(`[plan] model: ${meshes.length} surfaces, ${fixtures.length} fixtures, ${Math.round(triangles)} triangles, floor at ${floorTop.toFixed(3)} m`);
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
  const stick = { x: 0, y: 0, active: false, refYaw: 0 };   // touch stick vector, -1..1, and the heading it was engaged at
  // Lantern: a warm point light the walker (or the plane) carries, on while moving, off when still.
  const lantern = new THREE.PointLight(0xffe2b8, 0, 7, 2);
  lantern.castShadow = false; lantern.visible = false;
  scene.add(lantern);
  const LANTERN_POWER = 7;
  // Paper plane mode: the walker becomes a small plane seen from behind, flying inside the house.
  let airplane = false;
  const plane = { x: 0, y: 0, z: 0, speed: 0, roll: 0, prevYaw: 0, model: null };
  const PLANE = { cruise: 1.5, max: 3.6, radius: 0.15, camBack: 0.75, camUp: 0.22, fov: 95 };
  let touchLook = null;   // { startX, startY, x, y } while one finger drags the view
  const keys = new Set();
  const raycaster = new THREE.Raycaster();
  raycaster.firstHitOnly = true;
  const tmpOrigin = new THREE.Vector3(), tmpDir = new THREE.Vector3();
  function colliders() { return built ? [...built.meshes, ...built.fixtureMeshes, world.ground] : [world.ground]; }
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
  function stepPlane(dt) {
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) + (stick.active ? stick.y : 0);
    const steer = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + (stick.active ? stick.x : 0);
    if (touchLook) {
      const dead = 10, rate = 0.014;
      const dx = touchLook.x - touchLook.startX, dy = touchLook.y - touchLook.startY;
      player.yaw -= Math.sign(dx) * Math.max(0, Math.abs(dx) - dead) * rate * dt;
      player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch - Math.sign(dy) * Math.max(0, Math.abs(dy) - dead) * rate * 0.7 * dt));
    }
    player.yaw -= steer * 1.9 * dt;
    // Cruise unless told otherwise: forward speeds up, back slows to a hover.
    const target = Math.max(0, Math.min(PLANE.max, PLANE.cruise + forward * 2.1));
    plane.speed += (target - plane.speed) * (1 - Math.exp(-3 * dt));
    const cp = Math.cos(player.pitch);
    const dir = new THREE.Vector3(-Math.sin(player.yaw) * cp, Math.sin(player.pitch), -Math.cos(player.yaw) * cp);
    const step = plane.speed * dt;
    if (step > 1e-5) {
      const hit = probe(plane.x, plane.y, plane.z, dir.x, dir.y, dir.z, step + PLANE.radius);
      if (hit) plane.speed = 0;   // a bump against a wall or a closed door
      else { plane.x += dir.x * step; plane.y += dir.y * step; plane.z += dir.z * step; }
    }
    // Keep off the floor and the ceiling, and on the lot.
    const down = probe(plane.x, plane.y, plane.z, 0, -1, 0, PLANE.radius + 0.02); if (down) plane.y = down.point.y + PLANE.radius + 0.02;
    const up = probe(plane.x, plane.y, plane.z, 0, 1, 0, PLANE.radius + 0.02); if (up) plane.y = Math.max(plane.y - 0.05, up.point.y - PLANE.radius - 0.02);
    plane.x = Math.max(LOT.x0 + 0.4, Math.min(LOT.x1 - 0.4, plane.x)); plane.z = Math.max(LOT.z0 + 0.4, Math.min(LOT.z1 - 0.4, plane.z));
    // Bank into turns.
    let dyaw = player.yaw - plane.prevYaw; dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw)); plane.prevYaw = player.yaw;
    plane.roll += ((-dyaw / Math.max(dt, 1e-3)) * 0.35 - plane.roll) * (1 - Math.exp(-6 * dt));
    plane.roll = Math.max(-0.9, Math.min(0.9, plane.roll));
    const m = plane.model;
    m.position.set(plane.x, plane.y, plane.z);
    m.rotation.set(player.pitch, player.yaw, 0, 'YXZ'); m.userData.bank(plane.roll);
    // Chase camera behind and a little above, looking along the flight.
    camera.position.set(plane.x - dir.x * PLANE.camBack, plane.y + PLANE.camUp - dir.y * PLANE.camBack * 0.4, plane.z - dir.z * PLANE.camBack);
    camera.lookAt(plane.x + dir.x * 0.6, plane.y + dir.y * 0.6, plane.z + dir.z * 0.6);
    player.x = plane.x; player.z = plane.z; player.footY = plane.y - 0.2; player.eyeY = camera.position.y; player.speed = plane.speed;
    const fov = PLANE.fov / zoomLevel;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }
  function setAirplane(on) {
    if (mode !== 'walk' || airplane === on) return;
    airplane = on;
    if (on) {
      if (!plane.model) { plane.model = createPaperPlane(); scene.add(plane.model); }
      plane.x = player.x; plane.y = player.footY + EYE_HEIGHT - 0.2; plane.z = player.z; plane.speed = 0; plane.roll = 0; plane.prevYaw = player.yaw;
      plane.model.visible = true;
      showHint('Paper plane: fly with the stick or W A S D, look to steer · P to land');
    } else {
      plane.model.visible = false;
      player.x = plane.x; player.z = plane.z;
      const g = groundHeight(); player.footY = g !== null ? g : built.floorTop; player.vx = player.vz = player.vy = 0;
      camera.fov = BASE_FOV; camera.updateProjectionMatrix();
      showHint(WALK_HINT);
    }
    syncTunePanel();
  }
  function stepLantern(dt) {
    // On while moving; the free mask slot keeps it unmasked whatever room the walker is in.
    const moving = player.speed > 0.05;
    const target = moving ? LANTERN_POWER : 0;
    lantern.intensity += (target - lantern.intensity) * (1 - Math.exp(-6 * dt));
    lantern.visible = mode === 'walk' && lantern.intensity > 0.02;
    if (airplane) lantern.position.set(plane.x, plane.y + 0.12, plane.z);   // above the plane, so its top face reads
    else lantern.position.set(camera.position.x, camera.position.y - 0.25, camera.position.z);
  }
  function stepPlayer(dt) {
    if (airplane) { stepPlane(dt); return; }
    // Keys give unit steps relative to the head. The touch stick gives an analog vector relative to the heading
    // it was engaged at (stick.refYaw), and the head turns toward the direction of travel while it is held.
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    const strafe = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
    // Touch look: while the finger stays displaced from where it touched, the view keeps turning at a rate set by the offset.
    if (touchLook) {
      const dead = 10, rate = 0.014;   // rad/s per pixel beyond the dead zone
      const dx = touchLook.x - touchLook.startX, dy = touchLook.y - touchLook.startY;
      const ox = Math.sign(dx) * Math.max(0, Math.abs(dx) - dead), oy = Math.sign(dy) * Math.max(0, Math.abs(dy) - dead);
      player.yaw -= ox * rate * dt;
      player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch - oy * rate * 0.7 * dt));
    }
    if (forward || strafe) zoomTarget = 1;
    zoomLevel += (zoomTarget - zoomLevel) * Math.min(1, dt * 10);
    const fov = BASE_FOV / zoomLevel;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    let tx = 0, tz = 0;
    if (forward || strafe) {
      const len = Math.hypot(forward, strafe), speed = run ? RUN_SPEED : WALK_SPEED;
      const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
      tx += ((-sy * forward) + (cy * strafe)) / len * speed;
      tz += ((-cy * forward) - (sy * strafe)) / len * speed;
    }
    const stickLen = Math.hypot(stick.x, stick.y);
    if (stick.active && stickLen > 0.08) {
      // Direction of travel in the world, from the heading at engagement. Full deflection walks, the rim runs.
      const sy = Math.sin(stick.refYaw), cy = Math.cos(stick.refYaw);
      const dx = ((-sy * stick.y) + (cy * stick.x)) / stickLen, dz = ((-cy * stick.y) - (sy * stick.x)) / stickLen;
      const speed = (stickLen > 0.85 ? RUN_SPEED : WALK_SPEED) * Math.min(1, stickLen);
      tx += dx * speed; tz += dz * speed;
      // The head turns toward the direction of travel, shortest way round, and settles on it.
      const target = Math.atan2(-dx, -dz);
      let delta = target - player.yaw; delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      const turn = Math.min(Math.abs(delta), 2.6 * dt * Math.min(1, stickLen * 1.5));
      player.yaw += Math.sign(delta) * turn;
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

  // ---------------------------------------------------------------- downlights update (as tour.js)
  // The nearest fixtures take the pooled spot lights (fading in and out as the walker moves); the nearest few of
  // those cast real shadow maps, the rest are confined by their room boxes.
  let shadowPickTimer = 0;
  const ledDistance = new Map();
  function setMappedLights(on) {
    if (!built) { mappedLights = on; return; }
    if (on && !built.baked) {
      const t0 = performance.now();
      built.baked = bakeLightMaps(built.meshes, built.leds, { power: tune.power, halo: tune.halo, floorScale: tune.floor, wallScale: tune.wall, extraMeshes: built.fixtureMeshes });
      console.info(`[plan] baked light maps in ${Math.round(performance.now() - t0)} ms: ${built.baked.maps.size} maps, ${built.baked.emitters} bounce patches`);
    }
    mappedLights = on;
    built.baked?.apply(on);
    if (on) built.baked.setIntensity(tune.power / built.baked.bakedPower);
    // Baked: the run-time lights leave the scene, so every shader drops its spot and point light loops.
    for (const s of built.spots) { s.intensity = 0; s.visible = !on; if (s.userData.halo) { s.userData.halo.intensity = 0; s.userData.halo.visible = !on; } }
    renderer.shadowMap.needsUpdate = true; sceneDirty = 3;
  }
  function updateLights(dt) {
    if (!built || !built.spots.length) return;
    if (mappedLights) { if (built.baked) built.baked.setIntensity(tune.power / built.baked.bakedPower); roomMask.haloSlot[0] = FREE_SLOT; return; }
    const { spots, leds } = built;
    const eye = camera.position;
    for (const led of leds) ledDistance.set(led, Math.hypot(led.world[0] - eye.x, led.world[1] - eye.y, led.world[2] - eye.z));
    const wanted = [...leds].sort((a, b) => ledDistance.get(a) - ledDistance.get(b)).slice(0, spots.length);
    const wantedSet = new Set(wanted);
    let changed = false;
    const served = new Set();
    for (const spot of spots) { if (spot.userData.led && wantedSet.has(spot.userData.led)) { served.add(spot.userData.led); spot.userData.target = 1; } else spot.userData.target = 0; }
    for (const spot of spots) {
      if (spot.userData.target === 0 && spot.userData.current < 0.02) {
        const next = wanted.find(led => !served.has(led));
        if (next) {
          spot.userData.led = next; served.add(next); spot.userData.target = 1; spot.userData.current = 0;
          spot.position.set(next.world[0], next.world[1], next.world[2]);
          spot.target.position.set(next.world[0], next.world[1] - 3, next.world[2]);
          spot.target.updateMatrixWorld();
          spot.userData.halo?.position.set(next.world[0], next.world[1] - 0.06, next.world[2]);
          changed = true;
        }
      }
    }
    for (const spot of spots) {
      const k = 1 - Math.exp(-10 * dt);
      spot.userData.current += (spot.userData.target - spot.userData.current) * k;
      spot.color.setRGB(1, 0.90, 0.76);
      spot.intensity = spot.userData.led ? spot.userData.current * tune.power : 0;
      if (spot.userData.halo) { spot.userData.halo.color.copy(spot.color); spot.userData.halo.intensity = spot.intensity * tune.halo; }
      spot.visible = true;
    }
    shadowPickTimer += dt;
    if (shadowPickTimer > 0.5 || changed) {
      shadowPickTimer = 0;
      const candidates = spots.filter(s => s.userData.led && s.intensity > 0.01).sort((a, b) => ledDistance.get(a.userData.led) - ledDistance.get(b.userData.led));
      const current = spots.filter(s => s.castShadow);
      const desired = candidates.slice(0, RENDER.shadowSpots);
      const farthestKept = current.length ? Math.max(...current.map(s => ledDistance.get(s.userData.led) ?? Infinity)) : Infinity;
      const needSwap = current.length !== desired.length || desired.some(s => !s.castShadow && (ledDistance.get(s.userData.led) + 1.0) < farthestKept);
      if (needSwap) {
        const keep = new Set(desired);
        for (const s of spots) if (s.castShadow !== keep.has(s)) { s.castShadow = keep.has(s); s.shadow.needsUpdate = true; }
        changed = true;
      }
    }
    // three.js lists shadow-casting spot lights first, so the mask slots follow that order.
    const order = [...spots.filter(s => s.castShadow), ...spots.filter(s => !s.castShadow)];
    order.forEach((s, idx) => { const led = s.userData.led; if (led) roomMask.setRoom(idx, led.boxes, led.yLo, led.yHi, s.castShadow); else roomMask.setRoom(idx, [], 0, 0); });
    spots.forEach((s, i) => { roomMask.haloSlot[i] = order.indexOf(s); });
    roomMask.haloSlot[spots.length] = FREE_SLOT;   // the lantern follows every halo in the light list
    if (changed) { renderer.shadowMap.needsUpdate = true; sceneDirty = 3; }
  }

  // ---------------------------------------------------------------- fixtures: target, use, outline (as tour.js)
  let focusFixture = null;
  function centreTarget(ndcX = 0, ndcY = 0) {
    if (!built || !built.fixtures.length) return null;
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    raycaster.near = 0; raycaster.far = 2.8;
    raycaster.firstHitOnly = false;
    const hits = raycaster.intersectObjects([...built.meshes, ...built.fixtures], true);
    raycaster.firstHitOnly = true;
    if (!hits.length) return null;
    hits.sort((a, b) => a.distance - b.distance);
    const nearest = hits[0].distance;
    for (const h of hits) {
      if (h.distance > nearest + 0.03) break;   // only what is at the front surface
      let o = h.object;
      while (o && !o.userData.fixture) o = o.parent;
      if (o?.userData.fixture?.toggle) return o;
    }
    return null;
  }
  function activateFixture(group) {
    const f = group?.userData.fixture;
    if (!f?.toggle) return;
    // A door swings away from the walker: the walker's side of the wall in fixture-local z decides.
    const local = group.worldToLocal(new THREE.Vector3(player.x, player.footY + 1, player.z));
    f.toggle(local.z > 0 ? 1 : -1);
    window.ResidenceSound?.play(f.kind === 'hinged door' ? 'door-handle' : 'slider-move');
    // A cupboard door: the skeleton pops in behind it as it opens, and leaves when it closes. One skeleton only.
    if (f.smallSpace && f.smallSpace.space.volume <= confinedVolume) {
      if (f.open) showSkeleton(group, f);
      else if (built.skeletonDoor === group) { built.skeleton.visible = false; built.skeletonDoor = null; }
    }
  }
  function showSkeleton(group, f) {
    const { space, side } = f.smallSpace, sk = built.skeleton;
    const fr = built.frame;
    // Space centre in world, and the door's own position; the skeleton faces the door from the back of the space.
    const cx = (space.x0 + space.x1) / 2 - fr.cx, cz = -((space.y0 + space.y1) / 2 - fr.cy);
    const door = new THREE.Vector3(); group.getWorldPosition(door);
    const yaw = Math.atan2(door.x - cx, door.z - cz);
    const fit = Math.min(1, (Math.min(space.x1 - space.x0, space.y1 - space.y0) - 0.06) / 0.5, (space.ceiling - 0.05) / 1.75);
    const scale = Math.max(0.35, fit);
    const toward = new THREE.Vector3(door.x - cx, 0, door.z - cz).normalize();
    const to = new THREE.Vector3(cx, built.floorTop, cz).addScaledVector(toward, 0.12);
    const from = new THREE.Vector3(cx, built.floorTop, cz).addScaledVector(toward, -0.15);
    built.skeletonDoor = group;
    built.skeletonPop = popIn(sk, { from, to, scale, yaw });
    void side;
  }
  function stepFixtures(dt) {
    let moving = false;
    for (const g of built?.fixtures || []) if (g.userData.fixture.step?.(dt)) moving = true;
    if (built?.skeletonPop && built.skeletonPop.step(dt)) moving = true;
    return moving;
  }
  // Lime silhouette on the fixture under the crosshair (the tour's mask pass): the whole assembly in white into
  // a half-size mask, depth-tested against the scene, then a rim where the mask ends.
  let outlineMeshes = [], outlineOwner = null, outlineTarget = null;
  const OUTLINE_LAYER = 7;
  const outlineDepthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
  const outlineWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false });
  const outlineQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: { tMask: { value: null }, texel: { value: new THREE.Vector2(1 / 512, 1 / 512) }, color: { value: new THREE.Color(0x9dff1f) } },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `uniform sampler2D tMask; uniform vec2 texel; uniform vec3 color; varying vec2 vUv;
      void main() {
        float c = texture2D(tMask, vUv).r;
        if (c > 0.5) discard;
        float m = 0.0;
        for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++) m = max(m, texture2D(tMask, vUv + vec2(float(i), float(j)) * texel).r);
        if (m < 0.5) discard;
        gl_FragColor = vec4(color, 0.95);
      }`
  }));
  outlineQuad.frustumCulled = false;
  const outlineScene = new THREE.Scene(); outlineScene.add(outlineQuad);
  const outlineCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  function updateOutline(owner) {
    if (owner === outlineOwner) return;
    outlineOwner = owner;
    outlineMeshes = owner ? owner.userData.fixture.meshes.slice() : [];
  }
  function drawOutline() {
    if (!outlineMeshes.length) return;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const w = Math.max(2, Math.round(size.x / 2)), h = Math.max(2, Math.round(size.y / 2));
    if (!outlineTarget) outlineTarget = new THREE.WebGLRenderTarget(w, h, { depthBuffer: true, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    else if (outlineTarget.width !== w || outlineTarget.height !== h) outlineTarget.setSize(w, h);
    const prevTarget = renderer.getRenderTarget(), prevAuto = renderer.autoClear, prevTone = renderer.toneMapping;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setRenderTarget(outlineTarget);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    scene.overrideMaterial = outlineDepthOnly;
    renderer.render(scene, camera);
    for (const m of outlineMeshes) m.layers.enable(OUTLINE_LAYER);
    const savedMask = camera.layers.mask; camera.layers.set(OUTLINE_LAYER);
    scene.overrideMaterial = outlineWhite;
    renderer.autoClear = false;
    renderer.render(scene, camera);
    camera.layers.mask = savedMask;
    for (const m of outlineMeshes) m.layers.disable(OUTLINE_LAYER);
    scene.overrideMaterial = null;
    renderer.setRenderTarget(prevTarget);
    renderer.toneMapping = prevTone;
    outlineQuad.material.uniforms.tMask.value = outlineTarget.texture;
    outlineQuad.material.uniforms.texel.value.set(1 / w, 1 / h);
    renderer.render(outlineScene, outlineCamera);
    renderer.autoClear = prevAuto;
  }

  const viewFrustum = new THREE.Frustum(), viewMatrix = new THREE.Matrix4();
  // ---------------------------------------------------------------- frame loop
  let lastTime = 0, frames = 0, fpsTime = 0, fps = 0;
  let lastPoseKey = '', sceneDirty = 3;
  function frame(time) {
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    if (mode === 'walk') stepPlayer(dt);
    else { if (flying) flying(time); applyOrbit(); }
    stepLantern(dt);
    updateEnvironment(dt);
    if (stepFixtures(dt)) { renderer.shadowMap.needsUpdate = true; for (const s of built?.spots || []) if (s.castShadow) s.shadow.needsUpdate = true; world.sun.shadow.needsUpdate = true; sceneDirty = 3; }
    updateLights(dt);
    const poseKey = `${camera.position.x.toFixed(3)}|${camera.position.y.toFixed(3)}|${camera.position.z.toFixed(3)}|${camera.rotation.x.toFixed(4)}|${camera.rotation.y.toFixed(4)}|${zoomLevel.toFixed(3)}`;
    if (poseKey !== lastPoseKey || tune.clock) sceneDirty = 3;
    lastPoseKey = poseKey;
    const changing = !RENDER.lessOften || sceneDirty > 0;
    if (sceneDirty > 0) sceneDirty--;
    envFrame++;
    if (changing && (RENDER.lessOften || envFrame % 4 === 0)) {
      // Live environment map from the eye, one cube face per frame (mirror hidden).
      const hidden = built ? [built.reflector, built.lens, ...built.mirrors].filter(o => o.visible) : [];
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
    if (built) {
      // Reflections: one bounce only. While any reflector renders, every other reflector and the lit lens discs
      // are hidden, so the picture shows the plain surfaces beneath them and no mirror-in-mirror.
      const allReflectors = [built.reflector, ...built.mirrors];
      const renderOnce = r => {
        if (!changing && r.userData.fresh) return;
        const others = [...allReflectors.filter(o => o !== r), built.lens].filter(o => o.visible);
        others.forEach(o => { o.visible = false; });
        r.userData.renderMirror.call(r, renderer, scene, camera, r.geometry, r.material, null);
        others.forEach(o => { o.visible = true; });
        r.userData.fresh = true;
      };
      // Floor reflection, skipped while the floor is out of view (looking up).
      const r = built.reflector;
      const floorInView = built.reflector.geometry.attributes.position.count > 3 && (mode !== 'walk' || player.pitch < 0.42);
      r.visible = floorInView;
      if (!floorInView) r.userData.fresh = false;
      if (floorInView && (envFrame % RENDER.reflectEvery === 0 || !r.userData.fresh)) renderOnce(r);
      // Robe mirrors: each is a full scene re-render, so only the ones close by and on screen are refreshed.
      let mirrorIndex = 0;
      for (const rm of built.mirrors) {
        rm.updateWorldMatrix(true, false);
        const pos = new THREE.Vector3().setFromMatrixPosition(rm.matrixWorld);
        const dist = camera.position.distanceTo(pos);
        let show = mode === 'walk' && dist < 6;
        if (show) {
          camera.updateMatrixWorld();
          viewFrustum.setFromProjectionMatrix(viewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
          rm.geometry.computeBoundingSphere?.();
          show = viewFrustum.intersectsObject(rm);
        }
        rm.visible = show;
        if (!show) rm.userData.fresh = false;
        else if (dist < 2.5 || (envFrame + mirrorIndex) % 2 === 0) renderOnce(rm);
        mirrorIndex++;
      }
    }
    if (mode === 'walk') { focusFixture = centreTarget(); crosshair.dataset.target = focusFixture ? 'true' : 'false'; useButton.dataset.target = focusFixture ? 'true' : 'false'; updateOutline(focusFixture); }
    else if (focusFixture) { focusFixture = null; updateOutline(null); }
    renderer.render(scene, camera);
    drawOutline();
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
      for (const s of built.spots) s.shadow.needsUpdate = true;
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
    keys.clear(); releaseStick(); touchLook = null;
    if (airplane) { airplane = false; plane.model.visible = false; player.x = plane.x; player.z = plane.z; player.footY = built.floorTop; camera.fov = BASE_FOV; camera.updateProjectionMatrix(); }
    lantern.visible = false; lantern.intensity = 0;
    focusFixture = null; updateOutline(null); crosshair.dataset.target = 'false';
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
    tunePanel.querySelector('input[name="mapped"]').checked = mappedLights;
    tunePanel.querySelector('input[name="airplane"]').checked = airplane;
  }
  function applyTune() {
    mats.setGlass(tune.glass);
    roomMask.scale.floor.value = tune.floor; roomMask.scale.wall.value = tune.wall;
    try { localStorage.setItem(TUNE_KEY, JSON.stringify(tune)); } catch (_) { /* no storage */ }
  }
  tunePanel.addEventListener('input', e => {
    if (e.target.name === 'clock') { tune.clock = e.target.checked ? 1 : 0; applyTune(); return; }
    if (e.target.name === 'mapped') { setMappedLights(e.target.checked); return; }
    if (e.target.name === 'airplane') { setAirplane(e.target.checked); return; }
    if (e.target.name in tune) { tune[e.target.name] = Number(e.target.value); if (e.target.name === 'hour') tune.clock = 0; applyTune(); syncTunePanel(); }
  });
  tunePanel.querySelector('[data-reset]').addEventListener('click', () => { Object.assign(tune, TUNE_DEFAULTS); applyTune(); syncTunePanel(); });
  tunePanel.querySelector('[data-close]').addEventListener('click', () => setTuning(false));
  tunePanel.addEventListener('keydown', e => e.stopPropagation());
  function setTuning(open) {
    tuningOpen = open;
    tunePanel.hidden = !open;
    if (open) { keys.clear(); releaseStick(); }
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
    if (e.code === 'KeyL') { setMappedLights(!mappedLights); syncTunePanel(); showHint(mappedLights ? 'House lights: baked light maps' : 'House lights: real time'); return; }
    if (e.code === 'KeyP' && mode === 'walk') { setAirplane(!airplane); return; }
    if (mode !== 'walk') return;
    if (e.code === 'Escape') { if (tuningOpen) { setTuning(false); return; } exitWalk(); return; }
    if (tuningOpen) return;   // the settings panel holds the tour until it is closed
    if (e.code === 'KeyE' || e.code === 'Space') { activateFixture(focusFixture); e.preventDefault(); return; }
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
  let press = null, pinch = null, tap = null;
  tourCanvas.addEventListener('contextmenu', e => e.preventDefault());
  tourCanvas.addEventListener('pointerdown', e => {
    if (tuningOpen && mode === 'walk') return;
    if (e.pointerType === 'touch') { pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomTarget, distance: orbit.distance }; press = null; } }
    if (mode === 'walk') {
      if (e.pointerType !== 'touch' && document.pointerLockElement !== tourCanvas) { dragging = true; lastX = e.clientX; lastY = e.clientY; tourCanvas.requestPointerLock?.(); }
      if (e.pointerType === 'touch') { dragging = true; lastX = e.clientX; lastY = e.clientY; tap = { x: e.clientX, y: e.clientY, t: performance.now() }; if (pointers.size === 1) touchLook = { startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY }; }
      else if (e.button === 0) activateFixture(focusFixture);
      return;
    }
    if (pointers.size > 1) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    press = { x: e.clientX, y: e.clientY, t: performance.now(), button: e.button, mod: e.shiftKey || e.ctrlKey || e.altKey || e.metaKey, pan: e.button === 2 || e.button === 1 || e.shiftKey };
    tourCanvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  tourCanvas.addEventListener('pointermove', e => {
    if (tuningOpen && mode === 'walk') return;
    if (e.pointerType === 'touch' && pointers.has(e.pointerId)) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2) touchLook = null;
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y) / pinch.d;
        if (mode === 'walk') zoomTarget = THREE.MathUtils.clamp(pinch.zoom * d, 1, 4); else orbit.distance = THREE.MathUtils.clamp(pinch.distance / d, 2, 400);
        return;
      }
    }
    if (mode === 'walk') {
      if (document.pointerLockElement === tourCanvas) look(e.movementX, e.movementY);
      else if (dragging && e.pointerType === 'touch') { if (touchLook) { touchLook.x = e.clientX; touchLook.y = e.clientY; } }
      else if (dragging) { look(e.clientX - lastX, e.clientY - lastY); lastX = e.clientX; lastY = e.clientY; }
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
    if (tuningOpen && mode === 'walk') { tap = null; press = null; return; }
    if (e.pointerType === 'touch') { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; }
    dragging = pointers.size > 0;
    if (e.pointerType === 'touch' && pointers.size === 0) touchLook = null;
    if (mode === 'walk' && tap && e.pointerType === 'touch' && pointers.size === 0) {
      // A still tap uses the door under the finger, else the one under the centre mark.
      if (performance.now() - tap.t < 400 && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 12) {
        const ndcX = (e.clientX / window.innerWidth) * 2 - 1, ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
        activateFixture(centreTarget(ndcX, ndcY) || focusFixture);
      }
      tap = null;
    }
    if (mode !== 'overview' || !press) return;
    const p = press; press = null;
    if (p.moved || p.mod || p.pan || performance.now() - p.t > 450) return;
    const floor = floorHitAt(e.clientX, e.clientY);
    if (floor) enterWalk(floor);
  };
  tourCanvas.addEventListener('pointerup', endPointer);
  tourCanvas.addEventListener('pointercancel', endPointer);
  // Touch controls: analog stick (bottom left), Use (bottom right), settings and exit (top right).
  const stickEl = document.getElementById('tour-stick'), knob = stickEl.querySelector('.stick-knob');
  const useButton = document.getElementById('tour-use');
  let stickPointer = null, stickCentre = null;
  function releaseStick() { stick.x = stick.y = 0; stick.active = false; stickPointer = null; stickEl.dataset.active = 'false'; knob.style.transform = ''; }
  stickEl.addEventListener('pointerdown', e => {
    if (tuningOpen || stickPointer !== null) return;
    const r = stickEl.getBoundingClientRect();
    stickCentre = { x: r.left + r.width / 2, y: r.top + r.height / 2, radius: r.width / 2 - 20 };
    stickPointer = e.pointerId; stick.active = true; stick.refYaw = player.yaw; stickEl.dataset.active = 'true';
    stickEl.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  stickEl.addEventListener('pointermove', e => {
    if (e.pointerId !== stickPointer) return;
    let dx = e.clientX - stickCentre.x, dy = e.clientY - stickCentre.y;
    const len = Math.hypot(dx, dy), max = stickCentre.radius;
    if (len > max) { dx *= max / len; dy *= max / len; }
    stick.x = dx / max; stick.y = -dy / max;   // up on the pad is forward
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    zoomTarget = 1;
    e.preventDefault();
  });
  for (const type of ['pointerup', 'pointercancel']) stickEl.addEventListener(type, e => { if (e.pointerId === stickPointer) releaseStick(); });
  stickEl.addEventListener('contextmenu', e => e.preventDefault());
  useButton.addEventListener('pointerdown', e => { e.preventDefault(); if (!tuningOpen) activateFixture(focusFixture); });
  useButton.addEventListener('contextmenu', e => e.preventDefault());
  document.getElementById('tour-settings').addEventListener('click', () => { if (mode === 'walk') setTuning(!tuningOpen); });
  document.getElementById('tour-plane').addEventListener('click', () => { if (mode === 'walk') setAirplane(!airplane); });

  // ---------------------------------------------------------------- loading
  function setStatus(text, error = false) { loadStatus.textContent = text; loadStatus.dataset.error = error ? 'true' : 'false'; }
  async function loadJson(json, name) {
    if (mode === 'walk') exitWalk();
    loading.dataset.active = 'true';
    await new Promise(r => setTimeout(r, 30));
    try {
      buildModel(json, name);
      loadPanel.hidden = true;
      openButton.hidden = false;
      setStatus(`Loaded ${name}`);
      showHint(OVERVIEW_HINT);
      overviewIntro();
    } catch (err) {
      console.error('[plan] load failed', err);
      setStatus(`Cannot show ${name}: ${err.message}`, true);
      loadPanel.hidden = false;
    } finally { loading.dataset.active = 'false'; }
  }
  async function loadFile(file) {
    if (!file) return;
    setStatus(`Reading ${file.name}…`);
    try { await loadJson(JSON.parse(await file.text()), file.name); }
    catch (err) { setStatus(`Cannot read ${file.name}: ${err.message}`, true); }
  }
  async function loadUrl(url) {
    setStatus(`Loading ${url}…`);
    try { const res = await fetch(url); if (!res.ok) throw new Error(`HTTP ${res.status}`); await loadJson(await res.json(), url.split('/').pop() || url); }
    catch (err) { setStatus(`Cannot load ${url}: ${err.message}`, true); loadPanel.hidden = false; }
  }
  fileInput.addEventListener('change', () => { loadFile(fileInput.files[0]); fileInput.value = ''; });
  openButton.addEventListener('click', () => { loadPanel.hidden = false; });
  loadPanel.querySelector('[data-close]').addEventListener('click', () => { if (built) loadPanel.hidden = true; });
  window.addEventListener('dragover', e => { e.preventDefault(); body.dataset.dragging = 'true'; });
  window.addEventListener('dragleave', e => { if (!e.relatedTarget) body.dataset.dragging = 'false'; });
  window.addEventListener('drop', e => { e.preventDefault(); body.dataset.dragging = 'false'; loadFile(e.dataTransfer.files[0]); });

  // ---------------------------------------------------------------- start
  applyQuality();
  applyOrbit();
  lastTime = performance.now();
  renderer.setAnimationLoop(frame);
  const src = new URLSearchParams(location.search).get('src');
  if (src) loadUrl(src); else setStatus('');

  window.PlanTour = Object.freeze({ load: loadJson, loadUrl, enterWalk, exitWalk, probe, blocked, groundHeight, activate: activateFixture, centreTarget, setMappedLights, setAirplane, get airplane() { return airplane; }, setConfinedVolume: v => { confinedVolume = v; }, get mappedLights() { return mappedLights; }, get renderer() { return renderer; }, benchmark, setQuality, RENDER, THREE, get mode() { return mode; }, get player() { return player; }, get orbit() { return orbit; }, get camera() { return camera; }, get scene() { return scene; }, get built() { return built; } });
})();
