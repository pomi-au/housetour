# Residence virtual tour

`tour.html` shows the residence 3D model with no panels. Click any floor to walk inside.

## Run

Open the page through a local web server. Browsers block WebGL texture uploads from `file://` images, so the wood floor texture needs `http://`.

    ./tour/serve.command

This starts `python3 -m http.server 8765` and opens `http://localhost:8765/tour.html`.

## Controls

On load the overview starts as a plan view and turns over into the isometric view.

Overview: drag to orbit, scroll to zoom, right-drag to pan. Keys `1` ground, `2` upper, `3` both floors. Click a floor to start the tour.

Walking: `W A S D` or arrows walk, `Shift` runs, mouse looks, mouse wheel zooms in and out (any step restores the default view). Click or `E` opens doors and flips light switches. `T` opens the lighting panel, `H` shows the downlight cones, `O` toggles ambient occlusion. `Esc` or the Exit button returns to the overview. A wall clock on the upper landing shows the simulated time (1 hour every 2.5 s).

Touch devices: drag to look, pinch to zoom, tap a door or switch to use it. On-screen buttons walk forward and backward.

In the walking view the upper level sits 0.2 m lower than in the overview, so the upper slab rests on the ground ceiling with no void between them. The stair, its guard walls and the switch pick boxes follow the same drop: parts below the upper datum are compressed with the stair, parts above move down with the upper level.

Mirrored wardrobe sliders and the shower glass carry glossy planar reflections (25 % mirror), and the vanity cabinet doors carry full mirrors that swing with the doors. Reflections render only while close and on screen, show one bounce only, and leave out the downlight lens glow.

A procedural skeleton (three.js primitives, no assets) waits inside the closets. There is one instance: it moves, while the leaf is still shut, to whichever closet door the walker opens: the three mirrored robe sliders, the upper and ground linen doors and the pantry. The same skeleton moves to the bathtub, in a bathing pose, when the bathroom door is opened, and appears as a skull, a hand and loose bones on the shelves when the vanity mirror cabinet is opened. It exists in one place only: each opening empties the others.

Around the house an 11 x 11 grid of low-detail house clones fills the neighbourhood, ours in the centre cell: instanced shells with no interior, lit window panes on the near ring only, bare blocks farther out. Between the rows run asphalt streets with a dashed centre line and street lamps that light up at dusk, on a grass ground; two lamps by our frontage are real lights. A hedge marks our lot and the walker cannot leave it. None of this collides, casts shadows or reflects.

The walker stands 1.7 m above the floor, climbs stairs, falls with gravity, and slides along walls.

## Plan model viewer

`model.html` shows a house model JSON instead of the coded residence. It loads one file of schema `pomi.house_model.v1`: choose it in the panel, drop it on the page, or open `model.html?src=path/to/house_model.json`.

The page opens as a plan view and turns over into the isometric view. Drag to orbit, scroll to zoom, right-drag to pan. Click a floor to walk on it (the click looks through the roof and walls for the slab). Doors and sliding doors open on click, `E` or a tap, with the tour's lime outline on the one under the crosshair; a door swings away from the walker. The walking controls, lighting panel (`T`), daylight clock, floor reflection, procedural textures, lawn, streets, lamps and lot boundary are the tour's. There is no neighbourhood. The model is centred on the lawn; the lot, hedge and street pitch grow with it.

The viewer is `tour/js/plan.js`, bundled to `tour/js/plan.bundle.js`; it only orchestrates. Every surface, material and fixture is a reusable function in its own module:

| Module | Functions |
| --- | --- |
| `tour/js/model/materials.js` | `createMaterials({ renderer })` returns the tour's finishes (`lampLightMap(lamps)` bakes the street lamp light into one map: every lamp head added with inverse-square falloff and the cosine of incidence, drawn as one additive plane over the roads, no run-time lamp lights): `materialFor(key, spec, finish)` by material family and finish (concrete, face brick, render, paint, carpet, tile, timber, metal, roof sheet, fascia, glass), `finishes.*` one function each, `fixtures` (frame, glass, sill, paint, metal), `grassTexture()`, `streetTexture()`, `lightPoolTexture()`, `setGlass(strength)`. All textures are canvases made at run time. |
| `tour/js/model/surfaces.js` | `buildSlab`, `buildFooting`, `buildRoof`, `buildWall(el, openings, material, frame)` (a rectangular wall crossed by openings is rebuilt as pieces around the holes), `buildFascia(eaveLine)`, `buildGlazing(opening)`, `openingBoxes(fixtures)`, `floorTriangles(mesh, y)`, `meshFromFaces`, `prism`. Plan metres in, world meshes out, centred by `frame = { cx, cy }`. |
| `tour/js/model/lighting.js` | `planDownlights(json)` finds the rooms and plans the downlights (see below); `createRoomMask(pool)` is the tour's shader gate that confines each pooled spot light and its halo to its room; `buildDownlightFixtures(lights, frame)` makes the instanced bezel, lens and trim. |
| `tour/js/fixtures/hinged-door.js` | `extractStandardDoor(window.RESIDENCE)` reads the tour's door D04 (Metro 95 frame, leaf, hinges, lever set) from the residence engine, which `model.html` loads hidden and paused. `createHingedDoor({ model, width, hinge: 'L' or 'R', position, rotationDeg, materials })` places it at any width: the hinge half keeps its shape, the strike half shifts. `openingFor(model, width)` is the wall opening the frame needs. `fixture.toggle(sideSign)` swings the leaf. |
| `tour/js/fixtures/window.js` | `createWindow({ width, height, depth, position, rotationDeg, materials })`: aluminium frame, mullions, glass, sill. |
| `tour/js/fixtures/sliding-door.js` | `createSlidingDoor({ width, height, depth, position, rotationDeg, materials, slide })`: frame, glazed panels, one slides on `toggle()`. |
| `tour/js/fixtures/common.js` | `placeFixture(group, position, rotationDeg)`, `box`, `motion`, `defaultMaterials`. |

