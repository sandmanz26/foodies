// Encodes the five drink-build clips for the menu: small, silent, streamable MP4s.
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync } from 'node:fs';

const OUT = 'public/media/drinks';
mkdirSync(OUT, { recursive: true });
for (const id of ['senja', 'jambu', 'kelapa', 'aren', 'telang']) {
  const src = `assets-src/raw/d-${id}.mp4`;
  if (!existsSync(src)) { console.warn('skip (missing)', src); continue; }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-an', '-vf', 'scale=720:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', `${OUT}/${id}.mp4`]);
  console.log(`${id}.mp4`, (statSync(`${OUT}/${id}.mp4`).size / 1024).toFixed(0) + 'KB');
}
