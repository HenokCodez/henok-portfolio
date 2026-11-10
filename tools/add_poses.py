#!/usr/bin/env python3
"""
add_poses.py — add extra STILL poses (e.g. up-left.png) to an existing frame sequence made by process_head_sweep.py.

Usage:  python3 tools/add_poses.py public/images/portrait/seq  up-left.png up-right.png down-left.png
        (file names should contain: up-left / up-right / down-left / down-right / up / down / left / right)
Each still is cut out (background removed), aligned to the neutral frame, saved as frame_NNN.webp and
registered in manifest.json with its gaze position. Needs: pip install opencv-python numpy scipy pillow
"""
import json, os, re, sys
import numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from process_head_sweep import matte, to_rgba, gaze

NOMINAL = {'up-left': (-0.75, -0.75), 'up-right': (0.75, -0.75), 'down-left': (-0.75, 0.75), 'down-right': (0.75, 0.75),
           'up': (0, -1), 'down': (0, 0.8), 'left': (-1, 0), 'right': (1, 0)}


def key_of(name):
    n = os.path.basename(name).lower().replace('_', '-').replace(' ', '-')
    for k in ['up-left', 'up-right', 'down-left', 'down-right', 'upleft', 'upright', 'downleft', 'downright', 'up', 'down', 'left', 'right']:
        if k in n:
            return k if '-' in k or k in ('up', 'down', 'left', 'right') else k[:-4] + '-' + k[-4:]
    return None


def main():
    seq, files = sys.argv[1], sys.argv[2:]
    if not files: raise SystemExit(__doc__)
    mf = os.path.join(seq, 'manifest.json'); m = json.load(open(mf))
    if 'neutral' not in m: raise SystemExit('manifest.json has no calibration; use the seq folder from the latest zip.')
    H = m['size']; sc = m['scale']; n0 = m['neutral']
    ref = np.array(Image.open(os.path.join(seq, m['frames'][0]['file'])).convert('RGBA'))
    rg = cv2.cvtColor(ref[..., :3], cv2.COLOR_RGB2GRAY).astype(np.float32)
    K = 3
    small = lambda im: cv2.resize(cv2.GaussianBlur(im, (0, 0), 2), (H // K, H // K), interpolation=cv2.INTER_AREA)
    band = np.zeros((H, H), np.uint8); band[int(H * 0.68):, :] = 255
    band_s = cv2.resize(band, (H // K, H // K), interpolation=cv2.INTER_NEAREST)
    ramp = np.ones(H, np.float32); n = int(H * 0.06)
    ramp[:n] = np.linspace(0, 1, n) ** 1.5; ramp[-n:] = np.linspace(1, 0, n) ** 1.5
    for f in files:
        im = cv2.imread(f)
        if im is None: print('cannot read', f); continue
        h, w = im.shape[:2]; s = min(h, w); y0, x0 = (h - s) // 2, (w - s) // 2
        sq = cv2.resize(im[y0:y0 + s, x0:x0 + s], (H, H), interpolation=cv2.INTER_AREA)
        fg = matte(sq)
        sm = cv2.resize(sq, (300, 300), interpolation=cv2.INTER_AREA)
        g = gaze(sm, matte(sm))
        k = key_of(f); nx, ny = NOMINAL.get(k, (0, 0)) if k else (0, 0)
        if g:
            dx, dy = g[0] - n0[0], g[1] - n0[1]
            x = dx / (sc['xpos'] if dx > 0 else sc['xneg']); y = dy / (sc['ypos'] if dy > 0 else sc['yneg'])
        else:
            x, y = nx, ny
        # sanity: the still must really show the requested direction, otherwise skip it (and say so)
        if k and g and ((nx and x * nx < 0.15) or (ny and y * ny < 0.15)):
            print(f'  SKIPPED {os.path.basename(f)}: it does not really look "{k}" (measured x={x:.2f}, y={y:.2f}). Regenerate this pose.'); continue
        if k and not g: x, y = nx, ny
        x, y = float(np.clip(x, -1, 1)), float(np.clip(y, -1, 1))
        gimg = small(cv2.cvtColor(sq, cv2.COLOR_BGR2GRAY).astype(np.float32))
        warp = np.eye(2, 3, dtype=np.float32)
        try:
            _, warp = cv2.findTransformECC(small(rg), gimg, warp, cv2.MOTION_TRANSLATION,
                                           (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 60, 1e-4), band_s, 3)
            warp[:, 2] *= K
        except cv2.error:
            warp = np.eye(2, 3, dtype=np.float32)
        rgba = to_rgba(sq, fg)
        rgba = cv2.warpAffine(rgba, warp, (H, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP,
                              borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
        rgba[..., 3] = (rgba[..., 3].astype(np.float32) * ramp[None, :]).astype(np.uint8)
        name = f'frame_{len(m["frames"]):03d}.webp'
        Image.fromarray(rgba, 'RGBA').save(os.path.join(seq, name), 'WEBP', quality=80, method=3)
        m['frames'].append({'file': name, 'x': round(x, 3), 'y': round(y, 3)})
        print(f'  added {name} from {os.path.basename(f)} at gaze ({x:.2f}, {y:.2f})')
    m['count'] = len(m['frames']); json.dump(m, open(mf, 'w'))
    print('manifest updated:', m['count'], 'frames')


if __name__ == '__main__':
    main()
