#!/usr/bin/env python3
"""Build a house model JSON (all faces + fixture placements) from stage 005_01/02/03 + openings,
then render it to a self-contained Three.js HTML.

Usage:
    build_house.py <005_01_*_slab_footing_model.json> <out_dir> [--openings registry|001_03]

Writes  <out_dir>/<job>_house_model.json   pomi.house_model.v1
        <out_dir>/<job>_house_3d.html      viewer with the JSON embedded (works from file://)
        <out_dir>/house_viewer.html        generic viewer: Load JSON, drag & drop, or ?model=<url>

House model JSON (units metres; x/y = plan, z up, z=0 = slab top):
    elements[]  every solid as a triangle mesh: id, category (slab|footing|wall|roof), material,
                role, finish, vertices [[x,y,z]], faces [[i,j,k]]
    fixtures[]  doors/windows as placements only: kind, label, width_m, height_m, depth_m,
                sill_m, head_m, position [x,y,z] (centre of the opening at sill level, on the wall
                centreline), rotation_deg (0 = opening runs along +x, 90 = along +y), hinge
    guides      eave height lines
"""
from __future__ import annotations

import glob
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

COURSE = 0.086          # brick course module, metres
SCHEMA = "pomi.house_model.v1"


# --------------------------------------------------------------------------- #
# Small geometry helpers
# --------------------------------------------------------------------------- #

def r4(v: float) -> float:
    return round(float(v), 4)


def box(x0, x1, y0, y1, z0, z1) -> Tuple[list, list]:
    v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
         [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]
    f = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4],
         [1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]]
    return [[r4(a) for a in p] for p in v], f


def earcut(poly: List[List[float]]) -> List[List[int]]:
    """Ear clipping for a simple polygon without holes. Returns triangle index lists."""
    pts = [tuple(p) for p in poly]
    if len(pts) > 1 and pts[0] == pts[-1]:
        pts = pts[:-1]
    n = len(pts)
    if n < 3:
        return []
    area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))
    idx = list(range(n)) if area > 0 else list(range(n))[::-1]

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    def inside(p, a, b, c):
        return cross(a, b, p) >= -1e-12 and cross(b, c, p) >= -1e-12 and cross(c, a, p) >= -1e-12

    tris: List[List[int]] = []
    guard = 0
    while len(idx) > 3 and guard < 10000:
        guard += 1
        clipped = False
        for k in range(len(idx)):
            i0, i1, i2 = idx[k - 1], idx[k], idx[(k + 1) % len(idx)]
            a, b, c = pts[i0], pts[i1], pts[i2]
            if cross(a, b, c) <= 1e-12:
                continue
            if any(inside(pts[j], a, b, c) for j in idx if j not in (i0, i1, i2)):
                continue
            tris.append([i0, i1, i2])
            idx.pop(k)
            clipped = True
            break
        if not clipped:      # degenerate remainder: fan it
            break
    if len(idx) >= 3:
        for k in range(1, len(idx) - 1):
            tris.append([idx[0], idx[k], idx[k + 1]])
    return tris


def subtract(rects, c):
    """Subtract rectangle c=(a0,a1,z0,z1) from a list of (a0,a1,z0,z1) rectangles."""
    ca0, ca1, cz0, cz1 = c
    out = []
    for (a0, a1, z0, z1) in rects:
        if ca0 >= a1 or ca1 <= a0 or cz0 >= z1 or cz1 <= z0:
            out.append((a0, a1, z0, z1))
            continue
        if a0 < ca0:
            out.append((a0, ca0, z0, z1))
        if ca1 < a1:
            out.append((ca1, a1, z0, z1))
        ia0, ia1 = max(a0, ca0), min(a1, ca1)
        if z0 < cz0:
            out.append((ia0, ia1, z0, cz0))
        if cz1 < z1:
            out.append((ia0, ia1, cz1, z1))
    return [q for q in out if q[1] - q[0] > 1e-4 and q[3] - q[2] > 1e-4]


# --------------------------------------------------------------------------- #
# Inputs
# --------------------------------------------------------------------------- #

def first(pattern: str) -> Optional[str]:
    hits = sorted(glob.glob(pattern))
    return hits[0] if hits else None


