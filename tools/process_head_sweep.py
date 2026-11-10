#!/usr/bin/env python3
"""
process_head_sweep.py — turn an AI-generated "head turning" video into a smooth frame sequence for the hero.

INPUT : an .mp4 of the cartoon avatar looking around (left/right/up/down) on a PLAIN FLAT LIGHT-GREY background,
        camera locked, shoulders still, first frame = neutral/centre (see docs/11-portrait-3d-guide.md, "Option C").
OUTPUT: <out>/frame_000.webp … (transparent, shoulders aligned) + <out>/manifest.json
        manifest.json lists every frame with its 2-D gaze position (x: -1 left … +1 right, y: -1 up … +1 down),
        so the site can show the frame closest to the cursor in ALL directions (incl. diagonals the clip covers).

Usage:  python3 tools/process_head_sweep.py public/images/portrait/seq clipA.mp4 clipB.mp4 … --frames 100 --size 900
Needs:  pip install opencv-python numpy scipy pillow
"""
import argparse, json, os
import numpy as np, cv2
from scipy import ndimage as ndi
from PIL import Image


def matte(bgr):
    """Foreground mask for a subject on a flat/gradient light background (colour-fit to the background)."""
    h, w = bgr.shape[:2]
    img = bgr.astype(np.float32)
    ys, xs = np.mgrid[0:h, 0:w]
    samp = (ys < 25) | ((xs < 25) & (ys < h * 0.5)) | ((xs > w - 25) & (ys < h * 0.5))
    basis = lambda x, y: np.stack([np.ones(x.size), x / w, y / h, (x / w) * (y / h)], 1)
    X = basis(xs[samp].astype(np.float32), ys[samp].astype(np.float32))
    Xall = basis(xs.ravel().astype(np.float32), ys.ravel().astype(np.float32))
    fit = np.zeros_like(img)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(X, img[..., c][samp], rcond=None)
        fit[..., c] = (Xall @ coef).reshape(h, w)
    bglike = ndi.binary_opening(np.sqrt(((img - fit) ** 2).sum(2)) < 30, iterations=1)
    lab, n = ndi.label(bglike)
    border = set(np.unique(np.concatenate([lab[0, :], lab[:, 0], lab[:, -1]]))); border.discard(0)
    sizes = ndi.sum(bglike, lab, range(1, n + 1))
    big = [i + 1 for i, s in enumerate(sizes) if s > 500 * (h / 1254) ** 2]
    fg = ~np.isin(lab, list(border) + big)
    fg = ndi.binary_opening(fg, iterations=2)
    lab, n = ndi.label(fg)
    if n > 1:
        fg = lab == (1 + int(np.argmax(ndi.sum(fg, lab, range(1, n + 1)))))
    return fg


