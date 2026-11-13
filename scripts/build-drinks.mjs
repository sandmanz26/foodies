// Encodes the five drink-build clips for the menu: silent MP4s built for scroll scrubbing.
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync } from 'node:fs';

const OUT = 'public/media/drinks';
mkdirSync(OUT, { recursive: true });
for (const id of ['senja', 'jambu', 'kelapa', 'aren', 'telang']) {
  const src = `assets-src/raw/d-${id}.mp4`;
  if (!existsSync(src)) { console.warn('skip (missing)', src); continue; }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-an', '-vf', 'scale=640:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
    // every second frame is a keyframe: the clip is scrubbed by scroll, so seeking must be instant
    '-g', '2', '-keyint_min', '2', '-bf', '0', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', `${OUT}/${id}.mp4`]);
  console.log(`${id}.mp4`, (statSync(`${OUT}/${id}.mp4`).size / 1024).toFixed(0) + 'KB');
}
