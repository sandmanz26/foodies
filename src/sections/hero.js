// Hero: a scroll-scrubbed frame sequence. The first frame is a plain <img> so the page
// paints immediately; the other frames stream in afterwards, coarse to fine.
import manifest from '../hero-manifest.json';
import { qs, qsa, clamp, smooth, stickyProgress, BASE } from '../lib/dom.js';

// scroll progress -> story
const HOLD_EMPTY = 0.05; // "Meja kosong."
const CLIP1_END = 0.4; // table is set
const CLIP2_START = 0.48; // friends walk in
const CLIP2_END = 0.86; // toast
const BEATS = [
  [-1, 0.09],
  [0.24, 0.47],
  [0.55, 0.84],
];
const BRAND_AT = 0.88;

export function initHero() {
  const hero = qs('#hero');
  const stage = qs('.hero__stage', hero);
  const canvas = qs('.hero__canvas', hero);
  const ctx = canvas.getContext('2d', { alpha: false });
  const beats = qsa('.beat', hero);
  const brand = qs('[data-brand]', hero);
  const meter = qs('[data-meter]', hero);
  const mq = matchMedia('(max-width: 760px)');

  let set, total, n1, frames, shown = -1, current = 0, target = 0, raf = 0, inView = true;

  function frameFor(p) {
    if (p <= HOLD_EMPTY) return 0;
    if (p < CLIP1_END) return ((p - HOLD_EMPTY) / (CLIP1_END - HOLD_EMPTY)) * (n1 - 1);
    if (p < CLIP2_START) return n1 - 1;
    if (p < CLIP2_END) return n1 - 1 + ((p - CLIP2_START) / (CLIP2_END - CLIP2_START)) * (total - n1);
    return total - 1;
  }

  function load() {
    set = mq.matches ? 'm' : 'd';
    total = manifest.sets[set].count;
    n1 = manifest.clips[0];
    frames = new Array(total);
    shown = -1;
    // coarse-to-fine order: every 8th frame first, so scrubbing works within a second or two
    const order = [];
    const seen = new Set();
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < total; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    }
    let cursor = 0;
    const mySet = set;
    const next = () => {
      if (mySet !== set || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (mySet !== set) return;
        frames[i] = img;
        if (i === 0) { hero.classList.add('is-live'); resize(); }
        shown = -1;
        schedule();
        next();
      };
      img.onerror = next;
      img.src = `${BASE}media/hero/${set}/${String(i).padStart(3, '0')}.webp`;
    };
    for (let k = 0; k < 6; k++) next();
  }

  function nearest(i) {
    if (frames[i]) return i;
    for (let d = 1; d < total; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  }

  function draw() {
    if (!frames) return;
    const i = nearest(Math.round(current));
    if (i < 0 || i === shown) return;
    const img = frames[i];
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    shown = i;
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = stage.getBoundingClientRect();
    // the stage may be scaled by the closing transform; size from layout, not from the rect
    const w = stage.offsetWidth || r.width, h = stage.offsetHeight || r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    shown = -1;
    draw();
  }

  function update() {
    const p = stickyProgress(hero);
    target = frameFor(p);
    beats.forEach((b, i) => b.classList.toggle('is-on', p > BEATS[i][0] && p <= BEATS[i][1]));
    brand.classList.toggle('is-on', p >= BRAND_AT);
    meter.style.setProperty('--p', p.toFixed(3));
    // the full-bleed scene shrinks into a snapshot as the brand name lands
    const shrink = mq.matches ? 0 : smooth(clamp((p - 0.85) / 0.12));
    stage.style.setProperty('--shrink', shrink.toFixed(3));
    schedule();
  }

  function schedule() {
    if (!raf && inView) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    current += (target - current) * 0.22;
    if (Math.abs(target - current) < 0.05) current = target;
    draw();
    if (current !== target) schedule();
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { resize(); update(); });
  mq.addEventListener('change', () => { if (frames) load(); resize(); update(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) update(); }).observe(hero);
  }
  // the frame sequence waits for the page's own assets, so it never competes with first paint
  if (document.readyState === 'complete') load();
  else addEventListener('load', load, { once: true });
  resize();
  update();
}