def to_rgba(bgr, fg):
    alpha = cv2.GaussianBlur(ndi.binary_erosion(fg, iterations=1).astype(np.float32), (0, 0), 1.0)
    solid = ndi.binary_erosion(fg, iterations=3)
    idx = ndi.distance_transform_edt(~solid, return_distances=False, return_indices=True)
    clean = bgr[idx[0], idx[1]]
    out = np.where(alpha[..., None] > 0.98, bgr, clean)
    return np.dstack([cv2.cvtColor(out, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])


def gaze(bgr, fg):
    """(x, y) head-direction proxies: x = skin-centroid x (yaw), y = forehead-top offset from the head top (pitch)."""
    h = bgr.shape[0]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    skin = fg & ((hsv[..., 0] <= 22) | (hsv[..., 0] >= 172)) & (hsv[..., 1] > 70) & (hsv[..., 2] > 80)
    skin[int(h * 0.62):] = False
    sy, sx = np.nonzero(skin)
    if sx.size < 300: return None
    top = np.nonzero(fg[:int(h * 0.62)].any(1))[0].min()
    fx = np.nonzero(fg[:int(h * 0.62)].any(0))[0]
    return float(sx.mean() - (fx.min() + fx.max()) / 2), float(np.percentile(sy, 2) - top)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out'); ap.add_argument('videos', nargs='+', help='one or more .mp4 clips (all same framing/background); the first clip must start in the neutral pose')
    ap.add_argument('--frames', type=int, default=80)
    ap.add_argument('--size', type=int, default=900, help='output square size in px')
    ap.add_argument('--quality', type=int, default=80)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    raw = []
    for vp in a.videos:
        cap = cv2.VideoCapture(vp); got = []
        while True:
            ok, f = cap.read()
            if not ok: break
            got.append(f)
        cap.release()
        print(f'{vp}: {len(got)} frames')
        raw += got[2:]                              # skip the first frames (often a fade/black frame)
    if not raw: raise SystemExit('Could not read any frames from the video(s).')
    print(f'{len(raw)} candidate frames')

    def prep(f, size):
        h, w = f.shape[:2]; s = min(h, w); y0, x0 = (h - s) // 2, (w - s) // 2
        return cv2.resize(f[y0:y0 + s, x0:x0 + s], (size, size), interpolation=cv2.INTER_AREA)

    # 2-D gaze for every candidate (cheap: 300px copies)
    G = []
    for i, f in enumerate(raw):
        small = prep(f, 300)
        g = gaze(small, matte(small))
        G.append(g if g else (np.nan, np.nan))
    G = np.array(G); ok = ~np.isnan(G[:, 0])
    n0 = G[:10][ok[:10]].mean(0)                    # neutral = average of the first frames
    d = G - n0
    # normalise each side separately so the extremes reach exactly ±1
    sx = np.where(d[:, 0] < 0, -d[:, 0].min(), d[:, 0].max()); sy = np.where(d[:, 1] < 0, -d[:, 1].min(), d[:, 1].max())
    P = np.stack([d[:, 0] / sx, d[:, 1] / sy], 1)
    print(f'x-range {np.nanmin(P[:,0]):.2f}…{np.nanmax(P[:,0]):.2f}  y-range {np.nanmin(P[:,1]):.2f}…{np.nanmax(P[:,1]):.2f}')

    # farthest-point sampling in gaze space → even coverage of everything the clip shows (neutral first)
    idx = np.nonzero(ok)[0]
    chosen = [int(idx[np.argmin(np.hypot(P[idx, 0], P[idx, 1]))])]
    dist = np.hypot(*(P[idx] - P[chosen[0]]).T)
    while len(chosen) < min(a.frames, len(idx)):
        j = int(idx[np.argmax(dist)]); chosen.append(j)
        dist = np.minimum(dist, np.hypot(*(P[idx] - P[j]).T))
    ref_i = chosen[0]

    # align every chosen frame to the neutral one on the torso band (cancels tiny drift)
    H = a.size
    band = np.zeros((H, H), np.uint8); band[int(H * 0.68):, :] = 255
    K = 3
    small = lambda im: cv2.resize(cv2.GaussianBlur(im, (0, 0), 2), (H // K, H // K), interpolation=cv2.INTER_AREA)
    gref = small(cv2.cvtColor(prep(raw[ref_i], H), cv2.COLOR_BGR2GRAY).astype(np.float32))
    band_s = cv2.resize(band, (H // K, H // K), interpolation=cv2.INTER_NEAREST)
    ramp = np.ones(H, np.float32); n = int(H * 0.06)
    ramp[:n] = np.linspace(0, 1, n) ** 1.5; ramp[-n:] = np.linspace(1, 0, n) ** 1.5

    entries = []
    for k, i in enumerate(chosen):
        bgr = prep(raw[i], H)
        fg = matte(bgr)
        g = small(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32))
        warp = np.eye(2, 3, dtype=np.float32)
        try:
            _, warp = cv2.findTransformECC(gref, g, warp, cv2.MOTION_TRANSLATION,
                                           (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 60, 1e-4), band_s, 3)
            warp[:, 2] *= K
        except cv2.error:
            warp = np.eye(2, 3, dtype=np.float32)
        rgba = to_rgba(bgr, fg)
        rgba = cv2.warpAffine(rgba, warp, (H, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP,
                              borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
        rgba[..., 3] = (rgba[..., 3].astype(np.float32) * ramp[None, :]).astype(np.uint8)
        name = f'frame_{k:03d}.webp'
        Image.fromarray(rgba, 'RGBA').save(os.path.join(a.out, name), 'WEBP', quality=a.quality, method=3)
        entries.append({'file': name, 'x': round(float(P[i, 0]), 3), 'y': round(float(P[i, 1]), 3)})

    scale = {'xneg': float(-d[ok, 0].min()), 'xpos': float(d[ok, 0].max()), 'yneg': float(-d[ok, 1].min()), 'ypos': float(d[ok, 1].max())}
    json.dump({'count': len(entries), 'size': a.size, 'neutral': [float(n0[0]), float(n0[1])], 'scale': scale, 'frames': entries}, open(os.path.join(a.out, 'manifest.json'), 'w'))
    total = sum(os.path.getsize(os.path.join(a.out, f)) for f in os.listdir(a.out)) / 1024
    print(f'Done: {len(entries)} frames in {a.out}  ({total:.0f} KB total)')


if __name__ == '__main__':
    main()
