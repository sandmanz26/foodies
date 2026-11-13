"""Removes a third arm the video model gave one of the friends as the toast lands in hero clip 2.

From frame 138 on, the woman in the green sweater grows a third arm: a sleeve that leaves her side
below the croissant arm and ends in an open hand on the floor to the lower right of her chair.
The camera is locked off, so frame 136 (her last frame with two arms) is a clean plate of that patch
of floor and of her elbow. In every later frame, anything sweater-green, skin-toned or shadow-dark that sits where the
plate shows floor, inside the area the arm sweeps through, is replaced by the plate. Confetti that
lands outside the arm is left alone.

usage: fix-hero-hand.py <frames_dir>   (PNG frames at 24 fps, edited in place)
"""
import sys, glob
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

PLATE = 136          # 1-based frame number of the clean plate
FIRST = 137          # first frame to repair
# area the third arm sweeps through (1928x1076 frame); stays clear of her torso and of the
# red-shirted friend's arm on the left
# where the hand first slides out from under her elbow (frames 138-156); there the plate shows her
# own sleeve, which has barely moved, so anything new there is simply swapped back to the plate
ELBOW = (1235, 585, 1365, 712)
ELBOW_LAST = 156
REGION = [(1238, 652), (1300, 628), (1356, 640), (1440, 655), (1520, 700), (1520, 830), (1250, 830), (1238, 760)]


def classes(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = (g > r + 8) & (g > b + 8)
    ratio = (r - g) / np.maximum(r, 1)
    pink = (g - b) / np.maximum(r - b, 1)
    skin = (r > 120) & (ratio > 0.12) & (ratio < 0.5) & (pink < 0.55) & (b > 60)
    return green, skin


def region_mask(shape):
    m = Image.new('L', (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon(REGION, fill=255)
    return np.asarray(m) > 0


def fix_elbow(a, plate):
    x0, y0, x1, y1 = ELBOW
    w, p = a[y0:y1, x0:x1], plate[y0:y1, x0:x1]
    # a motion-blurred hand is too pale to pass as skin, so here anything that changed is swapped back
    new = np.abs(w - p).sum(axis=2) > 36
    new = ndimage.binary_opening(new, iterations=1)
    if new.sum() < 40:
        return a, 0
    m = ndimage.binary_dilation(new, iterations=6)
    alpha = ndimage.gaussian_filter(m.astype(np.float32), 1.6)[..., None]
    a = a.copy()
    a[y0:y1, x0:x1] = w * (1 - alpha) + p * alpha
    return a, int(m.sum())


def fix(a, plate, reg, plate_green, plate_skin):
    green, skin = classes(a)
    diff = np.abs(a - plate).sum(axis=2)
    arm = (green | skin) & ~plate_green & ~plate_skin & (diff > 50) & reg
    arm = ndimage.binary_opening(arm, iterations=1)
    lab, n = ndimage.label(arm)
    if n == 0:
        return a, 0
    sizes = ndimage.sum(arm, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 120])
    if keep.sum() < 300:
        return a, 0
    m = ndimage.binary_dilation(keep, iterations=7)
    # the arm's hard shadow falls down and to the right: take out floor that got darker near it
    luma = a.mean(axis=2)
    pl = plate.mean(axis=2)
    shadow = ndimage.binary_dilation(m, iterations=26) & (pl - luma > 18) & reg
    m = ndimage.binary_closing(m | shadow, iterations=3) & ndimage.binary_dilation(reg, iterations=8)
    alpha = ndimage.gaussian_filter(m.astype(np.float32), 2.0)[..., None]
    return a * (1 - alpha) + plate * alpha, int(m.sum())


if __name__ == '__main__':
    files = sorted(glob.glob(sys.argv[1] + '/*.png'))
    plate = np.asarray(Image.open(files[PLATE - 1]).convert('RGB')).astype(np.float32)
    reg = region_mask(plate.shape)
    pg, ps = classes(plate)
    done = 0
    for k, f in enumerate(files[FIRST - 1:], start=FIRST):
        a = np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
        out, px = fix(a, plate, reg, pg, ps)
        if k <= ELBOW_LAST:
            out, px2 = fix_elbow(out, plate)
            px += px2
        if px:
            Image.fromarray(out.clip(0, 255).astype('uint8')).save(f)
            done += 1
    print(f'patched {done} of {len(files) - FIRST + 1} frames')
