// Stir: a real glass, filmed from straight above on the same yellow table the story began on.
// Cold brew and coconut milk sit unmixed until the visitor stirs; their circling gesture drives
// the footage frame by frame, and the brand name fills up as they go. In a bar whose name means
// "loud", the visitor is the one who makes the noise.
import manifest from '../stir-manifest.json';
import { qs, qsa, clamp, BASE } from '../lib/dom.js';
import { setState } from '../lib/state.js';
import { confetti, whenVisible } from '../lib/fx.js';
import { track } from '../lib/growth.js';

const TURNS = 9; // full turns of the liquid needed
const SIZE = 720, C = SIZE / 2, GLASS = 190; // glass radius inside the frame, in canvas px

export function initStir() {
  const canvas = qs('[data-stir-canvas]');
  const ctx = canvas.getContext('2d');
  const meter = qs('[data-stir-meter]');
  const status = qs('[data-stir-status]');
  const cta = qs('[data-stir-cta]');
  const again = qs('[data-stir-again]');
  const soundBtn = qs('[data-stir-sound]');
  const letters = qsa('.wm-l', meter);
  const touch = matchMedia('(pointer: coarse)').matches;
  const N = manifest.count;
  const frames = new Array(N);

  let turned, vel, auto, done, pointer, lastAngle, shown = 0, raf = 0, visible = false, last = 0, clinkAt = 0, asked = false;
  let audio = null, soundOn = false;

  const mix = () => clamp(turned / (Math.PI * 2 * TURNS));

  function loadFrames() {
    if (asked) return;
    asked = true;
    let cursor = 0;
    const order = [];
    const seen = new Set();
    for (const step of [8, 4, 2, 1]) for (let i = 0; i < N; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    const next = () => {
      if (cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.onload = async () => { try { await img.decode(); } catch { /* still drawable */ } frames[i] = img; if (i === 0) draw(); next(); };
      img.onerror = next;
      img.src = `${BASE}media/stir/${String(i).padStart(3, '0')}.webp`;
    };
    for (let k = 0; k < 4; k++) next();
  }
  function nearest(i) {
    if (frames[i]) return frames[i];
    for (let d = 1; d < N; d++) { if (frames[i - d]) return frames[i - d]; if (frames[i + d]) return frames[i + d]; }
    return null;
  }

  function reset() {
    turned = 0; vel = 0; auto = false; done = false; pointer = null; lastAngle = null; shown = 0;
    cta.hidden = true; again.hidden = true;
    setMeter(); say();
  }
  function setMeter() {
    const m = mix();
    meter.setAttribute('aria-valuenow', Math.round(m * 100));
    letters.forEach((l, i) => l.classList.toggle('is-lit', m >= (i + 1) / letters.length - 0.001));
  }
  function say() {
    const m = mix();
    status.textContent = done ? "That's the colour. That's the noise."
      : m > 0.7 ? 'Louder.'
      : m > 0.3 ? "Keep going. It's waking up."
      : touch ? 'Swipe in circles to stir.' : 'Drag in circles to stir.';
  }

  function clink(big) {
    if (!soundOn) return;
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime;
    (big ? [1568, 1976, 2349] : [1700 + Math.random() * 900]).forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.07);
      g.gain.exponentialRampToValueAtTime(big ? 0.16 : 0.09, t + i * 0.07 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + (big ? 0.6 : 0.16));
      o.connect(g).connect(audio.destination);
      o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.7);
    });
  }

  function finish() {
    done = true; auto = false;
    setState({ stirred: true });
    track('stir_completed');
    cta.hidden = false; again.hidden = false;
    say(); clink(true);
    const r = canvas.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, 120);
  }

  function step(dt) {
    if (auto && !done) vel += (8 - vel) * Math.min(1, dt * 4);
    const d = vel * dt;
    if (!done && d !== 0) {
      turned += Math.abs(d);
      if (turned - clinkAt > 1.5) { clinkAt = turned; clink(false); }
      setMeter(); say();
      if (mix() >= 1) finish();
    }
    vel *= Math.pow(0.04, dt); // liquid drag
    if (Math.abs(vel) < 0.01) vel = 0;
  }

  function spoon() {
    // a bar spoon: steel bowl in the drink, long handle leaving the glass toward the hand
    const ang = Math.atan2(pointer.y - C, pointer.x - C);
    ctx.save();
    ctx.translate(pointer.x, pointer.y);
    ctx.rotate(ang);
    ctx.shadowColor = 'rgba(42,22,16,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 10;
    const steel = ctx.createLinearGradient(0, -12, 0, 12);
    steel.addColorStop(0, '#FDFDFB'); steel.addColorStop(0.45, '#C9CCD1'); steel.addColorStop(0.55, '#8E949C'); steel.addColorStop(1, '#E6E8EB');
    ctx.strokeStyle = steel; ctx.lineWidth = 11; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(560, 0); ctx.stroke();
    ctx.shadowColor = 'transparent';
    const bowl = ctx.createRadialGradient(-8, -8, 2, 0, 0, 40);
    bowl.addColorStop(0, '#FFFFFF'); bowl.addColorStop(0.5, '#C9CCD1'); bowl.addColorStop(1, '#7E858E');
    ctx.fillStyle = bowl; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.ellipse(0, 0, 38, 25, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  function draw() {
    const f = mix() * (N - 1);
    shown += (f - shown) * 0.35; // ease the footage so quick flicks do not jump
    const lo = Math.floor(shown), frac = shown - lo;
    const a = nearest(lo);
    if (a) {
      ctx.globalAlpha = 1; ctx.drawImage(a, 0, 0, SIZE, SIZE);
      const b = frames[lo + 1];
      if (b && frac > 0.03) { ctx.globalAlpha = frac; ctx.drawImage(b, 0, 0, SIZE, SIZE); ctx.globalAlpha = 1; }
    }
    if (pointer && !done) spoon();
    return Math.abs(f - shown) > 0.02;
  }

  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt);
    const settling = draw();
    if (visible && (vel !== 0 || auto || pointer || settling)) kick();
  }
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  const toCanvas = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };
  canvas.addEventListener('pointerdown', (e) => {
    const p = toCanvas(e);
    if (Math.hypot(p.x - C, p.y - C) > GLASS + 60) return;
    pointer = p;
    canvas.setPointerCapture(e.pointerId);
    lastAngle = Math.atan2(p.y - C, p.x - C);
    kick();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointer) return;
    const p = toCanvas(e);
    const d = Math.hypot(p.x - C, p.y - C);
    const lim = GLASS - 34; // keep the spoon inside the glass
    pointer = d > lim ? { x: C + ((p.x - C) / d) * lim, y: C + ((p.y - C) / d) * lim } : p;
    const a = Math.atan2(p.y - C, p.x - C);
    let da = a - lastAngle;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    lastAngle = a;
    if (d > 24) vel = clamp(vel + da * 4.5, -11, 11);
    kick();
  });
  const up = () => { pointer = null; lastAngle = null; kick(); };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) vel = clamp(vel + 3.2, -11, 11);
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) vel = clamp(vel - 3.2, -11, 11);
    else if (e.key === 'Enter') auto = true;
    else return;
    e.preventDefault();
    kick();
  });
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.textContent = `Sound: ${soundOn ? 'on' : 'off'}`;
    clink(false);
  });
  again.addEventListener('click', () => { reset(); kick(); canvas.focus({ preventScroll: true }); });

  reset();
  whenVisible(canvas, (v) => { visible = v; if (v) { loadFrames(); kick(); } }, '100% 0px');
}
