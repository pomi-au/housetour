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

A procedural skeleton (three.js primitives, no assets) waits inside the closets. There is one instance: it moves, while the leaf is still shut, to whichever closet door the walker opens: the three mirrored robe sliders, the upper and ground linen doors and the pantry. A lone skull rests on the shelf inside the vanity mirror cabinet.

The walker stands 1.7 m above the floor, climbs stairs, falls with gravity, and slides along walls.

## Files

| Path | Content |
| --- | --- |
| `tour.html` | Page markup only. |
| `tour/css/residence.css` | Original engine styles. |
| `tour/css/tour.css` | Full-window layout, hides labels, walking HUD. |
| `tour/js/residence-sound.js` | Procedural foley (door, window, water sounds). |
| `tour/js/residence-model.js` | Original custom WebGL model engine. Patched: stand-in elements replace the removed panels, internals exported on `window.RESIDENCE`, wet-wall grout bed recessed behind the tiles. |
| `tour/js/tour.js` | Walking mode source (three.js). |
| `tour/js/tour.bundle.js` | Built bundle of `tour.js` with three.js and three-mesh-bvh. |
| `assets/` | Flooring, detail and installed-room images as plain files. |

## Build

    cd tour/build
    npm install
    npm run build

`npm run watch` rebuilds on every change to `tour/js/tour.js`.
