/*
 * Residence virtual tour.
 *
 * Overview mode: the original custom WebGL engine (residence-model.js) renders into #scene.
 * Walking mode:  this module rebuilds the same geometry in three.js with physically based
 *                materials, shadow-casting ceiling downlights, sun through the windows,
 *                planar floor reflection and ambient occlusion, then drives a
 *                first-person controller with gravity, stairs and wall collision.
 *
 * Enter: click any floor in the overview.  Exit: Esc (or the Exit button).
 * Build: cd tour/build && npm run build   ->  tour/js/tour.bundle.js
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

(() => {
  'use strict';
  const R = window.RESIDENCE;
  if (!R) { console.error('[tour] residence engine export missing'); return; }

  // ---------------------------------------------------------------- constants
  const EYE_HEIGHT = 1.70;          // viewing eye level above the floor (m)
  const PLAYER_RADIUS = 0.28;
  const STEP_MAX = 0.30;            // stair risers are 0.172 m
  const WALK_SPEED = 1.45, RUN_SPEED = 2.8;
  const GRAVITY = 9.81;
  const UPPER_CEILING = R.PARAMS.WALL_HEIGHT;                                   // 2.440 m above the upper floor
  const GROUND_CEILING = R.PARAMS.GROUND_FLOOR_DATUM + R.PARAMS.GROUND_WALL_HEIGHT; // 2.400 m above the ground floor
  // The engine leaves a void between the ground ceiling and the underside of the upper slab (-0.150). In the walk
  // scene the whole upper level drops by that gap so the slab rests on the ground ceiling; the stair is compressed
  // by the same amount so its top step still meets the lowered floor.
  const UPPER_SLAB_BOTTOM = -0.150;
  const UPPER_DROP = UPPER_SLAB_BOTTOM - GROUND_CEILING;                          // 0.202 m
  const STAIR_SCALE = (-UPPER_DROP - R.PARAMS.GROUND_FLOOR_DATUM) / (0 - R.PARAMS.GROUND_FLOOR_DATUM);
  const walkY = (level, y) => level === 'upper' ? y - UPPER_DROP : y;
  // Items tagged 'shared' (stair, its guard walls and rails, P6 raking wall) span both storeys: the part below
  // the upper datum is compressed with the stair, the part above moves down with the upper level.
  const isStairItem = item => item.level === 'shared' || /^stair-|stair-carpet|stair-step|stair-ground/.test(item.name);
  const sharedY = y => y <= 0 ? R.PARAMS.GROUND_FLOOR_DATUM + (y - R.PARAMS.GROUND_FLOOR_DATUM) * STAIR_SCALE : y - UPPER_DROP;
  const itemY = (item, y) => item.level === 'upper' ? y - UPPER_DROP : (isStairItem(item) ? sharedY(y) : y);
  const FLOOR_CATEGORIES = new Set(['floor', 'finishFloor', 'finishCarpet', 'stair', 'wet']);
  // Single render setting.
  // dpr: cap on the device pixel ratio (screens above 2 show no difference). lessOften: skip the environment
  // cube map and the reflector renders while nothing on screen changes, and spread the cube map one face per frame.
  const TOUCH = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  // lights: fixtures lit at once (the nearest); haloLights: a point light under each fixture (off: wider cone
  // instead); physical: MeshPhysicalMaterial for flat paints (off: the cheaper standard shader, same look);
  // cell: draw-bucket size in metres; cull: hide the other level's interior away from the stair; direct: draw
  // straight to the canvas when ambient occlusion is off (no post-processing pass); reflectEvery: floor
  // reflection refresh interval in frames.
  const RENDER = { dpr: TOUCH ? 1 : 1.25, msaa: 2, reflection: 0.3, reflectEvery: 2, ao: false, sunShadow: 1024, shadowSpots: TOUCH ? 2 : 3, shadowSize: 512, aoSamples: 8, lessOften: true,
    lights: 8, haloLights: false, physical: false, cell: 8, cull: true, direct: true };   // O toggles ambient occlusion
  // Every fixture on the current level gets its own light, so nothing switches on or off while you walk a floor.
  // (The other level's fixtures sit behind its slab; the room mask keeps them out anyway.)
  const SPOT_POOL = Math.min(RENDER.lights, Math.max(1, ...['upper', 'ground'].map(level => R.ceilingLEDs.filter(led => led.state.level === level).length)));
  // Lighting tuning (T opens the slider panel in walk mode; values persist in localStorage).
  const TUNE_DEFAULTS = { power: 9, floor: 0.6, wall: 1.0, base: 1.0, exposure: 0.5, hour: 14, clock: 1, glass: 2.4, halo: 0.15 };
  const SIM_SECONDS_PER_REAL_SECOND = 3600 / 2.5;  // 0.1 simulated hour per 250 ms real time (2.5 s = 1 hour)
  const IS_TOUCH_DEVICE = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const TUNE_KEY = 'residence.tour.lighting.v1';
  const tune = { ...TUNE_DEFAULTS };
  try { Object.assign(tune, JSON.parse(localStorage.getItem(TUNE_KEY) || '{}')); } catch (_) { /* no storage */ }
  tune.clock = 1;   // the day always runs when the page opens
  // Per-surface scale for direct downlight; shared uniform objects so slider changes reach every material.
  const lightScale = { floor: { value: tune.floor }, wall: { value: tune.wall }, screen: { value: 0.2 } };
  const glassMaterials = [];   // env-map strength follows the Window reflection slider
  const BASE_FOV = 68;
  let zoomTarget = 1, zoomLevel = 1;   // mouse wheel zoom in walk mode; walking restores the default
  let showCones = false;            // hidden by default; H or the panel checkbox shows the downlight cone outlines

  // ---------------------------------------------------------------- DOM
  const body = document.body;
  const overviewCanvas = document.getElementById('scene');
  const tourCanvas = document.getElementById('tour-scene');
  const fade = document.getElementById('tour-fade');
  const hint = document.getElementById('tour-hint');
  const stats = document.getElementById('tour-stats');
  const crosshair = document.getElementById('tour-crosshair');
  const targetLabel = document.getElementById('tour-target');
  const loading = document.getElementById('tour-loading');
  const exitButton = document.getElementById('tour-exit');
  const tunePanel = document.getElementById('tour-tune');

  const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  document.body.dataset.touch = isTouch ? 'true' : 'false';
  const OVERVIEW_HINT = isTouch ? 'Tap any floor to walk inside' : 'Click any floor to walk inside · <kbd>1</kbd> ground · <kbd>2</kbd> upper · <kbd>3</kbd> both';
  const WALK_HINT = isTouch ? 'Drag to look · pinch to zoom · tap doors and switches · buttons walk' : '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Shift</kbd> run · mouse look · click doors and switches · <kbd>T</kbd> lighting · <kbd>H</kbd> cones · <kbd>O</kbd> occlusion · <kbd>Esc</kbd> exit';

  let mode = 'overview';
  let hintTimer = 0;
  function showHint(html, autoHide = true) {
    hint.innerHTML = html;
    hint.dataset.hidden = 'false';
    clearTimeout(hintTimer);
    if (autoHide) hintTimer = setTimeout(() => { hint.dataset.hidden = 'true'; }, 7000);
  }

  // Overview shows both levels in perspective so every floor can be clicked.
  R.resetView();
  R.setDirectLevel('both');
  // Intro pose, set before the engine draws its first frame: the plan view (north up), which then turns over
  // into the isometric view once the page is up (see overviewIntro).
  const INTRO_TO = { yaw: R.camera.yaw, pitch: R.camera.pitch, distance: R.camera.distance, target: [...R.camera.target] };
  R.camera.yaw = 0; R.camera.pitch = Math.PI / 2; R.camera.distance = INTRO_TO.distance * 1.05; R.camera.target = [...INTRO_TO.target];
  window.__RESIDENCE_PAUSED__ = false;   // tour.html pauses the engine until this pose is set, so no other frame shows first
  document.title = 'Residence Virtual Tour';
  showHint(OVERVIEW_HINT);

  // ---------------------------------------------------------------- overview click -> walk
  let pressStart = null;
  overviewCanvas.addEventListener('pointerdown', e => {
    pressStart = { x: e.clientX, y: e.clientY, t: performance.now(), button: e.button, mod: e.shiftKey || e.ctrlKey || e.altKey || e.metaKey };
  }, true);
  overviewCanvas.addEventListener('pointerup', e => {
    const start = pressStart; pressStart = null;
    if (!start || start.button !== 0 || start.mod) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6 || performance.now() - start.t > 450) return;
    const ray = R.pointerRay(e.clientX, e.clientY);
    const hit = R.physicalRayHit(ray.origin, ray.direction);
    if (!hit) return;
    const floor = floorHit(hit);
    if (floor) enterWalk(floor);
  }, true);

  function floorHit(hit) {
    const item = hit.item;
    if (!FLOOR_CATEGORIES.has(item.category)) return null;
    const [lo, hi] = item.shadowBounds;
    if (item.category === 'wet' && hi[1] - lo[1] > 0.12) return null;     // wall tiles, fixtures
    if (hit.point[1] < hi[1] - 0.03) return null;                          // side face, not the top
    return { x: hit.point[0], y: hi[1], z: hit.point[2] };
  }

  window.addEventListener('keydown', e => {
    if (mode !== 'overview') return;
    if (e.key === '1') R.setDirectLevel('ground');
    else if (e.key === '2') R.setDirectLevel('upper');
    else if (e.key === '3') R.setDirectLevel('both');
  });

  // ---------------------------------------------------------------- three.js renderer
  let renderer = null, composer = null, scene = null, camera = null, envTarget = null, envCamera = null, envFrame = 0;
  let passes = {};
  let built = null;            // walk scene build result
  let buildDirty = true;
  window.addEventListener('residence:floor-atlas', () => { if (!built || built.atlas !== R.floorAtlas) buildDirty = true; });

  function ensureRenderer() {
    if (renderer) return;
    renderer = new THREE.WebGLRenderer({ canvas: tourCanvas, antialias: true, powerPreference: 'high-performance', stencil: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;   // VSM broke spot-light shadow sampling here
    renderer.shadowMap.autoUpdate = false;
    camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.08, 220);
    camera.rotation.order = 'YXZ';
    scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;   // until the live cube map exists
    scene.environmentIntensity = 0.3;
    // Live environment: a small cube map rendered from the eye so glass, mirrors and the floor reflect the actual room.
    envTarget = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, type: THREE.HalfFloatType });
    envCamera = new THREE.CubeCamera(0.1, 60, envTarget);
    pmrem.dispose();
  }

  function applyQuality() {
    const q = RENDER;
    const dpr = Math.min(window.devicePixelRatio || 1, q.dpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (composer) composer.dispose?.();
    composer = null;
    const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
    if (q.direct && !q.ao) {
      // Straight to the canvas: tone mapping and colour space happen in the materials, the vignette is CSS.
      if (built) {
        built.sun.shadow.mapSize.set(q.sunShadow, q.sunShadow); built.sun.shadow.map?.dispose(); built.sun.shadow.map = null;
        built.reflector.getRenderTarget().setSize(Math.max(2, Math.round(w * q.reflection)), Math.max(2, Math.round(h * q.reflection)));
        renderer.shadowMap.needsUpdate = true;
      }
      return;
    }
    // HDR, multisampled scene target: MSAA plus the 2x pixel ratio stands in for the reference supersampling.
    const target = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: renderer.capabilities.isWebGL2 ? q.msaa : 0 });
    composer = new EffectComposer(renderer, target);
    composer.setPixelRatio(dpr);
    composer.setSize(window.innerWidth, window.innerHeight);
    passes = {};
    composer.addPass(new RenderPass(scene, camera));
    if (q.ao) {
      try {
        const ao = new GTAOPass(scene, camera, w, h);
        ao.output = GTAOPass.OUTPUT.Default;
        ao.updateGtaoMaterial({ radius: 0.16, distanceExponent: 1.0, thickness: 0.35, scale: 0.8, samples: q.aoSamples, distanceFallOff: 1.0, screenSpaceRadius: false });
        ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, radiusExponent: 1, rings: 2, samples: 16 });
        ao.blendIntensity = 0.38;
        composer.addPass(ao); passes.ao = ao;
      } catch (err) { console.warn('[tour] GTAO unavailable', err); }
    }
    composer.addPass(new OutputPass());
    // Vignette, as the reference composite.
    composer.addPass(new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv); vec2 q = vUv - 0.5; c.rgb *= 1.0 - dot(q, q) * 0.55; gl_FragColor = c; }'
    }));
    if (built) {
      built.sun.shadow.mapSize.set(q.sunShadow, q.sunShadow); built.sun.shadow.map?.dispose(); built.sun.shadow.map = null;
      const rw = Math.max(2, Math.round(w * q.reflection)), rh = Math.max(2, Math.round(h * q.reflection));
      built.reflector.getRenderTarget().setSize(rw, rh);
      renderer.shadowMap.needsUpdate = true;
    }
  }

  window.addEventListener('resize', () => { if (mode === 'walk' && renderer) applyQuality(); });

  // ---------------------------------------------------------------- material buckets
  function linearColor(c) { return new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace); }

  const SMOOTH_CATEGORIES = new Set(['door', 'slider', 'robe']);
  // Moving leaves of every mirrored robe slider (2-leaf robes and the 3-leaf slider alike).
  const isMirrorPanel = item => /-panel-\d+-moving$/.test(item.name) && item.physicalAction?.state?.kind === 'mirrored robe slider';
  const isShowerGlass = item => /^T18-SHOWER-.*-6mm-glass$/.test(item.name);
  function bucketType(item, kind, textured) {
    if (textured) return 'floorTex';
    if (isMirrorPanel(item)) return 'glassMirror';                               // mirrored robe slider panels carry a planar mirror
    if (isShowerGlass(item)) return 'glassPane';                                 // shower glass carries a planar mirror on both faces
    if (kind === 0 && SMOOTH_CATEGORIES.has(item.category)) return 'smooth';   // door leaves and frames: plain paint, no relief
    switch (kind) {
      case 1: return 'floorPlain';
      case 2: return 'carpet';
      case 3: return 'render';
      case 4: return 'metal';
      case 5: return 'glassClear';
      case 6: return 'glassGrey';
      case 7: return 'glassObscure';
      case 8: return 'trim';
      case 9: return 'tile';
      case 10: return 'ceramic';
      default: return 'paint';
    }
  }

  // Each pooled downlight is confined to its room by a shader mask on the room's bounds (two boxes plus a
  // height range per light). This replaces per-fixture shadow maps, which blacked the lights out on this GPU.
  const roomUniforms = {
    uRoomBoxA: { value: Array.from({ length: SPOT_POOL }, () => new THREE.Vector4()) },
    uRoomBoxB: { value: Array.from({ length: SPOT_POOL }, () => new THREE.Vector4()) },
    uRoomY: { value: Array.from({ length: SPOT_POOL }, () => new THREE.Vector2()) },
    uHaloSlot: { value: Array.from({ length: SPOT_POOL + 4 }, (_, i) => Math.min(i, SPOT_POOL - 1)) }   // halo i -> mask slot; spare entries keep extra point lights (mirror) in range
  };
  // The spot-light loop of three's lights_fragment_begin, with each fixture's full evaluation gated by the room
  // mask. A pixel then runs the BRDF for the one or two fixtures in its room, not for every fixture in the house.
  function spotLoopWithRoomGate() {
    const chunk = THREE.ShaderChunk.lights_fragment_begin;
    const start = chunk.indexOf('#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )');
    const end = chunk.indexOf('#pragma unroll_loop_end', start);
    let loop = chunk.slice(start, end);
    loop = loop
      .replace('spotLight = spotLights[ i ];', 'spotLight = spotLights[ i ];\n\t\tif ( roomMask( UNROLLED_LOOP_INDEX, roomWorldPos ) > 0.0 ) {')
      .replace('getSpotLightInfo( spotLight, geometryPosition, directLight );', 'getSpotLightInfo( spotLight, geometryPosition, directLight );\n\t\tdirectLight.color *= uLightScale;')
      .replace('RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t\t}');
    let out = chunk.slice(0, start) + loop + chunk.slice(end);
    // Point-light loop: the soft halo of fixture i shares its room box; lights past the pool (mirror) are free.
    const ps = out.indexOf('#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )');
    const pe = out.indexOf('#pragma unroll_loop_end', ps);
    let ploop = out.slice(ps, pe)
      .replace('pointLight = pointLights[ i ];', `pointLight = pointLights[ i ];\n\t\tif ( UNROLLED_LOOP_INDEX >= ${SPOT_POOL} || roomMask( uHaloSlot[ UNROLLED_LOOP_INDEX ], roomWorldPos ) > 0.0 ) {`)
      .replace('RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t\t}');
    return out.slice(0, ps) + ploop + out.slice(pe);
  }
  function patchRoomMask(material, surface = 'wall') {
    material.onBeforeCompile = shader => {
      shader.uniforms.uLightScale = lightScale[surface];
      shader.uniforms.uRoomBoxA = roomUniforms.uRoomBoxA;
      shader.uniforms.uRoomBoxB = roomUniforms.uRoomBoxB;
      shader.uniforms.uRoomY = roomUniforms.uRoomY;
      shader.uniforms.uHaloSlot = roomUniforms.uHaloSlot;
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <lights_fragment_begin>', 'vec3 roomWorldPos = cameraPosition + ( -vViewPosition ) * mat3( viewMatrix );\n#include <lights_fragment_begin>')
        .replace('#include <common>', `#include <common>
uniform float uLightScale;
uniform vec4 uRoomBoxA[${SPOT_POOL}];
uniform vec4 uRoomBoxB[${SPOT_POOL}];
uniform vec2 uRoomY[${SPOT_POOL}];
uniform int uHaloSlot[${SPOT_POOL + 4}];
float roomMask(int i, vec3 vRoomPos) {
  vec4 a = uRoomBoxA[i]; vec4 b = uRoomBoxB[i]; vec2 y = uRoomY[i];
  bool inA = vRoomPos.x >= a.x && vRoomPos.x <= a.z && vRoomPos.z >= a.y && vRoomPos.z <= a.w;
  bool inB = vRoomPos.x >= b.x && vRoomPos.x <= b.z && vRoomPos.z >= b.y && vRoomPos.z <= b.w;
  bool inY = vRoomPos.y >= y.x && vRoomPos.y <= y.y;
  return (inY && (inA || inB)) ? 1.0 : 0.0;
}`)
        // The light loop is still an unexpanded include here, so expand it and hook inside.
        .replace('#include <lights_fragment_begin>', spotLoopWithRoomGate());
    };
    material.customProgramCacheKey = () => 'roommask' + SPOT_POOL + surface;
    return material;
  }
  // Room boxes in world space for a light's room state (level height range included).
  function roomBoxesFor(state, slot, unmasked = false) {
    const a = roomUniforms.uRoomBoxA.value[slot], b = roomUniforms.uRoomBoxB.value[slot], y = roomUniforms.uRoomY.value[slot];
    if (unmasked) { a.set(-1e9, -1e9, 1e9, 1e9); b.set(1e9, 1e9, 1e9, 1e9); y.set(-1e9, 1e9); return; }   // shadow-mapped light: no box
    const pad = 0.05;
    const boxes = state ? state.bounds : [];
    const set = (v, box) => {
      if (!box) { v.set(1e9, 1e9, 1e9, 1e9); return; }
      const p = R.toWorld(box[0], 0, box[2]), q = R.toWorld(box[1], 0, box[3]);
      v.set(Math.min(p[0], q[0]) - pad, Math.min(p[2], q[2]) - pad, Math.max(p[0], q[0]) + pad, Math.max(p[2], q[2]) + pad);
    };
    set(a, boxes[0]); set(b, boxes[1]);
    if (!state) y.set(1e9, 1e9);
    else if (state.level === 'ground') y.set(R.PARAMS.GROUND_FLOOR_DATUM - 0.45, GROUND_CEILING + 0.05);   // garage slab is a course lower
    else y.set(-0.05 - UPPER_DROP, UPPER_CEILING + 0.05 - UPPER_DROP);
  }

  // Procedural relief maps, generated at load (no image files): fine fibre grain for carpet, soft plaster for walls.
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
  // Faint colour map built from a relief map, so the grain stays visible under flat light: mid grey 128 maps to
  // 'mean', and the relief height modulates it by 'depth' (0..1) of the height contrast.
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

  // Flat surfaces (paint, render, tile, trim, carpet, timber) need none of the physical layers: the standard shader
  // draws them the same for less per-pixel work. RENDER.physical restores the physical shader for comparison.
  const PHYSICAL_ONLY = ['clearcoat', 'clearcoatRoughness', 'sheen', 'sheenRoughness', 'specularIntensity', 'transmission', 'thickness', 'ior', 'reflectivity'];
  function surfaceMaterial(params) {
    if (RENDER.physical) return new THREE.MeshPhysicalMaterial(params);
    const p = { ...params }; for (const k of PHYSICAL_ONLY) delete p[k];
    return new THREE.MeshStandardMaterial(p);
  }
  function makeMaterial(type, alpha, atlas) {
    // Opaque surfaces are single-sided (see the winding pass); glass and translucent screens stay two-sided.
    const common = { side: (alpha >= 0.995 && !type.startsWith('glass')) ? THREE.FrontSide : THREE.DoubleSide, vertexColors: true };
    let m;
    switch (type) {
      case 'floorTex': {
        const finish = atlas.finish;
        const timber = atlas.family === 'engineered';
        const map = new THREE.CanvasTexture(atlas.image);
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        map.generateMipmaps = true; map.minFilter = THREE.LinearMipmapLinearFilter; map.magFilter = THREE.LinearFilter;
        map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
        // Grain relief and per-texel roughness come from the photographed boards themselves.
        m = surfaceMaterial({ ...common, vertexColors: false, map, color: 0xffffff,
          bumpMap: map, bumpScale: timber ? 0.010 : 0.016,
          roughnessMap: map, roughness: timber ? 0.55 : 0.68,
          metalness: 0, clearcoat: 0, envMapIntensity: 0.35, reflectivity: 0.5 + finish.reflection });
        break;
      }
      case 'floorPlain': m = surfaceMaterial({ ...common, roughness: 0.34, envMapIntensity: 0.35 }); break;
      case 'carpet': {
        const bumpMap = reliefTexture('carpet', 512, [[20000, 1.5, 120], [6000, 3, 100], [2500, 6, 90], [600, 12, 70]]);
        bumpMap.repeat.set(3, 3);   // world-metre UVs: tufts about 3 mm across
        const map = albedoFromRelief(bumpMap, 240, 0.9);
        m = surfaceMaterial({ ...common, roughness: 1, metalness: 0, sheen: 0.6, sheenRoughness: 0.9, envMapIntensity: 0.25, map, bumpMap, bumpScale: 0.08 });
        break;
      }
      case 'render': {
        const bumpMap = reliefTexture('render', 512, [[9000, 3, 120], [3000, 6, 90], [800, 14, 60]]);
        const map = albedoFromRelief(bumpMap, 250, 0.4);
        m = surfaceMaterial({ ...common, roughness: 0.95, envMapIntensity: 0.3, map, bumpMap, bumpScale: 0.10 });
        break;
      }
      case 'metal': m = surfaceMaterial({ ...common, roughness: 0.28, metalness: 0.92, envMapIntensity: 1.2 }); break;
      case 'glassClear': m = new THREE.MeshPhysicalMaterial({ ...common, vertexColors: false, color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.6, specularIntensity: 1.0 }); break;
      case 'glassGrey': m = new THREE.MeshPhysicalMaterial({ ...common, vertexColors: false, color: 0x3a4248, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.55, depthWrite: false, envMapIntensity: 1.6, specularIntensity: 1.0 }); break;
      // Surfaces under a planar mirror carry no environment reflection: the mirror is the only reflection, so
      // nothing doubles up or drifts with parallax. Direct light highlights stay.
      case 'glassMirror': m = new THREE.MeshPhysicalMaterial({ ...common, side: THREE.FrontSide, roughness: 0.12, metalness: 0, envMapIntensity: 0, specularIntensity: 1.0 }); break;
      case 'glassPane': m = new THREE.MeshPhysicalMaterial({ ...common, vertexColors: false, color: 0xe6edef, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.24, depthWrite: false, envMapIntensity: 0, specularIntensity: 1.0 }); break;
      case 'glassObscure': m = new THREE.MeshPhysicalMaterial({ ...common, vertexColors: false, color: 0xdfe3e4, roughness: 0.55, metalness: 0, transparent: true, opacity: 0.8, depthWrite: false, envMapIntensity: 0.8 }); break;
      case 'smooth': m = surfaceMaterial({ ...common, roughness: 0.55, metalness: 0, clearcoat: 0.08, clearcoatRoughness: 0.5, envMapIntensity: 0.4 }); break;
      case 'trim': m = surfaceMaterial({ ...common, roughness: 0.5, clearcoat: 0.12, clearcoatRoughness: 0.4, envMapIntensity: 0.35 }); break;
      case 'tile': m = surfaceMaterial({ ...common, roughness: 0.18, envMapIntensity: 0.6 }); break;
      case 'ceramic': m = new THREE.MeshPhysicalMaterial({ ...common, roughness: 0.1, clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: 0.9 }); break;
      default: {
        const bumpMap = reliefTexture('paint', 512, [[4000, 10, 70], [12000, 4, 60], [30000, 1.5, 50]]);
        bumpMap.repeat.set(1.5, 1.5);   // soft plaster roll texture on painted walls
        const map = albedoFromRelief(bumpMap, 251, 0.12);   // soft grain, close to white
        m = surfaceMaterial({ ...common, color: new THREE.Color(1.06, 1.06, 1.06), roughness: 0.86, metalness: 0, envMapIntensity: 0.4, map, bumpMap, bumpScale: 0.045 });
      }
    }
    if (alpha < 0.995 && !m.transparent) { m.transparent = true; m.opacity = alpha; m.depthWrite = false; }
    if (type.startsWith('glass')) { m.userData.baseEnv = m.envMapIntensity / 1.6; m.envMapIntensity = m.userData.baseEnv * tune.glass; glassMaterials.push(m); }
    // 3. Trims, frames and cover strips sit on wall and floor faces: pull them forward in depth so they never z-fight.
    if (type === 'trim' || type === 'metal') { m.polygonOffset = true; m.polygonOffsetFactor = -1; m.polygonOffsetUnits = -4; }
    return patchRoomMask(m, /^(floorTex|floorPlain|tile|carpet)$/.test(type) ? 'floor' : (alpha < 0.995 && !type.startsWith('glass') ? 'screen' : 'wall'));
  }

  // Board UV mapping mirrors the engine's plank shader: one atlas row per board, flips by seed.
  function floorUV(item, x, z, rows) {
    const tb = item.finishTextureBounds || item.finishBounds || [0, 0, 1, 1];
    const seed = item.finishTextureSeed ?? (((item.finishVariant || 0) + 0.37) / 9);
    const pu = Math.min(1, Math.max(0, (x - tb[0]) / Math.max(tb[2], 1e-4)));
    const pv = Math.min(1, Math.max(0, (z - tb[1]) / Math.max(tb[3], 1e-4)));
    const longX = !!item.finishLongAxisX;
    let across = longX ? pv : pu, along = longX ? pu : pv;
    const fr = v => v - Math.floor(v);
    if (fr(seed * 4.2817) > 0.5) along = 1 - along;
    if (fr(seed * 11.731) > 0.5) across = 1 - across;
    const row = Math.floor(fr(seed * 31.739) * rows);
    return [0.0025 + 0.995 * along, (row + 0.0195 + 0.961 * across) / rows];
  }

  // ---------------------------------------------------------------- scene build
  // Visibility as the engine computes it, but for every level at once (both floors are walkable).
  const CLIENT_HIDDEN = ['T03-O01-', 'T03-SG01-FLOOR-EDGE', 'T03-R02-FLOOR-EDGE', 'T03-R03-FLOOR-EDGE'];
  function itemAlpha(item) {
    if (!R.categoryState[item.category]) return 0;
    if (item.visibleWhen && !item.visibleWhen()) return 0;
    if (CLIENT_HIDDEN.some(prefix => item.name.startsWith(prefix))) return 0;
    return item.alpha * (item.alphaWhen ? item.alphaWhen() : 1);
  }

  // ---------------------------------------------------------------- closet skeleton
  // One procedural skeleton (three.js primitives, no assets). It waits inside a closet and is moved, while the
  // door is still shut, to whichever closet the walker opens next.
  const CLOSET_DOORS = new Set(['SG01', 'R02', 'R03', 'D06A', 'D06B', 'GF-D-LINEN-A', 'GF-D-LINEN-B', 'GF-D-PANTRY']);
  const boneMaterial = () => new THREE.MeshStandardMaterial({ color: 0xe6dfcd, roughness: 0.6, metalness: 0 });
  // Skull with jaw, eye sockets and a tooth line; origin at the skull centre, face toward +z.
  function buildSkull(bone = boneMaterial()) {
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
  function buildSkeleton() {
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

  // Interior fittings of the level the walker is not on are hidden away from the stair void (RENDER.cull).
  // Exterior walls, glazing, floors seen from outside and the stair stay.
  const INTERIOR_CATEGORIES = new Set(['internal', 'wet', 'finishFloor', 'finishCarpet', 'trim', 'cornice', 'door', 'robe', 'slider', 'lighting']);
  let culledLevel = null;
  function cullOtherLevel() {
    if (!built) return;
    const level = player.footY > -1 ? 'upper' : 'ground';
    const v = built.stairVoid;
    const nearStair = player.x > v[0] - 2.5 && player.x < v[1] + 2.5 && player.z > v[2] - 2.5 && player.z < v[3] + 2.5;
    const hide = (RENDER.cull && !nearStair) ? (level === 'upper' ? 'ground' : 'upper') : null;
    if (hide === culledLevel) return;
    culledLevel = hide;
    for (const m of built.staticColliders) if (m.userData.interior && (m.userData.level === 'upper' || m.userData.level === 'ground')) m.visible = m.userData.level !== hide;
    renderer.shadowMap.needsUpdate = true; for (const s of built.spots) if (s.castShadow) s.shadow.needsUpdate = true; built.sun.shadow.needsUpdate = true; sceneDirty = 3;
  }

  function buildWalkScene() {
    for (const led of R.ceilingLEDs) led.walkWorld = [led.world[0], walkY(led.state.level, led.world[1]), led.world[2]];
    if (built) disposeBuilt();
    const atlas = R.floorAtlas;
    const installedFamily = R.installedFinishState.floorFamily;
    R.physicalRayHit([0, 50, 0], [0, -1, 0], 1);   // makes the engine tag door / switch pick actions
    const root = new THREE.Group();
    const buckets = new Map();
    const dynamicGroups = new Map();
    const switchTargets = [];
    const glowSources = new Map();
    let triangles = 0;

    function bucket(key, type, alpha, transform) {
      let b = buckets.get(key);
      if (!b) { b = { type, alpha, transform, pos: [], nor: [], col: [], uv: [], items: [] }; buckets.set(key, b); }
      return b;
    }

    for (const item of R.meshes) {
      if (!item.count || item.lightHalo || item.waterEffect) continue;
      if (/^T22-LIGHT-.*-switch-(rocker|indicator)$/.test(item.name)) continue;
      if (/copper-free-mirror$/.test(item.name)) continue;   // replaced by the planar vanity mirror
      if (/-panel-\d+-mirror-highlight-(front|back)$/.test(item.name)) continue;   // painted highlight strips: the mirror panels reflect for real
      if (item.physicalOnly) {
        if (/-switch-pick-proxy$/.test(item.name) && item.physicalAction) switchTargets.push(item);
        continue;
      }
      const alpha = itemAlpha(item);
      if (alpha <= 0.001) continue;
      const kind = R.materialKindForItem(item);
      const textured = !!atlas && kind === 1 && item.category === 'finishFloor' && item.finishFamily === installedFamily;
      const glow = typeof item.emissionWhen === 'function';
      const type = glow ? 'glow' : bucketType(item, kind, textured);
      const a = alpha >= 0.995 ? 1 : Math.round(alpha * 20) / 20;
      let key = `${type}|${a}`;
      if (!item.transformWhen) {
        // 4 m cells: frustum culling then drops walls behind the walker and rooms off screen.
        const cx = Math.floor(item.lightCenter[0] / RENDER.cell), cz = Math.floor(item.lightCenter[2] / RENDER.cell);
        key += `|cell${cx}_${cz}|${item.level}|${INTERIOR_CATEGORIES.has(item.category) ? 'in' : 'out'}`;
      }
      if (glow) { if (!glowSources.has(item.emissionWhen)) glowSources.set(item.emissionWhen, glowSources.size); key += `|glow${glowSources.get(item.emissionWhen)}`; }
      if (item.transformWhen) {
        if (!dynamicGroups.has(item.transformWhen)) dynamicGroups.set(item.transformWhen, { id: dynamicGroups.size, items: [] });
        const g = dynamicGroups.get(item.transformWhen); g.items.push(item);
        key += `|dyn${g.id}`;
      }
      const b = bucket(key, type, a, item.transformWhen || null);
      b.items.push(item);
      const c = linearColor(R.resolvedItemColor(item));
      const p = item.shadowPositions, n = item.renderNormals;
      const rows = atlas ? atlas.rows : 1;
      // The engine never culls, so its winding is not reliable. Orient every triangle so its geometric normal
      // agrees with the engine's render normal, then draw opaque surfaces single-sided: the hidden back faces of
      // frames, skirtings and stair blocks that rest on walls and floors no longer fight the surface beneath them.
      // True planes (zero thickness) are emitted in both windings so they stay visible from either side.
      let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity, bz0 = Infinity, bz1 = -Infinity;
      for (let i = 0; i < p.length; i += 3) {
        bx0 = Math.min(bx0, p[i]); bx1 = Math.max(bx1, p[i]); by0 = Math.min(by0, p[i + 1]); by1 = Math.max(by1, p[i + 1]); bz0 = Math.min(bz0, p[i + 2]); bz1 = Math.max(bz1, p[i + 2]);
      }
      const planar = Math.min(bx1 - bx0, by1 - by0, bz1 - bz0) < 0.0002;
      // The stair's buried continuation block tops out exactly at the ground floor datum: sink it under the floor.
      const sink = item.name === 'stair-ground-continuation' ? 0.004 : 0;
      // Flyscreen frames sit inside the window frame with coincident faces of another colour: pull every face
      // 0.6 mm inward so the window frame wins where they overlap.
      const inset = /-flyscreen-frame-/.test(item.name) ? 0.0006 : 0;
      const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, cz = (bz0 + bz1) / 2;
      const shrink = (v, c, extent) => (inset && extent > inset * 3) ? v + (v < c ? inset : -inset) : v;
      const pushVertex = (i) => {
        b.pos.push(shrink(p[i], cx, bx1 - bx0), itemY(item, shrink(p[i + 1], cy, by1 - by0)) - sink, shrink(p[i + 2], cz, bz1 - bz0));
        b.nor.push(n[i], n[i + 1], n[i + 2]);
        b.col.push(c.r, c.g, c.b);
        if (textured) { const uv = floorUV(item, p[i], p[i + 2], rows); b.uv.push(uv[0], uv[1]); }
        else {
          // World-metre UVs along the face plane so the procedural relief maps tile without seams.
          const nx = Math.abs(n[i]), ny = Math.abs(n[i + 1]), nz = Math.abs(n[i + 2]);
          if (ny >= nx && ny >= nz) b.uv.push(p[i], p[i + 2]);
          else if (nx >= nz) b.uv.push(p[i + 2], p[i + 1]);
          else b.uv.push(p[i], p[i + 1]);
        }
      };
      for (let t = 0; t < p.length; t += 9) {
        const ax = p[t + 3] - p[t], ay = p[t + 4] - p[t + 1], az = p[t + 5] - p[t + 2];
        const bxv = p[t + 6] - p[t], byv = p[t + 7] - p[t + 1], bzv = p[t + 8] - p[t + 2];
        const gx = ay * bzv - az * byv, gy = az * bxv - ax * bzv, gz = ax * byv - ay * bxv;   // normal of order 0,3,6
        const dot = gx * n[t] + gy * n[t + 1] + gz * n[t + 2];
        const order = dot >= 0 ? [0, 3, 6] : [0, 6, 3];
        for (const k of order) pushVertex(t + k);
        if (planar) for (const k of (dot >= 0 ? [0, 6, 3] : [0, 3, 6])) pushVertex(t + k);
      }
      if (planar) triangles += p.length / 9;
      triangles += p.length / 9;
    }

    const materials = new Map();
    const reflective = [];
    const staticColliders = [];
    const dynamicNodes = [];
    const glowMaterials = [];
    for (const [key, b] of buckets) {
      let matKey = `${b.type}|${b.alpha}`;
      if (b.type === 'glow') {
        matKey = key;
        const gm = patchRoomMask(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide }));  // emissive capped at 1, no bloom
        materials.set(matKey, gm);
        glowMaterials.push({ material: gm, when: b.items[0].emissionWhen });
      }
      if (!materials.has(matKey)) materials.set(matKey, makeMaterial(b.type, b.alpha, atlas));
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(b.col, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2));
      geo.computeBoundsTree();
      const mesh = new THREE.Mesh(geo, materials.get(matKey));
      mesh.castShadow = !b.type.startsWith('glass');
      mesh.receiveShadow = true;
      mesh.userData.bucket = key;
      mesh.userData.level = b.items[0].level; mesh.userData.interior = INTERIOR_CATEGORIES.has(b.items[0].category);
      if (b.type === 'floorTex' || b.type === 'floorPlain' || b.type === 'tile') reflective.push(mesh);
      if (b.transform) {
        const g = dynamicGroups.get(b.transform);
        if (!g.node) {
          g.node = new THREE.Group(); g.node.matrixAutoUpdate = false;
          const action = g.items.find(it => it.physicalAction)?.physicalAction || null;
          g.node.userData = { transform: b.transform, action };
          root.add(g.node); dynamicNodes.push(g.node);
        }
        g.node.add(mesh);
      } else {
        root.add(mesh); staticColliders.push(mesh);
      }
    }
    dynamicNodes.forEach(node => node.matrix.fromArray(node.userData.transform()));

    // Ceilings above every floor slab (the engine models none), plus the stair void and west strip.
    const ceilingMaterial = patchRoomMask(new THREE.MeshPhysicalMaterial({ color: 0xe6e3dd, roughness: 1.0, side: THREE.DoubleSide, envMapIntensity: 0.15 }));
    const ceilingParts = [];
    // The stair rises through the ground-floor ceiling: cut that opening out of it.
    const voidA = R.toWorld(2.58, 0, 0.16), voidB = R.toWorld(4.85, 0, 2.59);
    const stairVoid = [Math.min(voidA[0], voidB[0]), Math.max(voidA[0], voidB[0]), Math.min(voidA[2], voidB[2]), Math.max(voidA[2], voidB[2])];
    const clipHalf = (poly, axis, value, keepGreater) => {
      const out = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        const da = keepGreater ? a[axis] - value : value - a[axis], db = keepGreater ? b[axis] - value : value - b[axis];
        if (da >= 0) out.push(a);
        if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
      }
      return out;
    };
    const subtractRect = (tri, [x0, x1, z0, z1]) => {
      const regions = [
        [[0, x0, false]], [[0, x1, true]],
        [[0, x0, true], [0, x1, false], [1, z0, false]],
        [[0, x0, true], [0, x1, false], [1, z1, true]]
      ];
      const pieces = [];
      for (const region of regions) {
        let poly = tri;
        for (const [axis, value, keepGreater] of region) { poly = clipHalf(poly, axis, value, keepGreater); if (poly.length < 3) break; }
        if (poly.length >= 3) pieces.push(poly);
      }
      return pieces;
    };
    const mirrorTris = { upper: [], ground: [] };
    for (const item of R.meshes) {
      if (item.category !== 'floor' || /porch|paving/i.test(item.name)) continue;
      const ground = item.level === 'ground';
      const ceilingY = (ground ? GROUND_CEILING : UPPER_CEILING - UPPER_DROP) - 0.004;
      const p = item.shadowPositions, n = item.renderNormals;
      for (let i = 0; i < p.length; i += 9) {
        if (n[i + 1] < 0.9) continue;
        mirrorTris[ground ? 'ground' : 'upper'].push(p[i], p[i + 2], p[i + 3], p[i + 5], p[i + 6], p[i + 8]);
        const tri = [[p[i], p[i + 2]], [p[i + 3], p[i + 5]], [p[i + 6], p[i + 8]]];
        const polys = ground ? subtractRect(tri, stairVoid) : [tri];
        for (const poly of polys) for (let k = 1; k < poly.length - 1; k++) {
          ceilingParts.push([poly[0][0], ceilingY, poly[0][1], poly[k][0], ceilingY, poly[k][1], poly[k + 1][0], ceilingY, poly[k + 1][1]]);
        }
      }
    }
    const patches = [[2.58, 4.85, 0.16, 2.59], [0.0, 0.48, 0.0, 3.12]];
    for (const [x0, x1, z0, z1] of patches) {
      const cy = UPPER_CEILING - UPPER_DROP - 0.004;
      const a = R.toWorld(x0, cy, z0), b = R.toWorld(x1, cy, z0), c = R.toWorld(x1, cy, z1), d = R.toWorld(x0, cy, z1);
      ceilingParts.push([...a, ...b, ...c], [...a, ...c, ...d]);
    }
    const cpos = [], cnor = [];
    for (const t of ceilingParts) {
      // Engine top faces are clockwise from above, so from below they read counter-clockwise: keep for the underside.
      cpos.push(...t); cnor.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
      const lifted = t.map((v, k) => (k % 3 === 1 ? v + 0.12 : v));
      cpos.push(lifted[0], lifted[1], lifted[2], lifted[6], lifted[7], lifted[8], lifted[3], lifted[4], lifted[5]); cnor.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
    }
    const ceilingGeo = new THREE.BufferGeometry();
    ceilingGeo.setAttribute('position', new THREE.Float32BufferAttribute(cpos, 3));
    ceilingGeo.setAttribute('normal', new THREE.Float32BufferAttribute(cnor, 3));
    ceilingGeo.computeBoundsTree();
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    ceiling.castShadow = true; ceiling.receiveShadow = true;
    root.add(ceiling); staticColliders.push(ceiling);

    // Visible recessed downlights at every engine LED position.
    const leds = R.ceilingLEDs;
    const bezelGeo = new THREE.TorusGeometry(0.046, 0.007, 10, 36);
    bezelGeo.rotateX(Math.PI / 2);
    const bezel = new THREE.InstancedMesh(bezelGeo, new THREE.MeshPhysicalMaterial({ color: 0xf6f6f4, roughness: 0.35, metalness: 0.05 }), leds.length);
    const lensGeo = new THREE.CircleGeometry(0.04, 28);
    lensGeo.rotateX(Math.PI / 2);
    const lensMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lens = new THREE.InstancedMesh(lensGeo, lensMaterial, leds.length);
    const trimGeo = new THREE.CylinderGeometry(0.048, 0.052, 0.03, 36, 1, true);
    const trim = new THREE.InstancedMesh(trimGeo, new THREE.MeshPhysicalMaterial({ color: 0xdedcd6, roughness: 0.6, side: THREE.BackSide }), leds.length);
    const mat4 = new THREE.Matrix4();
    leds.forEach((led, i) => {
      const ceilingY = led.walkWorld[1] + 0.065;
      mat4.makeTranslation(led.walkWorld[0], ceilingY - 0.004, led.walkWorld[2]); bezel.setMatrixAt(i, mat4);
      mat4.makeTranslation(led.walkWorld[0], ceilingY - 0.012, led.walkWorld[2]); lens.setMatrixAt(i, mat4);
      mat4.makeTranslation(led.walkWorld[0], ceilingY + 0.012, led.walkWorld[2]); trim.setMatrixAt(i, mat4);
      lens.setColorAt(i, new THREE.Color(0.3, 0.3, 0.3));
    });
    bezel.castShadow = false; lens.castShadow = false;
    root.add(bezel, lens, trim);

    // Downlight pool: the nearest lit fixtures each get one shadowed omnidirectional light just below the
    // ceiling. It paints a bright falling gradient down the walls, puts a highlight on glass, and its shadow map
    // keeps the light inside the room. Shadow maps refresh only when a light moves or a door swings.
    const spots = [];
    for (let i = 0; i < SPOT_POOL; i++) {
      // Recessed downlight: a wide soft cone aimed at the floor, with a shadow map so it stays in its room.
      const light = RENDER.haloLights
        ? new THREE.SpotLight(0xffffff, 0, 6.5, THREE.MathUtils.degToRad(55), 0.36, 2.0)
        : new THREE.SpotLight(0xffffff, 0, 6.5, THREE.MathUtils.degToRad(64), 0.65, 2.0);   // wider, softer cone stands in for the halo
      light.target = new THREE.Object3D();
      // Hybrid confinement: the nearest fixtures cast real shadow maps (light through doorways, object shadows),
      // the rest are confined by their room box. Which fixtures cast is chosen in updateLights.
      light.castShadow = false;
      light.shadow.mapSize.set(RENDER.shadowSize, RENDER.shadowSize);
      light.shadow.autoUpdate = false;   // refreshed only when this fixture starts casting or a door moves
      light.shadow.bias = -0.0004; light.shadow.normalBias = 0.03; light.shadow.camera.near = 0.1;
      light.shadow.radius = 4;
      // Secondary soft halo: a wide, dim point light just below the fixture so the ceiling and nearby walls
      // pick up a gentle spherical falloff around each downlight (the cone alone leaves them flat).
      const halo = RENDER.haloLights ? new THREE.PointLight(0xffffff, 0, 5.0, 2.0) : null;
      if (halo) halo.castShadow = false;
      light.userData = { led: null, target: 0, current: 0, room: 0, halo };
      root.add(light, light.target); if (halo) root.add(halo); spots.push(light);
      // Cone outline for this downlight.
      const helper = new THREE.SpotLightHelper(light, 0xffc866);
      light.userData.helper = helper;
      root.add(helper);
    }

    // Sun and sky: the engine's key light direction, cast through the windows.
    const sunDir = new THREE.Vector3(0.48, 0.82, 0.31).normalize();
    const houseCenter = new THREE.Vector3(-3.0, -0.65, -2.15);
    // Planar floor mirror (reference renderer's reflection pass). One reflector follows the walker's level.
    const mirrorGeometry = level => {
      const flat = mirrorTris[level], pos = [];
      for (let i = 0; i < flat.length; i += 2) pos.push(flat[i], -flat[i + 1], 0);   // local XY plane; rotated -90° about X below
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      return g;
    };
    const mirrorGeometries = { upper: mirrorGeometry('upper'), ground: mirrorGeometry('ground') };
    const mirrorY = { upper: 0.0065 + 0.003 - UPPER_DROP, ground: R.PARAMS.GROUND_FLOOR_DATUM + 0.004 };
    const reflector = new Reflector(mirrorGeometries.upper, {
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
            // Wood grain runs along X: streaks smear the mirror image across the grain, as a lacquered board does.
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
    reflector.position.y = mirrorY.upper;
    reflector.material.blending = THREE.AdditiveBlending;
    reflector.material.transparent = true;
    reflector.material.depthWrite = false;
    reflector.userData.level = 'upper';
    // Render the mirror texture ourselves before the main pass. Reflector normally re-renders the scene from a
    // mirrored camera *inside* the main pass, and materials then keep light positions from that mirrored view,
    // which lit walls from below the floor and pushed light onto opposite walls.
    reflector.userData.renderMirror = reflector.onBeforeRender;
    reflector.onBeforeRender = () => {};
    root.add(reflector);

    let vanityMirror = null;   // the vanity mirror now lives on the cabinet door leaves (see below)

    // Glossy planar mirrors (reflection blended at 25 % over the surface's own finish): every mirrored robe
    // slider leaf on its room face, and the shower glass on both faces. Moving leaves ride on their moving node.
    const robeMirrors = [];
    const glossyMirror = (item, sign, parent, alpha = 0.25, tint = 0xd8dcde) => {
      const [lo, hi] = item.shadowBounds;
      const axis = (hi[0] - lo[0]) < (hi[2] - lo[2]) ? 0 : 2;
      const c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
      const w = (axis === 0 ? hi[2] - lo[2] : hi[0] - lo[0]) - 0.006, h = hi[1] - lo[1] - 0.006;
      const mirror = new Reflector(new THREE.PlaneGeometry(w, h), { textureWidth: 512, textureHeight: 512, clipBias: 0.003, color: tint });
      if (alpha < 1) {
        mirror.material.fragmentShader = mirror.material.fragmentShader.replace(/,\s*1\.0\s*\);/, `, ${alpha.toFixed(2)} );`);
        mirror.material.transparent = true; mirror.material.depthWrite = false;
        mirror.renderOrder = 2;
      }
      const face = sign > 0 ? hi[axis] : lo[axis];
      mirror.position.set(axis === 0 ? face + sign * 0.0015 : c[0], itemY(item, c[1]), axis === 2 ? face + sign * 0.0015 : c[2]);
      mirror.lookAt(mirror.position.clone().add(new THREE.Vector3(axis === 0 ? sign : 0, 0, axis === 2 ? sign : 0)));
      mirror.userData.renderMirror = mirror.onBeforeRender;
      mirror.onBeforeRender = () => {};
      parent.add(mirror); robeMirrors.push(mirror);
      return mirror;
    };
    // The room side of a robe leaf is the side with the most free space in front of it (the cabinet is shallow).
    const freeSpace = (item, dir) => {
      const [lo, hi] = item.shadowBounds;
      const axis = (hi[0] - lo[0]) < (hi[2] - lo[2]) ? 0 : 2;
      const c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
      tmpOrigin.set(axis === 0 ? c[0] + dir * 0.03 : c[0], itemY(item, c[1]), axis === 2 ? c[2] + dir * 0.03 : c[2]);
      tmpDir.set(axis === 0 ? dir : 0, 0, axis === 2 ? dir : 0);
      raycaster.set(tmpOrigin, tmpDir); raycaster.near = 0; raycaster.far = 8;
      const hits = raycaster.intersectObjects(staticColliders, true);
      return hits.length ? hits[0].distance : 8;
    };
    for (const item of R.meshes) {
      if (!item.count) continue;
      const parent = item.transformWhen ? dynamicGroups.get(item.transformWhen)?.node : root;
      if (!parent) continue;
      if (isMirrorPanel(item)) glossyMirror(item, freeSpace(item, 1) >= freeSpace(item, -1) ? 1 : -1, parent);
      else if (isShowerGlass(item)) { glossyMirror(item, 1, parent); glossyMirror(item, -1, parent); }
      // Vanity cabinet doors: a full mirror on each leaf, so the reflection swings with the door.
      else if (/copper-free-mirror$/.test(item.name)) glossyMirror(item, freeSpace(item, 1) >= freeSpace(item, -1) ? 1 : -1, parent, 1.0, 0xbfc4c6);
    }

    // Vanity mirror light: the engine's LED strips glow (above) and this light carries their illumination.
    const mirrorState = R.bathroomInteractions.find(s => s.id === 'T18-VANITY-MIRROR-SERVICES') || null;
    const mirrorPos = R.toWorld(8.010 - 0.055, 1.475, 1.905);
    const mirrorLight = new THREE.PointLight(new THREE.Color(0.95, 0.985, 1.0), 0, 3.5, 2);
    mirrorLight.position.set(mirrorPos[0], mirrorPos[1] - UPPER_DROP, mirrorPos[2]);
    root.add(mirrorLight);

    const sun = new THREE.DirectionalLight(0xfff0d1, 3.4);
    sun.position.copy(houseCenter).addScaledVector(sunDir, 45);
    // Moon: a pale disc far out on the sky dome; the directional light swaps to it after sunset.
    const moon = new THREE.Mesh(new THREE.SphereGeometry(45, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.93, 1.0), fog: false }));
    moon.visible = false;
    root.add(moon);
    sun.target.position.copy(houseCenter);
    sun.castShadow = true;
    Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 5, far: 100 });
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.22; sun.shadow.radius = 6; sun.shadow.blurSamples = 12;
    sun.shadow.autoUpdate = false;   // refreshed only when the sun has moved (see updateDaylight)
    root.add(sun, sun.target);
    // Reference ambient: sky/ground hemisphere outdoors, dimmer neutral indoors (blended per frame by `indoor`).
    const hemi = new THREE.HemisphereLight(new THREE.Color(0.42, 0.52, 0.72), new THREE.Color(0.30, 0.29, 0.26), 2.8);
    const ambient = new THREE.AmbientLight(new THREE.Color(0.26, 0.25, 0.24), 0);
    root.add(hemi, ambient);
    const sky = new Sky();
    sky.scale.setScalar(4000);
    const su = sky.material.uniforms;
    su.turbidity.value = 4; su.rayleigh.value = 1.6; su.mieCoefficient.value = 0.004; su.mieDirectionalG.value = 0.8;
    su.sunPosition.value.copy(sunDir);
    root.add(sky);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshPhysicalMaterial({ color: 0x6d7a55, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = R.PARAMS.GROUND_FLOOR_DATUM - 0.152;
    ground.receiveShadow = true;
    root.add(ground); staticColliders.push(ground);

    // Switch pick targets (invisible; ray-tested directly).
    const switches = switchTargets.map(item => {
      const geo = new THREE.BufferGeometry();
      const pos = Float32Array.from(item.shadowPositions);
      for (let i = 1; i < pos.length; i += 3) pos[i] = itemY(item, pos[i]);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.computeBoundsTree();
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
      mesh.userData.action = item.physicalAction;
      mesh.updateMatrixWorld();
      return mesh;
    });

    // Round wall clock, centred on the landing wall IW01 (world x -1.48, z -3.53..-1.10), hands driven by the simulated time.
    const clock = new THREE.Group();
    {
      clock.position.set(-1.48 - 0.006, 1.75 - UPPER_DROP, (-3.53 + -1.10) / 2);
      clock.rotation.y = -Math.PI / 2;                       // face toward -x, into the landing
      clock.scale.setScalar(2);                               // 0.6 m dial
      const faceR = 0.15;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(faceR + 0.012, faceR + 0.012, 0.03, 64).rotateX(Math.PI / 2), patchRoomMask(new THREE.MeshPhysicalMaterial({ color: 0x1c1d1f, roughness: 0.35, metalness: 0.2 }), 'wall'));
      body.position.z = 0.015;
      const face = new THREE.Mesh(new THREE.CircleGeometry(faceR, 64), patchRoomMask(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.6 }), 'wall'));
      face.position.z = 0.031;
      const tickGeo = new THREE.BoxGeometry(0.006, 0.02, 0.002);
      const tickMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2b2d, roughness: 0.6 });
      for (let i = 0; i < 12; i++) {
        const t = new THREE.Mesh(tickGeo, tickMat);
        const a = (i / 12) * Math.PI * 2;
        t.position.set(Math.sin(a) * (faceR - 0.02), Math.cos(a) * (faceR - 0.02), 0.033);
        t.rotation.z = -a;
        clock.add(t);
      }
      const handMat = new THREE.MeshPhysicalMaterial({ color: 0xd7262d, roughness: 0.4 });
      const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.085, 0.003).translate(0, 0.035, 0), handMat);
      const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.125, 0.003).translate(0, 0.055, 0), handMat);
      hourHand.position.z = 0.036; minuteHand.position.z = 0.040;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 16).rotateX(Math.PI / 2), handMat);
      hub.position.z = 0.042;
      // Shallow hemispherical glass cover: real refraction plus a reflection of the live environment.
      const cover = new THREE.Mesh(
        new THREE.SphereGeometry(faceR + 0.006, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.18, depthWrite: false, envMapIntensity: 2.0, specularIntensity: 1.0, clearcoat: 1, clearcoatRoughness: 0.02 })
      );
      cover.scale.z = 0.3;
      cover.position.z = 0.032;
      cover.renderOrder = 5;
      for (const o of [body, face, hourHand, minuteHand, hub, cover]) { o.castShadow = false; o.receiveShadow = true; }
      clock.add(body, face, hourHand, minuteHand, hub, cover);
      clock.userData = { hourHand, minuteHand };
      root.add(clock);
    }

    // Wall switches: plate from the engine, plus a rocker that tilts and an LED that follows the room state.
    const switchModels = [];
    const rockerMaterial = new THREE.MeshPhysicalMaterial({ color: 0xfafaf8, roughness: 0.3, clearcoat: 0.4 });
    const ledOn = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.15, 0.85, 0.35) });
    const ledOff = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.55, 0.15) });
    for (const state of R.roomLighting) {
      const plate = R.meshes.find(m => m.name === `T22-LIGHT-${state.id}-switch-plate`);
      const proxy = R.meshes.find(m => m.name === `T24-LIGHT-${state.id}-switch-pick-proxy`);
      if (!plate || !proxy) continue;
      const [lo, hi] = plate.shadowBounds, [plo, phi] = proxy.shadowBounds;
      const c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
      const pc = [(plo[0] + phi[0]) / 2, (plo[1] + phi[1]) / 2, (plo[2] + phi[2]) / 2];
      const axis = (hi[0] - lo[0]) < (hi[2] - lo[2]) ? 0 : 2;
      const sign = Math.sign(pc[axis] - c[axis]) || 1;
      const face = sign > 0 ? hi[axis] : lo[axis];
      const g = new THREE.Group();
      g.position.set(axis === 0 ? face : c[0], walkY(state.level, c[1]), axis === 2 ? face : c[2]);
      g.lookAt(g.position.clone().add(new THREE.Vector3(axis === 0 ? sign : 0, 0, axis === 2 ? sign : 0)));
      const rocker = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.092, 0.007), rockerMaterial);
      rocker.position.z = 0.0055;
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.004, 0.002), ledOff);
      led.position.set(0, -0.031, 0.0045);
      rocker.add(led);
      g.add(rocker);
      root.add(g);
      switchModels.push({ state, rocker, led });
    }

    // Closet skeleton: one instance. For every closet door, one spot behind each leaf (the shallower side of the
    // door is the closet). Sliders reveal only the bay of the leaf that moves, so the leaf is chosen at open time.
    const closetSpots = new Map();
    for (const st of R.openingInteractions) {
      if (!CLOSET_DOORS.has(st.id)) continue;
      const leaves = R.meshes.filter(m => m.count && m.transformWhen && m.physicalAction?.state === st && /-(panel-\d+-moving|leaf-moving)$/.test(m.name));
      if (!leaves.length) continue;
      const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (const m of leaves) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], m.shadowBounds[0][k]); hi[k] = Math.max(hi[k], m.shadowBounds[1][k]); }
      const axis = (hi[0] - lo[0]) < (hi[2] - lo[2]) ? 0 : 2;
      const floorY = walkY(st.level, lo[1]) - 0.005;
      const c = new THREE.Vector3((lo[0] + hi[0]) / 2, floorY + 0.9, (lo[2] + hi[2]) / 2);
      const probeSide = dir => {
        tmpOrigin.copy(c); tmpOrigin.setComponent(axis, c.getComponent(axis) + dir * 0.12);
        tmpDir.set(0, 0, 0); tmpDir.setComponent(axis, dir);
        raycaster.set(tmpOrigin, tmpDir); raycaster.near = 0; raycaster.far = 6;
        const hits = raycaster.intersectObjects(staticColliders, true);
        return hits.length ? hits[0].distance : 6;
      };
      const inside = probeSide(1) <= probeSide(-1) ? 1 : -1;
      const depth = Math.min(0.5, probeSide(inside) * 0.55 + 0.05);
      const yaw = axis === 0 ? (inside > 0 ? -Math.PI / 2 : Math.PI / 2) : (inside > 0 ? Math.PI : 0);   // faces the door
      const spotFor = (m) => {
        const [a, b] = m.shadowBounds;
        const pos = new THREE.Vector3((a[0] + b[0]) / 2, floorY, (a[2] + b[2]) / 2);
        pos.setComponent(axis, c.getComponent(axis) + inside * depth);
        return pos;
      };
      const leafSpots = leaves.map(m => ({ node: dynamicGroups.get(m.transformWhen)?.node || null, pos: spotFor(m) }));
      closetSpots.set(st.id, { yaw, leaves: leafSpots, pos: leafSpots[0].pos });
    }
    const skeleton = buildSkeleton();
    skeleton.visible = false;
    const firstSpot = closetSpots.get('R02') || closetSpots.values().next().value;
    if (firstSpot) { skeleton.position.copy(firstSpot.pos); skeleton.rotation.y = firstSpot.yaw; skeleton.visible = true; }
    pendingCloset = null;
    root.add(skeleton);
    // Only a skull in the vanity mirror cabinet, resting on the lower glass shelf and facing the room.
    {
      const shelf = R.meshes.find(m => m.name === 'T18-VANITY-moonlight-adjustable-glass-shelf-1');
      if (shelf) {
        const [lo, hi] = shelf.shadowBounds;
        const skull = buildSkull();
        skull.position.set((lo[0] + hi[0]) / 2, itemY(shelf, hi[1]) + 0.105, (lo[2] + hi[2]) / 2);
        skull.rotation.y = -Math.PI / 2;   // face toward -x, out of the cabinet
        root.add(skull);
      }
    }

    scene.add(root);
    culledLevel = null;
    built = { root, materials, reflective, staticColliders, dynamicNodes, switches, switchModels, ledOn, ledOff, glowMaterials, mirrorState, mirrorLight, vanityMirror, robeMirrors, closetSpots, skeleton, stairVoid, clock, sky, moon, houseCenter, daylight: 1, spots, sun, hemi, ambient, reflector, mirrorGeometries, mirrorY, lens, leds, triangles, atlas };
    buildDirty = false;
    console.info(`[tour] walk scene: ${buckets.size} draw buckets, ${dynamicNodes.length} moving assemblies, ${Math.round(triangles / 1000)}k triangles, ${leds.length} downlights`);
  }

  function disposeBuilt() {
    if (!built) return;
    scene.remove(built.root);
    built.root.traverse(o => { if (o.geometry) { o.geometry.disposeBoundsTree?.(); o.geometry.dispose(); } });
    built.materials.forEach(m => { m.map?.dispose(); m.dispose(); });
    built = null;
  }

  // ---------------------------------------------------------------- player
  const player = { x: 0, z: 0, footY: 0, eyeY: 0, yaw: 0, pitch: 0, vx: 0, vz: 0, vy: 0, grounded: true, bob: 0, speed: 0 };
  const keys = new Set();
  const raycaster = new THREE.Raycaster();
  raycaster.firstHitOnly = true;
  const tmpOrigin = new THREE.Vector3(), tmpDir = new THREE.Vector3();

  function colliders() { return built ? [...built.staticColliders, ...built.dynamicNodes] : []; }

  function probe(ox, oy, oz, dx, dy, dz, far) {
    tmpOrigin.set(ox, oy, oz); tmpDir.set(dx, dy, dz).normalize();
    raycaster.set(tmpOrigin, tmpDir); raycaster.near = 0; raycaster.far = far;
    const hits = raycaster.intersectObjects(colliders(), true);
    return hits.length ? hits[0] : null;
  }

  function blocked(dx, dz) {
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) return false;
    for (const h of [0.42, 0.95, 1.55]) {
      if (probe(player.x, player.footY + h, player.z, dx, 0, dz, len + PLAYER_RADIUS)) return true;
    }
    // Shoulder rays keep the body from clipping corners.
    const nx = -dz / len, nz = dx / len;
    for (const s of [-0.6, 0.6]) {
      if (probe(player.x + nx * PLAYER_RADIUS * s, player.footY + 0.95, player.z + nz * PLAYER_RADIUS * s, dx, 0, dz, len + PLAYER_RADIUS * 0.7)) return true;
    }
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
    // Input -> desired velocity in the yaw frame.
    const forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    const strafe = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
    if (forward || strafe) zoomTarget = 1;   // any step restores the default field of view
    zoomLevel += (zoomTarget - zoomLevel) * Math.min(1, dt * 10);
    const fov = BASE_FOV / zoomLevel;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const speed = run ? RUN_SPEED : WALK_SPEED;
    let tx = 0, tz = 0;
    if (forward || strafe) {
      const len = Math.hypot(forward, strafe);
      const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
      // camera looks down -Z when yaw=0 (three.js convention)
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
    player.speed = Math.hypot(player.vx, player.vz);

    // Ground: step up stairs smoothly, fall with gravity, refuse rises above the step limit.
    let g = groundHeight();
    if (g !== null && g - player.footY > STEP_MAX + 0.05) {
      player.x = prevX; player.z = prevZ; player.vx = player.vz = 0;
      g = groundHeight();
    }
    if (g !== null) {
      if (g > player.footY + 1e-4) {
        player.footY = Math.min(g, player.footY + Math.max(2.2, player.speed * 2.5) * dt); player.vy = 0; player.grounded = true;
      } else if (g < player.footY - 1e-4) {
        player.vy -= GRAVITY * dt;
        player.footY += player.vy * dt;
        if (player.footY <= g) { player.footY = g; player.vy = 0; player.grounded = true; } else player.grounded = false;
      } else { player.vy = 0; player.grounded = true; }
    }

    // Head bob: only while moving on the ground.
    const bobAmount = player.grounded ? Math.min(1, player.speed / WALK_SPEED) : 0;
    player.bob += dt * (run ? 11.5 : 8.6) * bobAmount;
    const bobY = Math.sin(player.bob) * 0.016 * bobAmount;
    const bobX = Math.cos(player.bob * 0.5) * 0.008 * bobAmount;
    player.eyeY = player.footY + EYE_HEIGHT + bobY;
    camera.position.set(player.x + Math.cos(player.yaw) * bobX, player.eyeY, player.z - Math.sin(player.yaw) * bobX);
    camera.rotation.set(player.pitch, player.yaw, 0);
  }

  // ---------------------------------------------------------------- lights update
  let shadowTimer = 0;
  let shadowPickTimer = 0;
  const ledDistance = new Map();
  function updateLights(dt) {
    if (!built) return;
    const { spots, leds, lens } = built;
    const q = RENDER;
    const level = player.footY > -1 ? 'upper' : 'ground';
    const lit = leds.filter(led => led.state.active && led.state.level === level);
    lit.forEach(led => ledDistance.set(led, Math.hypot(led.walkWorld[0] - camera.position.x, led.walkWorld[1] - camera.position.y, led.walkWorld[2] - camera.position.z)));
    lit.sort((a, b) => ledDistance.get(a) - ledDistance.get(b));
    const wanted = lit.slice(0, spots.length);
    const wantedSet = new Set(wanted);
    let changed = false;
    // Keep spots that already serve a wanted LED; free the others once they fade out.
    const served = new Set();
    for (const spot of spots) { if (spot.userData.led && wantedSet.has(spot.userData.led)) { served.add(spot.userData.led); spot.userData.target = 1; } else spot.userData.target = 0; }
    for (const spot of spots) {
      if (spot.userData.target === 0 && spot.userData.current < 0.02) {
        const next = wanted.find(led => !served.has(led));
        if (next) {
          spot.userData.led = next; served.add(next); spot.userData.target = 1; spot.userData.current = 0; spot.userData.room = 1;
          spot.position.set(next.walkWorld[0], next.walkWorld[1], next.walkWorld[2]);
          spot.target.position.set(next.walkWorld[0], next.walkWorld[1] - 3, next.walkWorld[2]);
          spot.target.updateMatrixWorld();
          spot.userData.halo?.position.set(next.walkWorld[0], next.walkWorld[1] - 0.06, next.walkWorld[2]);
          changed = true;
        }
      }
    }
    for (const spot of spots) {
      const led = spot.userData.led;
      const k = 1 - Math.exp(-10 * dt);
      spot.userData.current += (spot.userData.target - spot.userData.current) * k;
      const roomTarget = led && led.state.active ? 1 : 0;
      spot.userData.room += (roomTarget - spot.userData.room) * k;
      const room = spot.userData.room;
      const warm = !led || led.state.temperature !== 'cool';
      spot.color.setRGB(warm ? 1 : 0.86, warm ? 0.90 : 0.94, warm ? 0.76 : 1);
      spot.intensity = led ? spot.userData.current * room * tune.power : 0;
      if (spot.userData.halo) { spot.userData.halo.color.copy(spot.color); spot.userData.halo.intensity = spot.intensity * tune.halo; }
      // Lights stay visible even at zero intensity: an invisible light gets no shadow map render, and with
      // on-demand shadow updates its map would stay empty and read as fully shadowed once it fades in.
      spot.visible = true;
      const helper = spot.userData.helper;
      helper.visible = showCones && spot.intensity > 0.001;
      if (helper.visible) helper.update();
    }
    // Lens glow follows each room's switch state.
    const c = new THREE.Color();
    leds.forEach((led, i) => {
      const on = led.state.active ? 1 : 0;
      const warm = led.state.temperature !== 'cool';
      c.setRGB(0.25 + on * (warm ? 0.75 : 0.65), 0.25 + on * (warm ? 0.70 : 0.72), 0.25 + on * (warm ? 0.58 : 0.75));
      lens.setColorAt(i, c);
    });
    lens.instanceColor.needsUpdate = true;
    // Choose the shadow-mapped fixtures: the nearest lit ones, re-evaluated twice a second with 1 m hysteresis.
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
    // three.js lists shadow-casting spot lights first, so the mask uniforms follow that order.
    const order = [...spots.filter(s => s.castShadow), ...spots.filter(s => !s.castShadow)];
    order.forEach((s, idx) => roomBoxesFor(s.userData.led ? s.userData.led.state : null, idx, s.castShadow));
    spots.forEach((s, i) => { roomUniforms.uHaloSlot.value[i] = order.indexOf(s); });
    if (changed) { renderer.shadowMap.needsUpdate = true; sceneDirty = 3; }
    for (const g of built.glowMaterials) g.material.emissiveIntensity = Math.min(1, Math.max(0, Number(g.when()) || 0));
    built.mirrorLight.intensity = built.mirrorState ? (built.mirrorState.illumination || 0) * 3.0 : 0;
    for (const sw of built.switchModels) {
      const tilt = sw.state.active ? 0.20 : -0.20;          // rocker pressed down = on
      sw.rocker.rotation.x += (tilt - sw.rocker.rotation.x) * (1 - Math.exp(-14 * dt));
      sw.led.material = sw.state.active ? built.ledOn : built.ledOff;
    }
  }

  // ---------------------------------------------------------------- interaction
  let focusAction = null;
  function centreTarget(ndcX = 0, ndcY = 0) {
    if (!built) return null;
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    raycaster.near = 0; raycaster.far = 2.8;
    // Nearest surface in front of the walker wins, so a control behind a wall can never be picked.
    const hits = raycaster.intersectObjects([...built.staticColliders, ...built.dynamicNodes], true);
    for (const sw of built.switches) sw.raycast(raycaster, hits);
    if (!hits.length) return null;
    hits.sort((a, b) => a.distance - b.distance);
    const nearest = hits[0].distance;
    for (const h of hits) {
      if (h.distance > nearest + 0.03) break;          // only what is at the front surface
      let o = h.object;
      while (o && !o.userData.action) o = o.parent;
      if (o?.userData.action) return o.userData.action;
    }
    return null;
  }

  let pendingCloset = null;
  function placeSkeletonBehindMovingLeaf() {
    if (!pendingCloset || !built) return;
    const { spot } = pendingCloset;
    const e = new THREE.Vector3();
    const moved = spot.leaves.find(l => l.node && e.setFromMatrixPosition(l.node.matrix).lengthSq() > 1e-6);
    if (moved) { built.skeleton.position.copy(moved.pos); pendingCloset = null; }
    else if (performance.now() > pendingCloset.deadline) { built.skeleton.position.copy(spot.leaves[0].pos); pendingCloset = null; }
  }

  function activate(action) {
    if (!action) return;
    if (action.kind === 'opening') {
      const s = action.state;
      const opening = s.target < 0.5;
      R.commandOpening(s, opening, { announce: false });
      // The skeleton is moved behind this door while the leaf is still shut. A single leaf is known now; for a
      // slider the leaf that moves is found on its first frame of motion (see placeSkeletonBehindMovingLeaf).
      const spot = opening && built?.closetSpots?.get(s.id);
      if (spot) {
        built.skeleton.rotation.y = spot.yaw; built.skeleton.visible = true;
        if (spot.leaves.length === 1) { built.skeleton.position.copy(spot.leaves[0].pos); pendingCloset = null; }
        else pendingCloset = { state: s, spot, deadline: performance.now() + 4000 };
      }
    } else if (action.kind === 'light' || action.control) {
      const state = action.state || action.control?.state;
      if (!state) return;
      if ('illumination' in state) R.commandBathroomInteraction?.(state);
      else R.commandRoomLight(state, !state.active, { announce: false });
    } else if (action.kind === 'bathroom' && action.state) {
      R.commandBathroomInteraction?.(action.state);
    }
  }

  function describe(action) {
    if (!action) return '';
    if (action.kind === 'opening') return `${action.state.target < 0.5 ? 'Open' : 'Close'} ${action.state.kind}`;
    if (action.kind === 'bathroom' && action.state) {
      const st = action.state;
      if (st.mode === 'toggle' || 'illumination' in st && st.kind !== 'vanity mirror cabinet doors') return `${st.active ? 'Switch off' : 'Switch on'} ${st.kind}`;
      return `${st.target < 0.5 ? 'Open' : 'Close'} ${st.kind}`;
    }
    const state = action.state || action.control?.state;
    if (state?.label) return `${state.active ? 'Switch off' : 'Switch on'} ${state.label} light`;
    return 'Use';
  }

  // ---------------------------------------------------------------- walk loop
  let lastTime = 0, frames = 0, fpsTime = 0, fps = 0;
  let lastPoseKey = '', sceneDirty = 3;
  // Benchmark: run n frames back to back and time them (works with the tab hidden, where rAF is paused).
  function benchmark(n = 60, move = false) {
    if (mode !== 'walk') return null;
    const gl = renderer.getContext();
    lastTime = performance.now();
    const t0 = performance.now();
    for (let i = 0; i < n; i++) { if (move) player.yaw += 0.0005; frame(lastTime + 16.7); }
    gl.finish();
    return Math.round((performance.now() - t0) / n * 100) / 100;   // ms per frame
  }
  function setQuality(patch) { Object.assign(RENDER, patch); if (renderer) applyQuality(); }
  let indoor = 1;
  let lastSunUpdate = -1;
  let sunShadowTimer = 0;
  function updateDaylight(dt) {
    if (tune.clock) { tune.hour = (tune.hour + dt * SIM_SECONDS_PER_REAL_SECOND / 3600) % 24; }
    const h = tune.hour;
    // Sun path: rises at 6, peaks at 12 (65 degrees), sets at 18. Moon runs the opposite half of the sky.
    const dayT = (h - 6) / 12;                                  // 0 at sunrise, 1 at sunset
    const sunElev = Math.sin(dayT * Math.PI) * THREE.MathUtils.degToRad(65);
    const sunAz = Math.PI + dayT * Math.PI;                     // east -> south -> west
    const dirFrom = (elev, az) => new THREE.Vector3(Math.sin(az) * Math.cos(elev), Math.sin(elev), -Math.cos(az) * Math.cos(elev)).normalize();
    const sunDir = dirFrom(sunElev, sunAz);
    const nightT = ((h + 6) % 24) / 12;                        // 0 at 18:00, 1 at 06:00
    const moonElev = Math.sin(nightT * Math.PI) * THREE.MathUtils.degToRad(50);
    const moonDir = dirFrom(moonElev, Math.PI + nightT * Math.PI);
    const daylight = THREE.MathUtils.clamp(Math.sin(sunElev) * 2.2 + 0.08, 0, 1);   // twilight fades over ~8 degrees
    built.clock.userData.hourHand.rotation.z = -((h % 12) / 12) * Math.PI * 2;
    built.clock.userData.minuteHand.rotation.z = -((h % 1)) * Math.PI * 2;
    built.daylight = daylight;
    const { sun, sky, moon, hemi, houseCenter } = built;
    const sunUp = sunElev > -0.02;
    const light = sunUp ? sunDir : moonDir;
    sun.position.copy(houseCenter).addScaledVector(light, 45);
    // Warm low sun, white high sun, cool dim moon.
    const warmth = THREE.MathUtils.clamp(Math.sin(sunElev) * 3, 0, 1);
    if (sunUp) { sun.color.setRGB(1.0, 0.72 + 0.22 * warmth, 0.45 + 0.4 * warmth); sun.intensity = 3.4 * daylight; }
    else { sun.color.setRGB(0.62, 0.72, 1.0); sun.intensity = 0.22 * THREE.MathUtils.clamp(Math.sin(moonElev) * 2, 0, 1); }
    sky.material.uniforms.sunPosition.value.copy(sunDir);
    sky.material.uniforms.turbidity.value = 4 + (1 - daylight) * 6;
    moon.position.copy(houseCenter).addScaledVector(moonDir, 3200);
    moon.visible = moonElev > 0 && !sunUp;
    hemi.color.setRGB(0.42 * daylight + 0.05, 0.52 * daylight + 0.06, 0.72 * daylight + 0.12);
    hemi.groundColor.setRGB(0.30 * daylight + 0.02, 0.29 * daylight + 0.02, 0.26 * daylight + 0.03);
    // Sun shadows move with the sun: refresh only its map, at most 4 times a second, and only once the sun
    // has moved (a stopped clock means no refresh at all).
    sunShadowTimer += dt;
    if (lastSunUpdate < 0 || (sunShadowTimer >= 1.0 && Math.abs(h - lastSunUpdate) > 0.05)) {
      sunShadowTimer = 0; lastSunUpdate = h; sun.shadow.needsUpdate = true; renderer.shadowMap.needsUpdate = true;
    }
  }
  function updateEnvironment(dt) {
    updateDaylight(dt);
    // Indoors when a ceiling is within reach above the eye. Exposure and ambient follow, as the reference renderer.
    const ceiling = probe(camera.position.x, camera.position.y, camera.position.z, 0, 1, 0, 3.2);
    const target = ceiling ? 1 : 0;
    indoor += (target - indoor) * (1 - Math.exp(-4 * dt));
    // Bounce light and glossy environment reflections follow the nearest room's switch: with the lights off,
    // only daylight through the windows remains.
    const level = player.footY > -1 ? 'upper' : 'ground';
    let nearest = null, nearestD = Infinity;
    for (const led of built.leds) {
      if (led.state.level !== level) continue;
      const d = Math.hypot(led.walkWorld[0] - camera.position.x, led.walkWorld[2] - camera.position.z);
      if (d < nearestD) { nearestD = d; nearest = led; }
    }
    // Indoors only daylight bounce is global; each room's brightness comes from its own shadowed downlights.
    void nearest;
    // Every room keeps a steady daylight ambient; the downlights add on top of it.
    // Daylight base follows the clock: full by day, a low residual at night so rooms read by their fixtures.
    const dl = 0.06 + 0.94 * built.daylight;
    renderer.toneMappingExposure = (0.92 + 0.18 * indoor) * tune.exposure;
    built.hemi.intensity = (2.8 * (1 - indoor) + 1.6 * indoor * tune.base) * dl;
    built.ambient.intensity = 0.7 * indoor * tune.base * dl;
    scene.environmentIntensity = 0.55;  // the live cube map already carries the day/night level
    if (built.reflector.userData.level !== level) {
      built.reflector.geometry = built.mirrorGeometries[level];
      built.reflector.position.y = built.mirrorY[level];
      built.reflector.userData.level = level;
    }
  }
  const viewFrustum = new THREE.Frustum(), viewMatrix = new THREE.Matrix4();
  function frame(time) {
    if (mode !== 'walk') return;
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    stepPlayer(dt);
    updateEnvironment(dt);
    // Moving assemblies (doors, windows, sliders) follow the engine's animation state.
    let moving = false;
    for (const node of built.dynamicNodes) {
      node.matrix.fromArray(node.userData.transform());
      const s = node.userData.action?.state;
      if (s?.moving) moving = true;
    }
    if (moving) { renderer.shadowMap.needsUpdate = true; for (const s of built.spots) if (s.castShadow) s.shadow.needsUpdate = true; built.sun.shadow.needsUpdate = true; sceneDirty = 3; }
    placeSkeletonBehindMovingLeaf();
    cullOtherLevel();
    updateLights(dt);
    // Does anything on screen change this frame? A still walker, closed doors, stopped clock and unchanged lights
    // mean the environment map and every reflection are already right: skip re-rendering them.
    const poseKey = `${player.x.toFixed(3)}|${player.footY.toFixed(3)}|${player.z.toFixed(3)}|${player.yaw.toFixed(4)}|${player.pitch.toFixed(4)}|${zoomLevel.toFixed(3)}`;
    if (poseKey !== lastPoseKey || tune.clock || moving) sceneDirty = 3;
    lastPoseKey = poseKey;
    const changing = !RENDER.lessOften || sceneDirty > 0;
    if (sceneDirty > 0) sceneDirty--;
    envFrame++;
    if (changing && (RENDER.lessOften || envFrame % 4 === 0)) {
      // Live environment map from the eye position (mirrors and cone lines hidden). With lessOften, one cube face
      // per frame instead of all six every 4th frame: the same refresh, spread evenly, no frame spike.
      const hidden = [built.reflector, built.vanityMirror, ...built.robeMirrors, ...built.spots.map(s => s.userData.helper)].filter(o => o && o.visible);
      hidden.forEach(o => { o.visible = false; });
      envCamera.position.copy(camera.position);
      if (RENDER.lessOften) {
        envCamera.updateMatrixWorld(true);
        const face = envFrame % 6;
        const currentTarget = renderer.getRenderTarget(), currentTone = renderer.toneMapping, currentXr = renderer.xr.enabled;
        const mips = envTarget.texture.generateMipmaps;
        renderer.toneMapping = THREE.NoToneMapping; renderer.xr.enabled = false;
        envTarget.texture.generateMipmaps = face === 5 ? mips : false;   // mipmaps once, after the last face
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
    const helpersShown = built.spots.map(s => s.userData.helper).filter(h => h.visible);
    helpersShown.forEach(h => { h.visible = false; });
    // Floor reflection: a full scene re-render, so skip it while the floor is out of view (looking up).
    const floorInView = player.pitch < 0.42;
    built.reflector.visible = floorInView;
    // One bounce only: while any reflector renders, every other reflector is hidden, so the picture shows the
    // plain surfaces beneath them and no mirror-in-mirror.
    const allReflectors = [built.reflector, built.vanityMirror, ...built.robeMirrors].filter(Boolean);
    // The lit lens discs (the point-light glow) stay out of reflections; the fixture bezels still reflect.
    const renderOnce = (r) => {
      if (!changing && r.userData.fresh) return;   // nothing moved: the last picture is still right
      const others = [...allReflectors.filter(o => o !== r), built.lens].filter(o => o.visible);
      others.forEach(o => { o.visible = false; });
      r.userData.renderMirror.call(r, renderer, scene, camera, r.geometry, r.material, null);
      others.forEach(o => { o.visible = true; });
      r.userData.fresh = true;
    };
    for (const r of allReflectors) if (!r.visible) r.userData.fresh = false;
    if (floorInView && (envFrame % RENDER.reflectEvery === 0 || !built.reflector.userData.fresh)) renderOnce(built.reflector);
    const vm = built.vanityMirror;
    if (vm) {
      const doors = vm.userData.doors;
      const near = camera.position.distanceTo(vm.position) < 4.5;
      let inView = false;
      if (near) {
        camera.updateMatrixWorld();
        viewFrustum.setFromProjectionMatrix(viewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        vm.geometry.computeBoundingSphere?.();
        inView = viewFrustum.intersectsObject(vm);
      }
      vm.visible = near && inView && (!doors || doors.progress < 0.05);
      if (vm.visible) renderOnce(vm);
    }
    // Robe mirrors: each is a full scene re-render, so only the ones close by and on screen are refreshed.
    let mirrorIndex = 0;
    for (const rm of built.robeMirrors) {
      rm.updateWorldMatrix(true, false);
      const pos = new THREE.Vector3().setFromMatrixPosition(rm.matrixWorld);
      const dist = camera.position.distanceTo(pos);
      let show = dist < 6;
      if (show) {
        camera.updateMatrixWorld();
        viewFrustum.setFromProjectionMatrix(viewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        rm.geometry.computeBoundingSphere?.();
        show = viewFrustum.intersectsObject(rm);
      }
      rm.visible = show;
      // Beyond 2.5 m the mirrors refresh on alternate frames; the last picture stays on screen in between.
      if (show && (dist < 2.5 || (envFrame + mirrorIndex) % 2 === 0)) renderOnce(rm);
      mirrorIndex++;
    }
    helpersShown.forEach(h => { h.visible = true; });
    focusAction = centreTarget();
    crosshair.dataset.target = focusAction ? 'true' : 'false';
    const label = describe(focusAction);
    if (targetLabel.textContent !== label) targetLabel.textContent = label;
    if (composer) composer.render(dt); else renderer.render(scene, camera);   // direct: no post-processing pass
    frames++; fpsTime += dt;
    if (fpsTime >= 0.5) { fps = Math.round(frames / fpsTime); frames = 0; fpsTime = 0;
      if (tuningOpen && tune.clock) syncTunePanel();
      const hh = Math.floor(tune.hour), mm = Math.floor((tune.hour - hh) * 60);
      stats.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} · ${fps} fps · ${player.footY > -1 ? 'Upper floor' : 'Ground floor'}`; }
  }

  // ---------------------------------------------------------------- enter / exit
  let entering = false;
  let lightStatesBefore = null;
  let overviewPoseBefore = null;

  // Page load: the overview starts as a plan (straight down) and turns over into the isometric view.
  let introRunning = false;
  function overviewIntro() {
    if (mode !== 'overview' || entering) return;
    introRunning = true;
    flyCamera(cameraPose(), INTRO_TO, 2200).then(() => { introRunning = false; R.clampCamera?.(); });
  }
  setTimeout(overviewIntro, 600);

  // Fly the engine's orbit camera between two poses (yaw, pitch, distance, target).
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const cameraPose = () => ({ yaw: R.camera.yaw, pitch: R.camera.pitch, distance: R.camera.distance, target: [...R.camera.target] });
  function flyCamera(from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      let dyaw = to.yaw - from.yaw;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      const tick = now => {
        const k = easeInOut(Math.min(1, (now - start) / duration));
        R.camera.yaw = from.yaw + dyaw * k;
        R.camera.pitch = from.pitch + (to.pitch - from.pitch) * k;
        // Distance eases on a log scale so the approach feels even from far away.
        R.camera.distance = Math.exp(Math.log(from.distance) + (Math.log(to.distance) - Math.log(from.distance)) * k);
        R.camera.target = from.target.map((v, i) => v + (to.target[i] - v) * k);
        if (k < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  async function enterWalk(point) {
    if (mode !== 'overview' || entering) { console.info('[tour] enter ignored', mode, entering); return; }
    entering = true;
    console.info('[tour] entering walk at', point);
    try {
      ensureRenderer();
      zoomTarget = zoomLevel = 1; camera.fov = BASE_FOV; camera.updateProjectionMatrix();
      // Every room light on for the tour; the engine keeps the switch states.
      lightStatesBefore = R.roomLighting.map(state => [state, state.active]);
      R.roomLighting.forEach(state => { if (!state.active) R.commandRoomLight(state, true, { silent: true, announce: false }); });
      if (buildDirty || !built) { loading.dataset.active = 'true'; await new Promise(r => setTimeout(r, 30)); buildWalkScene(); loading.dataset.active = 'false'; }
      applyQuality();
      // Face the same way as the overview camera; the engine's yaw is the walking yaw.
      const from = cameraPose();
      overviewPoseBefore = from;
      player.yaw = from.yaw;
      player.pitch = 0;
      player.x = point.x; player.z = point.z; player.footY = point.y; player.vx = player.vz = player.vy = 0; player.bob = 0;
      // Nudge out of any wall the click landed in.
      for (let i = 0; i < 6 && blocked(0.001, 0) && blocked(0, 0.001); i++) { player.x += 0.15 * Math.sin(player.yaw); player.z += 0.15 * Math.cos(player.yaw); }
      // 3D transition: the overview camera swoops down to eye level at the clicked spot.
      const eyeTarget = [player.x, player.footY + EYE_HEIGHT, player.z];
      await flyCamera(from, { yaw: from.yaw, pitch: 0.0, distance: 0.12, target: eyeTarget }, 1500);
      stepPlayer(0.016);
      window.__RESIDENCE_PAUSED__ = true;
      mode = 'walk';
      body.dataset.tourMode = 'walk';
      renderer.shadowMap.needsUpdate = true;
      for (const s of built.spots) s.shadow.needsUpdate = true;
      built.sun.shadow.needsUpdate = true;
      lastTime = performance.now();
      if (composer) composer.render(0.016); else renderer.render(scene, camera);
      renderer.setAnimationLoop(frame);
      showHint(WALK_HINT);
      try { Promise.resolve(tourCanvas.requestPointerLock?.({ unadjustedMovement: true })).catch(() => tourCanvas.requestPointerLock?.()); } catch (_) { /* touch devices */ }
    } catch (err) {
      console.error('[tour] failed to enter walking mode', err);
      showHint('Walking view failed to start. See the browser console.', false);
      mode = 'overview'; body.dataset.tourMode = 'overview'; window.__RESIDENCE_PAUSED__ = false;
    } finally {
      loading.dataset.active = 'false';
      entering = false;
    }
  }

  function exitWalk() {
    if (mode !== 'walk') return;
    mode = 'overview';
    setTuning(false);
    renderer.setAnimationLoop(null);
    if (document.pointerLockElement === tourCanvas) document.exitPointerLock();
    keys.clear();
    window.__RESIDENCE_PAUSED__ = false;
    body.dataset.tourMode = 'overview';
    // Put every switch back the way it was before the tour.
    if (lightStatesBefore) { lightStatesBefore.forEach(([state, active]) => { if (state.active !== active) R.commandRoomLight(state, active, { silent: true, announce: false }); }); lightStatesBefore = null; }
    targetLabel.textContent = '';
    // 3D transition back: start at the walker's eye, pull out to the overview.
    const eyePose = { yaw: player.yaw, pitch: player.pitch, distance: 0.12, target: [player.x, player.footY + EYE_HEIGHT, player.z] };
    const back = overviewPoseBefore || { yaw: player.yaw, pitch: 0.68, distance: 16.8, target: [player.x, player.footY + 0.4, player.z] };
    Object.assign(R.camera, { yaw: eyePose.yaw, pitch: eyePose.pitch, distance: eyePose.distance, target: [...eyePose.target] });
    entering = true;
    flyCamera(eyePose, back, 1400).then(() => { entering = false; R.clampCamera?.(); });
    showHint(OVERVIEW_HINT);
    overviewCanvas.focus({ preventScroll: true });
  }

  exitButton.addEventListener('click', exitWalk);

  // Lighting slider panel.
  let tuningOpen = false;
  function syncTunePanel() {
    for (const input of tunePanel.querySelectorAll('input[type="range"]')) {
      input.value = tune[input.name];
      if (input.name === 'hour') { const hh = Math.floor(tune.hour), mm = Math.floor((tune.hour - hh) * 60); input.nextElementSibling.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; }
      else input.nextElementSibling.textContent = Number(tune[input.name]).toFixed(input.step.includes('.') ? 2 : 1);
    }
    tunePanel.querySelector('input[name="clock"]').checked = !!tune.clock;
    tunePanel.querySelector('input[name="cones"]').checked = showCones;
  }
  function applyTune() {
    lightScale.floor.value = tune.floor;
    lightScale.wall.value = tune.wall;
    for (const m of glassMaterials) m.envMapIntensity = m.userData.baseEnv * tune.glass;
    try { localStorage.setItem(TUNE_KEY, JSON.stringify(tune)); } catch (_) { /* no storage */ }
  }
  tunePanel.addEventListener('input', e => {
    if (e.target.name === 'clock') { tune.clock = e.target.checked ? 1 : 0; applyTune(); return; }
    if (e.target.name === 'cones') { showCones = e.target.checked; return; }
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
  // Esc releases the pointer lock; leaving the lock we held is the exit signal.
  let heldLock = false;
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === tourCanvas) { heldLock = true; return; }
    if (mode === 'walk' && heldLock && !tuningOpen) exitWalk();
    heldLock = false;
  });
  document.addEventListener('pointerlockerror', () => { /* fall back to drag-look */ });

  // Keyboard
  window.addEventListener('keydown', e => {
    if (mode !== 'walk') return;
    if (e.code === 'Escape') { if (tuningOpen) { setTuning(false); return; } exitWalk(); return; }
    if (e.code === 'KeyE' || e.code === 'Space') { activate(focusAction); e.preventDefault(); return; }
    if (e.code === 'KeyH') { showCones = !showCones; syncTunePanel(); showHint(showCones ? 'Downlight cones shown' : 'Downlight cones hidden'); return; }
    if (e.code === 'KeyT') { setTuning(!tuningOpen); return; }
    if (e.code === 'KeyO') { RENDER.ao = !RENDER.ao; applyQuality(); showHint(RENDER.ao ? 'Ambient occlusion on' : 'Ambient occlusion off'); return; }
    keys.add(e.code);
    if (/^(Arrow|Key[WASD]|Shift)/.test(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys.delete(e.code); });
  window.addEventListener('wheel', e => {
    if (mode !== 'walk' || tuningOpen) return;
    e.preventDefault();
    zoomTarget = THREE.MathUtils.clamp(zoomTarget * Math.exp(-e.deltaY * 0.0015), 1, 4);
  }, { passive: false });
  window.addEventListener('blur', () => keys.clear());

  // Mouse look (pointer lock) with drag fallback; click uses doors and switches.
  let dragging = false, lastX = 0, lastY = 0;
  function look(dx, dy) {
    player.yaw -= dx * 0.0021;
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch - dy * 0.0021));
  }
  tourCanvas.addEventListener('mousemove', e => {
    if (mode !== 'walk') return;
    if (document.pointerLockElement === tourCanvas) look(e.movementX, e.movementY);
    else if (dragging) { look(e.clientX - lastX, e.clientY - lastY); lastX = e.clientX; lastY = e.clientY; }
  });
  tourCanvas.addEventListener('mousedown', e => {
    if (mode !== 'walk') return;
    if (document.pointerLockElement !== tourCanvas) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      tourCanvas.requestPointerLock?.();
    }
    if (e.button === 0) activate(focusAction);
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch devices: one finger drags to look, a still tap uses the door or switch under the centre mark,
  // two fingers pinch to zoom, and the on-screen buttons walk forward and backward.
  let touchLook = null, pinch = null, tap = null;
  const touchDistance = e => Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  tourCanvas.addEventListener('touchstart', e => {
    if (mode !== 'walk') return;
    const t = e.touches[0];
    touchLook = { x: t.clientX, y: t.clientY };
    if (e.touches.length === 1) tap = { x: t.clientX, y: t.clientY, t: performance.now() };
    else { tap = null; pinch = { d: touchDistance(e), zoom: zoomTarget }; }
    e.preventDefault();
  }, { passive: false });
  tourCanvas.addEventListener('touchmove', e => {
    if (mode !== 'walk') return;
    if (e.touches.length >= 2 && pinch) {
      zoomTarget = THREE.MathUtils.clamp(pinch.zoom * touchDistance(e) / pinch.d, 1, 4);
    } else if (touchLook) {
      const t = e.touches[0];
      look((t.clientX - touchLook.x) * 2.2, (t.clientY - touchLook.y) * 2.2);
      touchLook = { x: t.clientX, y: t.clientY };
      if (tap && Math.hypot(t.clientX - tap.x, t.clientY - tap.y) > 12) tap = null;
    }
    e.preventDefault();
  }, { passive: false });
  tourCanvas.addEventListener('touchend', e => {
    if (e.touches.length < 2) pinch = null;
    if (!e.touches.length) {
      touchLook = null;
      if (tap && performance.now() - tap.t < 400) {
        // Use whatever door or switch sits under the finger; fall back to the centre mark.
        const ndcX = (tap.x / window.innerWidth) * 2 - 1, ndcY = -(tap.y / window.innerHeight) * 2 + 1;
        activate(centreTarget(ndcX, ndcY) || focusAction);
      }
      tap = null;
    }
  });
  const mobileBar = document.getElementById('tour-mobile');
  for (const button of mobileBar.querySelectorAll('button')) {
    const move = button.dataset.move;
    const code = move === 'forward' ? 'KeyW' : 'KeyS';
    const press = e => { e.preventDefault(); if (move) { keys.add(code); button.dataset.active = 'true'; } };
    const release = e => { if (move) { keys.delete(code); button.dataset.active = 'false'; } };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('contextmenu', e => e.preventDefault());
    if (!move) button.addEventListener('click', () => activate(focusAction));
  }

  window.ResidenceTour = Object.freeze({ enterWalk, exitWalk, probe, groundHeight, blocked, THREE, keys, benchmark, setQuality, RENDER, get camera() { return camera; }, get renderer() { return renderer; }, get mode() { return mode; }, get player() { return player; }, get scene() { return scene; }, get built() { return built; } });
})();
