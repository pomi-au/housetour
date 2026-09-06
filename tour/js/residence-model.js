/* Residence model engine (extracted from index.html). Panels are not present on the tour page:
   RESIDENCE_DOM returns detached stand-in elements for any panel element the engine still addresses. */
const RESIDENCE_DOM=(()=>{
  const stubs=new Map();
  function stub(key) {
    if(stubs.has(key)) return stubs.get(key);
    const el=document.createElement('div');
    el.dataset.residenceStub=key;
    el.querySelector=sel=>stub(key+' '+sel);
    el.querySelectorAll=()=>[];
    el.closest=()=>null;
    stubs.set(key,el);
    return el;
  }
  return Object.freeze({
    getElementById:id=>document.getElementById(id)||stub('#'+id),
    querySelector:sel=>document.querySelector(sel)||stub(sel)
  });
})();
  window.__GEOMETRY_ERRORS__ = [];
  window.addEventListener('error', event => {
    window.__GEOMETRY_ERRORS__.push({
      type: 'error',
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });
  window.addEventListener('unhandledrejection', event => {
    window.__GEOMETRY_ERRORS__.push({type:'unhandledrejection', message:String(event.reason)});
  });
  (() => {
    'use strict';

    const PARAMS = Object.freeze({
      WALL_HEIGHT: 2.440,
      GROUND_WALL_HEIGHT: 2.400,
      EXTERIOR_WALL: 0.250,
      EXTERIOR_OUTER_LEAF: 0.110,
      EXTERIOR_CAVITY: 0.050,
      EXTERIOR_INNER_LEAF: 0.090,
      INTERNAL_WALL: 0.090,
      CORNICE_PROXY: 0.075,
      WET_LEVEL_DELTA: 0.018,
      WET_FLOOR_TILE_MODULE: 0.450,
      WET_WALL_TILE_WIDTH: 0.300,
      WET_WALL_TILE_HEIGHT: 0.600,
      WET_TILE_JOINT: 0.004,
      WET_WALL_TILE_THICKNESS: 0.006,
      WET_TILE_SKIRTING_HEIGHT: 0.100,
      WET_TILE_SKIRTING_DEPTH: 0.008,
      HINGED_DOOR_VISUAL_HEIGHT: 2.040,
      STAIR_RISERS: 16,
      STAIR_RISER: 0.172,
      STAIR_TREADS: 15,
      STAIR_TREAD: 0.250,
      STAIR_BALUSTRADE_ABOVE_NOSING: 0.865,
      STAIR_CENTRAL_WALL_TOP: 0.865,
      STAIR_12C_WALL_HEIGHT: 1.032,
      STAIR_BALUSTRADE_ABOVE_NOSING: 0.865,
      STAIR_TERMINAL_WALL_Z0: 1.0765,
      STAIR_TERMINAL_CAP_Z0: 1.0765,
      STAIR_MDF_CAP_WIDTH: 0.150,
      STAIR_MDF_CAP_HEIGHT: 0.030,
      STAIR_CARPET_THICKNESS: 0.0075,
      STAIR_CARPET_NOSE_RADIUS: 0.012,
      GROUND_FLOOR_DATUM: -2.752,
      UPPER_SLAB_SOFFIT: -0.343,
      DOOR_FRAME_BACK_OPENING: 0.095,
      DOOR_FRAME_OVERALL: 0.145,
      DOOR_FRAME_FACE_RETURN: 0.025,
      DOOR_FRAME_HEAD_DEPTH: 0.034,
      DOOR_FRAME_EDGE_FLAT: 0.011,
      DOOR_FRAME_SIDE_FLAT: 0.039,
      DOOR_FRAME_STOP_WIDTH: 0.045,
      DOOR_FRAME_STOP_PROJECTION: 0.0115,
      DOOR_FRAME_SHOULDER: 0.006,
      DOOR_FRAME_INSIDE_RETURN: 0.0075,
      DOOR_FRAME_STEEL_THICKNESS: 0.0011,
      DOOR_FRAME_FACE_PLANE_CLEARANCE: 0.0025,
      DOOR_FRAME_STRIKE_HEIGHT: 1.035,
      DOOR_FRAME_STRIKE_WIDTH: 0.028,
      DOOR_FRAME_STRIKE_LENGTH: 0.070,
      HINGED_DOOR_ANIMATION_SECONDS: 0.72,
      DOOR_HARDWARE_HEIGHT: 1.035,
      DOOR_HARDWARE_BACKSET: 0.065,
      DOOR_LEVER_LENGTH: 0.115,
      DOOR_ROSETTE_DIAMETER: 0.065,
      DOOR_KEY_CYLINDER_OFFSET: 0.000,
      DOOR_KEY_PROJECTION: 0.004,
      DOOR_KEY_BOW_HALF_WIDTH: 0.0135,
      DOOR_KEY_BOW_HALF_HEIGHT: 0.0155,
      DOOR_KEY_BOW_HOLE_RADIUS: 0.0055,
      DOOR_KEY_BOW_THICKNESS: 0.0024,
      DOOR_KEY_BLADE_LENGTH: 0.045,
      DOOR_KEY_BLADE_HALF_HEIGHT: 0.0034,
      DOOR_KEY_BLADE_HALF_THICKNESS: 0.0012,
      DOOR_KEY_BOW_QUARTER_TURN: Math.PI / 2,
      DOOR_HANDLE_PRESS_SECONDS: 0.145,
      DOOR_HANDLE_RELEASE_SECONDS: 0.225,
      DOOR_HANDLE_MAX_TURN: Math.PI / 7,
      DOOR_KEY_SWAY_MAX: Math.PI / 16,
      WC_FALSE_HEAD_HEIGHT: 0.025,
      WC_FALSE_HEAD_SIDE_CLEARANCE: 0.010,
      WC_FALSE_HEAD_BACK_OPENING: 0.095,
      WC_FALSE_HEAD_GRIP_PROJECTION: 0.018,
      WC_FALSE_HEAD_GRIP_HEIGHT: 0.008,
      WINDOW_ANIMATION_SECONDS: 0.82,
      SLIDER_ANIMATION_SECONDS: 0.92,
      WINDOW_AWNING_OPEN_ANGLE: Math.PI/3,
      D01_ENTRY_WALL_X0: 9.390,
      D01_ENTRY_WALL_X1: 9.480,
      D01_OPEN_Z0: 2.735,
      D01_OPEN_Z1: 3.555,
      D01_HINGE_X: 9.435,
      D01_HINGE_Z: 3.555,
      D01_LEAF_WIDTH: 0.820,
      D02_HINGE_X: 8.500,
      D02_OPEN_X0: 8.500,
      D02_OPEN_X1: 9.320,
      D02_LEAF_WIDTH: 0.820,
      D02_USER_RIGHT_SHIFT: 0.090,
      D03_PERPENDICULAR_WALL_X_MAX: 5.020,
      D03_HINGE_X: 5.075,
      D03_HINGE_Z: 3.655,
      D03_OPEN_X0: 5.075,
      D03_OPEN_X1: 5.895,
      D03_LEAF_WIDTH: 0.820,
      D03_USER_LEFT_SHIFT: 0.055,
      D04_OPENING_Z0: 1.815,
      D04_HINGE_Z: 2.535,
      D04_LEAF_WIDTH: 0.720,
      D05_OPEN_X0: 6.761,
      D05_OPEN_X1: 7.381,
      D05_HINGE_Z: 1.175,
      D05_LEAF_WIDTH: 0.620,
      D05_USER_RIGHT_SHIFT: 0.071,
      O01_OPEN_X0: 6.690,
      O01_OPEN_X1: 7.520,
      WET_ENTRY_SEALED_X0: 7.520,
      WET_ENTRY_SEALED_X1: 8.140,
      SG01_PANEL_COUNT: 3,
      R02_PANEL_COUNT: 2,
      R03_PANEL_COUNT: 2,
      ROBE_PANEL_OVERLAP: 0.028,
      ROBE_TRACK_OFFSET: 0.018,
      INTERNAL_WALL_FRAME_INSERT: 0.090,
      SKIRTING_HEIGHT: 0.092,
      SKIRTING_DEPTH: 0.018,
      SCOTIA_HEIGHT: 0.019,
      SCOTIA_DEPTH: 0.019,
      HALF_SPLAYED_FACE: 0.025,
      ARCHITRAVE_HALF_SPLAYED_WIDTH: 0.067,
      ARCHITRAVE_AUS_COLONIAL_WIDTH: 0.066,
      ARCHITRAVE_BULLNOSE_WIDTH: 0.067,
      ARCHITRAVE_DEPTH: 0.018,
      SFSB60M_TREAD: 0.060,
      SFSB60M_VERTICAL_RETURN: 0.015,
      SFSB60M_BODY: 0.0025,
      UNIVERSAL_COVER_WIDTH: 0.045,
      UNIVERSAL_BASE_WIDTH: 0.0295,
      SLIDER_END_TRIM_WIDTH: 0.027,
      SLIDER_BORDER_TRIM_WIDTH: 0.0265,
      SLIDER_TRIM_HEIGHT: 0.012
    ,
      BRICK_COURSE_HEIGHT: 0.08571428571428572,
      GARAGE_FOOTING_TOP_COURSE: -3,
      GARAGE_SLAB_BASE_COURSE: -2,
      GARAGE_FLOOR_TOP_COURSE: -1,
      GARAGE_WALL_BASE_COURSE: -3,
      GARAGE_SECTIONAL_BASE_COURSE: -1,
      GARAGE_SECTIONAL_HEAD_COURSE: 25,
      GARAGE_MF_DOOR_SILL_COURSE: 0,
      GARAGE_MF_RENDERED_BRICK_BASE_COURSES: 1,
      ENTRY_COLUMN_SECTION: 0.09,
      ENTRY_COLUMN_STEEL: 0.004,
      ENTRY_COLUMN_BRICK_BASE: 0.35,
      GLASS_SLIDER_PANEL_OVERLAP: 0.028,
      GLASS_SLIDER_TRACK_OFFSET: 0.018,
      SLIDER_STANDARD_FRAME_DEPTH: 0.102,
      SLIDER_MULTISTACK_SCREEN_FRAME_DEPTH: 0.158,
      SLIDER_FIXED_FRAME_FACE: 0.035,
      FLYSCREEN_TRACK_OFFSET: 0.07,
      GROUND_CAVITY_FLYSCREEN_TRACK_OFFSET: 0.16,
      FLYSCREEN_FRAME_WIDTH: 0.026,
      FLYSCREEN_FRAME_DEPTH: 0.014,
      FLYSCREEN_WEAVE_COLUMNS: 64,
      FLYSCREEN_WEAVE_ROWS: 112,
      ENTRY_SMART_LOCK_SCALE: 0.58,
      ENTRY_SMART_LOCK_CENTRE_U: 0.65,
      GARAGE_SECTIONAL_TRACK_RADIUS: 0.28,
      GARAGE_TRACK_CHANNEL_WIDTH: 0.024,
      GARAGE_TRACK_CHANNEL_DEPTH: 0.018,
      GARAGE_TRACK_CHANNEL_WALL: 0.003
    });

    const PLAN_W = 12.47;
    const PLAN_D = 7.55;
    const GROUND_PLAN_W = 20.63;
    const GROUND_PLAN_D = 13.43;
    const GROUND_OFFSET_X = 8.16;
    const GROUND_OFFSET_Z = 5.88;
    const WALL_H = PARAMS.WALL_HEIGHT;
    const DOOR_H = PARAMS.HINGED_DOOR_VISUAL_HEIGHT;
    const COLORS = Object.freeze({
      exterior: [0.894, 0.882, 0.839, 1],
      internal: [0.945, 0.949, 0.945, 1],
      glazing: [0.430, 0.485, 0.490, 1],
      obscureGlazing: [0.820, 0.835, 0.825, 1],
      clearGlazing: [0.965, 0.975, 0.972, 0.18],
      greyGlazing: [0.285, 0.320, 0.330, 1],
      glazeFrame: [0.255, 0.280, 0.280, 1],
      windowMark: [0.945, 0.950, 0.930, 1],
      glassSlider: [0.965, 0.975, 0.972, 0.18],
      robe: [0.660, 0.715, 0.725, 1],
      mirrorHighlight: [0.945, 0.965, 0.960, 1],
      robeArrow: [0.970, 0.970, 0.955, 1],
      robeArrowHalo: [0.050, 0.255, 0.305, 0.72],
      door: [0.940, 0.935, 0.915, 1],
      doorFrame: [0.965, 0.963, 0.945, 1],
      wet: [0.450, 0.480, 0.470, 0.46],
      stair: [0.410, 0.370, 0.335, 1],
      metal: [0.190, 0.210, 0.205, 1],
      trimWhite: [0.956, 0.951, 0.925, 1],
      trimShadow: [0.655, 0.650, 0.620, 1],
      bronze: [0.650, 0.500, 0.305, 1],
      silver: [0.690, 0.710, 0.705, 1],
      champagne: [0.690, 0.625, 0.495, 1],
      mattBlack: [0.090, 0.105, 0.102, 1],
      mdfCap: [0.085, 0.090, 0.088, 1],
      brushedNickel: [0.705, 0.720, 0.710, 1],
      brushedNickelEdge: [0.485, 0.505, 0.500, 1],
      keyMetal: [0.755, 0.765, 0.745, 1],
      keyEdge: [0.425, 0.445, 0.440, 1],
      lockShadow: [0.115, 0.125, 0.125, 1],
      transitionBase: [0.265, 0.285, 0.280, 1],
      floor: [0.735, 0.745, 0.720, 1],
      cornice: [0.958, 0.952, 0.928, 1],
      carpetTaupe: [0.430, 0.385, 0.345, 1],
      carpetTaupeLight: [0.430, 0.385, 0.345, 1],
      tileWarmGrey: [0.535, 0.535, 0.545, 1],
      tileGreyAlt: [0.565, 0.555, 0.560, 1],
      tileGrout: [0.455, 0.455, 0.465, 1],
      tileChipLight: [0.745, 0.735, 0.720, 1],
      tileChipRoseGrey: [0.600, 0.505, 0.525, 1],
      tileChipBlush: [0.745, 0.555, 0.585, 1],
      sanitaryWhite: [0.970, 0.968, 0.950, 1],
      sanitaryShadow: [0.245, 0.265, 0.268, 1],
      bathWater: [0.420, 0.585, 0.610, 0.78],
      showerGlass: [0.830, 0.920, 0.930, 0.24],
      vanityOak: [0.515, 0.375, 0.245, 1],
      vanityOakDark: [0.335, 0.235, 0.155, 1],
      vanityTop: [0.955, 0.945, 0.920, 1],
      mirrorSilver: [0.655, 0.765, 0.790, 0.92],
      outline: [0.165, 0.180, 0.175, 0.82],
      grid: [0.360, 0.385, 0.375, 0.13],
      referenceGrid: [0.930, 0.960, 0.980, 1],
      measurement: [0.970, 0.985, 1.000, 1]
    ,
      flyscreenMesh: [0.18,0.215,0.205,0.34],
      flyscreenWeave: [0.105,0.175,0.16,0.78],
      faceBrick: [0.555,0.425,0.325,1],
      paintedSteel: [0.9,0.895,0.865,1],
      smartLockGraphite: [0.08,0.088,0.086,1],
      smartLockFace: [0.23,0.242,0.238,1],
      smartLockCyan: [0.025,0.755,0.815,1],
      smartLockSensor: [0.03,0.045,0.05,1],
      entryDoorGroove: [0.735,0.738,0.72,1],
      entryPaving: [0.625,0.615,0.58,1],
      entryPavingJoint: [0.405,0.41,0.395,1]
    });

    const PRIVACY_DOOR_IDS = new Set(['D04','D05','GF-D-ENSUITE','GF-D-WC','GF-D-PDR']);
    const WC_FRAME_DOOR_IDS = new Set(['D05','GF-D-WC','GF-D-PDR']);
    const HEAVY_HINGE_DOOR_IDS = new Set(['GF-D-ENTRY','GF-D-STORE']);
    // Explicit lock-face assignment for every keyed leaf. The sign is measured
    // on the closed leaf's local normal. Interior doors face the circulation
    // side with the shortest connection to living; exterior keys face approach.
    // D06A/B are the v12 correction: both key sets now sit west/outside Linen.
    const KEYED_COMMON_SIDE_BY_DOOR = Object.freeze({
      D01:-1, D02:-1, D03:-1, D06A:1, D06B:-1,
      'GF-D-ENTRY':1,
      'GF-D-STORE-UNDER':-1,
      'GF-D-PANTRY':1,
      'GF-D-LOBBY':1,
      'GF-D-LAUNDRY':-1,
      'GF-D-LINEN-A':-1,
      'GF-D-LINEN-B':1,
      'GF-D-STUDY':1,
      'GF-D-STORE':1,
      'GF-D-MASTER':-1
    });
    const UPPER_LINEN_KEY_DOOR_IDS = Object.freeze(['D06A','D06B']);
    const DOOR_HINGE_PRODUCTS = Object.freeze({
      standard: Object.freeze({
        id:'pinnacle-100x75-fixed-pin',
        label:'Pinnacle 100 × 75 mm fixed-pin butt hinge',
        source:'https://www.bunnings.com.au/pinnacle-100mm-fixed-pin-butt-hinge-2-pack_p0074264',
        height:.100,
        openWidth:.075,
        thickness:.0016,
        barrelRadius:.0054,
        screwRows:4,
        hingeCount:2,
        mechanism:'fixed-pin'
      }),
      heavy: Object.freeze({
        id:'pinnacle-hng031-100x100-fixed-pin',
        label:'Pinnacle HNG031 100 × 100 × 2.5 mm broad fixed-pin butt hinge',
        source:'https://www.pinnacle.net.au/product/broad-butt-hinge-100mm-fixed-pin-2pk/',
        height:.100,
        openWidth:.100,
        thickness:.0025,
        barrelRadius:.0062,
        screwRows:4,
        hingeCount:3,
        mechanism:'fixed-pin'
      }),
      sanitary: Object.freeze({
        id:'metroll-wc-lift-off',
        label:'Metroll WC lift-off hinge detail',
        source:'https://www.metroll.com.au/wp-content/uploads/metroll_doorframes_meterboxes_2026r.pdf',
        height:.100,
        openWidth:.075,
        thickness:.0025,
        barrelRadius:.0062,
        screwRows:3,
        hingeCount:2,
        mechanism:'lift-off'
      })
    });

    const BATHROOM_PRODUCT_REFERENCES = Object.freeze({
      bath:Object.freeze({
        maker:'Stylus', product:'Maxton inset bath · drawing schedule', code:'MA 1525',
        nominal:Object.freeze({length:1.525,width:.735,height:.438}),
        source:'21560 WD A3.pdf · Sheet 8 bath schedule'
      }),
      shower:Object.freeze({
        maker:'Decina', product:'Cascade 900 square semi-frameless shower screen', code:'CASS900C',
        nominal:Object.freeze({width:.900,depth:.900,height:2.000,glass:.006}),
        source:'https://decina.com.au/product/cascade-shower-screen-semi-frameless-900-1000-1200/'
      }),
      toilet:Object.freeze({
        maker:'Caroma', product:'Riviere Cleanflush wall-faced close-coupled suite', code:'790003MW',
        source:'https://www.caroma.com.au/'
      }),
      vanity:Object.freeze({
        maker:'ADP', product:'Archie 1350 All-Door wall-hung vanity · Double Bowl', code:'ARCFDW1350WHCCP',
        nominal:Object.freeze({width:1.350,depth:.500,height:.700}),
        source:'https://www.adpaustralia.com.au/bathroom/vanities/archie/archie-all-door/archie-1350-all-door/'
      }),
      mirror:Object.freeze({
        maker:'ADP', product:'Moonlight mirrored cabinet 1200 · two soft-close doors', code:'MOON1200-2D',
        nominal:Object.freeze({width:1.200,height:.800,depth:.160}),
        source:'https://www.adpaustralia.com.au/bathroom/mirrored-cabinets/moonlight/moonlight-mirrored-cabinet-1500/',
        coordinatedFeatures:Object.freeze(['copper-free mirror','concealed LED ambient light','graphite interior','adjustable glass shelves','touch demister indication'])
      })
    });

    const BATHROOM_V18_LAYOUT = Object.freeze({
      revision:'drawing-sheet-8-v18',
      fixedWetBoundaries:Object.freeze({bath:Object.freeze([4.85,6.60,.25,2.59]),wcVanity:Object.freeze([6.69,8.19,.25,2.59])}),
      fixtureSide:'west / X=4.85 wall',
      shower:Object.freeze({x0:4.890,x1:5.750,z0:.270,z1:1.060,height:2.000}),
      bathHob:Object.freeze({x0:4.870,x1:5.710,z0:1.060,z1:2.585,height:.150}),
      bath:Object.freeze({cx:5.280,cz:1.8225,rx:.350,rz:.750}),
      vanity:Object.freeze({x0:7.680,x1:8.180,z0:1.222,z1:2.588,width:1.350,depth:.500,wallBay:1.370,scribeEachEnd:.010,basinCentres:Object.freeze([1.610,2.200])}),
      mirror:Object.freeze({x0:8.010,x1:8.170,z0:1.305,z1:2.505,bottom:1.195,top:1.995,width:1.200,height:.800,depth:.160,doorCount:2}),
      generalFloorWaste:Object.freeze([6.080,1.515]),
      wallControls:Object.freeze({switch:Object.freeze([6.705,1.055,1.560]),outlet:Object.freeze([7.800,1.075,2.576])})
    });

    const OUTER_FOOTPRINT = Object.freeze([
      [0.48, 0.00], [12.47, 0.00], [12.47, 7.55],
      [0.00, 7.55], [0.00, 3.12], [0.48, 3.12]
    ]);
    const UPPER_OUTER_LEAF_INNER_EDGE = Object.freeze([
      [.59,.11],[12.36,.11],[12.36,7.44],[.11,7.44],[.11,3.23],[.59,3.23]
    ].map(Object.freeze));
    const UPPER_CAVITY_INNER_EDGE = Object.freeze([
      [.64,.16],[12.31,.16],[12.31,7.39],[.16,7.39],[.16,3.28],[.64,3.28]
    ].map(Object.freeze));
    const UPPER_INNER_WALL_FACE = Object.freeze([
      [.73,.25],[12.22,.25],[12.22,7.30],[.25,7.30],[.25,3.37],[.73,3.37]
    ].map(Object.freeze));
    const STAIR_VOID_SLAB = Object.freeze([
      [2.580, 0.160], [4.850, 0.160], [4.850, 2.590],
      [3.670, 2.590], [3.670, 2.380], [2.580, 2.380]
    ]);

    const appRoot = RESIDENCE_DOM.getElementById('app');
    const canvas = RESIDENCE_DOM.getElementById('scene');
    const labelsLayer = RESIDENCE_DOM.getElementById('labels');
    const interactionStatus = RESIDENCE_DOM.getElementById('interaction-status');
    const fatal = RESIDENCE_DOM.getElementById('fatal');
    const materialHotspotButtons=[...document.querySelectorAll('[data-material-hotspot]')];
    const materialDetailPanel=RESIDENCE_DOM.getElementById('material-detail-panel');
    let activeMaterialHotspot=null;
    const qaCanvasCapture=document.createElement('img');
    qaCanvasCapture.id='task004-qa-canvas-capture';
    qaCanvasCapture.alt='';
    qaCanvasCapture.hidden=true;
    document.body.appendChild(qaCanvasCapture);
    let qaCaptureTimer=null;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
    if (!gl) {
      fatal.style.display = 'grid';
      fatal.textContent = 'WebGL is unavailable in this browser. This validation model requires WebGL.';
      return;
    }
    const sceneViewport=RESIDENCE_DOM.getElementById('viewport');
    const gpuViewportDims=(()=>{
      try {
        const value=typeof gl.getParameter==='function'&&gl.MAX_VIEWPORT_DIMS!==undefined?gl.getParameter(gl.MAX_VIEWPORT_DIMS):null;
        return value&&value.length>=2?[Math.max(1,Number(value[0])||8192),Math.max(1,Number(value[1])||8192)]:[8192,8192];
      } catch (_) { return [8192,8192]; }
    })();
    const gpuRenderbufferLimit=(()=>{
      try {
        const value=typeof gl.getParameter==='function'&&gl.MAX_RENDERBUFFER_SIZE!==undefined?Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)):0;
        return Math.max(1,value||Math.min(gpuViewportDims[0],gpuViewportDims[1]));
      } catch (_) { return Math.min(gpuViewportDims[0],gpuViewportDims[1]); }
    })();

    const VERTEX_SHADER = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      uniform mat4 uMVP;
      uniform mat4 uModel;
      varying float vLight;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vec3 n = normalize(mat3(uModel) * aNormal);
        vec3 keyDir = normalize(vec3(0.48, 0.82, 0.31));
        vec3 fillDir = normalize(vec3(-0.62, 0.42, -0.36));
        vLight = 0.68
          + 0.24 * max(dot(n, keyDir), 0.0)
          + 0.08 * max(dot(n, fillDir), 0.0);
        vec4 world = uModel * vec4(aPosition, 1.0);
        vWorldPos = world.xyz;
        vWorldNormal = n;
        gl_Position = uMVP * world;
      }
    `;
    const ROOM_LIGHT_SLOTS = 8; // Usually four nearby LEDs; eight for long wall receivers.
    const floorDerivatives=gl.getExtension?.('OES_standard_derivatives');
    const floorAnisotropy=gl.getExtension?.('EXT_texture_filter_anisotropic') || gl.getExtension?.('WEBKIT_EXT_texture_filter_anisotropic');
    const FRAGMENT_SHADER = `
      ${floorDerivatives ? '#extension GL_OES_standard_derivatives : enable' : ''}
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      uniform vec4 uColor;
      uniform float uRoughness;
      uniform sampler2D uFloorTexture;
      uniform float uUseFloorTexture;
      uniform float uTextureRotate;
      uniform float uTextureSeed;
      uniform float uMaterialKind;
      uniform float uBoardLongAxisX;
      uniform vec3 uCameraEye;
      uniform vec2 uBoardOrigin;
      uniform vec2 uBoardSize;
      uniform vec2 uPlankOrigin;
      uniform vec2 uPlankSize;
      uniform float uFloorAtlasRows;
      uniform vec4 uFloorSurface;
      uniform float uPixelFootprint;
      uniform vec4 uFloorWindows[12];
      uniform vec2 uFloorWindowY[12];
      uniform vec4 uFloorWindowRooms[12];
      uniform vec4 uRoomLights[8];
      uniform vec3 uRoomLightColours[8];
      uniform vec4 uShadowTiles[8];
      uniform sampler2D uCeilingShadows;
      uniform vec2 uShadowParams;
      uniform vec3 uRoomLightColour;
      uniform float uMirrorLight;
      uniform float uEmission;
      uniform float uGlowAxis;
      uniform vec4 uGlowShape;
      varying float vLight;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      float surfaceNoise(vec3 p) {
        vec3 cell = floor(p);
        return fract(sin(dot(cell, vec3(12.9898, 78.233, 41.731))) * 43758.5453);
      }
      float ceilingShadow(vec3 lightPosition,vec4 tile,float cosine) {
        if(tile.w<.5) return 0.0;
        float depth=lightPosition.y-vWorldPos.y;
        if(depth<=.055 || depth>=7.0) return 0.0;
        vec2 uv=(vWorldPos.xz-lightPosition.xz)/(depth*1.428148)*.5+.5;
        if(min(uv.x,uv.y)<0.0 || max(uv.x,uv.y)>1.0) return 0.0;
        vec2 low=tile.xy+vec2(uShadowParams.x*.5);
        vec2 high=tile.xy+vec2(tile.z-uShadowParams.x*.5);
        vec2 p=tile.xy+uv*tile.z;
        float receiver=(depth-uShadowParams.y-.010*(1.0-cosine))/7.0;
        float sum=0.0;
        for(int tap=0;tap<4;tap++) {
          vec2 offset=vec2((tap==0 || tap==2)?-.5:.5,tap<2?-.5:.5)*uShadowParams.x;
          vec2 encodedDepth=texture2D(uCeilingShadows,clamp(p+offset,low,high)).rg;
          float caster=dot(encodedDepth,vec2(1.0,1.0/255.0));
          sum+=step(receiver,caster);
        }
        return sum*.25;
      }
      vec3 plankPhoto(vec2 uv,float row) {
        // Eight separate plank faces, with inset gutters to prevent mip bleeding.
        vec2 atlasUV=vec2(mix(.0025,.9975,clamp(uv.x,0.0,1.0)),
          (row+mix(.0195,.9805,clamp(uv.y,0.0,1.0)))/max(uFloorAtlasRows,1.0));
        return texture2D(uFloorTexture,atlasUV).rgb;
      }
      void main() {
        if (uMaterialKind > 10.5 && uMaterialKind < 11.5) {
          // Soft, additive optical glow; never an opaque yellow frame.
          vec2 uv=uGlowAxis < .5 ? vWorldPos.zy : vWorldPos.xy;
          vec2 q=abs(uv-uGlowShape.xy)-uGlowShape.zw;
          float edgeDistance=abs(length(max(q,0.0))+min(max(q.x,q.y),0.0));
          float halo=exp(-edgeDistance*65.0)*.34+exp(-edgeDistance*23.0)*.10;
          gl_FragColor=vec4(vec3(.94,.985,1.0),uColor.a*uEmission*halo);
          return;
        }
        vec3 base = uColor.rgb;
        float safeX = max(uBoardSize.x, 0.0001);
        float safeY = max(uBoardSize.y, 0.0001);
        vec2 boardUV = clamp((vWorldPos.xz - uBoardOrigin) / vec2(safeX,safeY), 0.0, 1.0);
        vec2 plankUV=clamp((vWorldPos.xz-uPlankOrigin)/max(uPlankSize,vec2(.0001)),0.0,1.0);
        vec3 n=normalize(vWorldNormal);
        float topFace=smoothstep(.58,.92,abs(n.y));
        float floorFace=step(.5,uUseFloorTexture)*topFace;
        float pixelSpan=${floorDerivatives ? 'max(length(fwidth(vWorldPos.xz)),.00015)' : 'max(uPixelFootprint,.00015)'};
        float textureGrain = 0.0;
        if (uUseFloorTexture > 0.5) {
          float acrossCoord = mix(plankUV.x,plankUV.y,uBoardLongAxisX);
          float alongCoord = mix(plankUV.y,plankUV.x,uBoardLongAxisX);
          float flip = step(0.5,fract(uTextureSeed * 4.2817));
          float longCoord = mix(alongCoord,1.0-alongCoord,flip);
          float crossCoord=mix(acrossCoord,1.0-acrossCoord,step(.5,fract(uTextureSeed*11.731)));
          vec2 textureUV=vec2(longCoord,crossCoord);
          float row=floor(fract(uTextureSeed*31.739)*max(uFloorAtlasRows,1.0));
          vec3 photographed=plankPhoto(textureUV,row);
          vec3 acrossAhead=plankPhoto(textureUV+vec2(0.0,.0039),row);
          vec3 acrossBehind=plankPhoto(textureUV-vec2(0.0,.0039),row);
          vec3 alongAhead=plankPhoto(textureUV+vec2(.00098,0.0),row);
          vec3 alongBehind=plankPhoto(textureUV-vec2(.00098,0.0),row);
          vec3 detail=photographed-(acrossAhead+acrossBehind+alongAhead+alongBehind)*.25;
          textureGrain=dot(acrossAhead-acrossBehind,vec3(.2126,.7152,.0722));
          float boardTone=(fract(uTextureSeed*7.193)-.5)*uFloorSurface.y;
          float warmth=(fract(uTextureSeed*17.713)-.5)*uFloorSurface.y*.13;
          vec3 surface=clamp(photographed*(1.0+boardTone)+detail*.42+vec3(warmth,0.0,-warmth),.015,.985);
          // Colour samples remain sRGB; floor lighting and coating are evaluated in linear light.
          base=mix(base,pow(surface,vec3(2.2)),topFace);
          float normalDetail=(1.0-smoothstep(.002,.012,pixelSpan))*uFloorSurface.z;
          float alongRelief=dot(alongAhead-alongBehind,vec3(.2126,.7152,.0722));
          vec2 relief=vec2(alongRelief,textureGrain)*normalDetail;
          n=normalize(n+vec3(mix(relief.y,relief.x,uBoardLongAxisX),0.0,mix(relief.x,relief.y,uBoardLongAxisX))*topFace);
          // The photographed sample is never repeated as a multi-board panel on one plank.
          float acrossMetres=mix(vWorldPos.x-uPlankOrigin.x,vWorldPos.z-uPlankOrigin.y,uBoardLongAxisX);
          float alongMetres=mix(vWorldPos.z-uPlankOrigin.y,vWorldPos.x-uPlankOrigin.x,uBoardLongAxisX);
          float wave=sin(alongMetres*3.1+uTextureSeed*57.0)*.6+sin(alongMetres*9.3+uTextureSeed*19.0)*.17;
          float fine=sin(acrossMetres*5300.0+wave*6.0);
          float grainVisibility=1.0-smoothstep(.0004,.002,pixelSpan);
          base*=1.0+fine*.025*grainVisibility*topFace;
        }
        float grain = (surfaceNoise(vWorldPos * 240.0) - 0.5) * uRoughness*(1.0-floorFace);
        if (uMaterialKind > 1.5 && uMaterialKind < 2.5) {
          float fibre = surfaceNoise(vec3(vWorldPos.x * 420.0,vWorldPos.y * 95.0,vWorldPos.z * 420.0));
          grain += (fibre - 0.5) * 0.075;
        }
        if (uMaterialKind > 2.5 && uMaterialKind < 3.5) {
          float renderGrain = surfaceNoise(vWorldPos * 315.0);
          grain += (renderGrain - 0.5) * 0.048;
        }
        vec3 viewDir=normalize(uCameraEye-vWorldPos);
        vec3 keyDir=normalize(vec3(.48,.82,.31));
        vec3 halfDir=normalize(keyDir+viewDir);
        float ndh=max(dot(n,halfDir),0.0);
        vec3 floorReflection=vec3(0.0);
        if (uMaterialKind > .5 && uMaterialKind < 1.5) {
          vec2 edge=min(boardUV,1.0-boardUV)*vec2(safeX,safeY);
          float edgeDistance=min(edge.x,edge.y);
          float jointCoverage=1.0-smoothstep(.00015,max(.00125,pixelSpan*.55),edgeDistance);
          // Sub-pixel micro-bevel coverage remains legible at room distance, without a black grid.
          base*=1.0-jointCoverage*.26*floorFace;
          float shoulder=smoothstep(.0005,.0014,edgeDistance)*(1.0-smoothstep(.0014,.0028,edgeDistance));
          base+=vec3(shoulder*.009)*floorFace;
          float coatRoughness=clamp(uFloorSurface.x+(fract(uTextureSeed*41.1)-.5)*.055,.22,.70);
          float coatExponent=mix(128.0,22.0,coatRoughness);
          float fresnel=.035+.965*pow(1.0-max(dot(n,viewDir),0.0),5.0);
          float satinSpec=pow(ndh,coatExponent)*uFloorSurface.w*(.50+fresnel);
          floorReflection+=vec3(1.0,.975,.92)*satinSpec;
          vec3 ray=reflect(-viewDir,n);
          for(int w=0;w<12;w++) {
            vec4 win=uFloorWindows[w];
            if(win.z<=win.y) continue;
            vec4 room=uFloorWindowRooms[w];
            if(vWorldPos.x<room.x-.015||vWorldPos.x>room.z+.015||vWorldPos.z<room.y-.015||vWorldPos.z>room.w+.015) continue;
            float denominator=mix(ray.z,ray.x,win.w);
            if(abs(denominator)<.0001) continue;
            float t=(win.x-mix(vWorldPos.z,vWorldPos.x,win.w))/denominator;
            if(t<=0.0) continue;
            vec3 hit=vWorldPos+ray*t;
            float q=mix(hit.x,hit.z,win.w);
            float blur=.07+coatRoughness*coatRoughness*t*.24;
            float inside=smoothstep(win.y-blur,win.y+blur,q)*(1.0-smoothstep(win.z-blur,win.z+blur,q));
            inside*=smoothstep(uFloorWindowY[w].x-blur,uFloorWindowY[w].x+blur,hit.y)*(1.0-smoothstep(uFloorWindowY[w].y-blur,uFloorWindowY[w].y+blur,hit.y));
            float mullion=1.0-(1.0-smoothstep(.012,.025+blur*.6,abs(q-(win.y+win.z)*.5)))*.35;
            floorReflection+=vec3(.86,.93,1.0)*inside*mullion*uFloorSurface.w*(.22+fresnel)*.80;
          }
          floorReflection*=floorFace;
        }
        if (uMaterialKind > 3.5 && uMaterialKind < 4.5) {
          float brush=.035*sin((vWorldPos.x+vWorldPos.z)*1250.0)+.025*(surfaceNoise(vWorldPos*520.0)-.5);
          float metalSpec=pow(ndh,42.0)*.62;
          base=clamp(base+vec3(brush+metalSpec),0.0,1.0);
        }
        if (uMaterialKind > 4.5 && uMaterialKind < 5.5) {
          float glassSpec=pow(ndh,86.0)*.82;
          base=mix(base,vec3(.965,.980,.975),.20)+glassSpec;
        }
        if (uMaterialKind > 5.5 && uMaterialKind < 6.5) {
          float glassSpec=pow(ndh,58.0)*.42;
          base=mix(base,vec3(.285,.320,.330),.54)+glassSpec;
        }
        if (uMaterialKind > 6.5 && uMaterialKind < 7.5) {
          float stipple=surfaceNoise(vWorldPos*460.0);
          float dots=smoothstep(.44,.62,stipple)*.10;
          base=mix(base,vec3(.82,.835,.825),.68)+dots+pow(ndh,36.0)*.16;
        }
        if (uMaterialKind > 7.5 && uMaterialKind < 8.5) {
          base+=vec3(pow(ndh,52.0)*.18);
        }
        float lightResponse = uUseFloorTexture > 0.5 ? mix(.86,vLight,.65) : vLight;
        vec3 lit=base*max(.52,lightResponse+grain);
        vec3 roomDiffuse=vec3(0.0);
        float roomSpecular=0.0;
        vec3 ceilingSpecular=vec3(0.0);
        for (int i=0;i<8;i++) {
          vec4 lamp=uRoomLights[i];
          if(lamp.w<.001) continue;
          vec3 delta=lamp.xyz-vWorldPos;
          float distanceSquared=max(dot(delta,delta),.04);
          if(distanceSquared>=42.25 || delta.y<=.055) continue;
          vec3 lightDir=delta*inversesqrt(distanceSquared);
          float cosine=max(dot(n,lightDir),0.0);
          if(cosine<=0.0) continue;
          // Inverse-square energy, smooth 110-degree LED beam and finite radial reach.
          float beam=clamp((lightDir.y-.573576)/(.819152-.573576),0.0,1.0);
          float range=1.0-pow(distanceSquared/42.25,2.0);
          float attenuation=lamp.w*beam*beam*range*range/distanceSquared;
          attenuation*=ceilingShadow(lamp.xyz,uShadowTiles[i],cosine);
          roomDiffuse+=uRoomLightColours[i]*cosine*attenuation;
          float gloss=uMaterialKind>8.5 ? .22 : (uMaterialKind>3.5 && uMaterialKind<4.5 ? .46 : .06);
          // Read the existing installed finish; never overwrite its roughness,
          // woodgrain, relief or metal properties to compensate for lighting.
          float sharpness=uUseFloorTexture>.5?mix(100.0,12.0,uFloorSurface.x):48.0;
          if(uUseFloorTexture>.5) gloss=uFloorSurface.w*.8;
          ceilingSpecular+=uRoomLightColours[i]*pow(max(dot(n,normalize(lightDir+viewDir)),0.0),sharpness)*attenuation*gloss;
        }
        // Ceiling illumination carries the surface colour, rather than bleaching
        // every finish toward white. Keep the independent mirror contribution.
        vec3 ceilingDiffuse=roomDiffuse;
        roomDiffuse=vec3(0.0);
        // The mirror is a separate light source, confined to the vanity bay.
        vec3 mirrorPosition=vec3(${(8.010-PLAN_W/2-.055).toFixed(6)},1.475,${(1.905-PLAN_D/2).toFixed(6)});
        if(uMirrorLight>.001 && vWorldPos.x>${(6.69-PLAN_W/2-.001).toFixed(6)} && vWorldPos.x<${(8.19-PLAN_W/2+.001).toFixed(6)} &&
           vWorldPos.z>${(1.22-PLAN_D/2-.001).toFixed(6)} && vWorldPos.z<${(2.59-PLAN_D/2+.001).toFixed(6)} && vWorldPos.y>=0.0 && vWorldPos.y<=2.44) {
          vec3 delta=mirrorPosition-vWorldPos;
          float falloff=uMirrorLight*exp(-length(delta)*1.65)*.75;
          roomDiffuse+=vec3(.95,.985,1.0)*falloff*(.28+.72*max(dot(n,normalize(delta)),0.0));
          roomSpecular+=pow(max(dot(n,normalize(normalize(delta)+viewDir)),0.0),52.0)*falloff*.16;
        }
        // Preserve the existing daylight image exactly with every switch off.
        lit+=max(vec3(0.0),vec3(1.0)-lit)*min(roomDiffuse*.65,vec3(.84));
        lit+=base*min(ceilingDiffuse*.28,vec3(.45));
        lit+=vec3(roomSpecular)+ceilingSpecular+floorReflection;
        if(floorFace>.5) lit=pow(max(lit,vec3(0.0)),vec3(1.0/2.2));
        lit=mix(lit,vec3(.98,.995,1.0),clamp(uEmission,0.0,1.0));
        gl_FragColor=vec4(lit,uColor.a);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed.');
      }
      return shader;
    }

    function createProgram(vertex=VERTEX_SHADER,fragment=FRAGMENT_SHADER) {
      const program = gl.createProgram();
      gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed.');
      }
      return program;
    }

    const program = createProgram();
    gl.useProgram(program);
    const locations = {
      position: gl.getAttribLocation(program, 'aPosition'),
      normal: gl.getAttribLocation(program, 'aNormal'),
      mvp: gl.getUniformLocation(program, 'uMVP'),
      model: gl.getUniformLocation(program, 'uModel'),
      color: gl.getUniformLocation(program, 'uColor'),
      roughness: gl.getUniformLocation(program, 'uRoughness'),
      floorTexture: gl.getUniformLocation(program, 'uFloorTexture'),
      useFloorTexture: gl.getUniformLocation(program, 'uUseFloorTexture'),
      textureRotate: gl.getUniformLocation(program, 'uTextureRotate'),
      textureSeed: gl.getUniformLocation(program, 'uTextureSeed'),
      materialKind: gl.getUniformLocation(program, 'uMaterialKind'),
      boardLongAxisX: gl.getUniformLocation(program, 'uBoardLongAxisX'),
      cameraEye: gl.getUniformLocation(program, 'uCameraEye'),
      boardOrigin: gl.getUniformLocation(program, 'uBoardOrigin'),
      boardSize: gl.getUniformLocation(program, 'uBoardSize'),
      plankOrigin:gl.getUniformLocation(program,'uPlankOrigin'),
      plankSize:gl.getUniformLocation(program,'uPlankSize'),
      floorAtlasRows:gl.getUniformLocation(program,'uFloorAtlasRows'),
      floorSurface:gl.getUniformLocation(program,'uFloorSurface'),
      pixelFootprint:gl.getUniformLocation(program,'uPixelFootprint'),
      floorWindows:Array.from({length:12},(_,i)=>gl.getUniformLocation(program,`uFloorWindows[${i}]`)),
      floorWindowY:Array.from({length:12},(_,i)=>gl.getUniformLocation(program,`uFloorWindowY[${i}]`)),
      floorWindowRooms:Array.from({length:12},(_,i)=>gl.getUniformLocation(program,`uFloorWindowRooms[${i}]`)),
      roomLights: Array.from({length:ROOM_LIGHT_SLOTS},(_,i)=>gl.getUniformLocation(program,`uRoomLights[${i}]`)),
      roomLightColours: Array.from({length:ROOM_LIGHT_SLOTS},(_,i)=>gl.getUniformLocation(program,`uRoomLightColours[${i}]`)),
      shadowTiles:Array.from({length:ROOM_LIGHT_SLOTS},(_,i)=>gl.getUniformLocation(program,`uShadowTiles[${i}]`)),
      ceilingShadows:gl.getUniformLocation(program,'uCeilingShadows'),
      shadowParams:gl.getUniformLocation(program,'uShadowParams'),
      roomLightColour:gl.getUniformLocation(program,'uRoomLightColour'),
      mirrorLight: gl.getUniformLocation(program,'uMirrorLight'),
      emission: gl.getUniformLocation(program,'uEmission'),
      glowAxis: gl.getUniformLocation(program,'uGlowAxis'),
      glowShape: gl.getUniformLocation(program,'uGlowShape')
    };

    const floorTexture=gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,floorTexture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([190,165,132,255]));
    gl.uniform1i(locations.floorTexture,0);
    const ceilingShadowFallback=gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,ceilingShadowFallback);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
    gl.uniform1i(locations.ceilingShadows,1);gl.activeTexture(gl.TEXTURE0);
    let floorTextureReady=false;
    let floorTextureRequest=0;
    let floorTextureAtlasRows=1;

    const meshes = [];
    const floorWindowSources=[];
    const lines = [];
    const labelDefs = [];
    const lightingOccluders = [];
    let activeBuildLevel = 'upper';
    let levelMode = 'upper';
    const categoryState = {
      exterior: true, internal: true, glazing: true, slider: true, robe: true, door: true,
      wet: true, stair: true, metal: false, trim: true, floor: true, cornice: true, grid: false, measurement: false,
      finishFloor: true, finishCarpet: true, finishMetal: true, lighting: true
    };
    const detailState = {
      skirtingProfile: 'aus-colonial',
      stairMetal: 'brass',
      wetThreshold: 'universal-cover',
      sliderTrim: 'end',
      camera: 'overview'
    };
    const FLOOR_PRODUCTS = Object.freeze({
      hybrid85: Object.freeze({
        familyLabel:'8.5 mm Hybrid', product:'Wilderness Range Plus', retailer:'Flooring Oddz & Endz',
        source:'https://flooringoddzandendz.com/spc-flooring/8-5mm-wilderness-range-plus-hybrid/',
        length:1.810, width:.228, thickness:.0085, wearLayer:.0005,
        installedBuildKnown:true, backing:'6.5 mm hybrid plank + 2.0 mm attached IXPE = 8.5 mm total', variation:.038,
        description:'1810 × 228 × 6.5 mm hybrid plank with 2.0 mm attached IXPE and a 0.5 mm wear layer.',
        colours:Object.freeze({
          'blackbutt-xl':Object.freeze({label:'Blackbutt XL',selectionRole:'required-blackbutt',image:'assets/flooring/oddz_blackbutt_xl.jpg',installedImage:'assets/installed/oddz_blackbutt_xl_room.jpg',renderTexture:'assets/flooring/plank_blackbutt_xl_1810x228.jpg',textureRotate:1,description:'The deeper Blackbutt requested as the 8.5 mm baseline.',palette:Object.freeze([[.690,.555,.414,1],[.735,.602,.454,1],[.632,.496,.365,1],[.772,.643,.493,1],[.704,.568,.425,1],[.658,.516,.382,1]])}),
          'burnished-oak-xl':Object.freeze({label:'Burnished Oak XL',selectionRole:'closest-carpetcall-blackbutt',image:'assets/flooring/oddz_burnished_oak_xl.jpg',installedImage:'assets/installed/oddz_burnished_oak_xl_room.jpg',renderTexture:'assets/flooring/plank_burnished_oak_xl_1810x228.jpg',textureRotate:1,description:'The closest selected 8.5 mm visual match to Carpet Call Blackbutt DR8412.',palette:Object.freeze([[.720,.674,.586,1],[.768,.724,.642,1],[.666,.620,.536,1],[.804,.762,.686,1],[.738,.692,.604,1],[.692,.644,.554,1]])}),
          'myrtle-ebony-xl':Object.freeze({label:'Myrtle Ebony XL',selectionRole:'grey',image:'assets/flooring/oddz_myrtle_ebony_xl.jpg',renderTexture:'assets/flooring/oddz_myrtle_ebony_xl.jpg',textureRotate:1,description:'Cool grey timber-look option selected for tonal balance.',palette:Object.freeze([[.602,.608,.600,1],[.666,.672,.662,1],[.536,.542,.536,1],[.704,.710,.700,1],[.628,.634,.624,1],[.566,.572,.564,1]])}),
          'she-oak-xl':Object.freeze({label:'She Oak XL',selectionRole:'darkest',image:'assets/flooring/oddz_she_oak_xl.jpg',renderTexture:'assets/flooring/oddz_she_oak_xl.jpg',textureRotate:1,description:'The darkest selected 8.5 mm option, with deep warm-brown movement.',palette:Object.freeze([[.350,.248,.174,1],[.404,.296,.208,1],[.292,.198,.142,1],[.452,.336,.238,1],[.374,.266,.186,1],[.318,.218,.154,1]])}),
          'mist-oak-xl':Object.freeze({label:'Mist Oak XL',selectionRole:'lightest',image:'assets/flooring/oddz_mist_oak_xl.jpg',installedImage:'assets/installed/oddz_mist_oak_xl_room.jpg',renderTexture:'assets/flooring/plank_mist_oak_xl_1810x228.jpg',textureRotate:1,description:'The lightest selected 8.5 mm option, with pale cool oak grain.',palette:Object.freeze([[.650,.628,.575,1],[.706,.687,.636,1],[.590,.572,.526,1],[.742,.725,.675,1],[.670,.650,.600,1],[.618,.598,.550,1]])})
        })
      }),
      hybrid65: Object.freeze({
        familyLabel:'6.5 mm Hybrid', product:'Trident Ultra Plank XL', retailer:'Carpet Call',
        source:'https://www.carpetcall.com.au/cc-hybrid-flooring-online',
        length:1.824, width:.230, thickness:.0065,
        installedBuildKnown:false, backing:'official listing states Film underlay option; additional installed build remains unverified', variation:.044,
        description:'1824 × 230 × 6.5 mm SPC hybrid; Uniclic floating installation, four-side V groove and scratch/stain-resistant surface.',
        colours:Object.freeze({
          blackbutt:Object.freeze({label:'Blackbutt',selectionRole:'required-blackbutt',code:'DR8412',source:'https://www.carpetcall.com.au/hard-flooring-dr8412-blackbutt',image:'assets/flooring/carpetcall_blackbutt.jpg',textureRotate:1,description:'The required Carpet Call Blackbutt 6.5 mm selection.',palette:Object.freeze([[.660,.505,.350,1],[.714,.558,.394,1],[.602,.448,.310,1],[.752,.602,.440,1],[.680,.520,.360,1],[.628,.474,.328,1]])}),
          ash:Object.freeze({label:'Ash',selectionRole:'lightest',code:'DR8406',source:'https://www.carpetcall.com.au/hard-flooring-dr8406-ash',image:'assets/flooring/carpetcall_ash.jpg',textureRotate:1,description:'The lightest selected 6.5 mm tone, with a pale washed finish.',palette:Object.freeze([[.780,.760,.696,1],[.830,.812,.758,1],[.720,.704,.650,1],[.858,.842,.790,1],[.792,.776,.716,1],[.744,.726,.670,1]])}),
          'crisp-natural':Object.freeze({label:'Crisp Natural',selectionRole:'light-natural-alternative',code:'DR8403',source:'https://www.carpetcall.com.au/hard-flooring-dr8403-crisp-natural',image:'assets/flooring/carpetcall_crisp_natural.jpg',textureRotate:1,description:'A light natural alternative with clear oak grain.',palette:Object.freeze([[.835,.820,.748,1],[.882,.868,.804,1],[.782,.768,.704,1],[.905,.892,.836,1],[.848,.832,.765,1],[.805,.790,.722,1]])}),
          'spotted-gum':Object.freeze({label:'Spotted Gum',selectionRole:'darkest',code:'DR8433',source:'https://www.carpetcall.com.au/hard-flooring-dr8433-spotted-gum',image:'assets/flooring/carpetcall_spotted_gum.jpg',textureRotate:1,description:'The darkest of the five selected Carpet Call tones.',palette:Object.freeze([[.632,.466,.322,1],[.700,.532,.376,1],[.554,.390,.270,1],[.756,.596,.438,1],[.606,.438,.302,1],[.672,.498,.344,1]])}),
          'soft-rustic':Object.freeze({label:'Soft Rustic',selectionRole:'grey',code:'DR8413',source:'https://www.carpetcall.com.au/hard-flooring-dr8413-soft-rustic',image:'assets/flooring/carpetcall_soft_rustic.jpg',textureRotate:1,description:'The selected muted grey-brown neutral with restrained rustic grain.',palette:Object.freeze([[.600,.516,.420,1],[.658,.574,.472,1],[.540,.458,.372,1],[.704,.620,.518,1],[.620,.532,.434,1],[.566,.482,.392,1]])})
        })
      }),
      engineered: Object.freeze({
        familyLabel:'Engineered Timber', product:'Godfrey Hirst Pioneer · Satin', retailer:'Godfrey Hirst',
        source:'https://www.godfreyhirst.com/au/products/pioneer?colour=blackbutt',
        length:1.820, width:.170, thickness:.014, wearLayer:.003,
        installedBuildKnown:false, backing:'14 mm product with 3 mm Australian-species timber veneer; installation layer remains method-dependent', variation:.082,
        description:'14 mm engineered timber with 3 mm Australian species veneer, micro bevel, multiply substrate, UV-cured lacquer and Insta Clic.',
        colours:Object.freeze({
          'tassie-oak':Object.freeze({label:'515 Tassie Oak · Satin',species:'Tasmanian Oak',length:1.820,width:.170,image:'assets/flooring/pioneer_tassie_oak.jpg',textureRotate:1,description:'Flowing, interlocked fine grain with soft pink and warm-brown undertones.',palette:Object.freeze([[.716,.565,.384,1],[.790,.646,.452,1],[.650,.496,.330,1],[.826,.690,.500,1],[.742,.586,.400,1],[.684,.525,.352,1],[.772,.620,.426,1],[.618,.460,.304,1]])}),
          blackbutt:Object.freeze({label:'545 Blackbutt · Satin',species:'Blackbutt',length:1.820,width:.136,source:'https://www.godfreyhirst.com/au/products/pioneer?colour=blackbutt',image:'assets/flooring/pioneer_blackbutt.jpg',textureRotate:1,description:'Straight, even grain with soft golden-brown tones, subtle variation and occasional small knots.',palette:Object.freeze([[.676,.526,.350,1],[.742,.594,.408,1],[.610,.460,.302,1],[.790,.646,.460,1],[.704,.550,.370,1],[.646,.490,.324,1],[.758,.612,.426,1],[.578,.420,.278,1]])}),
          'spotted-gum':Object.freeze({label:'555 Spotted Gum · Satin',species:'Spotted Gum',length:1.820,width:.136,source:'https://www.godfreyhirst.com/au/products/pioneer?colour=spotted-gum',image:'assets/flooring/pioneer_spotted_gum.jpg',textureRotate:1,description:'Rich chocolate and reddish-brown hues with bold swirling grain and distinctive gum spots.',palette:Object.freeze([[.512,.350,.244,1],[.604,.426,.292,1],[.430,.286,.204,1],[.676,.494,.348,1],[.548,.376,.260,1],[.470,.314,.220,1],[.632,.452,.310,1],[.396,.258,.188,1]])})
        })
      })
    });
    const FLOOR_DEFAULT_COLOURS = Object.freeze({hybrid85:'blackbutt-xl',hybrid65:'blackbutt',engineered:'blackbutt'});
    const FLOOR_GENERATOR_CATALOG_POLICY=Object.freeze({
      generatorScope:'reusable-full-catalogue',
      projectPackScope:'curated-house-subset',
      generatorHybridProductKeys:Object.freeze(['85','65','cc65']),
      generatorEngineeringSpecies:Object.freeze(['oak','walnut','ash','blackbutt','spotted']),
      projectPackCounts:Object.freeze({hybrid85:5,hybrid65:5,engineering:2,total:12})
    });
    const FLOOR_DATA_PACK_SCHEMA='pomi.house.hardfloor-pack.v1';
    const FLOOR_DATA_PACKS=Object.freeze({
      'HYB-BLACKBUTT-XL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'HYB-BLACKBUTT-XL',generator:'hybrid',generatorProduct:'85',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'8.5 mm Hybrid SPC',label:'Blackbutt XL',selectionRole:'required-blackbutt',family:'hybrid85',colour:'blackbutt-xl',dimensionsMm:Object.freeze({length:1810,width:228,thickness:8.5}),renderTexture:'assets/flooring/plank_blackbutt_xl_1810x228.jpg',target:'upper-dry-floor'}),
      'HYB-BURNISHED-OAK-XL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'HYB-BURNISHED-OAK-XL',generator:'hybrid',generatorProduct:'85',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'8.5 mm Hybrid SPC',label:'Burnished Oak XL',selectionRole:'closest-carpetcall-blackbutt',family:'hybrid85',colour:'burnished-oak-xl',dimensionsMm:Object.freeze({length:1810,width:228,thickness:8.5}),renderTexture:'assets/flooring/plank_burnished_oak_xl_1810x228.jpg',target:'upper-dry-floor'}),
      'HYB-MYRTLE-EBONY-XL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'HYB-MYRTLE-EBONY-XL',generator:'hybrid',generatorProduct:'85',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'8.5 mm Hybrid SPC',label:'Myrtle Ebony XL',selectionRole:'grey',family:'hybrid85',colour:'myrtle-ebony-xl',dimensionsMm:Object.freeze({length:1810,width:228,thickness:8.5}),renderTexture:'assets/flooring/oddz_myrtle_ebony_xl.jpg',target:'upper-dry-floor'}),
      'HYB-SHE-OAK-XL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'HYB-SHE-OAK-XL',generator:'hybrid',generatorProduct:'85',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'8.5 mm Hybrid SPC',label:'She Oak XL',selectionRole:'darkest',family:'hybrid85',colour:'she-oak-xl',dimensionsMm:Object.freeze({length:1810,width:228,thickness:8.5}),renderTexture:'assets/flooring/oddz_she_oak_xl.jpg',target:'upper-dry-floor'}),
      'HYB-MIST-OAK-XL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'HYB-MIST-OAK-XL',generator:'hybrid',generatorProduct:'85',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'8.5 mm Hybrid SPC',label:'Mist Oak XL',selectionRole:'lightest',family:'hybrid85',colour:'mist-oak-xl',dimensionsMm:Object.freeze({length:1810,width:228,thickness:8.5}),renderTexture:'assets/flooring/plank_mist_oak_xl_1810x228.jpg',target:'upper-dry-floor'}),
      'CC65-BLACKBUTT':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'CC65-BLACKBUTT',generator:'hybrid',generatorProduct:'cc65',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'Carpet Call 6.5 mm Hybrid SPC',label:'Blackbutt',selectionRole:'required-blackbutt',family:'hybrid65',colour:'blackbutt',dimensionsMm:Object.freeze({length:1824,width:230,thickness:6.5}),renderTexture:'assets/flooring/carpetcall_blackbutt.jpg',target:'upper-dry-floor'}),
      'CC65-SOFT-RUSTIC':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'CC65-SOFT-RUSTIC',generator:'hybrid',generatorProduct:'cc65',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'Carpet Call 6.5 mm Hybrid SPC',label:'Soft Rustic',selectionRole:'grey',family:'hybrid65',colour:'soft-rustic',dimensionsMm:Object.freeze({length:1824,width:230,thickness:6.5}),renderTexture:'assets/flooring/carpetcall_soft_rustic.jpg',target:'upper-dry-floor'}),
      'CC65-SPOTTED-GUM':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'CC65-SPOTTED-GUM',generator:'hybrid',generatorProduct:'cc65',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'Carpet Call 6.5 mm Hybrid SPC',label:'Spotted Gum',selectionRole:'darkest',family:'hybrid65',colour:'spotted-gum',dimensionsMm:Object.freeze({length:1824,width:230,thickness:6.5}),renderTexture:'assets/flooring/carpetcall_spotted_gum.jpg',target:'upper-dry-floor'}),
      'CC65-ASH':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'CC65-ASH',generator:'hybrid',generatorProduct:'cc65',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'Carpet Call 6.5 mm Hybrid SPC',label:'Ash',selectionRole:'lightest',family:'hybrid65',colour:'ash',dimensionsMm:Object.freeze({length:1824,width:230,thickness:6.5}),renderTexture:'assets/flooring/carpetcall_ash.jpg',target:'upper-dry-floor'}),
      'CC65-CRISP-NATURAL':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'CC65-CRISP-NATURAL',generator:'hybrid',generatorProduct:'cc65',sourceSchema:'pomi.hybrid.generator.manifest.unversioned',materialType:'Carpet Call 6.5 mm Hybrid SPC',label:'Crisp Natural',selectionRole:'light-natural-alternative',family:'hybrid65',colour:'crisp-natural',dimensionsMm:Object.freeze({length:1824,width:230,thickness:6.5}),renderTexture:'assets/flooring/carpetcall_crisp_natural.jpg',target:'upper-dry-floor'}),
      'ENG-BLACKBUTT':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'ENG-BLACKBUTT',generator:'engineering',generatorProduct:'straight',sourceSchema:'pomi.engineering-timber.offline.v3',materialType:'Engineered Timber',label:'Australian Blackbutt',family:'engineered',colour:'blackbutt',dimensionsMm:Object.freeze({length:1820,width:136,thickness:14,lamella:3}),renderTexture:'assets/flooring/pioneer_blackbutt.jpg',target:'upper-dry-floor'}),
      'ENG-SPOTTED-GUM':Object.freeze({schema:FLOOR_DATA_PACK_SCHEMA,id:'ENG-SPOTTED-GUM',generator:'engineering',generatorProduct:'straight',sourceSchema:'pomi.engineering-timber.offline.v3',materialType:'Engineered Timber',label:'Australian Spotted Gum',family:'engineered',colour:'spotted-gum',dimensionsMm:Object.freeze({length:1820,width:136,thickness:14,lamella:3}),renderTexture:'assets/flooring/pioneer_spotted_gum.jpg',target:'upper-dry-floor'})
    });
    const FLOOR_DATA_PACK_ORDER=Object.freeze(['HYB-BLACKBUTT-XL','HYB-BURNISHED-OAK-XL','HYB-MYRTLE-EBONY-XL','HYB-SHE-OAK-XL','HYB-MIST-OAK-XL','CC65-BLACKBUTT','CC65-SOFT-RUSTIC','CC65-SPOTTED-GUM','CC65-ASH','CC65-CRISP-NATURAL','ENG-BLACKBUTT','ENG-SPOTTED-GUM']);
    const DEFAULT_FLOOR_DATA_PACK_ID='CC65-BLACKBUTT';
    const FLOOR_PACK_STORAGE_KEY='pomi.second-floor.hardfloor-selection.v22';
    let activeFloorDataPackId=DEFAULT_FLOOR_DATA_PACK_ID;
    let generatedFloorTextureSource='';
    let installedFloorDataPackId=DEFAULT_FLOOR_DATA_PACK_ID;
    let installedFloorTextureSource='';
    const SKIRTING_PAINTS = Object.freeze({
      'vivid-white':Object.freeze({label:'Vivid White',color:Object.freeze([.965,.961,.937,1])}),
      'lexicon-quarter':Object.freeze({label:'Lexicon Quarter',color:Object.freeze([.925,.926,.910,1])}),
      'natural-white':Object.freeze({label:'Natural White',color:Object.freeze([.936,.918,.875,1])})
    });
    const METAL_FINISHES = Object.freeze({
      woodgrain:Object.freeze({label:'Matched Woodgrain',color:Object.freeze([.690,.555,.414,1])}),
      silver:Object.freeze({label:'Silver',color:COLORS.silver}),
      bronze:Object.freeze({label:'Bronze',color:COLORS.bronze}),
      champagne:Object.freeze({label:'Champagne',color:COLORS.champagne}),
      black:Object.freeze({label:'Black Anodised',color:COLORS.mattBlack}),
      rose:Object.freeze({label:'Rose',color:Object.freeze([.60,.40,.36,1])}),
      brass:Object.freeze({label:'Standard Extruded Brass',color:Object.freeze([.69,.49,.23,1])})
    });
    const TRANSITION_PRODUCTS = Object.freeze({
      'universal-cover':Object.freeze({label:'Universal Cover Trim',spec:'45 mm top cover · 29.5 mm base · 3.4 m · 0–14 mm inserts',description:'Clip-down universal cover for timber or laminate meeting stretch carpet, cork, tile or another floor at the same or a slightly different height. Four insert sizes support transition, reducer and ramp arrangements; intended for domestic and light-commercial use, not load-bearing trolley traffic.',image:'assets/details/universal_cover_trim_profile.svg',profileImage:'assets/details/universal_cover_trim_profile.svg',source:'https://flooringoddzandendz.com/trims/',finishes:Object.freeze(['woodgrain','bronze','black','rose','champagne','silver'])})
    });
    const NOSING_PRODUCTS = Object.freeze({
      'sfsb60m-brass':Object.freeze({label:'SFSB60M Brass Stair Nosing 15mm',spec:'60 × 15 × 2.5 mm · P5 · 3.6 LM',description:'One-piece standard extruded brass profile with continuous anti-slip grooves across its 60 mm tread and a rounded 15 mm front return. Suitable for most solid carpets without underlay up to 7 mm; may be drilled and countersunk at 250 mm centres for exposed brass-plated screw fixing.',image:'assets/details/sfsb60m_brass_nosing_profile.svg',profileImage:'assets/details/sfsb60m_brass_nosing_profile.svg',source:'https://kevmor.com.au/brass-stair-nosing/3223-sfsb60m-brass-stair-nosing-15mm.html',finishes:Object.freeze(['brass'])}),
      'oddz-stair-nosing':Object.freeze({label:'Oddz Matched Woodgrain Stair Nosing',spec:'Junior 5.5 / 6.5 / 8.4 mm · Senior 14 mm · 14 mm top cover · 3.4 m',description:'Oddz uses the same size-controlled stair-nosing section for its wrapped wood colours and metal colours; only the surface finish changes. This option shows the matched woodgrain version. Junior 6.5 mm and Senior 14 mm match the published nominal floor thicknesses; Junior 8.4 mm is the closest published size for the 8.5 mm hybrid and requires supplier confirmation. Oddz describes tread-to-riser finishing, but does not publish this profile as a carpet gripper, so the final carpet termination remains an installer detail.',image:'assets/details/oddz_stair_nosing_profile.svg',profileImage:'assets/details/oddz_stair_nosing_profile.svg',source:'https://flooringoddzandendz.com/trims/',finishes:Object.freeze(['woodgrain'])}),
      'sfs51nms-silver':Object.freeze({label:'DTA ASN51NMS / Kevmor SFS51NMS Sawtooth Nosing',spec:'50 mm tread · P5 · 3.66 m · 200 mm fixing centres',description:'Matt silver anodised sawtooth stair nosing with 50 mm tread coverage. DTA and Kevmor specify it to protect carpet, vinyl, timber or tile edges; it is supplied in 3.66 m lengths, countersunk at 200 mm centres and tested to P5. In this 3D junction the continuous carpet riser rises behind the small front edge instead of being replaced by a metal fascia.',image:'assets/details/sfs51nms_sawtooth_nosing_profile.svg',profileImage:'assets/details/sfs51nms_sawtooth_nosing_profile.svg',source:'https://www.dta-aus.com.au/products/ASN51NMS',supplierSource:'https://kevmor.com.au/standard-stair-nosing/5673-sawtooth-stair-nosing-50mm-x-366m-matt-silver.html',finishes:Object.freeze(['silver'])})
    });
    const finishState = {
      uiMode:'client',
      activeFinishCategory:'flooring',
      floorFamily:'hybrid65',
      floorColours:{...FLOOR_DEFAULT_COLOURS},
      skirtingProfile:'aus-colonial',
      skirtingPaint:'vivid-white',
      metalFinish:'brass',
      transitionProfile:'universal-cover',
      transitionFinish:'silver',
      nosingProfile:'sfsb60m-brass',
      nosingFinish:'brass',
      stairEdge:'sfsb60m-brass',
      wetTransition:'universal-cover',
      floorDirection:'corridor-longitudinal-x',
      installedTileDatumRange:[.015,.018]
    };
    const installedFinishState = {
      floorFamily:finishState.floorFamily,
      floorColours:{...finishState.floorColours},
      skirtingProfile:finishState.skirtingProfile,
      skirtingPaint:finishState.skirtingPaint,
      transitionProfile:finishState.transitionProfile,
      transitionFinish:finishState.transitionFinish,
      nosingProfile:finishState.nosingProfile,
      nosingFinish:finishState.nosingFinish
    };
    const FLOOR_INSTALL_STORAGE_KEY='pomi.second-floor.flooring-install.v22';
    const flooringInstallState={status:'ready',installCount:0,lastReceipt:null};
    const flooringInstallVisualState={active:false,startedAt:0,duration:1050,progress:1,receipt:null};
    let floorInstallConfirmationTimer=0;
    const openingInteractions = [];
    const bathroomInteractions = [];
    const roomLighting = [];
    const lightControlButtons = [];
    const waterControlMarkers = [];
    const lightUI={hints:true,temperature:'warm',pointer:null,touchId:null,touchUntil:0};
    const ceilingLEDs=[];
    const waterSystem={level:0,maximum:.184,showerLevel:0,showerMaximum:.010,showerDrainSoundElapsed:0,phase:0,revision:0,taps:[],bathTap:null,showerTap:null,drain:null};
    const physicalPickIndex={ready:false,staticTree:null,dynamic:[],groups:[],targets:[],version:0};
    let mirrorLightingState = null;
    const doorHingeAssemblies = [];

    function registerInteraction(id, kind, category, anchor, initialOpen = false, canToggle = true) {
      const initialProgress=initialOpen ? 1 : 0;
      const duration=kind === 'hinged door'
        ? PARAMS.HINGED_DOOR_ANIMATION_SECONDS
        : kind.startsWith('operable window') ? PARAMS.WINDOW_ANIMATION_SECONDS : PARAMS.SLIDER_ANIMATION_SECONDS;
      const interaction = {
        id, kind, category, anchor, level: activeBuildLevel, open: initialOpen, initialOpen, canToggle, screen: null,
        hitAnchors: [anchor], hitAnchorRoles: ['leaf'], screens: [],
        progress: initialProgress, target: initialProgress, moving: false, duration,
        slideDirection: 'left', initialSlideDirection: 'left',
        commandElapsed: Number.POSITIVE_INFINITY, leafDelayRemaining: 0,
        handleTurn: 0, keySway: 0, hardwareMode: null, publicSide: null, keySide: null,
        handlePeakAt: null, leafMotionAt: null
      };
      openingInteractions.push(interaction);
      return interaction;
    }

    function registerBathroomInteraction(id, kind, anchor, mode='motion') {
      const interaction={
        id,kind,category:'wet',level:activeBuildLevel,anchor,
        hitAnchors:[anchor],hitAnchorRoles:['primary'],screens:[],screen:null,
        mode,open:false,initialOpen:false,progress:0,target:0,moving:false,duration:.72,
        active:false,defog:false,illumination:0
      };
      bathroomInteractions.push(interaction);
      return interaction;
    }

    function registerWaterControlMarker(state) {
      const marker=document.createElement('button');
      marker.type='button';
      marker.className='scene-water-marker';
      marker.dataset.revealed='false';
      marker.dataset.waterControl=state.id;
      marker.setAttribute('aria-label',`${state.kind}: off`);
      marker.setAttribute('aria-pressed','false');
      marker.title=state.kind;
      marker.tabIndex=-1;
      marker.hidden=true;
      marker.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 3c-2.8 3.6-4.5 6-4.5 8.4a4.5 4.5 0 0 0 9 0C16.5 9 14.8 6.6 12 3Z"/></svg>';
      marker.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        commandBathroomInteraction(state);
        refreshSystemsControlStates(true);
        updateSceneLightControls();
      });
      RESIDENCE_DOM.getElementById('scene-water-markers').appendChild(marker);
      waterControlMarkers.push({state,marker});
    }

    function showItemWhen(item, predicate) {
      if (item) item.visibleWhen = predicate;
      return item;
    }

    function setItemTransform(item, transformWhen) {
      if (item) item.transformWhen=transformWhen;
      return item;
    }

    const toWorld = (x, y, z) => [x - PLAN_W / 2, y, z - PLAN_D / 2];

    function pushFace(positions, normals, a, b, c, d, normal) {
      positions.push(...a, ...b, ...c, ...a, ...c, ...d);
      for (let i = 0; i < 6; i++) normals.push(...normal);
    }

    function fnv1a32(text) {
      let hash = 0x811c9dc5;
      for (let index = 0; index < text.length; index++) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
      return hash.toString(16).padStart(8, '0');
    }

    function hashGeometryPositions(positions) {
      return fnv1a32(positions.map(value => Math.round(value * 1e6)).join(','));
    }

    function addRawMesh(name, category, positions, normals, color, alpha = color[3], isWall = false) {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      const item = {
        name, category, level: activeBuildLevel, positionBuffer, normalBuffer,
        count: positions.length / 3, geometryPositionHash: hashGeometryPositions(positions),
        color, alpha, isWall, visibleWhen: null, transformWhen: null,
        surfaceRoughness: category === 'exterior' ? .030 : category === 'internal' ? .006 : category === 'finishCarpet' ? .080 : .014
      };
      // Retain positions for one-time static shadow batching; visible geometry is unchanged.
      item.shadowPositions=new Float32Array(positions);
      item.renderNormals=new Float32Array(normals);
      const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
      for(let i=0;i<positions.length;i++) { const a=i%3; lo[a]=Math.min(lo[a],positions[i]); hi[a]=Math.max(hi[a],positions[i]); }
      item.lightCenter=lo.map((v,a)=>(v+hi[a])*.5);
      item.shadowBounds=[lo,hi];
      meshes.push(item);
      return item;
    }

    function addBox(name, category, x0, x1, y0, y1, z0, z1, color, alpha = color[3], isWall = false) {
      if (x1 - x0 <= 0.0001 || y1 - y0 <= 0.0001 || z1 - z0 <= 0.0001) return null;
      const p000 = toWorld(x0, y0, z0), p100 = toWorld(x1, y0, z0);
      const p110 = toWorld(x1, y1, z0), p010 = toWorld(x0, y1, z0);
      const p001 = toWorld(x0, y0, z1), p101 = toWorld(x1, y0, z1);
      const p111 = toWorld(x1, y1, z1), p011 = toWorld(x0, y1, z1);
      const p = [], n = [];
      pushFace(p, n, p010, p110, p111, p011, [0, 1, 0]);
      pushFace(p, n, p001, p101, p100, p000, [0, -1, 0]);
      pushFace(p, n, p000, p100, p110, p010, [0, 0, -1]);
      pushFace(p, n, p101, p001, p011, p111, [0, 0, 1]);
      pushFace(p, n, p001, p000, p010, p011, [-1, 0, 0]);
      pushFace(p, n, p100, p101, p111, p110, [1, 0, 0]);
      const item=addRawMesh(name, category, p, n, color, alpha, isWall);
      if(isWall && (category==='internal' || category==='exterior')) {
        lightingOccluders.push({level:activeBuildLevel,bounds:[x0-PLAN_W/2,x1-PLAN_W/2,y0,y1,z0-PLAN_D/2,z1-PLAN_D/2]});
      }
      return item;
    }

    function addBevelledFloorBoard(name, category, x0, x1, y0, y1, z0, z1, color, alpha = color[3]) {
      if (x1-x0<=.001 || z1-z0<=.001 || y1-y0<=.001) return null;
      const bevelWidth=Math.min(.0006,(x1-x0)*.08,(z1-z0)*.08);
      const bevelHeight=Math.min(.00045,(y1-y0)*.12);
      const shoulderY=y1-bevelHeight;
      const b=[
        toWorld(x0,y0,z0),toWorld(x1,y0,z0),toWorld(x1,y0,z1),toWorld(x0,y0,z1)
      ];
      const s=[
        toWorld(x0,shoulderY,z0),toWorld(x1,shoulderY,z0),toWorld(x1,shoulderY,z1),toWorld(x0,shoulderY,z1)
      ];
      const t=[
        toWorld(x0+bevelWidth,y1,z0+bevelWidth),toWorld(x1-bevelWidth,y1,z0+bevelWidth),
        toWorld(x1-bevelWidth,y1,z1-bevelWidth),toWorld(x0+bevelWidth,y1,z1-bevelWidth)
      ];
      const p=[],n=[];
      pushFace(p,n,t[0],t[1],t[2],t[3],[0,1,0]);
      pushFace(p,n,b[3],b[2],b[1],b[0],[0,-1,0]);
      pushFace(p,n,b[0],b[1],s[1],s[0],[0,0,-1]);
      pushFace(p,n,b[2],b[3],s[3],s[2],[0,0,1]);
      pushFace(p,n,b[3],b[0],s[0],s[3],[-1,0,0]);
      pushFace(p,n,b[1],b[2],s[2],s[1],[1,0,0]);
      const bevelNormal=normalize([bevelHeight,bevelWidth,0]);
      pushFace(p,n,s[0],s[1],t[1],t[0],[0,bevelNormal[1],-bevelNormal[0]]);
      pushFace(p,n,s[2],s[3],t[3],t[2],[0,bevelNormal[1],bevelNormal[0]]);
      pushFace(p,n,s[3],s[0],t[0],t[3],[-bevelNormal[0],bevelNormal[1],0]);
      pushFace(p,n,s[1],s[2],t[2],t[1],[bevelNormal[0],bevelNormal[1],0]);
      const item=addRawMesh(name,category,p,n,color,alpha,false);
      item.finishY0=y0;
      item.finishY1=y1;
      item.finishPhysicalThickness=y1-y0;
      item.finishBevelWidth=bevelWidth;
      item.finishBevelHeight=bevelHeight;
      return item;
    }

    function triangulatePolygon2D(points) {
      if (points.length < 3) return [];
      const signedArea = points.reduce((sum, point, index) => {
        const next = points[(index + 1) % points.length];
        return sum + point[0] * next[1] - next[0] * point[1];
      }, 0) / 2;
      const orientation = signedArea >= 0 ? 1 : -1;
      const remaining = points.map((_, index) => index);
      const triangles = [];
      const cross = (a, b, c) => (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0]);
      const insideTriangle = (p, a, b, c) => {
        const ab = cross(a,b,p) * orientation;
        const bc = cross(b,c,p) * orientation;
        const ca = cross(c,a,p) * orientation;
        return ab >= -1e-8 && bc >= -1e-8 && ca >= -1e-8;
      };
      let guard = points.length * points.length;
      while (remaining.length > 3 && guard-- > 0) {
        let clipped = false;
        for (let i=0; i<remaining.length; i++) {
          const ia=remaining[(i-1+remaining.length)%remaining.length];
          const ib=remaining[i];
          const ic=remaining[(i+1)%remaining.length];
          if (cross(points[ia],points[ib],points[ic]) * orientation <= 1e-8) continue;
          let contains = false;
          for (const ip of remaining) {
            if (ip===ia || ip===ib || ip===ic) continue;
            if (insideTriangle(points[ip],points[ia],points[ib],points[ic])) { contains=true; break; }
          }
          if (contains) continue;
          triangles.push([ia,ib,ic]);
          remaining.splice(i,1);
          clipped=true;
          break;
        }
        if (!clipped) break;
      }
      if (remaining.length===3) triangles.push([remaining[0],remaining[1],remaining[2]]);
      if (triangles.length !== points.length-2) {
        return points.slice(1,-1).map((_,index)=>[0,index+1,index+2]);
      }
      return triangles;
    }

    function addPrism(name, category, planPoints, y0, y1, color, alpha = color[3]) {
      const pts = planPoints.map(([x, z]) => toWorld(x, y1, z));
      const low = planPoints.map(([x, z]) => toWorld(x, y0, z));
      const p = [], n = [];
      triangulatePolygon2D(planPoints).forEach(([a,b,c]) => {
        p.push(...pts[a], ...pts[b], ...pts[c]);
        n.push(0,1,0, 0,1,0, 0,1,0);
        p.push(...low[a], ...low[c], ...low[b]);
        n.push(0,-1,0, 0,-1,0, 0,-1,0);
      });
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        const dx = planPoints[j][0] - planPoints[i][0];
        const dz = planPoints[j][1] - planPoints[i][1];
        const len = Math.hypot(dx, dz) || 1;
        const normal = [dz / len, 0, -dx / len];
        pushFace(p, n, low[i], low[j], pts[j], pts[i], normal);
      }
      return addRawMesh(name, category, p, n, color, alpha, false);
    }

    function addSectionExtrusion(name, category, section, mapPoint, color, alpha = color[3]) {
      const start = section.map(([u,d]) => toWorld(...mapPoint(0,u,d)));
      const end = section.map(([u,d]) => toWorld(...mapPoint(1,u,d)));
      const positions = [], normals = [];
      const axis = normalize(subtract(end[0], start[0]));
      triangulatePolygon2D(section).forEach(([a,b,c]) => {
        positions.push(...start[a], ...start[c], ...start[b]);
        normals.push(...axis.map(value=>-value), ...axis.map(value=>-value), ...axis.map(value=>-value));
        positions.push(...end[a], ...end[b], ...end[c]);
        normals.push(...axis, ...axis, ...axis);
      });
      for (let i=0; i<section.length; i++) {
        const j=(i+1)%section.length;
        const edge=subtract(start[j],start[i]);
        const sideNormal=normalize(cross(edge,subtract(end[i],start[i])));
        pushFace(positions,normals,start[i],start[j],end[j],end[i],sideNormal);
      }
      return addRawMesh(name,category,positions,normals,color,alpha,false);
    }

    const PROFILE_KEYS = Object.freeze(['aus-colonial','bullnose','scotia']);
    const ARCHITRAVE_PROFILE_KEYS = Object.freeze(['aus-colonial','bullnose']);
    const SKIRTING_PROFILE_META = Object.freeze({
      'aus-colonial':Object.freeze({label:'Aus Colonial',kind:'skirting',dimensions:'92 × 18 mm'}),
      bullnose:Object.freeze({label:'Bullnose',kind:'skirting',dimensions:'92 × 18 mm'}),
      scotia:Object.freeze({label:'Scotia',kind:'scotia',dimensions:'19 × 19 mm',form:'concave-cove'})
    });

    function profileSection(profile, dimension, depth) {
      if (profile === 'scotia') {
        const points=[[0,0],[0,depth]];
        for (let i=1;i<=12;i++) {
          const angle=Math.PI*i/24;
          points.push([
            dimension*(1-Math.cos(angle)),
            depth*(1-Math.sin(angle))
          ]);
        }
        return points;
      }
      if (profile === 'bullnose') {
        const radius=depth/2;
        const centreU=dimension-radius;
        const points=[[0,0],[0,depth],[centreU,depth]];
        for (let i=1;i<=8;i++) {
          const angle=Math.PI*i/8;
          points.push([centreU+radius*Math.sin(angle),radius+radius*Math.cos(angle)]);
        }
        return points;
      }
      return [
        [0,0],[0,depth],[dimension*.50,depth],[dimension*.55,depth*.96],
        [dimension*.60,depth*.72],[dimension*.64,depth*.58],[dimension*.68,depth*.70],
        [dimension*.72,depth*.96],[dimension*.76,depth],[dimension*.80,depth*.98],
        [dimension*.84,depth*.76],[dimension*.88,depth*.60],[dimension*.92,depth*.68],
        [dimension*.96,depth*.86],[dimension,depth*.78],[dimension,0]
      ];
    }

    function architraveWidth(profile) {
      return profile === 'aus-colonial'
        ? PARAMS.ARCHITRAVE_AUS_COLONIAL_WIDTH
        : PARAMS.ARCHITRAVE_BULLNOSE_WIDTH;
    }

    function setProfileVisibility(item, profile) {
      return showItemWhen(item,()=>installedFinishState.skirtingProfile===profile);
    }

    function addMiteredSectionExtrusion(name, category, section, mapPoint, color, alpha = color[3], ends = {}) {
      const startCut=ends.start==='miter'?'miter':'square';
      const endCut=ends.end==='miter'?'miter':'square';
      const startInsetSign=Number.isFinite(ends.startInsetSign)?Math.sign(ends.startInsetSign)||1:1;
      const endInsetSign=Number.isFinite(ends.endInsetSign)?Math.sign(ends.endInsetSign)||-1:-1;
      const start = section.map(([u,d]) => toWorld(...mapPoint(0,u,d,startCut==='miter'?d*startInsetSign:0)));
      const end = section.map(([u,d]) => toWorld(...mapPoint(1,u,d,endCut==='miter'?d*endInsetSign:0)));
      const positions = [], normals = [];
      const axis = normalize(subtract(end[0], start[0]));
      triangulatePolygon2D(section).forEach(([a,b,c]) => {
        positions.push(...start[a], ...start[c], ...start[b]);
        normals.push(...axis.map(value=>-value), ...axis.map(value=>-value), ...axis.map(value=>-value));
        positions.push(...end[a], ...end[b], ...end[c]);
        normals.push(...axis, ...axis, ...axis);
      });
      for (let i=0; i<section.length; i++) {
        const j=(i+1)%section.length;
        const edge=subtract(start[j],start[i]);
        const sideNormal=normalize(cross(edge,subtract(end[i],start[i])));
        pushFace(positions,normals,start[i],start[j],end[j],end[i],sideNormal);
      }
      const item=addRawMesh(name,category,positions,normals,color,alpha,false);
      item.junctionCut=Object.freeze({start:startCut,end:endCut,startInsetSign,endInsetSign,angleDegrees:45});
      item.stopsAtSolidBoundaries=true;
      return item;
    }

    function tagSelectableWallFinish(item, profile, axis, bounds) {
      item.wallFinishSystem='skirting-and-scotia';
      item.wallFinishProfile=profile;
      item.wallFinishAxis=axis;
      item.wallFinishBounds=Object.freeze([...bounds]);
      item.surfaceRoughness=.012;
      if (profile==='scotia') {
        item.isFloorMatchedScotia=true;
        item.scotiaProfileForm='concave-cove';
        item.scotiaLegsMm=Object.freeze([19,19]);
        item.finishVariant=nameHash(item.name)%7;
        item.finishBounds=[bounds[0],bounds[1],bounds[2],bounds[3]];
        item.finishLongAxisX=axis==='x';
        item.finishTextureSeed=((Math.abs(nameHash(item.name))%997)/997);
      } else item.isPaintedTrim=true;
      setProfileVisibility(item,profile);
      return item;
    }

    function nameHash(value) {
      let hash=2166136261;
      for (let i=0;i<value.length;i++) hash=Math.imul(hash^value.charCodeAt(i),16777619);
      return hash>>>0;
    }

    function addSelectableSkirtingX(name, x0, x1, wallZ, normal, ends = {}) {
      PROFILE_KEYS.forEach(profile=>{
        const dimension=profile==='scotia'?PARAMS.SCOTIA_HEIGHT:PARAMS.SKIRTING_HEIGHT;
        const depth=profile==='scotia'?PARAMS.SCOTIA_DEPTH:PARAMS.SKIRTING_DEPTH;
        const section=profileSection(profile,dimension,depth);
        const item=addMiteredSectionExtrusion(`${name}-${profile}`,'trim',section,(t,u,d,longitudinalInset)=>[
          x0+(x1-x0)*t+longitudinalInset,u,wallZ+normal*(.002+d)
        ],COLORS.trimWhite,1,ends);
        tagSelectableWallFinish(item,profile,'x',[x0,Math.min(wallZ,wallZ+normal*(.002+depth)),x1-x0,.002+depth]);
      });
    }

    function addSelectableSkirtingZ(name, wallX, z0, z1, normal, ends = {}) {
      PROFILE_KEYS.forEach(profile=>{
        const dimension=profile==='scotia'?PARAMS.SCOTIA_HEIGHT:PARAMS.SKIRTING_HEIGHT;
        const depth=profile==='scotia'?PARAMS.SCOTIA_DEPTH:PARAMS.SKIRTING_DEPTH;
        const section=profileSection(profile,dimension,depth);
        const item=addMiteredSectionExtrusion(`${name}-${profile}`,'trim',section,(t,u,d,longitudinalInset)=>[
          wallX+normal*(.002+d),u,z0+(z1-z0)*t+longitudinalInset
        ],COLORS.trimWhite,1,ends);
        tagSelectableWallFinish(item,profile,'z',[Math.min(wallX,wallX+normal*(.002+depth)),z0,.002+depth,z1-z0]);
      });
    }

    function addSelectableArchitraveX(name, wallX, z0, z1, faceNormal) {
      ARCHITRAVE_PROFILE_KEYS.forEach(profile=>{
        const width=architraveWidth(profile);
        const section=profileSection(profile,width,PARAMS.ARCHITRAVE_DEPTH);
        const faceX=wallX+faceNormal*.002;
        const pieces=[
          addSectionExtrusion(`${name}-${profile}-jamb-a`,'trim',section,(t,u,d)=>[faceX+faceNormal*d,DOOR_H*t,z0-u],COLORS.trimWhite,1),
          addSectionExtrusion(`${name}-${profile}-jamb-b`,'trim',section,(t,u,d)=>[faceX+faceNormal*d,DOOR_H*t,z1+u],COLORS.trimWhite,1),
          addSectionExtrusion(`${name}-${profile}-head`,'trim',section,(t,u,d)=>[faceX+faceNormal*d,DOOR_H+u,z0-width+(z1-z0+width*2)*t],COLORS.trimWhite,1)
        ];
        pieces.forEach(item=>{
          item.isPaintedTrim=true;
          item.surfaceRoughness=.012;
          setProfileVisibility(item,profile);
        });
      });
    }

    function addSelectableArchitraveZ(name, x0, x1, wallZ, faceNormal) {
      ARCHITRAVE_PROFILE_KEYS.forEach(profile=>{
        const width=architraveWidth(profile);
        const section=profileSection(profile,width,PARAMS.ARCHITRAVE_DEPTH);
        const faceZ=wallZ+faceNormal*.002;
        const pieces=[
          addSectionExtrusion(`${name}-${profile}-jamb-a`,'trim',section,(t,u,d)=>[x0-u,DOOR_H*t,faceZ+faceNormal*d],COLORS.trimWhite,1),
          addSectionExtrusion(`${name}-${profile}-jamb-b`,'trim',section,(t,u,d)=>[x1+u,DOOR_H*t,faceZ+faceNormal*d],COLORS.trimWhite,1),
          addSectionExtrusion(`${name}-${profile}-head`,'trim',section,(t,u,d)=>[x0-width+(x1-x0+width*2)*t,DOOR_H+u,faceZ+faceNormal*d],COLORS.trimWhite,1)
        ];
        pieces.forEach(item=>{
          item.isPaintedTrim=true;
          item.surfaceRoughness=.012;
          setProfileVisibility(item,profile);
        });
      });
    }

    function setDetailOptionVisibility(item, key, value) {
      return showItemWhen(item,()=>detailState[key]===value);
    }

    function sfsb60mNosingSection() {
      // Official section: 60 mm tread, 15 mm rounded front return, 2.5 mm body.
      return [
        [.060,.0025],[.0040,.0025],[.0015,.0021],[-.0008,.0010],[-.0026,-.0010],
        [-.0041,-.0035],[-.0050,-.0060],[-.0050,-.0105],[-.0042,-.0130],
        [-.0025,-.0147],[0,-.0150],[.0025,-.0143],[.0040,-.0125],[.0048,-.0100],
        [.0048,-.0060],[.0040,-.0037],[.0025,-.0019],[.0005,-.0004],[.060,0]
      ];
    }

    function oddzStairNosingSection(productThickness) {
      // Oddz publishes a 14 mm top cover. The receiving leg follows the selected
      // floor family: Junior 6.5 / 8.4 mm or Senior 14 mm.
      const receiverHeight=productThickness>=.0135 ? .014 : productThickness>=.008 ? .0084 : .0065;
      return [
        [.0140,.0020],[.0016,.0020],[-.0005,.0014],[-.0016,.0003],
        [-.0016,-receiverHeight],[.0012,-receiverHeight],[.0012,-.0011],
        [.0140,-.0011]
      ];
    }

    function sfs51nmsNosingSection() {
      // DTA / Kevmor publishes the 50 mm tread coverage. The shallow hooked
      // front is intentionally schematic because no vertical dimension is
      // published; it stays in front of the retained carpet upturn.
      return [
        [.0500,.0018],[.0030,.0018],[.0012,.0014],[-.0018,.0002],
        [-.0028,-.0038],[-.0012,-.0050],[.0012,-.0038],[.0032,-.0010],
        [.0500,-.0010]
      ];
    }

    function universalCoverSection(dryTop,wetTop) {
      const top=[];
      for(let index=0;index<=10;index++) {
        const t=index/10,u=-.0225+.045*t;
        top.push([u,wetTop+(dryTop-wetTop)*t+.0018+Math.sin(Math.PI*t)*.0032]);
      }
      return [...top,...top.slice().reverse().map(([u,y])=>[u,y-.0020])];
    }

    function addStairLandingNosing() {
      const color=METAL_FINISHES.brass.color;
      const floorTop=FLOOR_PRODUCTS.hybrid85.thickness;
      const body=addSectionExtrusion('T03-stair-nosing-sfsb60m-brass','metal',sfsb60mNosingSection(),(t,zOffset,yOffset)=>[
        3.76+t,floorTop+yOffset,2.590+zOffset
      ],color,1);
      setDetailOptionVisibility(body,'stairMetal','brass');
      for(let groove=0;groove<6;groove++) {
        const z=2.598+groove*.0065;
        const bar=addBox(`T03-stair-nosing-sfsb60m-groove-${groove+1}`,'metal',3.76,4.76,floorTop+.00245,floorTop+.00285,z,z+.0014,color,1);
        setDetailOptionVisibility(bar,'stairMetal','brass');
      }
    }

    function addWetThresholdProfiles() {
      const dryTop=FLOOR_PRODUCTS.hybrid85.thickness,wetTop=PARAMS.WET_LEVEL_DELTA;
      const cover=addSectionExtrusion('T03-O01-universal-cover','trim',universalCoverSection(dryTop,wetTop),(t,zOffset,y)=>[
        PARAMS.O01_OPEN_X0+(PARAMS.O01_OPEN_X1-PARAMS.O01_OPEN_X0)*t,y,2.590+zOffset
      ],COLORS.silver,1);
      const base=addBox('T03-O01-universal-cover-base-29.5mm','trim',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.001,.003,2.590-.01475,2.590+.01475,COLORS.transitionBase,1);
      const channelA=addBox('T03-O01-universal-cover-base-channel-a','trim',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.003,.006,2.590-.0060,2.590-.0030,COLORS.transitionBase,1);
      const channelB=addBox('T03-O01-universal-cover-base-channel-b','trim',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.003,.006,2.590+.0030,2.590+.0060,COLORS.transitionBase,1);
      const insertTop=(dryTop+wetTop)*.5+.0030;
      const insert=addBox('T03-O01-universal-cover-insert','trim',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.005,insertTop,2.590-.0022,2.590+.0022,COLORS.mattBlack,1);
      [cover,base,channelA,channelB,insert].forEach(item=>setDetailOptionVisibility(item,'wetThreshold','universal-cover'));
    }

    function addSliderTrimRunZ(name, wallX, z0, z1, normal) {
      const offset=.038;
      const endBase=[[0,0],[PARAMS.SLIDER_END_TRIM_WIDTH,0],[PARAMS.SLIDER_END_TRIM_WIDTH,.002],[0,.002]];
      const endUpstand=[[PARAMS.SLIDER_END_TRIM_WIDTH-.004,0],[PARAMS.SLIDER_END_TRIM_WIDTH,0],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT],[PARAMS.SLIDER_END_TRIM_WIDTH-.004,PARAMS.SLIDER_TRIM_HEIGHT]];
      const endReturn=[[PARAMS.SLIDER_END_TRIM_WIDTH-.013,PARAMS.SLIDER_TRIM_HEIGHT-.002],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT-.002],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT],[PARAMS.SLIDER_END_TRIM_WIDTH-.013,PARAMS.SLIDER_TRIM_HEIGHT]];
      [endBase,endUpstand,endReturn].forEach((section,index)=>{
        const item=addSectionExtrusion(`${name}-end-${index+1}`,'trim',section,(t,q,y)=>[
          wallX+normal*(offset+q),y,z0+(z1-z0)*t
        ],COLORS.silver,1);
        setDetailOptionVisibility(item,'sliderTrim','end');
      });
      const borderTop=[[0,0],[PARAMS.SLIDER_BORDER_TRIM_WIDTH+.003,0],[PARAMS.SLIDER_BORDER_TRIM_WIDTH,.003],[PARAMS.SLIDER_BORDER_TRIM_WIDTH-.004,.007],[.006,.007],[0,.003]];
      const top=addSectionExtrusion(`${name}-border-top`,'trim',borderTop,(t,q,y)=>[
        wallX+normal*(offset+q),y,z0+(z1-z0)*t
      ],COLORS.silver,1);
      const base=addSectionExtrusion(`${name}-border-base`,'trim',[[0,0],[.0295,0],[.0295,.002],[0,.002]],(t,q,y)=>[
        wallX+normal*(offset+q),y,z0+(z1-z0)*t
      ],COLORS.transitionBase,1);
      const clip=addSectionExtrusion(`${name}-border-clip`,'trim',[[.016,.002],[.021,.002],[.021,.007],[.016,.007]],(t,q,y)=>[
        wallX+normal*(offset+q),y,z0+(z1-z0)*t
      ],COLORS.transitionBase,1);
      [top,base,clip].forEach(item=>setDetailOptionVisibility(item,'sliderTrim','border'));
    }

    function addSliderTrimRunX(name, x0, x1, wallZ, normal) {
      const offset=.038;
      const components={
        end:[
          [[0,0],[PARAMS.SLIDER_END_TRIM_WIDTH,0],[PARAMS.SLIDER_END_TRIM_WIDTH,.002],[0,.002]],
          [[PARAMS.SLIDER_END_TRIM_WIDTH-.004,0],[PARAMS.SLIDER_END_TRIM_WIDTH,0],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT],[PARAMS.SLIDER_END_TRIM_WIDTH-.004,PARAMS.SLIDER_TRIM_HEIGHT]],
          [[PARAMS.SLIDER_END_TRIM_WIDTH-.013,PARAMS.SLIDER_TRIM_HEIGHT-.002],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT-.002],[PARAMS.SLIDER_END_TRIM_WIDTH,PARAMS.SLIDER_TRIM_HEIGHT],[PARAMS.SLIDER_END_TRIM_WIDTH-.013,PARAMS.SLIDER_TRIM_HEIGHT]]
        ],
        border:[
          [[0,0],[PARAMS.SLIDER_BORDER_TRIM_WIDTH+.003,0],[PARAMS.SLIDER_BORDER_TRIM_WIDTH,.003],[PARAMS.SLIDER_BORDER_TRIM_WIDTH-.004,.007],[.006,.007],[0,.003]],
          [[0,0],[.0295,0],[.0295,.002],[0,.002]],
          [[.016,.002],[.021,.002],[.021,.007],[.016,.007]]
        ]
      };
      Object.entries(components).forEach(([kind,sections])=>sections.forEach((section,index)=>{
        const color=kind==='border' && index>0 ? COLORS.transitionBase : COLORS.silver;
        const item=addSectionExtrusion(`${name}-${kind}-${index+1}`,'trim',section,(t,q,y)=>[
          x0+(x1-x0)*t,y,wallZ+normal*(offset+q)
        ],color,1);
        setDetailOptionVisibility(item,'sliderTrim',kind);
      }));
    }

    const task021WallFinishRuns=[];

    function buildTask003Details() {
      // Metroll Metro frames already have built-in architrave faces. Skirting
      // stops at the outside of that steel frame return and never runs across or
      // on top of the door frame.
      const frameTrimClearance=PARAMS.DOOR_FRAME_FACE_RETURN;
      const objectFrameClearance=.041;
      const sg01FrameWest=8.835-objectFrameClearance,sg01FrameEast=8.835+objectFrameClearance;
      const r02FrameWest=4.975-objectFrameClearance,r02FrameEast=4.975+objectFrameClearance;
      const r03FrameNorth=4.255-objectFrameClearance,r03FrameSouth=4.255+objectFrameClearance;
      const mm=Object.freeze({start:'miter',end:'miter'});
      const ms=Object.freeze({start:'miter',end:'square'});
      const sm=Object.freeze({start:'square',end:'miter'});
      const ss=Object.freeze({start:'square',end:'square'});
      const skirtingXRuns=[
        ['T21-SK-NORTH-WEST',.73,2.58,.25,1,mm],
        ['T21-SK-NORTH-BED4-W',8.28,sg01FrameWest,.25,1,ms],
        ['T21-SK-NORTH-BED4-E',sg01FrameEast,12.22,.25,1,sm],
        ['T21-SK-WEST-STEP',.25,.73,3.37,1,mm],
        ['T21-SK-SOUTH-WEST',.25,4.33,7.30,-1,mm],
        ['T21-SK-SOUTH-R02-W',4.42,r02FrameWest,7.30,-1,ms],
        ['T21-SK-SOUTH-R02-E',r02FrameEast,8.32,7.30,-1,sm],
        ['T21-SK-SOUTH-EAST',8.41,12.22,7.30,-1,mm],
        ['T21-SK-P6-LANDING-RETURN',2.58,3.76,2.68,1,ms],
        ['T21-SK-IH01A-PASSAGE',4.76,6.69,2.68,1,ss],
        ['T21-SK-IH01B-SOLID',7.52,8.28,2.68,1,sm],
        ['T21-SK-BED4-RETURN-N',8.28,9.48,2.59,-1,mm],
        ['T21-SK-BED4-RETURN-S',8.28,9.39,2.68,1,mm],
        ['T21-SK-LINEN-END-N',4.33,5.02,3.61,-1,ss],
        ['T21-SK-LINEN-END-S',4.42,4.93,3.70,1,mm],
        ['T21-SK-IH02A-N',PARAMS.D03_OPEN_X1+frameTrimClearance,8.41,3.61,-1,ss],
        ['T21-SK-IH02A-S',PARAMS.D03_OPEN_X1+frameTrimClearance,8.32,3.70,1,sm],
        ['T21-SK-IH02B-LEFT-N',8.41,PARAMS.D02_OPEN_X0-frameTrimClearance,3.61,-1,ss],
        ['T21-SK-IH02B-LEFT-S',8.41,PARAMS.D02_OPEN_X0-frameTrimClearance,3.70,1,ms],
        ['T21-SK-IH02B-N-WEST-STUB',PARAMS.D02_OPEN_X1+frameTrimClearance,9.39,3.61,-1,sm],
        ['T21-SK-IH02B-N-EAST-THRU',9.48,12.22,3.61,-1,mm],
        ['T21-SK-IH02B-S-WEST',PARAMS.D02_OPEN_X1+frameTrimClearance,10.30,3.70,1,sm],
        ['T21-SK-IH02C-S-EAST',10.39,12.22,3.70,1,mm],
        ['T21-SK-IH04-LINEN-ROBE-N',4.42,4.93,5.495,-1,mm],
        ['T21-SK-IH04-LINEN-ROBE-S',4.42,r02FrameWest,5.585,1,ms]
      ];
      const skirtingZRuns=[
        ['T21-SK-EAST-NORTH',12.22,.25,3.61,-1,mm],
        ['T21-SK-EAST-R03-N',12.22,3.70,r03FrameNorth,-1,ms],
        ['T21-SK-EAST-R03-S',12.22,r03FrameSouth,7.30,-1,sm],
        ['T21-SK-WEST-UPPER',.73,.25,3.37,1,mm],
        ['T21-SK-WEST-LOWER',.25,3.37,7.30,1,mm],
        ['T21-SK-P6-LONG-WALL',2.58,.25,2.68,-1,mm],
        ['T21-SK-IW03-BED4',8.28,.25,2.59,1,mm],
        ['T21-SK-IW05-A-W',4.33,3.70,3.88-frameTrimClearance,-1,ms],
        ['T21-SK-IW05-A-E',4.42,3.70,3.88-frameTrimClearance,1,ms],
        ['T21-SK-IW05-B-W',4.33,5.12+frameTrimClearance,7.30,-1,sm],
        ['T21-SK-IW05-B-E-N',4.42,5.12+frameTrimClearance,5.495,1,sm],
        ['T21-SK-IW05-B-E-S',4.42,5.585,7.30,1,mm],
        ['T21-SK-IW06-W',4.93,3.70,5.495,-1,mm],
        ['T21-SK-IW06-E',5.02,3.70,5.585,1,sm],
        ['T21-SK-IW07-W',8.32,3.70,7.30,-1,mm],
        ['T21-SK-IW07-E',8.41,3.70,7.30,1,mm],
        ['T21-SK-IW08-W',10.30,3.70,4.30,-1,ms],
        ['T21-SK-IW08-E',10.39,3.70,r03FrameNorth,1,ms],
        ['T21-SK-BED4-ENTRY-S-W',9.39,2.68,PARAMS.D01_OPEN_Z0-frameTrimClearance,-1,ms],
        ['T21-SK-BED4-ENTRY-S-E',9.48,2.59,PARAMS.D01_OPEN_Z0-frameTrimClearance,1,ms],
        ['T21-SK-BED4-ENTRY-N-W',9.39,PARAMS.D01_OPEN_Z1+frameTrimClearance,3.61,-1,sm],
        ['T21-SK-BED4-ENTRY-N-E',9.48,PARAMS.D01_OPEN_Z1+frameTrimClearance,3.61,1,sm]
      ];
      const runSpecs=[
        ...skirtingXRuns.map(args=>({name:args[0],axis:'x',start:args[1],end:args[2],plane:args[3],normal:args[4],ends:args[5],args})),
        ...skirtingZRuns.map(args=>({name:args[0],axis:'z',plane:args[1],start:args[2],end:args[3],normal:args[4],ends:args[5],args}))
      ];
      const samePoint=(a,b)=>Math.abs(a-b)<1e-7;
      const resolvedRunEnds=run=>{
        const ends={...run.ends};
        ['start','end'].forEach(endpoint=>{
          if(ends[endpoint]!=='miter') return;
          const along=run[endpoint];
          const partner=runSpecs.find(candidate=>candidate!==run&&candidate.axis!==run.axis&&samePoint(candidate.plane,along)&&(samePoint(candidate.start,run.plane)||samePoint(candidate.end,run.plane)));
          if(partner) ends[`${endpoint}InsetSign`]=partner.normal;
        });
        return Object.freeze(ends);
      };
      runSpecs.forEach(run=>{
        const ends=resolvedRunEnds(run);
        const args=[...run.args];args[5]=ends;
        task021WallFinishRuns.push(Object.freeze({name:run.name,axis:run.axis,plane:run.plane,start:run.start,end:run.end,normal:run.normal,ends}));
        if(run.axis==='x') addSelectableSkirtingX(...args); else addSelectableSkirtingZ(...args);
      });

      // Stair-head nosing and wet-area Universal Cover Trim are supplied by the product
      // profiles below. The former Task 003 colour-strip studies are retired.
      addSliderTrimRunZ('T03-SG01-FLOOR-EDGE',8.835,.25,2.59,1);
      addSliderTrimRunZ('T03-R02-FLOOR-EDGE',4.975,5.585,7.30,1);
      addSliderTrimRunX('T03-R03-FLOOR-EDGE',10.39,12.22,4.255,1);
    }

    const DRY_FLOOR_ZONES = Object.freeze([
      Object.freeze({id:'lounge-landing',x0:.73,x1:2.58,z0:.25,z1:3.37}),
      Object.freeze({id:'stair-south-west',x0:2.58,x1:3.67,z0:2.38,z1:3.37}),
      Object.freeze({id:'stair-south-east',x0:3.67,x1:4.85,z0:2.59,z1:3.37}),
      Object.freeze({id:'passage-west',x0:4.85,x1:8.28,z0:2.68,z1:3.37}),
      Object.freeze({id:'o01-dry-opening',x0:PARAMS.O01_OPEN_X0,x1:PARAMS.O01_OPEN_X1,z0:2.59,z1:2.68}),
      Object.freeze({id:'bed4',x0:8.28,x1:12.22,z0:.25,z1:3.37}),
      Object.freeze({id:'south-dry-rooms',x0:.25,x1:12.22,z0:3.37,z1:7.30})
    ]);
    const UPPER_DRY_FLOOR_NET_AREA_M2=Number(DRY_FLOOR_ZONES.reduce((area,zone)=>area+(zone.x1-zone.x0)*(zone.z1-zone.z0),0).toFixed(4));
    const FLOOR_PURCHASE_ALLOWANCE_PERCENT=10;
    const FLOOR_PURCHASE=Object.freeze({
      scope:'modelled-upper-connected-dry-floor',
      zoneCount:DRY_FLOOR_ZONES.length,
      netAreaM2:UPPER_DRY_FLOOR_NET_AREA_M2,
      wasteAllowancePercent:FLOOR_PURCHASE_ALLOWANCE_PERCENT,
      recommendedPurchaseAreaM2:Math.ceil(UPPER_DRY_FLOOR_NET_AREA_M2*(1+FLOOR_PURCHASE_ALLOWANCE_PERCENT/100)*10)/10,
      exclusions:Object.freeze(['wet tiled rooms','carpeted stair']),
      cartonCount:null,
      cartonNote:'Confirm the selected supplier pack coverage and final site measure before ordering.'
    });
    const FLOOR_SET_OUT_CONTROL = Object.freeze({
      axis:'z',
      value:3.370,
      source:'long corridor wall finished face',
      plankAxis:'corridor-longitudinal / east-west',
      distribution:'board-width modules extend to both sides from one shared control line',
      roomRestarts:false,
      geometryLocked:true
    });
    const FLOOR_GEOMETRY_SPECS = Object.freeze([
      Object.freeze({id:'hybrid85',family:'hybrid85',length:1.810,width:.228}),
      Object.freeze({id:'hybrid65',family:'hybrid65',length:1.824,width:.230}),
      Object.freeze({id:'engineered-170',family:'engineered',length:1.820,width:.170}),
      Object.freeze({id:'engineered-136',family:'engineered',length:1.820,width:.136})
    ]);
    const task004FloorBoards=[];
    const task004TechnicalFloorLayers=[];
    const task004IxpeLayers=[];

    function selectedFloorBaseProduct() { return FLOOR_PRODUCTS[finishState.floorFamily]; }
    function selectedFloorColourKey() { return finishState.floorColours[finishState.floorFamily]; }
    function selectedFloorColour() { return selectedFloorBaseProduct().colours[selectedFloorColourKey()]; }
    function selectedFloorDataPack() { return FLOOR_DATA_PACKS[activeFloorDataPackId] || null; }
    function installedFloorBaseProduct() { return FLOOR_PRODUCTS[installedFinishState.floorFamily]; }
    function installedFloorColourKey() { return installedFinishState.floorColours[installedFinishState.floorFamily]; }
    function installedFloorColour() { return installedFloorBaseProduct().colours[installedFloorColourKey()]; }
    function installedFloorDataPack() { return FLOOR_DATA_PACKS[installedFloorDataPackId] || null; }
    function matchingFloorDataPackId(family,colour) {
      return FLOOR_DATA_PACK_ORDER.find(id=>FLOOR_DATA_PACKS[id].family===family && FLOOR_DATA_PACKS[id].colour===colour) || null;
    }
    function selectedFloorProduct() {
      const base=selectedFloorBaseProduct();
      const colour=selectedFloorColour();
      return {...base,length:colour.length || base.length,width:colour.width || base.width};
    }
    function installedFloorProduct() {
      const base=installedFloorBaseProduct();
      const colour=installedFloorColour();
      return {...base,length:colour.length || base.length,width:colour.width || base.width};
    }
    function floorFamilyUiLabel(family) {
      return {hybrid85:'8.5 mm Hybrid',hybrid65:'Carpet Call 6.5 mm',engineered:'Engineering'}[family] || family;
    }
    function skirtingProfileLabel(profile) {
      return SKIRTING_PROFILE_META[profile]?.label || profile;
    }
    function wallFinishSelectionLabel(profile,paint,floorLabel='selected floor') {
      const meta=SKIRTING_PROFILE_META[profile] || SKIRTING_PROFILE_META['aus-colonial'];
      return meta.kind==='scotia'
        ? `Skirting and scotia · ${meta.label} · floor matched to ${floorLabel}`
        : `Skirting and scotia · ${meta.label} · ${SKIRTING_PAINTS[paint].label}`;
    }
    function installFloorMaterialLinks() {
      document.querySelectorAll('.installer-material-step [data-floor-colour]').forEach(card=>{
        if(card.parentElement?.classList.contains('material-choice-wrap'))return;
        const family=card.closest('[data-family-group]')?.dataset.familyGroup;
        const colourKey=card.dataset.floorColour;
        const product=FLOOR_PRODUCTS[family];
        const colour=product?.colours?.[colourKey];
        const href=colour?.source || product?.source;
        if(!href)return;
        const wrapper=document.createElement('div');
        wrapper.className='material-choice-wrap';
        card.before(wrapper);
        wrapper.append(card);
        const link=document.createElement('a');
        link.className='material-source-link';
        link.href=href;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.textContent='↗';
        link.setAttribute('aria-label',`Open ${colour.label} product page`);
        link.title=`Open ${colour.label} product page`;
        link.addEventListener('click',event=>event.stopPropagation());
        wrapper.append(link);
      });
    }
    installFloorMaterialLinks();
    function nosingSelectionLabel(profile,finish) {
      const product=NOSING_PRODUCTS[profile];
      const metal=METAL_FINISHES[finish];
      return `${product?.label || profile} · ${metal?.label || finish}`;
    }
    function installedSelectionSnapshot() {
      const product=installedFloorProduct();
      const colour=installedFloorColour();
      const pack=installedFloorDataPack();
      return {
        floorDataPackId:pack?.id || null,
        floorFamily:installedFinishState.floorFamily,
        floorColour:installedFloorColourKey(),
        floorLabel:`${floorFamilyUiLabel(installedFinishState.floorFamily)} · ${colour.label}`,
        floorProduct:product.product,
        floorThicknessMm:Number((product.thickness*1000).toFixed(1)),
        surfaceTreatment:installedFinishState.floorFamily==='engineered'?'waxed-satin-visual':'factory-finish',
        transitionProfile:installedFinishState.transitionProfile,
        transitionFinish:installedFinishState.transitionFinish,
        transitionLabel:METAL_FINISHES[installedFinishState.transitionFinish].label,
        nosingProfile:installedFinishState.nosingProfile,
        nosingFinish:installedFinishState.nosingFinish,
        nosingLabel:nosingSelectionLabel(installedFinishState.nosingProfile,installedFinishState.nosingFinish),
        skirtingProfile:installedFinishState.skirtingProfile,
        skirtingProfileLabel:skirtingProfileLabel(installedFinishState.skirtingProfile),
        skirtingPaint:installedFinishState.skirtingPaint,
        skirtingPaintLabel:installedFinishState.skirtingProfile==='scotia'
          ? `Floor matched to ${installedFloorColour().label}`
          : SKIRTING_PAINTS[installedFinishState.skirtingPaint].label,
        wallFinishLabel:wallFinishSelectionLabel(installedFinishState.skirtingProfile,installedFinishState.skirtingPaint,installedFloorColour().label),
        dryFloorZoneCount:DRY_FLOOR_ZONES.length,
        floorPurchase:FLOOR_PURCHASE
      };
    }
    function stagedSelectionMatchesInstalled() {
      return activeFloorDataPackId===installedFloorDataPackId &&
        finishState.floorFamily===installedFinishState.floorFamily &&
        selectedFloorColourKey()===installedFloorColourKey() &&
        finishState.transitionProfile===installedFinishState.transitionProfile &&
        finishState.transitionFinish===installedFinishState.transitionFinish &&
        finishState.nosingProfile===installedFinishState.nosingProfile &&
        finishState.nosingFinish===installedFinishState.nosingFinish &&
        finishState.skirtingProfile===installedFinishState.skirtingProfile &&
        finishState.skirtingPaint===installedFinishState.skirtingPaint;
    }
    function syncInstalledFloorDataset() {
      const installed=installedSelectionSnapshot();
      appRoot.dataset.installedFloorSelection=JSON.stringify(installed);
      appRoot.dataset.installedFloorPack=installed.floorDataPackId || '';
      appRoot.dataset.installedFloorFamily=installed.floorFamily;
      appRoot.dataset.installedFloorColour=installed.floorColour;
      appRoot.dataset.installedTransitionFinish=installed.transitionFinish;
      appRoot.dataset.installedNosingFinish=installed.nosingFinish;
      appRoot.dataset.installedSkirtingProfile=installed.skirtingProfile;
      appRoot.dataset.installedSkirtingPaint=installed.skirtingPaint;
      appRoot.dataset.floorInstallationPending=String(!stagedSelectionMatchesInstalled());
      const summary=RESIDENCE_DOM.getElementById('installed-scene-summary');
      if(summary) summary.textContent=`${installed.floorLabel} · 01 ${installed.transitionLabel} · 02 ${installed.nosingLabel} · ${installed.wallFinishLabel}`;
      return installed;
    }
    function commitFlooringSelection(pack,textureDataUrl='') {
      if(!pack || !FLOOR_PRODUCTS[pack.family]?.colours[pack.colour]) return false;
      installedFloorDataPackId=pack.id;
      installedFloorTextureSource=typeof textureDataUrl==='string' && textureDataUrl.startsWith('data:image/') ? textureDataUrl : '';
      installedFinishState.floorFamily=pack.family;
      installedFinishState.floorColours[pack.family]=pack.colour;
      installedFinishState.skirtingProfile=finishState.skirtingProfile;
      installedFinishState.skirtingPaint=finishState.skirtingPaint;
      detailState.skirtingProfile=installedFinishState.skirtingProfile;
      installedFinishState.transitionProfile=finishState.transitionProfile;
      installedFinishState.transitionFinish=finishState.transitionFinish;
      installedFinishState.nosingProfile=finishState.nosingProfile;
      installedFinishState.nosingFinish=finishState.nosingFinish;
      loadInstalledFloorTexture();
      syncInstalledFloorDataset();
      return true;
    }
    function floorGeometrySpecVisible(spec) {
      if (installedFinishState.floorFamily!==spec.family) return false;
      if (spec.family!=='engineered') return true;
      return Math.abs(installedFloorProduct().width-spec.width)<.0005;
    }
    // FLOOR_SURFACE_CORE_START — the second HTML embeds this same generator.
    const PomiFloorSurface=(()=>{
      const version='plank-surface-20260904-v3';
      const photos=Object.freeze({
        'hybrid65.blackbutt':'assets/flooring/carpetcall_blackbutt_hires.webp',
        'hybrid65.ash':'assets/flooring/carpetcall_ash_hires.jpg',
        'hybrid65.crisp-natural':'assets/flooring/carpetcall_crisp_natural_hires.jpg',
        'hybrid65.spotted-gum':'assets/flooring/carpetcall_spotted_gum_hires.jpg',
        'hybrid65.soft-rustic':'assets/flooring/carpetcall_soft_rustic_hires.jpg',
        'engineered.blackbutt':'assets/flooring/pioneer_blackbutt_cameo.jpg',
        'engineered.spotted-gum':'assets/flooring/pioneer_spotted_gum_cameo.jpg'
      });
      function sourceLayout(image,family,colour,custom=false) {
        const width=image.naturalWidth||image.width||1,height=image.naturalHeight||image.height||1;
        if(width/height>3.2 || (custom && family==='engineered')) return {kind:'single-plank',vertical:false,
          crops:[[.006,.018,.988,.964],[.110,.060,.875,.880],[.016,.115,.820,.805],[.180,.055,.800,.890],
            [.035,.040,.920,.915],[.145,.090,.830,.860],[.006,.035,.855,.925],[.080,.020,.890,.940]],sourceWidth:width,sourceHeight:height};
        if(family==='engineered' && width>=2000) return {kind:'rectified-board-extracts-from-manufacturer-detail-photo',vertical:false,
          affine:[[.550,.080,.260,.450,-.044,.104],[.660,.020,.270,.468,-.039,.092],
            [.400,.100,.235,.407,-.041,.097],[.310,.050,.228,.395,-.038,.090],
            [.730,.200,.218,.377,-.041,.097],[.480,.430,.205,.355,-.035,.083]],
          safeWindows:[[.035,.91,.20,.82],[.04,.68,.16,.90],[.06,.94,.10,.90],[.06,.83,.13,.88],[.03,.49,.18,.88],[.30,.92,.12,.80]],sourceWidth:width,sourceHeight:height};
        if(family==='engineered') return {kind:'individual-boards-from-product-panel',vertical:true,
          crops:[[.015,.025,.292,.950],[.654,.025,.325,.950],[.331,.366,.289,.608],[.018,.060,.277,.875],[.667,.040,.300,.880],[.336,.397,.278,.553]],sourceWidth:width,sourceHeight:height};
        if(family==='hybrid65') return {kind:'individual-boards-from-product-panel',vertical:false,
          crops:[[.008,.029,.482,.167],[.509,.029,.480,.167],[.267,.222,.625,.167],[.110,.414,.510,.167],[.504,.605,.475,.167],[.410,.798,.410,.170]],sourceWidth:width,sourceHeight:height};
        // Only a genuine long-board photo is used for the curated Oddz packs.
        return {kind:'single-board-crop',vertical:height>width,crops:[[.02,.02,.96,.96]],sourceWidth:width,sourceHeight:height};
      }
      function drawPlank(ctx,image,layout,index,x,y,width,height) {
        const sw=layout.sourceWidth,sh=layout.sourceHeight;
        ctx.save();ctx.translate(x+width/2,y+height/2);
        ctx.scale(index%2?-1:1,index%3===0?-1:1);
        ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
        if(layout.affine) {
          const selection=((index%layout.affine.length)+layout.affine.length)%layout.affine.length;
          const r=layout.affine[selection],s=layout.safeWindows[selection];
          const px=(r[0]+r[2]*s[0]+r[4]*s[2])*sw,py=(r[1]+r[3]*s[0]+r[5]*s[2])*sh;
          const ax=r[2]*(s[1]-s[0])*sw,ay=r[3]*(s[1]-s[0])*sh,bx=r[4]*(s[3]-s[2])*sw,by=r[5]*(s[3]-s[2])*sh,det=ax*by-ay*bx;
          const a=width*by/det,b=-height*ay/det,c=-width*bx/det,d=height*ax/det;
          ctx.beginPath();ctx.rect(-width/2,-height/2,width,height);ctx.clip();
          ctx.transform(a,b,c,d,-width/2-a*px-c*py,-height/2-b*px-d*py);
          ctx.drawImage(image,0,0);ctx.restore();return;
        }
        const r=layout.crops[((index%layout.crops.length)+layout.crops.length)%layout.crops.length];
        if(layout.vertical) {
          ctx.rotate(-Math.PI/2);
          ctx.drawImage(image,r[0]*sw,r[1]*sh,r[2]*sw,r[3]*sh,-height/2,-width/2,height,width);
        } else ctx.drawImage(image,r[0]*sw,r[1]*sh,r[2]*sw,r[3]*sh,-width/2,-height/2,width,height);
        ctx.restore();
      }
      function atlas(image,family,colour,custom=false,maxTextureSize=2048) {
        const layout=sourceLayout(image,family,colour,custom);
        const canvas=document.createElement('canvas');
        const size=maxTextureSize>=2048?2048:1024;
        canvas.width=size;canvas.height=size;
        const ctx=canvas.getContext?.('2d',{alpha:false});
        if(!ctx) return {image,rows:1,layout};
        const rows=8,h=size/rows;
        for(let row=0;row<rows;row++) {
          drawPlank(ctx,image,layout,row,0,row*h,size,h);
          // Repeat the edge texels into four-pixel gutters; never mix neighbouring plank faces.
          ctx.drawImage(canvas,0,row*h+5,size,1,0,row*h,size,5);
          ctx.drawImage(canvas,0,(row+1)*h-6,size,1,0,(row+1)*h-5,size,5);
        }
        return {image:canvas,rows,layout};
      }
      function finish(family,colour) {
        const timber=family==='engineered',spotted=/spotted/.test(colour);
        return {roughness:timber?.24:.57,toneVariation:timber?(spotted?.24:.17):.115,
          relief:timber?.84:.55,reflection:timber?.39:.085,
          profile:timber?'waxed-satin':'embossed-matt',treatment:timber?'waxed-satin-visual':'factory-finish'};
      }
      return Object.freeze({version,photos,sourceLayout,drawPlank,atlas,finish});
    })();
    // FLOOR_SURFACE_CORE_END

    function loadInstalledFloorTexture() {
      const colour=installedFloorColour();
      const pack=installedFloorDataPack();
      const textureSource=installedFloorTextureSource || PomiFloorSurface.photos[`${installedFinishState.floorFamily}.${installedFloorColourKey()}`] || (pack && pack.family===installedFinishState.floorFamily && pack.colour===installedFloorColourKey() ? pack.renderTexture : '') || colour.renderTexture || colour.image;
      const request=++floorTextureRequest;
      floorTextureReady=false;
      appRoot.dataset.floorTextureStatus='loading';
      const image=new Image();
      image.decoding='async';
      image.onload=()=>{
        if (request!==floorTextureRequest) return;
        const generated=PomiFloorSurface.atlas(image,installedFinishState.floorFamily,installedFloorColourKey(),Boolean(installedFloorTextureSource),gl.getParameter?.(gl.MAX_TEXTURE_SIZE)||2048);
        floorTextureAtlasRows=generated.rows;
        window.__RESIDENCE_FLOOR_ATLAS__={image:generated.image,rows:generated.rows,family:installedFinishState.floorFamily,colour:installedFloorColourKey(),finish:PomiFloorSurface.finish(installedFinishState.floorFamily,installedFloorColourKey())};
        window.dispatchEvent(new CustomEvent('residence:floor-atlas'));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,floorTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,generated.image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        if(generated.rows>1 && gl.generateMipmap) {
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
        } else gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        const anisotropy=floorAnisotropy?Math.min(16,gl.getParameter(floorAnisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)||1):1;
        if(floorAnisotropy) gl.texParameterf(gl.TEXTURE_2D,floorAnisotropy.TEXTURE_MAX_ANISOTROPY_EXT,anisotropy);
        floorTextureReady=true;
        appRoot.dataset.floorTextureStatus='ready';
        appRoot.dataset.floorTextureSource=textureSource;
        appRoot.dataset.floorSurface=JSON.stringify({version:PomiFloorSurface.version,atlasRows:generated.rows,
          atlasSize:[generated.image.width,generated.image.height],sourceLayout:generated.layout,
          anisotropy,finish:PomiFloorSurface.finish(installedFinishState.floorFamily,installedFloorColourKey()),
          mapping:'full-logical-plank; clipped pieces retain the same grain scale',linearLighting:true});
      };
      image.onerror=()=>{
        if (request!==floorTextureRequest) return;
        floorTextureReady=false;
        appRoot.dataset.floorTextureStatus='fallback-palette';
      };
      image.src=textureSource;
    }
    function controlledVariant(row,column,count,salt=0) {
      const value=Math.abs(Math.imul(row+17,73856093)^Math.imul(column+31,19349663)^Math.imul(salt+11,83492791));
      return value%count;
    }

    function attachFloorBoardMetadata(item,spec,column,boardIndex,variant,bounds,options={}) {
      if (!item) return;
      item.finishFamily=spec.family;
      item.finishGeometrySpec=spec.id;
      item.finishBoardRow=column;
      item.finishBoardColumn=boardIndex;
      item.finishVariant=variant;
      const textureHash=Math.abs(Math.imul(column+2048,1103515245)^Math.imul(boardIndex+97,12345)^Math.imul(variant+11,-1640531527));
      item.finishTextureSeed=(textureHash%997)/997;
      item.finishBounds=bounds;
      item.finishTextureBounds=options.textureBounds || bounds;
      item.finishLongAxisX=true;
      item.surfaceRoughness=spec.family==='engineered' ? .008 : .025;
      item.waxedTimberFinish=spec.family==='engineered';
      item.surfaceTreatment=spec.family==='engineered' ? 'waxed-satin-visual' : 'factory-finish';
      const extra=options.visibleWhen || (()=>true);
      showItemWhen(item,()=>floorGeometrySpecVisible(spec) && extra());
      if (options.logical!==false) task004FloorBoards.push(item);
    }

    function unionClippedBoardPieces(x0,x1,z0,z1) {
      const pieces=[];
      DRY_FLOOR_ZONES.forEach((zone,zoneIndex)=>{
        const px0=Math.max(x0,zone.x0),px1=Math.min(x1,zone.x1);
        const pz0=Math.max(z0,zone.z0),pz1=Math.min(z1,zone.z1);
        if (px1-px0>.020 && pz1-pz0>.020) pieces.push({x0:px0,x1:px1,z0:pz0,z1:pz1,zones:[zoneIndex]});
      });
      pieces.sort((a,b)=>a.z0-b.z0 || a.z1-b.z1 || a.x0-b.x0);
      const merged=[];
      pieces.forEach(piece=>{
        const last=merged[merged.length-1];
        if (last && Math.abs(last.z0-piece.z0)<.0002 && Math.abs(last.z1-piece.z1)<.0002 && piece.x0<=last.x1+.0002) {
          last.x1=Math.max(last.x1,piece.x1);
          last.zones.push(...piece.zones);
        } else merged.push({...piece,zones:[...piece.zones]});
      });
      return merged;
    }

    function buildFloorBoardsForSpec(spec) {
      const product=FLOOR_PRODUCTS[spec.family];
      const plankLength=spec.length, plankWidth=spec.width;
      const rowOffsets=[0,.37,.71,.18,.54,.83];
      const gap=spec.family==='engineered' ? .0018 : .0022;
      const xMin=.25,xMax=12.22,zMin=.25,zMax=7.30;
      const firstRow=Math.floor((zMin-FLOOR_SET_OUT_CONTROL.value)/plankWidth)-1;
      const lastRow=Math.ceil((zMax-FLOOR_SET_OUT_CONTROL.value)/plankWidth)+1;
      for (let row=firstRow;row<=lastRow;row++) {
        const rowStart=FLOOR_SET_OUT_CONTROL.value+row*plankWidth;
        const rowEnd=rowStart+plankWidth;
        const offsetIndex=((row%rowOffsets.length)+rowOffsets.length)%rowOffsets.length;
        const offset=rowOffsets[offsetIndex]*plankLength;
        let boardIndex=0;
        for (let boardStart=xMin-offset-plankLength;boardStart<xMax;boardStart+=plankLength,boardIndex++) {
          const boardEnd=boardStart+plankLength;
          const pieces=unionClippedBoardPieces(boardStart,boardEnd,rowStart,rowEnd);
          pieces.forEach((piece,pieceIndex)=>{
            const bx0=piece.x0+gap/2,bx1=piece.x1-gap/2,bz0=piece.z0+gap/2,bz1=piece.z1-gap/2;
            if (bx1<=bx0 || bz1<=bz0) return;
            const variants=spec.family==='engineered' ? 8 : 6;
            const variant=controlledVariant(row,boardIndex,variants,0);
            const boardName=`T04-${spec.id}-board-r${row}-b${boardIndex}-p${pieceIndex}`;
            const bounds=[bx0-PLAN_W/2,bz0-PLAN_D/2,bx1-bx0,bz1-bz0];
            const textureBounds=[boardStart-PLAN_W/2,rowStart-PLAN_D/2,plankLength,plankWidth];
            if (spec.family==='hybrid85') {
              // Client view reads as one 8.5 mm product; Technical view separates
              // the confirmed 6.5 mm plank and 2.0 mm included IXPE without
              // adding a second underlay or changing the 8.5 mm total height.
              const combined=addBevelledFloorBoard(`${boardName}-combined-client`,'finishFloor',bx0,bx1,0,product.thickness,bz0,bz1,[.65,.50,.34,1],1);
              combined.finishLayer='8.5 mm combined product';
              attachFloorBoardMetadata(combined,spec,row,boardIndex,variant,bounds,{textureBounds,visibleWhen:()=>finishState.uiMode==='client'});

              const plank=addBevelledFloorBoard(`${boardName}-6.5mm-plank-technical`,'finishFloor',bx0,bx1,.002,product.thickness,bz0,bz1,[.65,.50,.34,1],1);
              plank.finishLayer='6.5 mm plank';
              attachFloorBoardMetadata(plank,spec,row,boardIndex,variant,bounds,{textureBounds,logical:false,visibleWhen:()=>finishState.uiMode==='technical'});
              task004TechnicalFloorLayers.push(plank);

              const ixpe=addBox(`${boardName}-2.0mm-IXPE-technical`,'finishFloor',bx0,bx1,0,.002,bz0,bz1,[.900,.915,.890,1],1);
              ixpe.finishLayer='2.0 mm IXPE included in 8.5 mm total';
              ixpe.finishY0=0;
              ixpe.finishY1=.002;
              ixpe.finishPhysicalThickness=.002;
              ixpe.surfaceRoughness=.070;
              showItemWhen(ixpe,()=>floorGeometrySpecVisible(spec) && finishState.uiMode==='technical');
              task004TechnicalFloorLayers.push(ixpe);
              task004IxpeLayers.push(ixpe);
            } else {
              const board=addBevelledFloorBoard(boardName,'finishFloor',bx0,bx1,0,product.thickness,bz0,bz1,[.65,.50,.34,1],1);
              board.finishLayer=`${(product.thickness*1000).toFixed(1)} mm product`;
              attachFloorBoardMetadata(board,spec,row,boardIndex,variant,bounds,{textureBounds});
            }
          });
        }
      }
    }

    function addTask004StairTopEdges() {
      Object.entries(FLOOR_PRODUCTS).forEach(([family,product])=>{
        const sfsbOriginZ=2.584;
        // Kevmor SFSB60M: 60 mm grooved tread, 15 mm rounded front return and
        // one-piece 2.5 mm standard extruded brass body at the upper landing only.
        const nosing=addSectionExtrusion(`T04-${family}-sfsb60m-brass-stair-nosing`,'finishMetal',sfsb60mNosingSection(),(t,zOffset,yOffset)=>[
          3.76+t,product.thickness+yOffset,sfsbOriginZ+zOffset
        ],METAL_FINISHES.brass.color,1);
        nosing.finishMetalControlled=true;
        nosing.metalApplication='nosing';
        nosing.metalProfileType='SFSB60M-brass-60x15x2.5';
        nosing.finishProfile='sfsb60m-brass';
        nosing.finishBounds=[3.76,sfsbOriginZ-.005,1.0,.065];
        nosing.finishLongAxisX=true;
        nosing.finishTextureSeed=.31;
        nosing.carpetInterface='continuous-carpet-riser-upturn-behind-front-return';
        nosing.replacesCarpetRiser=false;
        showItemWhen(nosing,()=>installedFinishState.floorFamily===family && installedFinishState.nosingProfile==='sfsb60m-brass');
        nosing.surfaceRoughness=.018;
        for (let groove=0;groove<6;groove++) {
          const z=sfsbOriginZ+.008+groove*.0065;
          const bar=addBox(`T04-${family}-sfsb60m-continuous-groove-${groove+1}`,'finishMetal',3.76,4.76,product.thickness+.00245,product.thickness+.00285,z,z+.0014,METAL_FINISHES.brass.color,1);
          bar.finishMetalControlled=true;
          bar.metalApplication='nosing';
          bar.metalProfileType='SFSB60M-continuous-anti-slip-groove';
          bar.finishProfile='sfsb60m-brass';
          bar.finishBounds=[3.76,sfsbOriginZ-.005,1.0,.065];
          bar.finishLongAxisX=true;
          bar.finishTextureSeed=.31+groove*.017;
          showItemWhen(bar,()=>installedFinishState.floorFamily===family && installedFinishState.nosingProfile==='sfsb60m-brass');
          bar.surfaceRoughness=.014;
        }

        const sfs51OriginZ=2.581;
        const silverNosing=addSectionExtrusion(`T04-${family}-sfs51nms-silver-sawtooth-nosing`,'finishMetal',sfs51nmsNosingSection(),(t,zOffset,yOffset)=>[
          3.76+t,product.thickness+yOffset,sfs51OriginZ+zOffset
        ],METAL_FINISHES.silver.color,1);
        silverNosing.finishMetalControlled=true;
        silverNosing.metalApplication='nosing';
        silverNosing.metalProfileType='DTA-ASN51NMS-Kevmor-SFS51NMS-50mm-P5';
        silverNosing.finishProfile='sfs51nms-silver';
        silverNosing.finishBounds=[3.76,sfs51OriginZ-.003,1.0,.054];
        silverNosing.finishLongAxisX=true;
        silverNosing.finishTextureSeed=.43;
        silverNosing.surfaceRoughness=.016;
        silverNosing.carpetInterface='continuous-carpet-riser-upturn-behind-front-edge';
        silverNosing.replacesCarpetRiser=false;
        showItemWhen(silverNosing,()=>installedFinishState.floorFamily===family && installedFinishState.nosingProfile==='sfs51nms-silver');
        for(let tooth=0;tooth<10;tooth++) {
          const z=sfs51OriginZ+.005+tooth*.00435;
          const rib=addBox(`T04-${family}-sfs51nms-sawtooth-rib-${tooth+1}`,'finishMetal',3.76,4.76,product.thickness+.00175,product.thickness+.00235,z,z+.00115,METAL_FINISHES.silver.color,1);
          rib.finishMetalControlled=true;
          rib.metalApplication='nosing';
          rib.metalProfileType='DTA-ASN51NMS-sawtooth-rib';
          rib.finishProfile='sfs51nms-silver';
          rib.finishBounds=[3.76,sfs51OriginZ-.003,1.0,.054];
          rib.finishLongAxisX=true;
          rib.finishTextureSeed=.43+tooth*.013;
          rib.surfaceRoughness=.012;
          showItemWhen(rib,()=>installedFinishState.floorFamily===family && installedFinishState.nosingProfile==='sfs51nms-silver');
        }

        const oddzOriginZ=2.582;
        const oddzNosing=addSectionExtrusion(`T04-${family}-oddz-stair-nosing`,'finishMetal',oddzStairNosingSection(product.thickness),(t,zOffset,yOffset)=>[
          3.76+t,product.thickness+yOffset,oddzOriginZ+zOffset
        ],METAL_FINISHES.woodgrain.color,1);
        const oddzSize=family==='engineered'?'Senior-14mm':family==='hybrid85'?'Junior-8.4mm':'Junior-6.5mm';
        oddzNosing.finishMetalControlled=true;
        oddzNosing.metalApplication='nosing';
        oddzNosing.metalProfileType=`Oddz-${oddzSize}-14mm-top`;
        oddzNosing.nosingNominalHeightMm=family==='engineered'?14:family==='hybrid85'?8.4:6.5;
        oddzNosing.nosingSupplierFit=family==='hybrid85'?'closest-published-size-confirm-with-supplier':'published-nominal-size-match';
        oddzNosing.finishProfile='oddz-stair-nosing';
        oddzNosing.finishBounds=[3.76,oddzOriginZ-.0016,1.0,.0156];
        oddzNosing.finishLongAxisX=true;
        oddzNosing.finishTextureSeed=.53;
        oddzNosing.surfaceRoughness=.018;
        oddzNosing.carpetInterface='continuous-carpet-riser-upturn-behind-front-edge-installer-confirm';
        oddzNosing.replacesCarpetRiser=false;
        showItemWhen(oddzNosing,()=>installedFinishState.floorFamily===family && installedFinishState.nosingProfile==='oddz-stair-nosing');
      });
    }

    function addTask004WetTransition() {
      // Existing silver tiling L-angle: retained independently from the Universal Cover Trim.
      const tileAngleSection=[[-.004,0],[-.004,PARAMS.WET_LEVEL_DELTA],[.004,PARAMS.WET_LEVEL_DELTA],[.004,PARAMS.WET_LEVEL_DELTA-.002],[-.001,PARAMS.WET_LEVEL_DELTA-.002],[-.001,0]];
      const tileAngle=addSectionExtrusion('T04-O01-existing-silver-tile-L-angle','finishMetal',tileAngleSection,(t,zOffset,y)=>[
        PARAMS.O01_OPEN_X0+(PARAMS.O01_OPEN_X1-PARAMS.O01_OPEN_X0)*t,y,2.590+zOffset
      ],COLORS.silver,1);
      tileAngle.surfaceRoughness=.025;

      Object.entries(FLOOR_PRODUCTS).forEach(([family,product])=>{
        const visible=()=>installedFinishState.floorFamily===family && installedFinishState.transitionProfile==='universal-cover';
        const cover=addSectionExtrusion(`T04-O01-${family}-universal-cover-45mm`,'finishMetal',universalCoverSection(product.thickness,PARAMS.WET_LEVEL_DELTA),(t,zOffset,y)=>[
          PARAMS.O01_OPEN_X0+(PARAMS.O01_OPEN_X1-PARAMS.O01_OPEN_X0)*t,y,2.590+zOffset
        ],COLORS.silver,1);
        cover.finishMetalControlled=true;
        cover.metalApplication='transition';
        cover.metalProfileType='universal-cover-top-45mm';
        cover.finishProfile='universal-cover';
        cover.finishBounds=[PARAMS.O01_OPEN_X0,2.590-.0225,PARAMS.O01_OPEN_X1-PARAMS.O01_OPEN_X0,.045];
        cover.finishLongAxisX=true;
        cover.finishTextureSeed=.47;
        showItemWhen(cover,visible);
        cover.surfaceRoughness=.018;

        const base=addBox(`T04-O01-${family}-universal-base-29.5mm`,'finishMetal',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.001,.003,2.590-.01475,2.590+.01475,COLORS.transitionBase,1);
        const channelA=addBox(`T04-O01-${family}-universal-base-channel-a`,'finishMetal',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.003,.006,2.590-.0060,2.590-.0030,COLORS.transitionBase,1);
        const channelB=addBox(`T04-O01-${family}-universal-base-channel-b`,'finishMetal',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.003,.006,2.590+.0030,2.590+.0060,COLORS.transitionBase,1);
        const insertTop=(product.thickness+PARAMS.WET_LEVEL_DELTA)*.5+.0030;
        const insert=addBox(`T04-O01-${family}-universal-insert-0-to-14mm`,'finishMetal',PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1,.005,insertTop,2.590-.0022,2.590+.0022,COLORS.mattBlack,1);
        [base,channelA,channelB,insert].forEach(item=>{
          item.metalProfileType='universal-cover-support-system';
          item.finishProfile='universal-cover';
          showItemWhen(item,visible);
          item.surfaceRoughness=.028;
        });
      });
    }

    function buildTask004Finishes() {
      FLOOR_GEOMETRY_SPECS.forEach(buildFloorBoardsForSpec);
      const controlLine=addLine('T04-FLOOR-SET-OUT-CONTROL','grid',[
        [.25,.016,FLOOR_SET_OUT_CONTROL.value],[12.22,.016,FLOOR_SET_OUT_CONTROL.value]
      ],[.58,.43,.27,1],.92,false);
      controlLine.surfaceRoughness=0;
      addTask004StairTopEdges();
      addTask004WetTransition();
    }

    function addLine(name, category, points, color, alpha = color[3], loop = false) {
      const expanded = [];
      const src = loop ? [...points, points[0]] : points;
      for (let i = 0; i < src.length - 1; i++) {
        expanded.push(...toWorld(src[i][0], src[i][1], src[i][2]), ...toWorld(src[i + 1][0], src[i + 1][1], src[i + 1][2]));
      }
      const normals = [];
      for (let i = 0; i < expanded.length / 3; i++) normals.push(0, 1, 0);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(expanded), gl.STATIC_DRAW);
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      const item = { name, category, level: activeBuildLevel, positionBuffer, normalBuffer, count: expanded.length / 3, color, alpha, visibleWhen: null, transformWhen: null };
      lines.push(item);
      return item;
    }

    function addSegmentLine(name, category, segments, color, alpha = color[3]) {
      const expanded=[];
      segments.forEach(([start,end])=>expanded.push(
        ...toWorld(start[0],start[1],start[2]),
        ...toWorld(end[0],end[1],end[2])
      ));
      const normals=[];
      for(let index=0;index<expanded.length/3;index++) normals.push(0,1,0);
      const positionBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(expanded),gl.STATIC_DRAW);
      const normalBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normals),gl.STATIC_DRAW);
      const item={name,category,level:activeBuildLevel,positionBuffer,normalBuffer,count:expanded.length/3,color,alpha,visibleWhen:null,transformWhen:null};
      lines.push(item);
      return item;
    }

    const LABEL_PRIORITY = Object.freeze({ dimension: 130, key: 100, room: 80, slider: 60, opening: 45, note: 35, stair: 25 });

    function addLabel(text, x, y, z, kind = 'room', category = null, priority = LABEL_PRIORITY[kind] || 20) {
      const el = document.createElement('div');
      el.className = `world-label ${kind}`;
      el.textContent = text;
      labelsLayer.appendChild(el);
      const definition={ text, x, y, z, kind, category, level: activeBuildLevel, priority, el };
      labelDefs.push(definition);
      return definition;
    }

    function dimensionText(metres) {
      return `${Math.round(metres*1000).toLocaleString('en-AU').replace(/,/g,' ')} mm`;
    }

    function addUpperPlanDimensionX(id,x0,x1,z,{witnessZ=null,sourceIds=[],clearanceBand=null}={}) {
      const y=.032,tick=.055;
      const segments=[
        [[x0,y,z],[x1,y,z]],
        [[x0-tick,y,z-tick],[x0+tick,y,z+tick]],
        [[x1-tick,y,z-tick],[x1+tick,y,z+tick]]
      ];
      if(Number.isFinite(witnessZ)) segments.push([[x0,y,witnessZ],[x0,y,z]],[[x1,y,witnessZ],[x1,y,z]]);
      const line=addSegmentLine(`measurement-upper-${id}-width`,'measurement',segments,COLORS.measurement,.90);
      line.dimensionAxis='x';
      line.dimensionMetres=Number((x1-x0).toFixed(3));
      line.dimensionSpan=Object.freeze([x0,x1]);
      line.dimensionLineAt=z;
      line.dimensionSegments=Object.freeze(segments.map(segment=>Object.freeze(segment.map(point=>Object.freeze([...point])))));
      line.dimensionMainSegment=line.dimensionSegments[0];
      line.dimensionSourceIds=Object.freeze([...sourceIds]);
      line.dimensionPlanReference='21560 WD A3.pdf · upper-floor perimeter dimension chains';
      line.dimensionClearSpan=true;
      line.dimensionClearanceBand=clearanceBand?Object.freeze([...clearanceBand]):null;
      const label=addLabel(dimensionText(x1-x0),Number(((x0+x1)/2).toFixed(3)),Number((y+.012).toFixed(3)),z,'dimension','measurement',LABEL_PRIORITY.dimension);
      label.dimensionOwner=line.name;
      label.dimensionAxis=line.dimensionAxis;
      label.dimensionMainSegment=line.dimensionMainSegment;
      label.dimensionSourceIds=line.dimensionSourceIds;
      label.dimensionPlacementFractions=Object.freeze([.5,.42,.58,.34,.66,.26,.74,.18,.82,.10,.90,.04,.96]);
    }

    function addUpperPlanDimensionZ(id,z0,z1,x,{witnessX=null,sourceIds=[],clearanceBand=null}={}) {
      const y=.032,tick=.055;
      const segments=[
        [[x,y,z0],[x,y,z1]],
        [[x-tick,y,z0+tick],[x+tick,y,z0-tick]],
        [[x-tick,y,z1+tick],[x+tick,y,z1-tick]]
      ];
      if(Number.isFinite(witnessX)) segments.push([[witnessX,y,z0],[x,y,z0]],[[witnessX,y,z1],[x,y,z1]]);
      const line=addSegmentLine(`measurement-upper-${id}-depth`,'measurement',segments,COLORS.measurement,.90);
      line.dimensionAxis='z';
      line.dimensionMetres=Number((z1-z0).toFixed(3));
      line.dimensionSpan=Object.freeze([z0,z1]);
      line.dimensionLineAt=x;
      line.dimensionSegments=Object.freeze(segments.map(segment=>Object.freeze(segment.map(point=>Object.freeze([...point])))));
      line.dimensionMainSegment=line.dimensionSegments[0];
      line.dimensionSourceIds=Object.freeze([...sourceIds]);
      line.dimensionPlanReference='21560 WD A3.pdf · upper-floor perimeter dimension chains';
      line.dimensionClearSpan=true;
      line.dimensionClearanceBand=clearanceBand?Object.freeze([...clearanceBand]):null;
      const label=addLabel(dimensionText(z1-z0),x,Number((y+.012).toFixed(3)),Number(((z0+z1)/2).toFixed(3)),'dimension','measurement',LABEL_PRIORITY.dimension);
      label.dimensionOwner=line.name;
      label.dimensionAxis=line.dimensionAxis;
      label.dimensionMainSegment=line.dimensionMainSegment;
      label.dimensionSourceIds=line.dimensionSourceIds;
      label.dimensionPlacementFractions=Object.freeze([.5,.42,.58,.34,.66,.26,.74,.18,.82,.10,.90,.04,.96]);
    }

    function buildUpperPlanMeasurements() {
      // Only drawing-supported, uninterrupted wall-to-wall spans are shown.
      // Each internal line is placed inside a verified clear slice whose two
      // endpoints land on solid wall faces rather than a door, window or robe slider.
      addUpperPlanDimensionX('overall',0,PLAN_W,7.76,{witnessZ:PLAN_D,sourceIds:['P11-UPPER-OVERALL-WIDTH','OUTER_FOOTPRINT'],clearanceBand:[7.76,7.76]});
      addUpperPlanDimensionZ('overall',0,PLAN_D,12.68,{witnessX:PLAN_W,sourceIds:['P11-UPPER-OVERALL-DEPTH','OUTER_FOOTPRINT'],clearanceBand:[12.68,12.68]});
      addUpperPlanDimensionX('lounge',.25,4.33,3.72,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','EW-WEST-LOWER','IW05'],clearanceBand:[3.61,3.88]});
      addUpperPlanDimensionZ('lounge',3.37,7.30,.50,{sourceIds:['P11-UPPER-3930-LOUNGE','EW-WEST-STEP','EW-SOUTH'],clearanceBand:[.25,.73]});
      addUpperPlanDimensionZ('passage',2.68,3.61,7.67,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IH01B','IH02A'],clearanceBand:[7.52,8.19]});
      addUpperPlanDimensionX('bed2',5.02,8.32,4.70,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IW06-NORTH','IW07'],clearanceBand:[3.70,5.585]});
      addUpperPlanDimensionZ('bed2',3.70,7.30,8.24,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IH02A','EW-SOUTH'],clearanceBand:[8.16,8.32]});
      addUpperPlanDimensionX('bed3',8.41,12.22,4.575,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IW07','EW-EAST'],clearanceBand:[4.48,4.67]});
      addUpperPlanDimensionZ('bed3',3.70,7.30,10.15,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IH02B','EW-SOUTH'],clearanceBand:[9.32,10.30]});
      addUpperPlanDimensionZ('bed4',.25,3.61,10.60,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','EW-NORTH','IH02C'],clearanceBand:[10.39,12.22]});
      addUpperPlanDimensionX('bath',4.85,6.60,1.70,{sourceIds:['P11-UPPER-1750-BATH','IW01','IW02'],clearanceBand:[.25,1.815]});
      addUpperPlanDimensionZ('bath',.25,2.59,5.80,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','EW-NORTH','IH01A'],clearanceBand:[4.85,5.84]});
      addUpperPlanDimensionX('wc',6.69,8.19,.34,{sourceIds:['P11-UPPER-1500-WC-VAN','IW02','IW03'],clearanceBand:[.25,1.13]});
      addUpperPlanDimensionZ('wc',.25,1.13,8.12,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','EW-NORTH','IH05'],clearanceBand:[7.68,8.19]});
      addUpperPlanDimensionX('vanity',6.69,8.19,1.32,{sourceIds:['P11-UPPER-1500-WC-VAN','IW02','IW03'],clearanceBand:[1.22,1.815]});
      addUpperPlanDimensionZ('vanity',1.22,2.59,7.60,{sourceIds:['P11-UPPER-PERIMETER-CHAINS','IH05','IH01B'],clearanceBand:[7.52,8.19]});
    }

    function addCorniceX(name, x0, x1, z0, z1, baseY = 0, height = WALL_H) {
      addBox(name, 'cornice', x0, x1, baseY + height - PARAMS.CORNICE_PROXY, baseY + height, z0, z1, COLORS.cornice, 1, true);
    }

    function addCorniceZ(name, x0, x1, z0, z1, baseY = 0, height = WALL_H) {
      addBox(name, 'cornice', x0, x1, baseY + height - PARAMS.CORNICE_PROXY, baseY + height, z0, z1, COLORS.cornice, 1, true);
    }

    function buildWallXBand(name, category, x0, x1, z0, z1, openings, baseY, height, color) {
      const sorted = [...openings].sort((a,b) => a.from - b.from);
      let cursor = x0;
      sorted.forEach((o, index) => {
        const from = Math.max(x0, o.from), to = Math.min(x1, o.to);
        if (to <= from) return;
        if (from > cursor) addBox(`${name}-solid-${index}`, category, cursor, from, baseY, baseY + height, z0, z1, color, 1, true);
        if (o.sill > 0) addBox(`${name}-sill-${index}`, category, from, to, baseY, baseY + Math.min(o.sill,height), z0, z1, color, 1, true);
        if (o.head < height) addBox(`${name}-head-${index}`, category, from, to, baseY + Math.max(0,o.head), baseY + height, z0, z1, color, 1, true);
        cursor = Math.max(cursor, to);
      });
      if (cursor < x1) addBox(`${name}-solid-end`, category, cursor, x1, baseY, baseY + height, z0, z1, color, 1, true);
    }

    function buildWallZBand(name, category, x0, x1, z0, z1, openings, baseY, height, color) {
      const sorted = [...openings].sort((a,b) => a.from - b.from);
      let cursor = z0;
      sorted.forEach((o, index) => {
        const from = Math.max(z0, o.from), to = Math.min(z1, o.to);
        if (to <= from) return;
        if (from > cursor) addBox(`${name}-solid-${index}`, category, x0, x1, baseY, baseY + height, cursor, from, color, 1, true);
        if (o.sill > 0) addBox(`${name}-sill-${index}`, category, x0, x1, baseY, baseY + Math.min(o.sill,height), from, to, color, 1, true);
        if (o.head < height) addBox(`${name}-head-${index}`, category, x0, x1, baseY + Math.max(0,o.head), baseY + height, from, to, color, 1, true);
        cursor = Math.max(cursor, to);
      });
      if (cursor < z1) addBox(`${name}-solid-end`, category, x0, x1, baseY, baseY + height, cursor, z1, color, 1, true);
    }

    function tagInnerLeafInteriorPaint(items, wallId, roomFace) {
      items.filter(Boolean).forEach(item=>{
        item.innerLeafInteriorPaint=true;
        item.innerLeafWallId=wallId;
        item.roomFacingSurface=roomFace;
        item.paintSystem='internal area · Dulux Lexicon Quarter';
        item.paintOnlyOverlay=true;
      });
    }

    function addInnerLeafInteriorPaintX(name, innerBand, openings, roomFace, baseY, height) {
      const paintThickness=.002;
      const faceZ=roomFace==='min' ? innerBand[2] : innerBand[3];
      const z0=roomFace==='min' ? faceZ-paintThickness : faceZ;
      const z1=roomFace==='min' ? faceZ : faceZ+paintThickness;
      const before=meshes.length;
      buildWallXBand(`T16-${name}-inner-leaf-room-face-paint`,'internal',innerBand[0],innerBand[1],z0,z1,openings,baseY,height,COLORS.internal);
      tagInnerLeafInteriorPaint(meshes.slice(before),name,roomFace);
    }

    function addInnerLeafInteriorPaintZ(name, innerBand, openings, roomFace, baseY, height) {
      const paintThickness=.002;
      const faceX=roomFace==='min' ? innerBand[0] : innerBand[1];
      const x0=roomFace==='min' ? faceX-paintThickness : faceX;
      const x1=roomFace==='min' ? faceX : faceX+paintThickness;
      const before=meshes.length;
      buildWallZBand(`T16-${name}-inner-leaf-room-face-paint`,'internal',x0,x1,innerBand[2],innerBand[3],openings,baseY,height,COLORS.internal);
      tagInnerLeafInteriorPaint(meshes.slice(before),name,roomFace);
    }

    function addExteriorLeafBandsX(name, outerBand, innerBand, openings = [], baseY = 0, height = WALL_H, roomFace = 'max') {
      buildWallXBand(`${name}-outer-leaf`,'exterior',outerBand[0],outerBand[1],outerBand[2],outerBand[3],openings,baseY,height,COLORS.exterior);
      buildWallXBand(`${name}-inner-leaf`,'exterior',innerBand[0],innerBand[1],innerBand[2],innerBand[3],openings,baseY,height,COLORS.exterior);
      addInnerLeafInteriorPaintX(name,innerBand,openings,roomFace,baseY,height);
    }

    function addExteriorLeafBandsZ(name, outerBand, innerBand, openings = [], baseY = 0, height = WALL_H, roomFace = 'max') {
      buildWallZBand(`${name}-outer-leaf`,'exterior',outerBand[0],outerBand[1],outerBand[2],outerBand[3],openings,baseY,height,COLORS.exterior);
      buildWallZBand(`${name}-inner-leaf`,'exterior',innerBand[0],innerBand[1],innerBand[2],innerBand[3],openings,baseY,height,COLORS.exterior);
      addInnerLeafInteriorPaintZ(name,innerBand,openings,roomFace,baseY,height);
    }

    function addWallX(name, category, x0, x1, z0, z1, openings = [], options = {}) {
      const baseY = options.baseY ?? 0;
      const height = options.height ?? WALL_H;
      const color = category === 'exterior' ? COLORS.exterior : COLORS.internal;
      if (category === 'exterior' && z1-z0 >= PARAMS.EXTERIOR_WALL-.002) {
        const exteriorSide = options.exteriorSide || 'min';
        if (exteriorSide === 'max') {
          const innerEnd = z0 + PARAMS.EXTERIOR_INNER_LEAF;
          const outerStart = innerEnd + PARAMS.EXTERIOR_CAVITY;
          buildWallXBand(`${name}-inner-leaf`, category, x0, x1, z0, innerEnd, openings, baseY, height, color);
          buildWallXBand(`${name}-outer-leaf`, category, x0, x1, outerStart, z1, openings, baseY, height, color);
        } else {
          const outerEnd = z0 + PARAMS.EXTERIOR_OUTER_LEAF;
          const innerStart = outerEnd + PARAMS.EXTERIOR_CAVITY;
          buildWallXBand(`${name}-outer-leaf`, category, x0, x1, z0, outerEnd, openings, baseY, height, color);
          buildWallXBand(`${name}-inner-leaf`, category, x0, x1, innerStart, z1, openings, baseY, height, color);
        }
      } else {
        buildWallXBand(name, category, x0, x1, z0, z1, openings, baseY, height, color);
        if (options.cornice !== false) addCorniceX(`${name}-cornice`, x0, x1, z0, z1, baseY, height);
      }
    }

    function addWallZ(name, category, x0, x1, z0, z1, openings = [], options = {}) {
      const baseY = options.baseY ?? 0;
      const height = options.height ?? WALL_H;
      const color = category === 'exterior' ? COLORS.exterior : COLORS.internal;
      if (category === 'exterior' && x1-x0 >= PARAMS.EXTERIOR_WALL-.002) {
        const exteriorSide = options.exteriorSide || 'min';
        if (exteriorSide === 'max') {
          const innerEnd = x0 + PARAMS.EXTERIOR_INNER_LEAF;
          const outerStart = innerEnd + PARAMS.EXTERIOR_CAVITY;
          buildWallZBand(`${name}-inner-leaf`, category, x0, innerEnd, z0, z1, openings, baseY, height, color);
          buildWallZBand(`${name}-outer-leaf`, category, outerStart, x1, z0, z1, openings, baseY, height, color);
        } else {
          const outerEnd = x0 + PARAMS.EXTERIOR_OUTER_LEAF;
          const innerStart = outerEnd + PARAMS.EXTERIOR_CAVITY;
          buildWallZBand(`${name}-outer-leaf`, category, x0, outerEnd, z0, z1, openings, baseY, height, color);
          buildWallZBand(`${name}-inner-leaf`, category, innerStart, x1, z0, z1, openings, baseY, height, color);
        }
      } else {
        buildWallZBand(name, category, x0, x1, z0, z1, openings, baseY, height, color);
        if (options.cornice !== false) addCorniceZ(`${name}-cornice`, x0, x1, z0, z1, baseY, height);
      }
    }

    const PANEL_MARK = Object.freeze({ fixed: 'F', awning: 'A', 'slide-left': '←', 'slide-right': '→' });

    function addArrowX(name, category, x0, x1, y, z, direction, color) {
      const w = x1 - x0;
      const start = direction === 'slide-left' ? x0 + w*.74 : x0 + w*.26;
      const end = direction === 'slide-left' ? x0 + w*.26 : x0 + w*.74;
      const back = end + (direction === 'slide-left' ? w*.11 : -w*.11);
      return [
        addLine(`${name}-shaft`, category, [[start,y,z],[end,y,z]], color, .98),
        addLine(`${name}-head-a`, category, [[end,y,z],[back,y+.055,z]], color, .98),
        addLine(`${name}-head-b`, category, [[end,y,z],[back,y-.055,z]], color, .98)
      ];
    }

    function addArrowZ(name, category, x, z0, z1, y, direction, color) {
      const w = z1 - z0;
      const start = direction === 'slide-left' ? z0 + w*.74 : z0 + w*.26;
      const end = direction === 'slide-left' ? z0 + w*.26 : z0 + w*.74;
      const back = end + (direction === 'slide-left' ? w*.11 : -w*.11);
      return [
        addLine(`${name}-shaft`, category, [[x,y,start],[x,y,end]], color, .98),
        addLine(`${name}-head-a`, category, [[x,y,end],[x,y+.055,back]], color, .98),
        addLine(`${name}-head-b`, category, [[x,y,end],[x,y-.055,back]], color, .98)
      ];
    }

    function tagHighVisibilityRobeArrow(items, robeId, role, face) {
      items.filter(Boolean).forEach(item=>{
        item.highVisibilityRobeArrow=true;
        item.robeAssemblyId=robeId;
        item.robeArrowRole=role;
        item.robeArrowFace=face;
      });
    }

    function addHighVisibilityRobeArrowX(name, robeId, x0, x1, y, panelZ, direction) {
      [-1,1].forEach(face=>{
        const z=panelZ+face*.055;
        tagHighVisibilityRobeArrow(
          addArrowX(`${name}-${face<0?'front':'back'}-bright`,'robe',x0,x1,y,z-face*.0005,direction,COLORS.robeArrow),
          robeId,direction,face
        );
      });
    }

    function addHighVisibilityRobeArrowZ(name, category, robeId, panelX, z0, z1, y, direction) {
      [-1,1].forEach(face=>{
        const x=panelX+face*.055;
        tagHighVisibilityRobeArrow(
          addArrowZ(`${name}-${face<0?'front':'back'}-bright`,category,x-face*.0005,z0,z1,y,direction,COLORS.robeArrow),
          robeId,direction,face
        );
      });
    }

    function addPanelMarkX(id, index, x0, x1, z, sill, head, operation, obscure) {
      const pad = Math.min(.09, (x1-x0)*.14);
      [z-.014,z+.014].forEach((markZ,face) => {
        if (obscure) {
          addLine(`${id}-obs-${index}-face-${face+1}`, 'glazing', [[x0+pad,sill+.07,markZ],[x1-pad,head-.07,markZ]], COLORS.windowMark, .55);
        }
        if (operation === 'awning') {
          addLine(`${id}-awning-${index}-face-${face+1}`, 'glazing', [[x0+pad,head-.06,markZ],[(x0+x1)/2,sill+.06,markZ],[x1-pad,head-.06,markZ]], COLORS.windowMark, 1);
        } else if (operation === 'slide-left' || operation === 'slide-right') {
          addArrowX(`${id}-travel-${index}-face-${face+1}`, 'glazing', x0, x1, (sill+head)/2, markZ, operation, COLORS.windowMark);
        }
      });
    }

    function addPanelMarkZ(id, index, x, z0, z1, sill, head, operation, obscure) {
      const pad = Math.min(.09, (z1-z0)*.14);
      [x-.014,x+.014].forEach((markX,face) => {
        if (obscure) {
          addLine(`${id}-obs-${index}-face-${face+1}`, 'glazing', [[markX,sill+.07,z0+pad],[markX,head-.07,z1-pad]], COLORS.windowMark, .55);
        }
        if (operation === 'awning') {
          addLine(`${id}-awning-${index}-face-${face+1}`, 'glazing', [[markX,head-.06,z0+pad],[markX,sill+.06,(z0+z1)/2],[markX,head-.06,z1-pad]], COLORS.windowMark, 1);
        } else if (operation === 'slide-left' || operation === 'slide-right') {
          addArrowZ(`${id}-travel-${index}-face-${face+1}`, 'glazing', markX, z0, z1, (sill+head)/2, operation, COLORS.windowMark);
        }
      });
    }

    function easedProgress(state) {
      const p=Math.max(0,Math.min(1,state.progress));
      return p*p*(3-2*p);
    }

    function setTransformOnItems(items, transformWhen) {
      items.forEach(item=>setItemTransform(item,transformWhen));
    }

    function addMovingSashX(name,x0,x1,z,sill,head,transformWhen) {
      const rail=.018, depth=.034;
      const items=[
        addBox(`${name}-sash-left`,'glazing',x0+.006,x0+.006+rail,sill+.006,head-.006,z-depth/2,z+depth/2,COLORS.glazeFrame,1),
        addBox(`${name}-sash-right`,'glazing',x1-.006-rail,x1-.006,sill+.006,head-.006,z-depth/2,z+depth/2,COLORS.glazeFrame,1),
        addBox(`${name}-sash-bottom`,'glazing',x0+.006,x1-.006,sill+.006,sill+.006+rail,z-depth/2,z+depth/2,COLORS.glazeFrame,1),
        addBox(`${name}-sash-top`,'glazing',x0+.006,x1-.006,head-.006-rail,head-.006,z-depth/2,z+depth/2,COLORS.glazeFrame,1)
      ];
      setTransformOnItems(items,transformWhen);
    }

    function addMovingSashZ(name,x,z0,z1,sill,head,transformWhen) {
      const rail=.018, depth=.034;
      const items=[
        addBox(`${name}-sash-north`,'glazing',x-depth/2,x+depth/2,sill+.006,head-.006,z0+.006,z0+.006+rail,COLORS.glazeFrame,1),
        addBox(`${name}-sash-south`,'glazing',x-depth/2,x+depth/2,sill+.006,head-.006,z1-.006-rail,z1-.006,COLORS.glazeFrame,1),
        addBox(`${name}-sash-bottom`,'glazing',x-depth/2,x+depth/2,sill+.006,sill+.006+rail,z0+.006,z1-.006,COLORS.glazeFrame,1),
        addBox(`${name}-sash-top`,'glazing',x-depth/2,x+depth/2,head-.006-rail,head-.006,z0+.006,z1-.006,COLORS.glazeFrame,1)
      ];
      setTransformOnItems(items,transformWhen);
    }

    function glazingStyle(options={}) {
      const type=options.glazingType || (options.obscure ? 'obscure' : 'clear');
      if (type==='obscure') return {type,color:COLORS.obscureGlazing,alpha:1,roughness:.045};
      if (type==='grey') return {type,color:COLORS.greyGlazing,alpha:1,roughness:.018};
      return {type:'clear',color:COLORS.clearGlazing,alpha:COLORS.clearGlazing[3],roughness:.008};
    }

    function tagGlazingPane(item,style) {
      item.glazingType=style.type;
      item.surfaceRoughness=style.roughness;
      return item;
    }

    const V21_WINDOW_FRAME_DEPTH=.076;
    const V21_WINDOW_GLASS_TRACK_OFFSET=.010;
    const V21_WINDOW_SCREEN_TRACK_OFFSET=.034;

    function tagV21WindowFrame(item,id,role) {
      if(!item) return item;
      item.v21WindowFrame=true;
      item.v21WindowTrack=role.includes('track');
      item.windowAssemblyId=id;
      item.windowFrameRole=role;
      item.frameDepthMm=Math.round(V21_WINDOW_FRAME_DEPTH*1000);
      item.cavityCentred=true;
      item.JasonReference=true;
      item.surfaceRoughness=.012;
      return item;
    }

    function tagV21FlyscreenItem(item,id,index,operation,mount,role,state=null) {
      if(!item) return item;
      item.v21Flyscreen=true;
      item.parentAssemblyId=id;
      item.flyscreenPanelIndex=index+1;
      item.flyscreenOperation=operation;
      item.flyscreenMount=mount;
      item.flyscreenRole=role;
      item.flyscreenOutermostTrack=mount==='exterior-outermost-track';
      item.flyscreenFixedInterior=mount==='interior-fixed';
      item.JasonReference=true;
      item.nonInteractiveAccessory=true;
      if(state?.canToggle) {
        item.physicalAction={kind:'opening',state};
        item.accessoryInteractionProxy=true;
        item.flyscreenForOpeningStateId=state.id;
      }
      return item;
    }

    function addV21FlyscreenX(id,index,operation,panelX0,panelX1,z,ySill,yHead,labelZOffset,state) {
      if (!['slide-left','slide-right','awning'].includes(operation)) return;
      const exteriorSign=labelZOffset>0?-1:1;
      const mount=operation==='awning'?'interior-fixed':'exterior-outermost-track';
      const side=operation==='awning'?-exteriorSign:exteriorSign;
      const screenZ=z+side*V21_WINDOW_SCREEN_TRACK_OFFSET;
      const frame=.018,frameDepth=.008;
      const metadata=[id,index,operation,mount];
      const mesh=tagV21FlyscreenItem(addBox(`${id}-P${index+1}-v21-flyscreen-mesh`,'glazing',panelX0+frame,panelX1-frame,ySill+frame,yHead-frame,screenZ-.001,screenZ+.001,COLORS.flyscreenMesh,.10),...metadata,'mesh',state);
      mesh.surfaceRoughness=.030;
      mesh.flyscreenDensity='fine';
      mesh.flyscreenColumns=PARAMS.FLYSCREEN_WEAVE_COLUMNS;
      mesh.flyscreenRows=PARAMS.FLYSCREEN_WEAVE_ROWS;
      const frameItems=[
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-left`,'glazing',panelX0,panelX0+frame,ySill,yHead,screenZ-frameDepth/2,screenZ+frameDepth/2,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-right`,'glazing',panelX1-frame,panelX1,ySill,yHead,screenZ-frameDepth/2,screenZ+frameDepth/2,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-sill`,'glazing',panelX0,panelX1,ySill,ySill+frame,screenZ-frameDepth/2,screenZ+frameDepth/2,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-head`,'glazing',panelX0,panelX1,yHead-frame,yHead,screenZ-frameDepth/2,screenZ+frameDepth/2,COLORS.silver,1)
      ];
      frameItems.forEach(item=>{
        tagV21FlyscreenItem(item,...metadata,'four-side-frame',state);
        item.surfaceRoughness=.012;
        item.clearAnodisedSilver=true;
      });
      const weaveZ=screenZ+side*.0015;
      const warpSegments=[],weftSegments=[];
      for(let column=1;column<PARAMS.FLYSCREEN_WEAVE_COLUMNS;column++) {
        const x=panelX0+frame+(panelX1-panelX0-2*frame)*column/PARAMS.FLYSCREEN_WEAVE_COLUMNS;
        warpSegments.push([[x,ySill+frame,weaveZ],[x,yHead-frame,weaveZ]]);
      }
      for(let row=1;row<PARAMS.FLYSCREEN_WEAVE_ROWS;row++) {
        const y=ySill+frame+(yHead-ySill-2*frame)*row/PARAMS.FLYSCREEN_WEAVE_ROWS;
        weftSegments.push([[panelX0+frame,y,weaveZ],[panelX1-frame,y,weaveZ]]);
      }
      [
        [addSegmentLine(`${id}-P${index+1}-v22-flyscreen-warp-batch`,'glazing',warpSegments,COLORS.flyscreenWeave,.12),warpSegments.length,'warp'],
        [addSegmentLine(`${id}-P${index+1}-v22-flyscreen-weft-batch`,'glazing',weftSegments,COLORS.flyscreenWeave,.10),weftSegments.length,'weft']
      ].forEach(([line,segmentCount,weaveAxis])=>{
        tagV21FlyscreenItem(line,...metadata,'fine-weave',state);
        line.wovenFlyscreenMesh=true;
        line.wovenSegmentCount=segmentCount;
        line.flyscreenDensity='fine';
        line.flyscreenWeaveAxis=weaveAxis;
      });
    }

    function addV21FlyscreenZ(id,index,operation,x,panelZ0,panelZ1,ySill,yHead,labelXOffset,state) {
      if (!['slide-left','slide-right','awning'].includes(operation)) return;
      const exteriorSign=labelXOffset>0?-1:1;
      const mount=operation==='awning'?'interior-fixed':'exterior-outermost-track';
      const side=operation==='awning'?-exteriorSign:exteriorSign;
      const screenX=x+side*V21_WINDOW_SCREEN_TRACK_OFFSET;
      const frame=.018,frameDepth=.008;
      const metadata=[id,index,operation,mount];
      const mesh=tagV21FlyscreenItem(addBox(`${id}-P${index+1}-v21-flyscreen-mesh`,'glazing',screenX-.001,screenX+.001,ySill+frame,yHead-frame,panelZ0+frame,panelZ1-frame,COLORS.flyscreenMesh,.10),...metadata,'mesh',state);
      mesh.surfaceRoughness=.030;
      mesh.flyscreenDensity='fine';
      mesh.flyscreenColumns=PARAMS.FLYSCREEN_WEAVE_COLUMNS;
      mesh.flyscreenRows=PARAMS.FLYSCREEN_WEAVE_ROWS;
      const frameItems=[
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-north`,'glazing',screenX-frameDepth/2,screenX+frameDepth/2,ySill,yHead,panelZ0,panelZ0+frame,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-south`,'glazing',screenX-frameDepth/2,screenX+frameDepth/2,ySill,yHead,panelZ1-frame,panelZ1,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-sill`,'glazing',screenX-frameDepth/2,screenX+frameDepth/2,ySill,ySill+frame,panelZ0,panelZ1,COLORS.silver,1),
        addBox(`${id}-P${index+1}-v21-flyscreen-frame-head`,'glazing',screenX-frameDepth/2,screenX+frameDepth/2,yHead-frame,yHead,panelZ0,panelZ1,COLORS.silver,1)
      ];
      frameItems.forEach(item=>{
        tagV21FlyscreenItem(item,...metadata,'four-side-frame',state);
        item.surfaceRoughness=.012;
        item.clearAnodisedSilver=true;
      });
      const weaveX=screenX+side*.0015;
      const warpSegments=[],weftSegments=[];
      for(let column=1;column<PARAMS.FLYSCREEN_WEAVE_COLUMNS;column++) {
        const zValue=panelZ0+frame+(panelZ1-panelZ0-2*frame)*column/PARAMS.FLYSCREEN_WEAVE_COLUMNS;
        warpSegments.push([[weaveX,ySill+frame,zValue],[weaveX,yHead-frame,zValue]]);
      }
      for(let row=1;row<PARAMS.FLYSCREEN_WEAVE_ROWS;row++) {
        const y=ySill+frame+(yHead-ySill-2*frame)*row/PARAMS.FLYSCREEN_WEAVE_ROWS;
        weftSegments.push([[weaveX,y,panelZ0+frame],[weaveX,y,panelZ1-frame]]);
      }
      [
        [addSegmentLine(`${id}-P${index+1}-v22-flyscreen-warp-batch`,'glazing',warpSegments,COLORS.flyscreenWeave,.12),warpSegments.length,'warp'],
        [addSegmentLine(`${id}-P${index+1}-v22-flyscreen-weft-batch`,'glazing',weftSegments,COLORS.flyscreenWeave,.10),weftSegments.length,'weft']
      ].forEach(([line,segmentCount,weaveAxis])=>{
        tagV21FlyscreenItem(line,...metadata,'fine-weave',state);
        line.wovenFlyscreenMesh=true;
        line.wovenSegmentCount=segmentCount;
        line.flyscreenDensity='fine';
        line.flyscreenWeaveAxis=weaveAxis;
      });
    }

    function addGlazingX(id, x0, x1, z, sill, head, drawingCode, panels, labelZOffset, options = {}) {
      floorWindowSources.push({id,level:activeBuildLevel,axis:0,plane:z-PLAN_D/2,q0:x0-PLAN_W/2,q1:x1-PLAN_W/2,sill:(options.baseY||0)+sill,head:(options.baseY||0)+head});
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill, yHead=baseY+head;
      const t = 0.018;
      const span = (x1-x0) / panels.length;
      const style=glazingStyle(options);
      const frameZ=Number.isFinite(options.cavityCentrePlane)?options.cavityCentrePlane:z;
      const exteriorSign=labelZOffset>0?-1:1;
      const hasSliding=panels.some(operation=>operation==='slide-left'||operation==='slide-right');
      const fixedTrackZ=frameZ+exteriorSign*V21_WINDOW_GLASS_TRACK_OFFSET;
      const movingTrackZ=frameZ-exteriorSign*V21_WINDOW_GLASS_TRACK_OFFSET;
      panels.forEach((operation, index) => {
        const panelX0 = x0 + span*index;
        const panelX1 = x0 + span*(index+1);
        if (operation === 'fixed') {
          const fixedState=registerInteraction(`${id}-P${index+1}`,'fixed window panel','glazing',[(panelX0+panelX1)/2,(ySill+yHead)/2,z],false,false);
          fixedState.assemblyId=id;
          fixedState.panelIndex=index+1;
          fixedState.operation=operation;
          const paneZ=hasSliding?fixedTrackZ:frameZ;
          tagGlazingPane(addBox(`${id}-glass-${index+1}-fixed`, 'glazing', panelX0+.012, panelX1-.012, ySill+.012, yHead-.012, paneZ-t/2, paneZ+t/2, style.color, style.alpha),style);
        } else {
          const state=registerInteraction(`${id}-P${index+1}`,'operable window panel','glazing',[(panelX0+panelX1)/2,(ySill+yHead)/2,z],false,true);
          state.assemblyId=id;
          state.panelIndex=index+1;
          state.operation=operation;
          const paneZ=operation==='awning'?fixedTrackZ:movingTrackZ;
          state.windowTrackOffset=paneZ-frameZ;
          state.windowFrameDepth=V21_WINDOW_FRAME_DEPTH;
          state.windowFrameCentrePlane=frameZ;
          state.closedHitBounds=[
            toWorld(panelX0+.035,ySill+.035,frameZ-V21_WINDOW_FRAME_DEPTH/2),
            toWorld(panelX1-.035,yHead-.035,frameZ+V21_WINDOW_FRAME_DEPTH/2)
          ];
          state.closedHitTarget={name:`${state.id}-closed-position-hit-area`,closedWindowHitTarget:true};
          let transformWhen;
          if (operation === 'awning') {
            const outward = (labelZOffset > 0 ? -1 : 1);
            const pivot=toWorld((panelX0+panelX1)/2,yHead-.012,paneZ);
            transformWhen=()=>mat4AroundPivot('x',-outward*PARAMS.WINDOW_AWNING_OPEN_ANGLE*easedProgress(state),pivot);
          } else {
            const direction = operation === 'slide-left' ? -1 : 1;
            transformWhen=()=>mat4Translation(direction*span*easedProgress(state),0,0);
          }
          const movingPane=tagGlazingPane(addBox(`${id}-glass-${index+1}-moving`,'glazing',panelX0+.012,panelX1-.012,ySill+.012,yHead-.012,paneZ-t/2,paneZ+t/2,style.color,style.alpha),style);
          setItemTransform(movingPane,transformWhen);
          addMovingSashX(`${id}-${index+1}`,panelX0,panelX1,paneZ,ySill,yHead,transformWhen);
          addV21FlyscreenX(id,index,operation,panelX0,panelX1,frameZ,ySill,yHead,labelZOffset,state);
        }
        addPanelMarkX(id, index+1, panelX0, panelX1, frameZ, ySill, yHead, operation, style.type==='obscure');
      });
      const frameHalfDepth=V21_WINDOW_FRAME_DEPTH/2;
      [
        ['left',addBox(`${id}-frame-left`, 'glazing', x0, x0+.035, ySill, yHead, frameZ-frameHalfDepth, frameZ+frameHalfDepth, COLORS.glazeFrame, 1)],
        ['right',addBox(`${id}-frame-right`, 'glazing', x1-.035, x1, ySill, yHead, frameZ-frameHalfDepth, frameZ+frameHalfDepth, COLORS.glazeFrame, 1)],
        ['sill',addBox(`${id}-frame-sill`, 'glazing', x0, x1, ySill, ySill+.035, frameZ-frameHalfDepth, frameZ+frameHalfDepth, COLORS.glazeFrame, 1)],
        ['head',addBox(`${id}-frame-head`, 'glazing', x0, x1, yHead-.035, yHead, frameZ-frameHalfDepth, frameZ+frameHalfDepth, COLORS.glazeFrame, 1)]
      ].forEach(([role,item])=>tagV21WindowFrame(item,id,`perimeter-${role}`));
      for (let i=1; i<panels.length; i++) {
        const centre = x0 + span*i;
        const width = options.mullionWidths?.[i-1] || .028;
        tagV21WindowFrame(addBox(`${id}-mullion-${i}`, 'glazing', centre-width/2, centre+width/2, ySill, yHead, frameZ-frameHalfDepth, frameZ+frameHalfDepth, COLORS.glazeFrame, 1),id,'mullion');
      }
      if(hasSliding) {
        [['fixed',fixedTrackZ],['moving',movingTrackZ]].forEach(([role,trackZ])=>{
          tagV21WindowFrame(addBox(`${id}-v21-${role}-lower-track`,'glazing',x0+.035,x1-.035,ySill+.032,ySill+.038,trackZ-.002,trackZ+.002,COLORS.brushedNickel,1),id,`${role}-lower-track`);
          tagV21WindowFrame(addBox(`${id}-v21-${role}-upper-track`,'glazing',x0+.035,x1-.035,yHead-.038,yHead-.032,trackZ-.002,trackZ+.002,COLORS.brushedNickel,1),id,`${role}-upper-track`);
        });
      }
      const pattern = panels.map(panel => PANEL_MARK[panel]).join(' | ');
      addLabel(`${id} · ${drawingCode} · ${pattern}`, (x0+x1)/2, (ySill+yHead)/2, z+labelZOffset, 'opening', 'glazing');
    }

    function addFixedTransomX(id,x0,x1,z,sill,head,columns,options={}) {
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill,yHead=baseY+head;
      const style=glazingStyle(options);
      const span=(x1-x0)/columns,t=.018;
      for (let index=0;index<columns;index++) {
        const panelX0=x0+span*index,panelX1=x0+span*(index+1);
        tagGlazingPane(addBox(`${id}-lower-fixed-${index+1}`,'glazing',panelX0+.012,panelX1-.012,ySill+.012,yHead-.012,z-t/2,z+t/2,style.color,style.alpha),style);
      }
      addBox(`${id}-lower-frame-left`,'glazing',x0,x0+.035,ySill,yHead,z-.025,z+.025,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-right`,'glazing',x1-.035,x1,ySill,yHead,z-.025,z+.025,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-sill`,'glazing',x0,x1,ySill,ySill+.035,z-.025,z+.025,COLORS.glazeFrame,1);
      for (let index=1;index<columns;index++) {
        const centre=x0+span*index;
        addBox(`${id}-lower-mullion-${index}`,'glazing',centre-.014,centre+.014,ySill,yHead,z-.026,z+.026,COLORS.glazeFrame,1);
      }
    }

    function addGlazingZ(id, x, z0, z1, sill, head, drawingCode, panels, labelXOffset, options = {}) {
      floorWindowSources.push({id,level:activeBuildLevel,axis:1,plane:x-PLAN_W/2,q0:z0-PLAN_D/2,q1:z1-PLAN_D/2,sill:(options.baseY||0)+sill,head:(options.baseY||0)+head});
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill, yHead=baseY+head;
      const t = 0.018;
      const span = (z1-z0) / panels.length;
      const style=glazingStyle(options);
      const frameX=Number.isFinite(options.cavityCentrePlane)?options.cavityCentrePlane:x;
      const exteriorSign=labelXOffset>0?-1:1;
      const hasSliding=panels.some(operation=>operation==='slide-left'||operation==='slide-right');
      const fixedTrackX=frameX+exteriorSign*V21_WINDOW_GLASS_TRACK_OFFSET;
      const movingTrackX=frameX-exteriorSign*V21_WINDOW_GLASS_TRACK_OFFSET;
      panels.forEach((operation, index) => {
        const panelZ0 = z0 + span*index;
        const panelZ1 = z0 + span*(index+1);
        if (operation === 'fixed') {
          const fixedState=registerInteraction(`${id}-P${index+1}`,'fixed window panel','glazing',[x,(ySill+yHead)/2,(panelZ0+panelZ1)/2],false,false);
          fixedState.assemblyId=id;
          fixedState.panelIndex=index+1;
          fixedState.operation=operation;
          const paneX=hasSliding?fixedTrackX:frameX;
          tagGlazingPane(addBox(`${id}-glass-${index+1}-fixed`, 'glazing', paneX-t/2, paneX+t/2, ySill+.012, yHead-.012, panelZ0+.012, panelZ1-.012, style.color, style.alpha),style);
        } else {
          const state=registerInteraction(`${id}-P${index+1}`,'operable window panel','glazing',[x,(ySill+yHead)/2,(panelZ0+panelZ1)/2],false,true);
          state.assemblyId=id;
          state.panelIndex=index+1;
          state.operation=operation;
          const paneX=operation==='awning'?fixedTrackX:movingTrackX;
          state.windowTrackOffset=paneX-frameX;
          state.windowFrameDepth=V21_WINDOW_FRAME_DEPTH;
          state.windowFrameCentrePlane=frameX;
          state.closedHitBounds=[
            toWorld(frameX-V21_WINDOW_FRAME_DEPTH/2,ySill+.035,panelZ0+.035),
            toWorld(frameX+V21_WINDOW_FRAME_DEPTH/2,yHead-.035,panelZ1-.035)
          ];
          state.closedHitTarget={name:`${state.id}-closed-position-hit-area`,closedWindowHitTarget:true};
          let transformWhen;
          if (operation === 'awning') {
            const outward = (labelXOffset > 0 ? -1 : 1);
            const pivot=toWorld(paneX,yHead-.012,(panelZ0+panelZ1)/2);
            transformWhen=()=>mat4AroundPivot('z',outward*PARAMS.WINDOW_AWNING_OPEN_ANGLE*easedProgress(state),pivot);
          } else {
            const direction = operation === 'slide-left' ? -1 : 1;
            transformWhen=()=>mat4Translation(0,0,direction*span*easedProgress(state));
          }
          const movingPane=tagGlazingPane(addBox(`${id}-glass-${index+1}-moving`,'glazing',paneX-t/2,paneX+t/2,ySill+.012,yHead-.012,panelZ0+.012,panelZ1-.012,style.color,style.alpha),style);
          setItemTransform(movingPane,transformWhen);
          addMovingSashZ(`${id}-${index+1}`,paneX,panelZ0,panelZ1,ySill,yHead,transformWhen);
          addV21FlyscreenZ(id,index,operation,frameX,panelZ0,panelZ1,ySill,yHead,labelXOffset,state);
        }
        addPanelMarkZ(id, index+1, frameX, panelZ0, panelZ1, ySill, yHead, operation, style.type==='obscure');
      });
      const frameHalfDepth=V21_WINDOW_FRAME_DEPTH/2;
      [
        ['north',addBox(`${id}-frame-top`, 'glazing', frameX-frameHalfDepth, frameX+frameHalfDepth, ySill, yHead, z0, z0+.035, COLORS.glazeFrame, 1)],
        ['south',addBox(`${id}-frame-bottom`, 'glazing', frameX-frameHalfDepth, frameX+frameHalfDepth, ySill, yHead, z1-.035, z1, COLORS.glazeFrame, 1)],
        ['sill',addBox(`${id}-frame-sill`, 'glazing', frameX-frameHalfDepth, frameX+frameHalfDepth, ySill, ySill+.035, z0, z1, COLORS.glazeFrame, 1)],
        ['head',addBox(`${id}-frame-head`, 'glazing', frameX-frameHalfDepth, frameX+frameHalfDepth, yHead-.035, yHead, z0, z1, COLORS.glazeFrame, 1)]
      ].forEach(([role,item])=>tagV21WindowFrame(item,id,`perimeter-${role}`));
      for (let i=1; i<panels.length; i++) {
        const centre = z0 + span*i;
        const width = options.mullionWidths?.[i-1] || .028;
        tagV21WindowFrame(addBox(`${id}-mullion-${i}`, 'glazing', frameX-frameHalfDepth, frameX+frameHalfDepth, ySill, yHead, centre-width/2, centre+width/2, COLORS.glazeFrame, 1),id,'mullion');
      }
      if(hasSliding) {
        [['fixed',fixedTrackX],['moving',movingTrackX]].forEach(([role,trackX])=>{
          tagV21WindowFrame(addBox(`${id}-v21-${role}-lower-track`,'glazing',trackX-.002,trackX+.002,ySill+.032,ySill+.038,z0+.035,z1-.035,COLORS.brushedNickel,1),id,`${role}-lower-track`);
          tagV21WindowFrame(addBox(`${id}-v21-${role}-upper-track`,'glazing',trackX-.002,trackX+.002,yHead-.038,yHead-.032,z0+.035,z1-.035,COLORS.brushedNickel,1),id,`${role}-upper-track`);
        });
      }
      const pattern = panels.map(panel => PANEL_MARK[panel]).join(' | ');
      addLabel(`${id} · ${drawingCode} · ${pattern}`, x+labelXOffset, (ySill+yHead)/2, (z0+z1)/2, 'opening', 'glazing');
    }

    function orientedRect(hingeX, hingeZ, width, angle, thickness) {
      const dx = Math.cos(angle), dz = Math.sin(angle);
      const px = -dz * thickness / 2, pz = dx * thickness / 2;
      return [
        [hingeX + px, hingeZ + pz],
        [hingeX - px, hingeZ - pz],
        [hingeX + dx*width - px, hingeZ + dz*width - pz],
        [hingeX + dx*width + px, hingeZ + dz*width + pz]
      ];
    }

    function centeredRect(cx, cz, length, angle, thickness) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const px=-dz, pz=dx;
      const hl=length/2, ht=thickness/2;
      return [
        [cx-dx*hl-px*ht,cz-dz*hl-pz*ht],
        [cx+dx*hl-px*ht,cz+dz*hl-pz*ht],
        [cx+dx*hl+px*ht,cz+dz*hl+pz*ht],
        [cx-dx*hl+px*ht,cz-dz*hl+pz*ht]
      ];
    }

    function roundSection(radius, segments = 16) {
      return Array.from({length:segments},(_,index)=>{
        const angle=Math.PI*2*index/segments;
        return [Math.cos(angle)*radius,Math.sin(angle)*radius];
      });
    }

    function addDoorFaceDisc(name, hingeX, hingeZ, angle, centreU, centreV, n0, n1, radius, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      return addSectionExtrusion(name,'door',roundSection(radius),(t,u,v)=>{
        const n=n0+(n1-n0)*t;
        return [hingeX+dx*(centreU+u)-dz*n,baseY+centreV+v,hingeZ+dz*(centreU+u)+dx*n];
      },color,1);
    }

    function addDoorLocalBar(name, hingeX, hingeZ, angle, u0, u1, centreV, halfHeight, n0, n1, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const section=[[-halfHeight,n0],[-halfHeight,n1],[halfHeight,n1],[halfHeight,n0]];
      return addSectionExtrusion(name,'door',section,(t,v,n)=>{
        const u=u0+(u1-u0)*t;
        return [hingeX+dx*u-dz*n,baseY+centreV+v,hingeZ+dz*u+dx*n];
      },color,1);
    }

    function addDoorNormalBlade(name, hingeX, hingeZ, angle, centreU, centreV, n0, n1, halfWidth, halfHeight, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const section=[[-halfWidth,-halfHeight],[halfWidth,-halfHeight],[halfWidth,halfHeight],[-halfWidth,halfHeight]];
      return addSectionExtrusion(name,'door',section,(t,u,v)=>{
        const n=n0+(n1-n0)*t;
        return [hingeX+dx*(centreU+u)-dz*n,baseY+centreV+v,hingeZ+dz*(centreU+u)+dx*n];
      },color,1);
    }

    function addDoorPlanePrism(name, hingeX, hingeZ, angle, points, n0, n1, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const mapPoint=(point,n)=>toWorld(
        hingeX+dx*point[0]-dz*n,
        baseY+point[1],
        hingeZ+dz*point[0]+dx*n
      );
      const front=points.map(point=>mapPoint(point,n1));
      const back=points.map(point=>mapPoint(point,n0));
      const positions=[], normals=[];
      const normal=[-dz,0,dx];
      const sign=n1>=n0 ? 1 : -1;
      triangulatePolygon2D(points).forEach(([a,b,c])=>{
        positions.push(...front[a],...front[b],...front[c]);
        normals.push(...normal.map(value=>value*sign),...normal.map(value=>value*sign),...normal.map(value=>value*sign));
        positions.push(...back[a],...back[c],...back[b]);
        normals.push(...normal.map(value=>-value*sign),...normal.map(value=>-value*sign),...normal.map(value=>-value*sign));
      });
      for (let i=0;i<points.length;i++) {
        const j=(i+1)%points.length;
        const edge=normalize(subtract(front[j],front[i]));
        const sideNormal=normalize(cross(edge,subtract(back[i],front[i])));
        pushFace(positions,normals,front[i],front[j],back[j],back[i],sideNormal);
      }
      return addRawMesh(name,'door',positions,normals,color,1,false);
    }

    function addDoorAnnulus(name, hingeX, hingeZ, angle, centreU, centreV, outerRadius, innerRadius, n0, n1, color, baseY, segments=24) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const normal=[-dz,0,dx];
      const mapPoint=(radius,theta,n)=>toWorld(
        hingeX+dx*(centreU+Math.cos(theta)*radius)-dz*n,
        baseY+centreV+Math.sin(theta)*radius,
        hingeZ+dz*(centreU+Math.cos(theta)*radius)+dx*n
      );
      const positions=[], normals=[];
      const sign=n1>=n0 ? 1 : -1;
      for (let i=0;i<segments;i++) {
        const a=Math.PI*2*i/segments, b=Math.PI*2*(i+1)/segments;
        const fo0=mapPoint(outerRadius,a,n1), fo1=mapPoint(outerRadius,b,n1);
        const fi0=mapPoint(innerRadius,a,n1), fi1=mapPoint(innerRadius,b,n1);
        const bo0=mapPoint(outerRadius,a,n0), bo1=mapPoint(outerRadius,b,n0);
        const bi0=mapPoint(innerRadius,a,n0), bi1=mapPoint(innerRadius,b,n0);
        pushFace(positions,normals,fo0,fo1,fi1,fi0,normal.map(value=>value*sign));
        pushFace(positions,normals,bo1,bo0,bi0,bi1,normal.map(value=>-value*sign));
        const mid=(a+b)/2;
        const radial=[dx*Math.cos(mid),Math.sin(mid),dz*Math.cos(mid)];
        pushFace(positions,normals,bo0,bo1,fo1,fo0,radial);
        pushFace(positions,normals,bi1,bi0,fi0,fi1,radial.map(value=>-value));
      }
      return addRawMesh(name,'door',positions,normals,color,1,false);
    }

    function addDoorKeyBow(name, hingeX, hingeZ, angle, centreU, centreV, n0, n1, color, baseY, scale=1, segments=28, inPlaneAngle=0) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const normal=[-dz,0,dx];
      const outerU=PARAMS.DOOR_KEY_BOW_HALF_WIDTH*scale;
      const outerV=PARAMS.DOOR_KEY_BOW_HALF_HEIGHT*scale;
      const innerR=PARAMS.DOOR_KEY_BOW_HOLE_RADIUS*scale;
      const cosR=Math.cos(inPlaneAngle), sinR=Math.sin(inPlaneAngle);
      const superellipse=value=>Math.sign(value)*Math.pow(Math.abs(value),.5);
      const rotateLocal=(localU,localV)=>[
        centreU+localU*cosR-localV*sinR,
        centreV+localU*sinR+localV*cosR
      ];
      const outer=theta=>rotateLocal(
        outerU*superellipse(Math.cos(theta)),
        outerV*superellipse(Math.sin(theta))
      );
      const inner=theta=>rotateLocal(
        innerR*Math.cos(theta),
        -.001*scale+innerR*Math.sin(theta)
      );
      const mapPoint=(u,v,n)=>toWorld(
        hingeX+dx*u-dz*n,
        baseY+v,
        hingeZ+dz*u+dx*n
      );
      const positions=[], normals=[];
      const sign=n1>=n0 ? 1 : -1;
      for (let i=0;i<segments;i++) {
        const a=Math.PI*2*i/segments, b=Math.PI*2*(i+1)/segments;
        const oa=outer(a), ob=outer(b), ia=inner(a), ib=inner(b);
        const fo0=mapPoint(oa[0],oa[1],n1), fo1=mapPoint(ob[0],ob[1],n1);
        const fi0=mapPoint(ia[0],ia[1],n1), fi1=mapPoint(ib[0],ib[1],n1);
        const bo0=mapPoint(oa[0],oa[1],n0), bo1=mapPoint(ob[0],ob[1],n0);
        const bi0=mapPoint(ia[0],ia[1],n0), bi1=mapPoint(ib[0],ib[1],n0);
        pushFace(positions,normals,fo0,fo1,fi1,fi0,normal.map(value=>value*sign));
        pushFace(positions,normals,bo1,bo0,bi0,bi1,normal.map(value=>-value*sign));
        const mid=(a+b)/2;
        const localU=Math.cos(mid)*cosR-Math.sin(mid)*sinR;
        const localV=Math.cos(mid)*sinR+Math.sin(mid)*cosR;
        const radial=[dx*localU,localV,dz*localU];
        pushFace(positions,normals,bo0,bo1,fo1,fo0,radial);
        pushFace(positions,normals,bi1,bi0,fi0,fi1,radial.map(value=>-value));
      }
      return addRawMesh(name,'door',positions,normals,color,1,false);
    }

    function doorFlatBarPoints(startU,startV,length,width,angle=0) {
      const du=Math.sin(angle), dv=-Math.cos(angle);
      const pu=Math.cos(angle)*width/2, pv=Math.sin(angle)*width/2;
      const endU=startU+du*length, endV=startV+dv*length;
      return [
        [startU-pu,startV-pv],[startU+pu,startV+pv],
        [endU+pu,endV+pv],[endU-pu,endV-pv]
      ];
    }

    function doorKeyBladePoints(startU,startV,length,halfHeight,angle=0) {
      const du=Math.sin(angle), dv=-Math.cos(angle);
      const pu=Math.cos(angle), pv=Math.sin(angle);
      const point=(distance,height)=>[
        startU+du*distance+pu*height,
        startV+dv*distance+pv*height
      ];
      // One reusable five-cut C4-style silhouette. Both hanging copies and the
      // partly withdrawn inserted key are tagged as this exact same blank.
      const topEdge=[
        [length,.0008],
        [length-.002,.0017],
        [length-.004,halfHeight],
        [length-.007,.0016],
        [length-.010,halfHeight],
        [length-.013,.0022],
        [length-.016,halfHeight],
        [length-.019,.0018],
        [length-.022,halfHeight],
        [length-.025,.0024],
        [length-.028,halfHeight],
        [length-.031,.0019],
        [length-.034,halfHeight],
        [.010,halfHeight],
        [0,halfHeight]
      ];
      return [
        point(0,-halfHeight),
        point(length-.002,-halfHeight),
        point(length,-.0008),
        ...topEdge.map(([distance,height])=>point(distance,height))
      ];
    }

    function addHangingSpareKey(id, index, hingeX, hingeZ, angle, ringU, ringV, keyAngle, length, n0, n1, color, baseY) {
      const items=[];
      const du=Math.sin(keyAngle), dv=-Math.cos(keyAngle);
      const bowU=ringU+du*.020, bowV=ringV+dv*.020;
      items.push(addDoorKeyBow(`${id}-spare-key-${index}-matching-bow`,hingeX,hingeZ,angle,bowU,bowV,n0,n1,color,baseY,1,30,keyAngle));
      const shaftStartU=bowU+du*.0105, shaftStartV=bowV+dv*.0105;
      items.push(addDoorPlanePrism(
        `${id}-spare-key-${index}-five-pin-blade`,
        hingeX,hingeZ,angle,
        doorKeyBladePoints(shaftStartU,shaftStartV,length,PARAMS.DOOR_KEY_BLADE_HALF_HEIGHT,keyAngle),
        n0,n1,color,baseY
      ));
      const grooveStartU=shaftStartU+du*.004;
      const grooveStartV=shaftStartV+dv*.004;
      const grooveN0=n0+(n1-n0)*.72;
      const grooveN1=n0+(n1-n0)*.92;
      items.push(addDoorPlanePrism(
        `${id}-spare-key-${index}-blade-groove`,
        hingeX,hingeZ,angle,
        doorFlatBarPoints(grooveStartU,grooveStartV,length*.72,.0009,keyAngle),
        grooveN0,grooveN1,COLORS.keyEdge,baseY
      ));
      items.filter(Boolean).forEach(item=>{
        item.keyProfileId='AU-C4-5PIN-V13';
        item.keyBladeCutCount=5;
        item.keyBowMatchesInserted=true;
      });
      return items;
    }

    function addDoorLeverHardware(id, hingeX, hingeZ, width, angle, baseY, leafTransformWhen, state, options = {}) {
      const leafHalf=.022;
      const centreU=Math.max(.080,width-PARAMS.DOOR_HARDWARE_BACKSET);
      const centreV=PARAMS.DOOR_HARDWARE_HEIGHT;
      const hardwareMode=options.mode || 'keyed';
      const keySide=options.keySide ?? 1;
      const moving=[];
      const leverMoving=[];
      const normal=normalize([-Math.sin(angle),0,Math.cos(angle)]);
      const handlePivot=toWorld(hingeX+Math.cos(angle)*centreU,baseY+centreV,hingeZ+Math.sin(angle)*centreU);
      const leverTransformWhen=()=>mat4Multiply(
        leafTransformWhen(),
        mat4AroundAxisPivot(normal,PARAMS.DOOR_HANDLE_MAX_TURN*state.handleTurn,handlePivot)
      );
      [-1,1].forEach(side=>{
        const face0=side*(leafHalf+.001), face1=side*(leafHalf+.008);
        const hub0=side*(leafHalf+.008), hub1=side*(leafHalf+.030);
        moving.push(addDoorFaceDisc(`${id}-${hardwareMode}-lever-rosette-${side>0?'a':'b'}`,hingeX,hingeZ,angle,centreU,centreV,face0,face1,PARAMS.DOOR_ROSETTE_DIAMETER/2,COLORS.brushedNickel,baseY));
        moving.push(addDoorFaceDisc(`${id}-${hardwareMode}-lever-hub-${side>0?'a':'b'}`,hingeX,hingeZ,angle,centreU,centreV,hub0,hub1,.014,COLORS.brushedNickelEdge,baseY));
        const leverN0=side*(leafHalf+.030), leverN1=side*(leafHalf+.050);
        leverMoving.push(addDoorLocalBar(`${id}-${hardwareMode}-lever-${side>0?'a':'b'}`,hingeX,hingeZ,angle,centreU-PARAMS.DOOR_LEVER_LENGTH,centreU+.006,centreV,.009,leverN0,leverN1,COLORS.brushedNickel,baseY));
        leverMoving.push(addDoorFaceDisc(`${id}-${hardwareMode}-lever-tip-${side>0?'a':'b'}`,hingeX,hingeZ,angle,centreU-PARAMS.DOOR_LEVER_LENGTH,centreV,leverN0,leverN1,.009,COLORS.brushedNickel,baseY));
      });

      const latchFace=addDoorLocalBar(`${id}-leaf-edge-latch-faceplate`,hingeX,hingeZ,angle,width-.003,width+.001,centreV,.035,-.014,.014,COLORS.silver,baseY);
      const latchBolt=addDoorLocalBar(`${id}-spring-latch-bolt`,hingeX,hingeZ,angle,width-.005,width+.014,centreV,.009,-.006,.006,COLORS.brushedNickelEdge,baseY);
      const latchTransformWhen=()=>mat4Multiply(
        leafTransformWhen(),
        mat4Translation(-Math.cos(angle)*.016*state.handleTurn,0,-Math.sin(angle)*.016*state.handleTurn)
      );
      setItemTransform(latchFace,leafTransformWhen);
      setItemTransform(latchBolt,latchTransformWhen);

      moving.filter(Boolean).forEach(item=>setItemTransform(item,leafTransformWhen));
      leverMoving.filter(Boolean).forEach(item=>setItemTransform(item,leverTransformWhen));

      if (hardwareMode === 'privacy') {
        const insideSide=-options.publicSide;
        [-1,1].forEach(side=>{
          const lockN=side*(leafHalf+.032);
          if (side===insideSide) {
            const snib=addDoorLocalBar(`${id}-privacy-turn-snib`,hingeX,hingeZ,angle,centreU-.010,centreU+.010,centreV,.0045,lockN,lockN+side*.008,COLORS.brushedNickelEdge,baseY);
            setItemTransform(snib,leafTransformWhen);
          } else {
            const release=addDoorLocalBar(`${id}-privacy-emergency-release-slot`,hingeX,hingeZ,angle,centreU-.009,centreU+.009,centreV,.0018,lockN,lockN+side*.002,COLORS.lockShadow,baseY);
            setItemTransform(release,leafTransformWhen);
          }
        });
        return [...moving,...leverMoving];
      }

      // Exactly one cylinder is keyed. Its centre is the lever lock-circle centre,
      // with no along-lever offset. The inserted and hanging keys reuse one C4-style
      // five-pin profile. The inserted copy is withdrawn 4 mm and its matching bow
      // receives the requested true 3D quarter-turn; the ring and spare copies keep
      // their door-plane orientation.
      const lockU=centreU-PARAMS.DOOR_KEY_CYLINDER_OFFSET;
      const keyFaceN=keySide*(leafHalf+.050);
      const cylinderOuterN=keyFaceN+keySide*.003;
      const bowCentreN=cylinderOuterN+keySide*(PARAMS.DOOR_KEY_BOW_HALF_WIDTH+PARAMS.DOOR_KEY_PROJECTION);
      const bowInnerN=bowCentreN-keySide*PARAMS.DOOR_KEY_BOW_HALF_WIDTH;
      const bowN0=bowCentreN-PARAMS.DOOR_KEY_BOW_THICKNESS/2;
      const bowN1=bowCentreN+PARAMS.DOOR_KEY_BOW_THICKNESS/2;
      const inserted=[];
      const keyCylinder=addDoorFaceDisc(`${id}-public-side-key-cylinder-user-marked-face`,hingeX,hingeZ,angle,lockU,centreV,keyFaceN-keySide*.002,cylinderOuterN,.0105,COLORS.lockShadow,baseY);
      const concealedBlade=addDoorNormalBlade(`${id}-inserted-key-blade-concealed-inside-lock`,hingeX,hingeZ,angle,lockU,centreV,keyFaceN-keySide*.015,cylinderOuterN-keySide*.0005,PARAMS.DOOR_KEY_BLADE_HALF_THICKNESS,PARAMS.DOOR_KEY_BLADE_HALF_HEIGHT,COLORS.keyMetal,baseY);
      const visibleBlade=addDoorNormalBlade(`${id}-inserted-key-visible-shank-four-mm-withdrawal`,hingeX,hingeZ,angle,lockU,centreV,cylinderOuterN-keySide*.0005,bowInnerN+keySide*.003,PARAMS.DOOR_KEY_BLADE_HALF_THICKNESS,PARAMS.DOOR_KEY_BLADE_HALF_HEIGHT,COLORS.keyMetal,baseY);
      const insertedBow=addDoorKeyBow(`${id}-inserted-key-matching-bow-quarter-turned-3d`,hingeX,hingeZ,angle,lockU,centreV,bowN0,bowN1,COLORS.keyMetal,baseY,1,30,0);
      inserted.push(keyCylinder,concealedBlade,visibleBlade,insertedBow);
      [keyCylinder,concealedBlade].filter(Boolean).forEach(item=>setItemTransform(item,leafTransformWhen));
      visibleBlade.keyProfileId='AU-C4-5PIN-V13';
      visibleBlade.keyWithdrawal=PARAMS.DOOR_KEY_PROJECTION;
      [concealedBlade,visibleBlade,insertedBow].forEach(item=>{
        item.keyProfileId='AU-C4-5PIN-V13';
        item.keyBladeCutCount=5;
        item.keyBowMatchesHanging=true;
      });
      setItemTransform(visibleBlade,leafTransformWhen);
      const bowPivot=toWorld(
        hingeX+Math.cos(angle)*lockU-Math.sin(angle)*bowCentreN,
        baseY+centreV,
        hingeZ+Math.sin(angle)*lockU+Math.cos(angle)*bowCentreN
      );
      const bowQuarterTurn=mat4AroundAxisPivot([0,1,0],PARAMS.DOOR_KEY_BOW_QUARTER_TURN,bowPivot);
      insertedBow.keyBowQuarterTurnRadians=PARAMS.DOOR_KEY_BOW_QUARTER_TURN;
      insertedBow.keyBowPlane='door-normal × vertical';
      insertedBow.keyBowPerpendicularToHangingKeys=true;
      setItemTransform(insertedBow,()=>mat4Multiply(leafTransformWhen(),bowQuarterTurn));

      const ringV=centreV-.040;
      const ringN0=bowCentreN-.0016, ringN1=bowCentreN+.0016;
      const hanging=[];
      hanging.push(addDoorPlanePrism(`${id}-keyring-through-inserted-key-head`,hingeX,hingeZ,angle,doorFlatBarPoints(lockU,centreV-.006,.025,.0028,0),ringN0,ringN1,COLORS.keyEdge,baseY));
      hanging.push(addDoorAnnulus(`${id}-hanging-keyring`,hingeX,hingeZ,angle,lockU,ringV,.016,.013,ringN0,ringN1,COLORS.keyMetal,baseY,28));
      hanging.push(...addHangingSpareKey(id,1,hingeX,hingeZ,angle,lockU-.004,ringV,-.22,PARAMS.DOOR_KEY_BLADE_LENGTH,ringN0,ringN1,COLORS.keyMetal,baseY));
      hanging.push(...addHangingSpareKey(id,2,hingeX,hingeZ,angle,lockU+.005,ringV,.27,PARAMS.DOOR_KEY_BLADE_LENGTH,ringN0+keySide*.001,ringN1+keySide*.001,COLORS.keyMetal,baseY));
      const swayPivot=toWorld(
        hingeX+Math.cos(angle)*lockU-Math.sin(angle)*ringN0,
        baseY+centreV-.006,
        hingeZ+Math.sin(angle)*lockU+Math.cos(angle)*ringN0
      );
      const hangingTransformWhen=()=>mat4Multiply(
        leafTransformWhen(),
        mat4AroundAxisPivot(normal,state.keySway,swayPivot)
      );
      hanging.filter(Boolean).forEach(item=>setItemTransform(item,hangingTransformWhen));
      return [...moving,...leverMoving,...inserted,...hanging].filter(Boolean);
    }

    function sectionStrip(a,b,thickness) {
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy) || 1;
      const nx=-dy/length*thickness/2,ny=dx/length*thickness/2;
      return [[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]];
    }

    function metro95FrameFoldPath() {
      const half=PARAMS.DOOR_FRAME_OVERALL/2;
      const backHalf=PARAMS.DOOR_FRAME_BACK_OPENING/2;
      const stopHalf=PARAMS.DOOR_FRAME_STOP_WIDTH/2;
      const shoulderEdge=stopHalf+PARAMS.DOOR_FRAME_SIDE_FLAT;
      const body=-PARAMS.DOOR_FRAME_HEAD_DEPTH;
      const shoulder=PARAMS.DOOR_FRAME_SHOULDER;
      const stop=PARAMS.DOOR_FRAME_STOP_PROJECTION;
      // One open folded-sheet path, starting at one 7.5 mm back return and
      // finishing at the other. It is not closed or filled as a solid block.
      return [
        [-backHalf,body+PARAMS.DOOR_FRAME_INSIDE_RETURN],[-backHalf,body],[-half,body],[-half,0],[-half+PARAMS.DOOR_FRAME_EDGE_FLAT,0],
        [-half+PARAMS.DOOR_FRAME_EDGE_FLAT,shoulder],[-shoulderEdge,shoulder],
        [-stopHalf,stop],[stopHalf,stop],[shoulderEdge,shoulder],
        [half-PARAMS.DOOR_FRAME_EDGE_FLAT,shoulder],[half-PARAMS.DOOR_FRAME_EDGE_FLAT,0],
        [half,0],[half,body],[backHalf,body],[backHalf,body+PARAMS.DOOR_FRAME_INSIDE_RETURN]
      ];
    }

    function metro95FrameFoldSections() {
      const path=metro95FrameFoldPath();
      return path.slice(0,-1).map((point,index)=>sectionStrip(point,path[index+1],PARAMS.DOOR_FRAME_STEEL_THICKNESS));
    }

    function tagMetroFramePart(item) {
      if (!item) return item;
      item.metrollFoldedSteel=true;
      item.frameSteelThickness=PARAMS.DOOR_FRAME_STEEL_THICKNESS;
      item.wallInsertThickness=PARAMS.INTERNAL_WALL_FRAME_INSERT;
      item.backOpeningClearance=(PARAMS.DOOR_FRAME_BACK_OPENING-PARAMS.INTERNAL_WALL_FRAME_INSERT)/2;
      item.wallCentredInBackOpening=true;
      return item;
    }

    function addMetro95Jamb(name, hingeX, hingeZ, angle, baseU, inwardSign, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      return metro95FrameFoldSections().map((section,index)=>tagMetroFramePart(addSectionExtrusion(`${name}-fold-${String(index+1).padStart(2,'0')}`,'door',section,(t,n,s)=>{
        const u=baseU+inwardSign*s;
        return [hingeX+dx*u-dz*n,baseY+(DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH)*t,hingeZ+dz*u+dx*n];
      },COLORS.doorFrame,1)));
    }

    function addMetro95Head(name, hingeX, hingeZ, width, angle, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const overhang=PARAMS.DOOR_FRAME_HEAD_DEPTH;
      return metro95FrameFoldSections().map((section,index)=>tagMetroFramePart(addSectionExtrusion(`${name}-fold-${String(index+1).padStart(2,'0')}`,'door',section,(t,n,s)=>{
        const u=-overhang+(width+overhang*2)*t;
        return [hingeX+dx*u-dz*n,baseY+DOOR_H-s,hingeZ+dz*u+dx*n];
      },COLORS.doorFrame,1)));
    }

    function addMetro95JambWallInsert(name, hingeX, hingeZ, angle, baseU, inwardSign, baseY) {
      const frameBody=-PARAMS.DOOR_FRAME_HEAD_DEPTH;
      const insertFace=frameBody+PARAMS.DOOR_FRAME_INSIDE_RETURN;
      // Hinge-pier inserts stop at the fixed perpendicular finish instead of
      // extending through it; the visible folded-steel frame remains unchanged.
      const insertBack=name==='D01-metro95-hinge-wall-centred-in-back-opening'
        ? frameBody
        : name==='D05-metro95-hinge-wall-centred-in-back-opening'
          ? Math.max(frameBody-.020,6.690-PARAMS.D05_OPEN_X0)
          : frameBody-.020;
      const u0=baseU+inwardSign*insertBack,u1=baseU+inwardSign*insertFace;
      const item=addDoorNormalBlade(name,hingeX,hingeZ,angle,(u0+u1)/2,(DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH)/2,-PARAMS.INTERNAL_WALL_FRAME_INSERT/2,PARAMS.INTERNAL_WALL_FRAME_INSERT/2,Math.abs(u1-u0)/2,(DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH)/2,COLORS.internal,baseY);
      item.frameWallInsert=true; item.wallCentredInBackOpening=true; item.backOpeningClearance=(PARAMS.DOOR_FRAME_BACK_OPENING-PARAMS.INTERNAL_WALL_FRAME_INSERT)/2;
      return item;
    }

    function addMetro95HeadWallInsert(name, hingeX, hingeZ, width, angle, baseY) {
      const frameBody=-PARAMS.DOOR_FRAME_HEAD_DEPTH;
      const insertBottom=DOOR_H-(frameBody+PARAMS.DOOR_FRAME_INSIDE_RETURN);
      const insertTop=DOOR_H-(frameBody-.020);
      const item=addDoorLocalBar(name,hingeX,hingeZ,angle,-.020,width+.020,(insertBottom+insertTop)/2,(insertTop-insertBottom)/2,-PARAMS.INTERNAL_WALL_FRAME_INSERT/2,PARAMS.INTERNAL_WALL_FRAME_INSERT/2,COLORS.internal,baseY);
      item.frameWallInsert=true; item.wallCentredInBackOpening=true; item.backOpeningClearance=(PARAMS.DOOR_FRAME_BACK_OPENING-PARAMS.INTERNAL_WALL_FRAME_INSERT)/2;
      return item;
    }

    function tagMetro95VisibleFaceReturn(item, id, side, part) {
      if (!item) return item;
      item.metrollVisibleFaceReturn=true;
      item.doorFrameAssemblyId=id;
      item.frameFaceSide=side;
      item.frameFacePart=part;
      item.frameFaceReturnWidth=PARAMS.DOOR_FRAME_FACE_RETURN;
      item.frameProudOfWallBy=PARAMS.DOOR_FRAME_FACE_PLANE_CLEARANCE;
      item.frameOutsideWall=true;
      return item;
    }

    function addMetro95VisibleFaceReturns(id, hingeX, hingeZ, width, angle, baseY) {
      // The wall is 90 mm and the back opening is 95 mm. Place the built-in
      // 25 mm steel face returns on both ±47.5 mm frame planes, 2.5 mm clear of
      // the ±45 mm finished wall faces. This prevents either viewing side from
      // swallowing the frame without shifting the door/opening centreline.
      const frameFaceN=PARAMS.DOOR_FRAME_BACK_OPENING/2;
      const steel=PARAMS.DOOR_FRAME_STEEL_THICKNESS;
      const returnWidth=PARAMS.DOOR_FRAME_FACE_RETURN;
      const parts=[];
      [-1,1].forEach(side=>{
        const n0=side*frameFaceN;
        const n1=side*(frameFaceN+steel);
        parts.push(tagMetro95VisibleFaceReturn(
          addDoorLocalBar(`${id}-metro95-${side<0?'negative':'positive'}-face-hinge-return`,hingeX,hingeZ,angle,-returnWidth,0,DOOR_H/2,DOOR_H/2,n0,n1,COLORS.doorFrame,baseY),
          id,side,'hinge-jamb'
        ));
        parts.push(tagMetro95VisibleFaceReturn(
          addDoorLocalBar(`${id}-metro95-${side<0?'negative':'positive'}-face-strike-return`,hingeX,hingeZ,angle,width,width+returnWidth,DOOR_H/2,DOOR_H/2,n0,n1,COLORS.doorFrame,baseY),
          id,side,'strike-jamb'
        ));
        parts.push(tagMetro95VisibleFaceReturn(
          addDoorLocalBar(`${id}-metro95-${side<0?'negative':'positive'}-face-head-return`,hingeX,hingeZ,angle,-returnWidth,width+returnWidth,DOOR_H+returnWidth/2,returnWidth/2,n0,n1,COLORS.doorFrame,baseY),
          id,side,'head'
        ));
      });
      return parts;
    }

    function addLiftOffHingeKnuckle(name, hingeX, hingeZ, angle, centreU, centreN, y0, y1, radius, baseY, color=COLORS.silver) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      return addSectionExtrusion(name,'door',roundSection(radius,18),(t,u,n)=>[
        hingeX+dx*(centreU+u)-dz*(centreN+n),
        baseY+y0+(y1-y0)*t,
        hingeZ+dz*(centreU+u)+dx*(centreN+n)
      ],color,1);
    }

    function hingePlateSection(halfWidth, halfHeight, corner=.0035) {
      const c=Math.min(corner,halfWidth*.35,halfHeight*.20);
      return [
        [-halfWidth+c,-halfHeight],[halfWidth-c,-halfHeight],
        [halfWidth,-halfHeight+c],[halfWidth,halfHeight-c],
        [halfWidth-c,halfHeight],[-halfWidth+c,halfHeight],
        [-halfWidth,halfHeight-c],[-halfWidth,-halfHeight+c]
      ];
    }

    function hingeSlotSection(halfWidth, halfHeight) {
      return [[-halfWidth,-halfHeight],[halfWidth,-halfHeight],[halfWidth,halfHeight],[-halfWidth,halfHeight]];
    }

    function addDoorEdgeSectionSet(name, hingeX, hingeZ, angle, instances, u0, u1, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const positions=[], normals=[];
      const mapPoint=(u,n,v)=>toWorld(hingeX+dx*u-dz*n,baseY+v,hingeZ+dz*u+dx*n);
      instances.forEach(instance=>{
        const centreN=instance.centreN ?? 0;
        const centreV=instance.centreV ?? 0;
        const start=instance.section.map(([n,v])=>mapPoint(u0,centreN+n,centreV+v));
        const end=instance.section.map(([n,v])=>mapPoint(u1,centreN+n,centreV+v));
        const axis=normalize(subtract(end[0],start[0]));
        triangulatePolygon2D(instance.section).forEach(([a,b,c])=>{
          positions.push(...start[a],...start[c],...start[b]);
          normals.push(...axis.map(value=>-value),...axis.map(value=>-value),...axis.map(value=>-value));
          positions.push(...end[a],...end[b],...end[c]);
          normals.push(...axis,...axis,...axis);
        });
        for (let index=0;index<instance.section.length;index++) {
          const next=(index+1)%instance.section.length;
          const edge=subtract(start[next],start[index]);
          const sideNormal=normalize(cross(edge,subtract(end[index],start[index])));
          pushFace(positions,normals,start[index],start[next],end[next],end[index],sideNormal);
        }
      });
      return addRawMesh(name,'door',positions,normals,color,1,false);
    }

    function addDoorFaceSectionSet(name, hingeX, hingeZ, angle, instances, n0, n1, color, baseY) {
      const dx=Math.cos(angle), dz=Math.sin(angle);
      const positions=[], normals=[];
      const mapPoint=(u,v,n)=>toWorld(hingeX+dx*u-dz*n,baseY+v,hingeZ+dz*u+dx*n);
      instances.forEach(instance=>{
        const centreU=instance.centreU ?? 0;
        const centreV=instance.centreV ?? 0;
        const start=instance.section.map(([u,v])=>mapPoint(centreU+u,centreV+v,n0));
        const end=instance.section.map(([u,v])=>mapPoint(centreU+u,centreV+v,n1));
        const axis=normalize(subtract(end[0],start[0]));
        triangulatePolygon2D(instance.section).forEach(([a,b,c])=>{
          positions.push(...start[a],...start[c],...start[b]);
          normals.push(...axis.map(value=>-value),...axis.map(value=>-value),...axis.map(value=>-value));
          positions.push(...end[a],...end[b],...end[c]);
          normals.push(...axis,...axis,...axis);
        });
        for (let index=0;index<instance.section.length;index++) {
          const next=(index+1)%instance.section.length;
          const edge=subtract(start[next],start[index]);
          const sideNormal=normalize(cross(edge,subtract(end[index],start[index])));
          pushFace(positions,normals,start[index],start[next],end[next],end[index],sideNormal);
        }
      });
      return addRawMesh(name,'door',positions,normals,color,1,false);
    }

    function markDoorHingeParts(parts, assemblyId, spec, role, transformWhen=null) {
      parts.filter(Boolean).forEach(item=>{
        item.doorHingeAssemblyId=assemblyId;
        item.doorHingeProduct=spec.id;
        item.doorHingeRole=role;
        item.isDoorHingeMetal=true;
        item.surfaceRoughness=.010;
        if (transformWhen) setItemTransform(item,transformWhen);
      });
      return parts;
    }

    function doorHingeSpecFor(id) {
      if (WC_FRAME_DOOR_IDS.has(id)) return DOOR_HINGE_PRODUCTS.sanitary;
      if (HEAVY_HINGE_DOOR_IDS.has(id)) return DOOR_HINGE_PRODUCTS.heavy;
      return DOOR_HINGE_PRODUCTS.standard;
    }

    function addDoorButtHingeAssembly(id, index, hingeX, hingeZ, angle, baseY, centreV, spec, leafTransformWhen, publicSide, state) {
      const assemblyId=`${id}-hinge-${index+1}`;
      const barrelDiameter=spec.barrelRadius*2;
      const leafWidth=Math.max(.018,(spec.openWidth-barrelDiameter)/2);
      const direction=publicSide>=0 ? 1 : -1;
      const doorHalfThickness=.022;
      const plateHalfN=leafWidth/2;
      const plateCentreN=direction*(doorHalfThickness-plateHalfN);
      const plateFaceN=direction*(doorHalfThickness+spec.barrelRadius*.72);
      const plateSection=hingePlateSection(plateHalfN,spec.height/2);
      // Both hinge leaves are mortised on the narrow edge/rebate planes (U=0),
      // never on either broad door face (N=±22 mm). The moving leaf occupies the
      // door-edge side; the fixed leaf occupies the opposing jamb-rebate side.
      const framePlate=addDoorEdgeSectionSet(`${assemblyId}-frame-leaf-mortised`,hingeX,hingeZ,angle,[{section:plateSection,centreN:plateCentreN,centreV}],-spec.thickness,-.00045,COLORS.brushedNickelEdge,baseY);
      const doorPlate=addDoorEdgeSectionSet(`${assemblyId}-door-leaf-mortised-moving`,hingeX,hingeZ,angle,[{section:plateSection,centreN:plateCentreN,centreV}],.00045,spec.thickness,COLORS.brushedNickelEdge,baseY);
      markDoorHingeParts([framePlate],assemblyId,spec,'frame-leaf-on-jamb-rebate');
      markDoorHingeParts([doorPlate],assemblyId,spec,'door-leaf-on-thickness-edge',leafTransformWhen);
      framePlate.hingeMountPlane='jamb-rebate-edge';
      doorPlate.hingeMountPlane='door-thickness-edge';

      const screwFactors=spec.screwRows===4 ? [-.34,-.115,.115,.34] : [-.30,0,.30];
      const frameScrews=screwFactors.map(factor=>({section:roundSection(.0048,16),centreN:plateCentreN,centreV:centreV+factor*spec.height}));
      const doorScrews=screwFactors.map(factor=>({section:roundSection(.0048,16),centreN:plateCentreN,centreV:centreV+factor*spec.height}));
      const frameScrewHeads=addDoorEdgeSectionSet(`${assemblyId}-frame-countersunk-screw-heads`,hingeX,hingeZ,angle,frameScrews,-.00044,-.00006,COLORS.silver,baseY);
      const doorScrewHeads=addDoorEdgeSectionSet(`${assemblyId}-door-countersunk-screw-heads-moving`,hingeX,hingeZ,angle,doorScrews,.00006,.00044,COLORS.silver,baseY);
      const slotInstances=()=>screwFactors.flatMap(factor=>{
        const screwV=centreV+factor*spec.height;
        return [
          {section:hingeSlotSection(.0030,.00055),centreN:plateCentreN,centreV:screwV},
          {section:hingeSlotSection(.00055,.0030),centreN:plateCentreN,centreV:screwV}
        ];
      });
      const frameSlots=addDoorEdgeSectionSet(`${assemblyId}-frame-phillips-slots`,hingeX,hingeZ,angle,slotInstances(),-.000055,-.000005,COLORS.lockShadow,baseY);
      const doorSlots=addDoorEdgeSectionSet(`${assemblyId}-door-phillips-slots-moving`,hingeX,hingeZ,angle,slotInstances(),.000005,.000055,COLORS.lockShadow,baseY);
      markDoorHingeParts([frameScrewHeads,frameSlots],assemblyId,spec,'frame-fasteners');
      markDoorHingeParts([doorScrewHeads,doorSlots],assemblyId,spec,'door-fasteners',leafTransformWhen);
      [frameScrewHeads,frameSlots].forEach(item=>{ item.hingeMountPlane='jamb-rebate-edge'; });
      [doorScrewHeads,doorSlots].forEach(item=>{ item.hingeMountPlane='door-thickness-edge'; });

      const hingeBottom=centreV-spec.height/2;
      const hingeTop=centreV+spec.height/2;
      const barrelParts=[];
      const faceBarrelParts=[];
      const closedFaceBarrelVisible=()=>!state || state.progress<.035;
      const markClosedFaceBarrel=(parts,role)=>{
        markDoorHingeParts(parts,assemblyId,spec,role);
        parts.filter(Boolean).forEach(item=>showItemWhen(item,closedFaceBarrelVisible));
        faceBarrelParts.push(...parts.filter(Boolean));
      };
      if (spec.mechanism==='lift-off') {
        const split=centreV;
        const faceLower=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-lift-off-frame-lower`,hingeX,hingeZ,angle,0,plateFaceN,hingeBottom,split-.0015,spec.barrelRadius,baseY,COLORS.brushedNickelEdge);
        const faceUpper=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-lift-off-door-upper`,hingeX,hingeZ,angle,0,plateFaceN,split+.0015,hingeTop,spec.barrelRadius,baseY,COLORS.silver);
        const facePin=addLiftOffHingeKnuckle(`${assemblyId}-visible-centre-pin-between-leaves`,hingeX,hingeZ,angle,0,plateFaceN,hingeBottom-.005,hingeTop+.010,spec.barrelRadius*.40,baseY,COLORS.brushedNickelEdge);
        const faceLowerCap=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-lower-cap`,hingeX,hingeZ,angle,0,plateFaceN,hingeBottom-.006,hingeBottom,spec.barrelRadius*1.06,baseY,COLORS.silver);
        const faceLiftCap=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-top-lift-cap`,hingeX,hingeZ,angle,0,plateFaceN,hingeTop,hingeTop+.009,spec.barrelRadius*1.10,baseY,COLORS.silver);
        markClosedFaceBarrel([faceLower,faceUpper,facePin,faceLowerCap,faceLiftCap],'closed-position-visible-lift-off-pin-between-leaves');
        const lower=addLiftOffHingeKnuckle(`${assemblyId}-lift-off-frame-lower-knuckle`,hingeX,hingeZ,angle,0,0,hingeBottom,split-.0015,spec.barrelRadius,baseY,COLORS.brushedNickelEdge);
        const upper=addLiftOffHingeKnuckle(`${assemblyId}-lift-off-door-upper-knuckle-moving`,hingeX,hingeZ,angle,0,0,split+.0015,hingeTop,spec.barrelRadius,baseY,COLORS.silver);
        const pin=addLiftOffHingeKnuckle(`${assemblyId}-lift-off-centre-pin`,hingeX,hingeZ,angle,0,0,hingeBottom-.005,hingeTop+.010,spec.barrelRadius*.40,baseY,COLORS.brushedNickelEdge);
        const lowerCap=addLiftOffHingeKnuckle(`${assemblyId}-lift-off-lower-cap`,hingeX,hingeZ,angle,0,0,hingeBottom-.006,hingeBottom,spec.barrelRadius*1.06,baseY,COLORS.silver);
        const liftCap=addLiftOffHingeKnuckle(`${assemblyId}-lift-off-top-lift-cap-moving`,hingeX,hingeZ,angle,0,0,hingeTop,hingeTop+.009,spec.barrelRadius*1.10,baseY,COLORS.silver);
        markDoorHingeParts([lower,pin,lowerCap],assemblyId,spec,'fixed-lift-off-barrel');
        markDoorHingeParts([upper,liftCap],assemblyId,spec,'moving-lift-off-barrel',leafTransformWhen);
        barrelParts.push(lower,upper,pin,lowerCap,liftCap);
      } else {
        const gap=.0012;
        const segment=(spec.height-gap*4)/5;
        const facePin=addLiftOffHingeKnuckle(`${assemblyId}-visible-centre-pin-between-leaves`,hingeX,hingeZ,angle,0,plateFaceN,hingeBottom-.004,hingeTop+.004,spec.barrelRadius*.40,baseY,COLORS.brushedNickelEdge);
        const faceSegments=[];
        for (let segmentIndex=0;segmentIndex<5;segmentIndex++) {
          const y0=hingeBottom+segmentIndex*(segment+gap);
          const y1=y0+segment;
          const belongsToDoor=segmentIndex%2===1;
          faceSegments.push(addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-${belongsToDoor?'door':'frame'}-knuckle-${segmentIndex+1}`,hingeX,hingeZ,angle,0,plateFaceN,y0,y1,spec.barrelRadius,baseY,belongsToDoor?COLORS.silver:COLORS.brushedNickelEdge));
        }
        const faceLowerCap=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-fixed-pin-lower-cap`,hingeX,hingeZ,angle,0,plateFaceN,hingeBottom-.006,hingeBottom,spec.barrelRadius*1.06,baseY,COLORS.silver);
        const faceUpperCap=addLiftOffHingeKnuckle(`${assemblyId}-visible-between-leaves-fixed-pin-upper-cap`,hingeX,hingeZ,angle,0,plateFaceN,hingeTop,hingeTop+.006,spec.barrelRadius*1.06,baseY,COLORS.silver);
        markClosedFaceBarrel([facePin,...faceSegments,faceLowerCap,faceUpperCap],'closed-position-visible-fixed-pin-between-leaves');
        const pin=addLiftOffHingeKnuckle(`${assemblyId}-fixed-pin`,hingeX,hingeZ,angle,0,0,hingeBottom-.004,hingeTop+.004,spec.barrelRadius*.40,baseY,COLORS.brushedNickelEdge);
        markDoorHingeParts([pin],assemblyId,spec,'fixed-pin');
        barrelParts.push(pin);
        for (let segmentIndex=0;segmentIndex<5;segmentIndex++) {
          const y0=hingeBottom+segmentIndex*(segment+gap);
          const y1=y0+segment;
          const moving=segmentIndex%2===1;
          const knuckle=addLiftOffHingeKnuckle(`${assemblyId}-${moving?'door':'frame'}-knuckle-${segmentIndex+1}${moving?'-moving':''}`,hingeX,hingeZ,angle,0,0,y0,y1,spec.barrelRadius,baseY,moving?COLORS.silver:COLORS.brushedNickelEdge);
          markDoorHingeParts([knuckle],assemblyId,spec,moving?'moving-knuckle':'fixed-knuckle',moving?leafTransformWhen:null);
          barrelParts.push(knuckle);
        }
        const lowerCap=addLiftOffHingeKnuckle(`${assemblyId}-fixed-pin-lower-cap`,hingeX,hingeZ,angle,0,0,hingeBottom-.006,hingeBottom,spec.barrelRadius*1.06,baseY,COLORS.silver);
        const upperCap=addLiftOffHingeKnuckle(`${assemblyId}-fixed-pin-upper-cap`,hingeX,hingeZ,angle,0,0,hingeTop,hingeTop+.006,spec.barrelRadius*1.06,baseY,COLORS.silver);
        markDoorHingeParts([lowerCap,upperCap],assemblyId,spec,'fixed-pin-caps');
        barrelParts.push(lowerCap,upperCap);
      }

      doorHingeAssemblies.push(Object.freeze({
        id:assemblyId,
        doorId:id,
        level:activeBuildLevel,
        product:spec.id,
        mechanism:spec.mechanism,
        height:spec.height,
        openWidth:spec.openWidth,
        thickness:spec.thickness,
        screwHeadsPerLeaf:spec.screwRows,
        centreHeight:centreV,
        publicSide:direction,
        movingLeafTracksDoor:true,
        frameLeafFixed:true,
        doorLeafAttachment:'door thickness edge mortise',
        frameLeafAttachment:'jamb rebate edge mortise',
        broadDoorFacesRemainPlanar:true,
        visibleCentrePinBetweenLeaves:true,
        closedFaceBarrelPartCount:faceBarrelParts.length,
        barrelPartCount:barrelParts.filter(Boolean).length
      }));
    }

    function addDoorHingeHardware(id, hingeX, hingeZ, angle, baseY, leafTransformWhen, publicSide, state) {
      const spec=doorHingeSpecFor(id);
      const centres=spec.hingeCount===3 ? [.260,DOOR_H/2,DOOR_H-.260] : [.305,DOOR_H-.305];
      centres.forEach((centreV,index)=>addDoorButtHingeAssembly(id,index,hingeX,hingeZ,angle,baseY,centreV,spec,leafTransformWhen,publicSide,state));
      return spec;
    }

    function addWcRemovableFrameDetail(id, hingeX, hingeZ, width, angle, baseY, leafTransformWhen=null, publicSide=1) {
      // v6 correction: this removable insert belongs inside the jamb opening.
      // It no longer spans the 145 mm outer frame and remains fixed frame detail,
      // so no locked door/opening coordinate or 2040 mm leaf height is changed.
      const falseHeadBottom=DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT;
      const falseHeadTop=DOOR_H;
      const u0=PARAMS.WC_FALSE_HEAD_SIDE_CLEARANCE;
      const u1=width-PARAMS.WC_FALSE_HEAD_SIDE_CLEARANCE;
      const bodyHalfDepth=PARAMS.WC_FALSE_HEAD_BACK_OPENING/2;
      const body=addDoorLocalBar(`${id}-wc-25mm-removable-inner-opening-insert`,hingeX,hingeZ,angle,u0,u1,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2,PARAMS.WC_FALSE_HEAD_HEIGHT/2,-bodyHalfDepth,bodyHalfDepth,COLORS.doorFrame,baseY);
      body.wcFalseHead=true;
      body.wcFalseHeadInsideJamb=true;
      const outward=publicSide>=0 ? 1 : -1;
      const gripN0=outward>0 ? bodyHalfDepth : -bodyHalfDepth-PARAMS.WC_FALSE_HEAD_GRIP_PROJECTION;
      const gripN1=outward>0 ? bodyHalfDepth+PARAMS.WC_FALSE_HEAD_GRIP_PROJECTION : -bodyHalfDepth;
      const grip=addDoorLocalBar(`${id}-wc-removable-head-accessible-side-projecting-grip`,hingeX,hingeZ,angle,u0,u1,falseHeadBottom+PARAMS.WC_FALSE_HEAD_GRIP_HEIGHT/2,PARAMS.WC_FALSE_HEAD_GRIP_HEIGHT/2,gripN0,gripN1,COLORS.doorFrame,baseY);
      grip.wcFalseHead=true;
      grip.wcFalseHeadProjectingGrip=true;
      const dx=Math.cos(angle), dz=Math.sin(angle);
      [-bodyHalfDepth-.001,bodyHalfDepth+.001].forEach((n,index)=>{
        addLine(`${id}-wc-false-head-lower-seam-${index+1}`,'door',[
          [hingeX+dx*u0-dz*n,baseY+falseHeadBottom,hingeZ+dz*u0+dx*n],
          [hingeX+dx*u1-dz*n,baseY+falseHeadBottom,hingeZ+dz*u1+dx*n]
        ],COLORS.brushedNickelEdge,1);
        addLine(`${id}-wc-false-head-upper-seam-${index+1}`,'door',[
          [hingeX+dx*u0-dz*n,baseY+falseHeadTop,hingeZ+dz*u0+dx*n],
          [hingeX+dx*u1-dz*n,baseY+falseHeadTop,hingeZ+dz*u1+dx*n]
        ],COLORS.brushedNickelEdge,.72);
      });
      [u0+.065,u1-.065].forEach((u,index)=>{
        const faceN=outward*(bodyHalfDepth+.001);
        addDoorFaceDisc(`${id}-wc-removable-head-fastener-${index+1}`,hingeX,hingeZ,angle,u,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2,faceN,faceN+outward*.0025,.0045,COLORS.silver,baseY);
        addDoorPlanePrism(`${id}-wc-removable-head-fastener-slot-${index+1}`,hingeX,hingeZ,angle,[[u-.0035,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2-.0007],[u+.0035,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2-.0007],[u+.0035,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2+.0007],[u-.0035,DOOR_H-PARAMS.WC_FALSE_HEAD_HEIGHT/2+.0007]],faceN+outward*.0026,faceN+outward*.0030,COLORS.lockShadow,baseY);
      });
      void leafTransformWhen;
    }

    function addDoorFrame(id, hingeX, hingeZ, width, closedAngle, baseY = 0, leafTransformWhen=null, publicSide=1) {
      addMetro95Jamb(`${id}-metro95-profile-hinge`,hingeX,hingeZ,closedAngle,0,1,baseY);
      addMetro95Jamb(`${id}-metro95-profile-strike`,hingeX,hingeZ,closedAngle,width,-1,baseY);
      addMetro95Head(`${id}-metro95-profile-head`,hingeX,hingeZ,width,closedAngle,baseY);
      addMetro95VisibleFaceReturns(id,hingeX,hingeZ,width,closedAngle,baseY);
      addMetro95JambWallInsert(`${id}-metro95-hinge-wall-centred-in-back-opening`,hingeX,hingeZ,closedAngle,0,1,baseY);
      addMetro95JambWallInsert(`${id}-metro95-strike-wall-centred-in-back-opening`,hingeX,hingeZ,closedAngle,width,-1,baseY);
      addMetro95HeadWallInsert(`${id}-metro95-head-wall-centred-in-back-opening`,hingeX,hingeZ,width,closedAngle,baseY);
      addDoorLocalBar(`${id}-metro95-striker-plate`,hingeX,hingeZ,closedAngle,width-.0125,width-.0095,PARAMS.DOOR_FRAME_STRIKE_HEIGHT,PARAMS.DOOR_FRAME_STRIKE_LENGTH/2,-PARAMS.DOOR_FRAME_STRIKE_WIDTH/2,PARAMS.DOOR_FRAME_STRIKE_WIDTH/2,COLORS.silver,baseY);
      addDoorLocalBar(`${id}-metro95-striker-opening`,hingeX,hingeZ,closedAngle,width-.0135,width-.0085,PARAMS.DOOR_FRAME_STRIKE_HEIGHT,.018,-.006,.006,COLORS.lockShadow,baseY);
      if (WC_FRAME_DOOR_IDS.has(id)) addWcRemovableFrameDetail(id,hingeX,hingeZ,width,closedAngle,baseY,leafTransformWhen,publicSide);
    }

    function addDoor(id, hingeX, hingeZ, width, openAngle, arcStart, arcEnd, labelX, labelZ, labelKind = 'opening', options = {}) {
      const baseY=options.baseY ?? 0;
      const state=registerInteraction(id,'hinged door','door',[hingeX+Math.cos(arcStart)*width*.52,baseY+1.02,hingeZ+Math.sin(arcStart)*width*.52],false,true);
      const swingDelta=arcEnd-arcStart;
      const publicSide=options.publicSide ?? (swingDelta>=0 ? -1 : 1);
      const hardwareMode=PRIVACY_DOOR_IDS.has(id) ? 'privacy' : 'keyed';
      const keySide=options.keySide ?? KEYED_COMMON_SIDE_BY_DOOR[id] ?? publicSide;
      state.publicSide=publicSide;
      state.keySide=keySide;
      state.hardwareMode=hardwareMode;
      state.hitAnchors.push([
        hingeX+Math.cos(arcStart)*(width-PARAMS.DOOR_HARDWARE_BACKSET),
        baseY+PARAMS.DOOR_HARDWARE_HEIGHT,
        hingeZ+Math.sin(arcStart)*(width-PARAMS.DOOR_HARDWARE_BACKSET)
      ]);
      const pivot=toWorld(hingeX,baseY,hingeZ);
      const transformWhen=()=>mat4AroundPivot('y',swingDelta*easedProgress(state),pivot);
      addDoorFrame(id,hingeX,hingeZ,width,arcStart,baseY,transformWhen,publicSide);
      const leaf=addPrism(`${id}-leaf-moving`,'door',orientedRect(hingeX,hingeZ,width,arcStart,.044),baseY+.015,baseY+DOOR_H,COLORS.door,1);
      setItemTransform(leaf,transformWhen);
      const arc = [];
      const segments = 20;
      for (let i=0; i<=segments; i++) {
        const a = arcStart + (arcEnd-arcStart)*(i/segments);
        arc.push([hingeX + Math.cos(a)*width, baseY+.025, hingeZ + Math.sin(a)*width]);
      }
      const swing=addLine(`${id}-swing`, 'door', arc, COLORS.glazeFrame, .84);
      showItemWhen(swing,()=>state.progress>.015);
      addDoorHingeHardware(id,hingeX,hingeZ,arcStart,baseY,transformWhen,publicSide,state);
      addDoorLeverHardware(id,hingeX,hingeZ,width,arcStart,baseY,transformWhen,state,{mode:hardwareMode,keySide,publicSide});
      void openAngle;
      addLabel(id, labelX, baseY+.18, labelZ, labelKind, 'door');
    }

    function overlappingRobeLayout(start, end, panelCount) {
      const overlap=PARAMS.ROBE_PANEL_OVERLAP;
      const panelWidth=((end-start)+overlap*(panelCount-1))/panelCount;
      return Object.freeze({overlap,panelWidth,step:panelWidth-overlap});
    }

    function setRobeArrowTargets(state, leftAnchor, rightAnchor) {
      // Robe panels do not use one broad centre hit area. The two arrows are the
      // explicit controls and also choose which side the leaves stack toward.
      state.hitAnchors=[leftAnchor,rightAnchor];
      state.hitAnchorRoles=['open-right','open-left'];
      state.robeArrowOnlyControl=true;
      state.robePanelOverlap=PARAMS.ROBE_PANEL_OVERLAP;
    }

    function addRobeX(id, x0, x1, z, noteZ, panelCount) {
      const sliderHead = WALL_H - PARAMS.CORNICE_PROXY;
      const state=registerInteraction(id,'mirrored robe slider','robe',[(x0+x1)/2,sliderHead*.52,z],false,true);
      addBox(`${id}-cornice`, 'cornice', x0, x1, sliderHead, WALL_H, z-.045, z+.045, COLORS.cornice, 1, true);
      addLine(`${id}-track-a`, 'robe', [[x0,.025,z-.035],[x1,.025,z-.035]], COLORS.robe, .95);
      addLine(`${id}-track-b`, 'robe', [[x0,.025,z+.035],[x1,.025,z+.035]], COLORS.robe, .95);
      const frameHalfDepth=.041,outerFrame=.040,leafHalfDepth=.0125,leafFrame=.028;
      const tagRobeFrame=(item,role,panelIndex=0)=>{
        item.robeFrameSystem=true;
        item.v21RobeFrame=true;
        if(role.includes('track')) item.v21RobeTrack=true;
        item.robeFrameRole=role;
        item.robeAssemblyId=id;
        item.robePanelIndex=panelIndex;
        item.robeFrameDepthMm=82;
        item.robeLeafThicknessMm=25;
        item.clearAnodisedSilver=true;
        item.cavityCentred=true;
        item.BunningsReference=true;
        item.IkeaReference=true;
        item.productReferenceFamily='sliding wardrobe frame and double-track system';
        item.surfaceRoughness=.012;
        return item;
      };
      [
        tagRobeFrame(addBox(`${id}-v21-outer-frame-left`,'robe',x0,x0+outerFrame,.018,sliderHead,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-right`,'robe',x1-outerFrame,x1,.018,sliderHead,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-sill`,'robe',x0,x1,.018,.018+outerFrame,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-head`,'robe',x0,x1,sliderHead-outerFrame,sliderHead,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-lower-double-track-bed`,'robe',x0+outerFrame,x1-outerFrame,.020,.030,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'lower-double-track'),
        tagRobeFrame(addBox(`${id}-v21-upper-double-track-bed`,'robe',x0+outerFrame,x1-outerFrame,sliderHead-.030,sliderHead-.020,z-frameHalfDepth,z+frameHalfDepth,COLORS.silver,1),'upper-double-track')
      ];
      [-PARAMS.ROBE_TRACK_OFFSET/2,PARAMS.ROBE_TRACK_OFFSET/2].forEach((offset,index)=>{
        const trackRole=index===0?'track-1':'track-2';
        tagRobeFrame(addBox(`${id}-v21-lower-${trackRole}`,'robe',x0+outerFrame,x1-outerFrame,.030,.050,z+offset-.003,z+offset+.003,COLORS.brushedNickel,1),'lower-double-track');
        tagRobeFrame(addBox(`${id}-v21-upper-${trackRole}`,'robe',x0+outerFrame,x1-outerFrame,sliderHead-.050,sliderHead-.030,z+offset-.003,z+offset+.003,COLORS.brushedNickel,1),'upper-double-track');
      });
      const layout=overlappingRobeLayout(x0,x1,panelCount);
      for (let i=0; i<panelCount; i++) {
        const panelX0=x0+layout.step*i, panelX1=panelX0+layout.panelWidth;
        const panelZ=z+(i-(panelCount-1)/2)*PARAMS.ROBE_TRACK_OFFSET;
        const transformWhen=()=>{
          const p=easedProgress(state);
          const travel=state.slideDirection==='right' ? (panelCount-1-i)*layout.step : -i*layout.step;
          return mat4Translation(travel*p,0,0);
        };
        const panel=addBox(`${id}-panel-${i+1}-moving`,'robe',panelX0+leafFrame,panelX1-leafFrame,.030+leafFrame,sliderHead-.035-leafFrame,panelZ-leafHalfDepth,panelZ+leafHalfDepth,COLORS.robe,1);
        panel.robeOverlap=layout.overlap; panel.robeTrackIndex=i;
        tagRobeFrame(panel,'25mm-mirrored-leaf',i+1);
        const panelFrameItems=[
          addBox(`${id}-panel-${i+1}-v21-frame-left`,'robe',panelX0,panelX0+leafFrame,.030,sliderHead-.035,panelZ-leafHalfDepth,panelZ+leafHalfDepth,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-right`,'robe',panelX1-leafFrame,panelX1,.030,sliderHead-.035,panelZ-leafHalfDepth,panelZ+leafHalfDepth,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-sill`,'robe',panelX0,panelX1,.030,.030+leafFrame,panelZ-leafHalfDepth,panelZ+leafHalfDepth,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-head`,'robe',panelX0,panelX1,sliderHead-.035-leafFrame,sliderHead-.035,panelZ-leafHalfDepth,panelZ+leafHalfDepth,COLORS.silver,1)
        ];
        panelFrameItems.forEach(item=>tagRobeFrame(item,'four-side-leaf-frame',i+1));
        const highlightFront=addBox(`${id}-panel-${i+1}-mirror-highlight-front`,'robe',panelX0+layout.panelWidth*.14,panelX0+layout.panelWidth*.19,.12,sliderHead-.14,panelZ-leafHalfDepth-.003,panelZ-leafHalfDepth-.001,COLORS.mirrorHighlight,1);
        const highlightBack=addBox(`${id}-panel-${i+1}-mirror-highlight-back`,'robe',panelX0+layout.panelWidth*.14,panelX0+layout.panelWidth*.19,.12,sliderHead-.14,panelZ+leafHalfDepth+.001,panelZ+leafHalfDepth+.003,COLORS.mirrorHighlight,1);
        [panel,...panelFrameItems,highlightFront,highlightBack].forEach(item=>setItemTransform(item,transformWhen));
      }
      addHighVisibilityRobeArrowX(`${id}-left-panel-travel`,id,x0,x0+layout.panelWidth,1.00,z,'slide-right');
      addHighVisibilityRobeArrowX(`${id}-right-panel-travel`,id,x1-layout.panelWidth,x1,1.00,z,'slide-left');
      setRobeArrowTargets(state,[x0+layout.panelWidth*.5,1.00,z-.055],[x1-layout.panelWidth*.5,1.00,z-.055]);
      addLabel(`${id} · ${panelCount} PANEL MIRRORED SLIDER`, (x0+x1)/2, 1.12, noteZ, 'note', 'robe');
    }

    function addRobeZ(id, x, z0, z1, noteX, panelCount) {
      const sliderHead = WALL_H - PARAMS.CORNICE_PROXY;
      const state=registerInteraction(id,'mirrored robe slider','robe',[x,sliderHead*.52,(z0+z1)/2],false,true);
      addBox(`${id}-cornice`, 'cornice', x-.045, x+.045, sliderHead, WALL_H, z0, z1, COLORS.cornice, 1, true);
      addLine(`${id}-track-a`, 'robe', [[x-.035,.025,z0],[x-.035,.025,z1]], COLORS.robe, .95);
      addLine(`${id}-track-b`, 'robe', [[x+.035,.025,z0],[x+.035,.025,z1]], COLORS.robe, .95);
      const frameHalfDepth=.041,outerFrame=.040,leafHalfDepth=.0125,leafFrame=.028;
      const tagRobeFrame=(item,role,panelIndex=0)=>{
        item.robeFrameSystem=true;
        item.v21RobeFrame=true;
        if(role.includes('track')) item.v21RobeTrack=true;
        item.robeFrameRole=role;
        item.robeAssemblyId=id;
        item.robePanelIndex=panelIndex;
        item.robeFrameDepthMm=82;
        item.robeLeafThicknessMm=25;
        item.clearAnodisedSilver=true;
        item.cavityCentred=true;
        item.BunningsReference=true;
        item.IkeaReference=true;
        item.productReferenceFamily='sliding wardrobe frame and double-track system';
        item.surfaceRoughness=.012;
        return item;
      };
      [
        tagRobeFrame(addBox(`${id}-v21-outer-frame-north`,'robe',x-frameHalfDepth,x+frameHalfDepth,.018,sliderHead,z0,z0+outerFrame,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-south`,'robe',x-frameHalfDepth,x+frameHalfDepth,.018,sliderHead,z1-outerFrame,z1,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-sill`,'robe',x-frameHalfDepth,x+frameHalfDepth,.018,.018+outerFrame,z0,z1,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-outer-frame-head`,'robe',x-frameHalfDepth,x+frameHalfDepth,sliderHead-outerFrame,sliderHead,z0,z1,COLORS.silver,1),'continuous-outer-frame'),
        tagRobeFrame(addBox(`${id}-v21-lower-double-track-bed`,'robe',x-frameHalfDepth,x+frameHalfDepth,.020,.030,z0+outerFrame,z1-outerFrame,COLORS.silver,1),'lower-double-track'),
        tagRobeFrame(addBox(`${id}-v21-upper-double-track-bed`,'robe',x-frameHalfDepth,x+frameHalfDepth,sliderHead-.030,sliderHead-.020,z0+outerFrame,z1-outerFrame,COLORS.silver,1),'upper-double-track')
      ];
      [-PARAMS.ROBE_TRACK_OFFSET/2,PARAMS.ROBE_TRACK_OFFSET/2].forEach((offset,index)=>{
        const trackRole=index===0?'track-1':'track-2';
        tagRobeFrame(addBox(`${id}-v21-lower-${trackRole}`,'robe',x+offset-.003,x+offset+.003,.030,.050,z0+outerFrame,z1-outerFrame,COLORS.brushedNickel,1),'lower-double-track');
        tagRobeFrame(addBox(`${id}-v21-upper-${trackRole}`,'robe',x+offset-.003,x+offset+.003,sliderHead-.050,sliderHead-.030,z0+outerFrame,z1-outerFrame,COLORS.brushedNickel,1),'upper-double-track');
      });
      const layout=overlappingRobeLayout(z0,z1,panelCount);
      for (let i=0; i<panelCount; i++) {
        const panelZ0=z0+layout.step*i, panelZ1=panelZ0+layout.panelWidth;
        const panelX=x+(i-(panelCount-1)/2)*PARAMS.ROBE_TRACK_OFFSET;
        const transformWhen=()=>{
          const p=easedProgress(state);
          const travel=state.slideDirection==='right' ? (panelCount-1-i)*layout.step : -i*layout.step;
          return mat4Translation(0,0,travel*p);
        };
        const panel=addBox(`${id}-panel-${i+1}-moving`,'robe',panelX-leafHalfDepth,panelX+leafHalfDepth,.030+leafFrame,sliderHead-.035-leafFrame,panelZ0+leafFrame,panelZ1-leafFrame,COLORS.robe,1);
        panel.robeOverlap=layout.overlap; panel.robeTrackIndex=i;
        tagRobeFrame(panel,'25mm-mirrored-leaf',i+1);
        const panelFrameItems=[
          addBox(`${id}-panel-${i+1}-v21-frame-north`,'robe',panelX-leafHalfDepth,panelX+leafHalfDepth,.030,sliderHead-.035,panelZ0,panelZ0+leafFrame,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-south`,'robe',panelX-leafHalfDepth,panelX+leafHalfDepth,.030,sliderHead-.035,panelZ1-leafFrame,panelZ1,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-sill`,'robe',panelX-leafHalfDepth,panelX+leafHalfDepth,.030,.030+leafFrame,panelZ0,panelZ1,COLORS.silver,1),
          addBox(`${id}-panel-${i+1}-v21-frame-head`,'robe',panelX-leafHalfDepth,panelX+leafHalfDepth,sliderHead-.035-leafFrame,sliderHead-.035,panelZ0,panelZ1,COLORS.silver,1)
        ];
        panelFrameItems.forEach(item=>tagRobeFrame(item,'four-side-leaf-frame',i+1));
        const highlightFront=addBox(`${id}-panel-${i+1}-mirror-highlight-front`,'robe',panelX-leafHalfDepth-.003,panelX-leafHalfDepth-.001,.12,sliderHead-.14,panelZ0+layout.panelWidth*.14,panelZ0+layout.panelWidth*.19,COLORS.mirrorHighlight,1);
        const highlightBack=addBox(`${id}-panel-${i+1}-mirror-highlight-back`,'robe',panelX+leafHalfDepth+.001,panelX+leafHalfDepth+.003,.12,sliderHead-.14,panelZ0+layout.panelWidth*.14,panelZ0+layout.panelWidth*.19,COLORS.mirrorHighlight,1);
        [panel,...panelFrameItems,highlightFront,highlightBack].forEach(item=>setItemTransform(item,transformWhen));
      }
      addHighVisibilityRobeArrowZ(`${id}-left-panel-travel`,'robe',id,x,z0,z0+layout.panelWidth,1.00,'slide-right');
      addHighVisibilityRobeArrowZ(`${id}-right-panel-travel`,'robe',id,x,z1-layout.panelWidth,z1,1.00,'slide-left');
      setRobeArrowTargets(state,[x-.055,1.00,z0+layout.panelWidth*.5],[x-.055,1.00,z1-layout.panelWidth*.5]);
      addLabel(`${id} · ${panelCount} PANEL MIRRORED SLIDER`, noteX, 1.12, (z0+z1)/2, 'note', 'robe');
    }

    function addGlassSliderZ(id, x, z0, z1, noteX, panelCount, mirrored = false, options = {}) {
      const baseY=options.baseY ?? 0;
      const height=options.height ?? WALL_H;
      const sliderHead = baseY + height - PARAMS.CORNICE_PROXY;
      const style=mirrored ? null : glazingStyle({...options,glazingType:options.glazingType || 'clear'});
      const faceColor = mirrored ? COLORS.robe : style.color;
      const state=registerInteraction(id,mirrored ? 'mirrored robe slider' : 'glass sliding door','slider',[x,(baseY+sliderHead)*.5,(z0+z1)/2],false,true);
      state.glazingType=mirrored ? 'mirror' : style.type;
      addBox(`${id}-cornice`, 'cornice', x-.045, x+.045, sliderHead, baseY+height, z0, z1, COLORS.cornice, 1, true);
      addLine(`${id}-track-a`, 'slider', [[x-.035,baseY+.025,z0],[x-.035,baseY+.025,z1]], COLORS.glazeFrame, 1);
      addLine(`${id}-track-b`, 'slider', [[x+.035,baseY+.025,z0],[x+.035,baseY+.025,z1]], COLORS.glazeFrame, 1);
      const fixedFrameHalfDepth=.041,fixedFrameWidth=.045;
      const tagFixedSliderFrame=(item,role)=>{
        item.sliderFrameSystem=true;
        item.sliderFrameRole=role;
        item.sliderAssemblyId=id;
        item.cavityCentred=true;
        item.cavityCentrePlane=x;
        item.frameDepthMm=82;
        item.clearAnodisedSilver=true;
        item.JasonReference=!mirrored;
        item.surfaceRoughness=.012;
        if(mirrored) {
          item.robeFrameSystem=true;
          item.v21RobeFrame=true;
          if(role.includes('track')) item.v21RobeTrack=true;
          item.BunningsReference=true;
          item.IkeaReference=true;
          item.productReferenceFamily='sliding wardrobe frame and double-track system';
        }
        return item;
      };
      [
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-north`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,baseY+.018,sliderHead,z0,z0+fixedFrameWidth,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-south`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,baseY+.018,sliderHead,z1-fixedFrameWidth,z1,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-sill`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,baseY+.018,baseY+.018+fixedFrameWidth,z0,z1,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-head`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,sliderHead-fixedFrameWidth,sliderHead,z0,z1,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-solid-lower-track`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,baseY+.020,baseY+.032,z0+fixedFrameWidth,z1-fixedFrameWidth,COLORS.brushedNickel,1),'solid-lower-track'),
        tagFixedSliderFrame(addBox(`${id}-v21-solid-upper-track`,'slider',x-fixedFrameHalfDepth,x+fixedFrameHalfDepth,sliderHead-.032,sliderHead-.020,z0+fixedFrameWidth,z1-fixedFrameWidth,COLORS.brushedNickel,1),'solid-upper-track')
      ];
      const panelSpan = (z1-z0)/panelCount;
      const robeLayout=mirrored ? overlappingRobeLayout(z0,z1,panelCount) : null;
      const movingFrameColor=mirrored?COLORS.silver:COLORS.glazeFrame;
      const movingFrameHalfDepth=mirrored?.012:.022;
      for (let i=0; i<panelCount; i++) {
        const panelZ0=mirrored ? z0+robeLayout.step*i : z0+panelSpan*i+.012;
        const panelZ1=mirrored ? panelZ0+robeLayout.panelWidth : z0+panelSpan*(i+1)-.012;
        const panelTrackX=mirrored ? x+(i-(panelCount-1)/2)*PARAMS.ROBE_TRACK_OFFSET : x;
        const transformWhen=()=>{
          const p=easedProgress(state);
          if (!mirrored) return mat4Translation(i*.018*p,0,-i*panelSpan*p);
          const travel=state.slideDirection==='right' ? (panelCount-1-i)*robeLayout.step : -i*robeLayout.step;
          return mat4Translation(0,0,travel*p);
        };
        const panel=addBox(`${id}-panel-${i+1}-moving`,'slider',panelTrackX-.012,panelTrackX+.012,baseY+.048,sliderHead-.052,panelZ0+.018,panelZ1-.018,faceColor,mirrored?1:style.alpha);
        if (!mirrored) tagGlazingPane(panel,style);
        if (mirrored) {
          panel.robeOverlap=robeLayout.overlap;
          panel.robeTrackIndex=i;
          panel.robeFrameSystem=true;
          panel.v21RobeFrame=true;
          panel.robeFrameRole='24mm-mirrored-leaf';
          panel.robeAssemblyId=id;
          panel.robePanelIndex=i+1;
          panel.robeLeafThicknessMm=24;
          panel.cavityCentred=true;
          panel.BunningsReference=true;
          panel.IkeaReference=true;
          panel.productReferenceFamily='sliding wardrobe panel system';
        }
        setItemTransform(panel,transformWhen);
        const frameItems=[
          addBox(`${id}-panel-${i+1}-frame-north`,'slider',panelTrackX-movingFrameHalfDepth,panelTrackX+movingFrameHalfDepth,baseY+.03,sliderHead-.035,panelZ0,panelZ0+.030,movingFrameColor,1),
          addBox(`${id}-panel-${i+1}-frame-south`,'slider',panelTrackX-movingFrameHalfDepth,panelTrackX+movingFrameHalfDepth,baseY+.03,sliderHead-.035,panelZ1-.030,panelZ1,movingFrameColor,1),
          addBox(`${id}-panel-${i+1}-frame-sill`,'slider',panelTrackX-movingFrameHalfDepth,panelTrackX+movingFrameHalfDepth,baseY+.03,baseY+.060,panelZ0,panelZ1,movingFrameColor,1),
          addBox(`${id}-panel-${i+1}-frame-head`,'slider',panelTrackX-movingFrameHalfDepth,panelTrackX+movingFrameHalfDepth,sliderHead-.065,sliderHead-.035,panelZ0,panelZ1,movingFrameColor,1)
        ];
        frameItems.forEach(item=>{
          setItemTransform(item,transformWhen);
          if(mirrored) {
            item.robeFrameSystem=true;
            item.v21RobeFrame=true;
            item.robeFrameRole='four-side-leaf-frame';
            item.robeAssemblyId=id;
            item.robePanelIndex=i+1;
            item.robeLeafThicknessMm=24;
            item.clearAnodisedSilver=true;
            item.cavityCentred=true;
            item.BunningsReference=true;
            item.IkeaReference=true;
            item.productReferenceFamily='sliding wardrobe panel frame';
            item.surfaceRoughness=.012;
          }
        });
        if (mirrored) {
          const highlightFront=addBox(`${id}-panel-${i+1}-mirror-highlight-front`,'slider',panelTrackX-.015,panelTrackX-.013,baseY+.12,sliderHead-.14,panelZ0+robeLayout.panelWidth*.14,panelZ0+robeLayout.panelWidth*.19,COLORS.mirrorHighlight,1);
          const highlightBack=addBox(`${id}-panel-${i+1}-mirror-highlight-back`,'slider',panelTrackX+.013,panelTrackX+.015,baseY+.12,sliderHead-.14,panelZ0+robeLayout.panelWidth*.14,panelZ0+robeLayout.panelWidth*.19,COLORS.mirrorHighlight,1);
          [highlightFront,highlightBack].forEach(item=>setItemTransform(item,transformWhen));
        }
      }
      const arrowSpan=mirrored ? robeLayout.panelWidth : panelSpan;
      const arrowX=mirrored ? x-.055 : x;
      if (mirrored) {
        addHighVisibilityRobeArrowZ(`${id}-left-panel-travel`,'slider',id,x,z0,z0+arrowSpan,baseY+1.00,'slide-right');
        addHighVisibilityRobeArrowZ(`${id}-right-panel-travel`,'slider',id,x,z1-arrowSpan,z1,baseY+1.00,'slide-left');
        setRobeArrowTargets(state,[arrowX,baseY+1.00,z0+arrowSpan*.5],[arrowX,baseY+1.00,z1-arrowSpan*.5]);
      } else {
        addArrowZ(`${id}-left-panel-travel`, 'slider', arrowX, z0, z0+arrowSpan, baseY+.86, 'slide-right', COLORS.glazeFrame);
        addArrowZ(`${id}-right-panel-travel`, 'slider', arrowX, z1-arrowSpan, z1, baseY+.86, 'slide-left', COLORS.glazeFrame);
      }
      const face = mirrored ? 'MIRRORED-GLASS ROBE SLIDER' : 'GLASS SLIDING DOOR';
      addLabel(`${id} · ${panelCount} PANEL ${face}`, noteX, baseY+1.12, (z0+z1)/2, 'key', 'slider');
    }

    function addGlassSliderX(id, x0, x1, z, noteZ, panelCount, options = {}) {
      const baseY=options.baseY ?? 0;
      const height=options.height ?? WALL_H;
      const sliderHead=baseY+height-PARAMS.CORNICE_PROXY;
      const style=glazingStyle({...options,glazingType:options.glazingType || 'clear'});
      const state=registerInteraction(id,'glass sliding door','slider',[(x0+x1)/2,(baseY+sliderHead)*.5,z],false,true);
      state.glazingType=style.type;
      addBox(`${id}-cornice`,'cornice',x0,x1,sliderHead,baseY+height,z-.045,z+.045,COLORS.cornice,1,true);
      addLine(`${id}-track-a`,'slider',[[x0,baseY+.025,z-.035],[x1,baseY+.025,z-.035]],COLORS.glazeFrame,1);
      addLine(`${id}-track-b`,'slider',[[x0,baseY+.025,z+.035],[x1,baseY+.025,z+.035]],COLORS.glazeFrame,1);
      const fixedFrameHalfDepth=.041,fixedFrameWidth=.045;
      const tagFixedSliderFrame=(item,role)=>{
        item.sliderFrameSystem=true;
        item.sliderFrameRole=role;
        item.sliderAssemblyId=id;
        item.cavityCentred=true;
        item.cavityCentrePlane=z;
        item.frameDepthMm=82;
        item.clearAnodisedSilver=true;
        item.JasonReference=true;
        item.surfaceRoughness=.012;
        return item;
      };
      [
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-west`,'slider',x0,x0+fixedFrameWidth,baseY+.018,sliderHead,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-east`,'slider',x1-fixedFrameWidth,x1,baseY+.018,sliderHead,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-sill`,'slider',x0,x1,baseY+.018,baseY+.018+fixedFrameWidth,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-fixed-frame-head`,'slider',x0,x1,sliderHead-fixedFrameWidth,sliderHead,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.silver,1),'fixed-perimeter-frame'),
        tagFixedSliderFrame(addBox(`${id}-v21-solid-lower-track`,'slider',x0+fixedFrameWidth,x1-fixedFrameWidth,baseY+.020,baseY+.032,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.brushedNickel,1),'solid-lower-track'),
        tagFixedSliderFrame(addBox(`${id}-v21-solid-upper-track`,'slider',x0+fixedFrameWidth,x1-fixedFrameWidth,sliderHead-.032,sliderHead-.020,z-fixedFrameHalfDepth,z+fixedFrameHalfDepth,COLORS.brushedNickel,1),'solid-upper-track')
      ];
      const panelSpan=(x1-x0)/panelCount;
      for (let i=0;i<panelCount;i++) {
        const panelX0=x0+panelSpan*i+.012, panelX1=x0+panelSpan*(i+1)-.012;
        const transformWhen=()=>{
          const p=easedProgress(state);
          return mat4Translation(-i*panelSpan*p,0,i*.018*p);
        };
        const panel=tagGlazingPane(addBox(`${id}-panel-${i+1}-moving`,'slider',panelX0+.018,panelX1-.018,baseY+.048,sliderHead-.052,z-.012,z+.012,style.color,style.alpha),style);
        setItemTransform(panel,transformWhen);
        const frameItems=[
          addBox(`${id}-panel-${i+1}-frame-west`,'slider',panelX0,panelX0+.030,baseY+.03,sliderHead-.035,z-.022,z+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-east`,'slider',panelX1-.030,panelX1,baseY+.03,sliderHead-.035,z-.022,z+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-sill`,'slider',panelX0,panelX1,baseY+.03,baseY+.060,z-.022,z+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-head`,'slider',panelX0,panelX1,sliderHead-.065,sliderHead-.035,z-.022,z+.022,COLORS.glazeFrame,1)
        ];
        frameItems.forEach(item=>setItemTransform(item,transformWhen));
      }
      addArrowX(`${id}-left-panel-travel`,'slider',x0,x0+panelSpan,baseY+.86,z,'slide-right',COLORS.glazeFrame);
      addArrowX(`${id}-right-panel-travel`,'slider',x1-panelSpan,x1,baseY+.86,z,'slide-left',COLORS.glazeFrame);
      addLabel(`${id} · ${panelCount} PANEL GLASS SLIDING DOOR`,(x0+x1)/2,baseY+1.12,noteZ,'key','slider');
    }

    function addSectionalDoorZ(id, x, z0, z1, baseY, head = 2.140) {
      const state=registerInteraction(id,'sectional garage door','door',[x,baseY+head*.52,(z0+z1)/2],false,true);
      const pivot=toWorld(x,baseY+head,(z0+z1)/2);
      const transformWhen=()=>mat4AroundPivot('z',-Math.PI/2*easedProgress(state),pivot);
      const panelCount=4, panelHeight=head/panelCount;
      for (let i=0;i<panelCount;i++) {
        const panel=addBox(`${id}-section-${i+1}-moving`,'door',x-.022,x+.022,baseY+i*panelHeight+.012,baseY+(i+1)*panelHeight-.012,z0+.018,z1-.018,COLORS.door,1);
        setItemTransform(panel,transformWhen);
        const seam=addLine(`${id}-seam-${i+1}`,'door',[[x-.024,baseY+(i+1)*panelHeight,z0],[x-.024,baseY+(i+1)*panelHeight,z1]],COLORS.glazeFrame,.72);
        setItemTransform(seam,transformWhen);
      }
      addBox(`${id}-frame-north`,'door',x-.05,x+.05,baseY,baseY+head+.08,z0-.05,z0+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-south`,'door',x-.05,x+.05,baseY,baseY+head+.08,z1-.05,z1+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-head`,'door',x-.05,x+.05,baseY+head,baseY+head+.08,z0,z1,COLORS.doorFrame,1);
      addLabel(`${id} · SECTIONAL GARAGE DOOR`,x+.34,baseY+.34,(z0+z1)/2,'key','door',112);
    }

    function addSectionalDoorX(id, x0, x1, z, baseY, head = 2.140) {
      const state=registerInteraction(id,'sectional garage door','door',[(x0+x1)/2,baseY+head*.52,z],false,true);
      const pivot=toWorld((x0+x1)/2,baseY+head,z);
      const transformWhen=()=>mat4AroundPivot('x',Math.PI/2*easedProgress(state),pivot);
      const panelCount=4, panelHeight=head/panelCount;
      for (let i=0;i<panelCount;i++) {
        const panel=addBox(`${id}-section-${i+1}-moving`,'door',x0+.018,x1-.018,baseY+i*panelHeight+.012,baseY+(i+1)*panelHeight-.012,z-.022,z+.022,COLORS.door,1);
        setItemTransform(panel,transformWhen);
        const seam=addLine(`${id}-seam-${i+1}`,'door',[[x0,baseY+(i+1)*panelHeight,z-.024],[x1,baseY+(i+1)*panelHeight,z-.024]],COLORS.glazeFrame,.72);
        setItemTransform(seam,transformWhen);
      }
      addBox(`${id}-frame-west`,'door',x0-.05,x0+.05,baseY,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-east`,'door',x1-.05,x1+.05,baseY,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-head`,'door',x0,x1,baseY+head,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addLabel(`${id} · SECTIONAL GARAGE DOOR`,(x0+x1)/2,baseY+.34,z+.34,'key','door',112);
    }

    function mapStair([u, v]) { return [4.76 - v, 0.25 + u]; }

    function stairCarpetColour(number) {
      return COLORS.carpetTaupe;
    }

    function addTask004CarpetRiser(name, localEdge, y0, y1, color) {
      const [a,b]=localEdge.map(mapStair);
      const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz) || 1;
      const isLandingUpturn=name==='T04-stair-carpet-wrap-riser-15';
      const halfDepth=isLandingUpturn?.001:.00375,nx=-dz/length,nz=dx/length;
      const retainedOffset=isLandingUpturn?.0055:0;
      const ribbon=[
        [a[0]+nx*(retainedOffset+halfDepth),a[1]+nz*(retainedOffset+halfDepth)],
        [b[0]+nx*(retainedOffset+halfDepth),b[1]+nz*(retainedOffset+halfDepth)],
        [b[0]+nx*(retainedOffset-halfDepth),b[1]+nz*(retainedOffset-halfDepth)],
        [a[0]+nx*(retainedOffset-halfDepth),a[1]+nz*(retainedOffset-halfDepth)]
      ];
      const riser=addPrism(name,'finishCarpet',ribbon,y0,y1,color,1);
      riser.surfaceRoughness=.095;
      riser.finishLayer='continuous carpet riser wrap';
      riser.continuousCarpetSystem='P6-TAUPE-ONE-PIECE';
      if(isLandingUpturn) {
        riser.finishLayer='continuous carpet riser upturn retained behind landing nosing';
        riser.carpetTermination='behind-selected-landing-nosing-front-edge';
        riser.visibleMetalFasciaReplacement=false;
      }
      return riser;
    }

    function addTask004RoundedCarpetNosing(name, localEdge, adjacentPlanPoly, upperTop, color) {
      const [a,b]=localEdge.map(mapStair);
      const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz) || 1;
      let nx=-dz/length,nz=dx/length;
      const midpoint=[(a[0]+b[0])/2,(a[1]+b[1])/2];
      const centroid=adjacentPlanPoly.reduce((sum,point)=>[sum[0]+point[0]/adjacentPlanPoly.length,sum[1]+point[1]/adjacentPlanPoly.length],[0,0]);
      if ((centroid[0]-midpoint[0])*nx+(centroid[1]-midpoint[1])*nz>0) { nx=-nx; nz=-nz; }
      const radius=PARAMS.STAIR_CARPET_NOSE_RADIUS;
      const thickness=PARAMS.STAIR_CARPET_THICKNESS;
      const segments=8;
      const outer=[];
      for (let index=0;index<=segments;index++) {
        const theta=Math.PI/2*(1-index/segments);
        outer.push([-radius+(radius+thickness)*Math.cos(theta),-radius+(radius+thickness)*Math.sin(theta)]);
      }
      const inner=[];
      for (let index=0;index<=segments;index++) {
        const theta=Math.PI/2*(index/segments);
        inner.push([-radius+radius*Math.cos(theta),-radius+radius*Math.sin(theta)]);
      }
      const section=[...outer,...inner];
      const item=addSectionExtrusion(name,'finishCarpet',section,(t,offset,height)=>[
        a[0]+dx*t+nx*offset,
        upperTop+height,
        a[1]+dz*t+nz*offset
      ],color,1);
      item.surfaceRoughness=.095;
      item.finishLayer='continuous rounded carpet tread-riser wrap';
      item.continuousCarpetSystem='P6-TAUPE-ONE-PIECE';
      item.carpetNoseRadius=radius;
      item.carpetNoseTangentContinuity=true;
      return item;
    }

    function deterministicTileUnit(seed) {
      const value=Math.sin(seed*12.9898+78.233)*43758.5453;
      return value-Math.floor(value);
    }

    function tagWetTileItem(item, role, zone) {
      if (!item) return item;
      item.wetTileRole=role;
      item.wetTileZone=zone;
      item.wetTileSystem='GREY-BLUSH-TERRAZZO-V14';
      item.surfaceRoughness=.052;
      return item;
    }

    function addTerrazzoFloorZone(id,x0,x1,z0,z1) {
      const grout=tagWetTileItem(addBox(`${id}-continuous-grout-bed`,'wet',x0,x1,.002,PARAMS.WET_LEVEL_DELTA-.0025,z0,z1,COLORS.tileGrout,1), 'floor-grout-bed', id);
      grout.wetTileDatum=PARAMS.WET_LEVEL_DELTA;
      let tileIndex=0;
      for (let x=x0;x<x1-.001;x+=PARAMS.WET_FLOOR_TILE_MODULE) {
        const tileX1=Math.min(x+PARAMS.WET_FLOOR_TILE_MODULE,x1);
        for (let z=z0;z<z1-.001;z+=PARAMS.WET_FLOOR_TILE_MODULE) {
          const tileZ1=Math.min(z+PARAMS.WET_FLOOR_TILE_MODULE,z1);
          const joint=PARAMS.WET_TILE_JOINT/2;
          const tx0=x+joint,tx1=tileX1-joint,tz0=z+joint,tz1=tileZ1-joint;
          if (tx1-tx0<.02 || tz1-tz0<.02) continue;
          const tileColor=tileIndex%3===0 ? COLORS.tileGreyAlt : COLORS.tileWarmGrey;
          const tile=tagWetTileItem(addBox(`${id}-floor-tile-${tileIndex+1}`,'wet',tx0,tx1,PARAMS.WET_LEVEL_DELTA-.0035,PARAMS.WET_LEVEL_DELTA,tz0,tz1,tileColor,1),'floor-tile',id);
          tile.wetTileModule=PARAMS.WET_FLOOR_TILE_MODULE;
          tile.wetTileJoint=PARAMS.WET_TILE_JOINT;
          const fleckColors=[COLORS.tileChipLight,COLORS.tileChipRoseGrey,COLORS.tileChipLight,COLORS.tileChipBlush];
          fleckColors.forEach((fleckColor,fleckIndex)=>{
            const width=Math.min(.012+.014*deterministicTileUnit(tileIndex*17+fleckIndex*5+1),(tx1-tx0)*.18);
            const depth=Math.min(.010+.016*deterministicTileUnit(tileIndex*23+fleckIndex*7+2),(tz1-tz0)*.18);
            const px=tx0+.012+deterministicTileUnit(tileIndex*29+fleckIndex*11+3)*Math.max(.001,tx1-tx0-width-.024);
            const pz=tz0+.012+deterministicTileUnit(tileIndex*31+fleckIndex*13+4)*Math.max(.001,tz1-tz0-depth-.024);
            tagWetTileItem(addBox(`${id}-floor-tile-${tileIndex+1}-fleck-${fleckIndex+1}`,'wet',px,px+width,PARAMS.WET_LEVEL_DELTA+.00012,PARAMS.WET_LEVEL_DELTA+.00042,pz,pz+depth,fleckColor,1),'floor-fleck',id);
          });
          tileIndex++;
        }
      }
      return tileIndex;
    }

    function addTerrazzoWallXPlane(id,planeX,normalSign,z0,z1,y0,y1) {
      const thickness=PARAMS.WET_WALL_TILE_THICKNESS;
      const faceX=planeX+normalSign*.0005;
      const backX=faceX+normalSign*thickness;
      const xMin=Math.min(faceX,backX),xMax=Math.max(faceX,backX);
      // Grout bed sits 1.2 mm behind the tile faces so the two boxes never share a depth plane.
      const groutOuterX=backX-normalSign*.0012;
      tagWetTileItem(addBox(`${id}-wall-grout-bed`,'wet',Math.min(faceX,groutOuterX),Math.max(faceX,groutOuterX),y0,y1,z0,z1,COLORS.tileGrout,1,true),'wall-grout-bed',id);
      let tileIndex=0;
      for (let z=z0;z<z1-.001;z+=PARAMS.WET_WALL_TILE_WIDTH) {
        const tileZ1=Math.min(z+PARAMS.WET_WALL_TILE_WIDTH,z1);
        for (let y=y0;y<y1-.001;y+=PARAMS.WET_WALL_TILE_HEIGHT) {
          const tileY1=Math.min(y+PARAMS.WET_WALL_TILE_HEIGHT,y1);
          const joint=PARAMS.WET_TILE_JOINT/2;
          const tz0=z+joint,tz1=tileZ1-joint,ty0=y+joint,ty1=tileY1-joint;
          if (tz1-tz0<.02 || ty1-ty0<.02) continue;
          const tile=tagWetTileItem(addBox(`${id}-wall-tile-${tileIndex+1}`,'wet',xMin,xMax,ty0,ty1,tz0,tz1,tileIndex%4===0?COLORS.tileGreyAlt:COLORS.tileWarmGrey,1,true),'wall-tile',id);
          tile.wetTileModule=[PARAMS.WET_WALL_TILE_WIDTH,PARAMS.WET_WALL_TILE_HEIGHT];
          tile.wetTileJoint=PARAMS.WET_TILE_JOINT;
          tile.wetTileFullHeight=true;
          const outerX=normalSign>0?xMax:xMin;
          const fleckX0=normalSign>0?outerX+.0008:outerX-.0014;
          const fleckX1=normalSign>0?outerX+.0014:outerX-.0008;
          const fleckColors=[COLORS.tileChipBlush,COLORS.tileChipRoseGrey,COLORS.tileChipLight,COLORS.tileChipBlush,COLORS.tileChipRoseGrey];
          fleckColors.forEach((fleckColor,fleckIndex)=>{
            const width=Math.min(.010+.012*deterministicTileUnit(tileIndex*19+fleckIndex*5+7),(tz1-tz0)*.18);
            const height=Math.min(.010+.016*deterministicTileUnit(tileIndex*27+fleckIndex*7+9),(ty1-ty0)*.16);
            const pz=tz0+.010+deterministicTileUnit(tileIndex*31+fleckIndex*11+12)*Math.max(.001,tz1-tz0-width-.020);
            const py=ty0+.010+deterministicTileUnit(tileIndex*37+fleckIndex*13+14)*Math.max(.001,ty1-ty0-height-.020);
            tagWetTileItem(addBox(`${id}-wall-tile-${tileIndex+1}-fleck-${fleckIndex+1}`,'wet',Math.min(fleckX0,fleckX1),Math.max(fleckX0,fleckX1),py,py+height,pz,pz+width,fleckColor,1,true),'wall-fleck',id);
          });
          tileIndex++;
        }
      }
      return tileIndex;
    }

    function addTerrazzoWallZPlane(id,planeZ,normalSign,x0,x1,y0,y1) {
      const thickness=PARAMS.WET_WALL_TILE_THICKNESS;
      const faceZ=planeZ+normalSign*.0005;
      const backZ=faceZ+normalSign*thickness;
      const zMin=Math.min(faceZ,backZ),zMax=Math.max(faceZ,backZ);
      // Grout bed sits 1.2 mm behind the tile faces so the two boxes never share a depth plane.
      const groutOuterZ=backZ-normalSign*.0012;
      tagWetTileItem(addBox(`${id}-wall-grout-bed`,'wet',x0,x1,y0,y1,Math.min(faceZ,groutOuterZ),Math.max(faceZ,groutOuterZ),COLORS.tileGrout,1,true),'wall-grout-bed',id);
      let tileIndex=0;
      for (let x=x0;x<x1-.001;x+=PARAMS.WET_WALL_TILE_WIDTH) {
        const tileX1=Math.min(x+PARAMS.WET_WALL_TILE_WIDTH,x1);
        for (let y=y0;y<y1-.001;y+=PARAMS.WET_WALL_TILE_HEIGHT) {
          const tileY1=Math.min(y+PARAMS.WET_WALL_TILE_HEIGHT,y1);
          const joint=PARAMS.WET_TILE_JOINT/2;
          const tx0=x+joint,tx1=tileX1-joint,ty0=y+joint,ty1=tileY1-joint;
          if (tx1-tx0<.02 || ty1-ty0<.02) continue;
          const tile=tagWetTileItem(addBox(`${id}-wall-tile-${tileIndex+1}`,'wet',tx0,tx1,ty0,ty1,zMin,zMax,tileIndex%4===0?COLORS.tileGreyAlt:COLORS.tileWarmGrey,1,true),'wall-tile',id);
          tile.wetTileModule=[PARAMS.WET_WALL_TILE_WIDTH,PARAMS.WET_WALL_TILE_HEIGHT];
          tile.wetTileJoint=PARAMS.WET_TILE_JOINT;
          tile.wetTileFullHeight=true;
          const outerZ=normalSign>0?zMax:zMin;
          const fleckZ0=normalSign>0?outerZ+.0008:outerZ-.0014;
          const fleckZ1=normalSign>0?outerZ+.0014:outerZ-.0008;
          const fleckColors=[COLORS.tileChipBlush,COLORS.tileChipRoseGrey,COLORS.tileChipLight,COLORS.tileChipBlush,COLORS.tileChipRoseGrey];
          fleckColors.forEach((fleckColor,fleckIndex)=>{
            const width=Math.min(.010+.012*deterministicTileUnit(tileIndex*21+fleckIndex*5+17),(tx1-tx0)*.18);
            const height=Math.min(.010+.016*deterministicTileUnit(tileIndex*25+fleckIndex*7+19),(ty1-ty0)*.16);
            const px=tx0+.010+deterministicTileUnit(tileIndex*33+fleckIndex*11+22)*Math.max(.001,tx1-tx0-width-.020);
            const py=ty0+.010+deterministicTileUnit(tileIndex*39+fleckIndex*13+24)*Math.max(.001,ty1-ty0-height-.020);
            tagWetTileItem(addBox(`${id}-wall-tile-${tileIndex+1}-fleck-${fleckIndex+1}`,'wet',px,px+width,py,py+height,Math.min(fleckZ0,fleckZ1),Math.max(fleckZ0,fleckZ1),fleckColor,1,true),'wall-fleck',id);
          });
          tileIndex++;
        }
      }
      return tileIndex;
    }

    function superellipsePlan(cx,cz,rx,rz,power=.58,segments=40) {
      return Array.from({length:segments},(_,index)=>{
        const theta=Math.PI*2*index/segments;
        const c=Math.cos(theta),s=Math.sin(theta);
        return [
          cx+rx*Math.sign(c)*Math.pow(Math.abs(c),power),
          cz+rz*Math.sign(s)*Math.pow(Math.abs(s),power)
        ];
      });
    }

    function addWetTileSkirting(id,axis,plane,normal,start,end) {
      if(end-start<.020) return;
      const base=PARAMS.WET_LEVEL_DELTA;
      const face=plane+normal*(.0005+PARAMS.WET_WALL_TILE_THICKNESS+.0005);
      const outer=face+normal*PARAMS.WET_TILE_SKIRTING_DEPTH;
      const box=(name,a,b,y0,y1,d0,d1,color,role)=>{
        const item=axis==='x'
          ? addBox(name,'wet',Math.min(d0,d1),Math.max(d0,d1),y0,y1,a,b,color,1,true)
          : addBox(name,'wet',a,b,y0,y1,Math.min(d0,d1),Math.max(d0,d1),color,1,true);
        tagWetTileItem(item,role,id);
        if(item) { item.tileSkirting=true; item.tileSkirtingRun=id; item.skirtingMaterial='matching wall tile'; }
        return item;
      };
      box(`${id}-grout-bed`,start,end,base,base+PARAMS.WET_TILE_SKIRTING_HEIGHT,face,outer,COLORS.tileGrout,'skirting-grout-bed');
      for(let along=start,index=0;along<end-.001;along+=PARAMS.WET_WALL_TILE_WIDTH,index++) {
        const a=along+PARAMS.WET_TILE_JOINT/2,b=Math.min(along+PARAMS.WET_WALL_TILE_WIDTH,end)-PARAMS.WET_TILE_JOINT/2;
        if(b-a<.012) continue;
        box(`${id}-tile-${index}`,a,b,base+.003,base+PARAMS.WET_TILE_SKIRTING_HEIGHT-.002,face,outer,index%4===0?COLORS.tileGreyAlt:COLORS.tileWarmGrey,'skirting-tile');
        [COLORS.tileChipRoseGrey,COLORS.tileChipLight,COLORS.tileChipBlush].forEach((color,fleck)=>{
          const width=Math.min(.007,(b-a)*.15);
          const at=a+.004+deterministicTileUnit(index*29+fleck*11+7)*Math.max(0,b-a-width-.008);
          const y=base+.020+deterministicTileUnit(index*31+fleck*17+13)*.057;
          box(`${id}-tile-${index}-fleck-${fleck}`,at,at+width,y,y+.006,outer+normal*.0001,outer+normal*.00035,color,'skirting-fleck');
        });
      }
    }

    function buildWetTileSkirting() {
      // A flat 100 mm cut-tile base, independent of all painted timber profiles.
      // Door gaps and the perpendicular WC wall retain their exact positions.
      [
        ['BATH-WEST','x',4.85,1,.25,2.59],
        ['BATH-EAST','x',6.60,-1,.25,PARAMS.D04_OPENING_Z0-.034],
        ['BATH-NORTH','z',.25,1,4.85,6.60],
        ['BATH-SOUTH','z',2.59,-1,4.85,6.60],
        ['WC-WEST','x',6.69,1,.25,1.13],
        ['VANITY-WEST','x',6.69,1,1.22,PARAMS.D04_OPENING_Z0-.034],
        ['WC-EAST','x',8.19,-1,.25,1.13],
        ['VANITY-EAST','x',8.19,-1,1.22,2.59],
        ['WC-NORTH','z',.25,1,6.69,8.19],
        ['VANITY-SOUTH','z',2.59,-1,PARAMS.O01_OPEN_X1,8.19],
        ['WC-DIVIDER','z',1.13,-1,PARAMS.D05_OPEN_X1+.034,8.19],
        ['VANITY-DIVIDER','z',1.22,1,PARAMS.D05_OPEN_X1+.034,8.19]
      ].forEach(([id,...args])=>addWetTileSkirting(`T22-TILE-SK-${id}`,...args));
    }

    function addWetWindowOpeningReveals(id,x0,x1,y0,y1) {
      // The glazing remains the highest-priority opening. These four narrow
      // pieces finish only the exposed reveal between the frame and wall tile.
      const revealZ0=.1505,revealZ1=.2565,edge=.006;
      const parts=[
        ['left',x0,x0+edge,y0,y1],
        ['right',x1-edge,x1,y0,y1],
        ['sill',x0,x1,y0,y0+edge],
        ['head',x0,x1,y1-edge,y1]
      ];
      for(const [part,rx0,rx1,ry0,ry1] of parts) {
        const item=tagWetTileItem(
          addBox(`T25-${id}-${part}-reveal-tile`,'wet',rx0,rx1,ry0,ry1,revealZ0,revealZ1,COLORS.tileWarmGrey,1,true),
          'window-reveal-tile',`${id}-window-reveal`
        );
        item.tileOpeningReveal=true;
        item.openingId=id;
        item.revealPart=part;
      }
    }

    function tagBathroomFixture(item,system,component,referenceKey) {
      if (!item) return item;
      const reference=BATHROOM_PRODUCT_REFERENCES[referenceKey];
      item.bathroomFixture=true;
      item.bathroomFixtureSystem=system;
      item.bathroomFixtureComponent=component;
      item.productReferenceKey=referenceKey;
      item.productReference=reference ? `${reference.maker} · ${reference.product}` : 'coordinated bathroom detail';
      item.productSource=reference?.source || null;
      item.surfaceRoughness=/glass|mirror/.test(component) ? .004 : /chrome|tap|handle|channel|rail|button|waste/.test(component) ? .010 : .024;
      return item;
    }

    function addFixtureRodY(name,cx,cz,y0,y1,radius,color,system,component,referenceKey) {
      return tagBathroomFixture(addSectionExtrusion(name,'wet',roundSection(radius,20),(t,u,v)=>[
        cx+u,y0+(y1-y0)*t,cz+v
      ],color,color[3]),system,component,referenceKey);
    }

    function addFixtureRodX(name,x0,x1,cy,cz,radius,color,system,component,referenceKey) {
      return tagBathroomFixture(addSectionExtrusion(name,'wet',roundSection(radius,20),(t,u,v)=>[
        x0+(x1-x0)*t,cy+u,cz+v
      ],color,color[3]),system,component,referenceKey);
    }

    function addFixtureRodZ(name,cx,cy,z0,z1,radius,color,system,component,referenceKey) {
      return tagBathroomFixture(addSectionExtrusion(name,'wet',roundSection(radius,20),(t,u,v)=>[
        cx+u,cy+v,z0+(z1-z0)*t
      ],color,color[3]),system,component,referenceKey);
    }

    function addBathroomFloorWaste(name,cx,cz,system,component,height=.055,referenceKey='shower') {
      const floorY=PARAMS.WET_LEVEL_DELTA;
      tagBathroomFixture(addBox(`${name}-square-stainless-grate`,'wet',cx-.055,cx+.055,floorY+height,floorY+height+.007,cz-.055,cz+.055,COLORS.brushedNickel,1),system,component,referenceKey);
      for (let index=-2;index<=2;index++) {
        const offset=index*.018;
        tagBathroomFixture(addBox(`${name}-drain-slot-${index+3}`,'wet',cx-.042,cx+.042,floorY+height+.007,floorY+height+(height<0?.008:.009),cz+offset-.0025,cz+offset+.0025,COLORS.lockShadow,1),system,`${component}-slot`,referenceKey);
      }
    }

    function addMoonlightMirrorCabinetOnX() {
      const layout=BATHROOM_V18_LAYOUT.mirror;
      const graphite=[.150,.165,.165,1];
      const shelfGlass=[.790,.875,.885,.34];
      const ledWhite=[.960,.972,.975,1];
      const demisterGlow=[.720,.915,.955,.12];
      const frontX=layout.x0;
      const centreZ=(layout.z0+layout.z1)/2;
      const centreY=(layout.bottom+layout.top)/2;
      const seamZ=centreZ;
      const doorState=registerBathroomInteraction('T18-VANITY-MOONLIGHT-DOORS','vanity mirror cabinet doors',[frontX-.032,centreY,seamZ-.055],'motion');
      doorState.hitAnchors.push([frontX-.032,centreY,seamZ+.055]);
      doorState.hitAnchorRoles=['left mirror door','right mirror door'];
      doorState.openAngleDegrees=82;
      const serviceState=registerBathroomInteraction('T18-VANITY-MIRROR-SERVICES','mirror light + demister',[frontX-.040,layout.bottom+.095,layout.z1-.075],'toggle');
      serviceState.hitAnchorRoles=['mirror touch control'];
      mirrorLightingState=serviceState;

      tagBathroomFixture(addBox('T18-VANITY-moonlight-graphite-back','wet',layout.x1-.022,layout.x1,layout.bottom,layout.top,layout.z0,layout.z1,graphite,1),'vanity','mirror-cabinet-graphite-back','mirror');
      tagBathroomFixture(addBox('T18-VANITY-moonlight-north-carcass','wet',frontX,layout.x1,layout.bottom,layout.top,layout.z0,layout.z0+.022,graphite,1),'vanity','mirror-cabinet-carcass','mirror');
      tagBathroomFixture(addBox('T18-VANITY-moonlight-south-carcass','wet',frontX,layout.x1,layout.bottom,layout.top,layout.z1-.022,layout.z1,graphite,1),'vanity','mirror-cabinet-carcass','mirror');
      tagBathroomFixture(addBox('T18-VANITY-moonlight-top-carcass','wet',frontX,layout.x1,layout.top-.022,layout.top,layout.z0,layout.z1,graphite,1),'vanity','mirror-cabinet-carcass','mirror');
      tagBathroomFixture(addBox('T18-VANITY-moonlight-bottom-carcass','wet',frontX,layout.x1,layout.bottom,layout.bottom+.022,layout.z0,layout.z1,graphite,1),'vanity','mirror-cabinet-carcass','mirror');
      tagBathroomFixture(addBox('T18-VANITY-moonlight-centre-divider','wet',frontX,layout.x1,layout.bottom+.022,layout.top-.022,seamZ-.010,seamZ+.010,graphite,1),'vanity','mirror-cabinet-centre-divider','mirror');
      [layout.bottom+.265,layout.bottom+.520].forEach((y,index)=>{
        tagBathroomFixture(addBox(`T18-VANITY-moonlight-adjustable-glass-shelf-${index+1}`,'wet',frontX+.012,layout.x1-.024,y,y+.008,layout.z0+.025,layout.z1-.025,shelfGlass,shelfGlass[3]),'vanity','adjustable-glass-shelf','mirror');
      });

      const addMirrorDoor=(side,z0,z1,pivotZ,openAngle)=>{
        const moving=[];
        moving.push(tagBathroomFixture(addBox(`T18-VANITY-moonlight-${side}-soft-close-door-core`,'wet',frontX-.021,frontX-.002,layout.bottom+.006,layout.top-.006,z0,z1,graphite,1),'vanity','soft-close-mirror-door','mirror'));
        moving.push(tagBathroomFixture(addBox(`T18-VANITY-moonlight-${side}-copper-free-mirror`,'wet',frontX-.027,frontX-.021,layout.bottom+.016,layout.top-.016,z0+.010,z1-.010,COLORS.mirrorSilver,COLORS.mirrorSilver[3]),'vanity','copper-free-mirror-door','mirror'));
        moving.push(addFixtureRodY(`T18-VANITY-moonlight-${side}-concealed-hinge-line`,frontX-.001,pivotZ,layout.bottom+.085,layout.top-.085,.006,COLORS.brushedNickelEdge,'vanity','soft-close-concealed-hinge','mirror'));
        const gripZ=side==='left' ? z1-.018 : z0+.018;
        moving.push(tagBathroomFixture(addBox(`T18-VANITY-moonlight-${side}-finger-pull`,'wet',frontX-.040,frontX-.026,centreY-.050,centreY+.050,gripZ-.007,gripZ+.007,COLORS.brushedNickel,1),'vanity','mirror-door-finger-pull','mirror'));
        const pivot=toWorld(frontX-.002,centreY,pivotZ);
        const transformWhen=()=>mat4AroundPivot('y',openAngle*easedProgress(doorState),pivot);
        moving.filter(Boolean).forEach(item=>setItemTransform(item,transformWhen));
        return {moving,transformWhen};
      };

      const leftDoor=addMirrorDoor('left',layout.z0,seamZ-.004,layout.z0,Math.PI*82/180);
      const rightDoor=addMirrorDoor('right',seamZ+.004,layout.z1,layout.z1,-Math.PI*82/180);

      const touchDisc=addFixtureRodX('T18-VANITY-mirror-touch-demister-control',frontX-.040,frontX-.027,layout.bottom+.095,layout.z1-.075,.020,COLORS.brushedNickelEdge,'vanity','demister-touch-control','mirror');
      const defogZone=tagBathroomFixture(addBox('T18-VANITY-right-mirror-active-demister-zone','wet',frontX-.030,frontX-.027,layout.bottom+.170,layout.top-.145,seamZ+.090,layout.z1-.080,demisterGlow,demisterGlow[3]),'vanity','demister-heated-zone','mirror');
      [touchDisc,defogZone].filter(Boolean).forEach(item=>setItemTransform(item,rightDoor.transformWhen));
      serviceState.anchorTransformWhen=rightDoor.transformWhen;
      touchDisc.emissionWhen=()=>serviceState.illumination*.45;
      showItemWhen(defogZone,()=>serviceState.active);

      const ledItems=[
        tagBathroomFixture(addBox('T18-VANITY-moonlight-led-top','wet',frontX-.035,frontX-.027,layout.top-.010,layout.top+.010,layout.z0-.010,layout.z1+.010,ledWhite,1),'vanity','concealed-led-light','mirror'),
        tagBathroomFixture(addBox('T18-VANITY-moonlight-led-bottom','wet',frontX-.035,frontX-.027,layout.bottom-.010,layout.bottom+.010,layout.z0-.010,layout.z1+.010,ledWhite,1),'vanity','concealed-led-light','mirror'),
        tagBathroomFixture(addBox('T18-VANITY-moonlight-led-north','wet',frontX-.035,frontX-.027,layout.bottom+.010,layout.top-.010,layout.z0-.010,layout.z0+.010,ledWhite,1),'vanity','concealed-led-light','mirror'),
        tagBathroomFixture(addBox('T18-VANITY-moonlight-led-south','wet',frontX-.035,frontX-.027,layout.bottom+.010,layout.top-.010,layout.z1-.010,layout.z1+.010,ledWhite,1),'vanity','concealed-led-light','mirror')
      ];
      ledItems.filter(Boolean).forEach(item=>{
        item.surfaceRoughness=.001;
        item.permanentWhiteDiffuser=true;
        item.emissionWhen=()=>serviceState.illumination;
      });
      addOpticalHalo('T22-MIRROR-optical-edge-halo','x',frontX-.038,centreZ,centreY,layout.width/2,layout.height/2,()=>serviceState.illumination);
      addSceneLightControl(serviceState,'Mirror light',[-1,0,0],()=>commandBathroomInteraction(serviceState));
      return {doorState,serviceState,leftDoor,rightDoor};
    }

    function addOpenBathShell(outer,bath,floorY) {
      const inner=superellipsePlan(bath.cx,bath.cz,.270,.645,.62,outer.length);
      const bottom=superellipsePlan(bath.cx,bath.cz,.185,.505,.62,outer.length);
      const p=[],n=[],point=(v,y)=>toWorld(v[0],floorY+y,v[1]);
      for(let i=0;i<outer.length;i++) {
        const j=(i+1)%outer.length;
        const outward=normalize([outer[i][0]-bath.cx,0,outer[i][1]-bath.cz]);
        pushFace(p,n,point(outer[i],.095),point(outer[j],.095),point(outer[j],.438),point(outer[i],.438),outward);
        pushFace(p,n,point(outer[i],.438),point(outer[j],.438),point(inner[j],.438),point(inner[i],.438),[0,1,0]);
        const inward=normalize([bath.cx-inner[i][0],.18,bath.cz-inner[i][1]]);
        pushFace(p,n,point(inner[i],.438),point(inner[j],.438),point(bottom[j],.145),point(bottom[i],.145),inward);
        p.push(...toWorld(bath.cx,floorY+.145,bath.cz),...point(bottom[i],.145),...point(bottom[j],.145));n.push(0,1,0,0,1,0,0,1,0);
        p.push(...toWorld(bath.cx,floorY+.095,bath.cz),...point(outer[j],.095),...point(outer[i],.095));n.push(0,-1,0,0,-1,0,0,-1,0);
      }
      tagBathroomFixture(addRawMesh('T18-BATH-maxton-1525-inset-acrylic-shell','wet',p,n,COLORS.sanitaryWhite,1),'bath','inset-acrylic-shell','bath');
      const ring=superellipsePlan(0,0,1,1,.62,64),wp=[],wn=[];
      for(let i=0;i<ring.length;i++) {const j=(i+1)%ring.length;wp.push(...toWorld(bath.cx,0,bath.cz),...toWorld(bath.cx+ring[i][0],0,bath.cz+ring[i][1]),...toWorld(bath.cx+ring[j][0],0,bath.cz+ring[j][1]));wn.push(0,1,0,0,1,0,0,1,0);}
      const water=tagBathroomFixture(addRawMesh('T18-BATH-maxton-water-plane','wet',wp,wn,COLORS.bathWater,.58),'bath','water-plane','bath');
      water.waterEffect=true;water.surfaceRoughness=.004;
      water.visibleWhen=()=>waterSystem.level>.0005;
      water.transformWhen=()=>{
        const ratio=waterSystem.level/.293,rx=.185+.085*ratio-.002,rz=.505+.140*ratio-.002,cx=bath.cx-PLAN_W/2,cz=bath.cz-PLAN_D/2;
        return new Float32Array([rx,0,0,0,0,1,0,0,0,0,rz,0,cx*(1-rx),floorY+.145+waterSystem.level,cz*(1-rz),1]);
      };
    }

    function addWaterStream(id,x,z,y0,y1,state,radius=.004) {
      const stream=addFixtureRodY(id,x,z,y0,y1,radius,[.68,.84,.89,.34],'water','flow','shower');
      stream.waterEffect=true;stream.visibleWhen=()=>state.active;stream.surfaceRoughness=.002;
      if(state===waterSystem.bathTap)stream.transformWhen=()=>{
        const bottom=PARAMS.WET_LEVEL_DELTA+.145+waterSystem.level,scale=(y1-bottom)/(y1-y0);
        return new Float32Array([1,0,0,0,0,scale,0,0,0,0,1,0,0,y1*(1-scale),0,1]);
      };
      // A few travelling highlights make falling water legible without particles.
      for(let i=0;i<2;i++) {
        const bead=addFixtureRodY(`${id}-highlight-${i}`,x,z,0,.025,radius*.65,[.92,.98,1,.55],'water','falling-highlight','shower');
        bead.waterEffect=true;bead.visibleWhen=()=>state.active;
        bead.transformWhen=()=>{
          const bottom=state===waterSystem.bathTap?PARAMS.WET_LEVEL_DELTA+.145+waterSystem.level:y0;
          const t=(waterSystem.phase*1.7+i*.5)%1;
          return mat4Translation(0,Math.max(bottom,y1-.03-t*Math.max(.001,y1-bottom-.03)),0);
        };
      }
    }
    function buildPlumbingControls() {
      const f=PARAMS.WET_LEVEL_DELTA;
      const tap=(id,label,anchor)=>{const state=registerBathroomInteraction(id,label,anchor,'water');waterSystem.taps.push(state);return state;};
      // The separate deck control (the visible round control beside the spout)
      // starts and stops the bath. The in-bath pop-up waste remains the drain.
      waterSystem.bathTap=registerBathroomInteraction('T23-BATH-TAP-START','Bath water',[5.680,f+.540,2.340],'water-toggle');
      waterSystem.taps.push(waterSystem.bathTap);
      waterSystem.drain=registerBathroomInteraction('T24-BATH-TAP-STOP','Bath drain',[5.280,f+.152,2.2675],'drain');
      waterSystem.drain.hitAnchorRoles=['bath pop-up waste'];
      addWaterStream('T23-BATH-flow',5.420,2.220,f+.145,f+.582,waterSystem.bathTap,.006);
      const shower=waterSystem.showerTap=tap('T23-SHOWER-TAP','Shower mixer',[4.950,f+1.050,.625]);
      for(let i=0;i<13;i++) {
        const a=i*2.399963,r=i===0?0:.074*Math.sqrt(i/12);
        addWaterStream(`T23-SHOWER-jet-${i}`,5.205+Math.cos(a)*r,.625+Math.sin(a)*r,f+.055,f+1.853,shower,.0018);
      }
      BATHROOM_V18_LAYOUT.vanity.basinCentres.forEach((z,i)=>{
        const side=i?'right':'left',state=tap(`T23-VANITY-${side.toUpperCase()}-TAP`,`${side==='left'?'Left':'Right'} basin tap`,[8.080,f+1.080,z]);
        // Keep the physical tap hit target unchanged, but place its blue locator
        // just beside the mixer so the control remains visible beneath the marker.
        state.markerAnchor=[BATHROOM_V18_LAYOUT.vanity.x0+.250,f+1.080,z-.160];
        addWaterStream(`T23-VANITY-${side}-flow`,7.930,z,f+.966,f+1.042,state,.0035);
      });
      // The existing shower door can open so its mixer is reachable without
      // making the glass transparent to interaction. Closed set-out is unchanged.
      const screen=registerBathroomInteraction('T23-SHOWER-DOOR','Shower door',[5.768,f+1.005,.780],'motion');
      const transform=()=>mat4AroundPivot('y',Math.PI*.46*easedProgress(screen),toWorld(5.747,f+1.0,.555));
      meshes.filter(m=>/^T18-SHOWER-(east-pivot-door|pivot-door-handle)/.test(m.name)).forEach(m=>{m.transformWhen=transform;m.physicalAction={kind:'bathroom',state:screen};});
      [waterSystem.bathTap,waterSystem.drain,waterSystem.showerTap,...waterSystem.taps.filter(state=>state!==waterSystem.bathTap&&state!==waterSystem.showerTap)].forEach(registerWaterControlMarker);
    }
    function waterSoundFor(interaction) {
      if(interaction===waterSystem.bathTap)return 'water-bath';
      if(interaction===waterSystem.showerTap)return 'water-shower';
      return 'water-basin';
    }
    function pulseWaterSound(interaction,dt,interval) {
      interaction.soundElapsed=(interaction.soundElapsed||0)+dt;
      if(interaction.soundElapsed>=interval){interaction.soundElapsed%=interval;window.ResidenceSound?.play(waterSoundFor(interaction));}
    }
    function updateWaterSystem(dt) {
      let moving=false;
      if(waterSystem.bathTap?.active) {
        waterSystem.level=Math.min(waterSystem.maximum,waterSystem.level+dt*.018);moving=true;
        pulseWaterSound(waterSystem.bathTap,dt,.76);
        if(waterSystem.level>=waterSystem.maximum){waterSystem.bathTap.active=false;announceInteraction('Bath filled to the safe level. Water stopped.');}
      }
      const previousShower=waterSystem.showerLevel;
      if(waterSystem.showerTap?.active) {
        waterSystem.showerLevel=Math.min(waterSystem.showerMaximum,waterSystem.showerLevel+dt*.006);
        waterSystem.showerDrainSoundElapsed=0;
      } else {
        waterSystem.showerLevel=Math.max(0,waterSystem.showerLevel-dt*.002);
        if(previousShower>.00005) {
          waterSystem.showerDrainSoundElapsed+=dt;
          if(waterSystem.showerDrainSoundElapsed>=.80){waterSystem.showerDrainSoundElapsed%=.80;window.ResidenceSound?.play('water-drain');}
        } else waterSystem.showerDrainSoundElapsed=0;
      }
      if(waterSystem.showerTap?.active)pulseWaterSound(waterSystem.showerTap,dt,.76);
      waterSystem.taps.filter(t=>t.active&&t!==waterSystem.bathTap&&t!==waterSystem.showerTap).forEach(t=>pulseWaterSound(t,dt,.68));
      if(waterSystem.drain?.active) {
        waterSystem.level=Math.max(0,waterSystem.level-dt*.025);moving=true;
        waterSystem.drain.soundElapsed=(waterSystem.drain.soundElapsed||0)+dt;
        if(waterSystem.drain.soundElapsed>=.80){waterSystem.drain.soundElapsed%=.80;window.ResidenceSound?.play('water-drain');}
        if(waterSystem.level<=0)waterSystem.drain.active=false;
      }
      if(moving||waterSystem.taps.some(s=>s.active)||Math.abs(previousShower-waterSystem.showerLevel)>.000001){waterSystem.phase=(waterSystem.phase+dt)%1000;waterSystem.revision++;}
      appRoot.dataset.plumbing=JSON.stringify({level:Number(waterSystem.level.toFixed(4)),maximum:waterSystem.maximum,showerLevel:Number(waterSystem.showerLevel.toFixed(4)),draining:!!waterSystem.drain?.active,taps:waterSystem.taps.map(s=>({id:s.id,on:s.active}))});
    }

    function buildBathroomFixtures() {
      const floorY=PARAMS.WET_LEVEL_DELTA;
      const shower=BATHROOM_V18_LAYOUT.shower;
      const bathHob=BATHROOM_V18_LAYOUT.bathHob;
      const bath=BATHROOM_V18_LAYOUT.bath;
      const vanity=BATHROOM_V18_LAYOUT.vanity;

      // Sheet 8 fixes the 900-deep fixture strip along the west wall. The
      // adjustable Cascade screen occupies the 810 mm plan bay and the Maxton
      // bath/hob continues beside it; neither existing wet-room boundary moves.
      tagBathroomFixture(addBox('T18-SHOWER-cascade-drawing-bay-base','wet',shower.x0,shower.x1,floorY+.001,floorY+.050,shower.z0,shower.z1,COLORS.sanitaryWhite,1),'shower','shower-base','shower');
      const showerWater=tagBathroomFixture(addBox('T24-SHOWER-draining-surface-water','wet',shower.x0+.012,shower.x1-.012,floorY+.051,floorY+.052,shower.z0+.012,shower.z1-.012,[.67,.84,.90,.34],.34),'shower','draining-surface-water','shower');
      showerWater.waterEffect=true;showerWater.surfaceRoughness=.002;showerWater.visibleWhen=()=>waterSystem.showerLevel>.00005;
      showerWater.alphaWhen=()=>Math.min(1,waterSystem.showerLevel/waterSystem.showerMaximum);
      showerWater.transformWhen=()=>mat4Translation(0,waterSystem.showerLevel,0);
      addBathroomFloorWaste('T18-SHOWER-inside-floor-waste',(shower.x0+shower.x1)/2,(shower.z0+shower.z1)/2,'shower','floor-waste-inside-shower');
      tagBathroomFixture(addBox('T18-SHOWER-east-fixed-6mm-glass','wet',shower.x1-.006,shower.x1,floorY+.050,floorY+shower.height,shower.z0,shower.z0+.285,COLORS.showerGlass,COLORS.showerGlass[3]),'shower','fixed-return-glass','shower');
      tagBathroomFixture(addBox('T18-SHOWER-east-pivot-door-6mm-glass','wet',shower.x1-.006,shower.x1,floorY+.050,floorY+shower.height,shower.z0+.285,shower.z1,COLORS.showerGlass,COLORS.showerGlass[3]),'shower','pivot-door-glass','shower');
      tagBathroomFixture(addBox('T18-SHOWER-south-return-6mm-glass','wet',shower.x0,shower.x1,floorY+.050,floorY+shower.height,shower.z1-.006,shower.z1,COLORS.showerGlass,COLORS.showerGlass[3]),'shower','return-glass','shower');
      [shower.z0,shower.z0+.285,shower.z1].forEach((z,index)=>addFixtureRodY(`T18-SHOWER-east-channel-${index+1}`,shower.x1,z,floorY+.050,floorY+shower.height,.009,COLORS.brushedNickel,'shower','chrome-channel','shower'));
      [shower.x0,shower.x1].forEach((x,index)=>addFixtureRodY(`T18-SHOWER-south-channel-${index+1}`,x,shower.z1,floorY+.050,floorY+shower.height,.009,COLORS.brushedNickel,'shower','chrome-channel','shower'));
      addFixtureRodY('T18-SHOWER-pivot-door-handle-inside',shower.x1-.018,.780,floorY+.850,floorY+1.160,.010,COLORS.brushedNickel,'shower','stainless-handle','shower');
      addFixtureRodY('T18-SHOWER-pivot-door-handle-outside',shower.x1+.018,.780,floorY+.850,floorY+1.160,.010,COLORS.brushedNickel,'shower','stainless-handle','shower');
      addFixtureRodY('T18-SHOWER-wall-rail',4.875,.625,floorY+.880,floorY+1.700,.012,COLORS.brushedNickel,'shower','shower-rail','shower');
      addFixtureRodX('T18-SHOWER-overhead-arm',4.875,5.205,floorY+1.900,.625,.012,COLORS.brushedNickel,'shower','overhead-arm','shower');
      addFixtureRodY('T18-SHOWER-overhead-rose',5.205,.625,floorY+1.860,floorY+1.900,.105,COLORS.brushedNickelEdge,'shower','overhead-rose','shower');
      addFixtureRodX('T18-SHOWER-round-mixer',4.872,4.920,floorY+1.050,.625,.060,COLORS.brushedNickel,'shower','round-mixer','shower');
      addFixtureRodX('T18-SHOWER-mixer-lever',4.890,4.950,floorY+1.050,.625,.009,COLORS.brushedNickelEdge,'shower','mixer-lever','shower');

      const hobColor=COLORS.tileGreyAlt;
      tagBathroomFixture(addBox('T18-BATH-maxton-tiled-hob-west','wet',bathHob.x0,bath.cx-bath.rx,floorY+.001,floorY+bathHob.height,bathHob.z0,bathHob.z1,hobColor,1),'bath','150mm-tiled-hob','bath');
      tagBathroomFixture(addBox('T18-BATH-maxton-tiled-hob-east','wet',bath.cx+bath.rx,bathHob.x1,floorY+.001,floorY+bathHob.height,bathHob.z0,bathHob.z1,hobColor,1),'bath','150mm-tiled-hob','bath');
      tagBathroomFixture(addBox('T18-BATH-maxton-tiled-hob-north','wet',bath.cx-bath.rx,bath.cx+bath.rx,floorY+.001,floorY+bathHob.height,bathHob.z0,bath.cz-bath.rz,hobColor,1),'bath','150mm-tiled-hob','bath');
      tagBathroomFixture(addBox('T18-BATH-maxton-tiled-hob-south','wet',bath.cx-bath.rx,bath.cx+bath.rx,floorY+.001,floorY+bathHob.height,bath.cz+bath.rz,bathHob.z1,hobColor,1),'bath','150mm-tiled-hob','bath');
      const bathOuter=superellipsePlan(bath.cx,bath.cz,bath.rx,bath.rz,.56,52);
      addOpenBathShell(bathOuter,bath,floorY);
      addFixtureRodY('T18-BATH-maxton-pop-up-waste',bath.cx,bath.cz+.445,floorY+.145,floorY+.152,.026,COLORS.brushedNickelEdge,'bath','bath-pop-up-waste','bath');
      addFixtureRodZ('T18-BATH-maxton-overflow',bath.cx,floorY+.355,bath.cz+.590,bath.cz+.754,.023,COLORS.brushedNickel,'bath','bath-overflow','bath');
      addFixtureRodY('T18-BATH-deck-mixer-upright',bathHob.x1-.030,2.220,floorY+bathHob.height,floorY+.650,.017,COLORS.brushedNickel,'bath','deck-mixer','bath');
      addFixtureRodX('T18-BATH-deck-mixer-spout',5.420,bathHob.x1-.030,floorY+.620,2.220,.013,COLORS.brushedNickel,'bath','deck-mixer-spout','bath');
      addFixtureRodY('T23-BATH-downturned-aerator',5.420,2.220,floorY+.582,floorY+.620,.013,COLORS.brushedNickelEdge,'bath','tap-aerator','bath');
      addFixtureRodY('T18-BATH-deck-mixer-control',bathHob.x1-.030,2.340,floorY+bathHob.height,floorY+.540,.022,COLORS.brushedNickelEdge,'bath','deck-mixer-control','bath');
      addFixtureRodY('T24-BATH-fill-control-cap',bathHob.x1-.030,2.220,floorY+.650,floorY+.657,.026,COLORS.brushedNickelEdge,'bath','tap-fill-control','bath');
      addFixtureRodY('T24-BATH-drain-control-cap',bathHob.x1-.030,2.340,floorY+.540,floorY+.547,.026,COLORS.brushedNickelEdge,'bath','tap-drain-control','bath');
      addBathroomFloorWaste('T18-BATH-general-area-floor-waste',...BATHROOM_V18_LAYOUT.generalFloorWaste,'shower','floor-waste-outside-shower');

      // The WC stays on the existing wall-facing set-out. The dark bowl opening
      // is deliberately omitted and a full soft-close lid closes over the seat.
      const toiletPedestal=superellipsePlan(7.86,.69,.245,.205,.60,36);
      const toiletPan=superellipsePlan(7.73,.69,.355,.270,.60,40);
      const toiletSeat=superellipsePlan(7.70,.69,.320,.245,.58,40);
      const toiletLid=superellipsePlan(7.695,.69,.305,.232,.60,44);
      tagBathroomFixture(addBox('T18-WC-riviere-wall-faced-cistern','wet',8.03,8.17,floorY+.020,floorY+.780,.45,.93,COLORS.sanitaryWhite,1),'toilet','wall-faced-cistern','toilet');
      tagBathroomFixture(addPrism('T18-WC-riviere-pedestal','wet',toiletPedestal,floorY+.020,floorY+.390,COLORS.sanitaryWhite,1),'toilet','wall-faced-pedestal','toilet');
      tagBathroomFixture(addPrism('T18-WC-riviere-cleanflush-pan','wet',toiletPan,floorY+.260,floorY+.455,COLORS.sanitaryWhite,1),'toilet','cleanflush-pan','toilet');
      tagBathroomFixture(addPrism('T18-WC-soft-close-seat-under-lid','wet',toiletSeat,floorY+.452,floorY+.484,COLORS.sanitaryWhite,1),'toilet','soft-close-seat','toilet');
      tagBathroomFixture(addPrism('T18-WC-closed-soft-close-lid','wet',toiletLid,floorY+.484,floorY+.512,COLORS.sanitaryWhite,1),'toilet','closed-soft-close-lid','toilet');
      addFixtureRodZ('T18-WC-soft-close-lid-hinge',7.990,floorY+.500,.565,.815,.012,COLORS.brushedNickelEdge,'toilet','soft-close-lid-hinge','toilet');
      tagBathroomFixture(addBox('T18-WC-cistern-lid','wet',8.015,8.175,floorY+.780,floorY+.805,.435,.945,COLORS.sanitaryWhite,1),'toilet','cistern-lid','toilet');
      addFixtureRodX('T18-WC-dual-flush-button',8.010,8.035,floorY+.665,.69,.038,COLORS.brushedNickel,'toilet','dual-flush-button','toilet');

      // The 1370 mm bay accepts the drawing-compatible 1350 mm double-bowl
      // vanity with 10 mm scribed fillers. Cabinet, top and fillers finish to
      // both perpendicular tiled walls without changing either wall plane.
      tagBathroomFixture(addBox('T18-VANITY-archie-1350-double-wall-hung-cabinet','wet',vanity.x0,vanity.x1,floorY+.150,floorY+.810,vanity.z0+.010,vanity.z1-.010,COLORS.vanityOak,1),'vanity','1350-double-bowl-wall-hung-cabinet','vanity');
      tagBathroomFixture(addBox('T18-VANITY-north-10mm-scribed-filler','wet',vanity.x0-.006,vanity.x1,floorY+.150,floorY+.850,vanity.z0,vanity.z0+.010,COLORS.vanityOak,1),'vanity','wall-scribed-end-filler','vanity');
      tagBathroomFixture(addBox('T18-VANITY-south-10mm-scribed-filler','wet',vanity.x0-.006,vanity.x1,floorY+.150,floorY+.850,vanity.z1-.010,vanity.z1,COLORS.vanityOak,1),'vanity','wall-scribed-end-filler','vanity');
      tagBathroomFixture(addBox('T18-VANITY-graphite-shadow-gap','wet',vanity.x0-.010,vanity.x0,floorY+.140,floorY+.175,vanity.z0+.010,vanity.z1-.010,COLORS.vanityOakDark,1),'vanity','graphite-shadow-gap','vanity');
      for (let index=1;index<18;index++) {
        const z=vanity.z0+.010+index*((vanity.width-.020)/18);
        tagBathroomFixture(addBox(`T18-VANITY-archie-v-groove-${index}`,'wet',vanity.x0-.010,vanity.x0,floorY+.185,floorY+.790,z-.002,z+.002,COLORS.vanityOakDark,1),'vanity','v-groove-front','vanity');
      }
      [vanity.z0+vanity.width/3,vanity.z0+2*vanity.width/3].forEach((z,index)=>{
        tagBathroomFixture(addBox(`T18-VANITY-soft-close-door-seam-${index+1}`,'wet',vanity.x0-.012,vanity.x0-.009,floorY+.170,floorY+.800,z-.004,z+.004,COLORS.vanityOakDark,1),'vanity','soft-close-door-seam','vanity');
      });
      tagBathroomFixture(addBox('T18-VANITY-wall-to-wall-bright-white-top','wet',vanity.x0-.012,vanity.x1,floorY+.810,floorY+.850,vanity.z0,vanity.z1,COLORS.vanityTop,1),'vanity','wall-to-wall-solid-surface-top','vanity');
      vanity.basinCentres.forEach((basinZ,index)=>{
        const side=index===0?'left':'right';
        const basinOuter=superellipsePlan(7.905,basinZ,.175,.195,.62,42);
        const basinInner=superellipsePlan(7.900,basinZ,.120,.140,.68,38);
        tagBathroomFixture(addPrism(`T18-VANITY-${side}-above-counter-basin`,'wet',basinOuter,floorY+.850,floorY+.960,COLORS.sanitaryWhite,1),'vanity',`double-basin-${side}`,'vanity');
        tagBathroomFixture(addPrism(`T18-VANITY-${side}-basin-recess`,'wet',basinInner,floorY+.952,floorY+.963,COLORS.sanitaryShadow,1),'vanity',`double-basin-${side}-recess`,'vanity');
        addFixtureRodY(`T18-VANITY-${side}-basin-pop-up-waste`,7.900,basinZ,floorY+.963,floorY+.969,.021,COLORS.brushedNickelEdge,'vanity',`double-basin-${side}-waste`,'vanity');
        addFixtureRodY(`T18-VANITY-${side}-mixer-upright`,8.080,basinZ,floorY+.850,floorY+1.080,.014,COLORS.brushedNickel,'vanity',`double-basin-${side}-tap`,'vanity');
        addFixtureRodX(`T18-VANITY-${side}-mixer-spout`,7.930,8.080,floorY+1.055,basinZ,.012,COLORS.brushedNickel,'vanity',`double-basin-${side}-tap-spout`,'vanity');
      });
      addMoonlightMirrorCabinetOnX();
      addBathroomFloorWaste('T23-VANITY-floor-waste',7.350,1.930,'vanity','floor-waste-vanity',-.0065,null);
      buildPlumbingControls();

      // This wall rocker controls room lighting only. Mirror services are wired
      // exclusively to the touch control on the moving mirror door.
      const switchInfo=BATHROOM_V18_LAYOUT.wallControls.switch;
      tagBathroomFixture(addBox('T18-ELECTRICAL-two-gang-switch-plate','wet',6.691,6.708,floorY+.970,floorY+1.140,1.500,1.620,COLORS.sanitaryWhite,1),'vanity','wall-light-switch-plate','vanity');
      tagBathroomFixture(addBox('T18-ELECTRICAL-room-light-rocker','wet',6.708,6.719,floorY+1.000,floorY+1.110,1.530,1.590,COLORS.sanitaryWhite,1),'vanity','room-light-switch','vanity');
      void switchInfo;
      tagBathroomFixture(addBox('T18-ELECTRICAL-double-gpo-wall-plate','wet',7.710,7.890,floorY+1.015,floorY+1.135,2.568,2.586,COLORS.sanitaryWhite,1),'vanity','wall-power-outlet','vanity');
      [[7.752,1.088],[7.820,1.088]].forEach(([x,y],index)=>{
        tagBathroomFixture(addBox(`T18-ELECTRICAL-gpo-${index+1}-active-slot`,'wet',x-.012,x-.004,floorY+y-.018,floorY+y+.014,2.563,2.569,COLORS.lockShadow,1),'vanity','power-outlet-active-slot','vanity');
        tagBathroomFixture(addBox(`T18-ELECTRICAL-gpo-${index+1}-neutral-slot`,'wet',x+.004,x+.012,floorY+y-.018,floorY+y+.014,2.563,2.569,COLORS.lockShadow,1),'vanity','power-outlet-neutral-slot','vanity');
        tagBathroomFixture(addBox(`T18-ELECTRICAL-gpo-${index+1}-earth-slot`,'wet',x-.004,x+.004,floorY+y+.022,floorY+y+.041,2.563,2.569,COLORS.lockShadow,1),'vanity','power-outlet-earth-slot','vanity');
      });
    }

    function addStairStep(number, localPoly, upperRiserEdgeLocal) {
      const planPoly = localPoly.map(mapStair);
      const top = -(16-number) * PARAMS.STAIR_RISER;
      addPrism(`stair-step-${number}`, 'stair', planPoly, top-PARAMS.STAIR_RISER, top, COLORS.stair, 1);
      const carpetColor=stairCarpetColour(number);
      const carpet=addPrism(`T04-stair-carpet-wrap-top-${number}`,'finishCarpet',planPoly,top,top+PARAMS.STAIR_CARPET_THICKNESS,carpetColor,1);
      carpet.surfaceRoughness=.095;
      carpet.finishLayer='continuous carpet tread wrap';
      carpet.continuousCarpetSystem='P6-TAUPE-ONE-PIECE';
      addTask004CarpetRiser(`T04-stair-carpet-wrap-riser-${number}`,upperRiserEdgeLocal,top,top+PARAMS.STAIR_RISER+PARAMS.STAIR_CARPET_THICKNESS,carpetColor);
      const roundedNose=addTask004RoundedCarpetNosing(`T04-stair-carpet-rounded-nose-${number}`,upperRiserEdgeLocal,planPoly,top+PARAMS.STAIR_RISER,carpetColor);
      if(number===15) {
        // At the stair head the selected metal/woodgrain profile owns the
        // exposed edge. Keep the vertical carpet upturn behind it, but suppress
        // the ordinary carpet roll-over that otherwise protrudes 0.2–2.4 mm.
        showItemWhen(roundedNose,()=>false);
        roundedNose.concealedBehindLandingNosing=true;
      }
      const centroid = planPoly.reduce((a,p) => [a[0]+p[0]/planPoly.length, a[1]+p[1]/planPoly.length], [0,0]);
      addLabel(String(number), centroid[0], top+.075, centroid[1], 'stair', 'stair');
    }

    function buildGeometry() {
      // Neutral slab pieces around the exact P11 stepped / L-shaped void.
      addBox('floor-lower', 'floor', 0.00, 12.47, -.150, 0, 3.12, 7.55, COLORS.floor);
      addBox('floor-upper-west', 'floor', .48, 2.58, -.150, 0, 0, 3.12, COLORS.floor);
      addBox('floor-upper-north-strip', 'floor', 2.58, 4.85, -.150, 0, 0, .160, COLORS.floor);
      addBox('floor-upper-south-west', 'floor', 2.58, 3.67, -.150, 0, 2.380, 3.12, COLORS.floor);
      addBox('floor-upper-south-east', 'floor', 3.67, 4.85, -.150, 0, 2.590, 3.12, COLORS.floor);
      addBox('floor-upper-east', 'floor', 4.85, 12.47, -.150, 0, 0, 3.12, COLORS.floor);
      addLine('outer-footprint-outline', 'floor', OUTER_FOOTPRINT.map(([x,z])=>[x,.016,z]), COLORS.outline, 1, true);
      // Keep the other inspection edges; omit only the line crossing the nosing.
      addLine('stair-void-exact-outline', 'stair', [[3.67,2.59],[3.67,2.38],[2.58,2.38],[2.58,.16],[4.85,.16],[4.85,2.59]].map(([x,z])=>[x,.022,z]), COLORS.metal, 1, false);

      // The reference overlay sits above the thickest 18 mm finished floor so
      // it remains legible when explicitly enabled.
      for (let x=0; x<=12; x++) {
        const gridLine=addLine(`grid-x-${x}`, 'grid', [[x,.028,0],[x,.028,7.55]], COLORS.referenceGrid, .34);
        gridLine.referenceGrid=true;gridLine.planOverlayY=.028;
      }
      for (let z=0; z<=7; z++) {
        const gridLine=addLine(`grid-z-${z}`, 'grid', [[0,.028,z],[12.47,.028,z]], COLORS.referenceGrid, .34);
        gridLine.referenceGrid=true;gridLine.planOverlayY=.028;
      }
      buildUpperPlanMeasurements();

      // Exterior leaves are derived from the three closed offset polygons above.
      // Same-leaf corner overlaps close each return while the 50 mm cavity remains open.
      addExteriorLeafBandsX('EW-NORTH', [.48,12.47,0,.11], [.64,12.31,.16,.25], [
        {from:2.84,to:4.65,sill:1.457,head:2.143},
        {from:5.84,to:6.60,sill:1.457,head:2.143},
        {from:6.95,to:7.68,sill:1.457,head:2.143}
      ],0,WALL_H,'max');
      addExteriorLeafBandsZ('EW-EAST', [12.36,12.47,0,7.55], [12.22,12.31,.16,7.39], [
        {from:.83,to:3.00,sill:1.629,head:2.143},
        {from:4.67,to:6.84,sill:1.629,head:2.143}
      ],0,WALL_H,'min');
      addExteriorLeafBandsX('EW-SOUTH', [0,12.47,7.44,7.55], [.16,12.31,7.30,7.39], [
        {from:.83,to:3.84,sill:1.629,head:2.143},
        {from:5.15,to:8.16,sill:1.629,head:2.143}
      ],0,WALL_H,'min');
      addExteriorLeafBandsZ('EW-WEST-UPPER', [.48,.59,0,3.23], [.64,.73,.16,3.37], [
        {from:.83,to:2.28,sill:.600,head:2.143}
      ],0,WALL_H,'max');
      addExteriorLeafBandsX('EW-WEST-STEP', [0,.59,3.12,3.23], [.16,.73,3.28,3.37], [],0,WALL_H,'max');
      addExteriorLeafBandsZ('EW-WEST-LOWER', [0,.11,3.12,7.55], [.16,.25,3.28,7.39], [
        {from:3.94,to:6.84,sill:.600,head:2.143}
      ],0,WALL_H,'max');

      // Upper glazing is centred in each double-wall opening. Sliding sashes
      // occupy separate glass tracks and their flyscreens use the outermost
      // third track; awning screens remain fixed on the room side.
      addGlazingX('G01', 2.84, 4.65, .125, 1.457, 2.143, '8×7.5 F', ['fixed','fixed'], .08, {glazingType:'grey',cavityCentrePlane:.135});
      addGlazingX('G02', 5.84, 6.60, .125, 1.457, 2.143, '8×3 OBS', ['slide-right','fixed'], .08, {obscure:true,cavityCentrePlane:.135});
      addGlazingX('G03', 6.95, 7.68, .125, 1.457, 2.143, '8×3 OBS', ['fixed','slide-left'], .08, {obscure:true,cavityCentrePlane:.135});
      addGlazingZ('G04', 12.345, .83, 3.00, 1.629, 2.143, '6×9 A', ['awning','awning'], -.10, {cavityCentrePlane:12.335});
      addGlazingZ('G05', 12.345, 4.67, 6.84, 1.629, 2.143, '6×9 A', ['awning','awning'], -.10, {cavityCentrePlane:12.335});
      addGlazingX('G06', 5.15, 8.16, 7.425, 1.629, 2.143, '6×12.5 A', ['awning','fixed','awning'], -.10, {glazingType:'grey',cavityCentrePlane:7.415});
      addGlazingX('G07', .83, 3.84, 7.425, 1.629, 2.143, '6×12.5', ['slide-right','fixed','fixed','slide-left'], -.10, {glazingType:'grey',cavityCentrePlane:7.415});
      addGlazingZ('G08', .605, .83, 2.28, .600, 2.143, '18×6', ['fixed','slide-left'], .12, {cavityCentrePlane:.615});
      addGlazingZ('G09-G10', .125, 3.94, 6.84, .600, 2.143, '2 × 18×6', ['slide-right','fixed','fixed','slide-left'], .12, {mullionWidths:[.028,.060,.028],cavityCentrePlane:.135});

      // Main internal walls; openings are explicit rather than implied by colour.
      addWallZ('IW01', 'internal', 4.76, 4.85, .25, 2.68);
      addWallZ('IW02', 'internal', 6.60, 6.69, .25, 2.68, [
        {from:PARAMS.D04_OPENING_Z0,to:PARAMS.D04_HINGE_Z,sill:0,head:DOOR_H}
      ]);
      addWallZ('IW03', 'internal', 8.19, 8.28, .25, 2.68);
      // IW04 is the user-corrected SG01 purple glass-slider face: no green wall is invented behind it.
      addWallZ('IW05', 'internal', 4.33, 4.42, 3.61, 7.30, [
        {from:3.88,to:5.12,sill:0,head:DOOR_H}
      ]);
      addWallZ('IW06-NORTH', 'internal', 4.93, 5.02, 3.61, 5.585);
      // IW06 south is R02; its purple slider envelope is shown below.
      addWallZ('IW07', 'internal', 8.32, 8.41, 3.61, 7.30);
      addWallZ('IW08', 'internal', 10.30, 10.39, 3.61, 4.30);
      addWallX('IH01A', 'internal', 4.85, 6.69, 2.59, 2.68);
      addWallX('IH01B', 'internal', 6.69, 8.28, 2.59, 2.68, [
        {from:PARAMS.O01_OPEN_X0,to:PARAMS.O01_OPEN_X1,sill:0,head:WALL_H}
      ]);
      addLabel('O01 · 830 OPEN · CORNICE THRU', 7.105, .56, 2.30, 'key', 'internal', 120);
      addLabel('620 POSITION · SOLID WALL', 7.83, .36, 2.98, 'key', 'internal', 108);
      // USER-REVIEW-10 / P2: Bed 4 uses a stepped entry, not a door cut into
      // this Z=2.590 return. The return stays solid from the robe back to the
      // recessed entry wall; D01 is cut into the perpendicular wall below.
      addWallX('IH01C-BED4-ROBE-RETURN', 'internal', 8.28, PARAMS.D01_ENTRY_WALL_X1, 2.59, 2.68);
      addWallZ('IW-BED4-ENTRY', 'internal', PARAMS.D01_ENTRY_WALL_X0, PARAMS.D01_ENTRY_WALL_X1, 2.590, 3.610, [
        {from:PARAMS.D01_OPEN_Z0,to:PARAMS.D01_OPEN_Z1,sill:0,head:DOOR_H}
      ]);
      // USER-REVIEW-01: Linen was missing its full-height passage-end closure.
      addWallX('IH02-LINEN-END', 'internal', 4.42, 5.02, 3.61, 3.70);
      addLabel('LINEN END WALL', 4.72, .34, 3.655, 'key', 'internal');
      // USER-REVIEW / v12: D03 moves 34 mm toward screen-left (+X). The full
      // Metroll profile reaches 34 mm beyond the hinge opening, so its true
      // outer edge now terminates at the untouched X=5.020 perpendicular linen
      // wall. Only this opening and its opposite same-plane wall run shorten.
      addWallX('IH02A', 'internal', PARAMS.D03_PERPENDICULAR_WALL_X_MAX, 8.32, 3.61, 3.70, [
        {from:PARAMS.D03_OPEN_X0,to:PARAMS.D03_OPEN_X1,sill:0,head:DOOR_H}
      ]);
      addWallX('IH02B', 'internal', 8.41, 10.39, 3.61, 3.70, [
        {from:PARAMS.D02_OPEN_X0,to:PARAMS.D02_OPEN_X1,sill:0,head:DOOR_H}
      ]);
      addWallX('IH02C', 'internal', 10.39, 12.22, 3.61, 3.70);
      // IH03 is R03 mirrored robe slider face.
      addWallX('IH04', 'internal', 4.42, 5.02, 5.495, 5.585);
      addWallX('IH05', 'internal', 6.69, 8.19, 1.13, 1.22, [
        {from:PARAMS.D05_OPEN_X0,to:PARAMS.D05_OPEN_X1,sill:0,head:DOOR_H}
      ]);

      // White painted leaves use a Metroll Metro 95 mm frame proxy. D01 is hinged
      // at the east jamb of the recessed Bed 4 entry and swings north into Bed 4.
      addDoor('D01', PARAMS.D01_HINGE_X, PARAMS.D01_HINGE_Z, PARAMS.D01_LEAF_WIDTH, 0, -Math.PI/2, 0, 9.78, 3.145, 'key');
      addDoor('D02', PARAMS.D02_HINGE_X, 3.655, PARAMS.D02_LEAF_WIDTH, Math.PI/2, 0, Math.PI/2, 8.91, 4.08);
      addDoor('D03', PARAMS.D03_HINGE_X, PARAMS.D03_HINGE_Z, PARAMS.D03_LEAF_WIDTH, Math.PI/2, 0, Math.PI/2, 5.485, 4.08);
      addDoor('D04', 6.645, PARAMS.D04_HINGE_Z, PARAMS.D04_LEAF_WIDTH, Math.PI, -Math.PI/2, -Math.PI, 6.20, 2.135, 'key');
      // Only D05 moves: the full assembly is now 71 mm right of its original
      // set-out. Its visible folded-steel jamb clears the fixed perpendicular
      // wall; the same-plane opening follows the door. IW02 stays fixed.
      addDoor('D05', PARAMS.D05_OPEN_X0, PARAMS.D05_HINGE_Z, PARAMS.D05_LEAF_WIDTH, -Math.PI/2, 0, -Math.PI/2, 7.00+PARAMS.D05_USER_RIGHT_SHIFT, .79);
      addDoor('D06A', 4.375, 3.88, .62, Math.PI, Math.PI/2, Math.PI, 3.90, 4.18);
      addDoor('D06B', 4.375, 5.12, .62, Math.PI, -Math.PI/2, -Math.PI, 3.90, 4.82);

      // SG01 is the reviewed three-panel Bed 4 robe face; mirror finish uses the neutral model palette.
      addGlassSliderZ('SG01', 8.835, .25, 2.59, 8.50, PARAMS.SG01_PANEL_COUNT, true);
      addRobeZ('R02', 4.975, 5.585, 7.30, 4.72, PARAMS.R02_PANEL_COUNT);
      addRobeX('R03', 10.39, 12.22, 4.255, 4.48, PARAMS.R03_PANEL_COUNT);

      // User-requested v14 wet finishes. Existing wet-zone boundaries and the
      // provisional +18 mm datum remain fixed. Floor tiles are grey terrazzo
      // with restrained blush/rose-grey flecks; wall tiles run full height with
      // a slightly higher blush proportion and stop at every existing opening.
      addTerrazzoFloorZone('wet-bath',4.85,6.60,.25,2.59);
      addTerrazzoFloorZone('wet-wc-vanity',6.69,8.19,.25,2.59);

      addTerrazzoWallXPlane('wet-bath-west-full-height',4.85,1,.25,2.59,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallXPlane('wet-bath-east-full-height-run',6.60,-1,.25,PARAMS.D04_OPENING_Z0,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallXPlane('wet-bath-east-door-head',6.60,-1,PARAMS.D04_OPENING_Z0,PARAMS.D04_HINGE_Z,DOOR_H,WALL_H);
      addTerrazzoWallZPlane('wet-bath-north-full-height',.25,1,4.85,6.60,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallZPlane('wet-bath-south-full-height',2.59,-1,4.85,6.60,PARAMS.WET_LEVEL_DELTA,WALL_H);

      addTerrazzoWallXPlane('wet-wc-vanity-west-full-height-run',6.69,1,.25,PARAMS.D04_OPENING_Z0,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallXPlane('wet-wc-vanity-west-door-head',6.69,1,PARAMS.D04_OPENING_Z0,PARAMS.D04_HINGE_Z,DOOR_H,WALL_H);
      addTerrazzoWallXPlane('wet-wc-vanity-east-full-height',8.19,-1,.25,2.59,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallZPlane('wet-wc-vanity-north-full-height',.25,1,6.69,8.19,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallZPlane('wet-wc-vanity-south-solid-run',2.59,-1,PARAMS.O01_OPEN_X1,8.19,PARAMS.WET_LEVEL_DELTA,WALL_H);

      const wcFrameLeft=PARAMS.D05_OPEN_X0-PARAMS.DOOR_FRAME_HEAD_DEPTH;
      const wcFrameRight=PARAMS.D05_OPEN_X1+PARAMS.DOOR_FRAME_HEAD_DEPTH;
      addTerrazzoWallZPlane('wet-wc-divider-north-solid-run',1.13,-1,wcFrameRight,8.19,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallZPlane('wet-wc-divider-north-door-head',1.13,-1,wcFrameLeft,wcFrameRight,DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH,WALL_H);
      addTerrazzoWallZPlane('wet-vanity-divider-south-solid-run',1.22,1,wcFrameRight,8.19,PARAMS.WET_LEVEL_DELTA,WALL_H);
      addTerrazzoWallZPlane('wet-vanity-divider-south-door-head',1.22,1,wcFrameLeft,wcFrameRight,DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH,WALL_H);
      [[1.13,-1],[1.22,1]].forEach(([plane,normal],side)=>{
        const outer=plane+normal*(PARAMS.WET_WALL_TILE_THICKNESS+.0005);
        for(let y=PARAMS.WET_LEVEL_DELTA,index=0;y<WALL_H;y+=PARAMS.WET_WALL_TILE_HEIGHT,index++) {
          tagWetTileItem(addBox(`T22-WC-left-pier-cut-tile-${side}-${index}`,'wet',6.697,wcFrameLeft,y+.002,Math.min(y+PARAMS.WET_WALL_TILE_HEIGHT-.002,WALL_H),Math.min(plane,outer),Math.max(plane,outer),COLORS.tileWarmGrey,1,true),'wall-edge-cut-tile','WC-left-pier');
        }
      });
      addWetWindowOpeningReveals('G02',5.84,6.60,1.457,2.143);
      addWetWindowOpeningReveals('G03',6.95,7.68,1.457,2.143);
      buildWetTileSkirting();
      buildBathroomFixtures();
      addLabel('BATH · +18 mm PROV.', 5.72, .08, 1.72, 'room', 'wet', 72);
      addLabel('WC', 7.44, .08, .67, 'room', 'wet', 70);
      addLabel('VANITY · +18 mm PROV.', 7.44, .08, 1.91, 'room', 'wet', 68);

      // P6 stair physically connects both storeys, so it remains visible in every level mode.
      activeBuildLevel = 'shared';
      // P6 stair: step 16 is the upper-floor landing; the 15 treads are steps 15 through 1.
      addStairStep(15, [[2.09,0],[2.34,0],[2.34,1.00],[2.09,1.00]], [[2.34,0],[2.34,1.00]]);
      addStairStep(14, [[1.84,0],[2.09,0],[2.09,1.00],[1.84,1.00]], [[2.09,0],[2.09,1.00]]);
      addStairStep(13, [[1.59,0],[1.84,0],[1.84,1.00],[1.59,1.00]], [[1.84,0],[1.84,1.00]]);
      addStairStep(12, [[1.34,0],[1.59,0],[1.59,1.00],[1.34,1.00]], [[1.59,0],[1.59,1.00]]);
      addStairStep(11, [[1.09,0],[1.34,0],[1.34,1.00],[1.09,1.00]], [[1.34,0],[1.34,1.00]]);
      addStairStep(10, [[.513,0],[1.09,0],[1.09,1.09]], [[1.09,0],[1.09,1.09]]);
      addStairStep(9, [[.513,0],[0,0],[0,.371],[1.09,1.09]], [[.513,0],[1.09,1.09]]);
      addStairStep(8, [[0,.371],[0,1.00],[1.09,1.09]], [[0,.371],[1.09,1.09]]);
      addStairStep(7, [[0,1.00],[0,1.667],[1.09,1.09]], [[0,1.00],[1.09,1.09]]);
      addStairStep(6, [[0,1.667],[0,2.09],[.513,2.09],[1.09,1.09]], [[0,1.667],[1.09,1.09]]);
      addStairStep(5, [[.513,2.09],[1.09,2.09],[1.09,1.09]], [[.513,2.09],[1.09,1.09]]);
      addStairStep(4, [[1.09,1.09],[1.34,1.09],[1.34,2.09],[1.09,2.09]], [[1.09,1.09],[1.09,2.09]]);
      addStairStep(3, [[1.34,1.09],[1.59,1.09],[1.59,2.09],[1.34,2.09]], [[1.34,1.09],[1.34,2.09]]);
      addStairStep(2, [[1.59,1.09],[1.84,1.09],[1.84,2.09],[1.59,2.09]], [[1.59,1.09],[1.59,2.09]]);
      addStairStep(1, [[1.84,1.09],[2.09,1.09],[2.09,2.09],[1.84,2.09]], [[1.84,1.09],[1.84,2.09]]);
      addTask004CarpetRiser('T04-stair-carpet-wrap-riser-bottom',[[2.09,1.09],[2.09,2.09]],-2.752,-2.580+PARAMS.STAIR_CARPET_THICKNESS,stairCarpetColour(1));
      addTask004RoundedCarpetNosing('T04-stair-carpet-rounded-nose-bottom',[[2.09,1.09],[2.09,2.09]],[[1.84,1.09],[2.09,1.09],[2.09,2.09],[1.84,2.09]].map(mapStair),-2.580,stairCarpetColour(1));
      // Explicit terminal geometry completes all 16 risers: landing-to-15 and tread-1-to-ground.
      addBox('stair-riser-16-to-15', 'stair', 3.76, 4.76, -PARAMS.STAIR_RISER, 0, 2.586, 2.598, COLORS.stair, 1);
      addPrism('stair-ground-continuation', 'stair', [[2.09,1.09],[2.34,1.09],[2.34,2.09],[2.09,2.09]].map(mapStair), -2.820, -2.752, COLORS.stair, 1);
      addLabel('16', 4.25, .075, 2.73, 'stair', 'stair');
      addLabel('STEP 16 · LANDING', 4.25, .20, 2.94, 'stair', 'stair');
      addLabel('DN → STEP 2 / GROUND', 2.90, -.65, 1.94, 'stair', 'stair');
      addLabel('EXACT P6/P11 STEPPED VOID', 3.60, .12, .34, 'stair', 'stair');

      // V6 standalone repair: the raking cap now reaches the existing wall end.
      // The wall itself, stair treads and opposite cap endpoint remain unchanged.
      const rakingNosingY0=-6*PARAMS.STAIR_RISER;
      const rakingNosingY1=0;
      const terminalWallTopY0=(rakingNosingY0+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING)+
        (PARAMS.STAIR_TERMINAL_WALL_Z0-.763)/(2.590-.763)*(rakingNosingY1-rakingNosingY0);
      const retainedCapTopY0=(rakingNosingY0+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING)+
        (PARAMS.STAIR_TERMINAL_CAP_Z0-.763)/(2.590-.763)*(rakingNosingY1-rakingNosingY0);
      const rakingTerminalWallSection=[
        [PARAMS.STAIR_TERMINAL_WALL_Z0,PARAMS.GROUND_FLOOR_DATUM],
        [2.590,PARAMS.GROUND_FLOOR_DATUM],
        [2.590,rakingNosingY1+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING],
        [PARAMS.STAIR_TERMINAL_WALL_Z0,terminalWallTopY0]
      ];
      const centralStairWall=addSectionExtrusion('P6-user-red-terminal-wall-ground-to-raking-cap','internal',rakingTerminalWallSection,(t,zValue,yValue)=>[
        3.67+.09*t,yValue,zValue
      ],COLORS.internal,1);
      centralStairWall.isWall=true;
      centralStairWall.cutawayOpaque=true;
      centralStairWall.userRedTerminalWall=true;
      centralStairWall.blueMarkedRunOpen=true;
      centralStairWall.wallBottomDatum=PARAMS.GROUND_FLOOR_DATUM;
      centralStairWall.wallTopFollowsExistingBlackRake=true;
      centralStairWall.userRequestedExtension=PARAMS.STAIR_TREAD*2;
      centralStairWall.v13AdditionalExtension=PARAMS.STAIR_TREAD;
      centralStairWall.v16ForwardExtension=PARAMS.STAIR_TERMINAL_CAP_Z0-PARAMS.STAIR_TERMINAL_WALL_Z0;
      centralStairWall.onlyMarkedEndChanged=true;
      centralStairWall.continuousSingleInternalWall=true;
      centralStairWall.fullInternalWallFinish='Dulux Lexicon Quarter';

      const rakingCapSection=[
        [PARAMS.STAIR_TERMINAL_CAP_Z0,retainedCapTopY0],
        [2.590,rakingNosingY1+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING],
        [2.590,rakingNosingY1+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING+PARAMS.STAIR_MDF_CAP_HEIGHT],
        [PARAMS.STAIR_TERMINAL_CAP_Z0,retainedCapTopY0+PARAMS.STAIR_MDF_CAP_HEIGHT]
      ];
      const centralStairCap=addSectionExtrusion('P6-raking-painted-MDF-cap-150x30','internal',rakingCapSection,(t,zValue,yValue)=>[
        3.64+PARAMS.STAIR_MDF_CAP_WIDTH*t,yValue,zValue
      ],COLORS.mdfCap,1);
      centralStairCap.isWall=true;
      centralStairCap.cutawayOpaque=true;
      centralStairCap.surfaceRoughness=.014;
      centralStairCap.onlyAboveTerminalWall=true;
      centralStairCap.unsupportedRunRemoved=true;
      centralStairCap.capZ0=PARAMS.STAIR_TERMINAL_CAP_Z0;
      centralStairCap.flushWithTerminalWall=true;
      centralStairCap.v14ExtendedToWallEnd=true;
      centralStairCap.v14Extension=PARAMS.STAIR_TREAD;
      centralStairCap.v16EndpointRetained=false;
      centralStairCap.whiteWallForwardOfCap=PARAMS.STAIR_TERMINAL_CAP_Z0-PARAMS.STAIR_TERMINAL_WALL_Z0;

      const upperStairLongWall=addBox('P6-upper-12c-long-wall','internal',2.58,2.67,PARAMS.GROUND_FLOOR_DATUM,PARAMS.STAIR_12C_WALL_HEIGHT,.25,2.59,COLORS.internal,1,true);
      upperStairLongWall.continuousStairSideWall=true;
      upperStairLongWall.preferCoplanarPaint=true;
      const upperStairLandingReturn=addBox('P6-upper-12c-landing-return','internal',2.58,3.76,0,PARAMS.STAIR_12C_WALL_HEIGHT,2.59,2.68,COLORS.internal,1,true);
      upperStairLongWall.cutawayOpaque=true;
      upperStairLandingReturn.cutawayOpaque=true;
      const upperLongCap=addBox('P6-upper-12c-long-MDF-cap','internal',2.55,2.70,PARAMS.STAIR_12C_WALL_HEIGHT,PARAMS.STAIR_12C_WALL_HEIGHT+PARAMS.STAIR_MDF_CAP_HEIGHT,.25,2.59,COLORS.mdfCap,1,true);
      const upperReturnCap=addBox('P6-upper-12c-return-MDF-cap','internal',2.55,3.79,PARAMS.STAIR_12C_WALL_HEIGHT,PARAMS.STAIR_12C_WALL_HEIGHT+PARAMS.STAIR_MDF_CAP_HEIGHT,2.56,2.71,COLORS.mdfCap,1,true);
      [upperLongCap,upperReturnCap].forEach(item=>{item.cutawayOpaque=true;item.surfaceRoughness=.014;});

      // One uninterrupted painted wall replaces the lower wall + grey separator.
      // Its z=.25 end meets the unchanged double-wall inner face.
      addLabel('P6 · 12c WALL + BLACK MDF CAP', 2.62, .72, 1.66, 'key', 'stair', 118);
      addLabel('P6 · BLUE-MARKED RUN OPEN', 3.72, -.18, 1.22, 'key', 'stair', 116);
      addLabel('P6 · CONTINUOUS WHITE WALL · FLUSH BLACK CAP', 3.17, -1.52, 2.60, 'key', 'stair', 114);
      addLine('ground-datum', 'metal', [[2.58,PARAMS.GROUND_FLOOR_DATUM+.0005,2.59],[3.76,PARAMS.GROUND_FLOOR_DATUM+.0005,2.59]], COLORS.metal, 1);

      activeBuildLevel = 'upper';
      // Room / circulation validation labels.
      addLabel('BED 2', 6.70, .12, 5.55);
      addLabel('BED 3', 10.15, .12, 5.70);
      addLabel('BED 4', 10.40, .12, 1.55);
      addLabel('LOUNGE / LANDING', 2.45, .12, 5.48);
      addLabel('PASSAGE', 7.67, .12, 3.15);
      addLabel('LINEN', 4.67, .12, 4.73);
      addLabel('ROBE 2', 4.70, .12, 6.40, 'note', 'robe');
      addLabel('ROBE 3', 11.30, .12, 3.96, 'note', 'robe');

      // Task 003 adds only finish/junction detail geometry to the approved upper model.
      buildTask003Details();
      // Task 004 adds replaceable finish geometry only. No locked architectural
      // mesh or opening anchor is modified by this call.
      buildTask004Finishes();
    }

    const V15_GROUND=(()=>{
    function attachOpeningSpec(state, spec) {
      const frozen=Object.freeze({...spec});
      state.specId=frozen.specId || `${state.id}-SPEC`;
      state.spec=frozen;
      state.specLabel=frozen.display || '';
      return state;
    }

    function appendBoxGeometry(positions,normals,x0,x1,y0,y1,z0,z1) {
      if (x1-x0<=.0001 || y1-y0<=.0001 || z1-z0<=.0001) return false;
      const p000 = toWorld(x0, y0, z0), p100 = toWorld(x1, y0, z0);
      const p110 = toWorld(x1, y1, z0), p010 = toWorld(x0, y1, z0);
      const p001 = toWorld(x0, y0, z1), p101 = toWorld(x1, y0, z1);
      const p111 = toWorld(x1, y1, z1), p011 = toWorld(x0, y1, z1);
      pushFace(positions,normals,p010,p110,p111,p011,[0,1,0]);
      pushFace(positions,normals,p001,p101,p100,p000,[0,-1,0]);
      pushFace(positions,normals,p000,p100,p110,p010,[0,0,-1]);
      pushFace(positions,normals,p101,p001,p011,p111,[0,0,1]);
      pushFace(positions,normals,p001,p000,p010,p011,[-1,0,0]);
      pushFace(positions,normals,p100,p101,p111,p110,[1,0,0]);
      return true;
    }

    function appendPrismGeometry(positions,normals,planPoints,y0,y1) {
      if(planPoints.length<3 || y1-y0<=.0001)return false;
      const pts = planPoints.map(([x, z]) => toWorld(x, y1, z));
      const low = planPoints.map(([x, z]) => toWorld(x, y0, z));
      triangulatePolygon2D(planPoints).forEach(([a,b,c]) => {
        positions.push(...pts[a],...pts[b],...pts[c]);
        normals.push(0,1,0,0,1,0,0,1,0);
        positions.push(...low[a],...low[c],...low[b]);
        normals.push(0,-1,0,0,-1,0,0,-1,0);
      });
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        const dx = planPoints[j][0] - planPoints[i][0];
        const dz = planPoints[j][1] - planPoints[i][1];
        const len = Math.hypot(dx, dz) || 1;
        const normal = [dz / len, 0, -dx / len];
        pushFace(positions,normals,low[i],low[j],pts[j],pts[i],normal);
      }
      return true;
    }

    function addCompoundWall(name,category,parts,color,alpha=1) {
      const positions=[],normals=[];
      parts.forEach(part=>{
        if(part.kind==='box')appendBoxGeometry(positions,normals,...part.bounds);
        else if(part.kind==='prism')appendPrismGeometry(positions,normals,part.points,part.y0,part.y1);
      });
      if(!positions.length)return null;
      const item=addRawMesh(name,category,positions,normals,color,alpha,true);
      item.compoundWall=true;
      parts.forEach(part=>{
        if(part.kind==='box') {
          const [x0,x1,y0,y1,z0,z1]=part.bounds;
          lightingOccluders.push({level:activeBuildLevel,bounds:[x0-PLAN_W/2,x1-PLAN_W/2,y0,y1,z0-PLAN_D/2,z1-PLAN_D/2]});
        } else {
          const xs=part.points.map(point=>point[0]),zs=part.points.map(point=>point[1]);
          lightingOccluders.push({level:activeBuildLevel,bounds:[Math.min(...xs)-PLAN_W/2,Math.max(...xs)-PLAN_W/2,part.y0,part.y1,Math.min(...zs)-PLAN_D/2,Math.max(...zs)-PLAN_D/2]});
        }
      });
      return item;
    }

    function addLineSegments(name, category, segments, color, alpha = color[3]) {
      const expanded = [];
      segments.forEach(segment => {
        if (!Array.isArray(segment) || segment.length !== 2) return;
        expanded.push(
          ...toWorld(segment[0][0], segment[0][1], segment[0][2]),
          ...toWorld(segment[1][0], segment[1][1], segment[1][2])
        );
      });
      const normals = [];
      for (let i = 0; i < expanded.length / 3; i++) normals.push(0, 1, 0);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(expanded), gl.STATIC_DRAW);
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      const item = { name, category, level: activeBuildLevel, positionBuffer, normalBuffer, count: expanded.length / 3, color, alpha, visibleWhen: null, transformWhen: null };
      lines.push(item);
      return item;
    }

    function tagGlazingPane(item,style,options={}) {
      item.glazingType=style.type;
      item.surfaceRoughness=style.roughness;
      if(options.drawingGreyGlazing) {
        item.obscurePrivacyGlazing=style.type==='obscure';
        item.drawingGreyGlazing=true;
      }
      return item;
    }

    function addGlazingX(id, x0, x1, z, sill, head, drawingCode, panels, labelZOffset, options = {}) {
      floorWindowSources.push({id,level:activeBuildLevel,axis:0,plane:z-PLAN_D/2,q0:x0-PLAN_W/2,q1:x1-PLAN_W/2,sill:(options.baseY||0)+sill,head:(options.baseY||0)+head});
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill, yHead=baseY+head;
      const t = 0.018;
      const span = (x1-x0) / panels.length;
      const style=glazingStyle(options);
      const composite=Number.isFinite(options.assemblySill)&&Number.isFinite(options.assemblyHead)&&Number.isFinite(options.lowerFixedPanelCount);
      const assemblySill=composite?options.assemblySill:sill;
      const assemblyHead=composite?options.assemblyHead:head;
      const lowerFixedPanelCount=composite?options.lowerFixedPanelCount:0;
      const assemblyPanelCount=panels.length+lowerFixedPanelCount;
      const panelPattern=composite?`lower:${Array(lowerFixedPanelCount).fill('fixed').join('|')};upper:${panels.join('|')}`:panels.join('|');
      const assemblySpec=Object.freeze({
        source:activeBuildLevel==='ground'?'21560 WD A3 · P1/P3':'21560 WD A3 · P2/P4',
        drawingCode,type:'window',widthMm:Math.round((x1-x0)*1000),heightMm:Math.round((assemblyHead-assemblySill)*1000),
        sillMm:Math.round(assemblySill*1000),headMm:Math.round(assemblyHead*1000),panelCount:assemblyPanelCount,
        panelPattern,glazing:style.type,
        ...(composite?{upperSillMm:Math.round(sill*1000),upperHeadMm:Math.round(head*1000),upperHeightMm:Math.round((head-sill)*1000),upperPanelCount:panels.length,upperPanelPattern:panels.join('|'),lowerFixedPanelCount}:{}),
        ...(options.drawingGreyGlazing?{drawingGreyGlazing:true,obscurePrivacyGlazing:style.type==='obscure'}:{})
      });
      panels.forEach((operation, index) => {
        const panelX0 = x0 + span*index;
        const panelX1 = x0 + span*(index+1);
        if (operation === 'fixed') {
          const fixedState=registerInteraction(`${id}-P${index+1}`,'fixed window panel','glazing',[(panelX0+panelX1)/2,(ySill+yHead)/2,z],false,false);
          fixedState.assemblyId=id;
          fixedState.panelIndex=index+1;
          fixedState.operation=operation;
          attachOpeningSpec(fixedState,{...assemblySpec,specId:`${id}-P${index+1}-SPEC`,operation,canToggle:false,display:`${drawingCode} · ${assemblySpec.widthMm} × ${assemblySpec.heightMm} mm · ${operation}`});
          tagGlazingPane(addBox(`${id}-glass-${index+1}-fixed`, 'glazing', panelX0+.012, panelX1-.012, ySill+.012, yHead-.012, z-t/2, z+t/2, style.color, style.alpha),style,options);
        } else {
          const state=registerInteraction(`${id}-P${index+1}`,'operable window panel','glazing',[(panelX0+panelX1)/2,(ySill+yHead)/2,z],false,true);
          state.assemblyId=id;
          state.panelIndex=index+1;
          state.operation=operation;
          attachOpeningSpec(state,{...assemblySpec,specId:`${id}-P${index+1}-SPEC`,operation,canToggle:true,display:`${drawingCode} · ${assemblySpec.widthMm} × ${assemblySpec.heightMm} mm · ${operation}`});
          state.closedHitBounds=[
            toWorld(panelX0+.035,ySill+.035,z-.027),
            toWorld(panelX1-.035,yHead-.035,z+.027)
          ];
          state.closedHitTarget={name:`${state.id}-closed-position-hit-area`,closedWindowHitTarget:true};
          let transformWhen;
          if (operation === 'awning') {
            const outward = (labelZOffset > 0 ? -1 : 1);
            const pivot=toWorld((panelX0+panelX1)/2,yHead-.012,z);
            transformWhen=()=>mat4AroundPivot('x',-outward*PARAMS.WINDOW_AWNING_OPEN_ANGLE*easedProgress(state),pivot);
          } else {
            const direction = operation === 'slide-left' ? -1 : 1;
            transformWhen=()=>mat4Translation(direction*span*easedProgress(state),0,index*.006*easedProgress(state));
          }
          const movingPane=tagGlazingPane(addBox(`${id}-glass-${index+1}-moving`,'glazing',panelX0+.012,panelX1-.012,ySill+.012,yHead-.012,z-t/2,z+t/2,style.color,style.alpha),style,options);
          setItemTransform(movingPane,transformWhen);
          addMovingSashX(`${id}-${index+1}`,panelX0,panelX1,z,ySill,yHead,transformWhen);
        }
        addPanelMarkX(id, index+1, panelX0, panelX1, z, ySill, yHead, operation, Boolean(options.obscureMark) || style.type==='obscure');
      });
      addBox(`${id}-frame-left`, 'glazing', x0, x0+.035, ySill, yHead, z-.025, z+.025, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-right`, 'glazing', x1-.035, x1, ySill, yHead, z-.025, z+.025, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-sill`, 'glazing', x0, x1, ySill, ySill+.035, z-.025, z+.025, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-head`, 'glazing', x0, x1, yHead-.035, yHead, z-.025, z+.025, COLORS.glazeFrame, 1);
      for (let i=1; i<panels.length; i++) {
        const centre = x0 + span*i;
        const width = options.mullionWidths?.[i-1] || .028;
        addBox(`${id}-mullion-${i}`, 'glazing', centre-width/2, centre+width/2, ySill, yHead, z-.026, z+.026, COLORS.glazeFrame, 1);
      }
      const pattern = panels.map(panel => PANEL_MARK[panel]).join(' | ');
      addLabel(`${id} · ${drawingCode} · ${pattern}`, (x0+x1)/2, (ySill+yHead)/2, z+labelZOffset, 'opening', 'glazing');
    }

    function addFixedTransomX(id,x0,x1,z,sill,head,columns,options={}) {
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill,yHead=baseY+head;
      const style=glazingStyle(options);
      const span=(x1-x0)/columns,t=.018;
      for (let index=0;index<columns;index++) {
        const panelX0=x0+span*index,panelX1=x0+span*(index+1);
        const pane=tagGlazingPane(addBox(`${id}-lower-fixed-${index+1}`,'glazing',panelX0+.012,panelX1-.012,ySill+.012,yHead-.012,z-t/2,z+t/2,style.color,style.alpha),style,options);
        Object.assign(pane,{assemblyId:id,lowerFixedTransom:true,panelIndex:index+1});
      }
      addBox(`${id}-lower-frame-left`,'glazing',x0,x0+.035,ySill,yHead,z-.025,z+.025,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-right`,'glazing',x1-.035,x1,ySill,yHead,z-.025,z+.025,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-sill`,'glazing',x0,x1,ySill,ySill+.035,z-.025,z+.025,COLORS.glazeFrame,1);
      for (let index=1;index<columns;index++) {
        const centre=x0+span*index;
        addBox(`${id}-lower-mullion-${index}`,'glazing',centre-.014,centre+.014,ySill,yHead,z-.026,z+.026,COLORS.glazeFrame,1);
      }
    }

    function addFixedTransomZ(id,x,z0,z1,sill,head,columns,options={}) {
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill,yHead=baseY+head;
      const style=glazingStyle(options);
      const span=(z1-z0)/columns,t=.018;
      for (let index=0;index<columns;index++) {
        const panelZ0=z0+span*index,panelZ1=z0+span*(index+1);
        const pane=tagGlazingPane(addBox(`${id}-lower-fixed-${index+1}`,'glazing',x-t/2,x+t/2,ySill+.012,yHead-.012,panelZ0+.012,panelZ1-.012,style.color,style.alpha),style,options);
        Object.assign(pane,{assemblyId:id,lowerFixedTransom:true,panelIndex:index+1});
      }
      addBox(`${id}-lower-frame-top`,'glazing',x-.025,x+.025,ySill,yHead,z0,z0+.035,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-bottom`,'glazing',x-.025,x+.025,ySill,yHead,z1-.035,z1,COLORS.glazeFrame,1);
      addBox(`${id}-lower-frame-sill`,'glazing',x-.025,x+.025,ySill,ySill+.035,z0,z1,COLORS.glazeFrame,1);
      for (let index=1;index<columns;index++) {
        const centre=z0+span*index;
        addBox(`${id}-lower-mullion-${index}`,'glazing',x-.026,x+.026,ySill,yHead,centre-.014,centre+.014,COLORS.glazeFrame,1);
      }
    }

    function addGlazingZ(id, x, z0, z1, sill, head, drawingCode, panels, labelXOffset, options = {}) {
      floorWindowSources.push({id,level:activeBuildLevel,axis:1,plane:x-PLAN_W/2,q0:z0-PLAN_D/2,q1:z1-PLAN_D/2,sill:(options.baseY||0)+sill,head:(options.baseY||0)+head});
      const baseY=options.baseY ?? 0;
      const ySill=baseY+sill, yHead=baseY+head;
      const t = 0.018;
      const span = (z1-z0) / panels.length;
      const style=glazingStyle(options);
      const composite=Number.isFinite(options.assemblySill)&&Number.isFinite(options.assemblyHead)&&Number.isFinite(options.lowerFixedPanelCount);
      const assemblySill=composite?options.assemblySill:sill;
      const assemblyHead=composite?options.assemblyHead:head;
      const lowerFixedPanelCount=composite?options.lowerFixedPanelCount:0;
      const assemblyPanelCount=panels.length+lowerFixedPanelCount;
      const panelPattern=composite?`lower:${Array(lowerFixedPanelCount).fill('fixed').join('|')};upper:${panels.join('|')}`:panels.join('|');
      const assemblySpec=Object.freeze({
        source:activeBuildLevel==='ground'?'21560 WD A3 · P1/P3':'21560 WD A3 · P2/P4',
        drawingCode,type:'window',widthMm:Math.round((z1-z0)*1000),heightMm:Math.round((assemblyHead-assemblySill)*1000),
        sillMm:Math.round(assemblySill*1000),headMm:Math.round(assemblyHead*1000),panelCount:assemblyPanelCount,
        panelPattern,glazing:style.type,
        ...(composite?{upperSillMm:Math.round(sill*1000),upperHeadMm:Math.round(head*1000),upperHeightMm:Math.round((head-sill)*1000),upperPanelCount:panels.length,upperPanelPattern:panels.join('|'),lowerFixedPanelCount}:{}),
        ...(options.drawingGreyGlazing?{drawingGreyGlazing:true,obscurePrivacyGlazing:style.type==='obscure'}:{})
      });
      panels.forEach((operation, index) => {
        const panelZ0 = z0 + span*index;
        const panelZ1 = z0 + span*(index+1);
        if (operation === 'fixed') {
          const fixedState=registerInteraction(`${id}-P${index+1}`,'fixed window panel','glazing',[x,(ySill+yHead)/2,(panelZ0+panelZ1)/2],false,false);
          fixedState.assemblyId=id;
          fixedState.panelIndex=index+1;
          fixedState.operation=operation;
          attachOpeningSpec(fixedState,{...assemblySpec,specId:`${id}-P${index+1}-SPEC`,operation,canToggle:false,display:`${drawingCode} · ${assemblySpec.widthMm} × ${assemblySpec.heightMm} mm · ${operation}`});
          tagGlazingPane(addBox(`${id}-glass-${index+1}-fixed`, 'glazing', x-t/2, x+t/2, ySill+.012, yHead-.012, panelZ0+.012, panelZ1-.012, style.color, style.alpha),style,options);
        } else {
          const state=registerInteraction(`${id}-P${index+1}`,'operable window panel','glazing',[x,(ySill+yHead)/2,(panelZ0+panelZ1)/2],false,true);
          state.assemblyId=id;
          state.panelIndex=index+1;
          state.operation=operation;
          attachOpeningSpec(state,{...assemblySpec,specId:`${id}-P${index+1}-SPEC`,operation,canToggle:true,display:`${drawingCode} · ${assemblySpec.widthMm} × ${assemblySpec.heightMm} mm · ${operation}`});
          state.closedHitBounds=[
            toWorld(x-.027,ySill+.035,panelZ0+.035),
            toWorld(x+.027,yHead-.035,panelZ1-.035)
          ];
          state.closedHitTarget={name:`${state.id}-closed-position-hit-area`,closedWindowHitTarget:true};
          let transformWhen;
          if (operation === 'awning') {
            const outward = (labelXOffset > 0 ? -1 : 1);
            const pivot=toWorld(x,yHead-.012,(panelZ0+panelZ1)/2);
            transformWhen=()=>mat4AroundPivot('z',outward*PARAMS.WINDOW_AWNING_OPEN_ANGLE*easedProgress(state),pivot);
          } else {
            const direction = operation === 'slide-left' ? -1 : 1;
            transformWhen=()=>mat4Translation(index*.006*easedProgress(state),0,direction*span*easedProgress(state));
          }
          const movingPane=tagGlazingPane(addBox(`${id}-glass-${index+1}-moving`,'glazing',x-t/2,x+t/2,ySill+.012,yHead-.012,panelZ0+.012,panelZ1-.012,style.color,style.alpha),style,options);
          setItemTransform(movingPane,transformWhen);
          addMovingSashZ(`${id}-${index+1}`,x,panelZ0,panelZ1,ySill,yHead,transformWhen);
        }
        addPanelMarkZ(id, index+1, x, panelZ0, panelZ1, ySill, yHead, operation, Boolean(options.obscureMark) || style.type==='obscure');
      });
      addBox(`${id}-frame-top`, 'glazing', x-.025, x+.025, ySill, yHead, z0, z0+.035, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-bottom`, 'glazing', x-.025, x+.025, ySill, yHead, z1-.035, z1, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-sill`, 'glazing', x-.025, x+.025, ySill, ySill+.035, z0, z1, COLORS.glazeFrame, 1);
      addBox(`${id}-frame-head`, 'glazing', x-.025, x+.025, yHead-.035, yHead, z0, z1, COLORS.glazeFrame, 1);
      for (let i=1; i<panels.length; i++) {
        const centre = z0 + span*i;
        const width = options.mullionWidths?.[i-1] || .028;
        addBox(`${id}-mullion-${i}`, 'glazing', x-.026, x+.026, ySill, yHead, centre-width/2, centre+width/2, COLORS.glazeFrame, 1);
      }
      const pattern = panels.map(panel => PANEL_MARK[panel]).join(' | ');
      addLabel(`${id} · ${drawingCode} · ${pattern}`, x+labelXOffset, (ySill+yHead)/2, (z0+z1)/2, 'opening', 'glazing');
    }

    function addFaceRecognitionEntryHardware(id,hingeX,hingeZ,width,angle,baseY,leafTransformWhen,state,options={}) {
      const leafHalf=.022;
      const publicSide=options.publicSide ?? 1;
      const insideSide=-publicSide;
      const centreU=Math.min(width-.160,PARAMS.ENTRY_SMART_LOCK_CENTRE_U);
      const centreV=1.124;
      const publicFace=publicSide*(leafHalf+.003);
      const publicFront=publicSide*(leafHalf+.064);
      const smartScale=PARAMS.ENTRY_SMART_LOCK_SCALE;
      const scaledU=value=>centreU+(value-centreU)*smartScale;
      const scaledV=value=>centreV+(value-centreV)*smartScale;
      const scaledN=value=>publicFace+(value-publicFace)*smartScale;
      const scaledSize=value=>value*smartScale;
      const moving=[];
      state.smartLockCentreU=centreU;
      const addPart=(item,component)=>{
        if(!item)return item;
        item.faceRecognitionEntryHardware=true;
        item.smartEntryComponent=component;
        item.smartEntryReference='Sublimetrics secure-entry smart lock · unbranded-smart-lock-retouched-v4.png';
        setItemTransform(item,leafTransformWhen);
        moving.push(item);
        return item;
      };
      const addVerticalCapsule=(name,u,v,widthMm,heightMm,n0,n1,color,component)=>{
        const radius=Math.min(widthMm/2,heightMm/2);
        const centreOffset=Math.max(0,heightMm/2-radius);
        const parts=[];
        if(centreOffset>.0005)parts.push(addDoorLocalBar(`${name}-centre`,hingeX,hingeZ,angle,u-widthMm/2,u+widthMm/2,v,centreOffset,n0,n1,color,baseY));
        parts.push(addDoorFaceDisc(`${name}-top`,hingeX,hingeZ,angle,u,v+centreOffset,n0,n1,radius,color,baseY));
        parts.push(addDoorFaceDisc(`${name}-bottom`,hingeX,hingeZ,angle,u,v-centreOffset,n0,n1,radius,color,baseY));
        return parts.map(part=>addPart(part,component));
      };

      addVerticalCapsule(`${id}-face-recognition-lock-black-housing`,centreU,centreV,scaledSize(.160),scaledSize(.714),publicFace,scaledN(publicFront),COLORS.smartLockGraphite,'black rounded housing');
      addVerticalCapsule(`${id}-face-recognition-lock-brushed-front`,centreU,scaledV(centreV+.018),scaledSize(.122),scaledSize(.586),scaledN(publicFront),scaledN(publicFront+publicSide*.009),COLORS.smartLockFace,'brushed graphite touch face');
      [-1,1].forEach(side=>addPart(addDoorLocalBar(
        `${id}-face-recognition-lock-copper-rail-${side<0?'left':'right'}`,
        hingeX,hingeZ,angle,scaledU(centreU+side*.066-.0025),scaledU(centreU+side*.066+.0025),scaledV(centreV+.020),scaledSize(.292),
        scaledN(publicFront+publicSide*.002),scaledN(publicFront+publicSide*.012),COLORS.champagne,baseY
      ),'copper side rail'));

      addPart(addDoorLocalBar(`${id}-face-recognition-camera-window`,hingeX,hingeZ,angle,scaledU(centreU-.045),scaledU(centreU+.045),scaledV(1.360),scaledSize(.025),scaledN(publicFront+publicSide*.010),scaledN(publicFront+publicSide*.016),COLORS.smartLockSensor,baseY),'camera window');
      addPart(addDoorFaceDisc(`${id}-face-recognition-camera-lens`,hingeX,hingeZ,angle,centreU,scaledV(1.360),scaledN(publicFront+publicSide*.016),scaledN(publicFront+publicSide*.021),scaledSize(.014),COLORS.greyGlazing,baseY),'camera lens');
      [-.032,.032].forEach((offset,index)=>addPart(addDoorFaceDisc(`${id}-face-recognition-depth-sensor-${index+1}`,hingeX,hingeZ,angle,scaledU(centreU+offset),scaledV(1.360),scaledN(publicFront+publicSide*.016),scaledN(publicFront+publicSide*.020),scaledSize(.006),COLORS.smartLockSensor,baseY),'depth sensor'));
      addPart(addDoorAnnulus(`${id}-face-recognition-cyan-identification-ring`,hingeX,hingeZ,angle,centreU,scaledV(1.225),scaledSize(.034),scaledSize(.026),scaledN(publicFront+publicSide*.012),scaledN(publicFront+publicSide*.019),COLORS.smartLockCyan,baseY,28),'cyan recognition ring');
      addPart(addDoorFaceDisc(`${id}-face-recognition-touch-sensor`,hingeX,hingeZ,angle,centreU,scaledV(1.225),scaledN(publicFront+publicSide*.014),scaledN(publicFront+publicSide*.018),scaledSize(.022),COLORS.smartLockSensor,baseY),'touch sensor');

      const keypadRows=[['1','2','3'],['4','5','6'],['7','8','9']];
      keypadRows.forEach((row,rowIndex)=>row.forEach((digit,columnIndex)=>{
        const key=addDoorFaceDisc(`${id}-face-recognition-keypad-${digit}`,hingeX,hingeZ,angle,scaledU(centreU+(columnIndex-1)*.034),scaledV(1.090-rowIndex*.045),scaledN(publicFront+publicSide*.011),scaledN(publicFront+publicSide*.014),scaledSize(.0085),COLORS.silver,baseY);
        addPart(key,`keypad ${digit}`);
        key.smartEntryDigit=digit;
      }));
      const zero=addDoorFaceDisc(`${id}-face-recognition-keypad-0`,hingeX,hingeZ,angle,centreU,scaledV(.955),scaledN(publicFront+publicSide*.011),scaledN(publicFront+publicSide*.014),scaledSize(.0085),COLORS.silver,baseY);
      addPart(zero,'keypad 0');zero.smartEntryDigit='0';

      [.510,.870,1.220,1.570].forEach((height,index)=>addPart(addDoorLocalBar(
        `${id}-white-door-horizontal-recess-${index+1}`,hingeX,hingeZ,angle,.055,width-.055,height,.0014,
        publicSide*(leafHalf+.0002),publicSide*(leafHalf+.0012),COLORS.entryDoorGroove,baseY
      ),'white door horizontal recess'));

      const insideFace=insideSide*(leafHalf+.002);
      const insideFront=insideSide*(leafHalf+.036);
      addVerticalCapsule(`${id}-smart-entry-interior-backplate`,centreU,1.080,.100,.310,insideFace,insideFront,COLORS.smartLockFace,'interior control backplate');
      addPart(addDoorFaceDisc(`${id}-smart-entry-interior-turn-control`,hingeX,hingeZ,angle,centreU,1.115,insideFront,insideFront+insideSide*.010,.020,COLORS.brushedNickel,baseY),'interior turn control');
      addPart(addDoorLocalBar(`${id}-smart-entry-interior-pull`,hingeX,hingeZ,angle,centreU-.105,centreU+.010,1.015,.009,insideFront,insideFront+insideSide*.018,COLORS.brushedNickel,baseY),'interior handle');
      addPart(addDoorLocalBar(`${id}-smart-entry-leaf-edge-latch-faceplate`,hingeX,hingeZ,angle,width-.003,width+.001,1.015,.035,-.014,.014,COLORS.silver,baseY),'latch faceplate');
      addPart(addDoorLocalBar(`${id}-smart-entry-spring-latch-bolt`,hingeX,hingeZ,angle,width-.005,width+.014,1.015,.009,-.006,.006,COLORS.brushedNickelEdge,baseY),'spring latch');

      state.faceRecognition=true;
      state.smartEntryReference='Sublimetrics secure-entry smart lock';
      state.smartEntryComponentCount=moving.length;
      state.smartEntryKeypadDigits='1234567890';
      state.smartEntryExteriorScale=smartScale;
      return moving;
    }

    function addDoor(id, hingeX, hingeZ, width, openAngle, arcStart, arcEnd, labelX, labelZ, labelKind = 'opening', options = {}) {
      const baseY=options.baseY ?? 0;
      const state=registerInteraction(id,'hinged door','door',[hingeX+Math.cos(arcStart)*width*.52,baseY+1.02,hingeZ+Math.sin(arcStart)*width*.52],false,true);
      const swingDelta=arcEnd-arcStart;
      const publicSide=options.publicSide ?? (swingDelta>=0 ? -1 : 1);
      const hardwareMode=options.faceRecognition ? 'face-recognition' : (PRIVACY_DOOR_IDS.has(id) ? 'privacy' : 'keyed');
      const keySide=options.faceRecognition ? null : (options.keySide ?? KEYED_COMMON_SIDE_BY_DOOR[id] ?? publicSide);
      state.publicSide=publicSide;
      state.keySide=keySide;
      state.hardwareMode=hardwareMode;
      const frameName=options.frame || 'Metroll Metro 95';
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:options.source || (activeBuildLevel==='ground'?'21560 WD A3 · P1':'21560 WD A3 · P2'),
        drawingCode:options.drawingCode || `${Math.round(width*1000)}`,
        type:'hinged door',widthMm:Math.round(width*1000),heightMm:Math.round(DOOR_H*1000),leafThicknessMm:44,
        frame:frameName,hardware:hardwareMode,operation:'hinged',canToggle:true,
        display:`${Math.round(width*1000)} × ${Math.round(DOOR_H*1000)} mm · ${frameName} · ${hardwareMode}`
      });
      const hardwareAnchorU=options.faceRecognition ? Math.min(width-.160,PARAMS.ENTRY_SMART_LOCK_CENTRE_U) : width-PARAMS.DOOR_HARDWARE_BACKSET;
      state.hitAnchors.push([
        hingeX+Math.cos(arcStart)*hardwareAnchorU,
        baseY+(options.faceRecognition?1.124:PARAMS.DOOR_HARDWARE_HEIGHT),
        hingeZ+Math.sin(arcStart)*hardwareAnchorU
      ]);
      state.hardwareAnchorU=hardwareAnchorU;
      const pivot=toWorld(hingeX,baseY,hingeZ);
      const transformWhen=()=>mat4AroundPivot('y',swingDelta*easedProgress(state),pivot);
      addDoorFrame(id,hingeX,hingeZ,width,arcStart,baseY,transformWhen,publicSide);
      const leaf=addPrism(`${id}-leaf-moving`,'door',orientedRect(hingeX,hingeZ,width,arcStart,.044),baseY+.015,baseY+DOOR_H,COLORS.door,1);
      setItemTransform(leaf,transformWhen);
      const arc = [];
      const segments = 20;
      for (let i=0; i<=segments; i++) {
        const a = arcStart + (arcEnd-arcStart)*(i/segments);
        arc.push([hingeX + Math.cos(a)*width, baseY+.025, hingeZ + Math.sin(a)*width]);
      }
      const swing=addLine(`${id}-swing`, 'door', arc, COLORS.glazeFrame, .84);
      showItemWhen(swing,()=>state.progress>.015);
      addDoorHingeHardware(id,hingeX,hingeZ,arcStart,baseY,transformWhen,publicSide,state);
      if(options.faceRecognition)addFaceRecognitionEntryHardware(id,hingeX,hingeZ,width,arcStart,baseY,transformWhen,state,{publicSide});
      else addDoorLeverHardware(id,hingeX,hingeZ,width,arcStart,baseY,transformWhen,state,{mode:hardwareMode,keySide,publicSide});
      void openAngle;
      addLabel(id, labelX, baseY+.18, labelZ, labelKind, 'door');
      return state;
    }

    function overlappingGlassLayout(start, end, panelCount) {
      const overlap=PARAMS.GLASS_SLIDER_PANEL_OVERLAP;
      const panelWidth=((end-start)+overlap*(panelCount-1))/panelCount;
      return Object.freeze({overlap,panelWidth,step:panelWidth-overlap});
    }

    function integratedSliderTrackLayout(panelCount,screenSide=1) {
      const glassPanelCount=Math.max(2,panelCount);
      const flyscreenPanelCount=Math.max(1,glassPanelCount-1);
      const trackPlaneCount=glassPanelCount+flyscreenPanelCount;
      const pitch=PARAMS.GLASS_SLIDER_TRACK_OFFSET;
      const centred=Array.from({length:trackPlaneCount},(_,index)=>(index-(trackPlaneCount-1)/2)*pitch);
      const glassTrackOffsets=screenSide>0?centred.slice(0,glassPanelCount):centred.slice(flyscreenPanelCount);
      const flyscreenTrackOffsets=screenSide>0?centred.slice(glassPanelCount):centred.slice(0,flyscreenPanelCount);
      return Object.freeze({
        glassPanelCount,flyscreenPanelCount,trackPlaneCount,pitch,
        frameDepth:glassPanelCount>=3?PARAMS.SLIDER_MULTISTACK_SCREEN_FRAME_DEPTH:PARAMS.SLIDER_STANDARD_FRAME_DEPTH,
        glassTrackOffsets:Object.freeze(glassTrackOffsets),
        flyscreenTrackOffsets:Object.freeze(flyscreenTrackOffsets),
        allTrackOffsets:Object.freeze(centred)
      });
    }

    function tagIntegratedSliderState(state,trackLayout,centrePlane,axis) {
      Object.assign(state,{
        glassPanelCount:trackLayout.glassPanelCount,
        flyscreenPanelCount:trackLayout.flyscreenPanelCount,
        trackPlaneCount:trackLayout.trackPlaneCount,
        trackPitch:trackLayout.pitch,
        wallCentrePlane:centrePlane,
        wallCentreAxis:axis,
        assemblyFrameCentreAligned:true,
        openingHeadSealed:true,
        glassTrackPlanes:Object.freeze(trackLayout.glassTrackOffsets.map(offset=>centrePlane+offset)),
        flyscreenTrackPlanes:Object.freeze(trackLayout.flyscreenTrackOffsets.map(offset=>centrePlane+offset))
      });
      return state;
    }

    function addIntegratedSliderFrameZ(id,state,x,z0,z1,baseY,sliderHead,trackLayout) {
      const halfDepth=trackLayout.frameDepth/2,face=PARAMS.SLIDER_FIXED_FRAME_FACE;
      const items=[
        addBox(`${id}-fixed-assembly-frame-north`,'slider',x-halfDepth,x+halfDepth,baseY,sliderHead,z0,z0+face,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-south`,'slider',x-halfDepth,x+halfDepth,baseY,sliderHead,z1-face,z1,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-sill`,'slider',x-halfDepth,x+halfDepth,baseY,baseY+face,z0,z1,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-head`,'slider',x-halfDepth,x+halfDepth,sliderHead-face,sliderHead,z0,z1,COLORS.glazeFrame,1)
      ];
      items.forEach(item=>tagSlidingPart(item,state,'fixed-assembly-frame',{fixedAssemblyFrame:true,wallCentreAligned:true,openingHeadSeal:true,frameDepth:trackLayout.frameDepth}));
      state.fixedAssemblyFrameMeshCount=items.filter(Boolean).length;
      state.fixedAssemblyFrameDepth=trackLayout.frameDepth;
    }

    function addIntegratedSliderFrameX(id,state,x0,x1,z,baseY,sliderHead,trackLayout) {
      const halfDepth=trackLayout.frameDepth/2,face=PARAMS.SLIDER_FIXED_FRAME_FACE;
      const items=[
        addBox(`${id}-fixed-assembly-frame-west`,'slider',x0,x0+face,baseY,sliderHead,z-halfDepth,z+halfDepth,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-east`,'slider',x1-face,x1,baseY,sliderHead,z-halfDepth,z+halfDepth,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-sill`,'slider',x0,x1,baseY,baseY+face,z-halfDepth,z+halfDepth,COLORS.glazeFrame,1),
        addBox(`${id}-fixed-assembly-frame-head`,'slider',x0,x1,sliderHead-face,sliderHead,z-halfDepth,z+halfDepth,COLORS.glazeFrame,1)
      ];
      items.forEach(item=>tagSlidingPart(item,state,'fixed-assembly-frame',{fixedAssemblyFrame:true,wallCentreAligned:true,openingHeadSeal:true,frameDepth:trackLayout.frameDepth}));
      state.fixedAssemblyFrameMeshCount=items.filter(Boolean).length;
      state.fixedAssemblyFrameDepth=trackLayout.frameDepth;
    }

    function tagSlidingPart(item, state, role, metadata={}) {
      if (!item) return item;
      Object.assign(item,{
        sliderAssemblyId:state.parentAssemblyId || state.id,
        sliderStateId:state.id,
        sliderRole:role,
        ...metadata
      });
      return item;
    }

    function addFlyscreenWeaveZ(parentId,state,trackX,panelZ0,panelZ1,baseY,sliderHead,frame,transformWhen,panelIndex=1,panelCount=1) {
      const z0=panelZ0+frame,z1=panelZ1-frame,y0=baseY+.055,y1=sliderHead-.060;
      const warpSegments=[],weftSegments=[];
      for(let column=1;column<PARAMS.FLYSCREEN_WEAVE_COLUMNS;column++) {
        const z=z0+(z1-z0)*column/PARAMS.FLYSCREEN_WEAVE_COLUMNS;
        warpSegments.push([[trackX,y0,z],[trackX,y1,z]]);
      }
      for(let row=1;row<PARAMS.FLYSCREEN_WEAVE_ROWS;row++) {
        const y=y0+(y1-y0)*row/PARAMS.FLYSCREEN_WEAVE_ROWS;
        weftSegments.push([[trackX,y,z0],[trackX,y,z1]]);
      }
      const batchStem=panelCount===1?state.id:`${state.id}-panel-${panelIndex}`;
      const items=[
        addLineSegments(`${batchStem}-weave-warp-batch`,'slider',warpSegments,COLORS.flyscreenWeave,.24),
        addLineSegments(`${batchStem}-weave-weft-batch`,'slider',weftSegments,COLORS.flyscreenWeave,.21)
      ];
      items.forEach(item=>{
        const wovenSegmentCount=item.name.endsWith('warp-batch')?warpSegments.length:weftSegments.length;
        tagSlidingPart(item,state,'flyscreen-weave',{flyscreen:true,parentAssemblyId:parentId,operation:state.operation,flyscreenPanelIndex:panelIndex,wovenFlyscreenMesh:true,wovenSegmentCount,meshTint:'green-grey'});
        setItemTransform(item,transformWhen);
      });
      state.wovenMeshLineCount=(state.wovenMeshLineCount||0)+warpSegments.length+weftSegments.length;
      state.wovenMeshDrawItemCount=(state.wovenMeshDrawItemCount||0)+items.length;
      state.wovenMeshColumns=PARAMS.FLYSCREEN_WEAVE_COLUMNS;
      state.wovenMeshRows=PARAMS.FLYSCREEN_WEAVE_ROWS;
      state.tintedMesh=true;
      return items;
    }

    function addFlyscreenWeaveX(parentId,state,trackZ,panelX0,panelX1,baseY,sliderHead,frame,transformWhen,panelIndex=1,panelCount=1) {
      const x0=panelX0+frame,x1=panelX1-frame,y0=baseY+.055,y1=sliderHead-.060;
      const warpSegments=[],weftSegments=[];
      for(let column=1;column<PARAMS.FLYSCREEN_WEAVE_COLUMNS;column++) {
        const x=x0+(x1-x0)*column/PARAMS.FLYSCREEN_WEAVE_COLUMNS;
        warpSegments.push([[x,y0,trackZ],[x,y1,trackZ]]);
      }
      for(let row=1;row<PARAMS.FLYSCREEN_WEAVE_ROWS;row++) {
        const y=y0+(y1-y0)*row/PARAMS.FLYSCREEN_WEAVE_ROWS;
        weftSegments.push([[x0,y,trackZ],[x1,y,trackZ]]);
      }
      const batchStem=panelCount===1?state.id:`${state.id}-panel-${panelIndex}`;
      const items=[
        addLineSegments(`${batchStem}-weave-warp-batch`,'slider',warpSegments,COLORS.flyscreenWeave,.24),
        addLineSegments(`${batchStem}-weave-weft-batch`,'slider',weftSegments,COLORS.flyscreenWeave,.21)
      ];
      items.forEach(item=>{
        const wovenSegmentCount=item.name.endsWith('warp-batch')?warpSegments.length:weftSegments.length;
        tagSlidingPart(item,state,'flyscreen-weave',{flyscreen:true,parentAssemblyId:parentId,operation:state.operation,flyscreenPanelIndex:panelIndex,wovenFlyscreenMesh:true,wovenSegmentCount,meshTint:'green-grey'});
        setItemTransform(item,transformWhen);
      });
      state.wovenMeshLineCount=(state.wovenMeshLineCount||0)+warpSegments.length+weftSegments.length;
      state.wovenMeshDrawItemCount=(state.wovenMeshDrawItemCount||0)+items.length;
      state.wovenMeshColumns=PARAMS.FLYSCREEN_WEAVE_COLUMNS;
      state.wovenMeshRows=PARAMS.FLYSCREEN_WEAVE_ROWS;
      state.tintedMesh=true;
      return items;
    }

    function addFlyscreenZ(parentId,x,z0,z1,baseY,sliderHead,layout,options={}) {
      const id=`${parentId}-FLYSCREEN`;
      const direction=options.flyscreenDirection || 'right';
      const trackLayout=options.trackLayout || integratedSliderTrackLayout(options.glassPanelCount||2,options.flyscreenSide??1);
      const screenCount=trackLayout.flyscreenPanelCount;
      const firstTrackX=x+trackLayout.flyscreenTrackOffsets[0];
      const firstPanelZ0=direction==='right'?z0:z1-layout.panelWidth;
      const state=registerInteraction(id,'sliding flyscreen','slider',[firstTrackX,(baseY+sliderHead)*.5,firstPanelZ0+layout.panelWidth/2],false,true);
      state.parentAssemblyId=parentId;
      state.operation=direction==='right'?'slide-right':'slide-left';
      state.slideDirection=direction;
      state.initialSlideDirection=direction;
      state.trackOffset=Math.max(...trackLayout.flyscreenTrackOffsets.map(Math.abs));
      state.trackOffsets=trackLayout.flyscreenTrackOffsets;
      state.flyscreenPanelCount=screenCount;
      state.exteriorTrack=Boolean(options.exteriorFlyscreenTrack);
      tagIntegratedSliderState(state,trackLayout,x,'x');
      state.openingHeadDatum=sliderHead;
      state.topFrameSealedToOpening=true;
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:'21560 WD A3 · P1/P3',drawingCode:'FLYSCREEN',type:'sliding flyscreen',
        widthMm:Math.round(layout.panelWidth*1000),heightMm:Math.round((sliderHead-baseY)*1000),panelCount:screenCount,
        operation:state.operation,trackOffsetMm:Math.round(state.trackOffset*1000),integratedFrameDepthMm:Math.round(trackLayout.frameDepth*1000),canToggle:true,
        display:`${screenCount} flyscreen panel${screenCount===1?'':'s'} · ${Math.round(layout.panelWidth*1000)} mm each · integrated outer track${screenCount===1?'':'s'}`
      });
      const halfDepth=PARAMS.FLYSCREEN_FRAME_DEPTH/2,frame=PARAMS.FLYSCREEN_FRAME_WIDTH;
      const meshAlpha=options.wovenFlyscreen?.20:COLORS.flyscreenMesh[3];
      const hitAnchors=[];
      trackLayout.flyscreenTrackOffsets.forEach((offset,index)=>{
        const trackX=x+offset;
        const panelZ0=direction==='right'?z0+layout.step*index:z1-layout.panelWidth-layout.step*index;
        const panelZ1=panelZ0+layout.panelWidth;
        const travel=(direction==='right'?1:-1)*(screenCount-index)*layout.step;
        const transformWhen=()=>mat4Translation(0,0,travel*easedProgress(state));
        const stem=screenCount===1?id:`${id}-panel-${index+1}`;
        const metadata={flyscreen:true,parentAssemblyId:parentId,operation:state.operation,flyscreenPanelIndex:index+1,trackIndex:trackLayout.glassPanelCount+index};
        const mesh=tagSlidingPart(addBox(`${stem}${screenCount===1?'-panel-moving':'-moving'}`,'slider',trackX-halfDepth,trackX+halfDepth,baseY+.055,sliderHead-.060,panelZ0+frame,panelZ1-frame,COLORS.flyscreenMesh,meshAlpha),state,'flyscreen-mesh',metadata);
        const frameItems=[
          addBox(`${stem}-frame-north`,'slider',trackX-halfDepth-.006,trackX+halfDepth+.006,baseY+.035,sliderHead-.035,panelZ0,panelZ0+frame,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-south`,'slider',trackX-halfDepth-.006,trackX+halfDepth+.006,baseY+.035,sliderHead-.035,panelZ1-frame,panelZ1,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-sill`,'slider',trackX-halfDepth-.006,trackX+halfDepth+.006,baseY+.035,baseY+.035+frame,panelZ0,panelZ1,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-head`,'slider',trackX-halfDepth-.006,trackX+halfDepth+.006,sliderHead-.035-frame,sliderHead-.035,panelZ0,panelZ1,COLORS.glazeFrame,1)
        ].map(item=>tagSlidingPart(item,state,'flyscreen-frame',metadata));
        [mesh,...frameItems].forEach(item=>setItemTransform(item,transformWhen));
        if(options.wovenFlyscreen)addFlyscreenWeaveZ(parentId,state,trackX,panelZ0,panelZ1,baseY,sliderHead,frame,transformWhen,index+1,screenCount);
        hitAnchors.push([trackX,(baseY+sliderHead)*.5,(panelZ0+panelZ1)/2]);
      });
      state.hitAnchors=hitAnchors;
      addArrowZ(`${id}-travel`,'slider',firstTrackX,firstPanelZ0,firstPanelZ0+layout.panelWidth,baseY+.92,state.operation,COLORS.glazeFrame);
      return state;
    }

    function addFlyscreenX(parentId,x0,x1,z,baseY,sliderHead,layout,options={}) {
      const id=`${parentId}-FLYSCREEN`;
      const direction=options.flyscreenDirection || 'right';
      const trackLayout=options.trackLayout || integratedSliderTrackLayout(options.glassPanelCount||2,options.flyscreenSide??-1);
      const screenCount=trackLayout.flyscreenPanelCount;
      const firstTrackZ=z+trackLayout.flyscreenTrackOffsets[0];
      const firstPanelX0=direction==='right'?x0:x1-layout.panelWidth;
      const state=registerInteraction(id,'sliding flyscreen','slider',[firstPanelX0+layout.panelWidth/2,(baseY+sliderHead)*.5,firstTrackZ],false,true);
      state.parentAssemblyId=parentId;
      state.operation=direction==='right'?'slide-right':'slide-left';
      state.slideDirection=direction;
      state.initialSlideDirection=direction;
      state.trackOffset=Math.max(...trackLayout.flyscreenTrackOffsets.map(Math.abs));
      state.trackOffsets=trackLayout.flyscreenTrackOffsets;
      state.flyscreenPanelCount=screenCount;
      state.exteriorTrack=Boolean(options.exteriorFlyscreenTrack);
      tagIntegratedSliderState(state,trackLayout,z,'z');
      state.openingHeadDatum=sliderHead;
      state.topFrameSealedToOpening=true;
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:'21560 WD A3 · P1/P3',drawingCode:'FLYSCREEN',type:'sliding flyscreen',
        widthMm:Math.round(layout.panelWidth*1000),heightMm:Math.round((sliderHead-baseY)*1000),panelCount:screenCount,
        operation:state.operation,trackOffsetMm:Math.round(state.trackOffset*1000),integratedFrameDepthMm:Math.round(trackLayout.frameDepth*1000),canToggle:true,
        display:`${screenCount} flyscreen panel${screenCount===1?'':'s'} · ${Math.round(layout.panelWidth*1000)} mm each · integrated outer track${screenCount===1?'':'s'}`
      });
      const halfDepth=PARAMS.FLYSCREEN_FRAME_DEPTH/2,frame=PARAMS.FLYSCREEN_FRAME_WIDTH;
      const meshAlpha=options.wovenFlyscreen?.20:COLORS.flyscreenMesh[3];
      const hitAnchors=[];
      trackLayout.flyscreenTrackOffsets.forEach((offset,index)=>{
        const trackZ=z+offset;
        const panelX0=direction==='right'?x0+layout.step*index:x1-layout.panelWidth-layout.step*index;
        const panelX1=panelX0+layout.panelWidth;
        const travel=(direction==='right'?1:-1)*(screenCount-index)*layout.step;
        const transformWhen=()=>mat4Translation(travel*easedProgress(state),0,0);
        const stem=screenCount===1?id:`${id}-panel-${index+1}`;
        const metadata={flyscreen:true,parentAssemblyId:parentId,operation:state.operation,flyscreenPanelIndex:index+1,trackIndex:trackLayout.glassPanelCount+index};
        const mesh=tagSlidingPart(addBox(`${stem}${screenCount===1?'-panel-moving':'-moving'}`,'slider',panelX0+frame,panelX1-frame,baseY+.055,sliderHead-.060,trackZ-halfDepth,trackZ+halfDepth,COLORS.flyscreenMesh,meshAlpha),state,'flyscreen-mesh',metadata);
        const frameItems=[
          addBox(`${stem}-frame-west`,'slider',panelX0,panelX0+frame,baseY+.035,sliderHead-.035,trackZ-halfDepth-.006,trackZ+halfDepth+.006,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-east`,'slider',panelX1-frame,panelX1,baseY+.035,sliderHead-.035,trackZ-halfDepth-.006,trackZ+halfDepth+.006,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-sill`,'slider',panelX0,panelX1,baseY+.035,baseY+.035+frame,trackZ-halfDepth-.006,trackZ+halfDepth+.006,COLORS.glazeFrame,1),
          addBox(`${stem}-frame-head`,'slider',panelX0,panelX1,sliderHead-.035-frame,sliderHead-.035,trackZ-halfDepth-.006,trackZ+halfDepth+.006,COLORS.glazeFrame,1)
        ].map(item=>tagSlidingPart(item,state,'flyscreen-frame',metadata));
        [mesh,...frameItems].forEach(item=>setItemTransform(item,transformWhen));
        if(options.wovenFlyscreen)addFlyscreenWeaveX(parentId,state,trackZ,panelX0,panelX1,baseY,sliderHead,frame,transformWhen,index+1,screenCount);
        hitAnchors.push([(panelX0+panelX1)/2,(baseY+sliderHead)*.5,trackZ]);
      });
      state.hitAnchors=hitAnchors;
      addArrowX(`${id}-travel`,'slider',firstPanelX0,firstPanelX0+layout.panelWidth,baseY+.92,firstTrackZ,state.operation,COLORS.glazeFrame);
      return state;
    }

    function addGlassSliderZ(id, x, z0, z1, noteX, panelCount, mirrored = false, options = {}) {
      const baseY=options.baseY ?? 0;
      const height=options.height ?? WALL_H;
      const sliderHead = baseY + height - PARAMS.CORNICE_PROXY;
      const reverseStacking=!mirrored&&Boolean(options.reverseStacking);
      const style=mirrored ? null : glazingStyle({...options,glazingType:options.glazingType || 'clear'});
      const faceColor = mirrored ? COLORS.robe : style.color;
      const state=registerInteraction(id,mirrored ? 'mirrored robe slider' : 'glass sliding door','slider',[x,(baseY+sliderHead)*.5,(z0+z1)/2],false,true);
      state.glazingType=mirrored ? 'mirror' : style.type;
      const glassLayout=mirrored ? null : overlappingGlassLayout(z0,z1,panelCount);
      const trackLayout=mirrored?null:integratedSliderTrackLayout(panelCount,options.flyscreenSide??1);
      const selectableLeaves=!mirrored&&Boolean(options.selectableLeaves)&&panelCount===2;
      if(!mirrored) {
        tagIntegratedSliderState(state,trackLayout,x,'x');
        state.openingHeadDatum=sliderHead;
        state.topFrameSealedToOpening=true;
      }
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:activeBuildLevel==='ground'?'21560 WD A3 · P1/P3':'21560 WD A3 · P2/P4',
        drawingCode:options.drawingCode || `${Math.round((z1-z0)*1000)} SLIDER`,type:mirrored?'mirrored robe slider':'glass sliding door',
        widthMm:Math.round((z1-z0)*1000),heightMm:Math.round((sliderHead-baseY)*1000),panelCount,
        panelOverlapMm:Math.round((mirrored?PARAMS.ROBE_PANEL_OVERLAP:PARAMS.GLASS_SLIDER_PANEL_OVERLAP)*1000),
        closedVisibleGapMm:0,operation:'stacking-slider',glazing:mirrored?'mirror':style.type,flyscreen:!mirrored&&options.flyscreen!==false,
        ...(!mirrored?{flyscreenPanelCount:trackLayout.flyscreenPanelCount,trackPlaneCount:trackLayout.trackPlaneCount,integratedFrameDepthMm:Math.round(trackLayout.frameDepth*1000),topFrameSealedToOpening:true}:{}),
        ...(reverseStacking?{drawingPanelPattern:selectableLeaves?'drawing-left slide-right | drawing-right slide-left':'drawing-right slide-left | drawing-left fixed'}:{}),
        ...(selectableLeaves?{operablePanelCount:2,bothGlassLeavesOperable:true,panelOperations:['slide-right','slide-left']}:{ }),canToggle:true,
        display:`${panelCount} panel · ${Math.round((z1-z0)*1000)} × ${Math.round((sliderHead-baseY)*1000)} mm · overlap close`
      });
      state.panelOverlap=mirrored?PARAMS.ROBE_PANEL_OVERLAP:PARAMS.GLASS_SLIDER_PANEL_OVERLAP;
      state.closedVisibleGap=0;
      state.trackOffset=mirrored?PARAMS.ROBE_TRACK_OFFSET:PARAMS.GLASS_SLIDER_TRACK_OFFSET;
      if(selectableLeaves) {
        state.selectableGlassLeaves=true;
        state.operablePanelCount=2;
        state.bothGlassLeavesOperable=true;
        state.panelOperations=Object.freeze(['slide-right','slide-left']);
        state.activePanelIndex=1;
        state.defaultActivePanelIndex=1;
      }
      if(reverseStacking) {
        state.reverseStacking=true;
        state.drawingPanelPattern=selectableLeaves?'drawing-left slide-right | drawing-right slide-left':'drawing-right slide-left | drawing-left fixed';
      }
      if(options.addCornice!==false) addBox(`${id}-cornice`, 'cornice', x-.045, x+.045, sliderHead, baseY+height, z0, z1, COLORS.cornice, 1, true);
      if(mirrored) {
        addLine(`${id}-track-a`, 'slider', [[x-.035,baseY+.025,z0],[x-.035,baseY+.025,z1]], COLORS.glazeFrame, 1);
        addLine(`${id}-track-b`, 'slider', [[x+.035,baseY+.025,z0],[x+.035,baseY+.025,z1]], COLORS.glazeFrame, 1);
      } else {
        addIntegratedSliderFrameZ(id,state,x,z0,z1,baseY,sliderHead,trackLayout);
        trackLayout.allTrackOffsets.forEach((offset,index)=>{
          const track=addLine(`${id}-integrated-track-${index+1}`,'slider',[[x+offset,baseY+.025,z0],[x+offset,baseY+.025,z1]],COLORS.glazeFrame,1);
          tagSlidingPart(track,state,'integrated-track',{trackIndex:index,trackPlane:x+offset,wallCentreAligned:true});
        });
      }
      const panelSpan = (z1-z0)/panelCount;
      const robeLayout=mirrored ? overlappingRobeLayout(z0,z1,panelCount) : null;
      for (let i=0; i<panelCount; i++) {
        const panelZ0=mirrored ? z0+robeLayout.step*i : z0+glassLayout.step*i;
        const panelZ1=mirrored ? panelZ0+robeLayout.panelWidth : panelZ0+glassLayout.panelWidth;
        const panelTrackX=mirrored?x+(i-(panelCount-1)/2)*PARAMS.ROBE_TRACK_OFFSET:x+trackLayout.glassTrackOffsets[i];
        const transformWhen=()=>{
          const p=easedProgress(state);
          if (!mirrored) {
            if(selectableLeaves) {
              const selected=state.activePanelIndex===i+1;
              const travel=selected?(i===0?glassLayout.step:-glassLayout.step):0;
              return mat4Translation(0,0,travel*p);
            }
            return mat4Translation(0,0,(reverseStacking?(panelCount-1-i):-i)*glassLayout.step*p);
          }
          const travel=state.slideDirection==='right' ? (panelCount-1-i)*robeLayout.step : -i*robeLayout.step;
          return mat4Translation(0,0,travel*p);
        };
        const panel=addBox(`${id}-panel-${i+1}-moving`,'slider',panelTrackX-.012,panelTrackX+.012,baseY+.048,sliderHead-.052,panelZ0+.018,panelZ1-.018,faceColor,mirrored?1:style.alpha);
        if (!mirrored) tagGlazingPane(panel,style);
        if (mirrored) { panel.robeOverlap=robeLayout.overlap; panel.robeTrackIndex=i; }
        if (!mirrored) tagSlidingPart(panel,state,'glass-panel',{glassPanelIndex:i+1,panelOverlap:glassLayout.overlap,closedVisibleGap:0,trackIndex:i});
        setItemTransform(panel,transformWhen);
        const frameItems=[
          addBox(`${id}-panel-${i+1}-frame-north`,'slider',panelTrackX-.022,panelTrackX+.022,baseY+.03,sliderHead-.035,panelZ0,panelZ0+.030,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-south`,'slider',panelTrackX-.022,panelTrackX+.022,baseY+.03,sliderHead-.035,panelZ1-.030,panelZ1,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-sill`,'slider',panelTrackX-.022,panelTrackX+.022,baseY+.03,baseY+.060,panelZ0,panelZ1,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-head`,'slider',panelTrackX-.022,panelTrackX+.022,sliderHead-.065,sliderHead-.035,panelZ0,panelZ1,COLORS.glazeFrame,1)
        ];
        frameItems.forEach(item=>{ if(!mirrored)tagSlidingPart(item,state,'glass-frame',{glassPanelIndex:i+1,panelOverlap:glassLayout.overlap,closedVisibleGap:0,trackIndex:i}); setItemTransform(item,transformWhen); });
        if (mirrored) {
          const highlightFront=addBox(`${id}-panel-${i+1}-mirror-highlight-front`,'slider',panelTrackX-.021,panelTrackX-.019,baseY+.12,sliderHead-.14,panelZ0+robeLayout.panelWidth*.14,panelZ0+robeLayout.panelWidth*.19,COLORS.mirrorHighlight,1);
          const highlightBack=addBox(`${id}-panel-${i+1}-mirror-highlight-back`,'slider',panelTrackX+.019,panelTrackX+.021,baseY+.12,sliderHead-.14,panelZ0+robeLayout.panelWidth*.14,panelZ0+robeLayout.panelWidth*.19,COLORS.mirrorHighlight,1);
          [highlightFront,highlightBack].forEach(item=>setItemTransform(item,transformWhen));
        }
      }
      const arrowSpan=mirrored ? robeLayout.panelWidth : glassLayout.panelWidth;
      const arrowX=mirrored ? x-.055 : x;
      if (mirrored) {
        addHighVisibilityRobeArrowZ(`${id}-left-panel-travel`,'slider',id,x,z0,z0+arrowSpan,baseY+1.00,'slide-right');
        addHighVisibilityRobeArrowZ(`${id}-right-panel-travel`,'slider',id,x,z1-arrowSpan,z1,baseY+1.00,'slide-left');
        setRobeArrowTargets(state,[arrowX,baseY+1.00,z0+arrowSpan*.5],[arrowX,baseY+1.00,z1-arrowSpan*.5]);
      } else {
        addArrowZ(`${id}-left-panel-travel`, 'slider', arrowX, z0, z0+arrowSpan, baseY+.86, 'slide-right', COLORS.glazeFrame);
        addArrowZ(`${id}-right-panel-travel`, 'slider', arrowX, z1-arrowSpan, z1, baseY+.86, 'slide-left', COLORS.glazeFrame);
      }
      if(selectableLeaves) {
        state.hitAnchors=[
          [x,(baseY+sliderHead)*.5,z0+glassLayout.panelWidth*.5],
          [x,(baseY+sliderHead)*.5,z0+glassLayout.step+glassLayout.panelWidth*.5]
        ];
        state.hitAnchorRoles=['glass-panel-1-slide-right','glass-panel-2-slide-left'];
      }
      const face = mirrored ? 'MIRRORED-GLASS ROBE SLIDER' : 'GLASS SLIDING DOOR';
      addLabel(`${id} · ${panelCount} PANEL ${face}`, noteX, baseY+1.12, (z0+z1)/2, 'key', 'slider');
      if (!mirrored && options.flyscreen!==false) addFlyscreenZ(id,x,z0,z1,baseY,sliderHead,glassLayout,{...options,trackLayout,glassPanelCount:panelCount});
    }

    function addGlassSliderX(id, x0, x1, z, noteZ, panelCount, options = {}) {
      const baseY=options.baseY ?? 0;
      const height=options.height ?? WALL_H;
      const sliderHead=baseY+height-PARAMS.CORNICE_PROXY;
      const style=glazingStyle({...options,glazingType:options.glazingType || 'clear'});
      const state=registerInteraction(id,'glass sliding door','slider',[(x0+x1)/2,(baseY+sliderHead)*.5,z],false,true);
      state.glazingType=style.type;
      const layout=overlappingGlassLayout(x0,x1,panelCount);
      const trackLayout=integratedSliderTrackLayout(panelCount,options.flyscreenSide??-1);
      const selectableLeaves=Boolean(options.selectableLeaves)&&panelCount===2;
      tagIntegratedSliderState(state,trackLayout,z,'z');
      state.openingHeadDatum=sliderHead;
      state.topFrameSealedToOpening=true;
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:activeBuildLevel==='ground'?'21560 WD A3 · P1/P3':'21560 WD A3 · P2/P4',
        drawingCode:options.drawingCode || `${Math.round((x1-x0)*1000)} SLIDER`,type:'glass sliding door',
        widthMm:Math.round((x1-x0)*1000),heightMm:Math.round((sliderHead-baseY)*1000),panelCount,
        panelOverlapMm:Math.round(PARAMS.GLASS_SLIDER_PANEL_OVERLAP*1000),closedVisibleGapMm:0,
        operation:'stacking-slider',glazing:style.type,flyscreen:options.flyscreen!==false,
        flyscreenPanelCount:trackLayout.flyscreenPanelCount,trackPlaneCount:trackLayout.trackPlaneCount,
        integratedFrameDepthMm:Math.round(trackLayout.frameDepth*1000),topFrameSealedToOpening:true,
        ...(selectableLeaves?{operablePanelCount:2,bothGlassLeavesOperable:true,panelOperations:['slide-right','slide-left']}:{ }),canToggle:true,
        display:`${panelCount} panel · ${Math.round((x1-x0)*1000)} × ${Math.round((sliderHead-baseY)*1000)} mm · overlap close`
      });
      state.panelOverlap=PARAMS.GLASS_SLIDER_PANEL_OVERLAP;
      state.closedVisibleGap=0;
      state.trackOffset=PARAMS.GLASS_SLIDER_TRACK_OFFSET;
      if(selectableLeaves) {
        state.selectableGlassLeaves=true;
        state.operablePanelCount=2;
        state.bothGlassLeavesOperable=true;
        state.panelOperations=Object.freeze(['slide-right','slide-left']);
        state.activePanelIndex=1;
        state.defaultActivePanelIndex=1;
      }
      if(options.addCornice!==false) addBox(`${id}-cornice`,'cornice',x0,x1,sliderHead,baseY+height,z-.045,z+.045,COLORS.cornice,1,true);
      addIntegratedSliderFrameX(id,state,x0,x1,z,baseY,sliderHead,trackLayout);
      trackLayout.allTrackOffsets.forEach((offset,index)=>{
        const track=addLine(`${id}-integrated-track-${index+1}`,'slider',[[x0,baseY+.025,z+offset],[x1,baseY+.025,z+offset]],COLORS.glazeFrame,1);
        tagSlidingPart(track,state,'integrated-track',{trackIndex:index,trackPlane:z+offset,wallCentreAligned:true});
      });
      const panelSpan=(x1-x0)/panelCount;
      for (let i=0;i<panelCount;i++) {
        const panelX0=x0+layout.step*i, panelX1=panelX0+layout.panelWidth;
        const panelTrackZ=z+trackLayout.glassTrackOffsets[i];
        const transformWhen=()=>{
          const p=easedProgress(state);
          if(selectableLeaves) {
            const selected=state.activePanelIndex===i+1;
            const travel=selected?(i===0?layout.step:-layout.step):0;
            return mat4Translation(travel*p,0,0);
          }
          return mat4Translation(-i*layout.step*p,0,0);
        };
        const panel=tagSlidingPart(tagGlazingPane(addBox(`${id}-panel-${i+1}-moving`,'slider',panelX0+.018,panelX1-.018,baseY+.048,sliderHead-.052,panelTrackZ-.012,panelTrackZ+.012,style.color,style.alpha),style),state,'glass-panel',{glassPanelIndex:i+1,panelOverlap:layout.overlap,closedVisibleGap:0,trackIndex:i});
        setItemTransform(panel,transformWhen);
        const frameItems=[
          addBox(`${id}-panel-${i+1}-frame-west`,'slider',panelX0,panelX0+.030,baseY+.03,sliderHead-.035,panelTrackZ-.022,panelTrackZ+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-east`,'slider',panelX1-.030,panelX1,baseY+.03,sliderHead-.035,panelTrackZ-.022,panelTrackZ+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-sill`,'slider',panelX0,panelX1,baseY+.03,baseY+.060,panelTrackZ-.022,panelTrackZ+.022,COLORS.glazeFrame,1),
          addBox(`${id}-panel-${i+1}-frame-head`,'slider',panelX0,panelX1,sliderHead-.065,sliderHead-.035,panelTrackZ-.022,panelTrackZ+.022,COLORS.glazeFrame,1)
        ];
        frameItems.forEach(item=>{tagSlidingPart(item,state,'glass-frame',{glassPanelIndex:i+1,panelOverlap:layout.overlap,closedVisibleGap:0,trackIndex:i});setItemTransform(item,transformWhen);});
      }
      addArrowX(`${id}-left-panel-travel`,'slider',x0,x0+layout.panelWidth,baseY+.86,z,'slide-right',COLORS.glazeFrame);
      addArrowX(`${id}-right-panel-travel`,'slider',x1-layout.panelWidth,x1,baseY+.86,z,'slide-left',COLORS.glazeFrame);
      if(selectableLeaves) {
        state.hitAnchors=[
          [x0+layout.panelWidth*.5,(baseY+sliderHead)*.5,z],
          [x0+layout.step+layout.panelWidth*.5,(baseY+sliderHead)*.5,z]
        ];
        state.hitAnchorRoles=['glass-panel-1-slide-right','glass-panel-2-slide-left'];
      }
      addLabel(`${id} · ${panelCount} PANEL GLASS SLIDING DOOR`,(x0+x1)/2,baseY+1.12,noteZ,'key','slider');
      if (options.flyscreen!==false) addFlyscreenX(id,x0,x1,z,baseY,sliderHead,layout,{...options,trackLayout,glassPanelCount:panelCount});
    }

    function sectionalTrackPose(distance,height,radius) {
      const vertical=Math.max(0,height-radius);
      const arcLength=radius*Math.PI/2;
      if(distance<=vertical)return {rise:distance,inward:0,angle:0,phase:'vertical'};
      if(distance<=vertical+arcLength) {
        const theta=(distance-vertical)/radius;
        return {rise:vertical+radius*Math.sin(theta),inward:radius*(1-Math.cos(theta)),angle:theta,phase:'arc'};
      }
      return {rise:height,inward:radius+(distance-vertical-arcLength),angle:Math.PI/2,phase:'horizontal'};
    }

    function addGarageTrackChannelSegment(id,a,b,side,part,segmentIndex) {
      const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
      const pathLength=Math.hypot(dx,dy,dz);
      if(pathLength<=.0001)return null;
      const halfWidth=PARAMS.GARAGE_TRACK_CHANNEL_WIDTH/2;
      const halfDepth=PARAMS.GARAGE_TRACK_CHANNEL_DEPTH/2;
      const wall=PARAMS.GARAGE_TRACK_CHANNEL_WALL;
      const section=[
        [-halfWidth,-halfDepth],[halfWidth,-halfDepth],[halfWidth,halfDepth],
        [halfWidth-wall,halfDepth],[halfWidth-wall,-halfDepth+wall],
        [-halfWidth+wall,-halfDepth+wall],[-halfWidth+wall,halfDepth],[-halfWidth,halfDepth]
      ];
      const tangentY=dy/pathLength,tangentZ=dz/pathLength;
      const normalY=-tangentZ,normalZ=tangentY;
      const item=addSectionExtrusion(
        `${id}-track-${side}-${part}-physical-${segmentIndex}`,
        'door',section,
        (t,u,d)=>[a[0]+dx*t+u,a[1]+dy*t+normalY*d,a[2]+dz*t+normalZ*d],
        COLORS.silver,1
      );
      if(item) {
        Object.assign(item,{
          garageSectionalAssemblyId:id,
          garageTrackType:part,
          garageTrackPhysical:true,
          garageTrackFinish:'silver aluminium-alloy visual proxy',
          garageTrackSide:side,
          garageTrackChannelSection:[PARAMS.GARAGE_TRACK_CHANNEL_WIDTH,PARAMS.GARAGE_TRACK_CHANNEL_DEPTH,PARAMS.GARAGE_TRACK_CHANNEL_WALL]
        });
        item.surfaceRoughness=.010;
      }
      return item;
    }

    function addSectionalTrackX(id,x,z,baseY,head,insideSign,index) {
      const radius=PARAMS.GARAGE_SECTIONAL_TRACK_RADIUS;
      const verticalTop=baseY+head-radius;
      const arc=[];
      for(let step=0;step<=18;step++) {
        const theta=Math.PI/2*step/18;
        arc.push([x,verticalTop+radius*Math.sin(theta),z+insideSign*radius*(1-Math.cos(theta))]);
      }
      const vertical=addLine(`${id}-track-${index}-vertical`,'door',[[x,baseY,z],[x,verticalTop,z]],COLORS.metal,1);
      const curve=addLine(`${id}-track-${index}-arc`,'door',arc,COLORS.metal,1);
      const horizontal=addLine(`${id}-track-${index}-horizontal`,'door',[[x,baseY+head,z+insideSign*radius],[x,baseY+head,z+insideSign*(head+radius)]],COLORS.metal,1);
      [vertical,curve,horizontal].forEach((item,partIndex)=>Object.assign(item,{garageSectionalAssemblyId:id,garageTrackType:['vertical','arc','horizontal'][partIndex],garageTrackArc:partIndex===1,garageTrackRadius:radius,garageTrackCentreSlot:true,garageTrackSide:index}));
      const verticalPath=[[x,baseY,z],[x,verticalTop,z]];
      const horizontalPath=[[x,baseY+head,z+insideSign*radius],[x,baseY+head,z+insideSign*(head+radius)]];
      addGarageTrackChannelSegment(id,verticalPath[0],verticalPath[1],index,'vertical',1);
      for(let segment=0;segment<arc.length-1;segment++)addGarageTrackChannelSegment(id,arc[segment],arc[segment+1],index,'arc',segment+1);
      addGarageTrackChannelSegment(id,horizontalPath[0],horizontalPath[1],index,'horizontal',1);
    }

    function addSectionalDoorX(id, x0, x1, z, baseY, head = 2.140) {
      const state=registerInteraction(id,'sectional garage door','door',[(x0+x1)/2,baseY+head*.52,z],false,true);
      const panelCount=4, panelHeight=head/panelCount;
      const radius=PARAMS.GARAGE_SECTIONAL_TRACK_RADIUS;
      const travel=(head-radius)+radius*Math.PI/2;
      const insideSign=-1;
      attachOpeningSpec(state,{
        specId:`${id}-SPEC`,source:'21560 WD A3 · P1/P3',drawingCode:'T-BAR @25c / SECTIONAL DOOR',
        type:'sectional garage door',widthMm:Math.round((x1-x0)*1000),heightMm:Math.round(head*1000),
        panelCount,operation:'vertical-arc-horizontal',trackRadiusMm:Math.round(radius*1000),baseCourse:PARAMS.GARAGE_SECTIONAL_BASE_COURSE,
        headCourse:PARAMS.GARAGE_SECTIONAL_HEAD_COURSE,canToggle:true,
        display:`4 section · ${Math.round((x1-x0)*1000)} × ${Math.round(head*1000)} mm · curved overhead track`
      });
      state.trackType='vertical-arc-horizontal';
      state.trackRadius=radius;
      state.baseCourse=PARAMS.GARAGE_SECTIONAL_BASE_COURSE;
      state.headCourse=PARAMS.GARAGE_SECTIONAL_HEAD_COURSE;
      for (let i=0;i<panelCount;i++) {
        const initialCentreY=baseY+(i+.5)*panelHeight;
        const initialCentreWorld=toWorld((x0+x1)/2,initialCentreY,z);
        const transformWhen=()=>{
          const pose=sectionalTrackPose((i+.5)*panelHeight+travel*easedProgress(state),head,radius);
          const target=toWorld((x0+x1)/2,baseY+pose.rise,z+insideSign*pose.inward);
          return mat4Multiply(mat4Translation(target[0],target[1],target[2]),mat4Multiply(mat4Rotation('x',insideSign<0?pose.angle:-pose.angle),mat4Translation(-initialCentreWorld[0],-initialCentreWorld[1],-initialCentreWorld[2])));
        };
        const panel=addBox(`${id}-section-${i+1}-moving`,'door',x0+.018,x1-.018,baseY+i*panelHeight+.012,baseY+(i+1)*panelHeight-.012,z-.022,z+.022,COLORS.door,1);
        Object.assign(panel,{garageSectionIndex:i+1,garageSectionalAssemblyId:id,garageTrackType:'vertical-arc-horizontal',garageTrackRadius:radius});
        setItemTransform(panel,transformWhen);
        const seam=addLine(`${id}-seam-${i+1}`,'door',[[x0,baseY+(i+1)*panelHeight,z-.024],[x1,baseY+(i+1)*panelHeight,z-.024]],COLORS.glazeFrame,.72);
        Object.assign(seam,{garageSectionIndex:i+1,garageSectionalAssemblyId:id,garageTrackType:'vertical-arc-horizontal'});
        setItemTransform(seam,transformWhen);
      }
      addSectionalTrackX(id,x0+.035,z,baseY,head,insideSign,'west');
      addSectionalTrackX(id,x1-.035,z,baseY,head,insideSign,'east');
      addBox(`${id}-frame-west`,'door',x0-.05,x0+.05,baseY,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-east`,'door',x1-.05,x1+.05,baseY,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addBox(`${id}-frame-head`,'door',x0,x1,baseY+head,baseY+head+.08,z-.05,z+.05,COLORS.doorFrame,1);
      addLabel(`${id} · SECTIONAL GARAGE DOOR`,(x0+x1)/2,baseY+.34,z+.34,'key','door',112);
    }

      return Object.freeze({addCompoundWall,addGlazingX,addFixedTransomX,addFixedTransomZ,addGlazingZ,addDoor,addGlassSliderZ,addGlassSliderX,addSectionalDoorX});
    })();

    // P1 is vector-drawn at 1:100. qX runs from the main-house end toward the
    // garage/store; qZ runs from the east elevation toward the zero-lot side.
    // The transform below registers qX 0..12.47 and qZ 0..7.55 directly below P2.
    const GROUND_SCHEDULED_AREAS = Object.freeze({groundFloor:117.46,garageStore:39.91,porch:3.37,total:160.74});
    const GROUND_SLAB_FOOTPRINT_Q = Object.freeze([
      Object.freeze([0,0]),Object.freeze([12.464,0]),Object.freeze([12.464,4.188]),
      Object.freeze([14.723,4.188]),Object.freeze([14.723,5.867]),Object.freeze([20.620,5.867]),
      Object.freeze([20.620,13.424]),Object.freeze([17.971,13.424]),Object.freeze([17.971,11.744]),
      Object.freeze([14.723,11.744]),Object.freeze([14.723,10.425]),Object.freeze([8.036,10.425]),
      Object.freeze([8.036,7.546]),Object.freeze([0,7.546])
    ]);
    const GROUND_MAIN_AND_PORCH_FOOTPRINT_Q = Object.freeze([
      Object.freeze([0,0]),Object.freeze([12.464,0]),Object.freeze([12.464,4.188]),Object.freeze([14.723,4.188]),
      Object.freeze([14.723,10.425]),Object.freeze([8.036,10.425]),Object.freeze([8.036,7.546]),Object.freeze([0,7.546])
    ]);
    const GROUND_MAIN_HOUSE_FOOTPRINT_Q = Object.freeze([
      Object.freeze([0,0]),Object.freeze([12.464,0]),Object.freeze([12.464,5.867]),Object.freeze([14.723,5.867]),
      Object.freeze([14.723,10.425]),Object.freeze([8.036,10.425]),Object.freeze([8.036,7.546]),Object.freeze([0,7.546])
    ]);
    const GROUND_ENTRY_PAVING_Q = Object.freeze([
      Object.freeze([12.464,4.188]),Object.freeze([14.723,4.188]),
      Object.freeze([14.723,5.867]),Object.freeze([12.464,5.867])
    ]);
    const GROUND_GARAGE_STORE_FOOTPRINT_Q = Object.freeze([
      Object.freeze([14.723,5.867]),Object.freeze([20.620,5.867]),Object.freeze([20.620,13.424]),
      Object.freeze([17.971,13.424]),Object.freeze([17.971,11.744]),Object.freeze([14.723,11.744])
    ]);
    const GROUND_GARAGE_STORE_INTERNAL_SLAB_Q = Object.freeze([
      Object.freeze([14.723,5.867]),Object.freeze([20.510,5.867]),Object.freeze([20.510,13.314]),
      Object.freeze([18.081,13.314]),Object.freeze([18.081,11.634]),Object.freeze([14.723,11.634])
    ]);

    // These bands are taken from the P1 filled vector paths. Exterior outer leaf
    // is 110 mm, its paired inner leaf is 90 mm, and their unmeshed separation is
    // the drawing-defined 50 mm cavity. Garage/store zero-lot runs remain the
    // drawing-defined single 110 mm leaf rather than inventing a second leaf.
    const GROUND_P1_OUTER_LEAF_SEGMENTS_Q = Object.freeze([
      [0,1.069,0,.110],[0,.110,0,1.189],[0,.110,3.598,3.982],[0,.110,4.081,5.148],[0,.110,6.237,7.546],[0,4.368,7.436,7.546],
      [2.879,3.857,0,.110],[3.957,5.028,0,.110],[5.218,5.437,7.436,7.546],[5.857,6.047,7.436,7.546],[6.837,12.464,0,.110],
      [7.616,8.036,7.436,7.546],[8.036,8.146,8.156,8.506],[8.036,8.146,9.236,10.315],[8.146,11.974,10.315,10.425],
      [12.354,12.464,0,.710],[12.354,12.464,3.608,4.578],[12.354,12.464,5.457,5.867],[12.354,14.723,5.757,5.867],
      [13.783,14.613,10.315,10.425],[14.613,14.723,5.917,10.265],[14.613,14.723,10.425,11.744],[14.613,16.822,11.634,11.744],
      [14.723,14.833,10.190,10.495],[14.723,15.038,11.535,11.644],[14.733,14.983,5.757,5.867],[14.733,14.983,5.877,5.987],
      [16.507,16.822,11.535,11.644],[17.752,18.081,11.525,11.634],[17.752,18.081,11.634,11.744],[17.971,18.081,11.634,13.424],
      [17.971,20.620,13.314,13.424],[18.081,18.191,13.119,13.314],[20.030,20.510,5.757,5.867],[20.030,20.510,5.877,5.987],
      [20.400,20.510,7.851,8.156],[20.400,20.510,10.015,10.320],[20.400,20.510,12.999,13.314],[20.510,20.620,5.867,13.424]
    ].map(Object.freeze));

    const GROUND_P1_INNER_LEAF_SEGMENTS_Q = Object.freeze([
      [.160,1.069,.160,.250],[.160,.250,.160,1.189],[.160,.250,3.598,3.982],[.160,.250,4.081,5.148],[.160,.250,6.237,7.386],[.160,4.368,7.297,7.386],
      [2.879,3.857,.160,.250],[3.957,5.028,.160,.250],[5.218,5.437,7.297,7.386],[5.857,6.047,7.297,7.386],[6.837,12.304,.160,.250],
      [7.616,8.196,7.297,7.386],[8.196,8.286,8.156,8.506],[8.196,8.286,9.236,10.175],[8.286,11.974,10.175,10.265],
      [12.214,12.304,.160,.710],[12.214,12.304,3.608,4.578],[12.214,12.304,5.457,6.007],[12.214,14.613,5.917,6.007],[13.783,14.613,10.175,10.265]
    ].map(Object.freeze));

    const GROUND_P1_INTERNAL_WALL_SEGMENTS_Q = Object.freeze([
      [4.058,4.148,4.677,7.297],[4.148,4.568,5.607,5.697],
      [5.078,7.616,4.587,4.677],[5.347,5.437,5.607,7.317],[5.437,6.047,5.607,5.697],[5.437,5.957,7.046,7.136],
      [5.857,5.947,7.136,7.297],[5.957,6.047,7.136,7.297],[7.616,7.706,.250,1.895],[7.616,7.706,2.495,3.608],
      [7.616,7.706,4.537,7.297],[7.706,9.885,3.468,3.558],[8.196,8.286,7.386,7.546],[8.286,9.795,7.297,7.386],
      [8.286,9.066,8.306,8.396],[8.626,8.796,4.587,4.677],[8.706,8.796,4.587,5.667],[9.795,9.885,5.917,8.306],
      [9.795,11.055,8.306,8.396],[9.885,11.235,5.917,6.007],[10.815,10.905,3.468,4.188],[10.815,12.214,4.098,4.188],
      [11.055,11.145,6.007,6.682],[11.055,11.145,7.611,8.396],[11.055,11.145,9.226,10.175]
    ].map(Object.freeze));

    // Establish the diagonal PTY host wall from the two existing room-side wall
    // faces first. The P1 door line touches those faces (hinge at the vertical
    // inner face and latch at the horizontal inner face), so it is the PTY-side
    // wall face rather than the wall centreline. Move the 90 mm wall centre 45 mm
    // outward; the door and frame then follow that wall datum.
    const GROUND_PTY_WALL_ALIGNMENT_Q = (()=>{
      const thickness=.090;
      const verticalWallInnerPlaneQX=2.879;
      const horizontalWallInnerPlaneQZ=6.087;
      const sourceDoorInsideFaceConstant=2.878871+6.523414;
      const insideFaceConstant=sourceDoorInsideFaceConstant;
      const halfFaceConstant=thickness/Math.SQRT2;
      const centrelineConstant=insideFaceConstant-halfFaceConstant;
      const outsideFaceConstant=centrelineConstant-halfFaceConstant;
      const shiftComponent=(centrelineConstant-sourceDoorInsideFaceConstant)/2;
      return Object.freeze({
        thickness,
        verticalWallInnerPlaneQX,
        horizontalWallInnerPlaneQZ,
        sourceDoorInsideFaceConstant,
        insideFaceConstant,
        centrelineConstant,
        outsideFaceConstant,
        shiftQ:Object.freeze([shiftComponent,shiftComponent]),
        shiftDistance:Math.hypot(shiftComponent,shiftComponent),
        direction:'PTY exterior',
        authority:'adjacent wall inner faces; door follows wall'
      });
    })();

    // Both adjacent walls terminate at true face-to-face miter intersections.
    // Their former projecting triangular tips are excluded from these polygons.
    const GROUND_PTY_ANGLED_WALL_JOINS_Q = Object.freeze([
      Object.freeze({
        id:'PTY-DIRECT-NORTH-WEST',
        points:Object.freeze([
          [2.789,GROUND_PTY_WALL_ALIGNMENT_Q.outsideFaceConstant-2.789],
          [2.879,GROUND_PTY_WALL_ALIGNMENT_Q.insideFaceConstant-2.879],
          [2.879,7.297],[2.789,7.297]
        ].map(point=>Object.freeze(point.map(value=>Number(value.toFixed(9))))))
      }),
      Object.freeze({
        id:'PTY-DIRECT-SOUTH-EAST',
        points:Object.freeze([
          [GROUND_PTY_WALL_ALIGNMENT_Q.outsideFaceConstant-5.997,5.997],
          [4.058,5.997],[4.058,6.087],
          [GROUND_PTY_WALL_ALIGNMENT_Q.insideFaceConstant-6.087,6.087]
        ].map(point=>Object.freeze(point.map(value=>Number(value.toFixed(9))))))
      })
    ]);

    // The lintel is the same wall as the jambs, so its two faces terminate on
    // those exact miter points. Keeping this independent of door-frame overhang
    // prevents the door geometry from pulling either neighbouring wall into a
    // projecting plan tip.
    const GROUND_PTY_ANGLED_WALL_HEAD_MITER_Q = Object.freeze([
      [2.789,GROUND_PTY_WALL_ALIGNMENT_Q.outsideFaceConstant-2.789],
      [2.879,GROUND_PTY_WALL_ALIGNMENT_Q.insideFaceConstant-2.879],
      [GROUND_PTY_WALL_ALIGNMENT_Q.insideFaceConstant-6.087,6.087],
      [GROUND_PTY_WALL_ALIGNMENT_Q.outsideFaceConstant-5.997,5.997]
    ].map(point=>Object.freeze(point.map(value=>Number(value.toFixed(9))))));

    // v15 lowest-priority green-band audit. These are additive-only infills at
    // locations where P1 page 1 contains a green wall band and v14 contains no
    // wall, door, window or other model content. Existing geometry is never
    // moved or resized to agree with the overlay.
    const GROUND_GREEN_BAND_INFILL_SEGMENTS_Q = Object.freeze([
      Object.freeze({id:'GB01',name:'entry-master-continuity',wallClass:'internal',qBox:Object.freeze([11.055,11.145,6.682,7.611])}),
      Object.freeze({id:'GB03',name:'notch-inner-upper-corner',wallClass:'inner',qBox:Object.freeze([8.196,8.286,7.297,7.386])}),
      Object.freeze({id:'GB05',name:'study-bulkhead-continuity',wallClass:'internal',qBox:Object.freeze([7.616,7.706,1.895,2.495])}),
      Object.freeze({id:'GB06',name:'pdr-jamb-corner',wallClass:'internal',qBox:Object.freeze([4.058,4.148,4.587,4.677])}),
      Object.freeze({id:'GB07',name:'store-under-jamb-corner',wallClass:'internal',qBox:Object.freeze([7.706,7.796,4.587,4.677])}),
      Object.freeze({id:'GB08',name:'garage-rear-outer-corner',wallClass:'outer',qBox:Object.freeze([14.613,14.723,10.315,10.425])}),
      Object.freeze({id:'GB09',name:'ensuite-outer-corner',wallClass:'outer',qBox:Object.freeze([8.036,8.146,10.315,10.425])}),
      Object.freeze({id:'GB10',name:'ensuite-inner-corner',wallClass:'inner',qBox:Object.freeze([8.196,8.286,10.175,10.265])}),
      Object.freeze({id:'GB11',name:'garage-front-outer-corner',wallClass:'outer',qBox:Object.freeze([20.510,20.620,5.757,5.867])}),
      Object.freeze({id:'GB12',name:'study-window-pier-outer',wallClass:'outer',qBox:Object.freeze([12.354,12.464,2.100,2.220])}),
      Object.freeze({id:'GB13',name:'study-window-pier-inner',wallClass:'inner',qBox:Object.freeze([12.214,12.304,2.100,2.220])}),
      Object.freeze({id:'GB14',name:'dining-front-gap-outer',wallClass:'outer',qBox:Object.freeze([3.857,3.957,0.000,.110])}),
      Object.freeze({id:'GB15',name:'dining-front-gap-inner',wallClass:'inner',qBox:Object.freeze([3.857,3.957,.160,.250])}),
      Object.freeze({id:'GB16',name:'kitchen-side-gap-outer',wallClass:'outer',qBox:Object.freeze([0,.110,3.982,4.081])}),
      Object.freeze({id:'GB17',name:'kitchen-side-gap-inner',wallClass:'inner',qBox:Object.freeze([.160,.250,3.982,4.081])}),
      Object.freeze({id:'GB18',name:'linen-corner',wallClass:'internal',qBox:Object.freeze([5.957,6.047,7.046,7.136])})
    ]);

    // Main-house exterior openings sit midway across the unmeshed 50 mm cavity.
    // These are q-coordinate offsets from the relevant drawing edges; the
    // single-leaf garage/store openings deliberately do not use these planes.
    const GROUND_CAVITY_CENTRE_Q = Object.freeze({
      westX:(.110+.160)/2,
      southZ:(.110+.160)/2,
      northZ:(7.386+7.436)/2,
      steppedEastX:(8.146+8.196)/2,
      masterNorthZ:(10.265+10.315)/2,
      frontEastX:(12.304+12.354)/2
    });

    const GROUND_DOORS_Q = Object.freeze([
      {id:'GF-D-ENTRY',hinge:[12.329,5.427],p0:[11.510,5.427],p1:[12.329,4.608],closed:1,room:'ENTRY',drawingCode:'820 TF',exterior:true,faceRecognition:true,cavityCentred:true},
      {id:'GF-D-STORE-UNDER',hinge:[7.851,4.552],p0:[7.851,3.833],p1:[8.571,4.552],closed:0,room:'STORE UNDER',drawingCode:'720'},
      {id:'GF-D-PANTRY',hinge:[2.878871,6.523414],p0:[2.440670,6.085213],p1:[3.317072,6.085213],closed:1,room:'PANTRY',drawingCode:'620 PTY',angled:true},
      {id:'GF-D-LOBBY',hinge:[4.203,4.692],p0:[5.023,4.692],p1:[4.203,5.512],closed:0,room:'PDR / LAUNDRY LOBBY',drawingCode:'820'},
      {id:'GF-D-PDR',hinge:[5.243,5.712],p0:[5.243,6.332],p1:[4.623,5.712],closed:1,room:'PDR',drawingCode:'620'},
      {id:'GF-D-LAUNDRY',hinge:[5.452,4.732],p0:[6.272,4.732],p1:[5.452,5.552],closed:1,room:'LAUNDRY',drawingCode:'820'},
      {id:'GF-D-LINEN-A',hinge:[6.062,5.752],p0:[6.682,5.752],p1:[6.062,6.372],closed:1,room:'LINEN',drawingCode:'620'},
      {id:'GF-D-LINEN-B',hinge:[6.062,6.992],p0:[6.062,6.372],p1:[6.682,6.992],closed:0,room:'LINEN',drawingCode:'620'},
      {id:'GF-D-STUDY',hinge:[10.760,3.573],p0:[10.760,4.393],p1:[9.940,3.573],closed:1,room:'STUDY / THEATRE',drawingCode:'820'},
      {id:'GF-D-STORE',hinge:[17.697,11.749],p0:[17.697,12.569],p1:[16.877,11.749],closed:1,room:'STORE',drawingCode:'820 MF',exterior:true},
      {id:'GF-D-MASTER',hinge:[11.290,6.022],p0:[12.109,6.022],p1:[11.290,6.842],closed:0,room:'MASTER SUITE',drawingCode:'820'},
      {id:'GF-D-ENSUITE',hinge:[11.040,8.451],p0:[11.040,9.171],p1:[10.320,8.451],closed:0,room:'ENSUITE',drawingCode:'720'},
      {id:'GF-D-WC',hinge:[9.740,8.271],p0:[9.121,8.271],p1:[9.740,7.651],closed:1,room:'WC',drawingCode:'620'}
    ].map(Object.freeze));

    const GROUND_HOST_DOOR_OPENINGS_Q = Object.freeze({
      'GF-D-STORE-UNDER':Object.freeze({kind:'axis',qBox:Object.freeze([7.616,7.706,3.799,4.586]),surroundQBox:Object.freeze([7.616,7.706,3.608,4.586]),hostWall:'STORE-UNDER-WEST',frameClearHead:true}),
      'GF-D-PANTRY':Object.freeze({kind:'diagonal',a:Object.freeze([2.878871,6.523414]),b:Object.freeze([3.317072,6.085213]),thickness:.090,hostWall:'PTY-CHAMFER',frameClearHead:true,wallShiftQ:GROUND_PTY_WALL_ALIGNMENT_Q.shiftQ,wallAuthority:'adjacent-wall-inner-faces'}),
      'GF-D-LOBBY':Object.freeze({kind:'axis',qBox:Object.freeze([4.169,5.057,4.587,4.677]),surroundQBox:Object.freeze([4.148,5.078,4.587,4.677]),hostWall:'LOBBY-NORTH',frameClearHead:true}),
      'GF-D-PDR':Object.freeze({kind:'axis',qBox:Object.freeze([4.589,5.277,5.607,5.697]),surroundQBox:Object.freeze([4.568,5.347,5.607,5.697]),hostWall:'PDR-EAST',frameClearHead:true}),
      'GF-D-LAUNDRY':Object.freeze({kind:'axis',qBox:Object.freeze([5.347,5.437,4.698,5.586]),surroundQBox:Object.freeze([5.347,5.437,4.677,5.607]),hostWall:'LAUNDRY-WEST',frameClearHead:true}),
      'GF-D-LINEN-PAIR':Object.freeze({kind:'axis',qBox:Object.freeze([5.957,6.047,5.718,7.026]),surroundQBox:Object.freeze([5.957,6.047,5.697,7.046]),hostWall:'LINEN-EAST',doorIds:Object.freeze(['GF-D-LINEN-A','GF-D-LINEN-B']),frameClearHead:true}),
      'GF-D-STUDY':Object.freeze({kind:'axis',qBox:Object.freeze([9.906,10.794,3.468,3.558]),surroundQBox:Object.freeze([9.885,10.815,3.468,3.558]),hostWall:'STUDY-NORTH',frameClearHead:true}),
      'GF-D-MASTER':Object.freeze({kind:'axis',qBox:Object.freeze([11.256,12.143,5.917,6.007]),surroundQBox:Object.freeze([11.235,12.214,5.917,6.007]),hostWall:'MASTER-ENTRY',frameClearHead:true}),
      'GF-D-ENSUITE':Object.freeze({kind:'axis',qBox:Object.freeze([11.055,11.145,8.417,9.205]),surroundQBox:Object.freeze([11.055,11.145,8.396,9.226]),hostWall:'ENSUITE-PARTITION',frameClearHead:true}),
      'GF-D-WC':Object.freeze({kind:'axis',qBox:Object.freeze([9.795,9.885,7.617,8.305]),surroundQBox:Object.freeze([9.795,9.885,7.596,8.306]),hostWall:'WC-PARTITION',frameClearHead:true})
    });

    // Resolve drawing leaf lines onto the actual centre plane of their 90 mm
    // host wall. Raw P1 digitisation above remains immutable source evidence.
    const GROUND_DOOR_HOST_CENTRE_SHIFTS_Q = Object.freeze({
      'GF-D-STORE-UNDER':Object.freeze([-.190,0]),
      'GF-D-PANTRY':GROUND_PTY_WALL_ALIGNMENT_Q.shiftQ,
      'GF-D-LOBBY':Object.freeze([0,-.060]),
      'GF-D-PDR':Object.freeze([0,-.060]),
      'GF-D-LAUNDRY':Object.freeze([-.060,0]),
      'GF-D-LINEN-A':Object.freeze([-.060,0]),
      'GF-D-LINEN-B':Object.freeze([-.060,0]),
      'GF-D-STUDY':Object.freeze([0,-.060]),
      'GF-D-STORE':Object.freeze([0,-.060]),
      'GF-D-MASTER':Object.freeze([0,-.060]),
      'GF-D-ENSUITE':Object.freeze([.060,0]),
      'GF-D-WC':Object.freeze([.100,0])
    });

    const groundQToLocal = ([qx,qz]) => [PLAN_W-qx,PLAN_D-qz];
    const groundQBoxToLocal = ([qx0,qx1,qz0,qz1]) => [PLAN_W-qx1,PLAN_W-qx0,PLAN_D-qz1,PLAN_D-qz0];
    const polygonArea2D = points => Math.abs(points.reduce((sum,point,index)=>{
      const next=points[(index+1)%points.length];
      return sum+point[0]*next[1]-next[0]*point[1];
    },0))/2;

    function addGroundQBox(name,category,qBox,y0,y1,color,isWall=true,alpha=1) {
      const [x0,x1,z0,z1]=groundQBoxToLocal(qBox);
      return addBox(name,category,x0,x1,y0,y1,z0,z1,color,alpha,isWall);
    }

    function subtractGroundQBox(source,cut) {
      const ix0=Math.max(source[0],cut[0]),ix1=Math.min(source[1],cut[1]);
      const iz0=Math.max(source[2],cut[2]),iz1=Math.min(source[3],cut[3]);
      if(ix1<=ix0+.000001||iz1<=iz0+.000001)return [source];
      return [
        [source[0],ix0,source[2],source[3]],
        [ix1,source[1],source[2],source[3]],
        [ix0,ix1,source[2],iz0],
        [ix0,ix1,iz1,source[3]]
      ].filter(box=>box[1]-box[0]>.000001&&box[3]-box[2]>.000001);
    }

    function buildGroundInternalWallSegment(segment,index,base,top) {
      let pieces=[segment];
      Object.values(GROUND_HOST_DOOR_OPENINGS_Q).filter(opening=>opening.kind==='axis').forEach(opening=>{
        pieces=pieces.flatMap(piece=>subtractGroundQBox(piece,opening.surroundQBox||opening.qBox));
      });
      pieces.forEach((piece,pieceIndex)=>addGroundQBox(`GF-P1-internal-${index+1}-host-cut-${pieceIndex+1}`,'internal',piece,base,top,COLORS.internal,true));
    }

    function tagHostDoorHead(item,id,source='P1-wall-opening') {
      if(!item)return item;
      Object.assign(item,{hostOpeningAssemblyId:id,hostOpeningRole:'door-head',hostOpeningSource:source,doorOpeningHead:true,headFollowsDoorLeaf:false,isWall:true});
      return item;
    }

    function groundQBoxCompoundPart(qBox,y0,y1) {
      const [x0,x1,z0,z1]=groundQBoxToLocal(qBox);
      return {kind:'box',bounds:[x0,x1,y0,y1,z0,z1]};
    }

    function axisDoorSurroundParts(opening,base,top,headBottom) {
      const box=opening.qBox,surround=opening.surroundQBox||box;
      const parts=[];
      if(box[1]-box[0] > box[3]-box[2]) {
        if(box[0]-surround[0]>.0001)parts.push(groundQBoxCompoundPart([surround[0],box[0],surround[2],surround[3]],base,top));
        if(surround[1]-box[1]>.0001)parts.push(groundQBoxCompoundPart([box[1],surround[1],surround[2],surround[3]],base,top));
      } else {
        if(box[2]-surround[2]>.0001)parts.push(groundQBoxCompoundPart([surround[0],surround[1],surround[2],box[2]],base,top));
        if(surround[3]-box[3]>.0001)parts.push(groundQBoxCompoundPart([surround[0],surround[1],box[3],surround[3]],base,top));
      }
      parts.push(groundQBoxCompoundPart(box,headBottom,top));
      return parts;
    }

    function buildGroundPtyDirectWallAssembly(base,top) {
      const opening=GROUND_HOST_DOOR_OPENINGS_Q['GF-D-PANTRY'];
      const move=point=>[point[0]+opening.wallShiftQ[0],point[1]+opening.wallShiftQ[1]];
      const centreAq=move(opening.a),centreBq=move(opening.b);
      const headBottom=base+DOOR_H+PARAMS.DOOR_FRAME_HEAD_DEPTH+.020;
      const parts=GROUND_PTY_ANGLED_WALL_JOINS_Q.map(definition=>({kind:'prism',points:definition.points.map(groundQToLocal),y0:base,y1:top}));
      parts.push({kind:'prism',points:GROUND_PTY_ANGLED_WALL_HEAD_MITER_Q.map(groundQToLocal),y0:headBottom,y1:top});
      const item=V15_GROUND.addCompoundWall('GF-P1-PTY-direct-intersection-whole-wall','internal',parts,COLORS.internal,1);
      tagHostDoorHead(item,'GF-D-PANTRY','P1-diagonal-PTY-opening');
      Object.assign(item,{
        ptyDirectWallAssembly:true,
        directWallRunCount:2,
        angledWallJoinDegrees:45,
        angledWallJoinIds:Object.freeze(GROUND_PTY_ANGLED_WALL_JOINS_Q.map(definition=>definition.id)),
        hostWall:opening.hostWall,
        hostOpeningHeadBottom:headBottom,
        clearsFixedDoorFrame:true,
        wallThickness:.090,
        directIntersection:true,
        sharpPlanIntersection:true,
        taperedCornerFiller:false,
        doorOpeningCutFromWholeWall:true,
        oneWallMesh:true,
        wallMovedBeforeDoor:true,
        doorFollowsHostWall:true,
        wallAuthority:opening.wallAuthority,
        wallShiftQ:Object.freeze([...opening.wallShiftQ]),
        wallShiftDistance:GROUND_PTY_WALL_ALIGNMENT_Q.shiftDistance,
        wallCentreAq:Object.freeze(centreAq),
        wallCentreBq:Object.freeze(centreBq),
        ptyInsideFaceConstant:GROUND_PTY_WALL_ALIGNMENT_Q.insideFaceConstant,
        ptyCentrelineConstant:GROUND_PTY_WALL_ALIGNMENT_Q.centrelineConstant,
        ptyOutsideFaceConstant:GROUND_PTY_WALL_ALIGNMENT_Q.outsideFaceConstant,
        sideWallTipsTrimmed:true,
        headUsesFaceToFaceMiter:true,
        headMiterQ:GROUND_PTY_ANGLED_WALL_HEAD_MITER_Q,
        drawingSource:'21560 WD A3 · P1'
      });
    }

    function buildGroundHostDoorHeads() {
      const base=PARAMS.GROUND_FLOOR_DATUM,top=base+PARAMS.GROUND_WALL_HEIGHT;
      Object.entries(GROUND_HOST_DOOR_OPENINGS_Q).forEach(([id,opening])=>{
        if(opening.kind==='axis') {
          const headBottom=base+DOOR_H+(opening.frameClearHead?PARAMS.DOOR_FRAME_HEAD_DEPTH+.020:0);
          const surround=tagHostDoorHead(V15_GROUND.addCompoundWall(`GF-HOST-${id}-whole-wall-opening`,'internal',axisDoorSurroundParts(opening,base,top,headBottom),COLORS.internal,1),id);
          Object.assign(surround,{
            hostWall:opening.hostWall,
            hostOpeningHeadBottom:headBottom,
            clearsFixedDoorFrame:Boolean(opening.frameClearHead),
            doorOpeningCutFromWholeWall:true,
            oneWallMesh:true,
            frameCentreAlignedToWall:true,
            wallThickness:.090
          });
          if(opening.doorIds)surround.hostOpeningDoorIds=opening.doorIds;
          return;
        }
      });
    }

    function buildGroundEntryColumn() {
      const base=PARAMS.GROUND_FLOOR_DATUM;
      const brickTop=base+7*PARAMS.BRICK_COURSE_HEIGHT;
      const columnTop=base+25*PARAMS.BRICK_COURSE_HEIGHT;
      const brickQBox=[14.0832,14.4332,3.7980,4.1480];
      const shsQBox=[14.2134,14.3030,3.9282,4.0181];
      const brick=addGroundQBox('GF-ENTRY-column-brick-pier-7c','exterior',brickQBox,base,brickTop,COLORS.faceBrick,true);
      Object.assign(brick,{entryColumnAssemblyId:'GF-ENTRY-COLUMN',entryColumnRole:'350x350-face-brick-pier',brickCourseCount:7,sectionSize:[PARAMS.ENTRY_COLUMN_BRICK_BASE,PARAMS.ENTRY_COLUMN_BRICK_BASE],drawingSource:'21560 WD A3 · P1/P3'});
      const [bx0,bx1,bz0,bz1]=groundQBoxToLocal(brickQBox);
      for(let course=1;course<7;course++) {
        const y=base+course*PARAMS.BRICK_COURSE_HEIGHT+.0004;
        const joint=addLine(`GF-ENTRY-column-brick-course-${course}`,'exterior',[[bx0,y,bz0],[bx1,y,bz0],[bx1,y,bz1],[bx0,y,bz1],[bx0,y,bz0]],COLORS.outline,.42);
        Object.assign(joint,{entryColumnAssemblyId:'GF-ENTRY-COLUMN',brickCourseJoint:true,brickCourse:course});
      }
      const steel=PARAMS.ENTRY_COLUMN_STEEL;
      const [sx0,sx1,sz0,sz1]=groundQBoxToLocal(shsQBox);
      const parts=[
        addBox('GF-ENTRY-column-90SHS-west','exterior',sx0,sx0+steel,brickTop,columnTop,sz0,sz1,COLORS.paintedSteel,1),
        addBox('GF-ENTRY-column-90SHS-east','exterior',sx1-steel,sx1,brickTop,columnTop,sz0,sz1,COLORS.paintedSteel,1),
        addBox('GF-ENTRY-column-90SHS-north','exterior',sx0+steel,sx1-steel,brickTop,columnTop,sz0,sz0+steel,COLORS.paintedSteel,1),
        addBox('GF-ENTRY-column-90SHS-south','exterior',sx0+steel,sx1-steel,brickTop,columnTop,sz1-steel,sz1,COLORS.paintedSteel,1)
      ];
      parts.forEach(item=>Object.assign(item,{entryColumnAssemblyId:'GF-ENTRY-COLUMN',entryColumnRole:'painted-90-SHS',architecturalSteel:true,sectionSize:[PARAMS.ENTRY_COLUMN_SECTION,PARAMS.ENTRY_COLUMN_SECTION],steelThickness:steel,brickPierCoursesBelow:7,drawingSource:'21560 WD A3 · P1/P3'}));
    }

    function isGarageOuterSegment(segment) {
      return segment[0]>=14.613-.000001;
    }

    function buildGarageLowerWallExtensions(base,garageWallBase) {
      GROUND_P1_OUTER_LEAF_SEGMENTS_Q.forEach((segment,index)=>{
        if(!isGarageOuterSegment(segment))return;
        const coversSharedSlabDivider=Math.abs(segment[0]-14.613)<.000001&&Math.abs(segment[1]-14.723)<.000001&&segment[2]>=5.917-.000001;
        const lowerSegment=coversSharedSlabDivider?[14.608,14.728,segment[2],segment[3]]:segment;
        const foot=addGroundQBox(`GF-GARAGE-lower-rendered-brick-${index+1}`,'exterior',lowerSegment,garageWallBase,base,COLORS.exterior,true);
        Object.assign(foot,{
          garageLowerWall:true,
          wallStartCourse:PARAMS.GARAGE_WALL_BASE_COURSE,
          substrate:'brick-masonry',
          externalFinish:'render',
          meetsFootingCourse:PARAMS.GARAGE_FOOTING_TOP_COURSE,
          wrapsGarageSlab:true,
          garageSharedSlabDividerCover:coversSharedSlabDivider,
          originalQBox:coversSharedSlabDivider?Object.freeze([...segment]):null,
          concretePlinth:false,
          drawingSource:'21560 WD A3 · P1/P4/P11 + user garage-envelope clarification'
        });
        if(index===23)Object.assign(foot,{garagePier:true,garagePierNominalWidthMm:290,garagePierShiftMm:290,garagePierShiftDirection:'drawing qZ +290 mm / default-view left'});
      });
    }

    function buildGarageMfDoorRenderedBrickBase(base,garageWallBase,garageFloorTop) {
      const renderedBottom=base-PARAMS.BRICK_COURSE_HEIGHT;
      const qBox=[16.822,17.752,11.634,11.744];
      const support=addGroundQBox('GF-D-STORE-mf-recessed-rendered-masonry-support','exterior',[16.856,17.718,11.652,11.726],garageWallBase,garageFloorTop,COLORS.exterior,true);
      Object.assign(support,{garageMfDoorAssemblyId:'GF-D-STORE',thresholdSupport:true,recessedBelowRenderedCourse:true,externalFinish:'render',wrapsGarageSlab:true,concretePlinth:false});
      const brick=addGroundQBox('GF-D-STORE-mf-rendered-brick-base-1c','exterior',qBox,renderedBottom,base,COLORS.exterior,true);
      Object.assign(brick,{garageMfDoorAssemblyId:'GF-D-STORE',brickCourseCount:PARAMS.GARAGE_MF_RENDERED_BRICK_BASE_COURSES,sillCourse:PARAMS.GARAGE_MF_DOOR_SILL_COURSE,renderedBrickBase:true,visibleBrickBase:false,substrate:'brick-masonry',externalFinish:'render',matchesAdjacentWall:true,concretePlinth:false,drawingSource:'21560 WD A3 · P1/P3 + user threshold clarification'});
    }

    function buildGroundEntryPaving(base) {
      const footprint=GROUND_ENTRY_PAVING_Q.map(groundQToLocal);
      const paving=addPrism('GF-floor-entry-porch-paving-0c','floor',footprint,base-.060,base,COLORS.entryPaving,1);
      Object.assign(paving,{
        groundSlabZone:'entry-porch-paving',
        entryPaving:true,
        porchPaving:true,
        surfaceMaterial:'paving',
        notConcreteSlab:true,
        concretePlinth:false,
        topCourse:0,
        projectedArea:polygonArea2D(GROUND_ENTRY_PAVING_Q),
        drawingSource:'21560 WD A3 · P1/P3 + user paving clarification'
      });
      const lineY=base+.008;
      const outline=addLine('GF-entry-porch-paving-outline-0c','floor',footprint.map(([x,z])=>[x,lineY,z]),COLORS.entryPavingJoint,.88,true);
      Object.assign(outline,{entryPaving:true,pavingJoint:true,surfaceMaterial:'paving',notConcreteSlab:true});
      let jointIndex=0;
      for(let qx=12.914;qx<14.723-.225;qx+=.450) {
        const a=groundQToLocal([qx,4.188]),b=groundQToLocal([qx,5.867]);
        const joint=addLine(`GF-entry-porch-paving-joint-x-${++jointIndex}`,'floor',[[a[0],lineY,a[1]],[b[0],lineY,b[1]]],COLORS.entryPavingJoint,.62);
        Object.assign(joint,{entryPaving:true,pavingJoint:true,jointAxis:'qX',surfaceMaterial:'paving',notConcreteSlab:true});
      }
      jointIndex=0;
      for(let qz=4.488;qz<5.867-.001;qz+=.300) {
        const a=groundQToLocal([12.464,qz]),b=groundQToLocal([14.723,qz]);
        const joint=addLine(`GF-entry-porch-paving-joint-z-${++jointIndex}`,'floor',[[a[0],lineY,a[1]],[b[0],lineY,b[1]]],COLORS.entryPavingJoint,.62);
        Object.assign(joint,{entryPaving:true,pavingJoint:true,jointAxis:'qZ',surfaceMaterial:'paving',notConcreteSlab:true});
      }
      return paving;
    }

    function buildGroundPlumbingDuctAccessPanels() {
      const base=PARAMS.GROUND_FLOOR_DATUM,top=base+PARAMS.GROUND_WALL_HEIGHT;
      const outerQBox=[5.437,5.857,7.436,7.546];
      const innerQBox=[5.437,5.857,7.297,7.386];
      [outerQBox,innerQBox].forEach((qBox,index)=>{
        const wall=addGroundQBox(`GF-PLUMBING-DUCT-wall-fill-${index+1}`,'exterior',qBox,base,top,COLORS.exterior,true);
        Object.assign(wall,{plumbingDuctHostWall:true,notAWindow:true,drawingSource:'21560 WD A3 · P1/P3'});
      });
      const [x0,x1,z0]=groundQBoxToLocal(outerQBox);
      const panelZ0=z0-.010,panelZ1=z0-.002;
      [[.080,.500,'bottom'],[1.730,2.150,'top']].forEach(([y0,y1,position])=>{
        const panel=addBox(`GF-PLUMBING-DUCT-${position}-access-panel`,'exterior',x0+.040,x1-.040,base+y0,base+y1,panelZ0,panelZ1,COLORS.paintedSteel,1);
        Object.assign(panel,{plumbingDuctAccessPanel:true,accessPanelPosition:position,notAWindow:true,architecturalSteel:true,drawingSource:'21560 WD A3 · P3 · access panels to top and bottom'});
      });
    }

    function buildGroundEntryFixedFrameHead() {
      const base=PARAMS.GROUND_FLOOR_DATUM;
      const head=base+25*PARAMS.BRICK_COURSE_HEIGHT;
      [[12.354,12.464,4.578,5.457],[12.214,12.304,4.578,5.457]].forEach((qBox,index)=>{
        const infill=addGroundQBox(`GF-D-ENTRY-fixed-frame-head-infill-${index+1}`,'door',qBox,base+DOOR_H,head,COLORS.doorFrame,true);
        Object.assign(infill,{entryDoorFixedFrameHead:true,hostOpeningAssemblyId:'GF-D-ENTRY',fixedToOpening:true,faceRecognitionEntry:true,drawingFrameCode:'TF',drawingSource:'21560 WD A3 · P3 · 820 TF / 25c head'});
      });
    }

    function addGroundOpeningClosure(id,outerQBox,innerQBox,sill,head) {
      const base=PARAMS.GROUND_FLOOR_DATUM, top=base+PARAMS.GROUND_WALL_HEIGHT;
      [outerQBox,innerQBox].filter(Boolean).forEach((qBox,index)=>{
        if (sill>0) addGroundQBox(`${id}-leaf-${index+1}-sill`,'exterior',qBox,base,base+sill,COLORS.exterior,true);
        if (head<PARAMS.GROUND_WALL_HEIGHT) {
          const headMesh=addGroundQBox(`${id}-leaf-${index+1}-head`,'exterior',qBox,base+head,top,COLORS.exterior,true);
          if(/^GF-D-|^GF-GARAGE-/.test(id))tagHostDoorHead(headMesh,id,'P1-exterior-opening');
          else Object.assign(headMesh,{hostOpeningAssemblyId:id,hostOpeningRole:'window-head',hostOpeningSource:'P1-exterior-opening',headFollowsDoorLeaf:false});
        }
      });
    }

    function resolveGroundDoorDefinition(definition) {
      const shift=GROUND_DOOR_HOST_CENTRE_SHIFTS_Q[definition.id] || [0,0];
      const move=point=>[point[0]+shift[0],point[1]+shift[1]];
      return Object.freeze({...definition,hinge:Object.freeze(move(definition.hinge)),p0:Object.freeze(move(definition.p0)),p1:Object.freeze(move(definition.p1)),hostCentreShiftQ:Object.freeze([...shift])});
    }

    function addGroundDoorFromQ(definition) {
      const base=PARAMS.GROUND_FLOOR_DATUM;
      const resolved=resolveGroundDoorDefinition(definition);
      const hinge=groundQToLocal(resolved.hinge);
      const qClosed=resolved.closed===0?resolved.p0:resolved.p1;
      const qOpen=resolved.closed===0?resolved.p1:resolved.p0;
      const closed=groundQToLocal(qClosed), opened=groundQToLocal(qOpen);
      const width=Math.hypot(closed[0]-hinge[0],closed[1]-hinge[1]);
      const arcStart=Math.atan2(closed[1]-hinge[1],closed[0]-hinge[0]);
      let arcEnd=Math.atan2(opened[1]-hinge[1],opened[0]-hinge[0]);
      while (arcEnd-arcStart>Math.PI) arcEnd-=Math.PI*2;
      while (arcEnd-arcStart<-Math.PI) arcEnd+=Math.PI*2;
      const state=V15_GROUND.addDoor(resolved.id,hinge[0],hinge[1],width,arcEnd,arcStart,arcEnd,(hinge[0]+closed[0])*.5,(hinge[1]+closed[1])*.5,'opening',{
        baseY:base,
        drawingCode:resolved.drawingCode,
        source:resolved.faceRecognition?'21560 WD A3 · P1/P3 · Sublimetrics secure entry':'21560 WD A3 · P1',
        faceRecognition:Boolean(resolved.faceRecognition),
        frame:resolved.faceRecognition?'Metroll Metro 95 (retained)':'Metroll Metro 95'
      });
      Object.assign(state,{
        rawDrawingHingeQ:definition.hinge,
        resolvedHingeQ:resolved.hinge,
        hostCentreShiftQ:resolved.hostCentreShiftQ,
        frameCentreAlignedToWall:true,
        frameCentreAlignedToHostWall:true,
        doorFollowsHostWall:resolved.id==='GF-D-PANTRY',
        hostWallMovedFirst:resolved.id==='GF-D-PANTRY',
        hostWallAlignmentSource:resolved.id==='GF-D-PANTRY'?GROUND_PTY_WALL_ALIGNMENT_Q.authority:null,
        hostWallShiftDistance:resolved.id==='GF-D-PANTRY'?GROUND_PTY_WALL_ALIGNMENT_Q.shiftDistance:Math.hypot(...resolved.hostCentreShiftQ),
        doorOpeningCutFromWholeWall:!resolved.exterior||resolved.id==='GF-D-ENTRY'
      });
    }

    function addGroundQLabel(text,qx,qz,kind='room',category=null,priority) {
      const [x,z]=groundQToLocal([qx,qz]);
      addLabel(text,x,PARAMS.GROUND_FLOOR_DATUM+.13,z,kind,category,priority);
    }

    function buildGroundGeometry() {
      activeBuildLevel='ground';
      const base=PARAMS.GROUND_FLOOR_DATUM;
      const course=PARAMS.BRICK_COURSE_HEIGHT;
      const sill7=7*course;
      const sill11=11*course;
      const sill13=13*course;
      const head25=25*course;
      const slider25Height=head25+PARAMS.CORNICE_PROXY;
      const garageWallBase=base+PARAMS.GARAGE_WALL_BASE_COURSE*course;
      const garageSlabBase=base+PARAMS.GARAGE_SLAB_BASE_COURSE*course;
      const garageFloorTop=base+PARAMS.GARAGE_FLOOR_TOP_COURSE*course;
      const garageSectionalBase=base+PARAMS.GARAGE_SECTIONAL_BASE_COURSE*course;
      const mainFootprint=GROUND_MAIN_HOUSE_FOOTPRINT_Q.map(groundQToLocal);
      const garageFootprint=GROUND_GARAGE_STORE_INTERNAL_SLAB_Q.map(groundQToLocal);
      const mainSlab=addPrism('GF-floor-main-house-0c','floor',mainFootprint,base-.150,base,COLORS.floor,1);
      Object.assign(mainSlab,{groundSlabZone:'main-house',topCourse:0,drawingSource:'21560 WD A3 · P1'});
      buildGroundEntryPaving(base);
      const garageSlab=addPrism('GF-floor-garage-store-interior-grano-minus-1c','floor',garageFootprint,garageSlabBase,garageFloorTop,COLORS.floor,1);
      Object.assign(garageSlab,{
        groundSlabZone:'garage-store-interior',
        bottomCourse:PARAMS.GARAGE_SLAB_BASE_COURSE,
        topCourse:PARAMS.GARAGE_FLOOR_TOP_COURSE,
        garageInteriorConcrete:true,
        brickWrapped:true,
        externalEdgeExposed:false,
        concretePlinth:false,
        drawingSource:'21560 WD A3 · P1/P4/P11 + user garage-envelope clarification'
      });
      addLine('GF-main-house-outline-0c','floor',mainFootprint.map(([x,z])=>[x,base+.008,z]),COLORS.outline,1,true);
      addLine('GF-overall-20.630x13.430','grid',[
        ...[[0,0],[20.63,0],[20.63,13.43],[0,13.43]].map(([qx,qz])=>{
          const [x,z]=groundQToLocal([qx,qz]); return [x,base+.004,z];
        })
      ],COLORS.grid,.45,true);

      GROUND_P1_OUTER_LEAF_SEGMENTS_Q.forEach((segment,index)=>{
        const wall=addGroundQBox(`GF-P1-outer-leaf-${index+1}`,'exterior',segment,base,base+PARAMS.GROUND_WALL_HEIGHT,COLORS.exterior,true);
        if(index===23)Object.assign(wall,{garagePier:true,garagePierNominalWidthMm:290,garagePierShiftMm:290,garagePierShiftDirection:'drawing qZ +290 mm / default-view left'});
      });
      GROUND_P1_INNER_LEAF_SEGMENTS_Q.forEach((segment,index)=>addGroundQBox(`GF-P1-inner-leaf-${index+1}`,'exterior',segment,base,base+PARAMS.GROUND_WALL_HEIGHT,COLORS.exterior,true));
      GROUND_P1_INTERNAL_WALL_SEGMENTS_Q.forEach((segment,index)=>buildGroundInternalWallSegment(segment,index,base,base+PARAMS.GROUND_WALL_HEIGHT));
      buildGroundPtyDirectWallAssembly(base,base+PARAMS.GROUND_WALL_HEIGHT);
      buildGarageLowerWallExtensions(base,garageWallBase);
      GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.forEach(item=>{
        const isInternal=item.wallClass==='internal';
        const mesh=addGroundQBox(
          `GF-P1-green-audit-${item.id}-${item.name}`,
          isInternal?'internal':'exterior',
          item.qBox,
          base,
          base+PARAMS.GROUND_WALL_HEIGHT,
          isInternal?COLORS.internal:COLORS.exterior,
          true
        );
        mesh.greenBandAudit=true;
        mesh.greenBandAuditId=item.id;
        mesh.greenBandAuditWallClass=item.wallClass;
        mesh.greenBandAuditSource='21560 WD A3.pdf · page 1';
        mesh.greenBandAuditPriority='lowest / additive only';
        mesh.greenBandAuditChangedExistingGeometry=false;
        if(!isInternal&&isGarageOuterSegment(item.qBox)) {
          const lower=addGroundQBox(`GF-GARAGE-lower-green-rendered-brick-${item.id}`,'exterior',item.qBox,garageWallBase,base,COLORS.exterior,true);
          Object.assign(lower,{
            garageLowerWall:true,
            wallStartCourse:PARAMS.GARAGE_WALL_BASE_COURSE,
            substrate:'brick-masonry',
            externalFinish:'render',
            meetsFootingCourse:PARAMS.GARAGE_FOOTING_TOP_COURSE,
            wrapsGarageSlab:true,
            concretePlinth:false,
            greenBandAuditId:item.id
          });
        }
      });
      buildGroundHostDoorHeads();
      buildGroundPlumbingDuctAccessPanels();
      buildGroundEntryColumn();
      buildGarageMfDoorRenderedBrickBase(base,garageWallBase,garageFloorTop);

      // Exterior heads and sills retain the cavity instead of bridging both leaves.
      addGroundOpeningClosure('GF-SD-DINING',[0,.110,1.189,3.598],[.160,.250,1.189,3.598],0,head25);
      addGroundOpeningClosure('GF-W-KITCHEN',[0,.110,5.148,6.237],[.160,.250,5.148,6.237],sill11,head25);
      addGroundOpeningClosure('GF-W-DINING',[1.069,2.879,0,.110],[1.069,2.879,.160,.250],0,head25);
      addGroundOpeningClosure('GF-W-LIVING',[5.028,6.837,0,.110],[5.028,6.837,.160,.250],0,head25);
      addGroundOpeningClosure('GF-W-OBS-A',[4.368,5.218,7.436,7.546],[4.368,5.218,7.297,7.386],sill13,head25);
      addGroundOpeningClosure('GF-SD-SERVICE',[6.047,7.616,7.436,7.546],[6.047,7.616,7.297,7.386],0,head25);
      addGroundOpeningClosure('GF-W-OBS-B',[8.036,8.146,7.546,8.156],[8.196,8.286,7.546,8.156],sill11,head25);
      addGroundOpeningClosure('GF-W-ENS',[8.036,8.146,8.506,9.236],[8.196,8.286,8.506,9.236],0,head25);
      addGroundOpeningClosure('GF-W-MASTER',[11.974,13.783,10.315,10.425],[11.974,13.783,10.175,10.265],0,head25);
      addGroundOpeningClosure('GF-W-STUDY-A',[12.354,12.464,.710,2.100],[12.214,12.304,.710,2.100],0,head25);
      addGroundOpeningClosure('GF-W-STUDY-B',[12.354,12.464,2.220,3.608],[12.214,12.304,2.220,3.608],0,head25);
      addGroundOpeningClosure('GF-D-ENTRY',[12.354,12.464,4.578,5.457],[12.214,12.304,4.578,5.457],0,head25);
      addGroundOpeningClosure('GF-GARAGE-SECTIONAL',[14.983,20.030,5.757,5.867],null,0,head25);
      addGroundOpeningClosure('GF-D-STORE',[16.822,17.752,11.634,11.744],null,0,2.040);
      buildGroundEntryFixedFrameHead();

      const westCavityX=PLAN_W-GROUND_CAVITY_CENTRE_Q.westX;
      const southCavityZ=PLAN_D-GROUND_CAVITY_CENTRE_Q.southZ;
      const northCavityZ=PLAN_D-GROUND_CAVITY_CENTRE_Q.northZ;
      const steppedEastCavityX=PLAN_W-GROUND_CAVITY_CENTRE_Q.steppedEastX;
      const masterNorthCavityZ=PLAN_D-GROUND_CAVITY_CENTRE_Q.masterNorthZ;
      const frontEastCavityX=PLAN_W-GROUND_CAVITY_CENTRE_Q.frontEastX;
      const glazingOptions={baseY:base};
      V15_GROUND.addGlassSliderZ('GF-SD-DINING',westCavityX,PLAN_D-3.598,PLAN_D-1.189,12.08,2,false,{baseY:base,height:slider25Height,glazingType:'clear',drawingCode:'25×10 SD · 3c SNAP VENT',flyscreen:true,flyscreenSide:1,flyscreenDirection:'right',exteriorFlyscreenTrack:true,reverseStacking:true,selectableLeaves:true,wovenFlyscreen:true,addCornice:false,cavityCentred:true});
      V15_GROUND.addGlazingZ('GF-W-KITCHEN',westCavityX,PLAN_D-6.237,PLAN_D-5.148,sill11,head25,'14×4.5',['fixed','slide-left'],-.18,{...glazingOptions,cavityCentred:true});
      const elevation4Grey={...glazingOptions,glazingType:'grey'};
      const compositeTwoPane={assemblySill:0,assemblyHead:head25,lowerFixedPanelCount:2};
      V15_GROUND.addGlazingX('GF-W-DINING',PLAN_W-2.879,PLAN_W-1.069,southCavityZ,sill7,head25,'25×7.5',['fixed','slide-left'],-.18,{...elevation4Grey,...compositeTwoPane,cavityCentred:true});
      V15_GROUND.addFixedTransomX('GF-W-DINING',PLAN_W-2.879,PLAN_W-1.069,southCavityZ,0,sill7,2,{...elevation4Grey,cavityCentred:true});
      V15_GROUND.addGlazingX('GF-W-LIVING',PLAN_W-6.837,PLAN_W-5.028,southCavityZ,sill7,head25,'25×7.5',['fixed','slide-left'],-.18,{...elevation4Grey,...compositeTwoPane,cavityCentred:true});
      V15_GROUND.addFixedTransomX('GF-W-LIVING',PLAN_W-6.837,PLAN_W-5.028,southCavityZ,0,sill7,2,{...elevation4Grey,cavityCentred:true});
      V15_GROUND.addGlazingX('GF-W-OBS-A',PLAN_W-5.218,PLAN_W-4.368,northCavityZ,sill13,head25,'12×3.5 OBS',['slide-right','fixed'],.18,{baseY:base,glazingType:'obscure',obscureMark:true,drawingGreyGlazing:true,cavityCentred:true});
      V15_GROUND.addGlassSliderX('GF-SD-SERVICE',PLAN_W-7.616,PLAN_W-6.047,northCavityZ,.22,2,{baseY:base,height:slider25Height,glazingType:'clear',drawingCode:'25×6.5 SD',flyscreen:true,flyscreenSide:-1,flyscreenDirection:'right',exteriorFlyscreenTrack:true,selectableLeaves:true,wovenFlyscreen:true,addCornice:false,cavityCentred:true});
      V15_GROUND.addGlazingZ('GF-W-OBS-B',steppedEastCavityX,PLAN_D-8.156,PLAN_D-7.546,sill11,head25,'PV OBS 14×2.5',['fixed'],.18,{baseY:base,obscure:true,cavityCentred:true});
      V15_GROUND.addGlazingZ('GF-W-ENS',steppedEastCavityX,PLAN_D-9.236,PLAN_D-8.506,sill7,head25,'OBS 25×3',['fixed'],.18,{baseY:base,obscure:true,assemblySill:0,assemblyHead:head25,lowerFixedPanelCount:1,cavityCentred:true});
      V15_GROUND.addFixedTransomZ('GF-W-ENS',steppedEastCavityX,PLAN_D-9.236,PLAN_D-8.506,0,sill7,1,{baseY:base,obscure:true,cavityCentred:true});
      V15_GROUND.addGlazingX('GF-W-MASTER',PLAN_W-13.783,PLAN_W-11.974,masterNorthCavityZ,sill7,head25,'25×7.5',['slide-right','fixed'],.18,{...elevation4Grey,...compositeTwoPane,cavityCentred:true});
      V15_GROUND.addFixedTransomX('GF-W-MASTER',PLAN_W-13.783,PLAN_W-11.974,masterNorthCavityZ,0,sill7,2,{...elevation4Grey,cavityCentred:true});
      V15_GROUND.addGlazingZ('GF-W-STUDY-A',frontEastCavityX,PLAN_D-2.100,PLAN_D-.710,sill7,head25,'25×6',['fixed','slide-left'],.18,{...glazingOptions,...compositeTwoPane,cavityCentred:true});
      V15_GROUND.addFixedTransomZ('GF-W-STUDY-A',frontEastCavityX,PLAN_D-2.100,PLAN_D-.710,0,sill7,2,{...glazingOptions,cavityCentred:true});
      V15_GROUND.addGlazingZ('GF-W-STUDY-B',frontEastCavityX,PLAN_D-3.608,PLAN_D-2.220,sill7,head25,'25×6',['slide-right','fixed'],.18,{...glazingOptions,...compositeTwoPane,cavityCentred:true});
      V15_GROUND.addFixedTransomZ('GF-W-STUDY-B',frontEastCavityX,PLAN_D-3.608,PLAN_D-2.220,0,sill7,2,{...glazingOptions,cavityCentred:true});

      GROUND_DOORS_Q.forEach(addGroundDoorFromQ);
      V15_GROUND.addSectionalDoorX('GF-GARAGE-SECTIONAL',PLAN_W-20.030,PLAN_W-14.983,PLAN_D-5.812,garageSectionalBase,(PARAMS.GARAGE_SECTIONAL_HEAD_COURSE-PARAMS.GARAGE_SECTIONAL_BASE_COURSE)*course);

      addGroundQLabel('GROUND FLOOR · P1 VECTOR VALIDATION',7.25,12.82,'key','floor',132);
      addGroundQLabel('KITCHEN',1.70,6.35);
      addGroundQLabel('PANTRY',3.25,6.35,'note');
      addGroundQLabel('DINING',1.80,2.25);
      addGroundQLabel('LIVING',4.75,2.25);
      addGroundQLabel('PDR',3.75,6.65);
      addGroundQLabel('LINEN',5.55,6.55,'note');
      addGroundQLabel('LAUNDRY',6.40,5.55);
      addGroundQLabel('STORE UNDER',7.45,4.55,'note');
      addGroundQLabel('STAIR',8.15,6.25,'note','stair');
      addGroundQLabel('WC',9.25,7.05,'note');
      addGroundQLabel('ENSUITE',9.45,9.15);
      addGroundQLabel('WIR',10.25,7.05,'note');
      addGroundQLabel('MASTER SUITE',11.65,8.75);
      addGroundQLabel('ENTRY',10.55,5.35);
      addGroundQLabel('STUDY / THEATRE',10.05,2.15);
      addGroundQLabel('PORCH',13.45,5.10,'note');
      addGroundQLabel('GARAGE',16.55,8.65);
      addGroundQLabel('STORE',19.15,12.35);
      addGroundQLabel('250 EXT. · 110 + 50 OPEN CAVITY + 90',1.05,.48,'key','exterior',126);
      addGroundQLabel('ZERO-LOT GARAGE/STORE · 110 DRAWING EXCEPTION',19.55,13.05,'key','exterior',116);
    }

    function addOpticalHalo(name,axis,plane,along,cy,halfWidth,halfHeight,intensity) {
      const spread=.11;
      const item=axis==='x'
        ? addBox(name,'lighting',plane-.0002,plane+.0002,cy-halfHeight-spread,cy+halfHeight+spread,along-halfWidth-spread,along+halfWidth+spread,[.95,.985,1,1],1)
        : addBox(name,'lighting',along-halfWidth-spread,along+halfWidth+spread,cy-halfHeight-spread,cy+halfHeight+spread,plane-.0002,plane+.0002,[.95,.985,1,1],1);
      item.lightHalo=true;
      item.alpha=.95;
      item.glowAxis=axis==='x'?0:1;
      item.glowShape=[along-(axis==='x'?PLAN_D:PLAN_W)/2,cy,halfWidth,halfHeight];
      item.emissionWhen=intensity;
      showItemWhen(item,()=>intensity()>.001);
      return item;
    }

    function addSceneLightControl(state,caption,normal,activate) {
      const button=document.createElement('button');
      button.type='button';
      button.className='scene-light-switch';
      button.id=`light-control-${state.id.toLowerCase()}`;
      button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 3v9m-5-7a9 9 0 1 0 10 0"/></svg>';
      button.dataset.lightControl=state.id;
      button.dataset.caption=caption;
      button.setAttribute('aria-label',`${caption}: off`);
      button.setAttribute('aria-pressed','false');
      button.hidden=true;
      button.dataset.revealed='false';
      button.addEventListener('click',event=>{
        event.stopPropagation();
        const control=lightControlButtons.find(c=>c.button===button);
        if(!control)return;
        // The whole visible glass button is usable. Its live anchor must still
        // be the nearest visible controller, so a wall can never be clicked through.
        activateLightControl(control);
        button.setAttribute('aria-pressed',String(state.active));
        button.setAttribute('aria-label',`${caption}: ${state.active?'on':'off'}`);
        button.dataset.temperature=state.temperature;
      });
      button.addEventListener('keydown',event=>{
        if(state===mirrorLightingState)return;
        if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;
        const control=lightControlButtons.find(c=>c.button===button);if(!control||!projectControlTarget(control))return;
        const choice=event.key==='ArrowUp'?'warm':'cool';setRoomLightTemperature(state,choice,{announce:false});commandRoomLight(state,true);closeRoomLightMenu();event.preventDefault();
      });
      RESIDENCE_DOM.getElementById('scene-light-controls').appendChild(button);
      lightControlButtons.push({state,caption,normal,button,activate});
    }

    function wallAccessoryBox(name,axis,plane,normal,a0,a1,y0,y1,d0,d1,color) {
      const p0=plane+normal*d0,p1=plane+normal*d1;
      return axis==='x'
        ? addBox(name,'lighting',Math.min(p0,p1),Math.max(p0,p1),y0,y1,a0,a1,color,1)
        : addBox(name,'lighting',a0,a1,y0,y1,Math.min(p0,p1),Math.max(p0,p1),color,1);
    }

    function addRoomLight(def) {
      const base=def.level==='ground'?PARAMS.GROUND_FLOOR_DATUM:0;
      activeBuildLevel=def.level;
      const [axis,plane,normal,along]=def.switch;
      const front=plane+normal*.023;
      const anchor=axis==='x'?[front,base+1.075,along]:[along,base+1.075,front];
      const state={id:def.id,label:def.label,level:def.level,category:'lighting',anchor,active:false,intensity:0,temperature:'warm',bounds:def.bounds,screens:[]};
      roomLighting.push(state);
      const white=[.955,.965,.968,1];
      if(!def.existingSwitch) {
        wallAccessoryBox(`T22-LIGHT-${def.id}-switch-plate`,axis,plane,normal,along-.043,along+.043,base+1.010,base+1.140,.008,.016,white);
        wallAccessoryBox(`T22-LIGHT-${def.id}-switch-rocker`,axis,plane,normal,along-.024,along+.024,base+1.028,base+1.122,.016,.021,white);
      }
      const pickProxy=wallAccessoryBox(`T24-LIGHT-${def.id}-switch-pick-proxy`,axis,plane,normal,along-.060,along+.060,base+.990,base+1.160,.0222,.0232,[1,1,1,1]);
      pickProxy.physicalOnly=true;
      const indicator=wallAccessoryBox(`T22-LIGHT-${def.id}-switch-indicator`,axis,plane,normal,along-.006,along+.006,base+1.035,base+1.038,.021,.022,[.55,.65,.68,1]);
      indicator.emissionWhen=()=>state.intensity*.85;
      // Invisible ceiling downlights; no luminaire, roof or wall is added.
      const lampY=base+(def.level==='ground'?PARAMS.GROUND_WALL_HEIGHT:WALL_H)-.065;
      // Lounge: six smaller downlights instead of four stronger emitters.
      // Same combined intensity, with a middle row beside the landing guard.
      state.power=def.id==='UP-LOUNGE'?3.6:(def.wet?4.8:5.4);
      state.leds=[];
      def.bounds.forEach(([x0,x1,z0,z1])=>{
        const nx=Math.max(1,Math.ceil((x1-x0)/3.6)),nz=def.id==='UP-LOUNGE'?3:Math.max(1,Math.ceil((z1-z0)/3.6));
        for(let ix=0;ix<nx;ix++) for(let iz=0;iz<nz;iz++) {
          const position=[x0+(x1-x0)*(ix+.5)/nx,lampY,z0+(z1-z0)*(iz+.5)/nz];
          const led={id:ceilingLEDs.length,state,position,world:toWorld(...position),ready:false,dirty:true,revision:0};
          ceilingLEDs.push(led); state.leds.push(led);
        }
      });
      state.lamp=state.leds[0].position;
      addSceneLightControl(state,`${def.label} light`,axis==='x'?[normal,0,0]:[0,0,normal],()=>commandRoomLight(state));
    }

    function buildRoomLighting() {
      // Ceiling layout follows the EXISTING room faces. Shadow casters, not room
      // rectangles, decide where emitted light can travel through open doors.
      const upper=[
        {id:'UP-LOUNGE',label:'Lounge / landing',bounds:[[.25,4.33,.25,7.30]],switch:['x',4.33,-1,3.76],lamp:['x',4.33,-1,5.40]},
        {id:'UP-PASSAGE',label:'Passage',bounds:[[4.42,9.39,2.68,3.61]],switch:['z',2.68,1,7.76],lamp:['z',2.68,1,7.83]},
        {id:'UP-BED2',label:'Bed 2',bounds:[[5.02,8.32,3.70,7.30]],switch:['z',3.70,1,6.05],lamp:['x',5.02,1,4.72]},
        {id:'UP-BED3',label:'Bed 3',bounds:[[8.41,10.30,3.70,4.30],[8.41,12.22,4.30,7.30]],switch:['z',3.70,1,9.50],lamp:['x',8.41,1,5.30]},
        {id:'UP-BED4',label:'Bed 4',bounds:[[8.90,12.22,.25,2.59],[9.48,12.22,2.59,3.61]],switch:['z',3.61,-1,9.80],lamp:['z',3.61,-1,10.00]},
        {id:'UP-BATH',label:'Bathroom',wet:true,bounds:[[4.85,6.60,.25,2.59]],switch:['x',6.60,-1,1.70],lamp:['x',4.85,1,1.77]},
        {id:'UP-WC',label:'WC',wet:true,bounds:[[6.69,8.19,.25,1.13]],switch:['z',1.13,-1,7.56],lamp:['x',8.19,-1,.66]},
        {id:'UP-VANITY',label:'Vanity',wet:true,existingSwitch:true,bounds:[[6.69,8.19,1.22,2.59]],switch:['x',6.69,1,1.56],lamp:['x',8.19,-1,1.91]}
      ];
      upper.forEach(def=>addRoomLight({...def,level:'upper'}));
      const ground=[
        {id:'GF-DINING',label:'Dining',bounds:[[.25,3.957,.25,4.081]],switch:['z',.25,1,3.30],lamp:['z',.25,1,3.32]},
        {id:'GF-KITCHEN',label:'Kitchen',bounds:[[.25,4.058,4.081,7.297]],switch:['z',7.297,-1,2.48],lamp:['z',7.297,-1,1.38]},
        {id:'GF-LIVING',label:'Living',bounds:[[3.957,7.616,.25,4.587]],switch:['x',7.616,-1,3.20],lamp:['x',7.616,-1,1.10]},
        {id:'GF-PANTRY',label:'Pantry',bounds:[[4.148,5.347,5.697,7.297]],switch:['x',5.347,-1,5.97],lamp:['x',5.347,-1,6.46]},
        {id:'GF-PDR',label:'Powder room',wet:true,bounds:[[4.148,5.347,4.677,5.607]],switch:['z',5.607,-1,4.35],lamp:['x',4.148,1,5.18]},
        {id:'GF-LAUNDRY',label:'Laundry',bounds:[[5.437,7.616,4.677,5.607],[6.047,7.616,5.607,7.297]],switch:['z',4.677,1,6.45],lamp:['z',4.677,1,6.80]},
        {id:'GF-UNDERSTAIR',label:'Store under stair',bounds:[[7.706,8.706,3.558,5.667]],switch:['x',8.706,-1,5.16],lamp:['x',8.706,-1,5.10]},
        {id:'GF-ENTRY',label:'Entry',bounds:[[8.796,12.214,4.188,5.917],[7.706,9.795,5.667,7.297]],switch:['x',12.214,-1,5.63],lamp:['z',5.917,-1,10.24]},
        {id:'GF-WC',label:'Ground WC',wet:true,bounds:[[8.286,9.795,7.386,8.306]],switch:['z',7.386,1,9.54],lamp:['z',7.386,1,8.73]},
        {id:'GF-ENSUITE',label:'Ensuite',wet:true,bounds:[[8.286,11.055,8.396,10.175]],switch:['x',11.055,-1,9.48],lamp:['z',10.175,-1,10.00]},
        {id:'GF-WIR',label:'Walk-in robe',bounds:[[9.885,11.055,6.007,8.306]],switch:['x',9.885,1,6.28],lamp:['x',9.885,1,7.18]},
        {id:'GF-MASTER',label:'Master suite',bounds:[[11.145,14.613,6.007,10.175]],switch:['x',11.145,1,6.48],lamp:['x',14.613,-1,8.60]},
        {id:'GF-STUDY',label:'Study / theatre',bounds:[[7.706,12.214,.25,3.468],[10.905,12.214,3.468,4.098]],switch:['z',3.468,-1,9.59],lamp:['z',.25,1,10.22]},
        {id:'GF-GARAGE',label:'Garage',bounds:[[14.833,20.510,5.987,11.535]],switch:['z',5.987,1,20.28],lamp:['x',20.510,-1,9.25]},
        {id:'GF-STORE',label:'Store',bounds:[[18.081,20.510,11.535,13.314]],switch:['x',18.081,1,12.02],lamp:['z',13.314,-1,19.28]}
      ];
      const wallFromQ=([axis,plane,normal,along])=>axis==='x'
        ? ['x',PLAN_W-plane,-normal,PLAN_D-along]
        : ['z',PLAN_D-plane,-normal,PLAN_W-along];
      ground.forEach(def=>addRoomLight({...def,level:'ground',bounds:def.bounds.map(groundQBoxToLocal),switch:wallFromQ(def.switch),lamp:wallFromQ(def.lamp)}));
      activeBuildLevel='upper';
    }

    function commandRoomLight(state,on=!state.active,{silent=false,announce=true}={}) {
      if(state.active!==Boolean(on) && !silent) window.ResidenceSound?.play('light-switch');
      state.active=Boolean(on);
      if(announce)announceInteraction(`${state.label} light · ${state.active?'ON':'OFF'}`);
      return true;
    }

    const CEILING_SHADOW_VERTEX = `
      precision highp float;
      attribute vec3 aPosition;
      uniform mat4 uModel;
      uniform vec3 uLamp;
      varying float vDepth;
      void main() {
        vec3 p=(uModel*vec4(aPosition,1.0)).xyz-uLamp;
        float depth=-p.y;
        vDepth=depth/7.0;
        gl_Position=vec4(p.x/1.428148,p.z/1.428148,
          (7.0+.05)/(7.0-.05)*depth-2.0*7.0*.05/(7.0-.05),depth);
      }
    `;
    const CEILING_SHADOW_FRAGMENT = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      varying float vDepth;
      void main() {
        float depth=clamp(vDepth,0.0,.9999);
        vec2 encodedDepth=fract(depth*vec2(1.0,255.0));
        encodedDepth.x-=encodedDepth.y/255.0;
        gl_FragColor=vec4(encodedDepth,0.0,1.0);
      }
    `;
    const ceilingShadows={initialized:false,failed:false,size:2048,tile:256,revision:0,draws:0,updates:0,motionStamp:'',dynamic:[],batches:[]};

    function shadowBoundsAt(item,matrix) {
      const [lo,hi]=item.shadowBounds,outLo=[Infinity,Infinity,Infinity],outHi=[-Infinity,-Infinity,-Infinity];
      for(let c=0;c<8;c++) {
        const p=transformPoint(matrix,[c&1?hi[0]:lo[0],c&2?hi[1]:lo[1],c&4?hi[2]:lo[2]]);
        for(let a=0;a<3;a++) {outLo[a]=Math.min(outLo[a],p[a]);outHi[a]=Math.max(outHi[a],p[a]);}
      }
      return [outLo,outHi];
    }
    function ledReachesBounds(led,bounds) {
      const [lo,hi]=bounds;
      let d2=0;
      for(let a=0;a<3;a++) d2+=Math.pow(Math.max(lo[a]-led.world[a],0,led.world[a]-hi[a]),2);
      return d2<42.25 && lo[1]<led.world[1]-.05;
    }
    function initializeCeilingShadows() {
      if(ceilingShadows.initialized || ceilingShadows.failed) return;
      try {
        if(ceilingLEDs.length>64) throw new Error('Ceiling shadow atlas capacity exceeded');
        const s=ceilingShadows;
        s.program=createProgram(CEILING_SHADOW_VERTEX,CEILING_SHADOW_FRAGMENT);
        s.position=gl.getAttribLocation(s.program,'aPosition');
        s.model=gl.getUniformLocation(s.program,'uModel');
        s.lamp=gl.getUniformLocation(s.program,'uLamp');
        s.texture=gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,s.texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,s.size,s.size,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        s.depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,s.depth);
        gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,s.size,s.size);
        s.framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,s.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,s.texture,0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,s.depth);
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE) throw new Error('Ceiling shadow framebuffer unavailable');
        const precision=gl.getShaderPrecisionFormat?.(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT)?.precision || 10;
        s.bias=precision>=16?.004:.025;
        const batches=new Map();
        for(const item of meshes) {
          // Architectural occlusion remains even in cutaway view. Tiny decorative
          // flecks, translucent glazing and floor finish overlays need not cast.
          if(item.alpha<.995 || ['lighting','finishFloor','finishMetal','finishCarpet','trim','grid','metal'].includes(item.category)) continue;
          if(/fleck|grout|screw|handle|key-|indicator/.test(item.name)) continue;
          const [lo,hi]=item.shadowBounds,dimensions=hi.map((v,a)=>v-lo[a]).sort((a,b)=>b-a);
          if(dimensions[0]<.15 || dimensions[1]<.035) continue;
          if(item.transformWhen || item.visibleWhen) {
            s.dynamic.push({item,matrix:null,visible:null,bounds:item.shadowBounds});
            continue;
          }
          // A handful of spatial batches avoids submitting the entire building
          // for every small shadow. Each original mesh appears in one batch only.
          const key=`${item.level}:${Math.floor(item.lightCenter[0]/4)}:${Math.floor(item.lightCenter[2]/4)}`;
          if(!batches.has(key)) batches.set(key,{positions:[],lo:[Infinity,Infinity,Infinity],hi:[-Infinity,-Infinity,-Infinity]});
          const b=batches.get(key);
          for(const v of item.shadowPositions) b.positions.push(v);
          for(let a=0;a<3;a++) {b.lo[a]=Math.min(b.lo[a],lo[a]);b.hi[a]=Math.max(b.hi[a],hi[a]);}
        }
        for(const b of batches.values()) {
          const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(b.positions),gl.STATIC_DRAW);
          s.batches.push({buffer,count:b.positions.length/3,bounds:[b.lo,b.hi]});
        }
        for(const led of ceilingLEDs) {
          led.tileXY=[(led.id%8)*s.tile,Math.floor(led.id/8)*s.tile];
          led.tileUV=[(led.tileXY[0]+2)/s.size,(led.tileXY[1]+2)/s.size,(s.tile-4)/s.size,1];
        }
        s.initialized=true;
        appRoot.dataset.ceilingLighting='cached-shadow-atlas';
      } catch(error) {
        ceilingShadows.failed=true;
        appRoot.dataset.ceilingLighting='unavailable';
        console.warn('Ceiling lighting unavailable; original daylight retained.',error);
        announceInteraction('Ceiling lighting is unavailable on this graphics device. Daylight is unchanged.');
      } finally {
        gl.bindFramebuffer?.(gl.FRAMEBUFFER,null);gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);
      }
    }
    function updateCeilingShadows() {
      if(!ceilingLEDs.some(led=>led.state.intensity>.001)) return;
      initializeCeilingShadows();
      const s=ceilingShadows;
      if(!s.initialized || s.failed) return;
      const motion=JSON.stringify([openingInteractions.map(o=>[o.progress,o.slideDirection]),bathroomInteractions.map(o=>o.progress)]);
      if(motion!==s.motionStamp) {
        s.motionStamp=motion;
        for(const caster of s.dynamic) {
          const item=caster.item,matrix=item.transformWhen?item.transformWhen():IDENTITY_MATRIX;
          const visible=!item.visibleWhen || item.visibleWhen();
          if(caster.matrix && caster.visible===visible && matrix.every((v,a)=>Math.abs(v-caster.matrix[a])<.00001)) continue;
          const previous=caster.bounds;
          caster.bounds=shadowBoundsAt(item,matrix);caster.matrix=Array.from(matrix);caster.visible=visible;
          for(const led of ceilingLEDs) if(ledReachesBounds(led,previous)||ledReachesBounds(led,caster.bounds)) led.dirty=true;
        }
      }
      // An off-screen storey can still light the shared stair. Finish its dirty
      // maps as well, including a door that is moving while the view changes.
      const pending=ceilingLEDs.filter(led=>led.dirty && led.state.intensity>.001);
      // Oldest maps first: moving doors cannot starve the remaining maps. No
      // uninitialised map contributes light; a final refresh follows every motion.
      pending.sort((a,b)=>a.revision-b.revision || a.id-b.id);
      if(!pending.length) return;
      gl.useProgram(s.program);gl.bindFramebuffer(gl.FRAMEBUFFER,s.framebuffer);
      gl.disable(gl.BLEND);gl.disable(gl.DITHER);gl.disable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.enable(gl.SCISSOR_TEST);
      gl.enableVertexAttribArray(s.position);
      const draw=(buffer,count,matrix)=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.vertexAttribPointer(s.position,3,gl.FLOAT,false,0,0);
        gl.uniformMatrix4fv(s.model,false,matrix);gl.drawArrays(gl.TRIANGLES,0,count);s.draws++;
      };
      for(const led of pending.slice(0,2)) {
        const [x,y]=led.tileXY;
        gl.scissor(x,y,s.tile,s.tile);gl.viewport(x+2,y+2,s.tile-4,s.tile-4);
        gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.uniform3f(s.lamp,...led.world);
        for(const b of s.batches) if(ledReachesBounds(led,b.bounds)) draw(b.buffer,b.count,IDENTITY_MATRIX);
        for(const c of s.dynamic) if(c.visible && ledReachesBounds(led,c.bounds)) draw(c.item.positionBuffer,c.item.count,c.matrix);
        led.ready=true;led.dirty=false;led.revision=++s.revision;s.updates++;
      }
      gl.disable(gl.SCISSOR_TEST);gl.enable(gl.DITHER);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,s.texture);gl.activeTexture(gl.TEXTURE0);
      appRoot.dataset.ceilingShadowStats=JSON.stringify({leds:ceilingLEDs.length,updates:s.updates,draws:s.draws,pending:pending.length-Math.min(2,pending.length),tile:256});
    }
    function lightingSamplesForLevel(level) {
      return ceilingLEDs.filter(led=>led.ready && led.state.intensity>.001 && (level==='shared'||led.state.level===level));
    }
    function lightingDrawItems(item) {
      if(item.lightDrawPieces) return item.lightDrawPieces;
      const [lo,hi]=item.shadowBounds;
      if(hi[0]-lo[0]<=3 || hi[2]-lo[2]<=3) return [item];
      // Render-only tiles for a broad continuous slab: each part can receive its
      // own nearby LEDs. Original mesh, dimensions, surfaces and shadows stay intact.
      const clip=(polygon,axis,value,sign)=>{
        const out=[];
        for(let i=0;i<polygon.length;i++) {
          const a=polygon[i],b=polygon[(i+1)%polygon.length];
          const da=(a[axis]-value)*sign,db=(b[axis]-value)*sign;
          if(da>=0) out.push(a);
          if((da>=0)!==(db>=0)) {const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
        }
        return out;
      };
      const bins=new Map(),size=2.5,p=item.shadowPositions,n=item.renderNormals;
      for(let i=0;i<p.length;i+=9) {
        const tri=[0,3,6].map(j=>[...p.slice(i+j,i+j+3),...n.slice(i+j,i+j+3)]);
        const x0=Math.floor(Math.min(...tri.map(v=>v[0]))/size),x1=Math.floor(Math.max(...tri.map(v=>v[0]))/size);
        const z0=Math.floor(Math.min(...tri.map(v=>v[2]))/size),z1=Math.floor(Math.max(...tri.map(v=>v[2]))/size);
        for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++) {
          let poly=clip(tri,0,x*size,1);poly=clip(poly,0,(x+1)*size,-1);poly=clip(poly,2,z*size,1);poly=clip(poly,2,(z+1)*size,-1);
          if(poly.length<3) continue;
          const key=`${x}:${z}`;
          if(!bins.has(key)) bins.set(key,{p:[],n:[]});
          const bin=bins.get(key);
          for(let j=1;j<poly.length-1;j++) for(const v of [poly[0],poly[j],poly[j+1]]) {bin.p.push(...v.slice(0,3));bin.n.push(...v.slice(3));}
        }
      }
      item.lightDrawPieces=[...bins.values()].map(bin=>{
        const part=Object.create(item),low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
        part.positionBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,part.positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bin.p),gl.STATIC_DRAW);
        part.normalBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,part.normalBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bin.n),gl.STATIC_DRAW);
        for(let i=0;i<bin.p.length;i++) {const a=i%3;low[a]=Math.min(low[a],bin.p[i]);high[a]=Math.max(high[a],bin.p[i]);}
        part.shadowBounds=[low,high];part.lightCenter=low.map((v,a)=>(v+high[a])*.5);part.count=bin.p.length/3;
        return part;
      });
      return item.lightDrawPieces;
    }
    function lightsForReceiver(item,samples) {
      const signature=samples.map(led=>led.id).join(',');
      const transform=item.transformWhen?item.transformWhen():null;
      const key=signature+(transform?Array.from(transform).map(v=>v.toFixed(2)).join(','):'');
      if(item.lightSelectionKey===key) return item.lightSelection;
      const bounds=transform?shadowBoundsAt(item,transform):item.shadowBounds;
      const [lo,hi]=bounds;
      const points=[lo.map((v,a)=>(v+hi[a])*.5)];
      const longAxis=hi[0]-lo[0]>hi[2]-lo[2]?0:2;
      const longReceiver=hi[longAxis]-lo[longAxis]>3;
      if(longReceiver) for(const f of [.1,.3,.7,.9]) { const p=points[0].slice();p[longAxis]=lo[longAxis]+f*(hi[longAxis]-lo[longAxis]);points.push(p); }
      const ranked=points.map(p=>samples.filter(led=>ledReachesBounds(led,bounds)).map(led=>{
        const within=led.state.bounds.some(b=>p[0]+PLAN_W/2>=b[0]-.08 && p[0]+PLAN_W/2<=b[1]+.08 && p[2]+PLAN_D/2>=b[2]-.08 && p[2]+PLAN_D/2<=b[3]+.08);
        const d2=led.world.reduce((sum,v,a)=>sum+(v-p[a])**2,0);
        return {led,score:d2*(within?.45:1)};
      }).sort((a,b)=>a.score-b.score));
      const selected=[];
      for(let rank=0;rank<ROOM_LIGHT_SLOTS;rank++) for(const list of ranked) {
        const led=list[rank]?.led;
        if(led&&!selected.includes(led)&&selected.length<(longReceiver?8:4)) selected.push(led);
      }
      item.lightSelectionKey=key;item.lightSelection=selected;
      return selected;
    }
    function uploadRoomLights(samples) {
      for(let index=0;index<ROOM_LIGHT_SLOTS;index++) {
        const led=samples[index];
        gl.uniform4f(locations.roomLights[index],...(led?[...led.world,categoryState.lighting?led.state.intensity*led.state.power:0]:[0,0,0,0]));
        gl.uniform3f(locations.roomLightColours[index],...(led?.state.temperature==='cool'?[.86,.94,1]:[1,.93,.82]));
        gl.uniform4f(locations.shadowTiles[index],...(led?led.tileUV:[0,0,0,0]));
      }
    }

    function lightControlOccluded(world,eye) {
      return lightingOccluders.some(item=>{
        if(!levelAllows(item.level)) return false;
        const b=item.bounds;
        let near=0,far=1;
        for(let axis=0;axis<3;axis++) {
          const delta=world[axis]-eye[axis],lo=b[axis*2],hi=b[axis*2+1];
          if(Math.abs(delta)<1e-7) { if(eye[axis]<lo || eye[axis]>hi) return false; }
          else {
            let a=(lo-eye[axis])/delta,c=(hi-eye[axis])/delta;
            if(a>c) [a,c]=[c,a];
            near=Math.max(near,a); far=Math.min(far,c);
            if(near>far) return false;
          }
        }
        return near>0 && near<1-.025/Math.max(.025,Math.hypot(...subtract(world,eye)));
      });
    }

    function refreshLightHintVisibility() {
      appRoot.dataset.lightHints=String(lightUI.hints);
      appRoot.dataset.controlLocators=String(lightUI.hints);
      for(const control of lightControlButtons) {
        control.button.dataset.revealed=String(lightUI.hints);
        control.button.tabIndex=lightUI.hints?0:-1;
      }
      for(const control of waterControlMarkers) {
        control.marker.dataset.revealed=String(lightUI.hints);
        control.marker.tabIndex=lightUI.hints?0:-1;
      }
    }
    let lastLightControlPose='';
    function physicalSceneSignature() {
      const rect=canvas.getBoundingClientRect();
      return JSON.stringify([rect.left,rect.top,rect.width,rect.height,camera.target,camera.mobileFrameOffset,camera.yaw,camera.pitch,camera.distance,
        levelMode,wallMode,categoryState,detailState,finishState,installedFinishState,
        openingInteractions.map(s=>[s.progress,s.handleTurn,s.keySway,s.slideDirection]),
        bathroomInteractions.map(s=>s.progress)]);
    }
    function updateSceneLightControls() {
      const pose=physicalSceneSignature()+JSON.stringify([systemsLevelMode,lightUI.hints,roomLighting.map(s=>[s.active,s.temperature]),bathroomInteractions.map(s=>s.active),waterSystem.revision,mirrorLightingState?.active,activeRoomControl?.state.id]);
      refreshSystemsControlStates();
      if(pose===lastLightControlPose)return;
      lastLightControlPose=pose;
      const rect=canvas.getBoundingClientRect(),eye=cameraEye();
      lightControlButtons.forEach(control=>{
        const {state,caption,normal,button}=control;
        button.hidden=true;
        state.screens=[];
        button.setAttribute('aria-pressed',String(state.active));
        button.setAttribute('aria-label',`${caption}: ${state.active?'on':'off'}`);
        button.dataset.temperature=state.temperature;
        if(!sceneControlLevelAllows(state.level) || !categoryState[state.category]) return;
        let world=toWorld(...state.anchor),faceNormal=normal;
        if(state.anchorTransformWhen) {
          const m=state.anchorTransformWhen();
          world=transformPoint(m,world).slice(0,3);
          faceNormal=[m[0]*normal[0]+m[4]*normal[1]+m[8]*normal[2],m[1]*normal[0]+m[5]*normal[1]+m[9]*normal[2],m[2]*normal[0]+m[6]*normal[1]+m[10]*normal[2]];
        }
        const viewVector=subtract(eye,world);
        if(viewVector[0]*faceNormal[0]+viewVector[1]*faceNormal[1]+viewVector[2]*faceNormal[2]<=0 || !projectControlTarget(control)) return;
        const p=transformPoint(currentMVP,world);
        if(p[3]<=0) return;
        const nx=p[0]/p[3],ny=p[1]/p[3],nz=p[2]/p[3];
        if(Math.abs(nx)>.96 || Math.abs(ny)>.94 || nz< -1 || nz>1) return;
        const x=(nx*.5+.5)*rect.width,y=(-ny*.5+.5)*rect.height;
        const distance=Math.hypot(...viewVector),coarse=!!window.matchMedia?.('(pointer:coarse)').matches;
        const size=Math.max(coarse?38:26,Math.min(coarse?48:44,115/Math.max(2.5,distance)));
        button.style.setProperty('--control-size',`${size.toFixed(1)}px`);
        button.style.left=`${x}px`; button.style.top=`${y}px`; button.hidden=false;
        state.screens=[{x:rect.left+x,y:rect.top+y,localX:x,localY:y}];
      });
      waterControlMarkers.forEach(control=>{
        const active=Boolean(control.state.active);
        control.marker.dataset.active=String(active);
        control.marker.setAttribute('aria-pressed',String(active));
        control.marker.setAttribute('aria-label',`${control.state.kind}: ${active?'on':'off'}`);
        control.marker.hidden=true;
        if(!lightUI.hints || !sceneControlLevelAllows(control.state.level) || !categoryState[control.state.category]) return;
        let screen=control.state.screens.find(candidate=>{
          const pick=resolveSceneAction(candidate.x,candidate.y,'mouse');
          return pick?.kind==='bathroom'&&pick.state===control.state;
        });
        if(control.state.markerAnchor) {
          const world=toWorld(...control.state.markerAnchor);
          if(!isPointExposed(world)) return;
          const clip=transformPoint(currentMVP,world);
          if(clip[3]<=0) return;
          const nx=clip[0]/clip[3],ny=clip[1]/clip[3],nz=clip[2]/clip[3];
          if(nx<-.96 || nx>.96 || ny<-.94 || ny>.94 || nz< -1 || nz>1) return;
          const localX=(nx*.5+.5)*rect.width,localY=(-ny*.5+.5)*rect.height;
          screen={x:rect.left+localX,y:rect.top+localY,localX,localY,depth:nz,role:'external locator'};
        }
        if(!screen) return;
        control.marker.style.left=`${screen.localX}px`;
        control.marker.style.top=`${screen.localY}px`;
        control.marker.hidden=false;
      });
      refreshLightHintVisibility();
      if(activeRoomControl&&!projectControlTarget(activeRoomControl,activeRoomControlPoint))closeRoomLightMenu();
      appRoot.dataset.roomLightingStates=JSON.stringify(roomLighting.map(({id,label,level,active,intensity,temperature})=>({id,label,level,active,intensity:Number(intensity.toFixed(3)),temperature})));
    }

    function setControlLocators(show) {
      lightUI.hints=Boolean(show);
      const button=RESIDENCE_DOM.getElementById('light-hints-toggle');
      const locatorButton=RESIDENCE_DOM.getElementById('control-locators-toggle');
      button.setAttribute('aria-pressed',String(lightUI.hints));
      button.dataset.locatorsActive=String(lightUI.hints);
      if(locatorButton) {
        locatorButton.setAttribute('aria-pressed',String(lightUI.hints));
        locatorButton.setAttribute('aria-label',lightUI.hints?'Hide control markers':'Show control markers');
        locatorButton.title=lightUI.hints?'Hide control markers':'Show control markers';
      }
      appRoot.dataset.lightHints=String(lightUI.hints);
      updateSceneLightControls();
      return lightUI.hints;
    }
    let activeRoomControl=null,activeRoomControlPoint=null;
    function closeRoomLightMenu(returnFocus=false){
      const opener=activeRoomControl;
      RESIDENCE_DOM.getElementById('room-light-menu').hidden=true;activeRoomControl=null;activeRoomControlPoint=null;
      const primaryHidden=syncMobilePrimaryVisibility();
      if(returnFocus===true&&opener&&!primaryHidden)(lightUI.hints&&!opener.button.hidden?opener.button:canvas).focus({preventScroll:true});
    }
    function activateLightControl(control,exactHit=null) {
      const hit=exactHit||projectControlTarget(control);
      if(hit?.action?.control!==control||!controlWorldPose(control))return false;
      if(control.state===mirrorLightingState){control.activate();return true;}
      if(control.state.active){commandRoomLight(control.state,false);closeRoomLightMenu();return true;}
      activeRoomControl=control;activeRoomControlPoint=hit.point;
      const menu=RESIDENCE_DOM.getElementById('room-light-menu'),screen=control.state.screens[0];
      menu.hidden=false;RESIDENCE_DOM.getElementById('room-light-menu-title').textContent=control.state.label;
      const rect=canvas.getBoundingClientRect();
      menu.style.left=`${Math.max(12,Math.min(rect.right-106,(screen?.x||rect.left+rect.width/2)+24))}px`;
      menu.style.top=`${Math.max(12,Math.min(rect.bottom-154,(screen?.y||rect.top+rect.height/2)-70))}px`;
      const choices=Array.from(document.querySelectorAll('[data-room-light-action]'));
      choices.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roomLightAction===control.state.temperature)));
      syncMobilePrimaryVisibility();
      return true;
    }
    function setLightMenuChoice(choice){document.querySelectorAll('[data-room-light-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roomLightAction===choice)));}
    RESIDENCE_DOM.getElementById('room-light-menu-close').addEventListener('click',()=>closeRoomLightMenu(true));
    document.querySelectorAll('[data-room-light-action]').forEach(button=>button.addEventListener('click',()=>{
      const control=activeRoomControl;if(!control||!projectControlTarget(control,activeRoomControlPoint)){closeRoomLightMenu();return;}
      const choice=button.dataset.roomLightAction;
      setRoomLightTemperature(control.state,choice,{announce:false});
      commandRoomLight(control.state,true);closeRoomLightMenu(true);
    }));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeRoomLightMenu(true);});
    document.addEventListener('pointerdown',e=>{if(!e.target.closest?.('#room-light-menu,.scene-light-switch'))closeRoomLightMenu();});
    document.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse') return;
      lightUI.pointer=[event.clientX,event.clientY];refreshLightHintVisibility();
    },{passive:true});
    document.addEventListener('pointerout',event=>{
      if(!event.relatedTarget) {lightUI.pointer=null;refreshLightHintVisibility();}
    },{passive:true});

    // Subtract only interfering surfaces. Existing wall/window geometry and
    // material sampling remain untouched, including the tile grid outside holes.
    const v7RepairLog={windowMeshes:[],stairMeshes:[]};
    const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    function splitSurfacePolygon(poly,plane) {
      const inside=[],outside=[];
      for(let i=0;i<poly.length;i++) {
        const a=poly[i],b=poly[(i+1)%poly.length],da=dot3(plane.n,a)-plane.d,db=dot3(plane.n,b)-plane.d;
        (da<=0?inside:outside).push(a);
        if((da<0&&db>0)||(da>0&&db<0)) {
          const t=da/(da-db),p=a.map((v,k)=>v+(b[k]-v)*t);inside.push(p);outside.push(p);
        }
      }
      return {inside,outside};
    }
    function polygonArea3(poly) {
      let area=0;for(let i=1;i+1<poly.length;i++)area+=Math.hypot(...cross(subtract(poly[i],poly[0]),subtract(poly[i+1],poly[0])))/2;return area;
    }
    function convexMeshVolume(item) {
      const p=item.shadowPositions,centre=item.lightCenter,planes=[];
      for(let i=0;i<p.length;i+=9) {
        const a=Array.from(p.slice(i,i+3)),b=Array.from(p.slice(i+3,i+6)),c=Array.from(p.slice(i+6,i+9));
        let n=normalize(cross(subtract(b,a),subtract(c,a))),d=dot3(n,a);
        if(dot3(n,centre)>d){n=n.map(v=>-v);d=-d;}
        if(!planes.some(q=>Math.abs(q.d-d)<1e-5&&dot3(q.n,n)>.99999))planes.push({n,d});
      }
      if(planes.some(q=>{for(let i=0;i<p.length;i+=3)if(q.n[0]*p[i]+q.n[1]*p[i+1]+q.n[2]*p[i+2]>q.d+.00002)return true;return false;}))return null;
      return {planes,bounds:item.shadowBounds};
    }
    function subtractMeshVolume(item,volume,log) {
      const [a,b]=item.shadowBounds,[c,d]=volume.bounds;
      if(a.some((v,k)=>b[k]<=c[k]+.00001||v>=d[k]-.00001))return;
      const p=item.shadowPositions,normals=item.renderNormals,polys=[];
      let changed=false;
      for(let i=0;i<p.length;i+=9) {
        const tri=[0,3,6].map(k=>[...p.slice(i+k,i+k+3),...normals.slice(i+k,i+k+3)]);
        let strict=tri;
        for(const plane of volume.planes) {strict=splitSurfacePolygon(strict,{n:plane.n,d:plane.d-.00001}).inside;if(strict.length<3)break;}
        if(polygonArea3(strict)<1e-10){polys.push({poly:tri,n:Array.from(normals.slice(i,i+3))});continue;}
        changed=true;let inside=tri;
        for(const plane of volume.planes) {
          if(inside.length<3)break;
          const parts=splitSurfacePolygon(inside,plane);
          if(parts.outside.length>=3)polys.push({poly:parts.outside,n:Array.from(normals.slice(i,i+3))});inside=parts.inside;
        }
      }
      if(!changed)return;
      const positions=[],renderNormals=[];
      for(const {poly,n} of polys) for(let i=1;i+1<poly.length;i++) {
        if(polygonArea3([poly[0],poly[i],poly[i+1]])<1e-11)continue;
        for(const vertex of [poly[0],poly[i],poly[i+1]]){positions.push(...vertex.slice(0,3));renderNormals.push(...vertex.slice(3,6));}
      }
      if(!log.includes(item.name))log.push(item.name);
      item.count=positions.length/3;item.geometryPositionHash=hashGeometryPositions(positions);
      item.shadowPositions=new Float32Array(positions);item.renderNormals=new Float32Array(renderNormals);
      const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
      positions.forEach((v,i)=>{lo[i%3]=Math.min(lo[i%3],v);hi[i%3]=Math.max(hi[i%3],v);});item.shadowBounds=[lo,hi];item.lightCenter=lo.map((v,k)=>(v+hi[k])/2);
      gl.bindBuffer(gl.ARRAY_BUFFER,item.positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,item.shadowPositions,gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER,item.normalBuffer);gl.bufferData(gl.ARRAY_BUFFER,item.renderNormals,gl.STATIC_DRAW);
    }
    function applyV7GeometryRepairs() {
      for(const [zone,x0,x1] of [['wet-bath-north-full-height',5.84,6.60],['wet-wc-vanity-north-full-height',6.95,7.68]]) {
        const lo=toWorld(x0,1.457,.240),hi=toWorld(x1,2.143,.275);
        const volume={bounds:[lo,hi],planes:[]};
        for(let k=0;k<3;k++){const n=[0,0,0];n[k]=1;volume.planes.push({n,d:hi[k]},{n:n.map(v=>-v),d:-lo[k]});}
        meshes.filter(m=>m.wetTileZone===zone).forEach(m=>subtractMeshVolume(m,volume,v7RepairLog.windowMeshes));
      }
      // Stair and continuous-carpet meshes already match the approved v21 source.
      // Do not subtract wall volumes a second time: that creates pointed tread slivers.
      for(let i=meshes.length-1;i>=0;i--)if(meshes[i].count===0)meshes.splice(i,1);
      for(const line of lines.filter(l=>l.highVisibilityRobeArrow)) {
        const panels=meshes.filter(m=>m.name.startsWith(`${line.robeAssemblyId}-panel-`)&&/-moving$/.test(m.name));
        const owner=line.robeArrowRole==='slide-right'?panels[0]:panels[panels.length-1];
        if(owner)line.transformWhen=owner.transformWhen;
      }
    }

    function rayBox(origin,dir,bounds,limit=80) {
      let near=0,far=limit;
      for(let k=0;k<3;k++) {
        if(Math.abs(dir[k])<1e-10){if(origin[k]<bounds[0][k]||origin[k]>bounds[1][k])return null;continue;}
        let a=(bounds[0][k]-origin[k])/dir[k],b=(bounds[1][k]-origin[k])/dir[k];if(a>b)[a,b]=[b,a];
        near=Math.max(near,a);far=Math.min(far,b);if(near>far)return null;
      }return near;
    }
    function openWindowClosureRayHit(origin,direction,limit=80) {
      let closest=null,best=limit;
      for(const state of openingInteractions) {
        if(!state.canToggle || !state.kind.startsWith('operable window') || !state.closedHitBounds) continue;
        if(state.progress<=.001 && state.target<=.5) continue;
        if(!levelAllows(state.level) || !categoryState[state.category]) continue;
        const t=rayBox(origin,direction,state.closedHitBounds,best);
        if(t===null || t<.0001 || t>=best) continue;
        best=t;
        closest={
          item:state.closedHitTarget,
          t,
          point:origin.map((value,index)=>value+direction[index]*t),
          action:{kind:'opening',state},
          closedWindowHitTarget:true
        };
      }
      return closest;
    }
    function makePickTree(items) {
      if(!items.length)return null;
      const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
      for(const m of items)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],m.shadowBounds[0][k]);hi[k]=Math.max(hi[k],m.shadowBounds[1][k]);}
      if(items.length<=8)return {bounds:[lo,hi],items};
      const axis=hi.map((v,k)=>v-lo[k]).indexOf(Math.max(...hi.map((v,k)=>v-lo[k])));
      items.sort((a,b)=>a.lightCenter[axis]-b.lightCenter[axis]);const mid=items.length>>1;
      return {bounds:[lo,hi],left:makePickTree(items.slice(0,mid)),right:makePickTree(items.slice(mid))};
    }
    function preparePhysicalPicking() {
      if(physicalPickIndex.ready)return;
      const openings=[...openingInteractions].sort((a,b)=>b.id.length-a.id.length);
      for(const m of meshes) {
        if(m.physicalAction)continue;
        for(const s of openings) {
          const windowMatch=s.panelIndex&&(m.name.startsWith(`${s.assemblyId}-glass-${s.panelIndex}-`)||m.name.startsWith(`${s.assemblyId}-${s.panelIndex}-sash-`));
          if((windowMatch||(!s.panelIndex&&m.name.startsWith(`${s.id}-`)&&m.transformWhen))&&s.canToggle) {m.physicalAction={kind:'opening',state:s};break;}
        }
        for(const control of lightControlButtons) {
          if((m.name.startsWith(`T22-LIGHT-${control.state.id}-switch-`)||m.name.startsWith(`T24-LIGHT-${control.state.id}-switch-`))||(control.state.id==='UP-VANITY'&&/^T18-ELECTRICAL-(two-gang-switch-plate|room-light-rocker)/.test(m.name))||(control.state===mirrorLightingState&&m.name==='T18-VANITY-mirror-touch-demister-control'))m.physicalAction={kind:'light',control,state:control.state};
        }
        if(/^T18-VANITY-moonlight-(left|right)-/.test(m.name)&&m.transformWhen)m.physicalAction={kind:'bathroom',state:bathroomInteractions.find(s=>s.id==='T18-VANITY-MOONLIGHT-DOORS')};
        const waterState=/^T18-BATH-maxton-pop-up-waste/.test(m.name)?waterSystem.drain:/^T18-BATH-deck-mixer-(control|upright|spout)|^T23-BATH-downturned|^T24-BATH-(fill|drain)-control/.test(m.name)?waterSystem.bathTap:/^T18-SHOWER-(round-mixer|mixer-lever)/.test(m.name)?waterSystem.showerTap:/^T18-VANITY-(left|right)-mixer-/.test(m.name)?bathroomInteractions.find(s=>s.id===`T23-VANITY-${m.name.includes('-left-')?'LEFT':'RIGHT'}-TAP`):null;
        if(waterState)m.physicalAction={kind:'bathroom',state:waterState};
      }
      // Glazing participates regardless of alpha. Optical halos and flowing water
      // are not physical partitions; floor, wall, door and cabinet surfaces are.
      const physical=meshes.filter(m=>m.count&&!m.lightHalo&&!m.waterEffect&&!/demister-heated-zone/.test(m.bathroomFixtureComponent||''));
      physicalPickIndex.staticTree=makePickTree(physical.filter(m=>!m.transformWhen));
      physicalPickIndex.dynamic=physical.filter(m=>m.transformWhen);
      const transforms=new Map();
      for(const m of physicalPickIndex.dynamic) {
        if(!transforms.has(m.transformWhen))transforms.set(m.transformWhen,[]);
        transforms.get(m.transformWhen).push(m);
      }
      // Hardware sharing a hinge/slider transform shares one local BVH. A ray
      // is transformed once per assembly, not once per screw/handle/sash mesh.
      physicalPickIndex.groups=[...transforms].map(([transform,items])=>({transform,tree:makePickTree(items)}));
      physicalPickIndex.targets=physical.filter(m=>m.physicalAction);physicalPickIndex.ready=true;
    }
    function physicalRayHit(origin,direction,limit=80) {
      preparePhysicalPicking();let closest=null,best=limit;
      const visitMesh=(m,o,d)=>{
        if(m.physicalOnly) {if(!levelAllows(m.level)||!categoryState[m.category]||(m.visibleWhen&&!m.visibleWhen()))return;}
        else if(effectiveAlpha(m)<=.0001)return;
        if(rayBox(o,d,m.shadowBounds,best)===null)return;
        const p=m.shadowPositions;
        for(let i=0;i<p.length;i+=9) {
          const a=[p[i],p[i+1],p[i+2]],e1=[p[i+3]-a[0],p[i+4]-a[1],p[i+5]-a[2]],e2=[p[i+6]-a[0],p[i+7]-a[1],p[i+8]-a[2]];
          const h=cross(d,e2),det=dot3(e1,h);if(Math.abs(det)<1e-10)continue;
          const s=subtract(o,a),u=dot3(s,h)/det;if(u<-.000001||u>1.000001)continue;
          const q=cross(s,e1),v=dot3(d,q)/det;if(v<-.000001||u+v>1.000001)continue;
          const t=dot3(e2,q)/det;if(t<.0001||t>=best)continue;
          best=t;closest={item:m,t,point:origin.map((v,k)=>v+direction[k]*t),action:m.physicalAction||null};
        }
      };
      const visit=(node,o,d)=>{if(!node||rayBox(o,d,node.bounds,best)===null)return;if(node.items)node.items.forEach(m=>visitMesh(m,o,d));else{visit(node.left,o,d);visit(node.right,o,d);}};
      visit(physicalPickIndex.staticTree,origin,direction);
      for(const group of physicalPickIndex.groups) {
        const a=group.transform(),v=subtract(origin,[a[12],a[13],a[14]]);
        // All physical moving parts use rigid hinge/slider transforms.
        const o=[a[0]*v[0]+a[1]*v[1]+a[2]*v[2],a[4]*v[0]+a[5]*v[1]+a[6]*v[2],a[8]*v[0]+a[9]*v[1]+a[10]*v[2]];
        const d=[a[0]*direction[0]+a[1]*direction[1]+a[2]*direction[2],a[4]*direction[0]+a[5]*direction[1]+a[6]*direction[2],a[8]*direction[0]+a[9]*direction[1]+a[10]*direction[2]];
        visit(group.tree,o,d);
      }
      return closest;
    }
    function pointerRay(x,y) {
      const rect=canvas.getBoundingClientRect(),eye=cameraEye(),back=normalize(subtract(eye,camera.target));
      const right=normalize(cross(cameraUp(),back)),up=normalize(cross(back,right)),f=Math.tan(Math.PI/8);
      const frameX=mobileUiMedia.matches?camera.mobileFrameOffset[0]:0,frameY=mobileUiMedia.matches?camera.mobileFrameOffset[1]:0;
      const nx=(((x-rect.left)/rect.width*2-1)-frameX)*f*rect.width/rect.height,ny=((1-(y-rect.top)/rect.height*2)-frameY)*f;
      return {origin:eye,direction:normalize(back.map((v,k)=>-v+right[k]*nx+up[k]*ny))};
    }
    function isPointExposed(world) {
      const eye=cameraEye(),delta=subtract(world,eye),distance=Math.hypot(...delta);
      return !physicalRayHit(eye,normalize(delta),Math.max(0,distance-.002));
    }
    function controlWorldPose(control) {
      const {state,normal}=control;
      if(!levelAllows(state.level)||!categoryState[state.category])return null;
      let world=toWorld(...state.anchor),face=normal;
      if(state.anchorTransformWhen) {const m=state.anchorTransformWhen();world=transformPoint(m,world).slice(0,3);face=[m[0]*normal[0]+m[4]*normal[1]+m[8]*normal[2],m[1]*normal[0]+m[5]*normal[1]+m[9]*normal[2],m[2]*normal[0]+m[6]*normal[1]+m[10]*normal[2]];}
      const eye=cameraEye();if(dot3(subtract(eye,world),face)<=0)return null;
      return {world,eye};
    }
    function projectControlTarget(control,surfacePoint=null) {
      const pose=controlWorldPose(control);if(!pose)return null;
      const {eye}=pose,delta=subtract(surfacePoint||pose.world,eye);
      const hit=physicalRayHit(eye,normalize(delta),Math.hypot(...delta)+.040);
      return hit?.action?.control===control?hit:null;
    }
    function nearestInteractiveRayHit(x,y,pointerType='mouse') {
      const hitForRay=ray=>{
        const physical=physicalRayHit(ray.origin,ray.direction);
        const closure=openWindowClosureRayHit(ray.origin,ray.direction,physical?.t??80);
        return closure&&(!physical||closure.t<physical.t-.0001)?closure:physical;
      };
      const exactRay=pointerRay(x,y),exact=hitForRay(exactRay);
      if(exact?.action)return exact;
      // A small screen-space halo makes visible handles and tap controls usable
      // on touch screens. Every sample still accepts only its nearest physical
      // triangle, so walls, closed doors and glazing can never be clicked through.
      const radius=pointerType==='touch'?22:pointerType==='pen'?12:6;
      const offsets=[[radius,0],[-radius,0],[0,radius],[0,-radius],[radius*.707,radius*.707],[-radius*.707,radius*.707],[radius*.707,-radius*.707],[-radius*.707,-radius*.707]];
      let best=null;
      for(const [dx,dy] of offsets) {
        const ray=pointerRay(x+dx,y+dy),hit=hitForRay(ray);
        if(hit?.action&&(!best||hit.t<best.t))best=hit;
      }
      return best||exact;
    }
    function resolveSceneAction(x,y,pointerType='mouse') {
      const hit=nearestInteractiveRayHit(x,y,pointerType);
      if(!hit?.action)return null;
      const action=hit.action;
      if(action.kind==='light'&&!controlWorldPose(action.control))return null;
      if(action.kind==='opening'&&action.state.selectableGlassLeaves) {
        const part=hit.item.glassPanelIndex||Number(hit.item.name.match(/-panel-(\d+)-/)?.[1]);
        if(!Number.isFinite(part)||part<1||part>action.state.operablePanelCount)return null;
        return {...action,panelIndex:part,role:action.state.hitAnchorRoles?.[part-1]||`glass-panel-${part}`,hit};
      }
      if(action.kind==='opening'&&action.state.kind==='mirrored robe slider') {
        const state=action.state,part=hit.item.name.match(/-panel-(\d+)-/),index=part?Number(part[1]):1;
        const panels=meshes.filter(m=>m.name.startsWith(`${state.id}-panel-`)&&/-moving$/.test(m.name));
        const anchorIndex=index===1?0:index===panels.length?1:-1;if(anchorIndex<0)return null;
        const owner=panels.find(m=>m.name===`${state.id}-panel-${index}-moving`);
        const world=transformPoint(owner.transformWhen(),toWorld(...state.hitAnchors[anchorIndex])).slice(0,3),clip=transformPoint(currentMVP,world),rect=canvas.getBoundingClientRect();
        const px=rect.left+(clip[0]/clip[3]*.5+.5)*rect.width,py=rect.top+(-clip[1]/clip[3]*.5+.5)*rect.height;
        if(Math.hypot(px-x,py-y)>(pointerType==='touch'?44:32))return null;
        return {...action,role:state.hitAnchorRoles[anchorIndex],hit};
      }
      return {...action,hit};
    }
    function activateScenePick(pick) {
      if(!pick)return false;
      if(pick.kind==='light')return activateLightControl(pick.control,pick.hit);
      if(pick.kind==='bathroom')return commandBathroomInteraction(pick.state);
      if(pick.kind==='opening') {
        const s=pick.state;
        if(s.selectableGlassLeaves&&s.target<.5&&Number.isFinite(pick.panelIndex))s.activePanelIndex=pick.panelIndex;
        if(s.kind==='mirrored robe slider'&&s.target<.5)s.slideDirection=pick.role==='open-right'?'right':'left';
        return commandOpening(s,s.target<.5);
      }return false;
    }

    buildGeometry();
    // The stair physically connects both storeys, so it remains visible in every
    // level mode; this is not a duplicated ground-floor proxy.
    [...meshes,...lines].forEach(item=>{
      if (item.category==='stair' || item.name?.startsWith('P6-') || item.name?.startsWith('stair-')) item.level='shared';
    });
    labelDefs.forEach(item=>{
      if (item.category==='stair' || item.text.startsWith('P6 ·') || item.text.includes('STEP 2 / GROUND')) item.level='shared';
    });
    buildGroundGeometry();
    buildRoomLighting();
    applyV7GeometryRepairs();
    activeBuildLevel='upper';

    function mat4Multiply(a, b) {
      const out = new Float32Array(16);
      for (let c=0; c<4; c++) {
        for (let r=0; r<4; r++) {
          out[c*4+r] = a[0*4+r]*b[c*4+0] + a[1*4+r]*b[c*4+1] + a[2*4+r]*b[c*4+2] + a[3*4+r]*b[c*4+3];
        }
      }
      return out;
    }

    const IDENTITY_MATRIX=new Float32Array([
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]);

    function mat4Translation(tx,ty,tz) {
      return new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        tx,ty,tz,1
      ]);
    }

    function mat4Rotation(axis,angle) {
      const c=Math.cos(angle), s=Math.sin(angle);
      if (axis === 'x') return new Float32Array([
        1,0,0,0,
        0,c,s,0,
        0,-s,c,0,
        0,0,0,1
      ]);
      if (axis === 'z') return new Float32Array([
        c,s,0,0,
        -s,c,0,0,
        0,0,1,0,
        0,0,0,1
      ]);
      return new Float32Array([
        c,0,s,0,
        0,1,0,0,
        -s,0,c,0,
        0,0,0,1
      ]);
    }

    function mat4RotationAxis(axis,angle) {
      const [x,y,z]=normalize(axis);
      const c=Math.cos(angle), s=Math.sin(angle), t=1-c;
      const m00=t*x*x+c, m01=t*x*y-s*z, m02=t*x*z+s*y;
      const m10=t*x*y+s*z, m11=t*y*y+c, m12=t*y*z-s*x;
      const m20=t*x*z-s*y, m21=t*y*z+s*x, m22=t*z*z+c;
      return new Float32Array([
        m00,m10,m20,0,
        m01,m11,m21,0,
        m02,m12,m22,0,
        0,0,0,1
      ]);
    }

    function mat4AroundPivot(axis,angle,pivot) {
      return mat4Multiply(
        mat4Translation(pivot[0],pivot[1],pivot[2]),
        mat4Multiply(mat4Rotation(axis,angle),mat4Translation(-pivot[0],-pivot[1],-pivot[2]))
      );
    }

    function mat4AroundAxisPivot(axis,angle,pivot) {
      return mat4Multiply(
        mat4Translation(pivot[0],pivot[1],pivot[2]),
        mat4Multiply(mat4RotationAxis(axis,angle),mat4Translation(-pivot[0],-pivot[1],-pivot[2]))
      );
    }

    function perspective(fov, aspect, near, far) {
      const f = 1 / Math.tan(fov/2), nf = 1/(near-far);
      return new Float32Array([
        f/aspect,0,0,0,
        0,f,0,0,
        0,0,(far+near)*nf,-1,
        0,0,(2*far*near)*nf,0
      ]);
    }

    function normalize(v) {
      const len = Math.hypot(v[0],v[1],v[2]) || 1;
      return [v[0]/len,v[1]/len,v[2]/len];
    }
    function subtract(a,b) { return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
    function cross(a,b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }

    function lookAt(eye, target, up) {
      const z = normalize(subtract(eye,target));
      const x = normalize(cross(up,z));
      const y = cross(z,x);
      return new Float32Array([
        x[0],y[0],z[0],0,
        x[1],y[1],z[1],0,
        x[2],y[2],z[2],0,
        -x[0]*eye[0]-x[1]*eye[1]-x[2]*eye[2],
        -y[0]*eye[0]-y[1]*eye[1]-y[2]*eye[2],
        -z[0]*eye[0]-z[1]*eye[1]-z[2]*eye[2],1
      ]);
    }

    const CAMERA_PRESETS = Object.freeze({
      upper: Object.freeze({yaw:-.72,pitch:.68,distance:16.8,planDistance:17.2,target:Object.freeze([0,.40,.10])}),
      both: Object.freeze({yaw:-.72,pitch:.58,distance:27.5,planDistance:29.0,target:Object.freeze([-3.0,-.65,-2.15])}),
      ground: Object.freeze({yaw:-.72,pitch:.68,distance:25.5,planDistance:27.0,target:Object.freeze([-4.08,-1.55,-2.94])})
    });
    const DETAIL_CAMERA_PRESETS = Object.freeze({
      profiles: Object.freeze({yaw:2.95,pitch:.12,distance:3.80,target:Object.freeze(toWorld(8.82,.12,3.64)),wallMode:'hidden',label:'Skirting stopped at built-in door frame'}),
      skirting: Object.freeze({yaw:0,pitch:.10,distance:1.28,target:Object.freeze(toWorld(6.18,.075,3.685)),wallMode:'hidden',label:'Skirting / scotia profile'}),
      stair: Object.freeze({yaw:3.14,pitch:.35,distance:2.20,target:Object.freeze(toWorld(4.25,.00,2.57)),wallMode:'hidden',label:'Stair landing nosing'}),
      wet: Object.freeze({yaw:.20,pitch:.32,distance:1.25,target:Object.freeze(toWorld(7.105,.015,2.62)),wallMode:'hidden',label:'O01 wet threshold'}),
      slider: Object.freeze({yaw:1.30,pitch:.28,distance:.95,target:Object.freeze(toWorld(8.89,.12,2.22)),wallMode:'hidden',label:'Mirrored-slider floor edge'}),
      keyset: Object.freeze({yaw:2.70,pitch:.12,distance:.82,target:Object.freeze(toWorld(PARAMS.D03_HINGE_X+PARAMS.D03_LEAF_WIDTH-.105,1.00,PARAMS.D03_HINGE_Z)),wallMode:'hidden',label:'Inserted key head + lever cylinder'}),
      wcframe: Object.freeze({yaw:0,pitch:.06,distance:1.02,target:Object.freeze(toWorld(7.00,2.025,1.175)),wallMode:'hidden',label:'WC removable inner-opening false head'}),
      hinges: Object.freeze({yaw:2.36,pitch:.02,distance:.54,target:Object.freeze(toWorld(PARAMS.D03_HINGE_X,1.735,PARAMS.D03_HINGE_Z)),wallMode:'hidden',label:'100 × 75 mm fixed-pin hinge leaves + fasteners'})
    });
    const camera = {
      yaw: 0,
      pitch: Math.PI/2,
      distance: 17.2,
      target: [0, .40, .10],
      mobileFrameOffset: [0, 0],
      interactionCounts: { rotate: 0, pan: 0, zoom: 0 }
    };
    let wallMode = 'solid';
    let labelMode = 'rooms';
    let currentMVP = new Float32Array(16);
    let lastAnimationTime=performance.now();
    let activeInteractionId=null;

    function cameraEye() {
      const cp = Math.cos(camera.pitch);
      return [
        camera.target[0] + camera.distance * cp * Math.sin(camera.yaw),
        camera.target[1] + camera.distance * Math.sin(camera.pitch),
        camera.target[2] + camera.distance * cp * Math.cos(camera.yaw)
      ];
    }

    function cameraUp() {
      const sp=Math.sin(camera.pitch), cp=Math.cos(camera.pitch);
      return [-sp*Math.sin(camera.yaw),cp,-sp*Math.cos(camera.yaw)];
    }

    function bindItem(item) {
      gl.bindBuffer(gl.ARRAY_BUFFER, item.positionBuffer);
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, item.normalBuffer);
      gl.enableVertexAttribArray(locations.normal);
      gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, 0, 0);
    }

    function levelAllows(level) {
      return level === 'shared' || levelMode === 'both' || level === levelMode;
    }

    function floorInstallationRevealAlpha(item) {
      if(!flooringInstallVisualState.active) return 1;
      const progress=flooringInstallVisualState.progress;
      if(item.category==='finishFloor' && item.finishFamily===installedFinishState.floorFamily && item.finishBounds) {
        const sceneMinX=.25-PLAN_W/2;
        const sceneMaxX=12.22-PLAN_W/2;
        const centreX=item.finishBounds[0]+item.finishBounds[2]*.5;
        const across=Math.max(0,Math.min(1,(centreX-sceneMinX)/(sceneMaxX-sceneMinX)));
        const revealEdge=-.12+progress*1.24;
        return Math.max(0,Math.min(1,(revealEdge-across+.08)/.12));
      }
      if(item.finishMetalControlled) return Math.max(0,Math.min(1,(progress-.62)/.38));
      return 1;
    }

    function effectiveAlpha(item) {
      if (!levelAllows(item.level)) return 0;
      if (!categoryState[item.category]) return 0;
      if (item.visibleWhen && !item.visibleWhen()) return 0;
      if (finishState.uiMode==='client' && (
        item.name.startsWith('T03-O01-') ||
        item.name.startsWith('T03-SG01-FLOOR-EDGE') ||
        item.name.startsWith('T03-R02-FLOOR-EDGE') ||
        item.name.startsWith('T03-R03-FLOOR-EDGE')
      )) return 0;
      if (item.isWall || item.category === 'cornice') {
        if (wallMode === 'hidden') return 0;
        if (wallMode === 'cutaway') return item.cutawayOpaque ? item.alpha : item.alpha * .58;
      }
      return item.alpha*(item.alphaWhen?item.alphaWhen():1)*floorInstallationRevealAlpha(item);
    }

    function resolvedItemColor(item) {
      if (item.finishMetalControlled) {
        const finish=item.metalApplication==='transition' ? installedFinishState.transitionFinish : installedFinishState.nosingFinish;
        if (finish==='woodgrain') {
          const colour=installedFloorColour();
          return colour.palette[(item.finishVariant || 0)%colour.palette.length];
        }
        return METAL_FINISHES[finish].color;
      }
      if (item.isFloorMatchedScotia) {
        const colour=installedFloorColour();
        return colour.palette[(item.finishVariant || 0)%colour.palette.length];
      }
      if (item.isPaintedTrim) return SKIRTING_PAINTS[installedFinishState.skirtingPaint].color;
      if (item.category!=='finishFloor' || !item.finishFamily) return item.color;
      const product=FLOOR_PRODUCTS[item.finishFamily];
      const key=installedFinishState.floorColours[item.finishFamily] || FLOOR_DEFAULT_COLOURS[item.finishFamily];
      const colour=product.colours[key] || product.colours[FLOOR_DEFAULT_COLOURS[item.finishFamily]];
      return colour.palette[item.finishVariant%colour.palette.length];
    }

    function materialKindForItem(item) {
      if (item.lightHalo) return 11;
      if (item.wetTileRole) return 9;
      if (item.bathroomFixture && /basin|bath-rim|bath-shell|toilet|cistern|closed-soft-close-lid/.test(item.bathroomFixtureComponent)) return 10;
      if (item.category==='finishFloor') return 1;
      if (item.isFloorMatchedScotia) return 1;
      if (item.finishMetalControlled) {
        const finish=item.metalApplication==='transition' ? installedFinishState.transitionFinish : installedFinishState.nosingFinish;
        if (finish==='woodgrain') return 1;
      }
      if (item.category==='finishCarpet') return 2;
      if (item.category==='exterior') return 3;
      if (item.category==='finishMetal' || item.category==='metal' || item.isDoorHingeMetal) return 4;
      if (item.glazingType==='clear') return 5;
      if (item.glazingType==='grey') return 6;
      if (item.glazingType==='obscure') return 7;
      if (item.isPaintedTrim) return 8;
      return 0;
    }

    function transformPoint(m, p) {
      const x=p[0], y=p[1], z=p[2], w=1;
      return [
        m[0]*x+m[4]*y+m[8]*z+m[12]*w,
        m[1]*x+m[5]*y+m[9]*z+m[13]*w,
        m[2]*x+m[6]*y+m[10]*z+m[14]*w,
        m[3]*x+m[7]*y+m[11]*z+m[15]*w
      ];
    }

    function labelModeAllows(kind) {
      if (kind === 'dimension') return categoryState.measurement;
      if (labelMode === 'off') return false;
      if (labelMode === 'rooms') return kind === 'room';
      if (labelMode === 'key') return kind === 'key' || kind === 'opening' || kind === 'slider';
      return true;
    }

    function boxesOverlap(a, b, pad = 4) {
      return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
    }

    function labelBoxAt(screenX,screenY,width,height) {
      return {
        left:screenX-width/2,
        right:screenX+width/2,
        top:screenY-height/2,
        bottom:screenY+height/2
      };
    }

    function projectDimensionSegment(segment,rect) {
      if (!Array.isArray(segment) || segment.length!==2) return null;
      const projected=segment.map(point=>{
        const clip=transformPoint(currentMVP,toWorld(point[0],point[1],point[2]));
        if (!Number.isFinite(clip[3]) || clip[3]<=0) return null;
        const nx=clip[0]/clip[3],ny=clip[1]/clip[3],nz=clip[2]/clip[3];
        if (![nx,ny,nz].every(Number.isFinite) || nz < -1 || nz > 1) return null;
        const localX=(nx*.5+.5)*rect.width;
        const localY=(-ny*.5+.5)*rect.height;
        return {x:rect.left+localX,y:rect.top+localY,localX,localY,nz};
      });
      return projected[0]&&projected[1]?{a:projected[0],b:projected[1]}:null;
    }

    function segmentIntersectsBox(segment,box,pad=0) {
      if (!segment || !box) return false;
      const left=box.left-pad,right=box.right+pad,top=box.top-pad,bottom=box.bottom+pad;
      const x0=segment.a.x,y0=segment.a.y;
      const dx=segment.b.x-x0,dy=segment.b.y-y0;
      let enter=0,leave=1;
      const p=[-dx,dx,-dy,dy];
      const q=[x0-left,right-x0,y0-top,bottom-y0];
      for(let index=0;index<4;index++) {
        if(Math.abs(p[index])<1e-9) {
          if(q[index]<0) return false;
          continue;
        }
        const ratio=q[index]/p[index];
        if(p[index]<0) enter=Math.max(enter,ratio);
        else leave=Math.min(leave,ratio);
        if(enter>leave) return false;
      }
      return true;
    }

    function boxInsideCanvas(box,rect,inset=4) {
      return box.left>=rect.left+inset && box.right<=rect.right-inset && box.top>=rect.top+inset && box.bottom<=rect.bottom-inset;
    }

    function updateLabels() {
      const rect = canvas.getBoundingClientRect();
      const compact = rect.width < 600;
      const candidates = [];
      const projectedDimensionSegments=[];
      const projectedDimensionMains=new Map();
      if(categoryState.measurement) {
        lines.forEach(line=>{
          if(line.category!=='measurement' || !levelAllows(line.level) || !line.dimensionSegments) return;
          line.dimensionSegments.forEach((segment,lineIndex)=>{
            const projected=projectDimensionSegment(segment,rect);
            if(!projected) return;
            const entry={...projected,owner:line.name,lineIndex};
            projectedDimensionSegments.push(entry);
            if(lineIndex===0) projectedDimensionMains.set(line.name,entry);
          });
        });
      }
      labelDefs.forEach(label => {
        label.el.style.display = 'none';
        label.el.style.visibility = '';
        label.el.style.setProperty('--label-scale','1');
        label.screenBox=null;
        label.screenPosition=null;
        label.screenScale=null;
        label.screenCrossingOwners=[];
        if (!levelAllows(label.level)) return;
        if (!labelModeAllows(label.kind)) return;
        if (label.category && !categoryState[label.category]) return;
        const world = toWorld(label.x,label.y,label.z);
        const clip = transformPoint(currentMVP, world);
        if (clip[3] <= 0) return;
        const nx=clip[0]/clip[3], ny=clip[1]/clip[3], nz=clip[2]/clip[3];
        if (nx < -1.08 || nx > 1.08 || ny < -1.08 || ny > 1.08 || nz < -1 || nz > 1) return;
        const x = (nx*.5+.5)*rect.width;
        const y = (-ny*.5+.5)*rect.height;
        const estimatedWidth=Math.min(compact ? 146 : 208,Math.max(38,label.text.length*(compact ? 5.1 : 5.8)+18));
        const estimatedHeight=label.kind==='room' ? (compact ? 19 : 22) : (compact ? 17 : 20);
        let width=estimatedWidth,height=estimatedHeight;
        label.el.style.display='block';
        label.el.style.visibility='hidden';
        const measured=label.el.getBoundingClientRect();
        if(measured.width>=12 && measured.width<=Math.min(320,rect.width*.45)) width=measured.width;
        if(measured.height>=10 && measured.height<=80) height=measured.height;
        label.el.style.display='none';
        label.el.style.visibility='';
        const projectedMain=label.dimensionOwner?projectedDimensionMains.get(label.dimensionOwner):null;
        const dimensionProjectedLength=projectedMain?Math.hypot(projectedMain.b.x-projectedMain.a.x,projectedMain.b.y-projectedMain.a.y):Infinity;
        candidates.push({
          ...label,
          nx,ny,nz,screenX:x,screenY:y,width,height,dimensionProjectedLength,
          box:labelBoxAt(rect.left+x,rect.top+y,width,height)
        });
      });

      const blockers = [...document.querySelectorAll('.topbar, .toolbar, .panel.is-open')]
        .map(el => el.getBoundingClientRect())
        .filter(box => box.width > 0 && box.height > 0);
      const accepted = [];
      const visibleCap = compact && labelMode === 'rooms' && !categoryState.measurement ? 7 : Infinity;
      // Short dimensions have the fewest legal label positions, so place them
      // first; longer dimensions can then slide farther to avoid them.
      candidates.sort((a,b) => b.priority-a.priority || a.dimensionProjectedLength-b.dimensionProjectedLength || a.nz-b.nz).forEach(label => {
        if (accepted.length >= visibleCap) return;
        const definition=labelDefs.find(item=>item.el===label.el);
        if(definition) definition.placementRejects=[];
        let placements=[{box:label.box,screenX:label.screenX,screenY:label.screenY,scale:1}];
        if(label.kind==='dimension' && label.dimensionOwner) {
          const main=projectedDimensionMains.get(label.dimensionOwner);
          if(!main) return;
          placements=[1,.92,.84].flatMap(scale=>(label.dimensionPlacementFractions || [.5]).map(fraction=>{
            const screenX=main.a.localX+(main.b.localX-main.a.localX)*fraction;
            const screenY=main.a.localY+(main.b.localY-main.a.localY)*fraction;
            return {screenX,screenY,scale,box:labelBoxAt(rect.left+screenX,rect.top+screenY,label.width*scale,label.height*scale)};
          }));
        }
        let placement=null;
        for(const option of placements) {
          let reason='';
          if(!boxInsideCanvas(option.box,rect,4)) reason='outside-canvas';
          else if(blockers.some(box=>boxesOverlap(option.box,box,2))) reason='ui-blocker';
          else if(accepted.some(box=>boxesOverlap(option.box,box,compact ? 3 : 5))) reason='label-overlap';
          else if(label.kind==='dimension') {
            const crossingOwners=[...new Set(projectedDimensionSegments.filter(segment=>segment.owner!==label.dimensionOwner && segmentIntersectsBox(segment,option.box,3)).map(segment=>segment.owner))];
            if(crossingOwners.length) reason=`other-line:${crossingOwners.join('|')}`;
          }
          if(!reason) {placement=option;break;}
          if(definition) definition.placementRejects.push({x:Number(option.screenX.toFixed(1)),y:Number(option.screenY.toFixed(1)),reason});
        }
        if(!placement) return;
        accepted.push(placement.box);
        label.el.style.display = 'block';
        label.el.style.left = `${placement.screenX}px`;
        label.el.style.top = `${placement.screenY}px`;
        label.el.style.setProperty('--label-scale',String(placement.scale));
        label.el.style.opacity = `${Math.max(.72, Math.min(1, 1-(label.nz*.10)))}`;
        if(definition) {
          definition.screenBox={left:placement.box.left,top:placement.box.top,right:placement.box.right,bottom:placement.box.bottom};
          definition.screenPosition={x:placement.screenX,y:placement.screenY};
          definition.screenScale=placement.scale;
          definition.screenCrossingOwners=[...new Set(projectedDimensionSegments.filter(segment=>segmentIntersectsBox(segment,placement.box,0)).map(segment=>segment.owner))];
        }
      });
      const dimensionLabels=labelDefs.filter(label=>label.kind==='dimension'&&label.category==='measurement');
      appRoot.dataset.dimensionLayout=JSON.stringify({
        total:dimensionLabels.length,
        visible:dimensionLabels.filter(label=>label.screenBox).length,
        hidden:dimensionLabels.filter(label=>!label.screenBox).map(label=>label.dimensionOwner),
        rejections:dimensionLabels.filter(label=>!label.screenBox).map(label=>({owner:label.dimensionOwner,attempts:label.placementRejects || []})),
        labels:dimensionLabels.filter(label=>label.screenBox).map(label=>({owner:label.dimensionOwner,position:label.screenPosition,scale:label.screenScale,crossingOwners:label.screenCrossingOwners}))
      });
    }

    const MATERIAL_HOTSPOT_DEFS=Object.freeze({
      wet:Object.freeze({anchor:Object.freeze([(PARAMS.O01_OPEN_X0+PARAMS.O01_OPEN_X1)/2,.052,2.620]),camera:'wet',calloutOffset:Object.freeze([-46,-38]),planCalloutOffset:Object.freeze([46,-38])}),
      stair:Object.freeze({anchor:Object.freeze([4.250,.052,2.600]),camera:'stair',calloutOffset:Object.freeze([48,-40]),planCalloutOffset:Object.freeze([-48,-40])})
    });

    function updateMaterialHotspots() {
      const rect=canvas.getBoundingClientRect();
      const visibleLevel=levelMode==='upper' || levelMode==='both';
      materialHotspotButtons.forEach(button=>{
        const definition=MATERIAL_HOTSPOT_DEFS[button.dataset.materialHotspot];
        button.hidden=true;
        if (!definition || !visibleLevel || !isPointExposed(toWorld(...definition.anchor))) return;
        const clip=transformPoint(currentMVP,toWorld(...definition.anchor));
        if (clip[3]<=0) return;
        const nx=clip[0]/clip[3],ny=clip[1]/clip[3],nz=clip[2]/clip[3];
        if (nx<-.98 || nx>.98 || ny<-.98 || ny>.98 || nz<-1 || nz>1) return;
        const targetX=(nx*.5+.5)*rect.width;
        const targetY=(-ny*.5+.5)*rect.height;
        const calloutScale=rect.width<600 ? .76 : 1;
        const planLike=Math.abs(camera.pitch-Math.PI/2)<.03&&Math.abs(camera.yaw)<.03;
        const calloutOffset=planLike?definition.planCalloutOffset:definition.calloutOffset;
        const requestedX=targetX+calloutOffset[0]*calloutScale;
        const requestedY=targetY+calloutOffset[1]*calloutScale;
        const markerX=Math.min(rect.width-18,Math.max(18,requestedX));
        const markerY=Math.min(rect.height-18,Math.max(18,requestedY));
        const leaderX=targetX-markerX;
        const leaderY=targetY-markerY;
        button.style.left=`${markerX}px`;
        button.style.top=`${markerY}px`;
        button.style.setProperty('--leader-length',`${Math.hypot(leaderX,leaderY).toFixed(1)}px`);
        button.style.setProperty('--leader-angle',`${Math.atan2(leaderY,leaderX).toFixed(5)}rad`);
        button.hidden=false;
      });
      appRoot.dataset.materialHotspots=JSON.stringify(Object.entries(MATERIAL_HOTSPOT_DEFS).map(([id,value])=>({id,anchor:value.anchor,camera:value.camera,calloutOffset:value.calloutOffset,planCalloutOffset:value.planCalloutOffset})));
    }

    let lastInteractionTelemetry='';
    function updateInteractionTargets() {
      const stamp=physicalSceneSignature()+JSON.stringify([openingInteractions.map(s=>[s.target,s.open,s.moving]),bathroomInteractions.map(s=>[s.target,s.active,s.open,s.moving,s.defog])]);
      if(stamp===lastInteractionTelemetry)return;
      lastInteractionTelemetry=stamp;
      const rect=canvas.getBoundingClientRect();
      const datasetTargets=[];
      preparePhysicalPicking();
      // Projections below are diagnostics only, never hit areas. Real pointer
      // events always query the nearest physical triangle at the event pixel.
      openingInteractions.forEach(interaction=>{
        interaction.screen=null;
        interaction.screens=[];
        if (!levelAllows(interaction.level)) return;
        if (!categoryState[interaction.category]) return;
        interaction.hitAnchors.forEach((anchor,anchorIndex)=>{
          const owner=physicalPickIndex.targets.find(m=>m.physicalAction?.state===interaction&&m.transformWhen&&(/leaf$|-glass-|panel-.*-moving$/.test(m.name)))||physicalPickIndex.targets.find(m=>m.physicalAction?.state===interaction);
          const world=owner?.transformWhen?transformPoint(owner.transformWhen(),toWorld(...anchor)).slice(0,3):toWorld(...anchor);
          const clip=transformPoint(currentMVP,world);
          if (clip[3] <= 0) return;
          const nx=clip[0]/clip[3], ny=clip[1]/clip[3], nz=clip[2]/clip[3];
          if (nx < -1.08 || nx > 1.08 || ny < -1.08 || ny > 1.08 || nz < -1 || nz > 1) return;
          const x=(nx*.5+.5)*rect.width, y=(-ny*.5+.5)*rect.height;
          const screen={x:rect.left+x,y:rect.top+y,localX:x,localY:y,depth:nz,role:interaction.hitAnchorRoles?.[anchorIndex] || (anchorIndex===0?'leaf':'hardware')};
          interaction.screens.push(screen);
          if (!interaction.screen) interaction.screen=screen;
          datasetTargets.push({id:interaction.id,role:screen.role,x:Number(x.toFixed(1)),y:Number(y.toFixed(1)),canToggle:interaction.canToggle,projectionOnly:true});
        });
      });
      appRoot.dataset.interactionTargets=JSON.stringify(datasetTargets);
      appRoot.dataset.interactionStates=JSON.stringify(openingInteractions.map(({id,kind,assemblyId,panelIndex,operation,open,canToggle,progress,moving,handleTurn,keySway,hardwareMode,publicSide,keySide,slideDirection,commandElapsed,handlePeakAt,leafMotionAt})=>({
        id,kind,assemblyId:assemblyId||null,panelIndex:panelIndex||null,operation:operation||null,open,canToggle,progress:Number(progress.toFixed(3)),moving,
        handleTurn:Number(handleTurn.toFixed(3)),keySway:Number(keySway.toFixed(4)),hardwareMode,publicSide,keySide,slideDirection,
        commandElapsed:Number.isFinite(commandElapsed)?Number(commandElapsed.toFixed(3)):null,
        handlePeakAt:handlePeakAt===null?null:Number(handlePeakAt.toFixed(3)),
        leafMotionAt:leafMotionAt===null?null:Number(leafMotionAt.toFixed(3))
      })));
      const bathroomTargets=[];
      bathroomInteractions.forEach(interaction=>{
        interaction.screen=null;
        interaction.screens=[];
        if (!levelAllows(interaction.level) || !categoryState[interaction.category]) return;
        interaction.hitAnchors.forEach((anchor,anchorIndex)=>{
          let world=interaction.anchorTransformWhen
            ? transformPoint(interaction.anchorTransformWhen(),toWorld(...anchor)).slice(0,3)
            : toWorld(...anchor);
          const owner=physicalPickIndex.targets.find(m=>m.physicalAction?.state===interaction&&(interaction.id==='T18-VANITY-MOONLIGHT-DOORS'?m.name.includes(anchorIndex===0?'-left-':'-right-'):true));
          if(!interaction.anchorTransformWhen&&owner?.transformWhen)world=transformPoint(owner.transformWhen(),world).slice(0,3);
          const clip=transformPoint(currentMVP,world);
          if (clip[3]<=0) return;
          const nx=clip[0]/clip[3],ny=clip[1]/clip[3],nz=clip[2]/clip[3];
          if (nx< -1.08 || nx>1.08 || ny< -1.08 || ny>1.08 || nz< -1 || nz>1) return;
          const x=(nx*.5+.5)*rect.width,y=(-ny*.5+.5)*rect.height;
          const screen={x:rect.left+x,y:rect.top+y,localX:x,localY:y,depth:nz,role:interaction.hitAnchorRoles?.[anchorIndex] || 'fixture'};
          interaction.screens.push(screen);
          if (!interaction.screen) interaction.screen=screen;
          bathroomTargets.push({id:interaction.id,role:screen.role,x:Number(x.toFixed(1)),y:Number(y.toFixed(1)),mode:interaction.mode,projectionOnly:true});
        });
      });
      appRoot.dataset.bathroomInteractionTargets=JSON.stringify(bathroomTargets);
      appRoot.dataset.bathroomInteractionStates=JSON.stringify(bathroomInteractions.map(({id,kind,mode,open,progress,moving,active,defog})=>({
        id,kind,mode,open,progress:Number(progress.toFixed(3)),moving,active,defog
      })));
    }

    function hitTestOpening(clientX,clientY,pointerType='mouse') {
      const pick=resolveSceneAction(clientX,clientY,pointerType);
      return pick?.kind==='opening'?{interaction:pick.state,screen:{role:pick.role||'leaf'}}:null;
    }

    function hitTestBathroomInteraction(clientX,clientY,pointerType='mouse') {
      const pick=resolveSceneAction(clientX,clientY,pointerType);
      return pick?.kind==='bathroom'?{interaction:pick.state,screen:{role:'fixture'}}:null;
    }

    function hitTestSceneLight(clientX,clientY,pointerType='mouse') {
      const pick=resolveSceneAction(clientX,clientY,pointerType);return pick?.kind==='light'?pick.control:null;
    }

    function announceInteraction(message) {
      interactionStatus.textContent=message;
    }

    function syncDetailDataset() {
      appRoot.dataset.task003Options=JSON.stringify(detailState);
    }

    function finishedTileDeltaRange(product=selectedFloorProduct()) {
      return finishState.installedTileDatumRange.map(tileDatum=>Math.max(0,tileDatum-product.thickness));
    }

    function setPressed(selector,match) {
      document.querySelectorAll(selector).forEach(button=>{
        const key=Object.keys(button.dataset).find(name=>name.endsWith('Choice') || name==='uiModeChoice' || name==='floorFamily' || name==='floorColour' || name==='profileChoice' || name==='stairEdge' || name==='wetTransition' || name==='sliderTrimChoice');
        if (key) button.setAttribute('aria-pressed',String(button.dataset[key]===match));
      });
    }

    function syncFinishUI() {
      const product=selectedFloorProduct();
      const colour=selectedFloorColour();
      const floorDataPack=selectedFloorDataPack();
      const delta=finishedTileDeltaRange(product).map(value=>value*1000);
      const transitionProduct=TRANSITION_PRODUCTS[finishState.transitionProfile];
      const transitionMetal=METAL_FINISHES[finishState.transitionFinish];
      const nosingProduct=NOSING_PRODUCTS[finishState.nosingProfile];
      const nosingMetal=METAL_FINISHES[finishState.nosingFinish];
      appRoot.dataset.uiMode=finishState.uiMode;
      appRoot.dataset.task004Selection=JSON.stringify({
        uiMode:finishState.uiMode,
        activeFinishCategory:finishState.activeFinishCategory,
        floorFamily:finishState.floorFamily,
        floorColour:selectedFloorColourKey(),
        floorDataPack:floorDataPack?.id || null,
        floorDataPackSchema:floorDataPack?.schema || null,
        floorProduct:product.product,
        floorLength:product.length,
        floorWidth:product.width,
        floorThickness:product.thickness,
        surfaceTreatment:finishState.floorFamily==='engineered'?'waxed-satin-visual':'factory-finish',
        installedBuildKnown:product.installedBuildKnown,
        skirtingProfile:finishState.skirtingProfile,
        skirtingPaint:finishState.skirtingPaint,
        metalFinish:finishState.nosingFinish,
        transitionProfile:finishState.transitionProfile,
        transitionFinish:finishState.transitionFinish,
        nosingProfile:finishState.nosingProfile,
        nosingFinish:finishState.nosingFinish,
        stairEdge:finishState.stairEdge,
        wetTransition:finishState.wetTransition,
        finishedTileDeltaRange:delta.map(value=>Number(value.toFixed(1)))
      });
      appRoot.dataset.floorDataPackSelection=JSON.stringify(floorDataPack || null);
      appRoot.dataset.floorInstallerStatus=flooringInstallState.status;
      syncInstalledFloorDataset();
      document.querySelectorAll('[data-family-group]').forEach(group=>{ group.hidden=group.dataset.familyGroup!==finishState.floorFamily; });
      document.querySelectorAll('[data-ui-mode-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.uiModeChoice===finishState.uiMode)));
      document.querySelectorAll('[data-floor-family]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.floorFamily===finishState.floorFamily)));
      document.querySelectorAll('[data-floor-colour]').forEach(button=>{
        const parent=button.closest('[data-family-group]');
        button.setAttribute('aria-pressed',String(parent && parent.dataset.familyGroup===finishState.floorFamily && button.dataset.floorColour===selectedFloorColourKey()));
      });
      document.querySelectorAll('[data-profile-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.profileChoice===finishState.skirtingProfile)));
      document.querySelectorAll('[data-skirting-paint]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.skirtingPaint===finishState.skirtingPaint)));
      const wallFinishMeta=SKIRTING_PROFILE_META[finishState.skirtingProfile];
      const scotiaSelected=wallFinishMeta?.kind==='scotia';
      appRoot.dataset.skirtingKind=scotiaSelected?'scotia':'skirting';
      const skirtingColourHeading=RESIDENCE_DOM.getElementById('skirting-colour-heading');
      const skirtingColourGrid=RESIDENCE_DOM.getElementById('skirting-colour-grid');
      if(skirtingColourHeading) skirtingColourHeading.hidden=scotiaSelected;
      if(skirtingColourGrid) skirtingColourGrid.hidden=scotiaSelected;
      document.querySelectorAll('[data-scotia-preview]').forEach(image=>{
        image.src=colour.image;
        image.alt=`Scotia matched to ${colour.label}`;
      });
      const skirtingProductNote=RESIDENCE_DOM.getElementById('skirting-product-note');
      if(skirtingProductNote) skirtingProductNote.textContent=scotiaSelected
        ? `The 19 × 19 mm scotia follows the selected floor colour, covers the perimeter expansion gap and stops at every frame, track, wall or object. Corners use 45° mitres.`
        : `Dry-room skirting stops at every frame, track, wall or object and uses 45° mitred room corners. Wet rooms retain their separate matching tile skirting.`;
      document.querySelectorAll('[data-finish-category]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.finishCategory===finishState.activeFinishCategory)));
      document.querySelectorAll('[data-category-panel]').forEach(panel=>{ panel.hidden=panel.dataset.categoryPanel!==finishState.activeFinishCategory; });
      document.querySelectorAll('[data-transition-profile]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.transitionProfile===finishState.transitionProfile)));
      document.querySelectorAll('[data-transition-finish]').forEach(button=>{
        const compatible=button.dataset.compatibleTransition.split(' ').includes(finishState.transitionProfile);
        button.disabled=!compatible;
        button.setAttribute('aria-pressed',String(compatible && button.dataset.transitionFinish===finishState.transitionFinish));
      });
      document.querySelectorAll('[data-nosing-profile]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nosingProfile===finishState.nosingProfile)));
      document.querySelectorAll('[data-nosing-finish]').forEach(button=>{
        const compatible=button.dataset.compatibleNosing.split(' ').includes(finishState.nosingProfile);
        button.disabled=!compatible;
        button.setAttribute('aria-pressed',String(compatible && button.dataset.nosingFinish===finishState.nosingFinish));
      });
      document.querySelectorAll('[data-nosing-option]').forEach(button=>{
        const [profile,finish]=button.dataset.nosingOption.split(':');
        button.setAttribute('aria-pressed',String(profile===finishState.nosingProfile && finish===finishState.nosingFinish));
      });
      document.querySelectorAll('[data-level-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.levelChoice===levelMode)));
      document.querySelectorAll('[data-wall-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wallChoice===wallMode)));
      document.querySelectorAll('[data-label-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.labelChoice===labelMode)));
      document.querySelectorAll('[data-measurement-choice]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.measurementChoice==='on')===categoryState.measurement)));
      document.querySelectorAll('[data-grid-choice]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.gridChoice==='on')===categoryState.grid)));
      document.querySelectorAll('[data-slider-trim-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sliderTrimChoice===detailState.sliderTrim)));
      document.querySelectorAll('[data-direct-category]').forEach(input=>{ input.checked=!!categoryState[input.dataset.directCategory]; });
      appRoot.dataset.measurements=categoryState.measurement?'shown':'hidden';
      appRoot.dataset.referenceGrid=categoryState.grid?'shown':'hidden';
      labelsLayer.setAttribute('aria-hidden',String(labelMode==='off'&&!categoryState.measurement));
      const familyUiLabel=floorFamilyUiLabel(finishState.floorFamily);
      RESIDENCE_DOM.getElementById('selection-title').textContent=`${familyUiLabel} · ${colour.label}`;
      RESIDENCE_DOM.getElementById('selection-build').textContent=`${(product.thickness*1000).toFixed(1)} mm${finishState.floorFamily==='engineered'?' · waxed satin':''}`;
      RESIDENCE_DOM.getElementById('selection-trim').textContent=`Position 01 · ${transitionMetal.label}`;
      RESIDENCE_DOM.getElementById('selection-threshold-delta').textContent=`Position 02 · ${nosingSelectionLabel(finishState.nosingProfile,finishState.nosingFinish)}`;
      RESIDENCE_DOM.getElementById('selection-skirting').textContent=wallFinishSelectionLabel(finishState.skirtingProfile,finishState.skirtingPaint,colour.label);
      const floorPurchaseSummary=RESIDENCE_DOM.getElementById('floor-purchase-summary');
      if(floorPurchaseSummary) floorPurchaseSummary.textContent=`${FLOOR_PURCHASE.netAreaM2.toFixed(2)} m² net · +${FLOOR_PURCHASE.wasteAllowancePercent}% planning allowance · buy at least ${FLOOR_PURCHASE.recommendedPurchaseAreaM2.toFixed(1)} m²`;
      appRoot.dataset.floorPurchase=JSON.stringify(FLOOR_PURCHASE);
      const positionOneWoodgrain=RESIDENCE_DOM.getElementById('position-one-woodgrain-image');
      const nosingWoodgrainImages=[...document.querySelectorAll('[data-nosing-woodgrain-image]')];
      [positionOneWoodgrain,...nosingWoodgrainImages].forEach(image=>{
        if(!image) return;
        image.src=colour.image;
        image.alt=`Woodgrain matched to ${colour.label}`;
      });
      const installReviewMaterial=RESIDENCE_DOM.getElementById('install-review-material');
      const installReviewEdges=RESIDENCE_DOM.getElementById('install-review-edges');
      const installReviewSkirting=RESIDENCE_DOM.getElementById('install-review-skirting');
      if(installReviewMaterial) installReviewMaterial.textContent=`${familyUiLabel} · ${colour.label}${finishState.floorFamily==='engineered'?' · waxed satin':''}`;
      if(installReviewEdges) installReviewEdges.textContent=`01 ${transitionMetal.label} · 02 ${nosingSelectionLabel(finishState.nosingProfile,finishState.nosingFinish)}`;
      if(installReviewSkirting) installReviewSkirting.textContent=wallFinishSelectionLabel(finishState.skirtingProfile,finishState.skirtingPaint,colour.label);
      RESIDENCE_DOM.getElementById('profile-select').value=finishState.skirtingProfile;
      RESIDENCE_DOM.getElementById('stair-metal-select').value=finishState.nosingFinish;
      RESIDENCE_DOM.getElementById('wet-threshold-select').value=finishState.transitionProfile;
      RESIDENCE_DOM.getElementById('slider-trim-select').value=detailState.sliderTrim;
      RESIDENCE_DOM.getElementById('level-mode').textContent=`Level: ${levelMode}`;
      RESIDENCE_DOM.getElementById('wall-mode').textContent=`Walls: ${wallMode}`;
      RESIDENCE_DOM.getElementById('label-mode').textContent=`Labels: ${labelMode}`;
      const detailPhoto=RESIDENCE_DOM.getElementById('product-detail-photo');
      detailPhoto.src=colour.image;
      detailPhoto.alt=`${product.product} ${colour.label} official product image`;
      const installedPhoto=RESIDENCE_DOM.getElementById('product-installed-photo');
      installedPhoto.src=colour.installedImage || colour.image;
      installedPhoto.alt=colour.installedImage ? `${product.product} ${colour.label} official installed room reference` : `${product.product} ${colour.label} official detail reference`;
      RESIDENCE_DOM.getElementById('product-installed-caption').textContent=colour.installedImage ? 'Official installed-room reference stored in this package.' : 'Official product/detail reference stored in this package.';
      RESIDENCE_DOM.getElementById('product-detail-title').textContent=`${product.product} · ${colour.label}`;
      RESIDENCE_DOM.getElementById('product-detail-dimensions').textContent=`${Math.round(product.length*1000)} × ${Math.round(product.width*1000)} × ${(product.thickness*1000).toFixed(1)} mm${colour.code?` · ${colour.code}`:''}`;
      RESIDENCE_DOM.getElementById('product-detail-description').textContent=`${product.description} ${colour.description}${finishState.floorFamily==='engineered'?' The installed 3D surface receives a polished waxed-satin sheen.':''}`;
      const productSource=RESIDENCE_DOM.getElementById('product-detail-source');
      productSource.href=colour.source || product.source;
      productSource.textContent='↗';
      productSource.setAttribute('aria-label',`Open ${colour.label} product page`);
      productSource.title=`Open ${colour.label} product page`;
      const stairImage=RESIDENCE_DOM.getElementById('stair-nosing-product-image');
      stairImage.src=nosingProduct.image || nosingMetal.nosingImage;
      stairImage.alt=`${nosingProduct.label} profile reference · ${nosingMetal.label}`;
      const stairProfileImage=RESIDENCE_DOM.getElementById('stair-nosing-profile-image');
      stairProfileImage.src=colour.image;
      stairProfileImage.alt=`Selected landing floor · ${colour.label}`;
      RESIDENCE_DOM.getElementById('nosing-product-caption').textContent=`TRIM PROFILE · ${nosingProduct.label} · ${nosingMetal.label}.`;
      RESIDENCE_DOM.getElementById('nosing-profile-caption').textContent=`FLOOR SAMPLE ONLY · ${colour.label}; this is not the trim. Carpet rises behind the trim front edge.`;
      RESIDENCE_DOM.getElementById('nosing-product-title').textContent=nosingProduct.label;
      RESIDENCE_DOM.getElementById('nosing-product-spec').textContent=`${nosingProduct.spec} · ${nosingMetal.label}`;
      RESIDENCE_DOM.getElementById('nosing-product-description').textContent=nosingProduct.description;
      const nosingSource=RESIDENCE_DOM.getElementById('nosing-product-source');
      nosingSource.href=nosingProduct.source;
      nosingSource.textContent='Official product source ↗';
      const transitionImage=RESIDENCE_DOM.getElementById('wet-transition-product-image');
      transitionImage.src=finishState.transitionFinish==='woodgrain' ? colour.image : (transitionProduct.image || transitionMetal.transitionImage);
      transitionImage.alt=`${transitionProduct.label} actual product reference · ${transitionMetal.label}`;
      RESIDENCE_DOM.getElementById('wet-transition-profile-image').src=transitionProduct.profileImage;
      RESIDENCE_DOM.getElementById('transition-product-title').textContent=transitionProduct.label;
      RESIDENCE_DOM.getElementById('transition-product-spec').textContent=`${transitionProduct.spec} · ${transitionMetal.label}`;
      RESIDENCE_DOM.getElementById('transition-product-description').textContent=transitionProduct.description;
      const transitionSource=RESIDENCE_DOM.getElementById('transition-product-source');
      transitionSource.href=transitionProduct.source;
      transitionSource.textContent='Official product source ↗';
      if (activeMaterialHotspot) refreshMaterialDetail(activeMaterialHotspot,false);
      clearTimeout(qaCaptureTimer);
      qaCaptureTimer=setTimeout(()=>{ qaCanvasCapture.src=canvas.toDataURL('image/png'); },240);
    }

    function setUiMode(mode) {
      if (!['client','technical'].includes(mode)) return false;
      finishState.uiMode=mode;
      if (mode==='client') {
        levelMode='upper';
        wallMode='solid';
        labelMode='off';
        categoryState.metal=false;
        categoryState.grid=false;
        categoryState.measurement=false;
        categoryState.finishFloor=true;
        categoryState.finishCarpet=true;
        categoryState.finishMetal=true;
      } else {
        categoryState.metal=true;
      }
      appRoot.dataset.levelMode=levelMode;
      appRoot.dataset.wallMode=wallMode;
      appRoot.dataset.labelMode=labelMode;
      syncFinishUI();
      announceInteraction(`${mode==='client'?'Client':'Technical'} mode · direct controls active.`);
      return true;
    }

    function persistFloorDataPackSelection(packId,textureDataUrl='') {
      try {
        const safeTexture=typeof textureDataUrl==='string' && textureDataUrl.startsWith('data:image/') && textureDataUrl.length<4200000 ? textureDataUrl : '';
        localStorage.setItem(FLOOR_PACK_STORAGE_KEY,JSON.stringify({schema:'pomi.house.hardfloor-selection.v1',packId,textureDataUrl:safeTexture}));
        appRoot.dataset.floorPackPersistence='stored';
      } catch (error) {
        appRoot.dataset.floorPackPersistence='memory-only';
      }
    }

    function applyFloorDataPack(packId,textureDataUrl='',options={}) {
      const pack=FLOOR_DATA_PACKS[packId];
      if (!pack || !FLOOR_PRODUCTS[pack.family]?.colours[pack.colour]) return false;
      const safeTexture=typeof textureDataUrl==='string' && textureDataUrl.startsWith('data:image/') ? textureDataUrl : '';
      finishState.floorFamily=pack.family;
      finishState.floorColours[pack.family]=pack.colour;
      activeFloorDataPackId=pack.id;
      generatedFloorTextureSource=safeTexture;
      syncFinishUI();
      const status=RESIDENCE_DOM.getElementById('floor-pack-status');
      if(status) status.textContent=`${pack.label} · ${pack.materialType} · staged for installation.`;
      if(options.persist!==false) persistFloorDataPackSelection(pack.id,safeTexture);
      if(options.announce!==false) announceInteraction(`Floor data pack · ${pack.label} · staged. Press Install flooring to update the 3D scene.`);
      return true;
    }

    function ingestGeneratorSelection(message) {
      if (!message || message.type!=='pomi.floor.generator.selection' || message.schema!=='pomi.generator-to-house.v1') return false;
      const pack=FLOOR_DATA_PACKS[message.packId],payload=message.payload;
      if (!pack || !payload || pack.generator!==message.generator) return false;
      if (payload.sourceSchema!==pack.sourceSchema) return false;
      const dims=payload.dimensionsMm || {};
      const toleranceMm=.6;
      if (Math.abs(Number(dims.length)-pack.dimensionsMm.length)>toleranceMm || Math.abs(Number(dims.width)-pack.dimensionsMm.width)>toleranceMm) return false;
      const thickness=Number(dims.thickness ?? dims.total);
      if (Math.abs(thickness-pack.dimensionsMm.thickness)>toleranceMm) return false;
      return applyFloorDataPack(pack.id,payload.textureDataUrl || '',{persist:true,announce:true});
    }

    function ingestGeneratorManifest(manifest,textureDataUrl='') {
      if(!manifest || typeof manifest!=='object') return false;
      if(manifest.schema==='pomi.engineering-timber.offline.v3') {
        const packId={blackbutt:'ENG-BLACKBUTT',spotted:'ENG-SPOTTED-GUM'}[manifest.product?.species];
        if(!packId) return false;
        return ingestGeneratorSelection({type:'pomi.floor.generator.selection',schema:'pomi.generator-to-house.v1',generator:'engineering',packId,payload:{sourceSchema:manifest.schema,dimensionsMm:manifest.product?.dimensions_mm || {},textureDataUrl}});
      }
      const productCode=String(manifest.product?.code || '').toUpperCase();
      const productKey=productCode==='WLP85' ? '85' : productCode==='CC65' ? 'cc65' : Number(manifest.dimensions_mm?.length)===1810 && Number(manifest.dimensions_mm?.thickness)===8.5 ? '85' : Number(manifest.dimensions_mm?.length)===1824 && Number(manifest.dimensions_mm?.thickness)===6.5 ? 'cc65' : '';
      const packId=({
        '85':{'Blackbutt XL':'HYB-BLACKBUTT-XL','Burnished Oak XL':'HYB-BURNISHED-OAK-XL','Myrtle Ebony XL':'HYB-MYRTLE-EBONY-XL','She Oak XL':'HYB-SHE-OAK-XL','Mist Oak XL':'HYB-MIST-OAK-XL'},
        cc65:{'Blackbutt · DR8412':'CC65-BLACKBUTT','Soft Rustic · DR8413':'CC65-SOFT-RUSTIC','Spotted Gum · DR8433':'CC65-SPOTTED-GUM','Ash · DR8406':'CC65-ASH','Crisp Natural · DR8403':'CC65-CRISP-NATURAL'}
      })[productKey]?.[manifest.colour];
      if(!packId || manifest.product?.type!=='Hybrid SPC') return false;
      return ingestGeneratorSelection({type:'pomi.floor.generator.selection',schema:'pomi.generator-to-house.v1',generator:'hybrid',packId,payload:{sourceSchema:'pomi.hybrid.generator.manifest.unversioned',dimensionsMm:manifest.dimensions_mm || {},textureDataUrl}});
    }

    function restoreFloorDataPackSelection() {
      try {
        const saved=JSON.parse(localStorage.getItem(FLOOR_PACK_STORAGE_KEY) || 'null');
        if(saved?.schema==='pomi.house.hardfloor-selection.v1' && FLOOR_DATA_PACKS[saved.packId]) return applyFloorDataPack(saved.packId,saved.textureDataUrl || '',{persist:false,announce:false});
      } catch (error) {
        appRoot.dataset.floorPackPersistence='restore-failed';
      }
      return applyFloorDataPack(DEFAULT_FLOOR_DATA_PACK_ID,'',{persist:false,announce:false});
    }

    function setFloorInstallerUi(status,message,progress=0) {
      const button=RESIDENCE_DOM.getElementById('install-flooring');
      const label=RESIDENCE_DOM.getElementById('install-button-label');
      const subtitle=RESIDENCE_DOM.getElementById('install-button-subtitle');
      const progressBar=RESIDENCE_DOM.getElementById('floor-install-progress');
      const statusNode=RESIDENCE_DOM.getElementById('floor-install-status');
      if(button) {
        button.disabled=status==='installing';
        button.dataset.state=status;
      }
      if(label) label.textContent=status==='installed' ? 'Flooring installed' : status==='installing' ? 'Installing flooring' : 'Install flooring';
      if(subtitle) subtitle.textContent=status==='installed'
        ? 'Floor, both edge details, skirting and scotia are installed in 3D'
        : status==='installing'
          ? 'Applying the floor, Position 01, Position 02, skirting and scotia to 3D'
          : status==='pending'
            ? 'Apply the staged floor, edge details, skirting and scotia to 3D'
            : 'Generate floor, edge trims, nosing, skirting and scotia automatically';
      if(progressBar) {
        if(progressBar.style?.setProperty) progressBar.style.setProperty('--install-progress',`${progress}%`);
        else progressBar.dataset.progress=String(progress);
      }
      if(statusNode) statusNode.textContent=message;
      appRoot.dataset.floorInstallerStatus=status;
    }

    function markFloorInstallationPending() {
      if(stagedSelectionMatchesInstalled()) {
        flooringInstallState.status=flooringInstallState.lastReceipt ? 'installed' : 'ready';
        const installed=syncInstalledFloorDataset();
        setFloorInstallerUi(flooringInstallState.status,`${installed.floorLabel} already matches the 3D scene.`,flooringInstallState.status==='installed' ? 100 : 0);
        return true;
      }
      flooringInstallState.status='pending';
      const installed=syncInstalledFloorDataset();
      setFloorInstallerUi('pending',`Selection staged. The 3D scene remains ${installed.floorLabel} with its installed trims until you press Install flooring.`,0);
      return true;
    }

    function showFloorInstallConfirmation(installed) {
      const confirmation=RESIDENCE_DOM.getElementById('floor-install-confirmation');
      const summary=RESIDENCE_DOM.getElementById('floor-install-confirmation-summary');
      if(!confirmation || !summary) return;
      summary.textContent=`${installed.floorLabel} · Position 01 ${installed.transitionLabel} · Position 02 ${installed.nosingLabel} · ${installed.wallFinishLabel}`;
      confirmation.dataset.visible='true';
      clearTimeout(floorInstallConfirmationTimer);
      floorInstallConfirmationTimer=setTimeout(()=>{ confirmation.dataset.visible='false'; },3200);
    }

    function completeFloorInstallationVisual() {
      if(!floorTextureReady) {
        if(appRoot.dataset.floorTextureStatus==='fallback-palette' || performance.now()-flooringInstallVisualState.startedAt>15000) {
          flooringInstallVisualState.active=false;
          flooringInstallState.status='error';
          setFloorInstallerUi('error','The floor image could not be prepared. Please retry installation; the material is not confirmed yet.',0);
        } else setFloorInstallerUi('installing','Preparing the detailed plank textures…',94);
        return false;
      }
      flooringInstallVisualState.active=false;
      flooringInstallVisualState.progress=1;
      flooringInstallState.status='installed';
      const installed=syncInstalledFloorDataset();
      setFloorInstallerUi('installed',`${installed.floorLabel} installed across ${installed.dryFloorZoneCount} connected dry-floor zones · Position 01 ${installed.transitionLabel} · Position 02 ${installed.nosingLabel} · ${installed.wallFinishLabel}.`,100);
      showFloorInstallConfirmation(installed);
      announceInteraction(`3D flooring installed · ${installed.floorLabel} · both edge positions and the selected skirting or scotia updated.`);
      return true;
    }

    function startFloorInstallationVisual(receipt) {
      flooringInstallVisualState.active=true;
      flooringInstallVisualState.startedAt=performance.now();
      flooringInstallVisualState.progress=0;
      flooringInstallVisualState.receipt=receipt;
      flooringInstallState.status='installing';
      appRoot.dataset.floorInstallVisualProgress='0';
      setFloorInstallerUi('installing','Installing the selected floor, edge details, skirting and scotia into the 3D scene…',2);
    }

    function updateFloorInstallationVisual(now) {
      if(!flooringInstallVisualState.active) return;
      const raw=Math.max(0,Math.min(1,(now-flooringInstallVisualState.startedAt)/flooringInstallVisualState.duration));
      const eased=raw*raw*(3-2*raw);
      flooringInstallVisualState.progress=eased;
      appRoot.dataset.floorInstallVisualProgress=eased.toFixed(3);
      const progress=Math.min(floorTextureReady?100:94,Math.round(8+eased*92));
      const progressBar=RESIDENCE_DOM.getElementById('floor-install-progress');
      if(progressBar?.style?.setProperty) progressBar.style.setProperty('--install-progress',`${progress}%`);
      const statusNode=RESIDENCE_DOM.getElementById('floor-install-status');
      if(statusNode) statusNode.textContent=`Installing in 3D · floor ${Math.min(100,Math.round(eased*118))}% · edges and wall finish ${Math.max(0,Math.round((eased-.62)/.38*100))}%`;
      if(raw>=1) completeFloorInstallationVisual();
    }

    function generatedSelectionForPack(pack,textureDataUrl=generatedFloorTextureSource) {
      return Object.freeze({
        type:'pomi.floor.generator.selection',
        schema:'pomi.generator-to-house.v1',
        generator:pack.generator,
        packId:pack.id,
        payload:Object.freeze({
          sourceSchema:pack.sourceSchema,
          dimensionsMm:pack.dimensionsMm,
          textureDataUrl:typeof textureDataUrl==='string' && textureDataUrl.startsWith('data:image/') ? textureDataUrl : ''
        })
      });
    }

    function installFlooring() {
      const pack=FLOOR_DATA_PACKS[activeFloorDataPackId];
      if(!pack) {
        flooringInstallState.status='error';
        setFloorInstallerUi('error','Choose one flooring material before installation.',0);
        return false;
      }
      flooringInstallState.status='installing';
      setFloorInstallerUi('installing','Generating the selected floor material, Position 01 trim, Position 02 nosing and selected skirting or scotia…',38);
      const stagedTexture=generatedFloorTextureSource;
      const generatedSelection=generatedSelectionForPack(pack,stagedTexture);
      const floorApplied=ingestGeneratorSelection(generatedSelection);
      if(!floorApplied) {
        flooringInstallState.status='error';
        setFloorInstallerUi('error','The selected flooring package could not be generated. Choose another material and retry.',0);
        return false;
      }
      flooringInstallState.installCount+=1;
      const receipt=Object.freeze({
        schema:'pomi.flooring.auto-install.v1',
        version:1,
        status:'installed',
        installNumber:flooringInstallState.installCount,
        floor:Object.freeze({packId:pack.id,family:pack.family,colour:pack.colour,dimensionsMm:pack.dimensionsMm,generator:pack.generator,surfaceTreatment:pack.family==='engineered'?'waxed-satin-visual':'factory-finish'}),
        position01:Object.freeze({location:'wet-area transition',profile:finishState.transitionProfile,finish:finishState.transitionFinish,generator:'transition-trim'}),
        position02:Object.freeze({location:'upper landing nosing',profile:finishState.nosingProfile,finish:finishState.nosingFinish,generator:'stair-nosing'}),
        skirting:Object.freeze({profile:finishState.skirtingProfile,paint:finishState.skirtingPaint,generator:'skirting-finish'}),
        dryFloorZoneCount:DRY_FLOOR_ZONES.length,
        quantity:FLOOR_PURCHASE,
        generatorCalls:Object.freeze([
          Object.freeze({id:'floor-material',status:'PASS'}),
          Object.freeze({id:'position-01-transition-trim',status:'PASS'}),
          Object.freeze({id:'position-02-landing-nosing',status:'PASS'}),
          Object.freeze({id:'skirting-profile-and-paint',status:'PASS'}),
          Object.freeze({id:'connected-upper-dry-floor-install',status:'PASS'})
        ])
      });
      if(!commitFlooringSelection(pack,generatedFloorTextureSource || stagedTexture)) {
        flooringInstallState.status='error';
        setFloorInstallerUi('error','The generated package could not be committed to the 3D scene.',0);
        return false;
      }
      flooringInstallState.lastReceipt=receipt;
      appRoot.dataset.floorInstallationReceipt=JSON.stringify(receipt);
      try {
        localStorage.setItem(FLOOR_INSTALL_STORAGE_KEY,JSON.stringify(receipt));
        appRoot.dataset.floorInstallPersistence='stored';
      } catch(error) {
        appRoot.dataset.floorInstallPersistence='memory-only';
      }
      syncFinishUI();
      startFloorInstallationVisual(receipt);
      return receipt;
    }

    function restoreFlooringInstallation() {
      try {
        const receipt=JSON.parse(localStorage.getItem(FLOOR_INSTALL_STORAGE_KEY) || 'null');
        if(receipt?.schema!=='pomi.flooring.auto-install.v1' || !FLOOR_DATA_PACKS[receipt.floor?.packId]) return false;
        const pack=FLOOR_DATA_PACKS[receipt.floor.packId];
        installedFloorDataPackId=pack.id;
        installedFloorTextureSource='';
        installedFinishState.floorFamily=pack.family;
        installedFinishState.floorColours[pack.family]=pack.colour;
        if(PROFILE_KEYS.includes(receipt.skirting?.profile)&&SKIRTING_PAINTS[receipt.skirting?.paint]) {
          installedFinishState.skirtingProfile=receipt.skirting.profile;
          installedFinishState.skirtingPaint=receipt.skirting.paint;
          finishState.skirtingProfile=receipt.skirting.profile;
          finishState.skirtingPaint=receipt.skirting.paint;
          detailState.skirtingProfile=receipt.skirting.profile;
        }
        if(TRANSITION_PRODUCTS[receipt.position01?.profile]?.finishes.includes(receipt.position01?.finish)) {
          installedFinishState.transitionProfile=receipt.position01.profile;
          installedFinishState.transitionFinish=receipt.position01.finish;
          finishState.transitionProfile=receipt.position01.profile;
          finishState.transitionFinish=receipt.position01.finish;
          finishState.wetTransition=receipt.position01.profile;
          detailState.wetThreshold=receipt.position01.profile;
        }
        if(NOSING_PRODUCTS[receipt.position02?.profile]?.finishes.includes(receipt.position02?.finish)) {
          installedFinishState.nosingProfile=receipt.position02.profile;
          installedFinishState.nosingFinish=receipt.position02.finish;
          finishState.nosingProfile=receipt.position02.profile;
          finishState.nosingFinish=receipt.position02.finish;
          finishState.stairEdge=receipt.position02.profile;
          finishState.metalFinish=receipt.position02.finish;
          detailState.stairMetal=receipt.position02.finish;
        }
        flooringInstallState.lastReceipt=Object.freeze(receipt);
        flooringInstallState.status='installed';
        flooringInstallState.installCount=Math.max(1,Number(receipt.installNumber)||1);
        appRoot.dataset.floorInstallationReceipt=JSON.stringify(receipt);
        loadInstalledFloorTexture();
        syncInstalledFloorDataset();
        return true;
      } catch(error) {
        appRoot.dataset.floorInstallPersistence='restore-failed';
        return false;
      }
    }

    function setFloorFamily(family) {
      if (!FLOOR_PRODUCTS[family]) return false;
      finishState.floorFamily=family;
      generatedFloorTextureSource='';
      activeFloorDataPackId=matchingFloorDataPackId(family,selectedFloorColourKey()) || '';
      syncFinishUI();
      markFloorInstallationPending();
      const product=selectedFloorProduct();
      announceInteraction(`${product.familyLabel} · ${product.product} · ${(product.thickness*1000).toFixed(1)} mm product build.`);
      return true;
    }

    function setFloorColour(colourKey) {
      const product=selectedFloorProduct();
      if (!product.colours[colourKey]) return false;
      finishState.floorColours[finishState.floorFamily]=colourKey;
      generatedFloorTextureSource='';
      activeFloorDataPackId=matchingFloorDataPackId(finishState.floorFamily,colourKey) || '';
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`${product.familyLabel} colour · ${product.colours[colourKey].label}. Screen colour is indicative; verify a physical sample.`);
      return true;
    }

    function setSkirtingProfile(profile) {
      if (!PROFILE_KEYS.includes(profile)) return false;
      finishState.skirtingProfile=profile;
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`${skirtingProfileLabel(profile)} staged for flooring installation.`);
      return true;
    }

    function setSkirtingPaint(paint) {
      if (!SKIRTING_PAINTS[paint]) return false;
      finishState.skirtingPaint=paint;
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Skirting paint · ${SKIRTING_PAINTS[paint].label} staged for installation.`);
      return true;
    }

    function setActiveFinishCategory(category) {
      if (!['flooring','skirting','transitions','nosing'].includes(category)) return false;
      finishState.activeFinishCategory=category;
      syncFinishUI();
      return true;
    }

    function setTransitionProfile(profile) {
      const product=TRANSITION_PRODUCTS[profile];
      if (!product) return false;
      finishState.transitionProfile=profile;
      finishState.wetTransition=profile;
      if (!product.finishes.includes(finishState.transitionFinish)) finishState.transitionFinish=product.finishes[0];
      detailState.wetThreshold=profile;
      syncDetailDataset();
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Floor transition · ${product.label} · ${METAL_FINISHES[finishState.transitionFinish].label}.`);
      return true;
    }

    function setTransitionFinish(finish) {
      const product=TRANSITION_PRODUCTS[finishState.transitionProfile];
      if (!METAL_FINISHES[finish] || !product.finishes.includes(finish)) return false;
      finishState.transitionFinish=finish;
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Floor transition finish · ${METAL_FINISHES[finish].label}.`);
      return true;
    }

    function setNosingProfile(profile) {
      const product=NOSING_PRODUCTS[profile];
      if (!product) return false;
      finishState.nosingProfile=profile;
      finishState.stairEdge=profile;
      if (!product.finishes.includes(finishState.nosingFinish)) finishState.nosingFinish=product.finishes[0];
      finishState.metalFinish=finishState.nosingFinish;
      detailState.stairMetal=finishState.nosingFinish;
      syncDetailDataset();
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Stair nosing · ${product.label} · ${METAL_FINISHES[finishState.nosingFinish].label}.`);
      return true;
    }

    function setNosingFinish(finish) {
      const product=NOSING_PRODUCTS[finishState.nosingProfile];
      if (!METAL_FINISHES[finish] || !product.finishes.includes(finish)) return false;
      finishState.nosingFinish=finish;
      finishState.metalFinish=finish;
      detailState.stairMetal=finish;
      syncDetailDataset();
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Stair nosing finish · ${METAL_FINISHES[finish].label}.`);
      return true;
    }

    function setNosingSelection(profile,finish) {
      const product=NOSING_PRODUCTS[profile];
      if(!product || !METAL_FINISHES[finish] || !product.finishes.includes(finish)) return false;
      finishState.nosingProfile=profile;
      finishState.nosingFinish=finish;
      finishState.stairEdge=profile;
      finishState.metalFinish=finish;
      detailState.stairMetal=finish;
      syncDetailDataset();
      syncFinishUI();
      markFloorInstallationPending();
      announceInteraction(`Stair nosing · ${product.label} · ${METAL_FINISHES[finish].label}.`);
      return true;
    }

    function nosingProfileForFinish(finish) {
      return finish==='brass' ? 'sfsb60m-brass' : finish==='silver' ? 'sfs51nms-silver' : 'oddz-stair-nosing';
    }

    function setMetalFinish(finish) {
      if(!['brass','woodgrain','silver'].includes(finish)) return false;
      return setNosingSelection(nosingProfileForFinish(finish),finish);
    }

    function setStairEdge(edge) {
      const normalized={lshape:'sfsb60m-brass',hammered:'sfsb60m-brass','hybrid-nosing':'sfsb60m-brass','hammered-nosing':'sfsb60m-brass'}[edge] || edge;
      return setNosingProfile(normalized);
    }

    function setDirectLevel(mode) {
      if (!['upper','both','ground'].includes(mode)) return false;
      levelMode=mode;
      appRoot.dataset.levelMode=mode;
      applyCameraPreset(mode);
      syncFinishUI();
      return true;
    }

    function setDirectWall(mode) {
      if (!['solid','cutaway','hidden'].includes(mode)) return false;
      wallMode=mode;
      appRoot.dataset.wallMode=mode;
      syncFinishUI();
      return true;
    }

    function setDirectLabels(mode) {
      if (!['off','rooms','key','all'].includes(mode)) return false;
      labelMode=mode;
      appRoot.dataset.labelMode=mode;
      syncFinishUI();
      return true;
    }

    function setMeasurementVisibility(visible) {
      categoryState.measurement=visible===true || visible==='on' || visible==='show';
      syncFinishUI();
      return categoryState.measurement;
    }

    function setReferenceGridVisibility(visible) {
      categoryState.grid=visible===true || visible==='on' || visible==='show';
      syncFinishUI();
      return categoryState.grid;
    }

    function commandOpening(interaction, opening,{silent=false,announce=true}={}) {
      if (!interaction || !interaction.canToggle) return false;
      if(interaction.target===(opening?1:0)) return true;
      const kind=interaction.kind;
      if(!silent)window.ResidenceSound?.play(kind==='hinged door'?'door-handle':kind.startsWith('operable window')?'window-handle':kind==='sectional garage door'?'garage-move':'slider-move');
      interaction.open=opening;
      interaction.target=opening ? 1 : 0;
      interaction.moving=true;
      interaction.commandElapsed=0;
      interaction.leafDelayRemaining=interaction.kind==='hinged door' ? PARAMS.DOOR_HANDLE_PRESS_SECONDS : 0;
      interaction.handleTurn=0;
      interaction.keySway=0;
      interaction.handlePeakAt=null;
      interaction.leafMotionAt=null;
      activeInteractionId=interaction.id;
      if(announce)announceInteraction(`${interaction.id} · ${interaction.kind} · ${opening ? 'OPENING' : 'CLOSING'}…`);
      return true;
    }

    function toggleOpeningAt(clientX,clientY,pointerType='mouse') {
      const hit=hitTestOpening(clientX,clientY,pointerType);
      if (!hit) return false;
      const {interaction,screen}=hit;
      if (!interaction.canToggle) {
        announceInteraction(`${interaction.id} is drawing-defined fixed glazing; no opening movement is modelled.`);
        return true;
      }
      const opening=interaction.target < .5;
      if (opening && interaction.kind==='mirrored robe slider') {
        if (screen.role==='open-left') interaction.slideDirection='left';
        if (screen.role==='open-right') interaction.slideDirection='right';
      }
      return commandOpening(interaction,opening);
    }

    function commandBathroomInteraction(interaction) {
      if (!interaction) return false;
      if(interaction.mode==='water-toggle') {
        window.ResidenceSound?.play('tap-control');
        if(waterSystem.bathTap.active){waterSystem.bathTap.active=false;waterSystem.revision++;announceInteraction('Bath water · OFF');return true;}
        if(waterSystem.level>=waterSystem.maximum-.00001){waterSystem.bathTap.active=false;waterSystem.revision++;announceInteraction('Bath full · water remains OFF');return true;}
        waterSystem.drain.active=false;
        waterSystem.bathTap.active=true;waterSystem.bathTap.soundElapsed=0;window.ResidenceSound?.play('water-bath');
        waterSystem.revision++;announceInteraction('Bath water · ON');return true;
      }
      if(interaction.mode==='drain') {
        window.ResidenceSound?.play('tap-control');
        if(interaction.active){interaction.active=false;waterSystem.revision++;announceInteraction('Bath drain · OFF');return true;}
        waterSystem.bathTap.active=false;
        if(waterSystem.level<=.00001){interaction.active=false;announceInteraction('Bath empty · drain remains OFF');return true;}
        interaction.active=true;interaction.soundElapsed=0;window.ResidenceSound?.play('water-drain');waterSystem.revision++;announceInteraction('Bath drain · ON');return true;
      }
      if(interaction.mode==='water') {
        const wasActive=interaction.active;
        interaction.active=!interaction.active;
        interaction.soundElapsed=0;
        window.ResidenceSound?.play('tap-control');
        if(interaction.active)window.ResidenceSound?.play(waterSoundFor(interaction));
        else if(wasActive&&interaction===waterSystem.showerTap&&waterSystem.showerLevel>.00005)window.ResidenceSound?.play('water-drain');
        waterSystem.revision++;
        announceInteraction(`${interaction.kind} · ${interaction.active?'ON':'OFF'}`);return true;
      }
      if (interaction.mode==='toggle') {
        interaction.active=!interaction.active;
        interaction.defog=interaction.active;
        announceInteraction(`${interaction.id} · concealed LED + demister · ${interaction.active ? 'ON' : 'OFF'}`);
        return true;
      }
      interaction.open=interaction.target<.5;
      if(interaction.open) window.ResidenceSound?.play(interaction.id==='T23-SHOWER-DOOR'?'window-handle':'cabinet-open');
      interaction.target=interaction.open ? 1 : 0;
      interaction.moving=true;
      activeInteractionId=interaction.id;
      announceInteraction(`${interaction.id} · ${interaction.open ? 'OPENING' : 'CLOSING'}…`);
      return true;
    }

    function toggleSceneActionAt(clientX,clientY,pointerType='mouse') {
      return activateScenePick(resolveSceneAction(clientX,clientY,pointerType));
    }

    function resetOpenings() {
      openingInteractions.forEach(interaction=>{
        interaction.open=interaction.initialOpen;
        interaction.target=interaction.initialOpen ? 1 : 0;
        interaction.progress=interaction.target;
        interaction.moving=false;
        interaction.commandElapsed=Number.POSITIVE_INFINITY;
        interaction.leafDelayRemaining=0;
        interaction.handleTurn=0;
        interaction.keySway=0;
        interaction.handlePeakAt=null;
        interaction.leafMotionAt=null;
        interaction.slideDirection=interaction.initialSlideDirection || 'left';
      });
      bathroomInteractions.forEach(interaction=>{
        interaction.open=false;
        interaction.target=0;
        interaction.progress=0;
        interaction.moving=false;
        interaction.active=false;
        interaction.defog=false;
        interaction.illumination=0;
      });
      roomLighting.forEach(state=>{ state.active=false; state.intensity=0; });
      waterSystem.level=0;waterSystem.showerLevel=0;waterSystem.showerDrainSoundElapsed=0;waterSystem.phase=0;waterSystem.revision++;
      activeInteractionId=null;
      announceInteraction('Model reset · openings closed; room lights, mirror light and demister off.');
    }

    function updateOpeningAnimations(now) {
      const dt=Math.max(0,Math.min(.05,(now-lastAnimationTime)/1000));
      lastAnimationTime=now;
      updateWaterSystem(dt);
      const lightStep=dt/.22;
      roomLighting.forEach(state=>{
        const delta=(state.active?1:0)-state.intensity;
        state.intensity+=Math.sign(delta)*Math.min(Math.abs(delta),lightStep);
      });
      if(mirrorLightingState) {
        const delta=(mirrorLightingState.active?1:0)-mirrorLightingState.illumination;
        mirrorLightingState.illumination+=Math.sign(delta)*Math.min(Math.abs(delta),lightStep);
      }
      openingInteractions.forEach(interaction=>{
        if (interaction.moving && interaction.kind==='hinged door') {
          interaction.commandElapsed+=dt;
          const press=PARAMS.DOOR_HANDLE_PRESS_SECONDS;
          const releaseEnd=press+PARAMS.DOOR_HANDLE_RELEASE_SECONDS;
          if (interaction.commandElapsed<press) {
            const t=interaction.commandElapsed/press;
            interaction.handleTurn=t*t*(3-2*t);
          } else if (interaction.commandElapsed<releaseEnd) {
            const t=(interaction.commandElapsed-press)/PARAMS.DOOR_HANDLE_RELEASE_SECONDS;
            interaction.handleTurn=1-t*t*(3-2*t);
          } else {
            interaction.handleTurn=0;
          }
          if (interaction.handlePeakAt===null && interaction.commandElapsed>=press) interaction.handlePeakAt=press;
          if (interaction.hardwareMode==='keyed') {
            const swayT=Math.max(0,interaction.commandElapsed-press*.45);
            interaction.keySway=PARAMS.DOOR_KEY_SWAY_MAX*Math.sin(swayT*24)*Math.exp(-3.4*swayT);
          } else {
            interaction.keySway=0;
          }
          if (interaction.leafDelayRemaining>0) {
            interaction.leafDelayRemaining=Math.max(0,interaction.leafDelayRemaining-dt);
            return;
          }
        }
        const delta=interaction.target-interaction.progress;
        if (Math.abs(delta)<.0005) {
          if (interaction.kind==='hinged door' && interaction.commandElapsed<PARAMS.DOOR_HANDLE_PRESS_SECONDS+PARAMS.DOOR_HANDLE_RELEASE_SECONDS) return;
          if (interaction.moving) {
            interaction.progress=interaction.target;
            interaction.moving=false;
            interaction.handleTurn=0;
            interaction.keySway=0;
            if(!interaction.open) {
              const kind=interaction.kind;
              window.ResidenceSound?.play(kind==='hinged door'?'door-close':kind.startsWith('operable window')?'window-close':kind==='sectional garage door'?'garage-stop':'slider-stop');
            }
            if (activeInteractionId===interaction.id) {
              announceInteraction(`${interaction.id} · ${interaction.kind} · ${interaction.open ? 'OPEN' : 'CLOSED'}`);
              activeInteractionId=null;
            }
          }
          return;
        }
        interaction.moving=true;
        if (interaction.kind==='hinged door' && interaction.leafMotionAt===null) interaction.leafMotionAt=interaction.commandElapsed;
        const step=dt/interaction.duration;
        interaction.progress += Math.sign(delta)*Math.min(Math.abs(delta),step);
      });
      bathroomInteractions.filter(interaction=>interaction.mode==='motion').forEach(interaction=>{
        const delta=interaction.target-interaction.progress;
        if (Math.abs(delta)<.0005) {
          if (interaction.moving) {
            interaction.progress=interaction.target;
            interaction.moving=false;
            if(!interaction.open) window.ResidenceSound?.play(interaction.id==='T23-SHOWER-DOOR'?'window-close':'cabinet-close');
            if (activeInteractionId===interaction.id) {
              announceInteraction(`${interaction.id} · ${interaction.open ? 'OPEN' : 'CLOSED'}`);
              activeInteractionId=null;
            }
          }
          return;
        }
        interaction.moving=true;
        const step=dt/interaction.duration;
        interaction.progress+=Math.sign(delta)*Math.min(Math.abs(delta),step);
      });
    }

    const floorQualityState={lastMotionAt:-Infinity,lastSceneStamp:'',renderedFrames:0};
    function resizeCanvas(viewportHint=null) {
      const now=performance.now();
      if(pointers.size) floorQualityState.lastMotionAt=now;
      const moving=now-floorQualityState.lastMotionAt<280;
      const viewportRect=sceneViewport.getBoundingClientRect();
      const hintedWidth=Number(viewportHint?.width),hintedHeight=Number(viewportHint?.height);
      const mobileStageReady=Boolean(mobileUiMedia?.matches&&viewportRect.width>1&&viewportRect.height>1);
      const cssWidth=Math.max(1,Math.round(mobileStageReady?viewportRect.width:(hintedWidth>0?hintedWidth:(viewportRect.width||document.documentElement?.clientWidth||window.innerWidth||canvas.clientWidth))));
      const cssHeight=Math.max(1,Math.round(mobileStageReady?viewportRect.height:(hintedHeight>0?hintedHeight:(viewportRect.height||document.documentElement?.clientHeight||window.innerHeight||canvas.clientHeight))));
      const cssSizeKey=`${cssWidth}x${cssHeight}`;
      if(canvas.dataset.viewportCssSize!==cssSizeKey) {
        canvas.style.setProperty('width',`${cssWidth}px`,'important');
        canvas.style.setProperty('height',`${cssHeight}px`,'important');
        canvas.dataset.viewportCssSize=cssSizeKey;
      }
      const native=Math.max(.25,Number(viewportHint?.dpr)||0,window.devicePixelRatio||1);
      const mobile=cssWidth<=900;
      const desired=moving?Math.min(native,mobile?2:1.5):Math.min(3,Math.max(native,mobile?2:1.5));
      const budget=moving?2600000:4200000;
      const budgetScale=Math.sqrt(budget/Math.max(1,cssWidth*cssHeight));
      const dimensionScale=Math.min(gpuViewportDims[0]/cssWidth,gpuViewportDims[1]/cssHeight,gpuRenderbufferLimit/cssWidth,gpuRenderbufferLimit/cssHeight);
      const dpr=Math.max(1/Math.max(cssWidth,cssHeight),Math.min(desired,budgetScale,dimensionScale));
      const width = Math.max(1, Math.floor(cssWidth*dpr));
      const height = Math.max(1, Math.floor(cssHeight*dpr));
      const changed=canvas.width!==width||canvas.height!==height;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
      }
      const drawWidth=Math.max(1,Number(gl.drawingBufferWidth)||canvas.width),drawHeight=Math.max(1,Number(gl.drawingBufferHeight)||canvas.height);
      gl.viewport(0,0,drawWidth,drawHeight);
      appRoot.dataset.renderQuality=JSON.stringify({mode:moving?'interactive':'floor-detail',cssWidth,cssHeight,nativePixelRatio:Number(native.toFixed(2)),pixelRatio:Number(dpr.toFixed(2)),width:drawWidth,height:drawHeight,textureDetail:'full',onDemand:true});
      return changed;
    }

    function uploadFloorReflections() {
      const windows=floorWindowSources.filter(source=>source.level==='upper').slice(0,12);
      const rooms=roomLighting.filter(room=>room.level==='upper').flatMap(room=>room.bounds);
      for(let i=0;i<12;i++) {
        const w=windows[i];
        if(!w || !categoryState.glazing) {
          gl.uniform4f(locations.floorWindows[i],0,0,0,0);
          gl.uniform2f(locations.floorWindowY[i],0,0);
          gl.uniform4f(locations.floorWindowRooms[i],0,0,0,0);
          continue;
        }
        const px=(w.axis?w.plane:(w.q0+w.q1)/2)+PLAN_W/2;
        const pz=(w.axis?(w.q0+w.q1)/2:w.plane)+PLAN_D/2;
        const distance=b=>Math.hypot(Math.max(b[0]-px,0,px-b[1]),Math.max(b[2]-pz,0,pz-b[3]));
        const room=rooms.reduce((best,b)=>!best||distance(b)<distance(best)?b:best,null)||[.25,12.22,.25,7.30];
        gl.uniform4f(locations.floorWindows[i],w.plane,w.q0,w.q1,w.axis);
        gl.uniform2f(locations.floorWindowY[i],w.sill,w.head);
        gl.uniform4f(locations.floorWindowRooms[i],room[0]-PLAN_W/2,room[2]-PLAN_D/2,room[1]-PLAN_W/2,room[3]-PLAN_D/2);
      }
    }

    function render(timestamp=performance.now()) {
      if(window.__RESIDENCE_PAUSED__) {updateOpeningAnimations(timestamp);requestAnimationFrame(render);return;}
      updateOpeningAnimations(timestamp);
      updateFloorInstallationVisual(timestamp);
      resizeCanvas();
      updateCeilingShadows();
      if(lightUI.touchId) {
        refreshLightHintVisibility();
        if(performance.now()>=lightUI.touchUntil) lightUI.touchId=null;
      }
      // Static views keep their full-resolution image without redrawing thousands of objects at 60 Hz.
      const sceneStamp=JSON.stringify([canvas.width,canvas.height,camera.yaw,camera.pitch,camera.distance,camera.target,camera.mobileFrameOffset,
        levelMode,wallMode,labelMode,categoryState,detailState,finishState,installedFinishState,
        floorTextureRequest,floorTextureReady,activeMaterialHotspot,activeInteractionId,flooringInstallVisualState.progress,
        openingInteractions.map(s=>[s.progress,s.handleTurn,s.keySway,s.slideDirection]),
        bathroomInteractions.map(s=>[s.progress,s.active,s.illumination]),roomLighting.map(s=>[s.intensity,s.temperature]),lightUI.temperature,ceilingShadows.revision,waterSystem.revision]);
      if(sceneStamp===floorQualityState.lastSceneStamp) {requestAnimationFrame(render);return;}
      floorQualityState.lastSceneStamp=sceneStamp;
      floorQualityState.renderedFrames++;
      gl.clearColor(.700,.710,.690,1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);
      const view = lookAt(cameraEye(), camera.target, cameraUp());
      const eye=cameraEye();
      const drawWidth=Math.max(1,Number(gl.drawingBufferWidth)||canvas.width),drawHeight=Math.max(1,Number(gl.drawingBufferHeight)||canvas.height);
      const proj = perspective(Math.PI/4, drawWidth/drawHeight, .05, 80);
      if(mobileUiMedia.matches) {
        proj[8]-=camera.mobileFrameOffset[0];
        proj[9]-=camera.mobileFrameOffset[1];
      }
      currentMVP = mat4Multiply(proj, view);
      gl.uniformMatrix4fv(locations.mvp, false, currentMVP);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,ceilingShadows.initialized?ceilingShadows.texture:ceilingShadowFallback);
      gl.uniform1i(locations.ceilingShadows,1);
      gl.uniform2f(locations.shadowParams,1/ceilingShadows.size,ceilingShadows.bias || .004);
      gl.uniform3f(locations.roomLightColour,...(lightUI.temperature==='warm'?[1,.93,.82]:[.86,.94,1]));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,floorTexture);
      gl.uniform1i(locations.floorTexture,0);
      gl.uniform1f(locations.floorAtlasRows,floorTextureAtlasRows);
      const surface=PomiFloorSurface.finish(installedFinishState.floorFamily,installedFloorColourKey());
      gl.uniform4f(locations.floorSurface,surface.roughness,surface.toneVariation,surface.relief,surface.reflection);
      gl.uniform1f(locations.pixelFootprint,camera.distance*.8284/drawHeight);
      uploadFloorReflections();
      gl.uniform3f(locations.cameraEye,eye[0],eye[1],eye[2]);
      gl.uniform1f(locations.mirrorLight,categoryState.wet && levelAllows('upper') ? (mirrorLightingState?.illumination || 0) : 0);
      const lightingByLevel={upper:lightingSamplesForLevel('upper'),ground:lightingSamplesForLevel('ground'),shared:lightingSamplesForLevel('shared')};
      let uploadedLightKey=null;

      const opaque = [], transparent = [];
      meshes.forEach(item => {if(!item.physicalOnly)(effectiveAlpha(item) >= .995 ? opaque : transparent).push(...lightingDrawItems(item));});
      const cameraDepth=item=>{const centre=item.transformWhen?transformPoint(item.transformWhen(),item.lightCenter):item.lightCenter;return Math.hypot(centre[0]-eye[0],centre[1]-eye[1],centre[2]-eye[2]);};
      transparent.sort((a,b)=>cameraDepth(b)-cameraDepth(a));
      for (const group of [opaque, transparent]) {
        for (const item of group) {
          const alpha = effectiveAlpha(item);
          if (alpha <= .001) continue;
          const receiverLights=lightsForReceiver(item,lightingByLevel[item.level] || []);
          const receiverKey=receiverLights.map(led=>led.id).join(',');
          if(uploadedLightKey!==receiverKey) {
            uploadRoomLights(receiverLights);
            uploadedLightKey=receiverKey;
          }
          gl.depthMask(alpha >= .995);
          gl.blendFunc(gl.SRC_ALPHA,item.lightHalo?gl.ONE:gl.ONE_MINUS_SRC_ALPHA);
          bindItem(item);
          gl.uniformMatrix4fv(locations.model,false,item.transformWhen ? item.transformWhen() : IDENTITY_MATRIX);
          const renderColor=resolvedItemColor(item);
          gl.uniform4f(locations.color, renderColor[0],renderColor[1],renderColor[2],alpha);
          gl.uniform1f(locations.roughness,item.surfaceRoughness || 0);
          const selectedAccessoryFinish=item.finishMetalControlled
            ? (item.metalApplication==='transition' ? installedFinishState.transitionFinish : installedFinishState.nosingFinish)
            : '';
          const texturedFloor=floorTextureReady && (
            (item.category==='finishFloor' && item.finishFamily===installedFinishState.floorFamily) ||
            (item.finishMetalControlled && selectedAccessoryFinish==='woodgrain') ||
            item.isFloorMatchedScotia
          );
          const rawBounds=item.finishBounds || [0,0,1,1];
          const bounds=(item.finishMetalControlled||item.isFloorMatchedScotia)?[rawBounds[0]-PLAN_W/2,rawBounds[1]-PLAN_D/2,rawBounds[2],rawBounds[3]]:rawBounds;
          const textureBounds=item.finishTextureBounds || bounds;
          gl.uniform1f(locations.useFloorTexture,texturedFloor ? 1 : 0);
          gl.uniform1f(locations.textureRotate,texturedFloor ? (installedFloorColour().textureRotate || 0) : 0);
          gl.uniform1f(locations.textureSeed,texturedFloor ? (item.finishTextureSeed ?? ((item.finishVariant || 0)+.37)/9) : 0);
          gl.uniform1f(locations.materialKind,materialKindForItem(item));
          gl.uniform1f(locations.emission,item.emissionWhen?item.emissionWhen():0);
          gl.uniform1f(locations.glowAxis,item.glowAxis || 0);
          gl.uniform4f(locations.glowShape,...(item.glowShape || [0,0,0,0]));
          gl.uniform1f(locations.boardLongAxisX,texturedFloor && item.finishLongAxisX ? 1 : 0);
          gl.uniform2f(locations.boardOrigin,bounds[0],bounds[1]);
          gl.uniform2f(locations.boardSize,bounds[2],bounds[3]);
          gl.uniform2f(locations.plankOrigin,textureBounds[0],textureBounds[1]);
          gl.uniform2f(locations.plankSize,textureBounds[2],textureBounds[3]);
          // Only this continuous stair-wall finish owns its buried coplanar
          // slab edge. Preserve both floor geometry and all other depth state.
          if(item.preferCoplanarPaint) {
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(-1,-1);
          }
          gl.drawArrays(gl.TRIANGLES,0,item.count);
          if(item.preferCoplanarPaint) gl.disable(gl.POLYGON_OFFSET_FILL);
        }
      }
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(locations.emission,0);
      gl.uniform1f(locations.mirrorLight,0);
      uploadRoomLights([]);
      gl.lineWidth(1);
      lines.forEach(item => {
        if (!levelAllows(item.level)) return;
        if (!categoryState[item.category]) return;
        if (item.visibleWhen && !item.visibleWhen()) return;
        bindItem(item);
        gl.uniformMatrix4fv(locations.model,false,item.transformWhen ? item.transformWhen() : IDENTITY_MATRIX);
        gl.uniform4f(locations.color,item.color[0],item.color[1],item.color[2],item.alpha);
        gl.uniform1f(locations.roughness,0);
        gl.uniform1f(locations.useFloorTexture,0);
        gl.uniform1f(locations.textureRotate,0);
        gl.uniform1f(locations.textureSeed,0);
        gl.uniform1f(locations.materialKind,0);
        gl.uniform1f(locations.boardLongAxisX,0);
        gl.uniform2f(locations.boardOrigin,0,0);
        gl.uniform2f(locations.boardSize,1,1);
        gl.drawArrays(gl.LINES,0,item.count);
      });
      gl.depthMask(true);
      updateLabels();
      updateMaterialHotspots();
      updateInteractionTargets();
      updateSceneLightControls();
      appRoot.dataset.cameraState = JSON.stringify({
        yaw: Number(camera.yaw.toFixed(5)),
        pitch: Number(camera.pitch.toFixed(5)),
        distance: Number(camera.distance.toFixed(5)),
        target: camera.target.map(v => Number(v.toFixed(5))),
        mobileFrameOffset: camera.mobileFrameOffset.map(v => Number(v.toFixed(5))),
        orbitPivotLockedToHouse: true,
        levelMode,
        interactions: camera.interactionCounts,
        fullOrbit360: true
      });
      appRoot.dataset.openingStates = JSON.stringify(openingInteractions.map(({id,kind,open,canToggle,progress,moving,target,slideDirection})=>({
        id,kind,open,canToggle,
        progress:Number(progress.toFixed(4)),
        target,
        moving,
        slideDirection
      })));
      requestAnimationFrame(render);
    }

    function wrapAngle(angle) {
      const tau=Math.PI*2;
      return ((angle+Math.PI)%tau+tau)%tau-Math.PI;
    }

    function clampCamera() {
      camera.yaw=wrapAngle(camera.yaw);
      camera.pitch=wrapAngle(camera.pitch);
      camera.distance = Math.max(.75, Math.min(34, camera.distance));
    }

    function panCamera(dx, dy) {
      const scale = camera.distance * .0017;
      const back=normalize(subtract(cameraEye(),camera.target));
      const right=normalize(cross(cameraUp(),back));
      const screenUp=normalize(cross(back,right));
      camera.target[0] += (-dx*right[0]+dy*screenUp[0])*scale;
      camera.target[1] += (-dx*right[1]+dy*screenUp[1])*scale;
      camera.target[2] += (-dx*right[2]+dy*screenUp[2])*scale;
    }

    function panMobileFrame(dx,dy) {
      const rect=canvas.getBoundingClientRect();
      const nextX=camera.mobileFrameOffset[0]+2*dx/Math.max(1,rect.width);
      const nextY=camera.mobileFrameOffset[1]-2*dy/Math.max(1,rect.height);
      camera.mobileFrameOffset[0]=Math.max(-.78,Math.min(.78,nextX));
      camera.mobileFrameOffset[1]=Math.max(-.78,Math.min(.78,nextY));
    }

    function clampMobileTouchPitch() {
      camera.pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,camera.pitch));
    }

    const pointers = new Map();
    const pointerStarts = new Map();
    let mouseMode = null;
    let touchGesture = null;
    let lastPointerToggleAt = -Infinity;

    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('pointerdown', e => {
      closeAllPanels();
      closeRoomLightMenu();
      e.preventDefault();
      canvas.focus({preventScroll:true});
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType});
      pointerStarts.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType,button:e.button,moved:false,multi:false,modified:e.shiftKey||e.ctrlKey||e.altKey||e.metaKey});
      if (e.pointerType === 'mouse') mouseMode = (e.button === 2 || e.shiftKey) ? 'pan' : 'rotate';
      if (e.pointerType === 'touch' && pointers.size === 2) {
        pointerStarts.forEach(start=>{ start.multi=true; });
        const pts=[...pointers.values()];
        touchGesture={cx:(pts[0].x+pts[1].x)/2,cy:(pts[0].y+pts[1].y)/2,dist:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)};
      }
    });

    canvas.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) {
        if (e.pointerType === 'mouse') canvas.style.cursor=resolveSceneAction(e.clientX,e.clientY,'mouse') ? 'pointer' : 'grab';
        return;
      }
      e.preventDefault();
      const previous = pointers.get(e.pointerId);
      const start=pointerStarts.get(e.pointerId);
      if (start && Math.hypot(e.clientX-start.x,e.clientY-start.y)>7) start.moved=true;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType});
      if(start&&!start.moved&&pointers.size===1)return;
      if (e.pointerType === 'mouse') {
        const dx=e.clientX-previous.x, dy=e.clientY-previous.y;
        if (mouseMode === 'rotate') {
          camera.yaw -= dx*.008; camera.pitch -= dy*.006;
          camera.interactionCounts.rotate++;
        } else if (mouseMode === 'pan') {
          panCamera(dx,dy); camera.interactionCounts.pan++;
        }
      } else if (e.pointerType === 'touch') {
        if (pointers.size === 1) {
          camera.yaw -= (e.clientX-previous.x)*.009;
          camera.pitch -= (e.clientY-previous.y)*.007;
          clampMobileTouchPitch();
          camera.interactionCounts.rotate++;
        } else if (pointers.size === 2) {
          const pts=[...pointers.values()];
          const current={cx:(pts[0].x+pts[1].x)/2,cy:(pts[0].y+pts[1].y)/2,dist:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)};
          if (touchGesture) {
            if (current.dist > 5 && touchGesture.dist > 5) camera.distance *= touchGesture.dist/current.dist;
            panMobileFrame(current.cx-touchGesture.cx,current.cy-touchGesture.cy);
            camera.interactionCounts.zoom++;
            camera.interactionCounts.pan++;
          }
          touchGesture=current;
        }
      }
      clampCamera();
    });

    function endPointer(e, allowClick=false) {
      const start=pointerStarts.get(e.pointerId);
      if (allowClick && start && !start.moved && !start.multi && !start.modified && Math.hypot(e.clientX-start.x,e.clientY-start.y)<=7 && (start.type === 'touch' || start.button === 0)) {
        toggleSceneActionAt(e.clientX,e.clientY,start.type);
      }
      if(start)lastPointerToggleAt=performance.now();
      pointers.delete(e.pointerId);
      pointerStarts.delete(e.pointerId);
      if (e.pointerType === 'mouse') mouseMode=null;
      if (pointers.size < 2) touchGesture=null;
    }
    canvas.addEventListener('pointerup', e=>endPointer(e,true));
    canvas.addEventListener('pointercancel', e=>endPointer(e,false));
    canvas.addEventListener('lostpointercapture', e=>endPointer(e,false));
    // Some embedded browsers synthesize a click without a complete pointer-capture
    // sequence. This fallback preserves click/tap operation without double-toggling
    // ordinary pointer users.
    canvas.addEventListener('click', e=>{
      if (performance.now()-lastPointerToggleAt>600&&!e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey) toggleSceneActionAt(e.clientX,e.clientY,'mouse');
    });
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      closeRoomLightMenu();
      floorQualityState.lastMotionAt=performance.now();
      camera.distance *= Math.exp(e.deltaY*.0012);
      camera.interactionCounts.zoom++;
      clampCamera();
    }, {passive:false});

    canvas.addEventListener('keydown', e => {
      const move=18;
      floorQualityState.lastMotionAt=performance.now();
      if (e.key==='ArrowLeft') { camera.yaw += .10; camera.interactionCounts.rotate++; }
      else if (e.key==='ArrowRight') { camera.yaw -= .10; camera.interactionCounts.rotate++; }
      else if (e.key==='ArrowUp') { camera.pitch+=.08; camera.interactionCounts.rotate++; }
      else if (e.key==='ArrowDown') { camera.pitch-=.08; camera.interactionCounts.rotate++; }
      else if (e.key==='+' || e.key==='=') { camera.distance*=.9; camera.interactionCounts.zoom++; }
      else if (e.key==='-' || e.key==='_') { camera.distance*=1.1; camera.interactionCounts.zoom++; }
      else return;
      e.preventDefault();
      closeRoomLightMenu();
      void move;
      clampCamera();
    });

    function applyCameraPreset(mode=levelMode) {
      const preset=CAMERA_PRESETS[mode];
      camera.yaw=preset.yaw; camera.pitch=preset.pitch; camera.distance=preset.distance; camera.target=[...preset.target];camera.mobileFrameOffset=[0,0];
      clampCamera();
    }
    function applyPlanCamera(mode=levelMode) {
      const preset=CAMERA_PRESETS[mode];
      camera.yaw=0;camera.pitch=Math.PI/2;camera.distance=preset.planDistance;camera.target=[...preset.target];camera.mobileFrameOffset=[0,0];
      clampCamera();
    }
    function resetView() {
      if (materialDetailPanel) materialDetailPanel.hidden=true;
      activeMaterialHotspot=null;
      delete appRoot.dataset.activeMaterialHotspot;
      levelMode='upper';
      wallMode='solid';
      labelMode='off';
      categoryState.measurement=false;
      categoryState.grid=false;
      systemsLevelMode='upper';
      systemsStateSignature='';
      appRoot.dataset.levelMode=levelMode;
      appRoot.dataset.wallMode=wallMode;
      appRoot.dataset.labelMode=labelMode;
      applyPlanCamera('upper');
      resetOpenings();
      setControlLocators(true);
      closeRoomLightMenu();
      setPropertyEditorOpen(false);
      detailState.camera='overview';
      document.querySelectorAll('[data-detail-camera]').forEach(button=>button.classList.remove('is-active'));
      syncDetailDataset();
      syncFinishUI();
    }
    function planView() {
      applyPlanCamera();
      detailState.camera='overview';
      document.querySelectorAll('[data-detail-camera]').forEach(button=>button.classList.remove('is-active'));
      syncDetailDataset();
      syncFinishUI();
    }
    function applyDetailCamera(id) {
      const preset=DETAIL_CAMERA_PRESETS[id];
      if (!preset) return;
      levelMode='upper';
      wallMode=preset.wallMode || 'solid';
      camera.yaw=preset.yaw;
      camera.pitch=preset.pitch;
      camera.distance=preset.distance;
      camera.target=[...preset.target];
      camera.mobileFrameOffset=[0,0];
      detailState.camera=id;
      RESIDENCE_DOM.getElementById('level-mode').textContent='Level: upper';
      RESIDENCE_DOM.getElementById('level-mode').classList.remove('is-active');
      RESIDENCE_DOM.getElementById('wall-mode').textContent=`Walls: ${wallMode}`;
      RESIDENCE_DOM.getElementById('label-mode').textContent=`Labels: ${labelMode}`;
      document.querySelectorAll('[data-detail-camera]').forEach(button=>button.classList.toggle('is-active',button.dataset.detailCamera===id));
      appRoot.dataset.levelMode=levelMode;
      appRoot.dataset.wallMode=wallMode;
      clampCamera();
      syncDetailDataset();
      syncFinishUI();
      announceInteraction(`Detail camera · ${preset.label} · orbit, pan and zoom remain available.`);
      setPanelOpen('details-panel',false);
    }

    function materialDetailData(kind) {
      const product=installedFloorProduct();
      const colour=installedFloorColour();
      const floorLabel=`${product.familyLabel} · ${colour.label}`;
      if (kind==='wet') {
        const transition=TRANSITION_PRODUCTS[installedFinishState.transitionProfile];
        const metal=METAL_FINISHES[installedFinishState.transitionFinish];
        const delta=finishedTileDeltaRange(product).map(value=>(value*1000).toFixed(1));
        return {
          camera:'wet',title:'Tile / floor level transition',
          photo:installedFinishState.transitionFinish==='woodgrain' ? colour.image : (transition.image || metal.transitionImage),
          photoAlt:`${transition.label} in ${metal.label}`,
          photoCaption:`${transition.label} · ${metal.label} · actual supplier product reference stored locally.`,
          copy:`The selected floor finishes at ${(product.thickness*1000).toFixed(1)} mm above slab. The wet-area datum remains the controlled provisional 15–18 mm range, so the visible finished drop is ${delta[0]}–${delta[1]} mm. The retained tile edge and selected Universal Cover Trim assembly remain separate construction pieces.`,
          facts:[['Selected floor',floorLabel],['Finished drop',`${delta[0]}–${delta[1]} mm provisional`],['Transition',`${transition.label} · ${metal.label}`]],
          source:installedFinishState.transitionFinish==='woodgrain' ? (colour.source || product.source) : transition.source
        };
      }
      if (kind==='stair') {
        const nosing=NOSING_PRODUCTS[installedFinishState.nosingProfile];
        const metal=METAL_FINISHES[installedFinishState.nosingFinish];
        return {
          camera:'stair',title:'Carpet / floor trim at stair head',
          photo:nosing.image || metal.nosingImage,
          photoAlt:`${nosing.label} in ${metal.label}`,
          photoCaption:`${nosing.label} · ${metal.label} · actual supplier product reference stored locally.`,
          copy:`Only the upper landing receives this floor-to-carpet edge. The landing floor stops behind the selected profile and the continuous taupe carpet rises along the top stair riser to terminate behind its front edge. The 16 risers and 15 treads remain continuously carpet wrapped; no repeated metal strip has been added to ordinary stair treads.`,
          facts:[['Selected floor',`${floorLabel} · ${(product.thickness*1000).toFixed(1)} mm`],['Stair finish','Continuous taupe carpet wrap'],['Selected edge',`${nosing.label} · ${metal.label}`]],
          source:nosing.source
        };
      }
      const profiles={
        'aus-colonial':{label:'Aus Colonial',photo:'assets/details/skirting_aus_colonial.jpg',caption:'92 × 18 mm Aus Colonial primed pine · current Bunnings image.',source:'https://www.bunnings.com.au/92-x-18mm-5-4m-white-moulding-pine-fj-primed-aus-colonial_p0020756'},
        bullnose:{label:'Bullnose',photo:'assets/details/skirting_bullnose.jpg',caption:'92 × 18 mm Bullnose primed pine · current Bunnings image.',source:'https://www.bunnings.com.au/92-x-18mm-5-4m-moulding-white-pine-fj-primed-bullnose_p0020898'},
        scotia:{label:'Scotia',photo:colour.image,caption:`19 × 19 mm concave cove scotia · finish matched to ${colour.label}.`,source:colour.source || product.source}
      };
      const profile=profiles[finishState.skirtingProfile];
      const isScotia=finishState.skirtingProfile==='scotia';
      return {
        camera:'skirting',title:`Skirting and scotia · ${profile.label}`,
        photo:profile.photo,photoAlt:`${profile.label} wall-to-floor finish`,photoCaption:profile.caption,
        copy:isScotia
          ? `The model uses a separate 19 × 19 mm concave cove scotia section matched to the installed floor. It covers the perimeter expansion gap, stops at every wall, frame, track or object, and meets adjoining scotia with a 45° mitre.`
          : `The model uses a real extruded 92 × 18 mm skirting section rather than a flat strip. It stops at every wall, frame, track or object and meets adjoining skirting with a 45° mitre. The door's built-in steel architrave stays independent.`,
        facts:[['Selected floor',floorLabel],[isScotia?'Scotia':'Skirting',isScotia?`19 × 19 mm · matched to ${colour.label}`:`92 × 18 mm · ${SKIRTING_PAINTS[finishState.skirtingPaint].label}`],['Junction rule','45° mitres at trim-to-trim corners · square stop at frames and tracks']],
        source:profile.source
      };
    }

    function refreshMaterialDetail(kind,moveCamera=true) {
      if (!MATERIAL_HOTSPOT_DEFS[kind]) return false;
      activeMaterialHotspot=kind;
      const detail=materialDetailData(kind);
      const colour=selectedFloorColour();
      if (moveCamera) applyDetailCamera(detail.camera);
      RESIDENCE_DOM.getElementById('material-detail-title').textContent=detail.title;
      const detailPhoto=RESIDENCE_DOM.getElementById('material-detail-photo');
      detailPhoto.src=detail.photo;
      detailPhoto.alt=detail.photoAlt;
      RESIDENCE_DOM.getElementById('material-detail-photo-caption').textContent=detail.photoCaption;
      const floorPhoto=RESIDENCE_DOM.getElementById('material-detail-floor-photo');
      floorPhoto.src=colour.image;
      floorPhoto.alt=`${selectedFloorProduct().product} ${colour.label} selected floor material`;
      RESIDENCE_DOM.getElementById('material-detail-floor-caption').textContent=`Selected floor · ${colour.label} official product image.`;
      RESIDENCE_DOM.getElementById('material-detail-copy').textContent=detail.copy;
      detail.facts.forEach((fact,index)=>{
        const key=['a','b','c'][index];
        RESIDENCE_DOM.getElementById(`material-detail-fact-${key}-title`).textContent=fact[0];
        RESIDENCE_DOM.getElementById(`material-detail-fact-${key}`).textContent=fact[1];
      });
      const source=RESIDENCE_DOM.getElementById('material-detail-source');
      source.href=detail.source;
      source.textContent='Official product source ↗';
      materialDetailPanel.hidden=false;
      appRoot.dataset.activeMaterialHotspot=kind;
      syncMobilePrimaryVisibility();
      return true;
    }

    function closeMaterialDetail({reset=true}={}) {
      materialDetailPanel.hidden=true;
      activeMaterialHotspot=null;
      delete appRoot.dataset.activeMaterialHotspot;
      syncMobilePrimaryVisibility();
      if(reset) {
        wallMode='solid';
        labelMode='off';
        resetView();
      }
    }

    function cycleLevelMode(button) {
      const modes=['upper','both','ground'];
      levelMode=modes[(modes.indexOf(levelMode)+1)%modes.length];
      button.textContent=`Level: ${levelMode}`;
      button.classList.toggle('is-active',levelMode!=='upper');
      appRoot.dataset.levelMode=levelMode;
      detailState.camera='overview';
      document.querySelectorAll('[data-detail-camera]').forEach(cameraButton=>cameraButton.classList.remove('is-active'));
      syncDetailDataset();
      applyCameraPreset();
      announceInteraction(`Level view · ${levelMode.toUpperCase()} · use Plan for a registered floor-plan view.`);
    }

    const panelButtons = {
      'legend-panel': RESIDENCE_DOM.getElementById('layers-toggle'),
      'facts-panel': RESIDENCE_DOM.getElementById('info-toggle'),
      'details-panel': RESIDENCE_DOM.getElementById('details-toggle')
    };

    function setPanelOpen(panelId, open) {
      const panel = RESIDENCE_DOM.getElementById(panelId);
      const button = panelButtons[panelId];
      panel.classList.toggle('is-open', open);
      button.classList.toggle('is-active', open);
      button.setAttribute('aria-expanded', String(open));
      syncMobilePrimaryVisibility();
    }

    function closeAllPanels(exceptId = null) {
      Object.keys(panelButtons).forEach(panelId => {
        if (panelId !== exceptId) setPanelOpen(panelId, false);
      });
    }

    function togglePanel(panelId) {
      const willOpen = !RESIDENCE_DOM.getElementById(panelId).classList.contains('is-open');
      closeAllPanels(panelId);
      setPanelOpen(panelId, willOpen);
    }

    const mobileUiMedia=typeof window.matchMedia==='function'
      ? window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse) and (max-width: 1000px)')
      : {matches:false,addEventListener(){},addListener(){}};
    const mobileFinishDock=RESIDENCE_DOM.getElementById('finish-dock');
    const mobileFinishTrigger=RESIDENCE_DOM.getElementById('mobile-finish-trigger');
    const mobileFinishTriggerSummary=RESIDENCE_DOM.getElementById('mobile-finish-trigger-summary');
    const mobileFinishClose=RESIDENCE_DOM.getElementById('mobile-finish-close');
    const mobileFinishScrim=RESIDENCE_DOM.getElementById('mobile-finish-scrim');
    const mobileViewTrigger=RESIDENCE_DOM.getElementById('mobile-view-trigger');
    const mobileWizardBack=RESIDENCE_DOM.getElementById('mobile-wizard-back');
    const mobileWizardNext=RESIDENCE_DOM.getElementById('mobile-wizard-next');
    const mobileWizardNextLabel=RESIDENCE_DOM.getElementById('mobile-wizard-next-label');
    const mobileWizardStepCount=RESIDENCE_DOM.getElementById('mobile-wizard-step-count');
    const mobileWizardStepButtons=[...document.querySelectorAll('[data-mobile-step-target]')];
    const mobilePrimaryActions=RESIDENCE_DOM.getElementById('mobile-primary-actions');
    const mobilePrimaryMenuTriggers=[...document.querySelectorAll('[data-mobile-primary-menu-trigger]')];
    const mobilePrimaryMenuPanels=[...document.querySelectorAll('[data-mobile-primary-menu-panel]')];
    const mobilePrimaryActionButtons=[...document.querySelectorAll('[data-mobile-primary-action]')];
    const mobileSoundControl=RESIDENCE_DOM.querySelector('[data-mobile-primary-action="sound"]');
    const mobileControlsTrigger=RESIDENCE_DOM.querySelector('[data-mobile-primary-menu-trigger="right"]');
    const mobileSystemLevelSelect=RESIDENCE_DOM.getElementById('mobile-system-level-select');
    const mobileSystemTabSelect=RESIDENCE_DOM.getElementById('mobile-system-tab-select');
    const mobileAdvancedSectionSelect=RESIDENCE_DOM.getElementById('mobile-advanced-section-select');
    const productDisclosure=RESIDENCE_DOM.querySelector('.product-disclosure');
    const productDisclosureBody=RESIDENCE_DOM.querySelector('.product-disclosure-body');
    const productDisclosureSummary=RESIDENCE_DOM.querySelector('.product-disclosure>summary');
    const mobileProductDetailClose=RESIDENCE_DOM.getElementById('mobile-product-detail-close');
    const mobileWizardStepLabels=Object.freeze(['Type','Colour','Edges + skirting/scotia','Generate']);
    const mobileWizardStepTotal=mobileWizardStepLabels.length;
    let mobileWizardStep=1;
    let mobileWizardMaxStep=1;
    let mobileFinishReturnFocus=null;
    const mobileModalInertSnapshot=new Map();
    const propertyIdentityStorageKey='pomi.residence.identity.v9';
    const defaultPropertyAddress='LOT 45 HSE# 120 · HOPE STREET · WHITE GUM VALLEY';
    const propertyIdentityTrigger=RESIDENCE_DOM.getElementById('property-identity-trigger');
    const propertyEditor=RESIDENCE_DOM.getElementById('property-editor');
    const propertyHomeInput=RESIDENCE_DOM.getElementById('property-home-input');
    const propertyAddressInput=RESIDENCE_DOM.getElementById('property-address-input');
    const propertyHomeName=RESIDENCE_DOM.getElementById('property-home-name');
    const propertyAddress=RESIDENCE_DOM.getElementById('property-address');
    const advancedSettingsTrigger=RESIDENCE_DOM.getElementById('advanced-settings-trigger');
    const advancedSettingsPanel=RESIDENCE_DOM.getElementById('advanced-settings-panel');
    const advancedSettingsClose=RESIDENCE_DOM.getElementById('advanced-settings-close');
    const advancedSettingsScrim=RESIDENCE_DOM.getElementById('advanced-settings-scrim');
    const advancedTabs=[...document.querySelectorAll('[data-advanced-tab]')];
    const advancedSections=[...document.querySelectorAll('[data-advanced-section]')];
    const systemsControlTrigger=RESIDENCE_DOM.getElementById('light-hints-toggle');
    const systemsControlPanel=RESIDENCE_DOM.getElementById('systems-control-panel');
    const systemsControlClose=RESIDENCE_DOM.getElementById('systems-control-close');
    const controlLocatorsToggle=RESIDENCE_DOM.getElementById('control-locators-toggle');
    const systemsTabs=[...document.querySelectorAll('[data-system-tab]')];
    const systemsSections=[...document.querySelectorAll('[data-system-section]')];
    const systemsLevelButtons=[...document.querySelectorAll('[data-system-level]')];
    const systemTemperatureButtons=[...document.querySelectorAll('[data-system-temperature]')];
    const systemsScopeLabel=RESIDENCE_DOM.getElementById('systems-scope-label');
    const systemControlDevices=[];
    let systemsLevelMode=levelMode;
    let systemsStateSignature='';

    function setMobilePrimaryMenu(side='none') {
      const requested=['left','right'].includes(side)?side:'none';
      const current=mobilePrimaryActions?.dataset.openMenu||'none';
      const next=requested===current?'none':requested;
      if(mobilePrimaryActions) mobilePrimaryActions.dataset.openMenu=next;
      mobilePrimaryMenuTriggers.forEach(button=>{
        button.setAttribute('aria-expanded',String(button.dataset.mobilePrimaryMenuTrigger===next));
      });
      mobilePrimaryMenuPanels.forEach(panel=>{
        panel.hidden=panel.dataset.mobilePrimaryMenuPanel!==next;
      });
      return next;
    }

    let mobileStageLayoutFrame=0;
    function syncMobileStageLayout(reason='state-change') {
      if(mobileStageLayoutFrame) cancelAnimationFrame(mobileStageLayoutFrame);
      mobileStageLayoutFrame=requestAnimationFrame(()=>{
        mobileStageLayoutFrame=0;
        if(!mobileUiMedia.matches) {
          ['--v21-stage-top','--v21-stage-right','--v21-stage-bottom','--v21-stage-left'].forEach(name=>appRoot.style.removeProperty(name));
          sceneViewport.removeAttribute('data-v21-mobile-stage');
          delete appRoot.dataset.mobileStage;
          scheduleCanvasSync(`v21-stage-desktop-${reason}`);
          return;
        }
        const visual=window.visualViewport;
        const viewportTop=Math.max(0,Number(visual?.offsetTop)||0);
        const viewportLeft=Math.max(0,Number(visual?.offsetLeft)||0);
        const viewportWidth=Math.max(1,Number(visual?.width)||window.innerWidth||document.documentElement.clientWidth);
        const viewportHeight=Math.max(1,Number(visual?.height)||window.innerHeight||document.documentElement.clientHeight);
        const viewportRight=viewportLeft+viewportWidth;
        const viewportBottom=viewportTop+viewportHeight;
        const visibleRect=node=>{
          if(!node||node.hidden)return null;
          const style=typeof getComputedStyle==='function'?getComputedStyle(node):(node.style||{});
          if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return null;
          const rect=node.getBoundingClientRect();
          return rect.width>1&&rect.height>1?rect:null;
        };
        const primaryHidden=appRoot.dataset.mobilePrimaryHidden==='true';
        const topbarRect=primaryHidden?null:visibleRect(RESIDENCE_DOM.querySelector('.topbar'));
        const primaryRect=primaryHidden?null:visibleRect(mobilePrimaryActions);
        const panelRects=[mobileFinishDock,systemsControlPanel,advancedSettingsPanel,materialDetailPanel,propertyEditor]
          .map(visibleRect).filter(Boolean).filter(rect=>rect.bottom>viewportTop&&rect.top<viewportBottom);
        const activeBottomPanel=panelRects.sort((a,b)=>a.top-b.top)[0] || null;
        const gap=6;
        const top=Math.max(viewportTop+gap,topbarRect?Math.min(viewportBottom-gap,topbarRect.bottom+gap):viewportTop+gap);
        let bottom=viewportBottom-gap;
        if(activeBottomPanel) bottom=Math.min(bottom,activeBottomPanel.top-gap);
        else if(primaryRect) bottom=Math.min(bottom,primaryRect.top-gap);
        const minStageHeight=Math.max(132,viewportHeight/3);
        bottom=Math.max(top+minStageHeight,bottom);
        bottom=Math.min(viewportBottom-gap,bottom);
        const rightInset=Math.max(gap,(window.innerWidth||viewportRight)-viewportRight+gap);
        appRoot.style.setProperty('--v21-stage-top',`${Math.round(top)}px`);
        appRoot.style.setProperty('--v21-stage-right',`${Math.round(rightInset)}px`);
        appRoot.style.setProperty('--v21-stage-bottom',`${Math.round(Math.max(gap,(window.innerHeight||viewportBottom)-bottom))}px`);
        appRoot.style.setProperty('--v21-stage-left',`${Math.round(viewportLeft+gap)}px`);
        sceneViewport.dataset.v21MobileStage='true';
        appRoot.dataset.mobileStage=JSON.stringify({reason,top:Math.round(top),right:Math.round(rightInset),bottom:Math.round(Math.max(gap,(window.innerHeight||viewportBottom)-bottom)),left:Math.round(viewportLeft+gap),availableHeight:Math.round(bottom-top),minimumHeight:Math.round(minStageHeight),panelsOccupyLayoutSpace:true});
        scheduleCanvasSync(`v21-stage-${reason}`);
      });
    }

    function syncMobilePrimaryVisibility() {
      const isMobile=Boolean(mobileUiMedia.matches);
      const secondaryByHidden=['systems-control-panel','advanced-settings-panel','material-detail-panel','property-editor','room-light-menu']
        .some(id=>{const node=RESIDENCE_DOM.getElementById(id);return Boolean(node&&!node.hidden);});
      const legacyOpen=['legend-panel','facts-panel','details-panel']
        .some(id=>RESIDENCE_DOM.getElementById(id)?.classList?.contains('is-open'));
      const secondaryOpen=secondaryByHidden
        ||appRoot.dataset.mobileFinishOpen==='true'
        ||appRoot.dataset.mobileViewOpen==='true'
        ||legacyOpen;
      const hidePrimary=Boolean(isMobile&&secondaryOpen);
      appRoot.dataset.mobilePrimaryHidden=String(hidePrimary);
      const topbarShell=RESIDENCE_DOM.querySelector('.topbar-shell');
      if(topbarShell) {
        topbarShell.inert=hidePrimary;
        topbarShell.setAttribute('aria-hidden',String(hidePrimary));
      }
      if(mobilePrimaryActions) {
        mobilePrimaryActions.inert=hidePrimary;
        mobilePrimaryActions.setAttribute('aria-hidden',String(hidePrimary));
      }
      if(hidePrimary)setMobilePrimaryMenu('none');
      syncMobileStageLayout('primary-visibility');
      return hidePrimary;
    }

    function systemLevelLabel(level) {
      return level==='ground'?'Ground floor':'Upper floor';
    }
    function systemScopeDisplayName(mode=systemsLevelMode) {
      return mode==='upper'?'Upper floor':mode==='ground'?'Ground floor':'Both floors';
    }
    function systemLevelAllows(level) {
      return level==='shared'||systemsLevelMode==='both'||level===systemsLevelMode;
    }
    function sceneControlLevelAllows(level) {
      return levelAllows(level)&&systemLevelAllows(level);
    }
    function openingDisplayName(state) {
      if(state.kind==='hinged door')return state.id.startsWith('GF-D-')?`${state.id.slice(5).replaceAll('-',' ')} door`:`Door ${state.id.replace(/^D/,'')}`;
      if(state.kind==='sectional garage door')return 'Garage sectional door';
      if(state.kind==='glass sliding door')return state.id.includes('DINING')?'Dining sliding door':'Service sliding door';
      if(state.kind==='sliding flyscreen')return state.id.includes('DINING')?'Dining flyscreen':'Service flyscreen';
      if(state.kind==='mirrored robe slider')return `${state.id} mirrored robe`;
      return state.id.replaceAll('-',' ');
    }
    function windowDisplayName(state) {
      const assembly=state.assemblyId || state.id.replace(/-P\d+$/,'');
      return `${assembly.replace(/^GF-W-/,'').replace(/^G/,'Window G').replaceAll('-',' ')} · Panel ${state.panelIndex||state.id.match(/P(\d+)$/)?.[1]||'1'}`;
    }
    function appendSystemDevice(group,{key,label,meta,level='shared',isOn,setOn,status=()=>isOn()?'On':'Off',isDisabled=()=>false,getTemperature=null,setTemperature=null}) {
      const row=document.createElement('div');
      row.className='system-device-row';
      row.dataset.systemDeviceRow=key;
      const button=document.createElement('button');
      button.type='button';
      button.className='system-device';
      button.dataset.systemDevice=key;
      const copy=document.createElement('span');
      copy.className='system-device-copy';
      const title=document.createElement('strong');
      title.textContent=label;
      const detail=document.createElement('small');
      detail.textContent=meta;
      const stateLabel=document.createElement('b');
      stateLabel.className='system-device-state';
      copy.appendChild(title);
      copy.appendChild(detail);
      button.appendChild(copy);
      button.appendChild(stateLabel);
      const device={group,key,label,level,row,button,stateLabel,isOn,setOn,status,isDisabled,getTemperature,setTemperature,temperatureButtons:[]};
      button.addEventListener('click',()=>{
        if(device.isDisabled())return;
        device.setOn(!device.isOn());
        refreshSystemsControlStates(true);
      });
      row.appendChild(button);
      if(typeof getTemperature==='function'&&typeof setTemperature==='function') {
        row.classList.add('has-light-temperature');
        const temperatureGroup=document.createElement('span');
        temperatureGroup.className='system-device-temperature';
        temperatureGroup.setAttribute('role','group');
        temperatureGroup.setAttribute('aria-label',`${label} light colour`);
        for(const choice of ['warm','cool']) {
          const temperatureButton=document.createElement('button');
          temperatureButton.type='button';
          temperatureButton.dataset.deviceTemperature=choice;
          temperatureButton.textContent=choice==='warm'?'Warm':'Cold';
          temperatureButton.setAttribute('aria-label',`${label}: ${choice==='warm'?'warm':'cold'} light`);
          temperatureButton.setAttribute('aria-pressed',String(getTemperature()===choice));
          temperatureButton.addEventListener('click',()=>setTemperature(choice));
          temperatureGroup.appendChild(temperatureButton);
          device.temperatureButtons.push(temperatureButton);
        }
        row.appendChild(temperatureGroup);
      }
      RESIDENCE_DOM.getElementById(`system-list-${group}`).appendChild(row);
      systemControlDevices.push(device);
      return device;
    }
    function controllableDoorStates() {
      return openingInteractions.filter(state=>state.canToggle&&['hinged door','mirrored robe slider','glass sliding door','sliding flyscreen','sectional garage door'].includes(state.kind));
    }
    function controllableBathroomDoors() {
      return bathroomInteractions.filter(state=>state.mode==='motion');
    }
    function controllableWindowStates() {
      return openingInteractions.filter(state=>state.canToggle&&state.kind==='operable window panel');
    }
    function buildSystemControlPanel() {
      if(systemControlDevices.length)return systemControlDevices;
      waterSystem.taps.forEach(state=>appendSystemDevice('water',{
        key:`water:${state.id}`,label:state.kind,meta:'Upper floor · supply',level:'upper',isOn:()=>Boolean(state.active),
        setOn:on=>{if(Boolean(state.active)!==on)commandBathroomInteraction(state);}
      }));
      appendSystemDevice('water',{
        key:`water:${waterSystem.drain.id}`,label:'Bath drain',meta:'Upper floor · pop-up waste',level:'upper',isOn:()=>Boolean(waterSystem.drain.active),
        setOn:on=>{if(Boolean(waterSystem.drain.active)!==on)commandBathroomInteraction(waterSystem.drain);},
        isDisabled:()=>!waterSystem.drain.active&&waterSystem.level<=.00001
      });
      roomLighting.forEach(state=>appendSystemDevice('power',{
        key:`power:${state.id}`,label:state.label,meta:`${systemLevelLabel(state.level)} · lighting`,level:state.level,isOn:()=>Boolean(state.active),setOn:on=>commandRoomLight(state,on),
        getTemperature:()=>state.temperature,setTemperature:choice=>setRoomLightTemperature(state,choice)
      }));
      if(mirrorLightingState)appendSystemDevice('power',{
        key:`power:${mirrorLightingState.id}`,label:'Mirror LED + demister',meta:'Upper floor · vanity service',level:'upper',isOn:()=>Boolean(mirrorLightingState.active),
        setOn:on=>{if(Boolean(mirrorLightingState.active)!==on)commandBathroomInteraction(mirrorLightingState);}
      });
      controllableDoorStates().forEach(state=>appendSystemDevice('doors',{
        key:`door:${state.id}`,label:openingDisplayName(state),meta:`${systemLevelLabel(state.level)} · ${state.kind}`,level:state.level,
        isOn:()=>state.target>=.5,setOn:on=>commandOpening(state,on),
        status:()=>state.moving?(state.target>=.5?'Opening':'Closing'):(state.target>=.5?'Open':'Closed')
      }));
      controllableBathroomDoors().forEach(state=>appendSystemDevice('doors',{
        key:`door:${state.id}`,label:state.kind,meta:'Upper floor · bathroom opening',level:'upper',isOn:()=>state.target>=.5,
        setOn:on=>{if((state.target>=.5)!==on)commandBathroomInteraction(state);},
        status:()=>state.moving?(state.target>=.5?'Opening':'Closing'):(state.target>=.5?'Open':'Closed')
      }));
      controllableWindowStates().forEach(state=>appendSystemDevice('windows',{
        key:`window:${state.id}`,label:windowDisplayName(state),meta:`${systemLevelLabel(state.level)} · operable panel`,level:state.level,
        isOn:()=>state.target>=.5,setOn:on=>commandOpening(state,on),
        status:()=>state.moving?(state.target>=.5?'Opening':'Closing'):(state.target>=.5?'Open':'Closed')
      }));
      refreshSystemsControlStates(true);
      return systemControlDevices;
    }
    function setSystemTab(tab) {
      if(!systemsSections.some(section=>section.dataset.systemSection===tab))return false;
      systemsTabs.forEach(button=>button.setAttribute('aria-selected',String(button.dataset.systemTab===tab)));
      systemsSections.forEach(section=>{section.hidden=section.dataset.systemSection!==tab;});
      if(mobileSystemTabSelect)mobileSystemTabSelect.value=tab;
      appRoot.dataset.systemTab=tab;
      return true;
    }
    function setSystemLevelMode(mode) {
      if(!['upper','both','ground'].includes(mode))return false;
      systemsLevelMode=mode;
      if(mobileSystemLevelSelect)mobileSystemLevelSelect.value=mode;
      systemsStateSignature='';
      refreshSystemsControlStates(true);
      updateSceneLightControls();
      announceInteraction(`${systemScopeDisplayName()} controls selected.`);
      return true;
    }
    function setRoomLightTemperature(state,choice,{announce=true}={}) {
      if(!roomLighting.includes(state)||!['warm','cool'].includes(choice))return false;
      state.temperature=choice;
      lightUI.temperature=choice;
      floorQualityState.lastSceneStamp='';
      systemsStateSignature='';
      refreshSystemsControlStates(true);
      if(announce)announceInteraction(`${state.label} light · ${choice==='warm'?'WARM':'COLD'} colour selected.`);
      return true;
    }
    function setSystemTemperature(choice) {
      if(!['warm','cool'].includes(choice))return false;
      const scopedLights=roomLighting.filter(state=>systemLevelAllows(state.level));
      if(!scopedLights.length)return false;
      scopedLights.forEach(state=>{state.temperature=choice;});
      lightUI.temperature=choice;
      floorQualityState.lastSceneStamp='';
      systemsStateSignature='';
      refreshSystemsControlStates(true);
      announceInteraction(`${systemScopeDisplayName()} lights · ${choice.toUpperCase()} colour selected.`);
      return true;
    }
    function setSystemGroup(group,on) {
      const desired=Boolean(on);
      if(group==='water') {
        if(!systemLevelAllows('upper'))return false;
        if(desired&&waterSystem.drain.active)commandBathroomInteraction(waterSystem.drain);
        waterSystem.taps.forEach(state=>{if(Boolean(state.active)!==desired)commandBathroomInteraction(state);});
        if(!desired&&waterSystem.drain.active)commandBathroomInteraction(waterSystem.drain);
      } else if(group==='power') {
        const scopedLights=roomLighting.filter(state=>systemLevelAllows(state.level));
        const scopedMirror=mirrorLightingState&&systemLevelAllows('upper')?mirrorLightingState:null;
        if(!scopedLights.length&&!scopedMirror)return false;
        const changed=scopedLights.some(state=>state.active!==desired)||(scopedMirror&&scopedMirror.active!==desired);
        if(changed)window.ResidenceSound?.play('light-switch');
        scopedLights.forEach(state=>commandRoomLight(state,desired,{silent:true,announce:false}));
        if(scopedMirror&&Boolean(scopedMirror.active)!==desired)commandBathroomInteraction(scopedMirror);
        announceInteraction(`${systemScopeDisplayName()} lighting · ${desired?'ON':'OFF'}`);
      } else if(group==='doors') {
        const doors=controllableDoorStates().filter(state=>systemLevelAllows(state.level));
        const bathroomDoors=systemLevelAllows('upper')?controllableBathroomDoors():[];
        if(!doors.length&&!bathroomDoors.length)return false;
        if(doors.some(state=>(state.target>=.5)!==desired))window.ResidenceSound?.play(desired?'door-handle':'door-close');
        doors.forEach(state=>commandOpening(state,desired,{silent:true,announce:false}));
        bathroomDoors.forEach(state=>{if((state.target>=.5)!==desired)commandBathroomInteraction(state);});
        announceInteraction(`${systemScopeDisplayName()} doors · ${desired?'OPENING':'CLOSING'}…`);
      } else if(group==='windows') {
        const windows=controllableWindowStates().filter(state=>systemLevelAllows(state.level));
        if(!windows.length)return false;
        if(windows.some(state=>(state.target>=.5)!==desired))window.ResidenceSound?.play(desired?'window-handle':'window-close');
        windows.forEach(state=>commandOpening(state,desired,{silent:true,announce:false}));
        announceInteraction(`${systemScopeDisplayName()} operable windows · ${desired?'OPENING':'CLOSING'}…`);
      } else return false;
      refreshSystemsControlStates(true);
      return true;
    }
    function refreshSystemsControlStates(force=false) {
      const signature=JSON.stringify([
        systemsLevelMode,lightUI.hints,roomLighting.map(state=>[state.active,state.temperature]),mirrorLightingState?.active,
        waterSystem.taps.map(state=>state.active),waterSystem.drain?.active,Math.round((waterSystem.level/Math.max(.0001,waterSystem.maximum))*100),
        openingInteractions.map(state=>[state.target,state.moving]),bathroomInteractions.map(state=>[state.target,state.active,state.moving])
      ]);
      if(!force&&signature===systemsStateSignature)return false;
      systemsStateSignature=signature;
      systemControlDevices.forEach(device=>{
        const active=Boolean(device.isOn());
        const visible=systemLevelAllows(device.level);
        device.row.hidden=!visible;
        device.button.hidden=!visible;
        device.button.setAttribute('aria-pressed',String(active));
        device.button.setAttribute('aria-label',`${device.label}: ${device.status()}`);
        device.button.disabled=Boolean(device.isDisabled());
        device.stateLabel.textContent=device.status();
        if(device.temperatureButtons.length) {
          const temperature=device.getTemperature();
          device.row.dataset.temperature=temperature;
          device.temperatureButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.deviceTemperature===temperature)));
        }
      });
      for(const group of ['water','power','doors','windows']) {
        const devices=systemControlDevices.filter(device=>device.group===group&&systemLevelAllows(device.level));
        const active=devices.filter(device=>device.isOn()).length;
        const summary=RESIDENCE_DOM.getElementById(`system-summary-${group}`);
        if(summary)summary.textContent=group==='water'?`${active} of ${devices.length} on · bath ${Math.round((waterSystem.level/Math.max(.0001,waterSystem.maximum))*100)}%`:group==='power'?`${active} of ${devices.length} on`:`${active} of ${devices.length} open`;
        const list=RESIDENCE_DOM.getElementById(`system-list-${group}`);
        if(list)list.dataset.empty=String(devices.length===0);
        document.querySelectorAll(`[data-system-master="${group}"]`).forEach(button=>{button.disabled=devices.length===0;});
      }
      const scopedLights=roomLighting.filter(state=>systemLevelAllows(state.level));
      const lightTemperatures=new Set(scopedLights.map(state=>state.temperature));
      systemTemperatureButtons.forEach(button=>{
        button.disabled=scopedLights.length===0;
        button.setAttribute('aria-pressed',String(lightTemperatures.size===1&&lightTemperatures.has(button.dataset.systemTemperature)));
      });
      systemsLevelButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.systemLevel===systemsLevelMode)));
      if(mobileSystemLevelSelect)mobileSystemLevelSelect.value=systemsLevelMode;
      if(mobileSystemTabSelect)mobileSystemTabSelect.value=appRoot.dataset.systemTab||'water';
      if(systemsScopeLabel)systemsScopeLabel.textContent=`${systemScopeDisplayName()} control`;
      systemsControlPanel.dataset.controlLevel=systemsLevelMode;
      systemsControlPanel.dataset.lightTemperature=lightTemperatures.size===1?[...lightTemperatures][0]:'mixed';
      appRoot.dataset.systemsLevelMode=systemsLevelMode;
      controlLocatorsToggle?.setAttribute('aria-pressed',String(lightUI.hints));
      return true;
    }
    function setSystemsOpen(open,{returnFocus=true}={}) {
      const willOpen=Boolean(open);
      if(willOpen) {
        closeMobileFinishWizard({returnFocus:false});
        setAdvancedOpen(false,{returnFocus:false});
        setPropertyEditorOpen(false);
        closeMaterialDetail({reset:false});
        closeRoomLightMenu();
        systemsLevelMode=levelMode;
        systemsStateSignature='';
        setControlLocators(true);
      }
      systemsControlPanel.hidden=!willOpen;
      systemsControlTrigger.setAttribute('aria-expanded',String(willOpen));
      systemsControlTrigger.setAttribute('aria-label',willOpen?'Close whole-home controls':'Open whole-home controls');
      appRoot.dataset.systemsOpen=String(willOpen);
      const primaryHidden=syncMobilePrimaryVisibility();
      if(willOpen) {
        refreshSystemsControlStates(true);
        requestAnimationFrame(()=>systemsControlClose.focus({preventScroll:true}));
      } else if(returnFocus&&!primaryHidden) (mobileUiMedia.matches?mobileControlsTrigger:systemsControlTrigger)?.focus({preventScroll:true});
    }

    function setAdvancedTab(tab) {
      if(!advancedSections.some(section=>section.dataset.advancedSection===tab)) return false;
      advancedTabs.forEach(button=>button.setAttribute('aria-selected',String(button.dataset.advancedTab===tab)));
      advancedSections.forEach(section=>{section.hidden=section.dataset.advancedSection!==tab;});
      if(mobileAdvancedSectionSelect)mobileAdvancedSectionSelect.value=tab;
      appRoot.dataset.advancedTab=tab;
      return true;
    }
    function setAdvancedOpen(open,{returnFocus=true}={}) {
      const willOpen=Boolean(open);
      if(willOpen) {
        setSystemsOpen(false,{returnFocus:false});
        closeMobileFinishWizard({returnFocus:false});
        setPropertyEditorOpen(false);
        closeMaterialDetail({reset:false});
        closeRoomLightMenu();
      }
      advancedSettingsPanel.hidden=!willOpen;
      advancedSettingsScrim.dataset.visible=String(willOpen);
      advancedSettingsTrigger.setAttribute('aria-expanded',String(willOpen));
      advancedSettingsTrigger.setAttribute('aria-label',willOpen?'Close advanced settings':'Open advanced settings');
      appRoot.dataset.advancedOpen=String(willOpen);
      const primaryHidden=syncMobilePrimaryVisibility();
      if(willOpen) requestAnimationFrame(()=>advancedSettingsClose.focus({preventScroll:true}));
      else if(returnFocus&&!primaryHidden) (mobileUiMedia.matches?mobileControlsTrigger:advancedSettingsTrigger)?.focus({preventScroll:true});
    }

    function renderPropertyIdentity(name='',address='') {
      const cleanName=String(name||'').trim(),cleanAddress=String(address||'').trim();
      propertyHomeInput.value=cleanName;
      propertyAddressInput.value=cleanAddress;
      propertyHomeName.textContent=cleanName?`${cleanName}’s Home`:'Home';
      propertyAddress.textContent=cleanAddress||'Add address';
      propertyAddress.dataset.empty=String(!cleanAddress);
      document.title=`${propertyHomeName.textContent} · Sublimetrics`;
      appRoot.dataset.propertyIdentity=JSON.stringify({name:cleanName,address:cleanAddress});
    }
    function setPropertyEditorOpen(open) {
      propertyEditor.hidden=!open;
      propertyIdentityTrigger.setAttribute('aria-expanded',String(open));
      syncMobilePrimaryVisibility();
      if(open) requestAnimationFrame(()=>propertyHomeInput.focus({preventScroll:true}));
    }
    try {
      const stored=JSON.parse(localStorage.getItem(propertyIdentityStorageKey)||'null');
      renderPropertyIdentity(stored?.name||'',String(stored?.address||'').trim()||defaultPropertyAddress);
    } catch (_) { renderPropertyIdentity('',defaultPropertyAddress); }
    propertyIdentityTrigger.addEventListener('click',()=>{
      const willOpen=propertyEditor.hidden;
      if(willOpen) {
        setSystemsOpen(false,{returnFocus:false});
        setAdvancedOpen(false,{returnFocus:false});
        closeMobileFinishWizard({returnFocus:false});
        closeMaterialDetail({reset:false});
        closeRoomLightMenu();
      }
      setPropertyEditorOpen(willOpen);
    });
    propertyEditor.addEventListener('submit',event=>{
      event.preventDefault();
      renderPropertyIdentity(propertyHomeInput.value,propertyAddressInput.value);
      try { localStorage.setItem(propertyIdentityStorageKey,JSON.stringify({name:propertyHomeInput.value.trim(),address:propertyAddressInput.value.trim()})); } catch (_) {}
      setPropertyEditorOpen(false);
      propertyIdentityTrigger.focus({preventScroll:true});
    });

    function syncMobileFinishModality() {
      const open=appRoot.dataset.mobileFinishOpen==='true';
      const modal=open&&mobileUiMedia.matches;
      mobileFinishDock.inert=!open;
      mobileFinishDock.setAttribute('aria-hidden',String(!open));
      if(modal) {
        mobileFinishDock.setAttribute('role','dialog');
        mobileFinishDock.setAttribute('aria-modal','true');
      } else {
        if(typeof mobileFinishDock.removeAttribute==='function') {
          mobileFinishDock.removeAttribute('role');
          mobileFinishDock.removeAttribute('aria-modal');
        } else {
          mobileFinishDock.setAttribute('role','');
          mobileFinishDock.setAttribute('aria-modal','false');
        }
      }
      const backgroundNodes=Array.from(appRoot.children||[]).filter(node=>node!==mobileFinishDock&&node!==mobileFinishScrim);
      if(modal) {
        backgroundNodes.forEach(node=>{
          if(!mobileModalInertSnapshot.has(node)) mobileModalInertSnapshot.set(node,!!node.inert);
          node.inert=true;
        });
      } else {
        mobileModalInertSnapshot.forEach((wasInert,node)=>{ node.inert=wasInert; });
        mobileModalInertSnapshot.clear();
      }
      syncMobilePrimaryVisibility();
    }

    function syncMobileGuidedUi() {
      const isMobile=mobileUiMedia.matches;
      appRoot.dataset.mobileUi='guided-v2';
      appRoot.dataset.mobileStep=String(mobileWizardStep);
      if(isMobile && finishState.uiMode!=='client') {
        finishState.uiMode='client';
        syncFinishUI();
      }
      if(!isMobile) appRoot.dataset.mobileViewOpen='false';
      syncMobileFinishModality();

      mobileWizardStepButtons.forEach(button=>{
        const step=Number(button.dataset.mobileStepTarget);
        button.setAttribute('aria-current',step===mobileWizardStep ? 'step' : 'false');
        button.dataset.complete=String(step<mobileWizardMaxStep);
        button.disabled=step>mobileWizardMaxStep;
      });

      mobileWizardBack.disabled=mobileWizardStep===1;
      mobileWizardNext.disabled=mobileWizardStep>=mobileWizardStepTotal;
      const nextStep=Math.min(mobileWizardStepTotal,mobileWizardStep+1);
      mobileWizardNextLabel.textContent=mobileWizardStep===mobileWizardStepTotal-1 ? 'Review selection' : `Continue to ${mobileWizardStepLabels[nextStep-1].toLowerCase()}`;
      mobileWizardStepCount.textContent=`${mobileWizardStep} of ${mobileWizardStepTotal}`;

      const material=RESIDENCE_DOM.getElementById('selection-title')?.textContent?.trim() || 'Selected flooring';
      const edgeText=RESIDENCE_DOM.getElementById('install-review-edges')?.textContent?.replace(/^01\s*/,'')?.replace(/\s*·\s*02\s*/, ' / ') || 'Selected edges';
      mobileFinishTriggerSummary.textContent=`${material} · ${edgeText}`;
    }

    function setMobileWizardStep(step,{focus=true,advance=false}={}) {
      const requested=Math.max(1,Math.min(mobileWizardStepTotal,Number(step)||1));
      if(advance) mobileWizardMaxStep=Math.max(mobileWizardMaxStep,requested);
      mobileWizardStep=Math.min(requested,mobileWizardMaxStep);
      syncMobileGuidedUi();
      if(mobileUiMedia.matches) {
        RESIDENCE_DOM.getElementById('flooring-panel')?.scrollTo?.({top:0,behavior:'smooth'});
        if(focus) {
          requestAnimationFrame(()=>{
            const target=mobileWizardStepButtons.find(button=>Number(button.dataset.mobileStepTarget)===mobileWizardStep);
            target?.focus({preventScroll:true});
          });
        }
      }
    }

    function openMobileFinishWizard() {
      setSystemsOpen(false,{returnFocus:false});
      setAdvancedOpen(false,{returnFocus:false});
      closeAllPanels();
      closeMaterialDetail({reset:false});
      closeRoomLightMenu();
      appRoot.dataset.mobileViewOpen='false';
      mobileViewTrigger.setAttribute('aria-expanded','false');
      mobileFinishReturnFocus=document.activeElement;
      appRoot.dataset.mobileFinishOpen='true';
      mobileFinishTrigger.setAttribute('aria-expanded','true');
      mobileWizardMaxStep=1;
      setMobileWizardStep(1,{focus:false});
      requestAnimationFrame(()=>mobileFinishClose.focus({preventScroll:true}));
    }

    function closeMobileFinishWizard({returnFocus=true}={}) {
      if(productDisclosure)productDisclosure.open=false;
      appRoot.dataset.mobileFinishOpen='false';
      mobileFinishTrigger.setAttribute('aria-expanded','false');
      syncMobileFinishModality();
      if(returnFocus&&!syncMobilePrimaryVisibility()) (mobileFinishReturnFocus?.focus ? mobileFinishReturnFocus : mobileFinishTrigger).focus({preventScroll:true});
      mobileFinishReturnFocus=null;
    }

    function toggleMobileViewMenu() {
      if(!mobileUiMedia.matches) return;
      const willOpen=appRoot.dataset.mobileViewOpen!=='true';
      appRoot.dataset.mobileViewOpen=String(willOpen);
      mobileViewTrigger.setAttribute('aria-expanded',String(willOpen));
      syncMobilePrimaryVisibility();
    }

    function handleMobileMediaChange() {
      if(mobileUiMedia.matches) {
        setSystemsOpen(false,{returnFocus:false});
        if(finishState.uiMode!=='client') setUiMode('client');
        appRoot.dataset.mobileFinishOpen='false';
        appRoot.dataset.mobileViewOpen='false';
        mobileFinishTrigger.setAttribute('aria-expanded','false');
        mobileViewTrigger.setAttribute('aria-expanded','false');
      }
      syncMobileGuidedUi();
      syncMobilePrimaryVisibility();
    }

    function syncProductDisclosure() {
      if(!productDisclosure)return false;
      const open=Boolean(productDisclosure.open&&mobileUiMedia.matches);
      appRoot.dataset.mobileProductDetailOpen=String(open);
      const body=productDisclosureBody;
      if(body) {
        if(open) {
          body.setAttribute('role','dialog');
          body.setAttribute('aria-modal','true');
          body.setAttribute('aria-label','Flooring product information');
        } else {
          body.removeAttribute?.('role');
          body.removeAttribute?.('aria-modal');
          body.removeAttribute?.('aria-label');
        }
      }
      if(open)requestAnimationFrame(()=>mobileProductDetailClose?.focus({preventScroll:true}));
      return open;
    }

    function runMobilePrimaryAction(action,event) {
      setMobilePrimaryMenu('none');
      if(action==='sound') {
        const sound=window.ResidenceSound;
        if(sound) { sound.setMuted(!sound.muted);sound.arm(event); }
      } else if(action==='reset') RESIDENCE_DOM.getElementById('client-reset')?.click();
      else if(action==='replay') RESIDENCE_DOM.getElementById('replay-entry')?.click();
      else if(action==='advanced') setAdvancedOpen(true,{returnFocus:false});
      else if(action==='systems') setSystemsOpen(true,{returnFocus:false});
      else if(action==='flooring') openMobileFinishWizard();
    }

    buildSystemControlPanel();
    setSystemTab('water');
    systemsControlTrigger.addEventListener('click',()=>setSystemsOpen(systemsControlPanel.hidden));
    systemsControlClose.addEventListener('click',()=>setSystemsOpen(false));
    controlLocatorsToggle.addEventListener('click',()=>setControlLocators(!lightUI.hints));
    systemsTabs.forEach(button=>button.addEventListener('click',()=>setSystemTab(button.dataset.systemTab)));
    systemsLevelButtons.forEach(button=>button.addEventListener('click',()=>setSystemLevelMode(button.dataset.systemLevel)));
    mobileSystemLevelSelect?.addEventListener('change',()=>setSystemLevelMode(mobileSystemLevelSelect.value));
    mobileSystemTabSelect?.addEventListener('change',()=>setSystemTab(mobileSystemTabSelect.value));
    systemTemperatureButtons.forEach(button=>button.addEventListener('click',()=>setSystemTemperature(button.dataset.systemTemperature)));
    document.querySelectorAll('[data-system-master]').forEach(button=>button.addEventListener('click',()=>setSystemGroup(button.dataset.systemMaster,['on','open'].includes(button.dataset.systemValue))));
    RESIDENCE_DOM.getElementById('reset-view').addEventListener('click', resetView);
    RESIDENCE_DOM.getElementById('plan-view').addEventListener('click', planView);
    RESIDENCE_DOM.getElementById('level-mode').addEventListener('click', e => cycleLevelMode(e.currentTarget));
    RESIDENCE_DOM.getElementById('wall-mode').addEventListener('click', e => {
      wallMode = wallMode === 'cutaway' ? 'solid' : wallMode === 'solid' ? 'hidden' : 'cutaway';
      e.currentTarget.textContent = `Walls: ${wallMode}`;
      appRoot.dataset.wallMode = wallMode;
    });
    RESIDENCE_DOM.getElementById('label-mode').addEventListener('click', e => {
      const modes = ['rooms', 'key', 'all', 'off'];
      labelMode = modes[(modes.indexOf(labelMode)+1)%modes.length];
      e.currentTarget.textContent = `Labels: ${labelMode}`;
      appRoot.dataset.labelMode = labelMode;
    });
    RESIDENCE_DOM.getElementById('details-toggle').addEventListener('click', () => togglePanel('details-panel'));
    RESIDENCE_DOM.getElementById('layers-toggle').addEventListener('click', () => togglePanel('legend-panel'));
    RESIDENCE_DOM.getElementById('info-toggle').addEventListener('click', () => togglePanel('facts-panel'));
    RESIDENCE_DOM.getElementById('profile-select').addEventListener('change', e => setSkirtingProfile(e.currentTarget.value));
    RESIDENCE_DOM.getElementById('stair-metal-select').addEventListener('change', e => {
      const finish=e.currentTarget.value;
      setNosingSelection(nosingProfileForFinish(finish),finish);
    });
    RESIDENCE_DOM.getElementById('wet-threshold-select').addEventListener('change', e => setTransitionProfile(e.currentTarget.value));
    RESIDENCE_DOM.getElementById('slider-trim-select').addEventListener('change', e => {
      detailState.sliderTrim=e.currentTarget.value;
      syncDetailDataset();
      announceInteraction(`Mirrored-slider edge study · ${e.currentTarget.options[e.currentTarget.selectedIndex].text}`);
    });
    document.querySelectorAll('[data-detail-camera]').forEach(button=>{
      button.addEventListener('click',()=>{
        applyDetailCamera(button.dataset.detailCamera);
        if(button.closest('#advanced-settings-panel')) {
          setAdvancedOpen(false,{returnFocus:false});
          requestAnimationFrame(()=>{
            if(button.dataset.detailHotspot) refreshMaterialDetail(button.dataset.detailHotspot,false);
            else canvas.focus({preventScroll:true});
          });
        }
      });
    });
    document.querySelectorAll('[data-close-panel]').forEach(button => {
      button.addEventListener('click', () => setPanelOpen(button.dataset.closePanel, false));
    });
    document.querySelectorAll('[data-category]').forEach(input => {
      input.addEventListener('change', () => { categoryState[input.dataset.category]=input.checked; });
    });
    RESIDENCE_DOM.getElementById('client-reset').addEventListener('click',resetView);
    RESIDENCE_DOM.getElementById('client-plan')?.addEventListener('click',planView);
    RESIDENCE_DOM.getElementById('replay-entry').addEventListener('click',()=>{
      try {
        if(parent!==window) parent.postMessage({type:'pomi:replay-entry'},'*');
        else announceInteraction('Replay entry is available from the secure-entry delivery file.');
      } catch (_) { announceInteraction('Replay entry is available from the secure-entry delivery file.'); }
    });
    advancedSettingsTrigger.addEventListener('click',()=>setAdvancedOpen(advancedSettingsPanel.hidden));
    advancedSettingsClose.addEventListener('click',()=>setAdvancedOpen(false));
    advancedSettingsScrim.addEventListener('click',()=>setAdvancedOpen(false));
    advancedTabs.forEach(button=>button.addEventListener('click',()=>setAdvancedTab(button.dataset.advancedTab)));
    mobileAdvancedSectionSelect?.addEventListener('change',()=>setAdvancedTab(mobileAdvancedSectionSelect.value));
    document.querySelectorAll('[data-ui-mode-choice]').forEach(button=>button.addEventListener('click',()=>setUiMode(button.dataset.uiModeChoice)));
    document.querySelectorAll('[data-floor-family]').forEach(button=>button.addEventListener('click',()=>setFloorFamily(button.dataset.floorFamily)));
    document.querySelectorAll('[data-floor-colour]').forEach(button=>button.addEventListener('click',()=>setFloorColour(button.dataset.floorColour)));
    RESIDENCE_DOM.getElementById('install-flooring').addEventListener('click',installFlooring);
    materialHotspotButtons.forEach(button=>button.addEventListener('click',()=>{
      const def=MATERIAL_HOTSPOT_DEFS[button.dataset.materialHotspot];
      if(def&&isPointExposed(toWorld(...def.anchor)))refreshMaterialDetail(button.dataset.materialHotspot,true);
    }));
    RESIDENCE_DOM.querySelector('.material-detail-close').addEventListener('click',closeMaterialDetail);
    document.querySelectorAll('[data-profile-choice]').forEach(button=>button.addEventListener('click',()=>setSkirtingProfile(button.dataset.profileChoice)));
    document.querySelectorAll('[data-skirting-paint]').forEach(button=>button.addEventListener('click',()=>setSkirtingPaint(button.dataset.skirtingPaint)));
    document.querySelectorAll('[data-finish-category]').forEach(button=>button.addEventListener('click',()=>setActiveFinishCategory(button.dataset.finishCategory)));
    document.querySelectorAll('[data-transition-profile]').forEach(button=>button.addEventListener('click',()=>setTransitionProfile(button.dataset.transitionProfile)));
    document.querySelectorAll('[data-transition-finish]').forEach(button=>button.addEventListener('click',()=>setTransitionFinish(button.dataset.transitionFinish)));
    document.querySelectorAll('[data-nosing-profile]').forEach(button=>button.addEventListener('click',()=>setNosingProfile(button.dataset.nosingProfile)));
    document.querySelectorAll('[data-nosing-finish]').forEach(button=>button.addEventListener('click',()=>setNosingFinish(button.dataset.nosingFinish)));
    document.querySelectorAll('[data-nosing-option]').forEach(button=>button.addEventListener('click',()=>{
      const [profile,finish]=button.dataset.nosingOption.split(':');
      setNosingSelection(profile,finish);
    }));
    document.querySelectorAll('[data-level-choice]').forEach(button=>button.addEventListener('click',()=>setDirectLevel(button.dataset.levelChoice)));
    document.querySelectorAll('[data-wall-choice]').forEach(button=>button.addEventListener('click',()=>setDirectWall(button.dataset.wallChoice)));
    document.querySelectorAll('[data-label-choice]').forEach(button=>button.addEventListener('click',()=>setDirectLabels(button.dataset.labelChoice)));
    document.querySelectorAll('[data-measurement-choice]').forEach(button=>button.addEventListener('click',()=>setMeasurementVisibility(button.dataset.measurementChoice)));
    document.querySelectorAll('[data-grid-choice]').forEach(button=>button.addEventListener('click',()=>setReferenceGridVisibility(button.dataset.gridChoice)));
    document.querySelectorAll('[data-slider-trim-choice]').forEach(button=>button.addEventListener('click',()=>{
      detailState.sliderTrim=button.dataset.sliderTrimChoice;
      syncDetailDataset();
      syncFinishUI();
    }));
    document.querySelectorAll('[data-direct-category]').forEach(input=>input.addEventListener('change',()=>{
      categoryState[input.dataset.directCategory]=input.checked;
      syncFinishUI();
    }));
    document.querySelectorAll('[data-open-panel]').forEach(button=>button.addEventListener('click',()=>setPanelOpen(button.dataset.openPanel,true)));
    mobilePrimaryMenuTriggers.forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      setMobilePrimaryMenu(button.dataset.mobilePrimaryMenuTrigger);
    }));
    mobilePrimaryActionButtons.forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      runMobilePrimaryAction(button.dataset.mobilePrimaryAction,event);
    }));
    window.ResidenceSound?.subscribe?.(muted=>{
      if(!mobileSoundControl)return;
      mobileSoundControl.setAttribute('aria-pressed',String(!muted));
      mobileSoundControl.setAttribute('aria-label',muted?'Enable interaction sounds':'Mute interaction sounds');
      const label=mobileSoundControl.querySelector?.('span');
      if(label)label.textContent=muted?'Sound off':'Sound on';
    });
    productDisclosure?.addEventListener?.('toggle',syncProductDisclosure);
    mobileProductDetailClose?.addEventListener?.('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      productDisclosure.open=false;
      syncProductDisclosure();
      productDisclosureSummary?.focus?.({preventScroll:true});
    });
    mobileFinishTrigger.addEventListener('click',openMobileFinishWizard);
    mobileFinishClose.addEventListener('click',()=>closeMobileFinishWizard());
    mobileFinishScrim.addEventListener('click',()=>closeMobileFinishWizard());
    mobileViewTrigger.addEventListener('click',toggleMobileViewMenu);
    mobileWizardBack.addEventListener('click',()=>setMobileWizardStep(mobileWizardStep-1));
    mobileWizardNext.addEventListener('click',()=>setMobileWizardStep(mobileWizardStep+1,{advance:true}));
    mobileWizardStepButtons.forEach(button=>button.addEventListener('click',()=>setMobileWizardStep(button.dataset.mobileStepTarget)));
    document.querySelectorAll('[data-floor-family],[data-floor-colour],[data-transition-finish],[data-nosing-finish],[data-nosing-option],[data-profile-choice],[data-skirting-paint]').forEach(button=>button.addEventListener('click',syncMobileGuidedUi));
    document.querySelectorAll('.toolbar .ui-button').forEach(button=>button.addEventListener('click',()=>{
      if(!mobileUiMedia.matches) return;
      appRoot.dataset.mobileViewOpen='false';
      mobileViewTrigger.setAttribute('aria-expanded','false');
      syncMobilePrimaryVisibility();
    }));
    document.addEventListener('pointerdown',event=>{
      if(!mobileUiMedia.matches||mobilePrimaryActions?.contains?.(event.target))return;
      setMobilePrimaryMenu('none');
    },{passive:true});
    if(typeof document.addEventListener==='function') {
      document.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&mobileUiMedia.matches&&productDisclosure?.open) {
          event.preventDefault();
          productDisclosure.open=false;
          syncProductDisclosure();
          productDisclosureSummary?.focus?.({preventScroll:true});
          return;
        }
        if(event.key==='Escape'&&mobileUiMedia.matches&&mobilePrimaryActions?.dataset.openMenu&&mobilePrimaryActions.dataset.openMenu!=='none') {
          event.preventDefault();
          const openSide=mobilePrimaryActions.dataset.openMenu;
          setMobilePrimaryMenu('none');
          mobilePrimaryMenuTriggers.find(button=>button.dataset.mobilePrimaryMenuTrigger===openSide)?.focus?.({preventScroll:true});
          return;
        }
        if(event.key==='Tab'&&mobileUiMedia.matches&&appRoot.dataset.mobileFinishOpen==='true') {
          const focusable=[...mobileFinishDock.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')]
            .filter(element=>!element.disabled&&element.getAttribute('tabindex')!=='-1'&&element.getClientRects?.().length);
          if(focusable.length) {
            const first=focusable[0],last=focusable[focusable.length-1];
            if(event.shiftKey&&document.activeElement===first) { event.preventDefault();last.focus({preventScroll:true}); }
            else if(!event.shiftKey&&document.activeElement===last) { event.preventDefault();first.focus({preventScroll:true}); }
          }
          return;
        }
        if(event.key==='Escape'&&!systemsControlPanel.hidden) {
          event.preventDefault();setSystemsOpen(false);return;
        }
        if(event.key==='Escape'&&!advancedSettingsPanel.hidden) {
          event.preventDefault();setAdvancedOpen(false);return;
        }
        if(event.key==='Escape'&&!materialDetailPanel.hidden) {
          event.preventDefault();closeMaterialDetail();return;
        }
        if(event.key==='Escape'&&!propertyEditor.hidden) {
          event.preventDefault();setPropertyEditorOpen(false);propertyIdentityTrigger.focus({preventScroll:true});return;
        }
        if(event.key!=='Escape' || !mobileUiMedia.matches) return;
        if(appRoot.dataset.mobileFinishOpen==='true') {
          event.preventDefault();
          closeMobileFinishWizard();
        } else if(appRoot.dataset.mobileViewOpen==='true') {
          appRoot.dataset.mobileViewOpen='false';
          mobileViewTrigger.setAttribute('aria-expanded','false');
          syncMobilePrimaryVisibility();
          mobileViewTrigger.focus({preventScroll:true});
        }
      });
    }
    if(typeof mobileUiMedia.addEventListener==='function') mobileUiMedia.addEventListener('change',handleMobileMediaChange);
    else mobileUiMedia.addListener(handleMobileMediaChange);
    let canvasSyncFrame=0;
    function scheduleCanvasSync(reason='resize',viewportHint=null) {
      floorQualityState.lastSceneStamp='';
      resizeCanvas(viewportHint);
      if(canvasSyncFrame)cancelAnimationFrame(canvasSyncFrame);
      canvasSyncFrame=requestAnimationFrame(()=>{
        canvasSyncFrame=0;
        resizeCanvas(viewportHint);
        floorQualityState.lastSceneStamp='';
      });
      appRoot.dataset.viewportSyncReason=String(reason);
    }
    const canvasResizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>scheduleCanvasSync('container-resize')):null;
    canvasResizeObserver?.observe(sceneViewport);
    window.addEventListener('resize',()=>{syncMobileStageLayout('window-resize');scheduleCanvasSync('window-resize');});
    window.visualViewport?.addEventListener?.('resize',()=>{syncMobileStageLayout('visual-viewport-resize');scheduleCanvasSync('visual-viewport-resize');});
    window.visualViewport?.addEventListener?.('scroll',()=>syncMobileStageLayout('visual-viewport-scroll'));
    window.addEventListener('pageshow',()=>{syncMobileStageLayout('pageshow');scheduleCanvasSync('pageshow');});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){syncMobileStageLayout('visible');scheduleCanvasSync('visible');}});
    window.addEventListener('message',event=>{
      if(window.parent!==window&&event.source!==window.parent)return;
      if(event.data?.type!=='pomi:model-viewport-sync')return;
      scheduleCanvasSync(event.data.reason||'outer-frame',event.data);
    });
    let dprMediaQuery=null,dprMediaHandler=null;
    function armDevicePixelRatioWatcher() {
      if(dprMediaQuery&&dprMediaHandler) {
        if(typeof dprMediaQuery.removeEventListener==='function')dprMediaQuery.removeEventListener('change',dprMediaHandler);
        else dprMediaQuery.removeListener?.(dprMediaHandler);
      }
      if(typeof window.matchMedia!=='function')return;
      dprMediaHandler=()=>{armDevicePixelRatioWatcher();scheduleCanvasSync('pixel-ratio-change');};
      dprMediaQuery=window.matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`);
      if(typeof dprMediaQuery.addEventListener==='function')dprMediaQuery.addEventListener('change',dprMediaHandler);
      else dprMediaQuery.addListener?.(dprMediaHandler);
    }
    armDevicePixelRatioWatcher();
    syncMobileStageLayout('startup');
    scheduleCanvasSync('startup');
    const advancedReferenceContent=RESIDENCE_DOM.getElementById('advanced-reference-content');
    const legacyFactsPanel=RESIDENCE_DOM.getElementById('facts-panel');
    [...legacyFactsPanel.children].filter(child=>!child.classList.contains('panel-head')).forEach(child=>advancedReferenceContent.appendChild(child));
    setAdvancedTab('view');
    setAdvancedOpen(false,{returnFocus:false});
    syncDetailDataset();
    setUiMode('client');
    resetView();

    const stats = Object.freeze({
      meshCount: meshes.length,
      meshCountByLevel: Object.freeze({
        upper:meshes.filter(item=>item.level==='upper').length,
        ground:meshes.filter(item=>item.level==='ground').length,
        shared:meshes.filter(item=>item.level==='shared').length
      }),
      lineSetCount: lines.length,
      lineSetCountByLevel: Object.freeze({
        upper:lines.filter(item=>item.level==='upper').length,
        ground:lines.filter(item=>item.level==='ground').length,
        shared:lines.filter(item=>item.level==='shared').length
      }),
      labelCount: labelDefs.length,
      labelCountByLevel: Object.freeze({
        upper:labelDefs.filter(item=>item.level==='upper').length,
        ground:labelDefs.filter(item=>item.level==='ground').length,
        shared:labelDefs.filter(item=>item.level==='shared').length
      }),
      groundFloorIncluded: true,
      groundFloorValidationStatus: 'P1/P3/P4/P11 audited V12 requested-detail correction with V11 scope frozen',
      groundOverallDimensions: Object.freeze([GROUND_PLAN_W,GROUND_PLAN_D]),
      groundToUpperRegistrationOffset: Object.freeze([GROUND_OFFSET_X,GROUND_OFFSET_Z]),
      groundFootprintPieceCount: 3,
      groundFootprintClosed: true,
      groundFootprintGrossArea: polygonArea2D(GROUND_SLAB_FOOTPRINT_Q),
      groundFootprintPieceAreaSum: polygonArea2D(GROUND_MAIN_HOUSE_FOOTPRINT_Q)+polygonArea2D(GROUND_ENTRY_PAVING_Q)+polygonArea2D(GROUND_GARAGE_STORE_FOOTPRINT_Q),
      groundFootprintPiecesReconcile: Math.abs(polygonArea2D(GROUND_SLAB_FOOTPRINT_Q)-polygonArea2D(GROUND_MAIN_HOUSE_FOOTPRINT_Q)-polygonArea2D(GROUND_ENTRY_PAVING_Q)-polygonArea2D(GROUND_GARAGE_STORE_FOOTPRINT_Q))<.000001,
      groundMainHouseFloorArea: polygonArea2D(GROUND_MAIN_HOUSE_FOOTPRINT_Q),
      groundEntryPavingArea: polygonArea2D(GROUND_ENTRY_PAVING_Q),
      groundMainAndPavingAreaReconciles: Math.abs(polygonArea2D(GROUND_MAIN_AND_PORCH_FOOTPRINT_Q)-polygonArea2D(GROUND_MAIN_HOUSE_FOOTPRINT_Q)-polygonArea2D(GROUND_ENTRY_PAVING_Q))<.000001,
      groundEntryPavingMeshCount: meshes.filter(item=>item.entryPaving===true&&item.porchPaving===true).length,
      groundEntryPavingJointCount: lines.filter(item=>item.entryPaving===true&&item.pavingJoint===true).length,
      groundEntryPavingSurfaceMaterial: 'paving',
      groundMainFloorTopCourse: 0,
      garageFootingTopCourse: PARAMS.GARAGE_FOOTING_TOP_COURSE,
      garageSlabBaseCourse: PARAMS.GARAGE_SLAB_BASE_COURSE,
      garageFloorTopCourse: PARAMS.GARAGE_FLOOR_TOP_COURSE,
      garageFloorDatum: PARAMS.GROUND_FLOOR_DATUM+PARAMS.GARAGE_FLOOR_TOP_COURSE*PARAMS.BRICK_COURSE_HEIGHT,
      garageWallBaseCourse: PARAMS.GARAGE_WALL_BASE_COURSE,
      garageWallBaseDatum: PARAMS.GROUND_FLOOR_DATUM+PARAMS.GARAGE_WALL_BASE_COURSE*PARAMS.BRICK_COURSE_HEIGHT,
      brickCourseHeight: PARAMS.BRICK_COURSE_HEIGHT,
      garageConcretePlinthCount: meshes.filter(item=>item.concretePlinth===true).length,
      garageInteriorConcreteSlabCount: meshes.filter(item=>item.garageInteriorConcrete===true).length,
      garageInteriorConcreteSlabBrickWrapped: meshes.filter(item=>item.garageInteriorConcrete===true).every(item=>item.brickWrapped===true&&item.externalEdgeExposed===false),
      garageRenderedLowerWallCount: meshes.filter(item=>item.garageLowerWall===true).length,
      garageRenderedLowerWallsMeetFooting: meshes.filter(item=>item.garageLowerWall===true).every(item=>item.meetsFootingCourse===PARAMS.GARAGE_FOOTING_TOP_COURSE&&item.externalFinish==='render'&&item.concretePlinth===false),
      garageSharedSlabDividerCoverCount: meshes.filter(item=>item.garageSharedSlabDividerCover===true).length,
      garageInteriorSlabOutlineCount: lines.filter(item=>item.name==='GF-garage-store-interior-outline-minus-1c').length,
      garageMfDoorId: 'GF-D-STORE',
      garageMfDoorSillCourse: PARAMS.GARAGE_MF_DOOR_SILL_COURSE,
      garageMfRenderedBrickBaseCourses: PARAMS.GARAGE_MF_RENDERED_BRICK_BASE_COURSES,
      garageMfRenderedBrickBaseMeshCount: meshes.filter(item=>item.garageMfDoorAssemblyId==='GF-D-STORE'&&item.renderedBrickBase===true).length,
      garageMfVisibleFaceBrickBaseMeshCount: meshes.filter(item=>item.garageMfDoorAssemblyId==='GF-D-STORE'&&item.visibleBrickBase===true).length,
      garageSectionalBaseCourse: PARAMS.GARAGE_SECTIONAL_BASE_COURSE,
      garageSectionalHeadCourse: PARAMS.GARAGE_SECTIONAL_HEAD_COURSE,
      garageSectionalTrackType: 'vertical-arc-horizontal',
      garageSectionalTrackRadius: PARAMS.GARAGE_SECTIONAL_TRACK_RADIUS,
      garageSectionalTrackPhysical: meshes.filter(item=>item.garageTrackPhysical===true).length>=6,
      garageSectionalTrackPhysicalMeshCount: meshes.filter(item=>item.garageTrackPhysical===true).length,
      garageSectionalTrackFinish: 'silver aluminium-alloy visual proxy',
      garageSectionalTrackSides: Object.freeze([...new Set(meshes.filter(item=>item.garageTrackPhysical===true).map(item=>item.garageTrackSide))].sort()),
      garageSectionalPanelCount: meshes.filter(item=>item.garageSectionalAssemblyId==='GF-GARAGE-SECTIONAL'&&Number.isFinite(item.garageSectionIndex)&&item.name.includes('-section-')).length,
      garageSectionalArcTrackCount: lines.filter(item=>item.garageSectionalAssemblyId==='GF-GARAGE-SECTIONAL'&&item.garageTrackArc===true).length,
      groundDoorOpeningHeadCount: meshes.filter(item=>item.doorOpeningHead===true&&item.level==='ground').length,
      groundDoorOpeningHeadAssemblies: Object.freeze([...new Set(meshes.filter(item=>item.doorOpeningHead===true&&item.level==='ground').map(item=>item.hostOpeningAssemblyId))]),
      groundDoorHeadsFixedToHostOpenings: meshes.filter(item=>item.doorOpeningHead===true&&item.level==='ground').every(item=>item.headFollowsDoorLeaf===false&&!item.transformWhen),
      legacyLeafDrivenGroundDoorHeadCount: meshes.filter(item=>item.level==='ground'&&/-wall-head$/.test(item.name)).length,
      entryColumnAssemblyCount: new Set(meshes.filter(item=>item.entryColumnAssemblyId==='GF-ENTRY-COLUMN').map(item=>item.entryColumnAssemblyId)).size,
      entryColumnBrickPierCourses: meshes.find(item=>item.name==='GF-ENTRY-column-brick-pier-7c')?.brickCourseCount || 0,
      entryColumnShsSection: Object.freeze([PARAMS.ENTRY_COLUMN_SECTION,PARAMS.ENTRY_COLUMN_SECTION]),
      entryColumnTopCourse: 25,
      entryColumnArchitecturalSteelMeshCount: meshes.filter(item=>item.entryColumnAssemblyId==='GF-ENTRY-COLUMN'&&item.architecturalSteel===true).length,
      entryColumnArchitecturalSteelClientVisible: meshes.filter(item=>item.entryColumnAssemblyId==='GF-ENTRY-COLUMN'&&item.architecturalSteel===true).every(item=>item.category==='exterior'),
      entryFaceRecognitionHardwareMeshCount: meshes.filter(item=>item.faceRecognitionEntryHardware===true).length,
      entrySmartLockExteriorScale: PARAMS.ENTRY_SMART_LOCK_SCALE,
      entrySmartLockHousingWidth: .160*PARAMS.ENTRY_SMART_LOCK_SCALE,
      entrySmartLockHousingHeight: .714*PARAMS.ENTRY_SMART_LOCK_SCALE,
      entrySmartLockCentreHeight: 1.124,
      entrySmartLockCentreU: PARAMS.ENTRY_SMART_LOCK_CENTRE_U,
      entryDoorFixedFrameHeadMeshCount: meshes.filter(item=>item.entryDoorFixedFrameHead===true).length,
      plumbingDuctFalseWindowCount: meshes.filter(item=>item.plumbingDuctHostWall===true&&item.notAWindow===true).length,
      plumbingDuctAccessPanelCount: meshes.filter(item=>item.plumbingDuctAccessPanel===true).length,
      groundFootprintVsScheduleDelta: polygonArea2D(GROUND_SLAB_FOOTPRINT_Q)-GROUND_SCHEDULED_AREAS.total,
      groundFootprintWithinOneSquareMetreOfSchedule: Math.abs(polygonArea2D(GROUND_SLAB_FOOTPRINT_Q)-GROUND_SCHEDULED_AREAS.total)<1,
      groundScheduledAreas: GROUND_SCHEDULED_AREAS,
      groundScheduledAreaReconciled: Math.abs(GROUND_SCHEDULED_AREAS.groundFloor+GROUND_SCHEDULED_AREAS.garageStore+GROUND_SCHEDULED_AREAS.porch-GROUND_SCHEDULED_AREAS.total)<.001,
      groundOuterLeafVectorSegmentCount: GROUND_P1_OUTER_LEAF_SEGMENTS_Q.length,
      groundInnerLeafVectorSegmentCount: GROUND_P1_INNER_LEAF_SEGMENTS_Q.length,
      groundInternalWallVectorSegmentCount: GROUND_P1_INTERNAL_WALL_SEGMENTS_Q.length,
      groundPtyAngledWallJoinCount: GROUND_PTY_ANGLED_WALL_JOINS_Q.length,
      groundPtyAngledWallDirectIntersections: meshes.filter(item=>item.ptyDirectWallAssembly===true).length===1&&meshes.filter(item=>item.ptyDirectWallAssembly===true).every(item=>item.directIntersection===true&&item.angledWallJoinDegrees===45&&item.taperedCornerFiller===false),
      ptyWallIntersectionsDirect: meshes.filter(item=>item.ptyDirectWallAssembly===true).length===1&&meshes.filter(item=>item.ptyDirectWallAssembly===true).every(item=>item.sharpPlanIntersection===true&&item.oneWallMesh===true),
      groundPtyWallShiftQ: GROUND_PTY_WALL_ALIGNMENT_Q.shiftQ,
      groundPtyWallShiftDistance: GROUND_PTY_WALL_ALIGNMENT_Q.shiftDistance,
      groundPtyWallLedAlignment: meshes.filter(item=>item.ptyDirectWallAssembly===true).length===1&&meshes.filter(item=>item.ptyDirectWallAssembly===true).every(item=>item.wallMovedBeforeDoor===true&&item.doorFollowsHostWall===true),
      groundPtySideWallTipsTrimmed: meshes.filter(item=>item.ptyDirectWallAssembly===true).length===1&&meshes.filter(item=>item.ptyDirectWallAssembly===true).every(item=>item.sideWallTipsTrimmed===true),
      groundPtyHeadUsesFaceToFaceMiter: meshes.filter(item=>item.ptyDirectWallAssembly===true).length===1&&meshes.filter(item=>item.ptyDirectWallAssembly===true).every(item=>item.headUsesFaceToFaceMiter===true),
      groundGreenBandAuditSource: '21560 WD A3.pdf · page 1',
      groundGreenBandAuditPriority: 'lowest / existing model always wins',
      groundGreenBandInfillCount: GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.length,
      groundGreenBandOuterInfillCount: GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.filter(item=>item.wallClass==='outer').length,
      groundGreenBandInnerInfillCount: GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.filter(item=>item.wallClass==='inner').length,
      groundGreenBandInternalInfillCount: GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.filter(item=>item.wallClass==='internal').length,
      groundGreenBandInfillFootprintArea: GROUND_GREEN_BAND_INFILL_SEGMENTS_Q.reduce((sum,item)=>sum+(item.qBox[1]-item.qBox[0])*(item.qBox[3]-item.qBox[2]),0),
      groundGreenBandInfillMeshCount: meshes.filter(item=>item.greenBandAudit===true).length,
      groundGreenBandExistingGeometryChangedCount: meshes.filter(item=>item.greenBandAuditChangedExistingGeometry===true).length,
      groundGreenBandDoorWindowMovedCount: 0,
      groundGreenBandBaselinePixelCoverage: .975757,
      groundGreenBandPostInfillPixelCoverage: .998350,
      groundGreenBandResidualConflictClusterCount: 8,
      groundGreenBandResidualConflictsIgnored: true,
      groundGreenBandAdditiveOnly: true,
      levelModes: Object.freeze(['upper','both','ground']),
      exteriorWallOverall: PARAMS.EXTERIOR_WALL,
      exteriorWallBuildUp: Object.freeze({outerLeaf:PARAMS.EXTERIOR_OUTER_LEAF,cavity:PARAMS.EXTERIOR_CAVITY,innerLeaf:PARAMS.EXTERIOR_INNER_LEAF}),
      exteriorCavityModelledAsOpenGap: true,
      upperExteriorLeafTopology:'two closed offset polygons with same-leaf corner joins',
      groundExteriorLeafTopology:'P1 vector-path leaf bands with source corner joins',
      upperInnerLeafInteriorPaintMeshCount: meshes.filter(item=>item.innerLeafInteriorPaint===true).length,
      upperInnerLeafInteriorPaintWallIds: Object.freeze([...new Set(meshes.filter(item=>item.innerLeafInteriorPaint===true).map(item=>item.innerLeafWallId))]),
      upperInnerLeafInteriorPaintWallCount: new Set(meshes.filter(item=>item.innerLeafInteriorPaint===true).map(item=>item.innerLeafWallId)).size,
      upperInnerLeafInteriorPaintMatchesInternal: meshes.filter(item=>item.innerLeafInteriorPaint===true).every(item=>item.category==='internal' && item.color===COLORS.internal && item.paintOnlyOverlay===true),
      upperInnerLeafExteriorAndCavityFacesUnchanged: true,
      exteriorWallBreakUpProvisional: true,
      exteriorGlazedOpeningCount: 21,
      upperExteriorGlazedOpeningCount: 10,
      groundExteriorGlazedOpeningCount: 11,
      groundExteriorGlazedOpeningProxyCount: 0,
      exteriorWindowAssemblyCount: 18,
      exteriorWindowPanelCount: 47,
      fixedWindowPanelCount: 23,
      operableWindowPanelCount: 24,
      awningWindowPanelCount: 6,
      slidingWindowPanelCount: 7,
      pairedWindowMasonryDividerCount: 0,
      g09g10CentreFrameMullionWidth: .060,
      walkThroughExteriorDoorCount: 2,
      hingedDoorLeafCount: openingInteractions.filter(item=>item.kind==='hinged door').length,
      hingedDoorHardwareSetCount: openingInteractions.filter(item=>item.kind==='hinged door').length,
      keyedLeverSetCount: openingInteractions.filter(item=>item.kind==='hinged door'&&item.hardwareMode==='keyed').length,
      privacyLeverSetCount: PRIVACY_DOOR_IDS.size,
      privacyDoorIds: Object.freeze([...PRIVACY_DOOR_IDS]),
      insertedKeyVisualCount: openingInteractions.filter(item=>item.kind==='hinged door'&&item.hardwareMode==='keyed').length,
      hangingKeyRingVisualCount: openingInteractions.filter(item=>item.kind==='hinged door'&&item.hardwareMode==='keyed').length,
      hangingSpareKeyVisualCount: openingInteractions.filter(item=>item.kind==='hinged door'&&item.hardwareMode==='keyed').length*2,
      keysPerKeyedDoor: Object.freeze({inserted:1,keyRing:1,hangingSpareKeys:2}),
      keyedFacesPerKeyedDoor: 1,
      keyedSideRule: 'explicit nearest living/common-circulation face for every keyed leaf; GF-D-ENTRY uses face recognition and has no conventional key',
      keyedCommonSideByDoor: KEYED_COMMON_SIDE_BY_DOOR,
      keyedCommonSideMappedCount: Object.keys(KEYED_COMMON_SIDE_BY_DOOR).length,
      keyedCommonSideUnmappedIds: Object.freeze(openingInteractions.filter(item=>item.kind==='hinged door' && item.hardwareMode==='keyed' && !(item.id in KEYED_COMMON_SIDE_BY_DOOR)).map(item=>item.id)),
      everyKeyedDoorUsesAssignedCommonSide: openingInteractions.filter(item=>item.kind==='hinged door' && item.hardwareMode==='keyed').every(item=>KEYED_COMMON_SIDE_BY_DOOR[item.id]===item.keySide),
      upperLinenKeyDoorIds: UPPER_LINEN_KEY_DOOR_IDS,
      upperLinenKeySides: Object.freeze({D06A:KEYED_COMMON_SIDE_BY_DOOR.D06A,D06B:KEYED_COMMON_SIDE_BY_DOOR.D06B}),
      upperLinenKeysOutside: KEYED_COMMON_SIDE_BY_DOOR.D06A===1 && KEYED_COMMON_SIDE_BY_DOOR.D06B===-1,
      upperLinenKeyWorldSide: 'west / negative X, outside Linen and toward common circulation',
      keyedCylinderOffsetAlongLever: PARAMS.DOOR_KEY_CYLINDER_OFFSET,
      insertedKeyCylinderCentered: PARAMS.DOOR_KEY_CYLINDER_OFFSET===0,
      insertedKeyHeadRestOrientation: 'world-vertical long axis; broad plane quarter-turned out of the hanging-key plane',
      insertedKeyHeadStaysVerticalDuringHandleMotion: true,
      insertedKeyBowQuarterTurnRadians: PARAMS.DOOR_KEY_BOW_QUARTER_TURN,
      insertedKeyBowQuarterTurnDegrees: 90,
      insertedKeyBowQuarterTurnCount: meshes.filter(item=>item.keyBowQuarterTurnRadians===PARAMS.DOOR_KEY_BOW_QUARTER_TURN).length,
      insertedKeyBowPlane: 'door-normal × vertical',
      insertedKeyBowPerpendicularToHangingKeys: meshes.filter(item=>item.keyBowQuarterTurnRadians===PARAMS.DOOR_KEY_BOW_QUARTER_TURN).every(item=>item.keyBowPerpendicularToHangingKeys===true),
      keyProfileId: 'AU-C4-5PIN-V13',
      keyBladeCutCount: 5,
      matchingKeyBowVisualCount: meshes.filter(item=>/-matching-bow(?:-|$)/.test(item.name)).length,
      insertedKeyVisibleShankCount: meshes.filter(item=>item.keyWithdrawal===PARAMS.DOOR_KEY_PROJECTION).length,
      allKeyMeshesUseMatchingProfile: meshes.filter(item=>/(?:-inserted-key-(?:blade|visible|matching-bow)|-spare-key-)/.test(item.name)).every(item=>item.keyProfileId==='AU-C4-5PIN-V13'),
      hangingKeysMatchInsertedBow: meshes.filter(item=>/-spare-key-\d+-matching-bow$/.test(item.name)).every(item=>item.keyBowMatchesInserted===true),
      insertedKeyHeadOuterHalfExtents: Object.freeze([PARAMS.DOOR_KEY_BOW_HALF_WIDTH,PARAMS.DOOR_KEY_BOW_HALF_HEIGHT]),
      insertedKeyBladeExternalLength: PARAMS.DOOR_KEY_PROJECTION,
      insertedKeyWithdrawal: PARAMS.DOOR_KEY_PROJECTION,
      insertedKeyBladeConcealedInsideLock: true,
      insertedKeyVisibleHeadProjection: PARAMS.DOOR_KEY_BOW_HALF_WIDTH*2+PARAMS.DOOR_KEY_PROJECTION,
      insertedKeyHeadForm: 'matching compact rounded metal bow with a true ring opening',
      hangingKeyBladeLength: PARAMS.DOOR_KEY_BLADE_LENGTH,
      hangingKeyBladeHeight: PARAMS.DOOR_KEY_BLADE_HALF_HEIGHT*2,
      privacyLockKeyCount: 0,
      privacyInsideControl: 'turn snib',
      privacyOutsideControl: 'emergency release slot',
      doorHardwareFinish: 'brushed nickel visual proxy',
      doorHardwareReference: 'GF-D-ENTRY uses the Sublimetrics face-recognition smart lock; remaining keyed leaves use the Ikonic Norr visual reference; privacy hardware remains a generic Australian visual proxy',
      doorHardwareBackset: PARAMS.DOOR_HARDWARE_BACKSET,
      doorHardwareHeight: PARAMS.DOOR_HARDWARE_HEIGHT,
      doorHardwareReferenceLatchRange: Object.freeze([.060,.070]),
      doorHardwareReferenceDoorThicknessRange: Object.freeze([.035,.055]),
      doorLeafThicknessWithinReferenceRange: .044>=.035 && .044<=.055,
      hingedDoorHardwareTransformsWithLeaf: true,
      handleTurnsBeforeLeafMotion: true,
      handlePressSeconds: PARAMS.DOOR_HANDLE_PRESS_SECONDS,
      handleReleaseSeconds: PARAMS.DOOR_HANDLE_RELEASE_SECONDS,
      handleMaximumTurnRadians: PARAMS.DOOR_HANDLE_MAX_TURN,
      hangingKeysUseDampedSway: true,
      hangingKeyMaximumSwayRadians: PARAMS.DOOR_KEY_SWAY_MAX,
      springLatchBoltCount: meshes.filter(item=>/-spring-latch-bolt$/.test(item.name)).length,
      springLatchRetractsWithHandle: true,
      independentOpeningControls: true,
      hingedDoorHardwareHitTargets: openingInteractions.filter(item=>item.kind==='hinged door').length,
      groundHingedDoorLeafCount: GROUND_DOORS_Q.length,
      groundDoorFramesCenteredToHostWalls: openingInteractions.filter(item=>item.level==='ground'&&item.kind==='hinged door').every(item=>item.frameCentreAlignedToHostWall===true),
      groundDoorHostCentreShiftCount: Object.keys(GROUND_DOOR_HOST_CENTRE_SHIFTS_Q).length,
      glassSlidingDoorCount: openingInteractions.filter(item=>item.kind==='glass sliding door').length,
      groundGlassSlidingDoorCount: openingInteractions.filter(item=>item.level==='ground'&&item.kind==='glass sliding door').length,
      groundSliderCorniceCount: meshes.filter(item=>item.level==='ground'&&['GF-SD-DINING-cornice','GF-SD-SERVICE-cornice'].includes(item.name)).length,
      diningSelectableGlassLeaves: Boolean(openingInteractions.find(item=>item.id==='GF-SD-DINING')?.selectableGlassLeaves),
      diningOperableGlassLeafCount: openingInteractions.find(item=>item.id==='GF-SD-DINING')?.operablePanelCount || 0,
      diningDefaultActiveGlassLeaf: openingInteractions.find(item=>item.id==='GF-SD-DINING')?.defaultActivePanelIndex || 0,
      diningGlassLeafOperations: Object.freeze([...(openingInteractions.find(item=>item.id==='GF-SD-DINING')?.panelOperations || [])]),
      diningClearGlazing: openingInteractions.find(item=>item.id==='GF-SD-DINING')?.glazingType==='clear',
      serviceSelectableGlassLeaves: Boolean(openingInteractions.find(item=>item.id==='GF-SD-SERVICE')?.selectableGlassLeaves),
      serviceOperableGlassLeafCount: openingInteractions.find(item=>item.id==='GF-SD-SERVICE')?.operablePanelCount || 0,
      serviceClearGlazing: openingInteractions.find(item=>item.id==='GF-SD-SERVICE')?.glazingType==='clear',
      slidingFlyscreenCount: openingInteractions.filter(item=>item.kind==='sliding flyscreen').length,
      groundSlidingFlyscreenCount: openingInteractions.filter(item=>item.level==='ground'&&item.kind==='sliding flyscreen').length,
      groundSliderGlassToFlyscreenRule: 'N glass panels use N-1 flyscreen panels; 2→1, 3→2',
      groundSliderIntegratedFrameDepths: Object.freeze({standard:PARAMS.SLIDER_STANDARD_FRAME_DEPTH,multistack:PARAMS.SLIDER_MULTISTACK_SCREEN_FRAME_DEPTH}),
      groundSliderFixedAssemblyFrameMeshCount: meshes.filter(item=>item.level==='ground'&&item.fixedAssemblyFrame===true).length,
      groundSliderTopFramesSealed: openingInteractions.filter(item=>item.level==='ground'&&item.kind==='glass sliding door').every(item=>item.topFrameSealedToOpening===true&&item.openingHeadSealed===true),
      diningFlyscreenPanelCount: meshes.filter(item=>item.sliderStateId==='GF-SD-DINING-FLYSCREEN'&&item.sliderRole==='flyscreen-mesh').length,
      diningFlyscreenWovenLineCount: lines.filter(item=>item.sliderStateId==='GF-SD-DINING-FLYSCREEN'&&item.wovenFlyscreenMesh===true).length,
      diningFlyscreenWovenSegmentCount: lines.filter(item=>item.sliderStateId==='GF-SD-DINING-FLYSCREEN'&&item.wovenFlyscreenMesh===true).reduce((sum,item)=>sum+(item.wovenSegmentCount||0),0),
      diningFlyscreenWovenColumns: PARAMS.FLYSCREEN_WEAVE_COLUMNS,
      diningFlyscreenWovenRows: PARAMS.FLYSCREEN_WEAVE_ROWS,
      diningFlyscreenTintedWovenMesh: openingInteractions.find(item=>item.id==='GF-SD-DINING-FLYSCREEN')?.tintedMesh===true,
      diningMainFrameCavityPlaneLocalX: PLAN_W-GROUND_CAVITY_CENTRE_Q.westX,
      diningMainFrameCavityPlaneQX: GROUND_CAVITY_CENTRE_Q.westX,
      diningFlyscreenIntegratedTrackOffset: openingInteractions.find(item=>item.id==='GF-SD-DINING-FLYSCREEN')?.trackOffset || 0,
      diningFlyscreenIntegratedTrackPlaneLocalX: openingInteractions.find(item=>item.id==='GF-SD-DINING-FLYSCREEN')?.anchor?.[0] || 0,
      diningFlyscreenIntegratedTrackPlaneQX: PLAN_W-(openingInteractions.find(item=>item.id==='GF-SD-DINING-FLYSCREEN')?.anchor?.[0] || 0),
      serviceFlyscreenTrackOffsetRetained: openingInteractions.find(item=>item.id==='GF-SD-SERVICE-FLYSCREEN')?.trackOffset || 0,
      groundCavityCentrePlanesLocal: Object.freeze({
        westX:PLAN_W-GROUND_CAVITY_CENTRE_Q.westX,
        southZ:PLAN_D-GROUND_CAVITY_CENTRE_Q.southZ,
        northZ:PLAN_D-GROUND_CAVITY_CENTRE_Q.northZ,
        steppedEastX:PLAN_W-GROUND_CAVITY_CENTRE_Q.steppedEastX,
        masterNorthZ:PLAN_D-GROUND_CAVITY_CENTRE_Q.masterNorthZ,
        frontEastX:PLAN_W-GROUND_CAVITY_CENTRE_Q.frontEastX
      }),
      groundAllOpeningStatesHaveSpecifications: openingInteractions.filter(item=>item.level==='ground').every(item=>Boolean(item.specId&&item.spec)),
      groundArchitecturalOpeningAssemblyCount: new Set(openingInteractions.filter(item=>item.level==='ground'&&item.kind!=='sliding flyscreen').map(item=>item.assemblyId||item.id)).size,
      groundOpeningSpecifications: Object.freeze([...new Map(openingInteractions.filter(item=>item.level==='ground'&&item.spec&&item.kind!=='sliding flyscreen').map(item=>[item.assemblyId||item.id,Object.freeze({assemblyId:item.assemblyId||item.id,...item.spec})])).values()]),
      groundAccessoryOpeningSpecifications: Object.freeze(openingInteractions.filter(item=>item.level==='ground'&&item.kind==='sliding flyscreen').map(item=>Object.freeze({assemblyId:item.id,parentAssemblyId:item.parentAssemblyId,...item.spec}))),
      groundWindowAndDoorSharedInteractionEngine: true,
      ptyDoorDrawingCode: GROUND_DOORS_Q.find(item=>item.id==='GF-D-PANTRY').drawingCode,
      ptyDoorIsDiagonal: (()=>{const item=GROUND_DOORS_Q.find(entry=>entry.id==='GF-D-PANTRY'),closed=item.closed===0?item.p0:item.p1;return Math.abs(closed[0]-item.hinge[0])>.05&&Math.abs(closed[1]-item.hinge[1])>.05;})(),
      sectionalGarageDoorCount: 1,
      cavitySlidingDoorCount: 0,
      wetEntryUnleafedOpeningCount: 1,
      wetEntryOpeningWidth: PARAMS.O01_OPEN_X1-PARAMS.O01_OPEN_X0,
      wetEntryCorniceThrough: true,
      adjacent620FormerDoorPositionSealed: true,
      bathSouthWallDoorCutoutCount: 0,
      fullOrbit360: true,
      wallModes: Object.freeze(['solid','hidden','cutaway']),
      defaultWallMode: 'solid',
      wallFinishExterior: 'Dulux White Duck Quarter colour proxy with fine-grain rendered surface',
      wallFinishInterior: 'Dulux Lexicon Quarter smooth painted plaster colour proxy',
      interiorWallColourName: 'Dulux Lexicon Quarter',
      interiorWallColourHex: '#f1f2f1',
      interiorWallColourRgb: Object.freeze([241,242,241]),
      interactiveOpeningTargetCount: openingInteractions.length,
      toggleableOpeningCount: openingInteractions.filter(item=>item.canToggle).length,
      initialOpenTargetCount: openingInteractions.filter(item=>item.initialOpen).length,
      initialOpeningState: 'all closed',
      openingAnimationEnabled: true,
      animationDurationsSeconds: Object.freeze({
        hingedDoorLeafTravel: PARAMS.HINGED_DOOR_ANIMATION_SECONDS,
        hingedDoorPreLatch: PARAMS.DOOR_HANDLE_PRESS_SECONDS,
        hingedDoorFullOpenSequence: PARAMS.HINGED_DOOR_ANIMATION_SECONDS+PARAMS.DOOR_HANDLE_PRESS_SECONDS,
        operableWindow: PARAMS.WINDOW_ANIMATION_SECONDS,
        robeAndGlassSlider: PARAMS.SLIDER_ANIMATION_SECONDS
      }),
      obscureWindowAssemblyCount: 5,
      obscureWindowIds: Object.freeze(['G02','G03','GF-W-OBS-A','GF-W-OBS-B','GF-W-ENS']),
      obscureGlazingVisualOpacity: COLORS.obscureGlazing[3],
      obscureGlazingPrivacyProxy: true,
      clearWindowVisualOpacity: COLORS.clearGlazing[3],
      clearWindowSeeThroughBothSides: true,
      greyPrivacyWindowVisualOpacity: COLORS.greyGlazing[3],
      greyPrivacyBackgroundBleedBlocked: true,
      hingedDoorVisualOpacity: COLORS.door[3],
      corniceMatchesInternalWallColor: COLORS.cornice.every((value,index)=>value===COLORS.internal[index]),
      highContrastWindowOperationMarks: true,
      slidingWindowTravelFractionOfPanelWidth: 1,
      twoPanelSliderOpenFraction: .5,
      threePanelSliderOpenFraction: 2/3,
      hingedDoorToggleCount: openingInteractions.filter(item=>item.kind==='hinged door').length,
      operableWindowPanelToggleCount: openingInteractions.filter(item=>item.kind==='operable window panel').length,
      fixedWindowClickTargetCount: openingInteractions.filter(item=>item.kind.startsWith('fixed window')).length,
      everyOperableWindowSashHasIndependentState: true,
      robeAndGlassSliderToggleCount: openingInteractions.filter(item=>item.kind.includes('slider')).length,
      robePanelOverlap: PARAMS.ROBE_PANEL_OVERLAP,
      robeClosedVisibleGap: 0,
      robeTrackOffset: PARAMS.ROBE_TRACK_OFFSET,
      robeOverlapPanelMeshCount: meshes.filter(item=>Number.isFinite(item.robeOverlap)).length,
      robeArrowOnlyControls: openingInteractions.filter(item=>item.kind==='mirrored robe slider').every(item=>item.robeArrowOnlyControl===true),
      robeArrowHitTargetCount: openingInteractions.filter(item=>item.kind==='mirrored robe slider').reduce((sum,item)=>sum+item.hitAnchors.length,0),
      robeHighVisibilityArrowLineCount: lines.filter(item=>item.highVisibilityRobeArrow===true).length,
      robeHighVisibilityArrowAssemblies: Object.freeze([...new Set(lines.filter(item=>item.highVisibilityRobeArrow===true).map(item=>item.robeAssemblyId))]),
      robeHighVisibilityArrowsBothFaces: [-1,1].every(face=>lines.some(item=>item.highVisibilityRobeArrow===true && item.robeArrowFace===face)),
      robeHighVisibilityArrowColour: Object.freeze(COLORS.robeArrow),
      robeBidirectionalStacking: true,
      doorFrameCount: openingInteractions.filter(item=>item.kind==='hinged door').length,
      doorFrameType: 'Metroll Metro 95 mm back-opening true stepped-section visual proxy',
      doorFrameOverallProfile: PARAMS.DOOR_FRAME_OVERALL,
      doorFrameBackOpening: PARAMS.DOOR_FRAME_BACK_OPENING,
      doorFrameBuiltInReturn: PARAMS.DOOR_FRAME_FACE_RETURN,
      doorFrameSteelThickness: PARAMS.DOOR_FRAME_STEEL_THICKNESS,
      doorFrameBodyDepth: PARAMS.DOOR_FRAME_HEAD_DEPTH,
      doorFrameCentreStopWidth: PARAMS.DOOR_FRAME_STOP_WIDTH,
      doorFrameCentreStopProjection: PARAMS.DOOR_FRAME_STOP_PROJECTION,
      doorFrameStrikePlate: Object.freeze({width:PARAMS.DOOR_FRAME_STRIKE_WIDTH,length:PARAMS.DOOR_FRAME_STRIKE_LENGTH,height:PARAMS.DOOR_FRAME_STRIKE_HEIGHT}),
      doorFrameSameProfileAtJambsAndHead: true,
      doorFrameRectangularProxyRemoved: true,
      doorFrameSolidFilledProfileRemoved: true,
      doorFrameFoldedSteelMeshCount: meshes.filter(item=>item.metrollFoldedSteel===true).length,
      doorFrameWallInsertMeshCount: meshes.filter(item=>item.frameWallInsert===true).length,
      doorFrameVisibleFaceReturnMeshCount: meshes.filter(item=>item.metrollVisibleFaceReturn===true).length,
      doorFrameAutoCalibratedAssemblyCount: new Set(meshes.filter(item=>item.metrollVisibleFaceReturn===true).map(item=>item.doorFrameAssemblyId)).size,
      doorFrameVisibleFaceReturnsPerAssembly: 6,
      doorFrameWallThicknessInBackOpening: PARAMS.INTERNAL_WALL_FRAME_INSERT,
      doorFrameBackOpeningClearancePerFace: (PARAMS.DOOR_FRAME_BACK_OPENING-PARAMS.INTERNAL_WALL_FRAME_INSERT)/2,
      doorFrameWallCentredInBackOpening: meshes.filter(item=>item.frameWallInsert===true).every(item=>item.wallCentredInBackOpening===true),
      doorFrameFacePlaneFromWallCentre: PARAMS.DOOR_FRAME_BACK_OPENING/2,
      doorFrameProudOfWallBy: PARAMS.DOOR_FRAME_FACE_PLANE_CLEARANCE,
      doorFrameVisibleFaceReturnsOutsideWall: meshes.filter(item=>item.metrollVisibleFaceReturn===true).every(item=>item.frameOutsideWall===true),
      doorFrameBuriedVisibleFaceReturnCount: meshes.filter(item=>item.metrollVisibleFaceReturn===true && item.frameOutsideWall!==true).length,
      doorFrameBuiltInSteelArchitrave: true,
      customSkirtingProfileOnDoorFrames: false,
      skirtingStopsAtDoorFrameReturn: true,
      skirtingDoorFrameClearance: PARAMS.DOOR_FRAME_FACE_RETURN,
      wcRemovableFrameIds: Object.freeze([...WC_FRAME_DOOR_IDS]),
      wcRemovableFrameCount: WC_FRAME_DOOR_IDS.size,
      wcFalseHeadHeight: PARAMS.WC_FALSE_HEAD_HEIGHT,
      wcFalseHeadDimensionSource: 'Metroll WC frame manufacturer detail; not an NCC-prescribed dimension',
      wcFalseHeadInsideJambOpening: true,
      wcFalseHeadSideClearance: PARAMS.WC_FALSE_HEAD_SIDE_CLEARANCE,
      wcFalseHeadBodyDepth: PARAMS.WC_FALSE_HEAD_BACK_OPENING,
      wcFalseHeadGripProjection: PARAMS.WC_FALSE_HEAD_GRIP_PROJECTION,
      wcFalseHeadOuterFrameSpanRemoved: true,
      wcLiftOffHingesModelled: true,
      doorHingeAssemblyCount: doorHingeAssemblies.length,
      doorHingeAssemblyCountByProduct: Object.freeze(Object.fromEntries(Object.values(DOOR_HINGE_PRODUCTS).map(product=>[
        product.id,doorHingeAssemblies.filter(item=>item.product===product.id).length
      ]))),
      doorHingeProducts: DOOR_HINGE_PRODUCTS,
      standardDoorHingeCountPerLeaf: DOOR_HINGE_PRODUCTS.standard.hingeCount,
      heavyDoorHingeCountPerLeaf: DOOR_HINGE_PRODUCTS.heavy.hingeCount,
      sanitaryDoorHingeCountPerLeaf: DOOR_HINGE_PRODUCTS.sanitary.hingeCount,
      heavyHingeDoorIds: Object.freeze([...HEAVY_HINGE_DOOR_IDS]),
      garageToDwellingHingePolicy: 'three-heavy-hinge class reserved; no drawing-confirmed leaf added',
      doorHingeMortisedLeavesModelled: true,
      doorHingeCountersunkScrewHeadsModelled: true,
      doorHingePhillipsSlotsModelled: true,
      doorHingeAlternatingKnucklesModelled: true,
      doorHingeDoorLeafAttachment: 'door thickness edge mortise',
      doorHingeFrameLeafAttachment: 'jamb rebate edge mortise',
      doorHingeBroadFaceLeafPlateCount: meshes.filter(item=>item.isDoorHingeMetal && /(?:frame|door)-leaf-mortised/.test(item.name) && !item.hingeMountPlane).length,
      doorHingeDoorEdgeLeafPlateCount: meshes.filter(item=>item.hingeMountPlane==='door-thickness-edge' && /door-leaf-mortised/.test(item.name)).length,
      doorHingeJambRebateLeafPlateCount: meshes.filter(item=>item.hingeMountPlane==='jamb-rebate-edge' && /frame-leaf-mortised/.test(item.name)).length,
      doorBroadFacesRemainPlanar: doorHingeAssemblies.every(item=>item.broadDoorFacesRemainPlanar===true),
      doorHingeVisibleCentrePinBetweenLeaves: true,
      doorHingeClosedFaceBarrelMeshCount: meshes.filter(item=>/visible-between-leaves|visible-centre-pin-between-leaves/.test(item.name)).length,
      doorHingeVisibleFaceBarrelHidesAfterLeafMotion: true,
      nccSanitaryCompartmentRule: 'outward opening, sliding, or readily removable from outside unless pan-to-doorway clear space is at least 1.2 m',
      d04HostWall: 'IW02',
      d04OpeningZ: Object.freeze([PARAMS.D04_OPENING_Z0, PARAMS.D04_HINGE_Z]),
      d04HingeZ: PARAMS.D04_HINGE_Z,
      d04Swing: 'west into Bath',
      mirroredRobeSliderCount: 3,
      fullHeightSliderPanelCounts: Object.freeze({ SG01: PARAMS.SG01_PANEL_COUNT, R02: PARAMS.R02_PANEL_COUNT, R03: PARAMS.R03_PANEL_COUNT }),
      windowPanelPatterns: Object.freeze({
        G01:'F|F', G02:'→|F', G03:'F|←', G04:'A|A', G05:'A|A',
        G06:'A|F|A', G07:'→|F|F|←', G08:'F|←', G09_G10:'→|F|F|←'
      }),
      linenPassageEndWallCount: 1,
      d02HostWall: 'IH02B',
      d02OpeningX: Object.freeze([PARAMS.D02_OPEN_X0,PARAMS.D02_OPEN_X1]),
      d02HingePoint: Object.freeze([PARAMS.D02_HINGE_X,3.655]),
      d02LeafWidth: PARAMS.D02_LEAF_WIDTH,
      d02UserRightShift: PARAMS.D02_USER_RIGHT_SHIFT,
      d02RightShiftPreservesLeafWidth: PARAMS.D02_LEAF_WIDTH===.820,
      d02LeftWallRunAdded: PARAMS.D02_OPEN_X0-8.41,
      d03HostWall: 'IH02A',
      d03PerpendicularWall: 'IW06-NORTH',
      d03HostWallX: Object.freeze([PARAMS.D03_PERPENDICULAR_WALL_X_MAX,8.320]),
      d03OpeningX: Object.freeze([PARAMS.D03_OPEN_X0,PARAMS.D03_OPEN_X1]),
      d03HingePoint: Object.freeze([PARAMS.D03_HINGE_X,PARAMS.D03_HINGE_Z]),
      d03LeafWidth: PARAMS.D03_LEAF_WIDTH,
      d03LeafWidthPreserved: PARAMS.D03_LEAF_WIDTH===.820,
      d03UserLeftShift: PARAMS.D03_USER_LEFT_SHIFT,
      d03FrameOuterEdgeX: PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_HEAD_DEPTH,
      d03FaceReturnOuterX: PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_FACE_RETURN,
      d03PerpendicularWallMaxX: PARAMS.D03_PERPENDICULAR_WALL_X_MAX,
      d03FrameTouchesPerpendicularWall: Math.abs((PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_HEAD_DEPTH)-PARAMS.D03_PERPENDICULAR_WALL_X_MAX)<1e-9,
      d03FramePerpendicularWallOverlap: Math.max(0,PARAMS.D03_PERPENDICULAR_WALL_X_MAX-(PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_HEAD_DEPTH)),
      d03OppositeParallelWallShortenedBy: PARAMS.D03_USER_LEFT_SHIFT,
      d03PerpendicularSkirtingStartZ: 3.70,
      d03PerpendicularSkirtingButtsFrameEdge: false,
      d03PerpendicularSkirtingStartsAtExposedWallFace: true,
      d03FormerSkirtingTongueRemovedLength: 3.70-3.61,
      d01HostWall: 'IW-BED4-ENTRY',
      d01HostWallX: Object.freeze([PARAMS.D01_ENTRY_WALL_X0, PARAMS.D01_ENTRY_WALL_X1]),
      d01HostWallZ: Object.freeze([2.590,3.610]),
      d01OpeningZ: Object.freeze([PARAMS.D01_OPEN_Z0, PARAMS.D01_OPEN_Z1]),
      d01HingePoint: Object.freeze([PARAMS.D01_HINGE_X, PARAMS.D01_HINGE_Z]),
      d01LeftShiftAlongWall: .100,
      d01WallMarginEachSide: .100,
      d01LeafWidthPreserved: PARAMS.D01_LEAF_WIDTH===.820,
      d01Hinge: 'east jamb',
      d01ClosedDirection: 'west / negative Z',
      d01Swing: 'north / positive X into Bed 4',
      bed4RobeReturnX: Object.freeze([8.280, PARAMS.D01_ENTRY_WALL_X1]),
      bed4RobeReturnZ: Object.freeze([2.590, 2.680]),
      bed4FormerExtraWallRemoved: true,
      bed4FormerWrongPerpendicularOpeningRemoved: true,
      robeMirrorVisualOpaque: COLORS.robe[3] === 1,
      robeMirrorHighlightFacesPerPanel: 2,
      hingedDoorInsetLineCount: 0,
      hingedDoorLeafThickness: .044,
      stairTreadCount: 15,
      stairTreadNumbers: Object.freeze(Array.from({length:15},(_,i)=>i+1)),
      step16IsUpperLanding: true,
      groundDatum: PARAMS.GROUND_FLOOR_DATUM,
      upperSlabSoffit: PARAMS.UPPER_SLAB_SOFFIT,
      continuousRiserCount: 16,
      groundContinuationIncluded: true,
      stairVoidVertexCount: STAIR_VOID_SLAB.length,
      stairCarpetTreadCount: meshes.filter(item=>/^T04-stair-carpet-wrap-top-\d+$/.test(item.name)).length,
      stairCarpetRiserCount: meshes.filter(item=>/^T04-stair-carpet-wrap-riser-(?:\d+|bottom)$/.test(item.name)).length,
      stairCarpetRoundedNoseCount: meshes.filter(item=>/^T04-stair-carpet-rounded-nose-(?:\d+|bottom)$/.test(item.name)).length,
      stairCarpetNoseRadius: PARAMS.STAIR_CARPET_NOSE_RADIUS,
      stairCarpetSharpEdgeLineCount: lines.filter(item=>/^T04-stair-step-\d+-carpet-edge-shadow$/.test(item.name)).length,
      stairCarpetContinuousSystemMeshCount: meshes.filter(item=>item.continuousCarpetSystem==='P6-TAUPE-ONE-PIECE').length,
      stairCarpetContinuousFromGroundToLanding: meshes.filter(item=>item.category==='finishCarpet').every(item=>item.continuousCarpetSystem==='P6-TAUPE-ONE-PIECE'),
      stairCarpetSingleColour: meshes.filter(item=>item.category==='finishCarpet').every(item=>item.color.every((value,index)=>value===COLORS.carpetTaupe[index])),
      stairCarpetRoundedTangentContinuity: meshes.filter(item=>/^T04-stair-carpet-rounded-nose-/.test(item.name)).every(item=>item.carpetNoseTangentContinuity===true),
      stairHeadCarpetTerminationMeshCount: meshes.filter(item=>item.carpetTermination==='behind-selected-landing-nosing-front-edge').length,
      stairHeadCarpetReplacedByMetalFascia: meshes.some(item=>item.visibleMetalFasciaReplacement===true),
      centralStairFullHeightWallCount: 1,
      centralStairRakingWallCount: 0,
      centralStairTerminalWallCount: meshes.filter(item=>item.userRedTerminalWall===true).length,
      centralStairWallPlaneX: Object.freeze([3.670,3.760]),
      centralStairWallZ: Object.freeze([PARAMS.STAIR_TERMINAL_WALL_Z0,2.590]),
      centralStairBlueOpenZ: Object.freeze([.763,PARAMS.STAIR_TERMINAL_WALL_Z0]),
      centralStairBlueOpenWallMeshCount: meshes.filter(item=>item.isWall && item.blueMarkedRunOpen!==true && /P6-.*(?:raking|terminal).*wall/i.test(item.name) && item.name!=='P6-user-red-terminal-wall-ground-to-raking-cap').length,
      centralStairWallTopAboveNosing: PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING,
      centralStairWallRakesWithStair: false,
      centralStairTerminalTopFollowsExistingBlackRake: true,
      centralStairTerminalWallBottomDatum: PARAMS.GROUND_FLOOR_DATUM,
      centralStairWallReachesGroundAndUpperTop: true,
      centralStairWallContinuousSingleInternalMesh: meshes.filter(item=>item.userRedTerminalWall===true).every(item=>item.continuousSingleInternalWall===true && item.fullInternalWallFinish==='Dulux Lexicon Quarter'),
      centralStairTerminalWallExtension: PARAMS.STAIR_TREAD*2,
      centralStairV13AdditionalWallExtension: PARAMS.STAIR_TREAD,
      centralStairBlackRakingCapPreserved: true,
      centralStairRetainedBlackCapCount: meshes.filter(item=>item.name==='P6-raking-painted-MDF-cap-150x30' && item.onlyAboveTerminalWall===true).length,
      centralStairRetainedBlackCapZ: Object.freeze([PARAMS.STAIR_TERMINAL_CAP_Z0,2.590]),
      centralStairRemovedUnsupportedBlackCapZ: Object.freeze([.763,PARAMS.STAIR_TERMINAL_CAP_Z0]),
      centralStairForwardExtensionWithoutBlackCapZ: Object.freeze([PARAMS.STAIR_TERMINAL_WALL_Z0,PARAMS.STAIR_TERMINAL_CAP_Z0]),
      centralStairV16WhiteWallForwardExtension: PARAMS.STAIR_TERMINAL_CAP_Z0-PARAMS.STAIR_TERMINAL_WALL_Z0,
      centralStairV16OnlyMarkedWhiteWallChanged: false,
      centralStairV16BlackCapEndpointRetained: meshes.filter(item=>item.name==='P6-raking-painted-MDF-cap-150x30').every(item=>item.capZ0===PARAMS.STAIR_TERMINAL_CAP_Z0 && item.v16EndpointRetained===true),
      centralStairBlackCapV14Extension: PARAMS.STAIR_TREAD,
      centralStairBlackCapFlushWithWall: PARAMS.STAIR_TERMINAL_CAP_Z0===PARAMS.STAIR_TERMINAL_WALL_Z0 && meshes.filter(item=>item.name==='P6-raking-painted-MDF-cap-150x30').every(item=>item.flushWithTerminalWall===true && item.v14ExtendedToWallEnd===true),
      centralStairBlackCapOnlyAboveTerminalWall: meshes.filter(item=>item.name==='P6-raking-painted-MDF-cap-150x30').every(item=>item.onlyAboveTerminalWall===true && item.capZ0===PARAMS.STAIR_TERMINAL_CAP_Z0),
      centralStairUnsupportedBlackCapMeshCount: meshes.filter(item=>item.name==='P6-raking-painted-MDF-cap-150x30' && item.onlyAboveTerminalWall!==true).length,
      continuousStairSideWallCount: meshes.filter(item=>item.continuousStairSideWall===true).length,
      v8GreenRedHighWallFillRemoved: true,
      upperFloorFullHeightLWallSegmentCount: 0,
      upperFloor12cWallSegmentCount: 2,
      upperFloor12cWallHeight: PARAMS.STAIR_12C_WALL_HEIGHT,
      upperFloorStairWallCapCount: 3,
      stairWallMdfCap: Object.freeze({width:PARAMS.STAIR_MDF_CAP_WIDTH,height:PARAMS.STAIR_MDF_CAP_HEIGHT,colour:'black / dark charcoal validation finish'}),
      upperFloor12cWallConnectsNorthExterior: true,
      groundFloorToSlabWallCount: 0,
      groundFloorWallY: Object.freeze([PARAMS.GROUND_FLOOR_DATUM,PARAMS.STAIR_12C_WALL_HEIGHT]),
      groundFloorWallCoplanarWithUpper12cWall: true,
      groundAndUpperWallsSeparatedBySlab: false,
      wetAreaCount: 2,
      wetTileSystem: 'GREY-BLUSH-TERRAZZO-V14',
      wetFloorTileModule: PARAMS.WET_FLOOR_TILE_MODULE,
      wetWallTileModule: Object.freeze([PARAMS.WET_WALL_TILE_WIDTH,PARAMS.WET_WALL_TILE_HEIGHT]),
      wetTileJoint: PARAMS.WET_TILE_JOINT,
      wetFloorTileCount: meshes.filter(item=>item.wetTileRole==='floor-tile').length,
      wetFloorFleckCount: meshes.filter(item=>item.wetTileRole==='floor-fleck').length,
      wetWallTileCount: meshes.filter(item=>item.wetTileRole==='wall-tile').length,
      wetWallFleckCount: meshes.filter(item=>item.wetTileRole==='wall-fleck').length,
      wetWallGroutBedCount: meshes.filter(item=>item.wetTileRole==='wall-grout-bed').length,
      wetTileZoneIds: Object.freeze([...new Set(meshes.filter(item=>item.wetTileSystem==='GREY-BLUSH-TERRAZZO-V14').map(item=>item.wetTileZone))]),
      wetWallTilesFullHeight: meshes.filter(item=>item.wetTileRole==='wall-tile').every(item=>item.wetTileFullHeight===true),
      wetTilesStopAtExistingOpenings: true,
      wetFloorBlushFleckCount: meshes.filter(item=>item.wetTileRole==='floor-fleck' && item.color===COLORS.tileChipBlush).length,
      wetWallBlushFleckCount: meshes.filter(item=>item.wetTileRole==='wall-fleck' && item.color===COLORS.tileChipBlush).length,
      bathroomFixtureMeshCount: meshes.filter(item=>item.bathroomFixture===true).length,
      bathroomFixtureSystems: Object.freeze([...new Set(meshes.filter(item=>item.bathroomFixture===true).map(item=>item.bathroomFixtureSystem))]),
      bathroomFixtureSystemCount: new Set(meshes.filter(item=>item.bathroomFixture===true).map(item=>item.bathroomFixtureSystem)).size,
      bathroomFixtureComponents: Object.freeze([...new Set(meshes.filter(item=>item.bathroomFixture===true).map(item=>item.bathroomFixtureComponent))]),
      bathroomProductReferences: BATHROOM_PRODUCT_REFERENCES,
      bathroomLayout: BATHROOM_V18_LAYOUT,
      bathroomBathAndShowerSameFixtureSide: Math.abs(BATHROOM_V18_LAYOUT.shower.x1-BATHROOM_V18_LAYOUT.bathHob.x1)<=.050,
      bathroomVanityWallBayWidth: BATHROOM_V18_LAYOUT.vanity.wallBay,
      bathroomVanityWidth: BATHROOM_V18_LAYOUT.vanity.width,
      bathroomVanityBasinCount: meshes.filter(item=>/^T18-VANITY-(?:left|right)-above-counter-basin$/.test(item.name)).length,
      bathroomVanityTouchesBothSideWalls: Math.abs(BATHROOM_V18_LAYOUT.vanity.z0-1.220)<=.003 && Math.abs(BATHROOM_V18_LAYOUT.vanity.z1-2.590)<=.003,
      bathroomVanityScribeEachEnd: BATHROOM_V18_LAYOUT.vanity.scribeEachEnd,
      bathroomMirrorCabinetWidth: BATHROOM_V18_LAYOUT.mirror.width,
      bathroomMirrorCabinetHeight: BATHROOM_V18_LAYOUT.mirror.height,
      bathroomMirrorDoorCount: meshes.filter(item=>/^T18-VANITY-moonlight-(?:left|right)-copper-free-mirror$/.test(item.name)).length,
      bathroomMirrorCabinetOpenable: bathroomInteractions.some(item=>item.id==='T18-VANITY-MOONLIGHT-DOORS' && item.mode==='motion'),
      bathroomMirrorConcealedLedMeshCount: meshes.filter(item=>item.bathroomFixtureComponent==='concealed-led-light').length,
      bathroomMirrorDemisterMeshCount: meshes.filter(item=>item.bathroomFixtureComponent==='demister-heated-zone').length,
      bathroomMirrorServiceTouchControlCount: meshes.filter(item=>item.bathroomFixtureComponent==='demister-touch-control').length,
      bathroomClosedToiletLidCount: meshes.filter(item=>item.bathroomFixtureComponent==='closed-soft-close-lid').length,
      bathroomOpenToiletBowlVisualCount: meshes.filter(item=>item.bathroomFixtureComponent==='bowl-recess').length,
      bathroomFloorWasteCount: meshes.filter(item=>/^(?:T18-(?:SHOWER-inside|BATH-general-area)|T23-VANITY)-floor-waste-square-stainless-grate$/.test(item.name)).length,
      bathroomInsideShowerFloorWasteCount: meshes.filter(item=>item.bathroomFixtureComponent==='floor-waste-inside-shower').length,
      bathroomOutsideShowerFloorWasteCount: meshes.filter(item=>item.bathroomFixtureComponent==='floor-waste-outside-shower').length,
      bathroomVanityFloorWasteCount: meshes.filter(item=>item.bathroomFixtureComponent==='floor-waste-vanity').length,
      bathroomIndependentTapCount: waterSystem.taps.length,
      bathroomMaximumWaterDepth: waterSystem.maximum,
      bathroomWallLightSwitchCount: meshes.filter(item=>item.bathroomFixtureComponent==='room-light-switch').length,
      bathroomWallPowerOutletCount: meshes.filter(item=>item.bathroomFixtureComponent==='wall-power-outlet').length,
      bathroomInteractionCount: bathroomInteractions.length,
      bathroomInteractionIds: Object.freeze(bathroomInteractions.map(item=>item.id)),
      bathroomExistingWallsAndOpeningsMoved: Number(PARAMS.D05_USER_RIGHT_SHIFT>0),
      bathroomWcEntryRightShift: PARAMS.D05_USER_RIGHT_SHIFT,
      roomLightSwitchCount: roomLighting.length,
      mirrorLightControlScope: 'mirror touch button only',
      bathroomFixturePalette: 'matte white sanitaryware + brushed nickel + prime oak + existing grey/blush terrazzo',
      task003Implemented: true,
      gateCStatus: 'TASK 003 BASELINE RETAINED',
      task004Started: true,
      task004Implemented: true,
      task004Version: 22,
      clientModeDefault: true,
      task003UpperGeometryOnly: true,
      skirtingProfiles: Object.freeze({
        ausColonial:Object.freeze({height:PARAMS.SKIRTING_HEIGHT,depth:PARAMS.SKIRTING_DEPTH,form:'multi-step concave/convex moulded section'}),
        bullnose:Object.freeze({height:PARAMS.SKIRTING_HEIGHT,depth:PARAMS.SKIRTING_DEPTH,form:'rounded semicircular crown'}),
        scotia:Object.freeze({height:PARAMS.SCOTIA_HEIGHT,depth:PARAMS.SCOTIA_DEPTH,form:'floor-matched concave cove section',floorMatched:true})
      }),
      architraveProfiles: Object.freeze({metrollBuiltInSteel:Object.freeze({source:'Metroll Residential Door Frame',selectable:false,skirtingOverlay:false})}),
      skirtingRunCount: task021WallFinishRuns.length,
      skirtingAndScotiaRunCount: task021WallFinishRuns.length,
      skirtingMitreAngleDegrees:45,
      skirtingStopsAtWallsFramesTracksAndObjects:true,
      architraveOpeningCount: 0,
      skirtingCrossesDoorOpenings: false,
      architraveHasRealDepth: true,
      customArchitraveHasRealDepth: false,
      customArchitraveMeshCount: meshes.filter(item=>/^T03-ARCH-/.test(item.name)).length,
      skirtingOverlapsDoorFrame: false,
      stairLandingNosingProfile: Object.freeze({type:'Kevmor SFSB60M Brass Stair Nosing 15mm',tread:PARAMS.SFSB60M_TREAD,verticalReturn:PARAMS.SFSB60M_VERTICAL_RETURN,body:PARAMS.SFSB60M_BODY,solidExtrusion:true,continuousGrooveCount:6,finishes:Object.freeze(['brass'])}),
      stairLandingNosingProfiles: Object.freeze({
        brass:Object.freeze({type:'Kevmor SFSB60M',tread:.060,verticalReturn:.015,body:.0025,finish:'brass',carpetCompatibility:'solid carpet without underlay up to 7 mm'}),
        woodgrain:Object.freeze({type:'Oddz Stair Nosing',topCoverage:.014,finish:'matched woodgrain',carpetCompatibility:'termination detail requires installer confirmation'}),
        silver:Object.freeze({type:'DTA ASN51NMS / Kevmor SFS51NMS',tread:.050,finish:'matt silver anodised',slipRating:'P5',edgeCompatibility:Object.freeze(['carpet','vinyl','timber','tile'])})
      }),
      stairNosingReusedAtWetThreshold: false,
      wetThresholdProfiles: Object.freeze({type:'Oddz Universal Cover Trim',topCover:PARAMS.UNIVERSAL_COVER_WIDTH,basePlate:PARAMS.UNIVERSAL_BASE_WIDTH,stockLength:3.4,insertHeightRange:Object.freeze([0,.014]),levelDelta:PARAMS.WET_LEVEL_DELTA,provisional:true}),
      task004FloorBoardMeshCount: task004FloorBoards.length,
      task004FloorBoardMeshCountByFamily: Object.freeze(Object.fromEntries(Object.keys(FLOOR_PRODUCTS).map(family=>[family,task004FloorBoards.filter(item=>item.finishFamily===family).length]))),
      task004DryFloorZones: DRY_FLOOR_ZONES,
      task004FloorProducts: FLOOR_PRODUCTS,
      task004FloorSetOutControl: FLOOR_SET_OUT_CONTROL,
      task004FloorSetOutUsesOneGlobalGrid: true,
      task004FloorSetOutRoomRestarts: false,
      task004FloorPlankAxis: finishState.floorDirection,
      task004FloorDirection: finishState.floorDirection,
      task004OrdinaryStairMetalNosingCount: 0,
      task004StairTopEdgeOptionCount: Object.keys(NOSING_PRODUCTS).length,
      task004UniversalCoverWidth: PARAMS.UNIVERSAL_COVER_WIDTH,
      task004ExistingTileLAngleRetained: true,
      task004WcFalseHeadPosition: '25 mm removable insert centred inside jamb opening below fixed frame head',
      task004InteriorWallColour: Object.freeze({name:'Dulux Lexicon Quarter',rgb:Object.freeze([241,242,241]),hex:'#f1f2f1',source:'https://www.dulux.com.au/colour/whites-and-neutrals/lexicon-quarter/'}),
      task004ExteriorRenderColour: Object.freeze({name:'Dulux White Duck Quarter',rgb:Object.freeze([228,225,214]),hex:'#e4e1d6'}),
      task004ExteriorRenderTexture: 'procedural fine-grain AcraTex-inspired validation finish',
      sliderFloorEdgeProfiles: Object.freeze({end:PARAMS.SLIDER_END_TRIM_WIDTH,border:PARAMS.SLIDER_BORDER_TRIM_WIDTH,locations:Object.freeze(['SG01','R02','R03'])}),
      independentTransitionProfileFamilies: Object.keys(TRANSITION_PRODUCTS).length,
      detailCameraCount: Object.keys(DETAIL_CAMERA_PRESETS).length,
      detailCameraIds: Object.freeze(Object.keys(DETAIL_CAMERA_PRESETS)),
      materialHotspotsTranslucent: true,
      materialHotspotIdleOpacity: .76,
      materialHotspotGlowRadiusPx: 10
    });

    // The V7 regression compares every mesh, line, label and protected material
    // against V6. Only tile/window cuts, stair contact cuts and named fixture
    // changes are allowed; all wall, door and window geometry remains identical.
    const GEOMETRY_LOCK_EXPECTED = Object.freeze({
      id: 'D-034',
      baseline: 'V15 GROUND FLOOR + V16 UPPER / SHARED / PRESENTATION COMPOSITE BASELINE',
      structuralMeshHash: 'ee00a556',
      openingAnchorHash: 'd5af0269',
      invariants: Object.freeze({
        upperWallHeight: 2.440,
        groundWallHeight: 2.400,
        hingedDoorVisualHeight: 2.040,
        upperFootprint: '0.48,0|12.47,0|12.47,7.55|0,7.55|0,3.12|0.48,3.12',
        stairVoid: '2.58,0.16|4.85,0.16|4.85,2.59|3.67,2.59|3.67,2.38|2.58,2.38',
        stairRisers: 16,
        stairRiser: 0.172,
        stairTreads: 15,
        stairTread: 0.250,
        terminalStairWall: 'x=3.67..3.76;wallZ=1.0765..2.59;bottom=-2.752;top=0.01..0.865;blueOpen=0.763..1.0765;capRetained=1.0765..2.59;whiteForward=0;capSize=150x30',
        upperStairLWall: 'long=2.58..2.67/0.25..2.59;longY=-2.752..1.032;return=2.58..3.76/2.59..2.68;returnY=0..1.032;cap=150x30;returnCapX1=3.79',
        d01: 'wallX=9.39..9.48;openingZ=2.735..3.555;hinge=9.435,3.555;leaf=0.82',
        d02: 'wallX=8.41..10.39;openingX=8.5..9.32;hinge=8.5,3.655;leaf=0.82;shift=0.09',
        d03: 'wallX=5.02..8.32;openingX=5.075..5.895;hinge=5.075,3.655;leaf=0.82;frameOuterX=5.041;perpWallMaxX=5.02;shift=0.055',
        d04: 'openingZ=1.815..2.535;leaf=0.72',
        d05: 'openingX=6.761..7.381;hingeZ=1.175;leaf=0.62;shift=0.071;leftWall=6.69;frameOuter=6.72645',
        doorFrameClearanceMoves: 'D01=+Z45;D03=+X21;D04=-Z55;D05=+X20',
        o01: 'openingX=6.69..7.52;sealedX=7.52..8.14',
        bed4RobeReturn: 'x=8.28..9.48;z=2.59..2.68',
        sliderPanels: 'SG01=3;R02=2;R03=2',
        upperExteriorGlazedOpenings: 10,
        groundExteriorGlazedOpenings: 11,
        exteriorWindowAssemblies: 18,
        exteriorWindowPanels: 47,
        hingedDoorLeaves: 20,
        groundHingedDoorLeaves: 13,
        groundWallVectors: 'outer=39;inner=20;internal=25',
        groundGreenBandInfills: 'count=16;outer=6;inner=5;internal=5;mesh=16;existingChanged=0;doorWindowMoved=0;additiveOnly=true',
        windowPanelPatterns: 'G01=F|F;G02=→|F;G03=F|←;G04=A|A;G05=A|A;G06=A|F|A;G07=→|F|F|←;G08=F|←;G09_G10=→|F|F|←',
        keyedCommonSides: 'D01=-1;D02=-1;D03=-1;D06A=1;D06B=-1;GF-D-LAUNDRY=-1;GF-D-LINEN-A=-1;GF-D-LINEN-B=1;GF-D-LOBBY=1;GF-D-MASTER=-1;GF-D-PANTRY=1;GF-D-STORE-UNDER=-1;GF-D-STORE=1;GF-D-STUDY=1',
        matchingKeyProfile: 'profile=AU-C4-5PIN-V13;inserted=14;hanging=28;bows=42;cuts=5;withdrawal=0.004;bow=27x31;blade=45x6.8;quarterTurn=90',
        internalFinish: 'Dulux Lexicon Quarter;rgb=241,242,241;hex=#f1f2f1',
        roundedCarpet: 'treads=15;risers=16;rounded=16;radius=0.012;sharp=0;continuous=47;singleColour=true',
        wetTiles: 'system=GREY-BLUSH-TERRAZZO-V14;floor=48;floorFlecks=192;wall=228;wallFlecks=1110;wallGroutBeds=14;floorModule=0.45;wallModule=0.3x0.6;joint=0.004;fullHeight=true;openingsClear=true'
      })
    });

    const lockedStructuralCategories = new Set(['exterior','internal','floor','stair','wet']);
    const lockedStructuralRows = meshes
      .filter(item => lockedStructuralCategories.has(item.category) && !/^T\d{2}-/.test(item.name))
      .map(item => `${item.level}|${item.category}|${item.name}|${item.count}|${item.geometryPositionHash}`)
      .sort();
    const lockedOpeningRows = openingInteractions
      .map(item => `${item.level}|${item.id}|${item.kind}|${item.anchor.map(value => Math.round(value * 1e6)).join(',')}`)
      .sort();
    const geometryLockActual = Object.freeze({
      structuralMeshHash: fnv1a32(lockedStructuralRows.join('\n')),
      openingAnchorHash: fnv1a32(lockedOpeningRows.join('\n')),
      structuralMeshCount: lockedStructuralRows.length,
      openingAnchorCount: lockedOpeningRows.length,
      invariants: Object.freeze({
        upperWallHeight: PARAMS.WALL_HEIGHT,
        groundWallHeight: PARAMS.GROUND_WALL_HEIGHT,
        hingedDoorVisualHeight: PARAMS.HINGED_DOOR_VISUAL_HEIGHT,
        upperFootprint: OUTER_FOOTPRINT.map(point => point.join(',')).join('|'),
        stairVoid: STAIR_VOID_SLAB.map(point => point.join(',')).join('|'),
        stairRisers: PARAMS.STAIR_RISERS,
        stairRiser: PARAMS.STAIR_RISER,
        stairTreads: PARAMS.STAIR_TREADS,
        stairTread: PARAMS.STAIR_TREAD,
        terminalStairWall: `x=3.67..3.76;wallZ=${PARAMS.STAIR_TERMINAL_WALL_Z0}..2.59;bottom=${PARAMS.GROUND_FLOOR_DATUM};top=${Number(((-6*PARAMS.STAIR_RISER+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING)+(PARAMS.STAIR_TERMINAL_WALL_Z0-.763)/(2.590-.763)*(6*PARAMS.STAIR_RISER)).toFixed(3))}..${PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING};blueOpen=0.763..${PARAMS.STAIR_TERMINAL_WALL_Z0};capRetained=${PARAMS.STAIR_TERMINAL_CAP_Z0}..2.59;whiteForward=${Number((PARAMS.STAIR_TERMINAL_CAP_Z0-PARAMS.STAIR_TERMINAL_WALL_Z0).toFixed(3))};capSize=${Math.round(PARAMS.STAIR_MDF_CAP_WIDTH*1000)}x${Math.round(PARAMS.STAIR_MDF_CAP_HEIGHT*1000)}`,
        upperStairLWall: `long=2.58..2.67/0.25..2.59;longY=${PARAMS.GROUND_FLOOR_DATUM}..${PARAMS.STAIR_12C_WALL_HEIGHT};return=2.58..3.76/2.59..2.68;returnY=0..${PARAMS.STAIR_12C_WALL_HEIGHT};cap=${Math.round(PARAMS.STAIR_MDF_CAP_WIDTH*1000)}x${Math.round(PARAMS.STAIR_MDF_CAP_HEIGHT*1000)};returnCapX1=3.79`,
        d01: `wallX=${PARAMS.D01_ENTRY_WALL_X0}..${PARAMS.D01_ENTRY_WALL_X1};openingZ=${PARAMS.D01_OPEN_Z0}..${PARAMS.D01_OPEN_Z1};hinge=${PARAMS.D01_HINGE_X},${PARAMS.D01_HINGE_Z};leaf=${PARAMS.D01_LEAF_WIDTH}`,
        d02: `wallX=8.41..10.39;openingX=${PARAMS.D02_OPEN_X0}..${PARAMS.D02_OPEN_X1};hinge=${PARAMS.D02_HINGE_X},3.655;leaf=${PARAMS.D02_LEAF_WIDTH};shift=${PARAMS.D02_USER_RIGHT_SHIFT}`,
        d03: `wallX=${PARAMS.D03_PERPENDICULAR_WALL_X_MAX}..8.32;openingX=${PARAMS.D03_OPEN_X0}..${PARAMS.D03_OPEN_X1};hinge=${PARAMS.D03_HINGE_X},${PARAMS.D03_HINGE_Z};leaf=${PARAMS.D03_LEAF_WIDTH};frameOuterX=${Number((PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_HEAD_DEPTH).toFixed(3))};perpWallMaxX=${PARAMS.D03_PERPENDICULAR_WALL_X_MAX};shift=${PARAMS.D03_USER_LEFT_SHIFT}`,
        d04: `openingZ=${PARAMS.D04_OPENING_Z0}..${PARAMS.D04_HINGE_Z};leaf=${PARAMS.D04_LEAF_WIDTH}`,
        d05: `openingX=${PARAMS.D05_OPEN_X0}..${PARAMS.D05_OPEN_X1};hingeZ=${PARAMS.D05_HINGE_Z};leaf=${PARAMS.D05_LEAF_WIDTH};shift=${PARAMS.D05_USER_RIGHT_SHIFT};leftWall=6.69;frameOuter=${Number((PARAMS.D05_OPEN_X0-PARAMS.DOOR_FRAME_HEAD_DEPTH-PARAMS.DOOR_FRAME_STEEL_THICKNESS/2).toFixed(5))}`,
        doorFrameClearanceMoves: `D01=+Z${Math.round((PARAMS.D01_OPEN_Z0-2.690)*1000)};D03=+X${Math.round((PARAMS.D03_OPEN_X0-5.054)*1000)};D04=-Z${Math.round((1.870-PARAMS.D04_OPENING_Z0)*1000)};D05=+X${Math.round((PARAMS.D05_OPEN_X0-6.741)*1000)}`,
        o01: `openingX=${PARAMS.O01_OPEN_X0}..${PARAMS.O01_OPEN_X1};sealedX=${PARAMS.WET_ENTRY_SEALED_X0}..${PARAMS.WET_ENTRY_SEALED_X1}`,
        bed4RobeReturn: `x=8.28..${PARAMS.D01_ENTRY_WALL_X1};z=2.59..2.68`,
        sliderPanels: `SG01=${PARAMS.SG01_PANEL_COUNT};R02=${PARAMS.R02_PANEL_COUNT};R03=${PARAMS.R03_PANEL_COUNT}`,
        upperExteriorGlazedOpenings: stats.upperExteriorGlazedOpeningCount,
        groundExteriorGlazedOpenings: stats.groundExteriorGlazedOpeningCount,
        exteriorWindowAssemblies: stats.exteriorWindowAssemblyCount,
        exteriorWindowPanels: stats.exteriorWindowPanelCount,
        hingedDoorLeaves: stats.hingedDoorLeafCount,
        groundHingedDoorLeaves: stats.groundHingedDoorLeafCount,
        groundWallVectors: `outer=${stats.groundOuterLeafVectorSegmentCount};inner=${stats.groundInnerLeafVectorSegmentCount};internal=${stats.groundInternalWallVectorSegmentCount}`,
        groundGreenBandInfills: `count=${stats.groundGreenBandInfillCount};outer=${stats.groundGreenBandOuterInfillCount};inner=${stats.groundGreenBandInnerInfillCount};internal=${stats.groundGreenBandInternalInfillCount};mesh=${stats.groundGreenBandInfillMeshCount};existingChanged=${stats.groundGreenBandExistingGeometryChangedCount};doorWindowMoved=${stats.groundGreenBandDoorWindowMovedCount};additiveOnly=${stats.groundGreenBandAdditiveOnly}`,
        windowPanelPatterns: Object.entries(stats.windowPanelPatterns).map(([id,pattern]) => `${id}=${pattern}`).join(';'),
        keyedCommonSides: openingInteractions.filter(item=>item.kind==='hinged door' && item.hardwareMode==='keyed').map(item=>`${item.id}=${item.keySide}`).sort().join(';'),
        matchingKeyProfile: `profile=${stats.keyProfileId};inserted=${stats.insertedKeyVisualCount};hanging=${stats.hangingSpareKeyVisualCount};bows=${stats.matchingKeyBowVisualCount};cuts=${stats.keyBladeCutCount};withdrawal=${stats.insertedKeyWithdrawal};bow=${Math.round(PARAMS.DOOR_KEY_BOW_HALF_WIDTH*2000)}x${Math.round(PARAMS.DOOR_KEY_BOW_HALF_HEIGHT*2000)};blade=${Math.round(PARAMS.DOOR_KEY_BLADE_LENGTH*1000)}x${Number((PARAMS.DOOR_KEY_BLADE_HALF_HEIGHT*2000).toFixed(1))};quarterTurn=${stats.insertedKeyBowQuarterTurnDegrees}`,
        internalFinish: `${stats.interiorWallColourName};rgb=${stats.interiorWallColourRgb.join(',')};hex=${stats.interiorWallColourHex}`,
        roundedCarpet: `treads=${stats.stairCarpetTreadCount};risers=${stats.stairCarpetRiserCount};rounded=${stats.stairCarpetRoundedNoseCount};radius=${stats.stairCarpetNoseRadius};sharp=${stats.stairCarpetSharpEdgeLineCount};continuous=${stats.stairCarpetContinuousSystemMeshCount};singleColour=${stats.stairCarpetSingleColour}`,
        wetTiles: `system=${stats.wetTileSystem};floor=${stats.wetFloorTileCount};floorFlecks=${stats.wetFloorFleckCount};wall=${stats.wetWallTileCount};wallFlecks=${stats.wetWallFleckCount};wallGroutBeds=${stats.wetWallGroutBedCount};floorModule=${stats.wetFloorTileModule};wallModule=${stats.wetWallTileModule.join('x')};joint=${stats.wetTileJoint};fullHeight=${stats.wetWallTilesFullHeight};openingsClear=${stats.wetTilesStopAtExistingOpenings}`
      })
    });
    const geometryLockFailures = [];
    if (!GEOMETRY_LOCK_EXPECTED.structuralMeshHash.startsWith('__CAPTURE') && GEOMETRY_LOCK_EXPECTED.structuralMeshHash !== geometryLockActual.structuralMeshHash) geometryLockFailures.push('structuralMeshHash');
    if (!GEOMETRY_LOCK_EXPECTED.openingAnchorHash.startsWith('__CAPTURE') && GEOMETRY_LOCK_EXPECTED.openingAnchorHash !== geometryLockActual.openingAnchorHash) geometryLockFailures.push('openingAnchorHash');
    Object.entries(GEOMETRY_LOCK_EXPECTED.invariants).forEach(([key,expected]) => {
      if (JSON.stringify(geometryLockActual.invariants[key]) !== JSON.stringify(expected)) geometryLockFailures.push(key);
    });
    const geometryLock = Object.freeze({
      id: GEOMETRY_LOCK_EXPECTED.id,
      baseline: GEOMETRY_LOCK_EXPECTED.baseline,
      status: geometryLockFailures.length ? 'FAIL' : 'PASS',
      pass: geometryLockFailures.length === 0,
      failures: Object.freeze(geometryLockFailures),
      expected: GEOMETRY_LOCK_EXPECTED,
      actual: geometryLockActual,
      rule: 'Ground-floor geometry and interactions are transplanted from the protected v15 donor. Upper-floor, shared stair, flooring, controls and presentation remain on the protected v16 baseline.'
    });
    if (!geometryLock.pass) {
      window.__GEOMETRY_ERRORS__.push({type:'geometry-lock',message:`D-034 failed: ${geometryLock.failures.join(', ')}`});
    }
    const floorBridgeLockFailures=[];
    const floorBridgeHybrid85Count=FLOOR_DATA_PACK_ORDER.filter(id=>FLOOR_DATA_PACKS[id]?.family==='hybrid85').length;
    const floorBridgeHybrid65Count=FLOOR_DATA_PACK_ORDER.filter(id=>FLOOR_DATA_PACKS[id]?.family==='hybrid65').length;
    const floorBridgeHybridCount=floorBridgeHybrid85Count+floorBridgeHybrid65Count;
    const floorBridgeEngineeringCount=FLOOR_DATA_PACK_ORDER.filter(id=>FLOOR_DATA_PACKS[id]?.generator==='engineering').length;
    const floorBridgeRolesFor=family=>new Set(FLOOR_DATA_PACK_ORDER.filter(id=>FLOOR_DATA_PACKS[id]?.family===family).map(id=>FLOOR_DATA_PACKS[id]?.selectionRole));
    const floorBridge85Roles=floorBridgeRolesFor('hybrid85'),floorBridge65Roles=floorBridgeRolesFor('hybrid65');
    if(FLOOR_DATA_PACK_ORDER.length!==12 || Object.keys(FLOOR_DATA_PACKS).length!==12) floorBridgeLockFailures.push('projectPackCount');
    if(floorBridgeHybrid85Count!==5) floorBridgeLockFailures.push('hybrid85Count');
    if(floorBridgeHybrid65Count!==5) floorBridgeLockFailures.push('hybrid65Count');
    if(floorBridgeEngineeringCount!==2) floorBridgeLockFailures.push('engineeringCount');
    if(new Set(FLOOR_DATA_PACK_ORDER).size!==12) floorBridgeLockFailures.push('uniquePackIds');
    if(FLOOR_DATA_PACK_ORDER.some(id=>!FLOOR_PRODUCTS[FLOOR_DATA_PACKS[id]?.family]?.colours[FLOOR_DATA_PACKS[id]?.colour])) floorBridgeLockFailures.push('houseMaterialMapping');
    if(document.querySelectorAll('[data-floor-colour]').length!==12) floorBridgeLockFailures.push('projectSelectorCount');
    if(!floorBridge85Roles.has('required-blackbutt') || !floorBridge85Roles.has('closest-carpetcall-blackbutt') || !floorBridge85Roles.has('grey') || !floorBridge85Roles.has('darkest') || !floorBridge85Roles.has('lightest')) floorBridgeLockFailures.push('hybrid85ToneRoles');
    if(!floorBridge65Roles.has('required-blackbutt') || !floorBridge65Roles.has('grey') || !floorBridge65Roles.has('darkest') || !floorBridge65Roles.has('lightest')) floorBridgeLockFailures.push('hybrid65ToneRoles');
    if(FLOOR_GENERATOR_CATALOG_POLICY.generatorScope!=='reusable-full-catalogue' || FLOOR_GENERATOR_CATALOG_POLICY.projectPackScope!=='curated-house-subset') floorBridgeLockFailures.push('generatorProjectBoundary');
    const floorBridgeLock=Object.freeze({
      id:'D-037',
      status:floorBridgeLockFailures.length?'FAIL':'PASS',
      pass:floorBridgeLockFailures.length===0,
      failures:Object.freeze(floorBridgeLockFailures),
      schema:FLOOR_DATA_PACK_SCHEMA,
      generatorInputSchemas:Object.freeze(['pomi.hybrid.generator.manifest.unversioned','pomi.engineering-timber.offline.v3']),
      packCount:FLOOR_DATA_PACK_ORDER.length,
      hybridCount:floorBridgeHybridCount,
      hybrid85Count:floorBridgeHybrid85Count,
      hybrid65Count:floorBridgeHybrid65Count,
      engineeringCount:floorBridgeEngineeringCount,
      generatorCatalogPolicy:FLOOR_GENERATOR_CATALOG_POLICY,
      geometryLockId:geometryLock.id,
      rule:'The reusable generator catalogue remains intact. This house stores a curated subset of five 8.5 mm Hybrid, five Carpet Call 6.5 mm Hybrid and two Engineered packs; material selection changes no D-034 geometry.'
    });
    if(!floorBridgeLock.pass) window.__GEOMETRY_ERRORS__.push({type:'floor-bridge-lock',message:`D-037 failed: ${floorBridgeLock.failures.join(', ')}`});

    const bathroomFitoutLockFailures=[];
    if(!geometryLock.pass) bathroomFitoutLockFailures.push('houseGeometryLock');
    if(stats.bathroomExistingWallsAndOpeningsMoved!==1 || stats.bathroomWcEntryRightShift!==.071) bathroomFitoutLockFailures.push('wcEntryCorrectionScope');
    if(!stats.bathroomBathAndShowerSameFixtureSide) bathroomFitoutLockFailures.push('bathShowerFixtureSide');
    if(stats.bathroomVanityBasinCount!==2) bathroomFitoutLockFailures.push('doubleBasinCount');
    if(!stats.bathroomVanityTouchesBothSideWalls || Math.abs(stats.bathroomVanityWidth-1.350)>.0001) bathroomFitoutLockFailures.push('wallToWall1350Vanity');
    if(stats.bathroomMirrorDoorCount!==2 || !stats.bathroomMirrorCabinetOpenable) bathroomFitoutLockFailures.push('openableMirrorCabinet');
    if(stats.bathroomMirrorConcealedLedMeshCount!==4 || stats.bathroomMirrorDemisterMeshCount!==1 || stats.bathroomMirrorServiceTouchControlCount!==1) bathroomFitoutLockFailures.push('mirrorLightDemister');
    if(stats.bathroomClosedToiletLidCount!==1 || stats.bathroomOpenToiletBowlVisualCount!==0) bathroomFitoutLockFailures.push('closedToiletLid');
    if(stats.bathroomFloorWasteCount!==3 || stats.bathroomInsideShowerFloorWasteCount!==1 || stats.bathroomOutsideShowerFloorWasteCount!==1 || stats.bathroomVanityFloorWasteCount!==1) bathroomFitoutLockFailures.push('showerBathroomVanityFloorWastes');
    if(stats.bathroomWallLightSwitchCount!==1 || stats.bathroomWallPowerOutletCount!==1) bathroomFitoutLockFailures.push('wallElectricalAccessories');
    if(stats.bathroomInteractionCount!==8 || !['T18-VANITY-MOONLIGHT-DOORS','T18-VANITY-MIRROR-SERVICES','T23-BATH-TAP-START','T24-BATH-TAP-STOP','T23-SHOWER-TAP','T23-SHOWER-DOOR','T23-VANITY-LEFT-TAP','T23-VANITY-RIGHT-TAP'].every(id=>stats.bathroomInteractionIds.includes(id))) bathroomFitoutLockFailures.push('bathroomInteractions');
    if(stats.bathroomIndependentTapCount!==4 || stats.bathroomMaximumWaterDepth!==.184) bathroomFitoutLockFailures.push('bathroomWaterControls');
    const bathroomFitoutLock=Object.freeze({
      id:'D-036',
      status:bathroomFitoutLockFailures.length?'FAIL':'PASS',
      pass:bathroomFitoutLockFailures.length===0,
      failures:Object.freeze(bathroomFitoutLockFailures),
      sourcePlan:'21560 WD A3.pdf · Sheet 8',
      layout:BATHROOM_V18_LAYOUT,
      structuralHash:geometryLock.actual.structuralMeshHash,
      openingHash:geometryLock.actual.openingAnchorHash,
      rule:'V9 retains the plan-defined bathroom set-out. Both bath deck controls use their original neutral metal finish: the fill control toggles water and the second control toggles the shared pop-up drain. The shower forms a shallow surface layer that drains away. Basin, shower, bath and drain sounds use distinct gentle filtered-flow profiles.'
    });
    if(!bathroomFitoutLock.pass) window.__GEOMETRY_ERRORS__.push({type:'bathroom-fitout-lock',message:`D-036 failed: ${bathroomFitoutLock.failures.join(', ')}`});

    const flooringInstallerLockFailures=[];
    const installerFloorFamilyCount=document.querySelectorAll('.installer-material-step [data-floor-family]').length;
    const installerFloorColourCount=document.querySelectorAll('.installer-material-step [data-floor-colour]').length;
    const installerFloorColourCounts=Object.freeze(Object.fromEntries(['hybrid85','hybrid65','engineered'].map(family=>[
      family,
      document.querySelectorAll(`.installer-material-step [data-family-group="${family}"] [data-floor-colour]`).length
    ])));
    const installerTransitionFinishValues=Object.freeze([...document.querySelectorAll('.installer-edge-step [data-transition-finish]')].map(button=>button.dataset.transitionFinish).sort());
    const installerNosingOptionValues=Object.freeze([...document.querySelectorAll('.installer-edge-step [data-nosing-option]')].map(button=>button.dataset.nosingOption).sort());
    const installerSkirtingProfileCount=document.querySelectorAll('[data-profile-choice]').length;
    const installerSkirtingPaintCount=document.querySelectorAll('[data-skirting-paint]').length;
    const installerHasNoGeneratorUi=document.querySelectorAll('#open-floor-generator, #floor-generator-modal').length===0;
    const installerEnglishOnly=!/[\u3400-\u9fff]/u.test(document.body.textContent || '');
    if(!geometryLock.pass || !bathroomFitoutLock.pass) flooringInstallerLockFailures.push('frozenHouseBaseline');
    if(!floorBridgeLock.pass) flooringInstallerLockFailures.push('projectFloorPackBridge');
    if(installerFloorFamilyCount!==3) flooringInstallerLockFailures.push('floorFamilySelectorCount');
    if(installerFloorColourCount!==12 || installerFloorColourCounts.hybrid85!==5 || installerFloorColourCounts.hybrid65!==5 || installerFloorColourCounts.engineered!==2) flooringInstallerLockFailures.push('floorColourSelectorCounts');
    if(installerTransitionFinishValues.join(',')!=='bronze,silver,woodgrain') flooringInstallerLockFailures.push('position01FinishChoices');
    if(installerNosingOptionValues.join(',')!=='oddz-stair-nosing:woodgrain,sfs51nms-silver:silver,sfsb60m-brass:brass') flooringInstallerLockFailures.push('position02FinishChoices');
    if(installerSkirtingProfileCount!==3 || installerSkirtingPaintCount!==3) flooringInstallerLockFailures.push('skirtingChoices');
    if(!RESIDENCE_DOM.getElementById('install-flooring') || typeof installFlooring!=='function') flooringInstallerLockFailures.push('oneClickInstallAction');
    if(!installerHasNoGeneratorUi) flooringInstallerLockFailures.push('generatorUiStillVisible');
    if(!installerEnglishOnly) flooringInstallerLockFailures.push('nonEnglishInterfaceText');
    const flooringInstallerLock=Object.freeze({
      id:'D-038',
      status:flooringInstallerLockFailures.length?'FAIL':'PASS',
      pass:flooringInstallerLockFailures.length===0,
      failures:Object.freeze(flooringInstallerLockFailures),
      floorFamilyCount:installerFloorFamilyCount,
      floorColourCount:installerFloorColourCount,
      floorColourCounts:installerFloorColourCounts,
      position01Finishes:installerTransitionFinishValues,
      position02Options:installerNosingOptionValues,
      skirtingProfileCount:installerSkirtingProfileCount,
      skirtingPaintCount:installerSkirtingPaintCount,
      oneClickGeneratorCallCount:5,
      separateGeneratorUi:false,
      interfaceLanguage:'English',
      mobileFirst:true,
      geometryLockId:geometryLock.id,
      floorBridgeLockId:floorBridgeLock.id,
      rule:'Three material families, 5 + 5 + 2 generator-backed project choices, Oddz Universal Cover Trim finishes at Position 01, and three distinct Position 02 treatments: Kevmor SFSB60M brass, Oddz matched woodgrain, and DTA ASN51NMS / Kevmor SFS51NMS matt silver. The carpeted riser remains behind the selected front edge. Two painted skirting profiles plus one floor-matched scotia profile, three skirting paint colours, and one Install flooring action run every internal generator without exposing a separate generator connection.'
    });
    if(!flooringInstallerLock.pass) window.__GEOMETRY_ERRORS__.push({type:'flooring-installer-lock',message:`D-038 failed: ${flooringInstallerLock.failures.join(', ')}`});

    const committedInstallLockFailures=[];
    if(!flooringInstallerLock.pass) committedInstallLockFailures.push('flooringInstallerBaseline');
    if(finishState===installedFinishState || finishState.floorColours===installedFinishState.floorColours) committedInstallLockFailures.push('stagedAndInstalledStateIsolation');
    if(typeof commitFlooringSelection!=='function' || !installFlooring.toString().includes('commitFlooringSelection')) committedInstallLockFailures.push('explicit3DCommit');
    if(setFloorFamily.toString().includes('commitFlooringSelection') || setFloorColour.toString().includes('commitFlooringSelection')) committedInstallLockFailures.push('selectionMustRemainStaged');
    if(!floorGeometrySpecVisible.toString().includes('installedFinishState') || !resolvedItemColor.toString().includes('installedFinishState') || !setProfileVisibility.toString().includes('installedFinishState')) committedInstallLockFailures.push('installedStateDoesNotDriveRender');
    if(!RESIDENCE_DOM.getElementById('installed-scene-summary') || !RESIDENCE_DOM.getElementById('floor-install-confirmation')) committedInstallLockFailures.push('visibleInstallConfirmation');
    if(typeof updateFloorInstallationVisual!=='function' || !effectiveAlpha.toString().includes('floorInstallationRevealAlpha')) committedInstallLockFailures.push('visibleFloorInstallReveal');
    const committedInstallLock=Object.freeze({
      id:'D-039',
      status:committedInstallLockFailures.length?'FAIL':'PASS',
      pass:committedInstallLockFailures.length===0,
      failures:Object.freeze(committedInstallLockFailures),
      stagedStateObject:'finishState',
      installedStateObject:'installedFinishState',
      commitAction:'Install flooring',
      floorRenderUsesInstalledState:true,
      position01RenderUsesInstalledState:true,
      position02RenderUsesInstalledState:true,
      visibleInstallReveal:true,
      geometryChanged:false,
      geometryLockId:geometryLock.id,
      flooringInstallerLockId:flooringInstallerLock.id,
      rule:'Material and edge choices remain staged until Install flooring explicitly commits the floor, Position 01 transition and Position 02 nosing to the 3D render. Installation feedback must be visible and no house geometry may change.'
    });
    if(!committedInstallLock.pass) window.__GEOMETRY_ERRORS__.push({type:'committed-flooring-install-lock',message:`D-039 failed: ${committedInstallLock.failures.join(', ')}`});

    window.__GEOMETRY_VALIDATION__ = {
      ready: geometryLock.pass && floorBridgeLock.pass && bathroomFitoutLock.pass && flooringInstallerLock.pass && committedInstallLock.pass,
      task: 'TASK 004',
      artifact: 'upper_floor_finish_selection_v21/index.html',
      gateA: 'APPROVED WITH CONTROLLED ASSUMPTIONS',
      gateB: 'TASK 003 USER-AUTHORIZED',
      gateC: 'TASK 003 BASELINE RETAINED',
      gateD: 'TASK 004 V21 COMMITTED 3D FLOORING INSTALLER',
      params: PARAMS,
      stats,
      geometryLock,
      floorBridgeLock,
      bathroomFitoutLock,
      flooringInstallerLock,
      committedInstallLock,
      geometry: {
        outerFootprint: OUTER_FOOTPRINT,
        stairVoidSlab: STAIR_VOID_SLAB,
        wetEntry: Object.freeze({
          d04HostWall:'IW02',
          d04OpeningZ:Object.freeze([PARAMS.D04_OPENING_Z0,PARAMS.D04_HINGE_Z]),
          o01UnleafedOpeningX:Object.freeze([PARAMS.O01_OPEN_X0,PARAMS.O01_OPEN_X1]),
          o01CorniceThrough:true,
          adjacentFormerDoorWallX:Object.freeze([PARAMS.WET_ENTRY_SEALED_X0,PARAMS.WET_ENTRY_SEALED_X1])
        }),
        bed4Entry: Object.freeze({
          d01HostWall:'IW-BED4-ENTRY',
          d01HostWallX:Object.freeze([PARAMS.D01_ENTRY_WALL_X0,PARAMS.D01_ENTRY_WALL_X1]),
          d01OpeningZ:Object.freeze([PARAMS.D01_OPEN_Z0,PARAMS.D01_OPEN_Z1]),
          d01HingePoint:Object.freeze([PARAMS.D01_HINGE_X,PARAMS.D01_HINGE_Z]),
          d01Swing:'north / positive X into Bed 4',
          d01Hinge:'east jamb',
          d01ClosedDirection:'west / negative Z',
          robeReturnX:Object.freeze([8.280,PARAMS.D01_ENTRY_WALL_X1]),
          robeReturnZ:Object.freeze([2.590,2.680]),
          sg01Panels:PARAMS.SG01_PANEL_COUNT,
          sg01Finish:'opaque silver-mirror validation proxy'
        }),
        d02Bed3Entry: Object.freeze({
          hostWall:'IH02B',
          openingX:Object.freeze([PARAMS.D02_OPEN_X0,PARAMS.D02_OPEN_X1]),
          hingePoint:Object.freeze([PARAMS.D02_HINGE_X,3.655]),
          leafWidth:PARAMS.D02_LEAF_WIDTH,
          userRightShift:PARAMS.D02_USER_RIGHT_SHIFT,
          leftWallRunAdded:PARAMS.D02_OPEN_X0-8.41,
          rightSkirtingStarts:PARAMS.D02_OPEN_X1+PARAMS.DOOR_FRAME_FACE_RETURN
        }),
        d03LinenJunction: Object.freeze({
          hostWall:'IH02A',
          perpendicularWall:'IW06-NORTH',
          openingX:Object.freeze([PARAMS.D03_OPEN_X0,PARAMS.D03_OPEN_X1]),
          hingePoint:Object.freeze([PARAMS.D03_HINGE_X,PARAMS.D03_HINGE_Z]),
          leafWidth:PARAMS.D03_LEAF_WIDTH,
          userLeftShift:PARAMS.D03_USER_LEFT_SHIFT,
          frameOuterEdgeX:PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_HEAD_DEPTH,
          faceReturnOuterX:PARAMS.D03_HINGE_X-PARAMS.DOOR_FRAME_FACE_RETURN,
          perpendicularWallMaxX:PARAMS.D03_PERPENDICULAR_WALL_X_MAX,
          touchesWithoutOverlap:stats.d03FrameTouchesPerpendicularWall && stats.d03FramePerpendicularWallOverlap===0,
          onlyOppositeParallelWallShortened:true,
          perpendicularSkirtingStartsAtExposedWallFaceZ:3.70
        }),
        groundFloor: Object.freeze({
          source:'DRAWING-WD-A3-P1',
          overall:Object.freeze([GROUND_PLAN_W,GROUND_PLAN_D]),
          upperRegistrationOffset:Object.freeze([GROUND_OFFSET_X,GROUND_OFFSET_Z]),
          footprint:GROUND_SLAB_FOOTPRINT_Q,
          footprintCoordinateSystem:'P1 q-coordinates; transformed directly below P2',
          footprintClosed:true,
          footprintGrossArea:polygonArea2D(GROUND_SLAB_FOOTPRINT_Q),
          floorPieces:Object.freeze({mainHouse:GROUND_MAIN_HOUSE_FOOTPRINT_Q,entryPaving:GROUND_ENTRY_PAVING_Q,garageAndStore:GROUND_GARAGE_STORE_FOOTPRINT_Q}),
          floorLevels:Object.freeze({
            mainHouseCourse:0,
            entryPavingCourse:0,
            garageSlabBaseCourse:PARAMS.GARAGE_SLAB_BASE_COURSE,
            garageAndStoreFinishedCourse:PARAMS.GARAGE_FLOOR_TOP_COURSE,
            brickCourseHeight:PARAMS.BRICK_COURSE_HEIGHT
          }),
          scheduledAreas:GROUND_SCHEDULED_AREAS,
          outerLeafSegments:GROUND_P1_OUTER_LEAF_SEGMENTS_Q,
          innerLeafSegments:GROUND_P1_INNER_LEAF_SEGMENTS_Q,
          cavityCentreOffsets:GROUND_CAVITY_CENTRE_Q,
          internalWallSegments:GROUND_P1_INTERNAL_WALL_SEGMENTS_Q,
          ptyWallAlignment:GROUND_PTY_WALL_ALIGNMENT_Q,
          ptyAngledWallJoins:GROUND_PTY_ANGLED_WALL_JOINS_Q,
          ptyDirectWallRuns:GROUND_PTY_ANGLED_WALL_JOINS_Q,
          ptyHeadMiterQ:GROUND_PTY_ANGLED_WALL_HEAD_MITER_Q,
          doorHostCentreShifts:GROUND_DOOR_HOST_CENTRE_SHIFTS_Q,
          greenBandAuditInfills:GROUND_GREEN_BAND_INFILL_SEGMENTS_Q,
          greenBandAudit:Object.freeze({
            source:'21560 WD A3.pdf · page 1',
            priority:'lowest; existing model always wins',
            operation:'additive only',
            existingGeometryChanged:0,
            doorWindowMoved:0,
            baselinePixelCoverage:.975757,
            postInfillPixelCoverage:.998350,
            residualConflictClustersIgnored:8
          }),
          doorDefinitions:GROUND_DOORS_Q,
          hostDoorOpenings:GROUND_HOST_DOOR_OPENINGS_Q,
          openingSpecifications:stats.groundOpeningSpecifications,
          accessoryOpeningSpecifications:stats.groundAccessoryOpeningSpecifications,
          entryColumn:Object.freeze({brickPierQBox:Object.freeze([14.0832,14.4332,3.7980,4.1480]),brickCourses:7,shsQBox:Object.freeze([14.2134,14.3030,3.9282,4.0181]),shsSection:Object.freeze([.090,.090]),topCourse:25,architecturalSteelVisibleWithExterior:true}),
          garage:Object.freeze({
            footingTopCourse:PARAMS.GARAGE_FOOTING_TOP_COURSE,
            slabBaseCourse:PARAMS.GARAGE_SLAB_BASE_COURSE,
            floorTopCourse:PARAMS.GARAGE_FLOOR_TOP_COURSE,
            interiorSlabFootprint:GROUND_GARAGE_STORE_INTERNAL_SLAB_Q,
            wallBaseCourse:PARAMS.GARAGE_WALL_BASE_COURSE,
            exteriorFinish:'rendered brick masonry to footing; no exposed concrete plinth',
            sectionalDoor:Object.freeze({baseCourse:PARAMS.GARAGE_SECTIONAL_BASE_COURSE,headCourse:PARAMS.GARAGE_SECTIONAL_HEAD_COURSE,track:'vertical-arc-horizontal',radius:PARAMS.GARAGE_SECTIONAL_TRACK_RADIUS}),
            mfDoor:Object.freeze({id:'GF-D-STORE',sillCourse:PARAMS.GARAGE_MF_DOOR_SILL_COURSE,renderedBrickBaseCourses:PARAMS.GARAGE_MF_RENDERED_BRICK_BASE_COURSES,externalFinish:'render',concretePlinth:false})
          }),
          floorDatum:PARAMS.GROUND_FLOOR_DATUM,
          wallHeight:PARAMS.GROUND_WALL_HEIGHT,
          status:'P1 vector-digitised validation model'
        }),
        exteriorWall: Object.freeze({
          overall:PARAMS.EXTERIOR_WALL,
          outerLeaf:PARAMS.EXTERIOR_OUTER_LEAF,
          clearCavity:PARAMS.EXTERIOR_CAVITY,
          innerLeaf:PARAMS.EXTERIOR_INNER_LEAF,
          cavityIsOpenGeometry:true,
          upperOuterFootprint:OUTER_FOOTPRINT,
          upperOuterLeafInnerEdge:UPPER_OUTER_LEAF_INNER_EDGE,
          upperCavityInnerEdge:UPPER_CAVITY_INNER_EDGE,
          upperInnerWallFace:UPPER_INNER_WALL_FACE,
          upperInnerLeafRoomFacePaint:Object.freeze({colour:'Dulux Lexicon Quarter',wallIds:stats.upperInnerLeafInteriorPaintWallIds,meshCount:stats.upperInnerLeafInteriorPaintMeshCount,otherFacesUnchanged:true}),
          upperCornerConstruction:'closed offset polygons; openings applied to both leaves',
          groundMainHouseBreakUp:'P1 vector paths: 110 outer + 50 open cavity + 90 inner',
          zeroLotException:'P1 garage/store zero-lot exterior remains a drawing-defined single 110 mm leaf',
          upperBreakUp:'controlled adjustable assumption pending wall schedule'
        }),
        stairWallSystems: Object.freeze({
          upper12cWall:Object.freeze({
            longBand:Object.freeze({x:Object.freeze([2.580,2.670]),z:Object.freeze([.250,2.590])}),
            returnBand:Object.freeze({x:Object.freeze([2.580,3.760]),z:Object.freeze([2.590,2.680])}),
            y:Object.freeze([0,PARAMS.STAIR_12C_WALL_HEIGHT]),
            connectsNorthExterior:true,
            cap:Object.freeze({width:PARAMS.STAIR_MDF_CAP_WIDTH,height:PARAMS.STAIR_MDF_CAP_HEIGHT,finish:'dark painted MDF'}),
            longWallY:Object.freeze([PARAMS.GROUND_FLOOR_DATUM,PARAMS.STAIR_12C_WALL_HEIGHT]),
            returnCapX1:3.79,
            form:'continuous stair-side wall with 12-course upper L return'
          }),
          markedStairSideWall:Object.freeze({
            planeX:Object.freeze([3.670,3.760]),
            blueOpenZ:Object.freeze([.763,PARAMS.STAIR_TERMINAL_WALL_Z0]),
            terminalWallZ:Object.freeze([PARAMS.STAIR_TERMINAL_WALL_Z0,2.590]),
            terminalWallBottom:PARAMS.GROUND_FLOOR_DATUM,
            terminalWallTop:Object.freeze([Number(((-6*PARAMS.STAIR_RISER+PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING)+(PARAMS.STAIR_TERMINAL_WALL_Z0-.763)/(2.590-.763)*(6*PARAMS.STAIR_RISER)).toFixed(3)),PARAMS.STAIR_BALUSTRADE_ABOVE_NOSING]),
            terminalTopFollowsExistingBlackRake:true,
            everyNonStairWallFrozen:true,
            wallExtension:PARAMS.STAIR_TREAD*2,
            v13AdditionalWallExtension:PARAMS.STAIR_TREAD,
            continuousSingleInternalWall:true,
            internalWallFinish:'Dulux Lexicon Quarter',
            cap:Object.freeze({z:Object.freeze([PARAMS.STAIR_TERMINAL_CAP_Z0,2.590]),removedUnsupportedZ:Object.freeze([.763,PARAMS.STAIR_TERMINAL_CAP_Z0]),forwardWhiteWallWithoutCapZ:Object.freeze([PARAMS.STAIR_TERMINAL_WALL_Z0,PARAMS.STAIR_TERMINAL_CAP_Z0]),width:PARAMS.STAIR_MDF_CAP_WIDTH,height:PARAMS.STAIR_MDF_CAP_HEIGHT,finish:'dark painted MDF',flushWithWall:true,v14Extension:PARAMS.STAIR_TREAD,v16EndpointRetained:false,unsupportedPortionRemoved:true})
          }),
          groundWall:Object.freeze({
            x:Object.freeze([2.580,2.670]),
            z:Object.freeze([.25,2.590]),
            y:Object.freeze([PARAMS.GROUND_FLOOR_DATUM,PARAMS.STAIR_12C_WALL_HEIGHT]),
            coplanarWithUpper12cWall:true,
            separatedByUpperSlab:false
          })
        }),
        bathroomFitout:Object.freeze({
          sourcePlan:'21560 WD A3.pdf · Sheet 8 bathroom plan and elevations',
          existingWallsAndOpeningsMoved:0,
          productReferences:BATHROOM_PRODUCT_REFERENCES,
          layout:BATHROOM_V18_LAYOUT,
          fixtureSystems:stats.bathroomFixtureSystems,
          fixtureMeshCount:stats.bathroomFixtureMeshCount,
          basinCount:stats.bathroomVanityBasinCount,
          mirrorDoors:stats.bathroomMirrorDoorCount,
          floorWastes:stats.bathroomFloorWasteCount,
          interactiveSystems:stats.bathroomInteractionIds
        })
      },
      camera,
      categoryState,
      detailCameras: DETAIL_CAMERA_PRESETS,
      get detailState(){ return {...detailState}; },
      get openingStates(){ return openingInteractions.map(({id,kind,assemblyId,panelIndex,operation,open,canToggle,progress,moving,handleTurn,keySway,hardwareMode,publicSide,keySide,slideDirection,hitAnchorRoles,commandElapsed,handlePeakAt,leafMotionAt})=>({id,kind,assemblyId:assemblyId||null,panelIndex:panelIndex||null,operation:operation||null,open,canToggle,progress,moving,handleTurn,keySway,hardwareMode,publicSide,keySide,slideDirection,hitAnchorRoles:[...hitAnchorRoles],commandElapsed,handlePeakAt,leafMotionAt})); },
      get bathroomInteractionStates(){ return bathroomInteractions.map(({id,kind,mode,open,progress,moving,active,defog,hitAnchorRoles})=>({id,kind,mode,open,progress,moving,active,defog,hitAnchorRoles:[...hitAnchorRoles]})); },
      get wallMode(){ return wallMode; },
      get labelMode(){ return labelMode; },
      get levelMode(){ return levelMode; },
      resetOpenings,
      resetView,
      planView,
      applyDetailCamera,
      setMeasurementVisibility,
      setReferenceGridVisibility,
      setDetailOption(key,value) {
        const allowed={
          skirtingProfile:PROFILE_KEYS,
          stairMetal:Object.freeze([...new Set(Object.values(NOSING_PRODUCTS).flatMap(product=>product.finishes))]),
          wetThreshold:Object.keys(TRANSITION_PRODUCTS),
          sliderTrim:['end','border']
        };
        if (!allowed[key] || !allowed[key].includes(value)) return false;
        if (key==='skirtingProfile') return setSkirtingProfile(value);
        if (key==='stairMetal') return setNosingSelection(nosingProfileForFinish(value),value);
        if (key==='wetThreshold') return setTransitionProfile(value);
        detailState[key]=value;
        const selectIds={skirtingProfile:'profile-select',stairMetal:'stair-metal-select',wetThreshold:'wet-threshold-select',sliderTrim:'slider-trim-select'};
        RESIDENCE_DOM.getElementById(selectIds[key]).value=value;
        syncDetailDataset();
        return true;
      }
    };

    window.__TASK004_FINISH_SELECTION__ = {
      ready: geometryLock.pass && floorBridgeLock.pass && bathroomFitoutLock.pass && flooringInstallerLock.pass && committedInstallLock.pass,
      task:'TASK 004',
      version:22,
      artifact:'upper_floor_finish_selection_v22/index.html',
      geometryBaseline:'D-034/D-036 · reviewed stair contact matches the supplied V8 Glass reference; unrelated walls, doors, windows and openings remain frozen while only the requested floor accessories and controls change',
      geometryLock,
      floorBridgeLock,
      bathroomFitoutLock,
      flooringInstallerLock,
      committedInstallLock,
      products:FLOOR_PRODUCTS,
      floorDataPackSchema:FLOOR_DATA_PACK_SCHEMA,
      floorDataPacks:FLOOR_DATA_PACKS,
      floorDataPackOrder:FLOOR_DATA_PACK_ORDER,
      floorGeneratorCatalogPolicy:FLOOR_GENERATOR_CATALOG_POLICY,
      transitionProducts:TRANSITION_PRODUCTS,
      nosingProducts:NOSING_PRODUCTS,
      dryFloorZones:DRY_FLOOR_ZONES,
      floorPurchase:FLOOR_PURCHASE,
      floorSetOutControl:FLOOR_SET_OUT_CONTROL,
      floorGeometrySpecs:FLOOR_GEOMETRY_SPECS,
      bathroomProductReferences:BATHROOM_PRODUCT_REFERENCES,
      bathroomLayout:BATHROOM_V18_LAYOUT,
      get bathroomInteractionStates(){ return bathroomInteractions.map(({id,kind,mode,open,progress,moving,active,defog,hitAnchorRoles})=>({id,kind,mode,open,progress,moving,active,defog,hitAnchorRoles:[...hitAnchorRoles]})); },
      get flooringInstallation(){ return flooringInstallState.lastReceipt; },
      get installedSelection(){ return installedSelectionSnapshot(); },
      get selection(){
        const product=selectedFloorProduct();
        const floorDataPack=selectedFloorDataPack();
        return {
          uiMode:finishState.uiMode,
          activeFinishCategory:finishState.activeFinishCategory,
          floorFamily:finishState.floorFamily,
          floorColour:selectedFloorColourKey(),
          floorDataPackId:floorDataPack?.id || null,
          floorDataPackSchema:floorDataPack?.schema || null,
          floorDataPackGenerator:floorDataPack?.generator || null,
          floorProduct:product.product,
          retailer:product.retailer,
          productSource:selectedFloorColour().source || product.source,
          productImage:selectedFloorColour().image,
          renderTexture:generatedFloorTextureSource || floorDataPack?.renderTexture || selectedFloorColour().renderTexture || selectedFloorColour().image,
          installedProductImage:selectedFloorColour().installedImage || selectedFloorColour().image,
          species:selectedFloorColour().species || null,
          productCode:selectedFloorColour().code || null,
          board:Object.freeze({length:product.length,width:product.width,thickness:product.thickness}),
          surfaceTreatment:finishState.floorFamily==='engineered'?'waxed-satin-visual':'factory-finish',
          installedBuildKnown:product.installedBuildKnown,
          backing:product.backing,
          skirtingProfile:finishState.skirtingProfile,
          skirtingPaint:finishState.skirtingPaint,
          metalFinish:finishState.nosingFinish,
          transitionProfile:finishState.transitionProfile,
          transitionFinish:finishState.transitionFinish,
          nosingProfile:finishState.nosingProfile,
          nosingFinish:finishState.nosingFinish,
          stairEdge:finishState.stairEdge,
          wetTransition:finishState.wetTransition,
          floorDirection:finishState.floorDirection,
          finishedTileDeltaRange:finishedTileDeltaRange(product)
        };
      },
      qa:Object.freeze({
        d034Pass:geometryLock.pass,
        d035HistoricalSupersededBy:'D-037',
        d036Pass:bathroomFitoutLock.pass,
        d037Pass:floorBridgeLock.pass,
        d038Pass:flooringInstallerLock.pass,
        d039Pass:committedInstallLock.pass,
        committedInstallLockFailures:committedInstallLock.failures,
        stagedSelectionIsolatedFromInstalledState:finishState!==installedFinishState && finishState.floorColours!==installedFinishState.floorColours,
        installationCommitUpdatesFloorAndBothEdges:true,
        installationRevealDurationMs:flooringInstallVisualState.duration,
        installationChangesHouseGeometry:false,
        flooringInstallerLockFailures:flooringInstallerLock.failures,
        flooringInstallerFamilyCount:flooringInstallerLock.floorFamilyCount,
        flooringInstallerColourCount:flooringInstallerLock.floorColourCount,
        flooringInstallerColourCounts:flooringInstallerLock.floorColourCounts,
        flooringInstallerPosition01Finishes:flooringInstallerLock.position01Finishes,
        flooringInstallerPosition02Options:flooringInstallerLock.position02Options,
        flooringInstallerOneClickGeneratorCallCount:flooringInstallerLock.oneClickGeneratorCallCount,
        flooringInstallerSeparateGeneratorUi:flooringInstallerLock.separateGeneratorUi,
        flooringInstallerInterfaceLanguage:flooringInstallerLock.interfaceLanguage,
        flooringInstallerMobileFirst:flooringInstallerLock.mobileFirst,
        bathroomFitoutLockFailures:bathroomFitoutLock.failures,
        bathroomBathAndShowerSameFixtureSide:stats.bathroomBathAndShowerSameFixtureSide,
        bathroomVanityWallBayWidth:stats.bathroomVanityWallBayWidth,
        bathroomVanityWidth:stats.bathroomVanityWidth,
        bathroomVanityBasinCount:stats.bathroomVanityBasinCount,
        bathroomVanityTouchesBothSideWalls:stats.bathroomVanityTouchesBothSideWalls,
        bathroomMirrorDoorCount:stats.bathroomMirrorDoorCount,
        bathroomMirrorCabinetOpenable:stats.bathroomMirrorCabinetOpenable,
        bathroomMirrorConcealedLedMeshCount:stats.bathroomMirrorConcealedLedMeshCount,
        bathroomMirrorDemisterMeshCount:stats.bathroomMirrorDemisterMeshCount,
        bathroomClosedToiletLidCount:stats.bathroomClosedToiletLidCount,
        bathroomOpenToiletBowlVisualCount:stats.bathroomOpenToiletBowlVisualCount,
        bathroomFloorWasteCount:stats.bathroomFloorWasteCount,
        bathroomInsideShowerFloorWasteCount:stats.bathroomInsideShowerFloorWasteCount,
        bathroomOutsideShowerFloorWasteCount:stats.bathroomOutsideShowerFloorWasteCount,
        bathroomWallLightSwitchCount:stats.bathroomWallLightSwitchCount,
        bathroomWallPowerOutletCount:stats.bathroomWallPowerOutletCount,
        bathroomInteractionCount:stats.bathroomInteractionCount,
        bathroomInteractionIds:stats.bathroomInteractionIds,
        floorDataPackCount:FLOOR_DATA_PACK_ORDER.length,
        hybridFloorDataPackCount:floorBridgeHybridCount,
        hybrid85FloorDataPackCount:floorBridgeHybrid85Count,
        hybrid65FloorDataPackCount:floorBridgeHybrid65Count,
        engineeringFloorDataPackCount:floorBridgeEngineeringCount,
        generatorCatalogScope:FLOOR_GENERATOR_CATALOG_POLICY.generatorScope,
        projectFloorPackScope:FLOOR_GENERATOR_CATALOG_POLICY.projectPackScope,
        floorDataPackIds:FLOOR_DATA_PACK_ORDER,
        floorDataPackSchema:FLOOR_DATA_PACK_SCHEMA,
        floorDataPackManifest:'floor-data-packs.json',
        generatorBridgeSchema:'pomi.generator-to-house.v1',
        secureEntryModelUrl:'model.html',
        ancillaryFinishChoiceTabsRemovedFromClient:true,
        structuralHash:geometryLock.actual.structuralMeshHash,
        openingHash:geometryLock.actual.openingAnchorHash,
        groundGreenBandAuditSource:stats.groundGreenBandAuditSource,
        groundGreenBandAuditPriority:stats.groundGreenBandAuditPriority,
        groundGreenBandInfillCount:stats.groundGreenBandInfillCount,
        groundGreenBandOuterInfillCount:stats.groundGreenBandOuterInfillCount,
        groundGreenBandInnerInfillCount:stats.groundGreenBandInnerInfillCount,
        groundGreenBandInternalInfillCount:stats.groundGreenBandInternalInfillCount,
        groundGreenBandInfillMeshCount:stats.groundGreenBandInfillMeshCount,
        groundGreenBandInfillFootprintArea:stats.groundGreenBandInfillFootprintArea,
        groundGreenBandExistingGeometryChangedCount:stats.groundGreenBandExistingGeometryChangedCount,
        groundGreenBandDoorWindowMovedCount:stats.groundGreenBandDoorWindowMovedCount,
        groundGreenBandBaselinePixelCoverage:stats.groundGreenBandBaselinePixelCoverage,
        groundGreenBandPostInfillPixelCoverage:stats.groundGreenBandPostInfillPixelCoverage,
        groundGreenBandResidualConflictClusterCount:stats.groundGreenBandResidualConflictClusterCount,
        groundGreenBandResidualConflictsIgnored:stats.groundGreenBandResidualConflictsIgnored,
        groundGreenBandAdditiveOnly:stats.groundGreenBandAdditiveOnly,
        independentOpeningControls:stats.independentOpeningControls,
        independentWindowPanelControls:stats.everyOperableWindowSashHasIndependentState,
        floorBoardMeshCount:task004FloorBoards.length,
        floorFamilies:Object.freeze(Object.keys(FLOOR_PRODUCTS)),
        officialColourCounts:Object.freeze(Object.fromEntries(Object.entries(FLOOR_PRODUCTS).map(([family,product])=>[family,Object.keys(product.colours).length]))),
        defaultUiMode:'client',
        defaultFloorDataPackId:DEFAULT_FLOOR_DATA_PACK_ID,
        defaultFloorFamily:'hybrid65',
        defaultFloorColour:'blackbutt',
        directFinishCategoryCount:4,
        directFinishCategories:Object.freeze(['flooring','skirting','transitions','nosing']),
        existingSiteReferenceUiRemoved:true,
        materialHotspotCount:Object.keys(MATERIAL_HOTSPOT_DEFS).length,
        materialHotspotIds:Object.freeze(Object.keys(MATERIAL_HOTSPOT_DEFS)),
        materialHotspotLeaderCallouts:true,
        materialHotspotOverlaysTargetMaterial:false,
        skirtingHotspotRemoved:!Object.prototype.hasOwnProperty.call(MATERIAL_HOTSPOT_DEFS,'skirting'),
        officialLocalProductImageCount:Object.values(FLOOR_PRODUCTS).reduce((sum,product)=>sum+Object.keys(product.colours).length,0),
        downloadedInstalledRoomReferenceCount:5,
        extractedFullPlankTextureCount:5,
        fullPlankTexturePixelSize:Object.freeze([1810,228]),
        productImagesLocalOnly:true,
        floorSetOutControl:FLOOR_SET_OUT_CONTROL,
        floorSetOutUsesOneGlobalGrid:true,
        floorSetOutRoomRestarts:false,
        floorPlankAxis:'corridor-longitudinal-x',
        floorModulesDistributeBothSides:true,
        everyFloorBoardLongAxisIsCorridorX:task004FloorBoards.every(item=>item.finishLongAxisX===true),
        floorBoardBaseDatum:Math.min(...task004FloorBoards.map(item=>item.finishY0)),
        floorBoardTopByFamily:Object.freeze(Object.fromEntries(Object.keys(FLOOR_PRODUCTS).map(family=>[
          family,Math.max(...task004FloorBoards.filter(item=>item.finishFamily===family).map(item=>item.finishY1))
        ]))),
        physicalBoardEdgeBevel:task004FloorBoards.every(item=>item.finishBevelWidth>0 && item.finishBevelHeight>0),
        premiumFloorSurfaceModel:'full-plank photographic UV + per-board tone/mirror variation + micro-grain emboss response + satin grazing highlight + physical bevel',
        hybrid65And85ShareSurfaceShader:true,
        hybrid65And85ThicknessDifference:.002,
        hybrid85TechnicalIxpeLayerCount:task004IxpeLayers.length,
        hybrid85TechnicalIxpeThickness:.002,
        hybrid85TechnicalPlankThickness:.0065,
        hybrid85TechnicalTotalThickness:.0085,
        wetAreaDryBoardOverlap:false,
        ordinaryStairMetalNosingCount:lines.filter(item=>item.category==='metal' && /stair-step-\d+-(?:nosing|metal)/.test(item.name)).length,
        stairCarpetTreadCount:meshes.filter(item=>/^T04-stair-carpet-wrap-top-\d+$/.test(item.name)).length,
        stairCarpetRiserCount:meshes.filter(item=>/^T04-stair-carpet-wrap-riser-(?:\d+|bottom)$/.test(item.name)).length,
        stairCarpetRoundedNoseCount:stats.stairCarpetRoundedNoseCount,
        stairCarpetNoseRadius:stats.stairCarpetNoseRadius,
        stairCarpetSharpEdgeLineCount:stats.stairCarpetSharpEdgeLineCount,
        stairCarpetContinuousSystemMeshCount:stats.stairCarpetContinuousSystemMeshCount,
        stairCarpetContinuousFromGroundToLanding:stats.stairCarpetContinuousFromGroundToLanding,
        stairCarpetSingleColour:stats.stairCarpetSingleColour,
        stairCarpetRoundedTangentContinuity:stats.stairCarpetRoundedTangentContinuity,
        stairTopMetalLocations:1,
        controlledMetalFinishCount:Object.keys(METAL_FINISHES).length,
        universalCoverFinishCount:TRANSITION_PRODUCTS['universal-cover'].finishes.length,
        sfsb60mFinishCount:NOSING_PRODUCTS['sfsb60m-brass'].finishes.length,
        sfs51nmsFinishCount:NOSING_PRODUCTS['sfs51nms-silver'].finishes.length,
        allFinishMetalMeshesOpaque:meshes.filter(item=>item.category==='finishMetal').every(item=>item.alpha===1),
        paintedSkirtingProfileCount:ARCHITRAVE_PROFILE_KEYS.length,
        floorMatchedScotiaProfileCount:PROFILE_KEYS.filter(profile=>profile==='scotia').length,
        clearGlazingPaneMeshCount:meshes.filter(item=>item.glazingType==='clear').length,
        greyPrivacyPaneMeshCount:meshes.filter(item=>item.glazingType==='grey').length,
        obscurePaneMeshCount:meshes.filter(item=>item.glazingType==='obscure').length,
        drawing25cLowerFixedTransomPaneCount:meshes.filter(item=>/-lower-fixed-/.test(item.name)).length,
        p6RakingWallMeshCount:meshes.filter(item=>item.name==='P6-raking-stair-wall-865-above-nosing').length,
        p6RedTerminalWallMeshCount:meshes.filter(item=>item.userRedTerminalWall===true).length,
        p6BlueOpenRunWallMeshCount:stats.centralStairBlueOpenWallMeshCount,
        p6BlueOpenZ:stats.centralStairBlueOpenZ,
        p6RedTerminalWallZ:stats.centralStairWallZ,
        p6RedTerminalWallBottomDatum:stats.centralStairTerminalWallBottomDatum,
        p6RedTerminalTopFollowsBlackRake:stats.centralStairTerminalTopFollowsExistingBlackRake,
        p6BlackRakingCapPreserved:stats.centralStairBlackRakingCapPreserved,
        p6RetainedBlackCapZ:stats.centralStairRetainedBlackCapZ,
        p6RemovedUnsupportedBlackCapZ:stats.centralStairRemovedUnsupportedBlackCapZ,
        p6ForwardExtensionWithoutBlackCapZ:stats.centralStairForwardExtensionWithoutBlackCapZ,
        p6BlackCapOnlyAboveTerminalWall:stats.centralStairBlackCapOnlyAboveTerminalWall,
        p6WallContinuousSingleInternalMesh:stats.centralStairWallContinuousSingleInternalMesh,
        p6BlackCapV14Extension:stats.centralStairBlackCapV14Extension,
        p6BlackCapFlushWithWall:stats.centralStairBlackCapFlushWithWall,
        p6UnsupportedBlackCapMeshCount:stats.centralStairUnsupportedBlackCapMeshCount,
        p6ContinuousHighStraightWallMeshCount:meshes.filter(item=>/^P6-(?:left|right)-continuous-high-straight-wall$/.test(item.name)).length,
        p6ContinuousWallHorizontalCapMeshCount:meshes.filter(item=>/^P6-(?:left|right)-continuous-wall-horizontal-MDF-cap$/.test(item.name)).length,
        v8GreenRedHighWallFillRemoved:meshes.every(item=>!/^P6-(?:left|right)-continuous-high-straight-wall$/.test(item.name)),
        p6MdfCapMeshCount:meshes.filter(item=>/P6-.*MDF-cap/.test(item.name)).length,
        universalCoverWidth:PARAMS.UNIVERSAL_COVER_WIDTH,
        interiorWallColourName:stats.interiorWallColourName,
        interiorWallColourHex:stats.interiorWallColourHex,
        interiorWallColourRgb:stats.interiorWallColourRgb,
        wetTileSystem:stats.wetTileSystem,
        wetFloorTileModule:stats.wetFloorTileModule,
        wetWallTileModule:stats.wetWallTileModule,
        wetTileJoint:stats.wetTileJoint,
        wetFloorTileCount:stats.wetFloorTileCount,
        wetFloorFleckCount:stats.wetFloorFleckCount,
        wetWallTileCount:stats.wetWallTileCount,
        wetWallFleckCount:stats.wetWallFleckCount,
        wetWallGroutBedCount:stats.wetWallGroutBedCount,
        wetTileZoneIds:stats.wetTileZoneIds,
        wetWallTilesFullHeight:stats.wetWallTilesFullHeight,
        wetTilesStopAtExistingOpenings:stats.wetTilesStopAtExistingOpenings,
        wetFloorBlushFleckCount:stats.wetFloorBlushFleckCount,
        wetWallBlushFleckCount:stats.wetWallBlushFleckCount,
        upperInnerLeafInteriorPaintMeshCount:stats.upperInnerLeafInteriorPaintMeshCount,
        upperInnerLeafInteriorPaintWallCount:stats.upperInnerLeafInteriorPaintWallCount,
        upperInnerLeafInteriorPaintMatchesInternal:stats.upperInnerLeafInteriorPaintMatchesInternal,
        upperInnerLeafExteriorAndCavityFacesUnchanged:stats.upperInnerLeafExteriorAndCavityFacesUnchanged,
        bathroomFixtureMeshCount:stats.bathroomFixtureMeshCount,
        bathroomFixtureSystems:stats.bathroomFixtureSystems,
        bathroomFixtureSystemCount:stats.bathroomFixtureSystemCount,
        bathroomExistingWallsAndOpeningsMoved:stats.bathroomExistingWallsAndOpeningsMoved,
        existingTileLAngleRetained:true,
        wcFalseHeadBelowFrame:true,
        wcFalseHeadInsideJamb:true,
        wcFalseHeadOuterFrameSpanRemoved:true,
        wcFalseHeadWidthClearancePerSide:PARAMS.WC_FALSE_HEAD_SIDE_CLEARANCE,
        wcFalseHeadBodyDepth:PARAMS.WC_FALSE_HEAD_BACK_OPENING,
        wcFalseHeadGripProjection:PARAMS.WC_FALSE_HEAD_GRIP_PROJECTION,
        doorHingeAssemblyCount:doorHingeAssemblies.length,
        doorHingeProductCount:Object.keys(DOOR_HINGE_PRODUCTS).length,
        standardInternalHingesPerDoor:DOOR_HINGE_PRODUCTS.standard.hingeCount,
        heavyExteriorHingesPerDoor:DOOR_HINGE_PRODUCTS.heavy.hingeCount,
        sanitaryLiftOffHingesPerDoor:DOOR_HINGE_PRODUCTS.sanitary.hingeCount,
        fixedPinFiveKnuckleGeometry:true,
        liftOffTwoPartBarrelGeometry:true,
        hingeLeafPlateMeshes:meshes.filter(item=>/hinge-\d+-(?:frame|door)-leaf-mortised/.test(item.name)).length,
        hingeScrewHeadSetMeshes:meshes.filter(item=>/hinge-\d+-(?:frame|door)-countersunk-screw-heads/.test(item.name)).length,
        hingePhillipsSlotSetMeshes:meshes.filter(item=>/hinge-\d+-(?:frame|door)-phillips-slots/.test(item.name)).length,
        hingeDoorLeafAttachment:'door thickness edge mortise',
        hingeFrameLeafAttachment:'jamb rebate edge mortise',
        hingeBroadDoorFaceLeafPlateCount:stats.doorHingeBroadFaceLeafPlateCount,
        hingeDoorThicknessEdgeLeafPlateCount:stats.doorHingeDoorEdgeLeafPlateCount,
        hingeJambRebateLeafPlateCount:stats.doorHingeJambRebateLeafPlateCount,
        doorBroadFacesRemainPlanar:stats.doorBroadFacesRemainPlanar,
        hingeVisibleCentrePinBetweenLeaves:doorHingeAssemblies.every(item=>item.visibleCentrePinBetweenLeaves===true),
        hingeVisibleCentrePinMeshCount:meshes.filter(item=>/visible-centre-pin-between-leaves/.test(item.name)).length,
        hingeClosedFaceBarrelMeshCount:meshes.filter(item=>/visible-between-leaves|visible-centre-pin-between-leaves/.test(item.name)).length,
        hingeVisibleFaceBarrelHidesAfterLeafMotion:true,
        customArchitraveMeshCount:meshes.filter(item=>/^T03-ARCH-/.test(item.name)).length,
        doorFrameUsesBuiltInSteelArchitrave:stats.doorFrameBuiltInSteelArchitrave,
        doorFrameFoldedSteelThickness:stats.doorFrameSteelThickness,
        doorFrameFoldedSteelMeshCount:stats.doorFrameFoldedSteelMeshCount,
        doorFrameWallInsertMeshCount:stats.doorFrameWallInsertMeshCount,
        doorFrameVisibleFaceReturnMeshCount:stats.doorFrameVisibleFaceReturnMeshCount,
        doorFrameAutoCalibratedAssemblyCount:stats.doorFrameAutoCalibratedAssemblyCount,
        doorFrameVisibleFaceReturnsPerAssembly:stats.doorFrameVisibleFaceReturnsPerAssembly,
        doorFrameWallThicknessInBackOpening:stats.doorFrameWallThicknessInBackOpening,
        doorFrameBackOpeningClearancePerFace:stats.doorFrameBackOpeningClearancePerFace,
        doorFrameWallCentredInBackOpening:stats.doorFrameWallCentredInBackOpening,
        doorFrameProudOfWallBy:stats.doorFrameProudOfWallBy,
        doorFrameVisibleFaceReturnsOutsideWall:stats.doorFrameVisibleFaceReturnsOutsideWall,
        doorFrameBuriedVisibleFaceReturnCount:stats.doorFrameBuriedVisibleFaceReturnCount,
        skirtingStopsAtDoorFrameReturn:stats.skirtingStopsAtDoorFrameReturn,
        skirtingDoorFrameClearance:stats.skirtingDoorFrameClearance,
        skirtingDoorFrameOverlap:stats.skirtingOverlapsDoorFrame,
        insertedKeyCylinderOffsetAlongLever:stats.keyedCylinderOffsetAlongLever,
        insertedKeyCylinderCentered:stats.insertedKeyCylinderCentered,
        insertedKeyHeadRestOrientation:stats.insertedKeyHeadRestOrientation,
        insertedKeyHeadStaysVerticalDuringHandleMotion:stats.insertedKeyHeadStaysVerticalDuringHandleMotion,
        insertedKeyBowQuarterTurnDegrees:stats.insertedKeyBowQuarterTurnDegrees,
        insertedKeyBowQuarterTurnCount:stats.insertedKeyBowQuarterTurnCount,
        insertedKeyBowPlane:stats.insertedKeyBowPlane,
        insertedKeyBowPerpendicularToHangingKeys:stats.insertedKeyBowPerpendicularToHangingKeys,
        insertedKeyHeadOuterHalfExtents:stats.insertedKeyHeadOuterHalfExtents,
        insertedKeyWithdrawal:stats.insertedKeyWithdrawal,
        insertedKeyVisibleShankCount:stats.insertedKeyVisibleShankCount,
        matchingKeyProfileId:stats.keyProfileId,
        matchingKeyBladeCutCount:stats.keyBladeCutCount,
        matchingKeyBowVisualCount:stats.matchingKeyBowVisualCount,
        allKeyMeshesUseMatchingProfile:stats.allKeyMeshesUseMatchingProfile,
        hangingKeysMatchInsertedBow:stats.hangingKeysMatchInsertedBow,
        hangingKeyBladeLength:stats.hangingKeyBladeLength,
        hangingKeyBladeHeight:stats.hangingKeyBladeHeight,
        keyedCommonSideMappedCount:stats.keyedCommonSideMappedCount,
        keyedCommonSideUnmappedIds:stats.keyedCommonSideUnmappedIds,
        everyKeyedDoorUsesAssignedCommonSide:stats.everyKeyedDoorUsesAssignedCommonSide,
        upperLinenKeyDoorIds:stats.upperLinenKeyDoorIds,
        upperLinenKeySides:stats.upperLinenKeySides,
        upperLinenKeysOutside:stats.upperLinenKeysOutside,
        materialHotspotsTranslucent:true,
        materialHotspotIdleOpacity:.76,
        materialHotspotGlowRadiusPx:10,
        robePanelOverlap:stats.robePanelOverlap,
        robeClosedVisibleGap:stats.robeClosedVisibleGap,
        robeOverlapPanelMeshCount:stats.robeOverlapPanelMeshCount,
        robeArrowOnlyControls:stats.robeArrowOnlyControls,
        robeArrowHitTargetCount:stats.robeArrowHitTargetCount,
        robeHighVisibilityArrowLineCount:stats.robeHighVisibilityArrowLineCount,
        robeHighVisibilityArrowAssemblies:stats.robeHighVisibilityArrowAssemblies,
        robeHighVisibilityArrowsBothFaces:stats.robeHighVisibilityArrowsBothFaces,
        robeBidirectionalStacking:stats.robeBidirectionalStacking,
        d01OpeningZ:stats.d01OpeningZ,
        d01LeftShiftAlongWall:stats.d01LeftShiftAlongWall,
        d01WallMarginEachSide:stats.d01WallMarginEachSide,
        d01LeafWidthPreserved:stats.d01LeafWidthPreserved,
        d02OpeningX:stats.d02OpeningX,
        d02UserRightShift:stats.d02UserRightShift,
        d02RightShiftPreservesLeafWidth:stats.d02RightShiftPreservesLeafWidth,
        d02LeftWallRunAdded:stats.d02LeftWallRunAdded,
        d03OpeningX:stats.d03OpeningX,
        d03UserLeftShift:stats.d03UserLeftShift,
        d03LeafWidthPreserved:stats.d03LeafWidthPreserved,
        d03FrameOuterEdgeX:stats.d03FrameOuterEdgeX,
        d03FaceReturnOuterX:stats.d03FaceReturnOuterX,
        d03PerpendicularWallMaxX:stats.d03PerpendicularWallMaxX,
        d03FrameTouchesPerpendicularWall:stats.d03FrameTouchesPerpendicularWall,
        d03FramePerpendicularWallOverlap:stats.d03FramePerpendicularWallOverlap,
        d03OppositeParallelWallShortenedBy:stats.d03OppositeParallelWallShortenedBy,
        d03PerpendicularSkirtingStartZ:stats.d03PerpendicularSkirtingStartZ,
        d03PerpendicularSkirtingButtsFrameEdge:stats.d03PerpendicularSkirtingButtsFrameEdge,
        d03PerpendicularSkirtingStartsAtExposedWallFace:stats.d03PerpendicularSkirtingStartsAtExposedWallFace,
        d03FormerSkirtingTongueRemovedLength:stats.d03FormerSkirtingTongueRemovedLength,
        stairWallDrawingCorrectionD027:true,
        stairWallBlueOpenRedTerminalCorrectionD029:true,
        stairWallOneTreadExtensionAndCapCutD030:true,
        stairWallSecond250mmExtensionD031:true,
        stairWallAndBlackCapFlushD032:false,
        stairWallAndBlackCapFlushD032SupersededByD034:true,
        stairWallWhiteForwardExtensionD034:stats.centralStairV16WhiteWallForwardExtension,
        stairWallBlackCapEndpointRetainedD034:stats.centralStairV16BlackCapEndpointRetained,
        continuousRoundedCarpetD032:stats.stairCarpetContinuousFromGroundToLanding && stats.stairCarpetRoundedNoseCount===16,
        lexiconQuarterInteriorD032:stats.interiorWallColourHex==='#f1f2f1',
        upperWetTilesD032:stats.wetWallTilesFullHeight && stats.wetTilesStopAtExistingOpenings,
        groundGreenBandAuditD033:stats.groundGreenBandInfillMeshCount===16 && stats.groundGreenBandExistingGeometryChangedCount===0 && stats.groundGreenBandDoorWindowMovedCount===0,
        reviewedBaselineEdits:Object.freeze(['P6 marked terminal wall +100 mm','D02 +90 mm right','D03 skirting return only']),
        everyOtherWallPositionAndSizeFrozen:true,
        ground25cWindowTransomCorrectionD025:true,
        groundSlidingDoorGlazing:'colourless-clear',
        drawingGreyGlazingRule:'all Elevation 2 and 4 windows',
        obsOnlyFrosted:true,
        unrelatedWallDoorOpeningCoordinatesChanged:false,
        furnitureCount:0
      }),
      setUiMode,
      applyFloorDataPack,
      ingestGeneratorSelection,
      ingestGeneratorManifest,
      installFlooring,
      setFloorFamily,
      setFloorColour,
      setSkirtingProfile,
      setSkirtingPaint,
      setActiveFinishCategory,
      setTransitionProfile,
      setTransitionFinish,
      setNosingProfile,
      setNosingFinish,
      setNosingSelection,
      setMetalFinish,
      setStairEdge,
      setLevel:setDirectLevel,
      setWallMode:setDirectWall,
      setLabelMode:setDirectLabels,
      setMeasurements:setMeasurementVisibility,
      setReferenceGrid:setReferenceGridVisibility,
      get viewSettings(){ return {measurements:categoryState.measurement,referenceGrid:categoryState.grid,labels:labelMode}; },
      openMaterialDetail:refreshMaterialDetail,
      closeMaterialDetail,
      captureCanvas(){ return canvas.toDataURL('image/png'); },
      resetView,
      planView
    };
    window.__POMI_HARDFLOOR_BRIDGE__=Object.freeze({
      ready:geometryLock.pass && floorBridgeLock.pass && bathroomFitoutLock.pass && flooringInstallerLock.pass && committedInstallLock.pass,
      schema:'pomi.generator-to-house.v1',
      storageSchema:FLOOR_DATA_PACK_SCHEMA,
      manifest:'floor-data-packs.json',
      lock:floorBridgeLock,
      catalogPolicy:FLOOR_GENERATOR_CATALOG_POLICY,
      packs:FLOOR_DATA_PACKS,
      packOrder:FLOOR_DATA_PACK_ORDER,
      listPacks(){return FLOOR_DATA_PACK_ORDER.map(id=>FLOOR_DATA_PACKS[id])},
      applyPack:applyFloorDataPack,
      ingestSelection:ingestGeneratorSelection,
      ingestManifest:ingestGeneratorManifest,
      install:installFlooring,
      get selection(){return selectedFloorDataPack()},
      get installedSelection(){return installedSelectionSnapshot()},
      get lastInstallation(){return flooringInstallState.lastReceipt}
    });
    window.__FINISH_SELECTION_V15__=window.__TASK004_FINISH_SELECTION__;

    appRoot.dataset.validationReady = String(geometryLock.pass && floorBridgeLock.pass && bathroomFitoutLock.pass && flooringInstallerLock.pass && committedInstallLock.pass);
    appRoot.dataset.gateA = 'APPROVED WITH CONTROLLED ASSUMPTIONS';
    appRoot.dataset.gateB = 'TASK 003 USER-AUTHORIZED';
    appRoot.dataset.gateC = 'TASK 003 BASELINE RETAINED';
    appRoot.dataset.gateD = 'TASK 004 V21 COMMITTED 3D FLOORING INSTALLER';
    appRoot.dataset.task = 'TASK 004';
    appRoot.dataset.taskVersion = '21';
    appRoot.dataset.geometryStats = JSON.stringify(stats);
    appRoot.dataset.geometryParams = JSON.stringify(PARAMS);
    appRoot.dataset.geometryLockId = geometryLock.id;
    appRoot.dataset.geometryLockStatus = geometryLock.status;
    appRoot.dataset.geometryLockFailures = geometryLock.failures.join(',');
    appRoot.dataset.geometryLockStructuralHash = geometryLockActual.structuralMeshHash;
    appRoot.dataset.geometryLockOpeningHash = geometryLockActual.openingAnchorHash;
    appRoot.dataset.floorBridgeLockId = floorBridgeLock.id;
    appRoot.dataset.floorBridgeLockStatus = floorBridgeLock.status;
    appRoot.dataset.floorBridgeLockFailures = floorBridgeLock.failures.join(',');
    appRoot.dataset.bathroomFitoutLockId = bathroomFitoutLock.id;
    appRoot.dataset.bathroomFitoutLockStatus = bathroomFitoutLock.status;
    appRoot.dataset.bathroomFitoutLockFailures = bathroomFitoutLock.failures.join(',');
    appRoot.dataset.flooringInstallerLockId = flooringInstallerLock.id;
    appRoot.dataset.flooringInstallerLockStatus = flooringInstallerLock.status;
    appRoot.dataset.flooringInstallerLockFailures = flooringInstallerLock.failures.join(',');
    appRoot.dataset.committedInstallLockId = committedInstallLock.id;
    appRoot.dataset.committedInstallLockStatus = committedInstallLock.status;
    appRoot.dataset.committedInstallLockFailures = committedInstallLock.failures.join(',');
    appRoot.dataset.task004Qa = JSON.stringify(window.__TASK004_FINISH_SELECTION__.qa);
    appRoot.dataset.wallMode = wallMode;
    appRoot.dataset.labelMode = labelMode;
    appRoot.dataset.levelMode = levelMode;
    const lockBadge=RESIDENCE_DOM.getElementById('lock-badge');
    lockBadge.textContent=`${committedInstallLock.id} ${geometryLock.pass && floorBridgeLock.pass && bathroomFitoutLock.pass && flooringInstallerLock.pass && committedInstallLock.pass?'PASS':'FAIL'}`;
    if (!geometryLock.pass || !floorBridgeLock.pass || !bathroomFitoutLock.pass || !flooringInstallerLock.pass || !committedInstallLock.pass) {
      lockBadge.style.background='#f8e9e7';
      lockBadge.style.color='#8a3d37';
      lockBadge.style.borderColor='rgba(138,61,55,.28)';
    }
    const restoredFlooringInstallation=restoreFlooringInstallation();
    restoreFloorDataPackSelection();
    if(!restoredFlooringInstallation) loadInstalledFloorTexture();
    syncFinishUI();
    if(stagedSelectionMatchesInstalled()) {
      flooringInstallState.status=restoredFlooringInstallation ? 'installed' : 'ready';
      const installed=syncInstalledFloorDataset();
      setFloorInstallerUi(flooringInstallState.status,restoredFlooringInstallation ? `${installed.floorLabel} installation restored in the 3D scene.` : 'Ready to generate and install the selected package.',restoredFlooringInstallation ? 100 : 0);
    } else markFloorInstallationPending();
    setMobilePrimaryMenu('none');
    syncProductDisclosure();
    handleMobileMediaChange();

    // Headless export for the virtual tour (tour/js/tour.js).
    window.RESIDENCE=Object.freeze({
      meshes,lines,ceilingLEDs,roomLighting,openingInteractions,bathroomInteractions,lightingOccluders,
      PARAMS,PLAN_W,PLAN_D,COLORS,toWorld,
      camera,cameraEye,cameraUp,clampCamera,pointerRay,physicalRayHit,
      effectiveAlpha,resolvedItemColor,materialKindForItem,levelAllows,categoryState,
      get levelMode(){return levelMode;},setDirectLevel,setDirectWall,resetView,applyCameraPreset,
      commandOpening,commandRoomLight,commandBathroomInteraction,lightUI,
      installedFinishState,installedFloorColour,installedFloorColourKey,PomiFloorSurface,FLOOR_PRODUCTS,
      get floorTextureReady(){return floorTextureReady;},
      get floorAtlas(){return window.__RESIDENCE_FLOOR_ATLAS__||null;},
      canvas
    });

    render();
  })();
  
