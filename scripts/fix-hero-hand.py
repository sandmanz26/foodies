"""Removes a third hand the video model gave one of the friends in the last seconds of hero clip 2.

The extra hand lies flat on the floor to the lower right of her chair, across the corner where four
tiles meet. In each affected frame it is found by skin colour inside a fixed search window; the floor
under it is then rebuilt from the checkerboard itself: the two tile joints are located from the
visible floor around the hand, and each hidden pixel takes the colour of the tile it belongs to.

usage: fix-hero-hand.py <frames_dir>   (PNG frames, edited in place)
"""
import sys, glob
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

X0, X1, Y0, Y1 = 1285, 1500, 600, 800   # search window in the 1928x1076 frame
FIRST = 136                              # first frame (24 fps) in which the hand can appear

def rebuild_floor(win, m):
    r, g, b = win[..., 0], win[..., 1], win[..., 2]
    red = (r - g > 90) & (r > 110)
    cream = (r > 160) & (g > 140) & (b > 80) & (r - g < 60) & ((g - b) / np.maximum(r - b, 1) > 0.5)
    ok = (red | cream) & ~m
    ys, xs = np.where(m)
    y0, y1 = max(0, ys.min() - 45), min(m.shape[0], ys.max() + 45)
    x0, x1 = max(0, xs.min() - 45), min(m.shape[1], xs.max() + 45)
    v = np.where(ok, np.where(red, 1.0, -1.0), 0.0)[y0:y1, x0:x1]
    P = np.pad(v.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    box = lambda ya, yb, xa, xb: P[yb, xb] - P[ya, xb] - P[yb, xa] + P[ya, xa]
    h, w = v.shape
    best = (-1, 0, 0, 1)
    # a checkerboard corner at (jx, jy): opposite quadrants share a colour
    for jy in range(0, h + 1, 2):
        for jx in range(0, w + 1, 2):
            sc = box(0, jy, 0, jx) + box(jy, h, jx, w) - box(0, jy, jx, w) - box(jy, h, 0, jx)
            if abs(sc) > best[0]:
                best = (abs(sc), jy, jx, 1 if sc > 0 else -1)
    _, jy, jx, sign = best
    jy += y0; jx += x0
    yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
    is_red = ((yy < jy) == (xx < jx)) == (sign > 0)
    out = win.copy()
    near = np.zeros_like(m); near[y0:y1, x0:x1] = True
    for cls, want in ((red, True), (cream, False)):
        src = cls & ~m & near
        if src.sum() > 50:
            out[m & (is_red == want)] = np.median(win[src], axis=0)
    grout = ~red & ~cream & ~m & near & ((np.abs(yy - jy) < 3) | (np.abs(xx - jx) < 3))
    if grout.sum() > 20:
        out[m & ((np.abs(yy - jy) < 2) | (np.abs(xx - jx) < 2))] = np.median(win[grout], axis=0)
    return out


def fix(path):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    win = a[Y0:Y1, X0:X1]
    r, g, b = win[..., 0], win[..., 1], win[..., 2]
    ratio = (r - g) / np.maximum(r, 1)
    # skin is pinker than the cream tiles: its green sits much closer to its blue
    pink = (g - b) / np.maximum(r - b, 1)
    skin = (r > 150) & (ratio > 0.15) & (ratio < 0.45) & (pink < 0.5) & (b > 80)
    skin = ndimage.binary_opening(skin, iterations=2)
    lab, n = ndimage.label(skin)
    if n == 0:
        return 0
    sizes = ndimage.sum(skin, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    if not 900 < sizes[k - 1] < 9000:
        return 0
    m = ndimage.binary_dilation(lab == k, iterations=9)
    # the hand's hard shadow falls to the lower right: take it out with the hand
    m |= np.roll(np.roll(m, 9, axis=0), 7, axis=1)
    out = rebuild_floor(win, m)
    # soften along the fill, re-grain it, and feather the edge so the patch does not read as flat
    patch = np.asarray(Image.fromarray(out.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32)
    patch += np.random.default_rng(int(sizes[k - 1])).normal(0, 2.0, patch.shape[:2] + (1,))
    alpha = ndimage.gaussian_filter(m.astype(np.float32), 2.2)[..., None]
    a[Y0:Y1, X0:X1] = win * (1 - alpha) + patch * alpha
    Image.fromarray(a.clip(0, 255).astype('uint8')).save(path)
    return int(sizes[k - 1])

if __name__ == '__main__':
    files = sorted(glob.glob(sys.argv[1] + '/*.png'))
    done = 0
    for i, f in enumerate(files):
        if i >= FIRST and fix(f):
            done += 1
    print(f'patched {done} of {len(files)} frames')