Fixture convention: local x runs along the opening width, y up, z across the wall; the origin is the opening centre at sill level; `rotationDeg` is the house model's `rotation_deg` (0 = along plan x, 90 = along plan y). Operable fixtures expose `group.userData.fixture = { kind, meshes, toggle, step, open, moving }`.

### Downlights

The house model carries no lights, so the viewer plans them:

1. **Rooms.** The slab top is rasterised at 0.1 m. Wall rectangles grown by 30 mm are solid, doors and windows close their openings, and cells with no roof above are outside. The floor cells flood-fill into rooms; rooms under 1.5 m² are dropped.
2. **Ceiling.** Each room's flat ceiling is the lower of the surrounding wall tops and the lowest roof point over the room, between 2.2 and 4.0 m. Walls of clearly different heights around a room mean a raking ceiling: the roof underside is used and each light follows it. Flat rooms get a plasterboard ceiling slab per rectangle.
3. **Layout.** Each room is peeled into rectangles (largest first, until 90 % is covered). Spacing is the ceiling height, held between 1.6 and 2.6 m; a rectangle gets a grid of round(width / spacing) by round(depth / spacing) lights with an edge offset of half a spacing. Rooms narrower than 1.6 m get one row, a light every 2.2 m.
4. **Clearance.** A light within 0.45 m of a wall moves to the nearest clear cell of its room within 1 m, else it is dropped. Lights closer than 1.2 m are merged. Rooms with none, or more than 12, are logged.
5. **Lights.** The tour's pool applies: 32 spot lights with a halo point light each, the nearest fixtures take a slot and fade in, the nearest three cast shadow maps, the rest are confined by their room's two boxes in the shader. Power, halo, floor and wall sliders are in the `T` panel. Every fixture is on; there are no switches.

Sample files can sit in `models/` (not committed).

## Performance switches

`RENDER` at the top of `tour/js/tour.js` holds the quality switches; `ResidenceTour.setQuality({...})` changes the ones that apply at run time and `ResidenceTour.benchmark(60, true)` returns milliseconds per frame.

| Switch | Default | Effect |
| --- | --- | --- |
| `dpr` | 1.25 (1 on touch) | Cap on the device pixel ratio. |
| `lights` | 99 | Cap on fixtures lit at once. 99 lights every fixture on the current level; a lower value keeps only the nearest. Needs a rebuild of the walk scene. |
| `haloLights` | on | A soft point light under each fixture. Off uses a wider, softer cone instead. |
| `shadowSpots` | 3 (2 on touch) | Fixtures with real shadow maps; the rest are confined by their room box. |
| `reflection`, `reflectEvery` | 0.3, 2 | Floor reflection target scale and refresh interval in frames. |
| `physical` | off | Physical shader for flat paints. Off uses the standard shader, same look. |
| `cell` | 8 | Draw-bucket size in metres. |
| `cull` | on | Hides the other level's interior fittings when the walker is away from the stair. |
| `direct` | on | Draws straight to the canvas when ambient occlusion is off. The vignette is CSS. |
| `lessOften` | on | Skips the environment map and reflections while nothing on screen changes. |

## Files

| Path | Content |
| --- | --- |
| `tour.html` | Page markup only. `index.html` at the root is an exact copy, written by the build stamp, for GitHub Pages. |
| `tour/css/residence.css` | Original engine styles. |
| `tour/css/tour.css` | Full-window layout, hides labels, walking HUD. |
| `tour/js/residence-sound.js` | Procedural foley (door, window, water sounds). |
| `tour/js/residence-model.js` | Original custom WebGL model engine. Patched: stand-in elements replace the removed panels, internals exported on `window.RESIDENCE`, wet-wall grout bed recessed behind the tiles. |
| `tour/js/tour.js` | Walking mode source (three.js). |
| `tour/js/tour.bundle.js` | Built bundle of `tour.js` with three.js and three-mesh-bvh. |
| `model.html`, `tour/js/plan.js`, `tour/css/plan.css` | Plan model viewer: loads a house model JSON and shows it as the tour does. |
| `tour/js/model/`, `tour/js/fixtures/` | Reusable surface, material and fixture modules of the viewer (see Plan model viewer). |
| `assets/` | Flooring, detail and installed-room images as plain files. |

## Publish

GitHub Pages serves the repository root from the `main` branch: https://pomi-au.github.io/housetour/. Push `main` to publish. Netlify (floorto3d.netlify.app) deploys with `npx netlify-cli deploy --prod --dir .`.

## Build

    cd tour/build
    npm install
    npm run build

`npm run watch` rebuilds on every change to `tour/js/tour.js`.
