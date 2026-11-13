// Slices the top-down stirring clip into the frame sequence the Stir section scrubs.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'assets-src/raw/stir.mp4';
const OUT = 'public/media/stir';
const TMP = 'assets-src/raw/.stir';
const FRAMES = 80;

rmSync(OUT, { recursive: true, force: true });
rmSync(TMP, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
// the drink is fully blended about 3.6 s in; the rest of the clip is a still glass
const dur = 3.6;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-t', String(dur), '-i', SRC, '-vf', `fps=${(FRAMES / dur).toFixed(4)},scale=720:720`, `${TMP}/%04d.png`]);
let bytes = 0;
const files = readdirSync(TMP).sort();
for (const [i, f] of files.entries()) {
  const info = await sharp(`${TMP}/${f}`).webp({ quality: 64, effort: 5 }).toFile(`${OUT}/${String(i).padStart(3, '0')}.webp`);
  bytes += info.size;
}
rmSync(TMP, { recursive: true, force: true });
writeFileSync('src/stir-manifest.json', JSON.stringify({ count: files.length }) + '\n');
console.log(`${files.length} frames, ${(bytes / 1048576).toFixed(2)} MB`);
