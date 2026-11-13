// Stir: the glass is seen from above, the same way the hero table is. Cold brew and coconut
// milk sit apart until the visitor stirs them together, and the brand name fills up as they do:
// in a bar called "loud", the visitor is the one who makes the noise.
import { qs, qsa, clamp, mixHex } from '../lib/dom.js';
import { setState } from '../lib/state.js';
import { confetti, whenVisible } from '../lib/fx.js';

const TURNS = 9; // full turns of the liquid needed
const COFFEE = '#4A2513', MILK = '#FFF6E6', LATTE = '#C99A6B', INK = '#2A1610';
const SIZE = 720, C = SIZE / 2, R = 290;

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

  let blobs, ice, turned, vel, auto, done, pointer, lastAngle, raf = 0, visible = false, last = 0, clinkAt = 0;
  let audio = null, soundOn = false;

  function reset() {
    // milk starts as a soft-edged half; every blob remembers its polar position
    blobs = [];
    for (let i = 0; i < 520; i++) {
      const x = Math.random() * R * 0.96, y = (Math.random() * 2 - 1) * R * 0.96;
      if (Math.hypot(x, y) > R * 0.94) continue;
      const edge = Math.sin(y * 0.02) * 26 + 18;
      if (x < edge) continue;
      blobs.push({ r: Math.hypot(x, y), a: Math.atan2(y, x), s: 18 + Math.random() * 26, drift: Math.random() * R * 0.9 });
    }
    ice = [0.5, 2.6, 4.4].map((a, i) => ({ a, r: R * (0.38 + i * 0.1), rot: a, s: 78 - i * 8 }));
    turned = 0; vel = 0; auto = false; done = false; pointer = null; lastAngle = null;
    cta.hidden = true; again.hidden = true;
    setMeter();
    say();
  }

  const mix = () => clamp(turned / (Math.PI * 2 * TURNS));

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
    cta.hidden = false; again.hidden = false;
    say(); clink(true);
    const r = canvas.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, 120);
  }

  function step(dt) {
    if (auto && !done) vel += (8 - vel) * Math.min(1, dt * 4);
    const d = vel * dt;
    if (!done && Math.abs(d) > 0) {
      turned += Math.abs(d);
      if (turned - clinkAt > 1.5) { clinkAt = turned; clink(false); }
      setMeter(); say();
      if (mix() >= 1) finish();
    }
    const m = mix();
    for (const b of blobs) {
      b.a += d * (0.3 + 0.9 * (1 - b.r / R)); // the middle turns faster: that is what draws the spiral
      b.r += (b.drift - b.r) * Math.min(1, Math.abs(d) * 0.05); // and slowly spreads the milk out
    }
    for (const c of ice) { c.a += d * 0.75; c.rot += d * 0.4; }
    vel *= Math.pow(0.04, dt); // liquid drag
    if (Math.abs(vel) < 0.01) vel = 0;
    return m;
  }

  function draw(m) {
    ctx.clearRect(0, 0, SIZE, SIZE);
    // shadow + glass rim
    ctx.fillStyle = 'rgba(42,22,16,.22)';
    ctx.beginPath(); ctx.ellipse(C + 16, C + 20, R + 26, R + 26, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFFDF8'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(C, C, R + 24, 0, 7); ctx.fill(); ctx.stroke();
    // liquid
    ctx.save();
    ctx.beginPath(); ctx.arc(C, C, R, 0, 7); ctx.clip();
    ctx.fillStyle = mixHex(COFFEE, LATTE, m * m);
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = mixHex(MILK, LATTE, m * 0.85);
    ctx.globalAlpha = 0.55 * (1 - m * m * 0.8);
    for (const b of blobs) {
      ctx.beginPath(); ctx.arc(C + Math.cos(b.a) * b.r, C + Math.sin(b.a) * b.r, b.s, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (done) {
      // a small smile drawn in milk, like latte art
      ctx.strokeStyle = MILK; ctx.fillStyle = MILK; ctx.lineWidth = 14; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(C - 70, C - 50, 16, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(C + 70, C - 50, 16, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(C, C - 10, 110, 0.5, Math.PI - 0.5); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(C, C, R, 0, 7); ctx.stroke();
    // ice
    for (const c of ice) {
      ctx.save();
      ctx.translate(C + Math.cos(c.a) * c.r, C + Math.sin(c.a) * c.r); ctx.rotate(c.rot);
      ctx.fillStyle = 'rgba(255,253,248,.86)'; ctx.strokeStyle = INK; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(-c.s / 2, -c.s / 2, c.s, c.s, 14); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-c.s * 0.22, -c.s * 0.24); ctx.lineTo(c.s * 0.1, -c.s * 0.24); ctx.stroke();
      ctx.restore();
    }
    // spoon follows the hand
    if (pointer && !done) {
      const ang = Math.atan2(pointer.y - C, pointer.x - C);
      ctx.save(); ctx.translate(pointer.x, pointer.y); ctx.rotate(ang);
      ctx.strokeStyle = INK; ctx.lineWidth = 22; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(420, 0); ctx.stroke();
      ctx.strokeStyle = '#FFC93C'; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(420, 0); ctx.stroke();
      ctx.fillStyle = '#FFC93C'; ctx.strokeStyle = INK; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(0, 0, 46, 32, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }

  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    draw(step(dt));
    if (visible && (vel !== 0 || auto || pointer)) kick();
  }
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  const toCanvas = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };
  canvas.addEventListener('pointerdown', (e) => {
    pointer = toCanvas(e);
    if (Math.hypot(pointer.x - C, pointer.y - C) > R + 30) { pointer = null; return; }
    canvas.setPointerCapture(e.pointerId);
    lastAngle = Math.atan2(pointer.y - C, pointer.x - C);
    kick();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointer) return;
    const p = toCanvas(e);
    const d = Math.hypot(p.x - C, p.y - C);
    // keep the spoon inside the glass
    pointer = d > R - 40 ? { x: C + ((p.x - C) / d) * (R - 40), y: C + ((p.y - C) / d) * (R - 40) } : p;
    const a = Math.atan2(p.y - C, p.x - C);
    let da = a - lastAngle;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    lastAngle = a;
    if (d > 30) vel = clamp(vel + da * 4.5, -11, 11);
    kick();
  });
  const up = () => { pointer = null; lastAngle = null; kick(); };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) vel = clamp(vel + 3.2, -14, 14);
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) vel = clamp(vel - 3.2, -14, 14);
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
  again.addEventListener('click', () => { reset(); draw(0); canvas.focus({ preventScroll: true }); });

  reset();
  draw(0);
  whenVisible(canvas, (v) => { visible = v; if (v) { draw(mix()); kick(); } }, '10% 0px');
}