def load_inputs(slab_path: Path, openings_src: str) -> dict:
    job_dir = slab_path.parent.parent
    src = {"slab_footing": str(slab_path)}
    slab = json.load(open(slab_path))
    wall_f = first(str(job_dir / "005_03_*/005_03_*_wall_envelopes.json"))
    roof_f = first(str(job_dir / "005_02_*/005_02_*_roof_envelope.json"))
    src["wall_envelopes"] = wall_f
    src["roof_envelope"] = roof_f
    walls = json.load(open(wall_f))
    roof = json.load(open(roof_f))

    reg_f = first(str(job_dir / "004_04_*/004_04_*_opening_registry.json"))
    reg = json.load(open(reg_f)) if reg_f else {"openings": []}
    src["openings"] = [reg_f] if reg_f else []
    src["openings_source"] = "004_04 registry"
    if not reg["openings"] or openings_src == "001_03":
        files = (glob.glob(str(job_dir / "001_03_*/001_03_*_openings_door_list.json"))
                 + glob.glob(str(job_dir / "001_03_*/001_03_*_openings_window_list.json")))
        raw = []
        for f in files:
            raw += json.load(open(f))
        reg = {"openings": [{
            "opening_id": o["id"], "label": o["label"], "opening_type": o["type"], "plan_axis": o["axis"],
            "rect_pt": o.get("band_rect") or o.get("swing_rect"),
            "width_mm": o.get("width_mm") or o.get("length_mm"),
            "sill_mm_from_0c": None, "head_mm_from_0c": None, "host_wall_id": None,
            "status": "PLAN_ONLY_001_03"} for o in raw if o.get("band_rect") or o.get("swing_rect")]}
        src["openings"] = files
        src["openings_source"] = "001_03 opening lists"
    return {"job": slab["job"], "slab": slab, "walls": walls, "roof": roof, "reg": reg, "sources": src}


# --------------------------------------------------------------------------- #
# Model build
# --------------------------------------------------------------------------- #

