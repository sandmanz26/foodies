// Downloads every Higgsfield source listed in assets-src/sources.json into assets-src/raw/.
// usage: HF_CDN_BASE=https://<cdn-host>/<your-account-folder> node scripts/fetch-sources.mjs
// The base is the part of any result URL before "/hf_<stamp>_<job>.png" in your Higgsfield account.
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';

const base = (process.env.HF_CDN_BASE || '').replace(/\/+$/, '');
if (!base) {
  console.error('Set HF_CDN_BASE first (see the comment at the top of this file).');
  process.exit(1);
}
const { images, videos } = JSON.parse(readFileSync('assets-src/sources.json', 'utf8'));
mkdirSync('assets-src/raw', { recursive: true });
let failed = 0;
for (const s of [...images, ...videos]) {
  const out = `assets-src/raw/${s.file}`;
  if (existsSync(out)) { console.log('have', s.file); continue; }
  const ext = s.file.endsWith('.mp4') ? 'mp4' : 'png';
  const res = await fetch(`${base}/hf_${s.stamp}_${s.job}.${ext}`);
  if (!res.ok) { console.error('FAILED', s.file, res.status); failed++; continue; }
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('got ', s.file);
}
if (failed) process.exit(1);
