"""Paints out the third-party brand name the image model printed on the espresso machine in
place-bar.png, so the photo carries no real company's trademark. Writes place-bar-clean.png.

usage: python3 scripts/fix-bar-logo.py   (reads and writes assets-src/raw/)
"""
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

SRC, OUT = 'assets-src/raw/place-bar.png', 'assets-src/raw/place-bar-clean.png'
BOX_AT_1200 = (38, 288, 140, 322)  # lettering, measured on a 1200 px wide preview

im = Image.open(SRC).convert('RGB')
s = im.size[0] / 1200
x0, y0, x1, y1 = [int(v * s) for v in BOX_AT_1200]
a = np.asarray(im).astype(np.float32)
# fill with a vertical blend of the plain panel just above and below the lettering
top, bot = a[y0 - 6:y0 - 2, x0:x1].mean(axis=0), a[y1 + 2:y1 + 6, x0:x1].mean(axis=0)
for i in range(y1 - y0):
    t = i / (y1 - y0 - 1)
    a[y0 + i, x0:x1] = top * (1 - t) + bot * t
out = Image.fromarray(a.clip(0, 255).astype('uint8'))
# soften the seams and put back a little grain so the patch does not read as flat
patch = out.crop((x0 - 8, y0 - 8, x1 + 8, y1 + 8)).filter(ImageFilter.GaussianBlur(3))
mask = Image.new('L', patch.size, 0)
ImageDraw.Draw(mask).rectangle((6, 6, patch.size[0] - 6, patch.size[1] - 6), fill=255)
out.paste(patch, (x0 - 8, y0 - 8), mask.filter(ImageFilter.GaussianBlur(4)))
arr = np.asarray(out).astype(np.float32)
arr[y0 - 8:y1 + 8, x0 - 8:x1 + 8] += np.random.default_rng(1).normal(0, 2.2, (y1 - y0 + 16, x1 - x0 + 16, 1))
Image.fromarray(arr.clip(0, 255).astype('uint8')).save(OUT)
print('wrote', OUT)
