// Turns the raw generated stills in assets-src/raw into the responsive WebP set the site ships.
// Raw files are not committed (they are 5-8 MB PNGs); this script documents every crop applied.
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';

const RAW = 'assets-src/raw';
const OUT = 'public/media/photos';
mkdirSync(OUT, { recursive: true });

// crop = [left, top, width, height] as fractions of the source
const JOBS = [
  { src: 'p-senja', out: 'p-senja', widths: [420, 840] },
  { src: 'p-jambu', out: 'p-jambu', widths: [420, 840] },
  { src: 'p-kelapa', out: 'p-kelapa', widths: [420, 840] },
  { src: 'p-aren', out: 'p-aren', widths: [420, 840] },
  { src: 'p-telang', out: 'p-telang', widths: [420, 840] },
  { src: 'place-exterior', out: 'place-exterior', widths: [640, 1280] },
  { src: 'place-interior', out: 'place-interior', widths: [640, 1280, 1920] },
  // third-party espresso machine lettering retouched out
  { src: 'place-bar-clean', out: 'place-bar', widths: [640, 1280] },
  { src: 'place-corner', out: 'place-corner', widths: [480, 960] },
  { src: 'place-night', out: 'place-night', widths: [480, 960] },
  { src: 'm-pour', out: 'm-pour', widths: [480, 960] },
  { src: 'm-toast', out: 'm-toast', widths: [480, 960] },
  { src: 'm-friends', out: 'm-friends', widths: [640, 1280] },
  // tighter on the case; drops an out-of-place blurred background figure
  { src: 'm-pastry', out: 'm-pastry', widths: [480, 960], crop: [0.2, 0.1, 0.8, 0.8] },
  // drops a fake camera date stamp the model added in the corner
  { src: 'm-after', out: 'm-after', widths: [480, 960], crop: [0, 0, 0.9, 0.9] },
];

const manifest = {};
for (const j of JOBS) {
  const file = `${RAW}/${j.src}.png`;
  if (!existsSync(file)) { console.warn('skip (missing)', file); continue; }
  const meta = await sharp(file).metadata();
  let region = null;
  if (j.crop) {
    const [l, t, w, h] = j.crop;
    region = { left: Math.round(l * meta.width), top: Math.round(t * meta.height), width: Math.round(w * meta.width), height: Math.round(h * meta.height) };
  }
  const W = region ? region.width : meta.width, H = region ? region.height : meta.height;
  manifest[j.out] = { ratio: +(W / H).toFixed(4), widths: j.widths };
  for (const w of j.widths) {
    let p = sharp(file);
    if (region) p = p.extract(region);
    const info = await p.resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${j.out}-${w}.webp`);
    console.log(`${j.out}-${w}.webp`, (info.size / 1024).toFixed(0) + 'KB');
  }
}
writeFileSync('src/media-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