def build_model(inp: dict) -> dict:
    slab, walls, roof, reg = inp["slab"], inp["walls"], inp["roof"], inp["reg"]
    cs = walls["coordinate_system"]
    OX, OY, SC = cs["origin_pdf"]["x"], cs["origin_pdf"]["y"], cs["metres_per_pdf_point"]

    def pt2m(x, y):
        return ((x - OX) * SC, (OY - y) * SC)

    # ---- wall segment boxes (all axis-aligned) ----
    segs = []   # (base, x0,x1,y0,y1,z0,z1, along_x, mesh)
    for e in walls["wall_envelopes"]:
        for s in e["segments"]:
            if "mesh" not in s:
                continue
            base = {"id": e["wall_leaf_id"], "material": e["material_key"], "role": e["wall_role"],
                    "finish": e.get("wall_finish"), "host_wall_id": e.get("host_wall_id")}
            vs = s["mesh"]["vertices_m"]
            xs, ys, zs = [v[0] for v in vs], [v[1] for v in vs], [v[2] for v in vs]
            x0, x1, y0, y1, z0, z1 = min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)
            segs.append((base, x0, x1, y0, y1, z0, z1, (x1 - x0) >= (y1 - y0), s["mesh"]))

    # ---- openings -> fixtures ----
    codes = [int(m.group(1)) for o in reg["openings"] if "window" in o["opening_type"]
             for m in [re.match(r"^(\d+)\s*X", o["label"].upper())] if m]
    HEAD_C = max([25] + codes)

    fixtures = []
    for o in reg["openings"]:
        lab = o["label"].upper().replace(" ", "")
        t, w, courses, hinge = o["opening_type"], o["width_mm"], None, None
        m = re.match(r"^(\d+)X(\d+)", lab)
        if m:
            courses = int(m.group(1)); w = w or float(m.group(2))
        m = re.match(r"^(\d+)([LR])$", lab)
        if m:
            w = w or float(m.group(1)); hinge = m.group(2)
        if w is None:
            continue
        if o["sill_mm_from_0c"] is not None and o["head_mm_from_0c"] is not None:
            sill, head, hsrc = o["sill_mm_from_0c"] / 1000, o["head_mm_from_0c"] / 1000, "registry"
        elif t in ("hinged_door", "sliding_door") or courses is None:
            sill, head, hsrc = 0.0, (courses or 25) * COURSE, "assumed"
        else:
            head = HEAD_C * COURSE; sill = max(0.0, (HEAD_C - courses) * COURSE); hsrc = "derived_from_courses"
        x0, y0 = pt2m(o["rect_pt"][0], o["rect_pt"][3])
        x1, y1 = pt2m(o["rect_pt"][2], o["rect_pt"][1])
        axis = o["plan_axis"]                       # V: opening runs along y ; H: along x
        # stretch across the wall thickness using overlapping wall leaves
        if axis == "V":
            ax0, ax1 = x0, x1
            for (_, sx0, sx1, sy0, sy1, *_r) in segs:
                if sy0 < y1 - 0.05 and sy1 > y0 + 0.05 and sx0 < x1 + 0.3 and sx1 > x0 - 0.3 and (sx1 - sx0) < 0.4:
                    ax0, ax1 = min(ax0, sx0), max(ax1, sx1)
            bx = [ax0, y0, ax1, y1]
        else:
            ay0, ay1 = y0, y1
            for (_, sx0, sx1, sy0, sy1, *_r) in segs:
                if sx0 < x1 - 0.05 and sx1 > x0 + 0.05 and sy0 < y1 + 0.3 and sy1 > y0 - 0.3 and (sy1 - sy0) < 0.4:
                    ay0, ay1 = min(ay0, sy0), max(ay1, sy1)
            bx = [x0, ay0, x1, ay1]
        width = (bx[3] - bx[1]) if axis == "V" else (bx[2] - bx[0])
        depth = (bx[2] - bx[0]) if axis == "V" else (bx[3] - bx[1])
        kind = {"hinged_door": "hinged_door", "sliding_door": "sliding_door",
                "window_openable": "window_openable", "openable_window": "window_openable",
                "window_fixed": "window_fixed", "fixed_window": "window_fixed"}.get(t, t)
        fixtures.append({
            "id": o["opening_id"], "kind": kind, "label": o["label"],
            "width_m": r4(width), "height_m": r4(head - sill), "depth_m": r4(depth),
            "sill_m": r4(sill), "head_m": r4(head),
            "position": [r4((bx[0] + bx[2]) / 2), r4((bx[1] + bx[3]) / 2), r4(sill)],
            "rotation_deg": 90 if axis == "V" else 0,
            "hinge": hinge, "courses": courses, "nominal_width_mm": w,
            "height_source": hsrc, "host_wall_id": o.get("host_wall_id"), "status": o.get("status"),
            "_box": bx,
        })

    # ---- elements ----
    elements = []

    def add(cat, base, verts, faces):
        elements.append({"id": base["id"], "category": cat, "material": base.get("material"),
                         "role": base.get("role"), "finish": base.get("finish"),
                         "vertices": [[r4(a) for a in p] for p in verts], "faces": faces})

    for s in slab["slab_solids"]:
        add("slab", {"id": s["slab_id"], "material": s["material_key"]}, s["mesh"]["vertices_m"], s["mesh"]["triangle_indices"])
    for f in slab["footing_solids"]:
        add("footing", {"id": f["footing_id"], "material": f["material_key"]}, f["mesh"]["vertices_m"], f["mesh"]["triangle_indices"])

    # walls: subtract openings (along/z plane), or infill pre-cut gaps
    hits = {fx["id"]: 0 for fx in fixtures}
    ncut = 0
    for (base, x0, x1, y0, y1, z0, z1, along_x, msh) in segs:
        rects = [(x0, x1, z0, z1) if along_x else (y0, y1, z0, z1)]
        hit = False
        for fx in fixtures:
            bx0, by0, bx1, by1 = fx["_box"]
            ox, oy = min(x1, bx1) - max(x0, bx0), min(y1, by1) - max(y0, by0)
            if ox <= 0.005 or oy <= 0.005:
                continue
            if along_x and oy < (y1 - y0) * 0.9:
                continue
            if (not along_x) and ox < (x1 - x0) * 0.9:
                continue
            c = (max(x0, bx0), min(x1, bx1), fx["sill_m"], fx["head_m"]) if along_x else (max(y0, by0), min(y1, by1), fx["sill_m"], fx["head_m"])
            rects = subtract(rects, c); hit = True; hits[fx["id"]] += 1
        if not hit:
            add("wall", base, msh["vertices_m"], msh["triangle_indices"])
            continue
        ncut += 1
        for (a0, a1, pz0, pz1) in rects:
            v, f = box(a0, a1, y0, y1, pz0, pz1) if along_x else box(x0, x1, a0, a1, pz0, pz1)
            add("wall", base, v, f)
    nfill = 0
    for fx in fixtures:
        if hits[fx["id"]]:
            continue
        bx0, by0, bx1, by1 = fx["_box"]
        V = fx["rotation_deg"] == 90
        seen = set()
        for (base, x0, x1, y0, y1, z0, z1, along_x, _) in segs:
            if V == along_x:
                continue
            if V:
                if not (x0 < bx1 - 0.005 and x1 > bx0 + 0.005):
                    continue
                gap = min(abs(y0 - by1), abs(y1 - by0)); key = (round(x0, 2), round(x1, 2))
            else:
                if not (y0 < by1 - 0.005 and y1 > by0 + 0.005):
                    continue
                gap = min(abs(x0 - bx1), abs(x1 - bx0)); key = (round(y0, 2), round(y1, 2))
            if gap > 0.06 or key in seen:
                continue
            seen.add(key); nfill += 1
            fb = {**base, "id": base["id"] + "-INFILL"}
            for (pz0, pz1) in [(fx["head_m"], z1)] + ([(0.0, fx["sill_m"])] if fx["sill_m"] > 0.001 else []):
                if pz1 - pz0 < 1e-3:
                    continue
                v, f = box(x0, x1, by0, by1, pz0, pz1) if V else box(bx0, bx1, y0, y1, pz0, pz1)
                add("wall", fb, v, f)

    # roof: triangulated plane faces  z = gx*x + gy*y + c
    for s in roof["roof_underside_envelope"]["surfaces"]:
        poly = s["polygon_model_xy_m"]
        if s["polygon_model_xy_m_holes"]:
            print("WARNING roof face with holes not triangulated with holes:", s["surface_id"])
        gx, gy = s["gradient_xy"]; c = s["intercept"]
        verts = [[p[0], p[1], gx * p[0] + gy * p[1] + c] for p in poly]
        add("roof", {"id": s["surface_id"], "material": "roof_sheet", "role": s["surface_role"]}, verts, earcut(poly))

    guides = {"eave_height_lines": [{"id": l["eave_height_line_id"], "start": [r4(a) for a in l["segment_model_xyz_m"][0]],
                                     "end": [r4(a) for a in l["segment_model_xyz_m"][1]], "height_m": l["height_m"]}
                                    for l in roof["eave_height_lines"]]}

    for fx in fixtures:
        fx.pop("_box")
    mats = dict(slab.get("materials", {}))
    mats.update(walls.get("materials", {}))
    mats.setdefault("roof_sheet", {"library_material_family": "roof_sheet"})

    print(f"elements {len(elements)}  fixtures {len(fixtures)}  walls cut {ncut}  gap infills {nfill}  head line {HEAD_C}c  openings from {inp['sources']['openings_source']}")
    return {
        "schema": SCHEMA, "job": inp["job"],
        "units": "metre", "axes": {"x": "plan x", "y": "plan y", "z": "up (0 = slab top)"},
        "coordinate_system": cs,
        "sources": inp["sources"],
        "assumptions": {"course_module_m": COURSE, "head_line_courses": HEAD_C,
                        "rule": "doors: sill 0, head = label courses (default 25c); windows: head = head line, sill = head - label courses; registry sill/head used when present"},
        "materials": mats,
        "counts": {"elements": len(elements), "fixtures": len(fixtures), "walls_cut": ncut, "gap_infills": nfill},
        "elements": elements, "fixtures": fixtures, "guides": guides,
    }


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__); return 2
    slab_path = Path(sys.argv[1]); out_dir = Path(sys.argv[2]); out_dir.mkdir(parents=True, exist_ok=True)
    openings_src = sys.argv[sys.argv.index("--openings") + 1] if "--openings" in sys.argv else "registry"
    inp = load_inputs(slab_path, openings_src)
    model = build_model(inp)
    job = model["job"]
    jpath = out_dir / f"{job}_house_model.json"
    jpath.write_text(json.dumps(model, separators=(",", ":")))
    print("wrote", jpath, jpath.stat().st_size, "bytes")
    template = Path(__file__).with_name("house_template.html").read_text()
    hpath = out_dir / f"{job}_house_3d.html"
    hpath.write_text(template.replace("JOB_NAME", job).replace("DATA_JSON", json.dumps(model, separators=(",", ":")).replace("</", "<\\/")))
    print("wrote", hpath)
    vpath = out_dir / "house_viewer.html"          # generic viewer: loads any house model JSON
    vpath.write_text(template.replace("JOB_NAME", "House Model Viewer").replace("DATA_JSON", ""))
    print("wrote", vpath)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
