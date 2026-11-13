// Renders the favicon set and the social share image from the brand's own vector shapes.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { burstPath } from '../src/brand/shapes.js';
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from '../src/brand/wordmark.js';

const TOMATO = '#F04E23', TURMERIC = '#FFC93C', PINK = '#FF9EC4', INK = '#2A1610', CREAM = '#FFF4E0';

// Si Riuh, the mascot, as a standalone face (same drawing as public/favicon.svg)
const face = (size, pad, bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${100 + pad * 2} ${100 + pad * 2}">
  ${bg ? `<rect x="${-pad}" y="${-pad}" width="${100 + pad * 2}" height="${100 + pad * 2}" fill="${bg}"/>` : ''}
  <path d="${burstPath(12, 46, 35)}" fill="${bg ? TURMERIC : TOMATO}" stroke="${bg ? TURMERIC : TOMATO}" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="31" cy="56" r="6" fill="${PINK}"/><circle cx="69" cy="56" r="6" fill="${PINK}"/>
  <path d="M34 47q5-8 10 0M56 47q5-8 10 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <path d="M40 56q10 14 20 0z" fill="${INK}"/></svg>`;

const icons = [
  ['public/favicon-32.png', 32, 2, null],
  ['public/apple-touch-icon.png', 180, 14, TOMATO],
  ['public/icon-192.png', 192, 10, TOMATO],
  ['public/icon-512.png', 512, 10, TOMATO],
  ['public/icon-512-maskable.png', 512, 30, TOMATO], // content kept inside the maskable safe zone
];
for (const [file, size, pad, bg] of icons) {
  await sharp(Buffer.from(face(size, pad, bg))).png().toFile(file);
  console.log(file);
}

// Share image: the final hero frame (friends toasting) with the wordmark on a tomato badge.
const [, , vw, vh] = WORDMARK_VIEWBOX.split(' ').map(Number);
const W = 1200, H = 630, bw = 340, bh = Math.round((bw * vh) / vw);
const badge = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <g transform="translate(52 44) rotate(-4)">
    <rect x="12" y="12" width="${bw + 64}" height="${bh + 52}" rx="30" fill="${INK}"/>
    <rect x="0" y="0" width="${bw + 64}" height="${bh + 52}" rx="30" fill="${TOMATO}" stroke="${INK}" stroke-width="6"/>
    <svg x="32" y="26" width="${bw}" height="${bh}" viewBox="${WORDMARK_VIEWBOX}">
      ${WORDMARK_PATHS.map((p) => `<path d="${p.d}" fill="${TURMERIC}"/>`).join('')}
    </svg>
  </g>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${CREAM}"/>
</svg>`;
const frames = readFileSync('src/hero-manifest.json', 'utf8');
const last = JSON.parse(frames).sets.d.count - 1;
await sharp(`public/media/hero/d/${String(last).padStart(3, '0')}.webp`)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(badge) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/media/og.jpg');
console.log('public/media/og.jpg');
