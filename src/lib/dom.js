import manifest from '../media-manifest.json';

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const BASE = import.meta.env.BASE_URL;
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Responsive attributes for a photo produced by scripts/build-media.mjs. */
export function photo(name, sizes = '100vw') {
  const m = manifest[name];
  if (!m) return { src: '', srcset: '', sizes, width: 4, height: 3 };
  const url = (w) => `${BASE}media/photos/${name}-${w}.webp`;
  const top = m.widths[m.widths.length - 1];
  return {
    src: url(m.widths[0]),
    srcset: m.widths.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes,
    width: top,
    height: Math.round(top / m.ratio),
  };
}
export function photoTag(name, alt, sizes, extra = '') {
  const p = photo(name, sizes);
  return `<img src="${p.src}" srcset="${p.srcset}" sizes="${p.sizes}" width="${p.width}" height="${p.height}" alt="${alt}" loading="lazy" decoding="async" draggable="false" ${extra}/>`;
}

/** Progress (0..1) of a tall section with a sticky child, as the viewport travels through it. */
export function stickyProgress(el) {
  const r = el.getBoundingClientRect();
  const span = r.height - innerHeight;
  return span <= 0 ? 0 : clamp(-r.top / span);
}

export function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, t));
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
}
