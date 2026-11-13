// Slices the two hero clips into the scroll-scrubbed frame sequence.
//   clip 1: empty table -> table set        clip 2: friends arrive -> toast
// Desktop frames are full 16:9; phone frames are a centred square crop so the table still fills the screen.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const RAW = 'assets-src/raw';
const OUT = 'public/media/hero';
const TMP = `${RAW}/.frames`;
const CLIPS = [
  { file: process.env.HERO_V1 || 'hero-v1.mp4', frames: 72 },
  { file: process.env.HERO_V2 || 'hero-v2b.mp4', frames: 120 },
];
const SETS = [
  { key: 'd', vf: 'scale=1280:-2', quality: 58 },
  { key: 'm', vf: 'crop=ih:ih,scale=640:640', quality: 58 },
];

rmSync(OUT, { recursive: true, force: true });
const manifest = { clips: [], sets: {} };

for (const set of SETS) {
  mkdirSync(`${OUT}/${set.key}`, { recursive: true });
  let n = 0;
  let bytes = 0;
  const perClip = [];
  for (const [ci, clip] of CLIPS.entries()) {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
    const dur = parseFloat(
      execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${RAW}/${clip.file}`]).toString(),
    );
    const fps = (clip.frames / dur).toFixed(4);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${RAW}/${clip.file}`, '-vf', `fps=${fps},${set.vf}`, `${TMP}/%04d.png`]);
    let files = readdirSync(TMP).sort();
    if (ci > 0) files = files.slice(1); // clip 2 opens on the frame clip 1 ended on
    perClip.push(files.length);
    for (const f of files) {
      const info = await sharp(`${TMP}/${f}`)
        .webp({ quality: set.quality, effort: 5, smartSubsample: true })
        .toFile(`${OUT}/${set.key}/${String(n++).padStart(3, '0')}.webp`);
      bytes += info.size;
    }
  }
  const meta = await sharp(`${OUT}/${set.key}/000.webp`).metadata();
  manifest.clips = perClip;
  manifest.sets[set.key] = { count: n, width: meta.width, height: meta.height };
  console.log(`${set.key}: ${n} frames, ${(bytes / 1048576).toFixed(2)} MB, ${meta.width}x${meta.height}`);
}
rmSync(TMP, { recursive: true, force: true });
writeFileSync('src/hero-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
