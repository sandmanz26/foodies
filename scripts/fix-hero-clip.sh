#!/usr/bin/env bash
# Builds assets-src/raw/hero-v2c.mp4: hero clip 2 with the extra arm removed (see fix-hero-hand.py).
set -euo pipefail
cd "$(dirname "$0")/.."
frames=assets-src/raw/.hero-v2-frames
mkdir -p "$frames"
find "$frames" -maxdepth 1 -name '*.png' -delete
ffmpeg -v error -y -i assets-src/raw/hero-v2b.mp4 "$frames/%04d.png"
python3 scripts/fix-hero-hand.py "$frames"
ffmpeg -v error -y -framerate 24 -i "$frames/%04d.png" -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p assets-src/raw/hero-v2c.mp4
find "$frames" -maxdepth 1 -name '*.png' -delete
rmdir "$frames"
echo "wrote assets-src/raw/hero-v2c.mp4"
