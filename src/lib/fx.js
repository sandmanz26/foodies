import { qs, qsa, reducedMotion } from './dom.js';

const COLORS = ['#F04E23', '#FFC93C', '#1F9D55', '#3D7BF2', '#FF9EC4', '#FFF4E0'];
let parts = [];
let raf = 0;
let ctx, canvas;

/** Paper confetti from a point on screen. Runs only while pieces are alive. */
export function confetti(x = innerWidth / 2, y = innerHeight / 2, count = 110) {
  if (reducedMotion()) return;
  canvas = canvas || qs('[data-confetti]');
  if (!canvas) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 13;
    parts.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 7,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.5,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += 0.42;
    p.vx *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= 0.008;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.scale(1, Math.cos(p.r * 2.4)); // paper flutter
    ctx.globalAlpha = Math.min(1, p.life * 3);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
  if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
}

/** Elements marked data-rise pop in once, when they enter the viewport. */
export function initRise() {
  const els = qsa('[data-rise]');
  if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-in'));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -12% 0px' },
  );
  els.forEach((e) => io.observe(e));
}

/** Run fn(visible) as an element enters or leaves the viewport (with a margin). */
export function whenVisible(el, fn, rootMargin = '0px') {
  if (!('IntersectionObserver' in window)) return fn(true);
  new IntersectionObserver((es) => es.forEach((e) => fn(e.isIntersecting)), { rootMargin }).observe(el);
}
