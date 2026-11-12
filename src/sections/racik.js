// Racik: the visitor builds a drink in three steps. The point of the section is the brand's
// promise that happiness is personal, so every combination gets a name and is treated as right.
import { RACIK, PRODUCTS } from '../content.js';
import { qs, clamp, mixHex } from '../lib/dom.js';
import { setState, getState } from '../lib/state.js';
import { confetti, whenVisible } from '../lib/fx.js';

const BOTTOM = 274, TOP = 62; // liquid travel inside the SVG glass
const COFFEE_LEVEL = 0.3, MAX_MILK = 0.58, MIN_MILK = 0.08;
const GLASS_PATH = 'M38 46 52 260Q54 278 72 278H128Q146 278 148 260L162 46';

const GARNISH = {
  jeruk: `<g transform="translate(150 40) rotate(18)"><circle r="26" fill="#E0731A" stroke="#2A1610" stroke-width="2.500"/><circle r="20" fill="#F7A63B"/><path d="M0-20V20M-20 0H20M-14-14 14 14M14-14-14 14" stroke="#FFE2A8" stroke-width="2.500"/></g>`,
  aren: `<g transform="translate(146 30) rotate(-12)"><rect x="-18" y="-16" width="36" height="32" rx="6" fill="#B5651D" stroke="#2A1610" stroke-width="2.500"/><path d="M-8-6h16M-8 4h10" stroke="#8A4310" stroke-width="3" stroke-linecap="round"/></g>`,
  pandan: `<g transform="translate(140 48)" fill="#2E9E4F" stroke="#2A1610" stroke-width="2.500" stroke-linejoin="round"><path d="M0 0Q14-50 40-64 30-26 0 0Z"/><path d="M0 0Q-4-48 12-78 20-36 0 0Z" fill="#1D7A3A"/><circle r="7" fill="#1D7A3A"/></g>`,
  stroberi: `<g transform="translate(150 36) rotate(14)" stroke="#2A1610" stroke-width="2.500" stroke-linejoin="round"><path d="M0 28C-26 14-24-14 0-14 24-14 26 14 0 28Z" fill="#F0425F"/><path d="M-12-14 0-24 12-14 0-8Z" fill="#2E9E4F"/><g fill="#FFE2A8" stroke="none"><circle cx="-8" cy="0" r="1.800"/><circle cx="6" cy="-2" r="1.800"/><circle cx="0" cy="10" r="1.800"/></g></g>`,
  telang: `<g transform="translate(150 38)" stroke="#2A1610" stroke-width="2.500"><g fill="#6D7CFF"><circle cx="0" cy="-14" r="10"/><circle cx="13" cy="-4" r="10"/><circle cx="8" cy="11" r="10"/><circle cx="-8" cy="11" r="10"/><circle cx="-13" cy="-4" r="10"/></g><circle r="6" fill="#FFC93C"/></g>`,
};

export function initRacik() {
  const glassEl = qs('[data-racik-glass]');
  const panel = qs('[data-racik-panel]');
  const stepsEl = qs('[data-racik-steps]');
  stepsEl.innerHTML = ['Pilih kopimu', 'Tuang susunya', 'Kasih twist'].map((s) => `<li>${s}</li>`).join('');

  glassEl.innerHTML = `
    <svg viewBox="0 0 200 300" role="img" aria-label="Gelas racikanmu">
      <defs>
        <clipPath id="rk-clip"><path d="${GLASS_PATH}Z"/></clipPath>
        <linearGradient id="rk-grad" x1="0" y1="0" x2="0" y2="1">
          <stop data-s="twist" offset="0" stop-color="#3A1D10"/><stop data-s="top" offset=".2" stop-color="#3A1D10"/><stop data-s="bot" offset="1" stop-color="#3A1D10"/>
        </linearGradient>
      </defs>
      <ellipse cx="112" cy="282" rx="66" ry="9" fill="#2A1610" opacity=".22"/>
      <path d="${GLASS_PATH}Z" fill="#FFFDF8" opacity=".55"/>
      <g clip-path="url(#rk-clip)">
        <rect data-stream x="94" y="-60" width="12" height="0" rx="6" fill="#FFF6E6"/>
        <path data-liquid fill="url(#rk-grad)" d=""/>
      </g>
      <g data-garnish></g>
      <path d="${GLASS_PATH}" fill="none" stroke="#2A1610" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M52 62 62 232" stroke="#FFFDF8" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <g data-face>
        <ellipse cx="84" cy="176" rx="9" ry="11" fill="#FFFDF8" stroke="#2A1610" stroke-width="2.500"/>
        <ellipse cx="116" cy="176" rx="9" ry="11" fill="#FFFDF8" stroke="#2A1610" stroke-width="2.500"/>
        <circle data-pupil cx="85" cy="178" r="4" fill="#2A1610"/><circle data-pupil cx="117" cy="178" r="4" fill="#2A1610"/>
        <path data-mouth d="" fill="#2A1610" stroke="#2A1610" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="68" cy="194" r="7" fill="#FF9EC4" opacity=".9"/><circle cx="132" cy="194" r="7" fill="#FF9EC4" opacity=".9"/>
      </g>
    </svg>`;

  const liquid = qs('[data-liquid]', glassEl);
  const stream = qs('[data-stream]', glassEl);
  const mouth = qs('[data-mouth]', glassEl);
  const garnish = qs('[data-garnish]', glassEl);
  const stop = (k) => qs(`[data-s="${k}"]`, glassEl);

  const s = { step: 0, coffee: null, milk: RACIK.milks[0], twist: null, level: 0, levelTo: 0, milkAmt: 0, pouring: false, visible: false };
  let raf = 0, last = 0, t = 0, amp = 1.5;

  const MOUTHS = {
    sleepy: 'M92 198h16',
    wow: 'M100 192a7 9 0 1 0 .01 0Z',
    happy: 'M88 194q12 16 24 0Z',
  };
  const setMouth = (m) => { mouth.setAttribute('d', MOUTHS[m]); mouth.setAttribute('fill', m === 'sleepy' ? 'none' : '#2A1610'); };

  function paint() {
    const y = BOTTOM - s.level * (BOTTOM - TOP);
    let d = `M20 ${y.toFixed(1)}`;
    for (let x = 20; x <= 180; x += 10) d += `L${x} ${(y + Math.sin(x * 0.07 + t * 5) * amp).toFixed(1)}`;
    liquid.setAttribute('d', `${d}L180 300H20Z`);
    const share = s.level > 0 ? s.milkAmt / s.level : 0;
    const coffee = s.coffee ? s.coffee.color : '#3A1D10';
    const top = mixHex(coffee, s.milk.color, clamp(share * 1.5));
    stop('bot').setAttribute('stop-color', mixHex(coffee, s.milk.color, clamp(share * 0.75)));
    stop('top').setAttribute('stop-color', top);
    stop('twist').setAttribute('stop-color', s.twist ? mixHex(top, s.twist.tint, 0.75) : top);
    if (s.pouring) {
      stream.setAttribute('height', Math.max(0, y + 60));
      stream.setAttribute('fill', s.step === 0 ? coffee : s.milk.color);
    } else {
      stream.setAttribute('height', 0);
    }
    panel.style.setProperty('--m', clamp(share / 0.66).toFixed(3));
  }

  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    t += dt;
    if (s.pouring && s.step === 1) {
      s.milkAmt = Math.min(MAX_MILK, s.milkAmt + dt * 0.24);
      s.levelTo = COFFEE_LEVEL + s.milkAmt;
      if (s.milkAmt >= MAX_MILK) stopPour();
      syncNext();
    }
    s.level += (s.levelTo - s.level) * Math.min(1, dt * 7);
    amp += ((s.pouring ? 5 : 1.4) - amp) * Math.min(1, dt * 4);
    paint();
    if (s.visible) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf && s.visible) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  function startPour() {
    if (s.step !== 1 || s.pouring) return;
    s.pouring = true; s.pourStart = performance.now();
    setMouth('wow');
    qs('.racik__pour', panel)?.classList.add('is-pouring');
  }
  function stopPour() {
    if (!s.pouring) return;
    // a quick tap still adds a splash, so the control works without holding
    if (performance.now() - s.pourStart < 220) {
      s.milkAmt = Math.min(MAX_MILK, s.milkAmt + 0.07);
      s.levelTo = COFFEE_LEVEL + s.milkAmt;
    }
    s.pouring = false;
    setMouth('happy');
    qs('.racik__pour', panel)?.classList.remove('is-pouring');
    syncNext();
  }
  function syncNext() {
    const b = qs('[data-next]', panel);
    if (b) b.disabled = s.milkAmt < MIN_MILK;
  }

  const chips = (list, sel, attr) => list.map((o) => `<button class="chip" type="button" data-${attr}="${o.id}" aria-pressed="${sel?.id === o.id}">${o.label}${o.note ? ` <small>${o.note}</small>` : ''}</button>`).join('');

  function view() {
    [...stepsEl.children].forEach((li, i) => {
      li.classList.toggle('is-now', i === s.step);
      li.classList.toggle('is-done', i < s.step);
    });
    if (s.step === 0) {
      panel.innerHTML = `<p class="racik__q">Pilih kopimu</p><p class="racik__hint">Ini dasarnya. Mau yang tegas atau yang kalem?</p>
        <div class="racik__opts">${chips(RACIK.coffees, s.coffee, 'coffee')}</div>`;
    } else if (s.step === 1) {
      panel.innerHTML = `<p class="racik__q">Tuang susunya</p><p class="racik__hint">Tahan tombolnya. Lepas kalau sudah pas.</p>
        <div class="racik__opts">${chips(RACIK.milks, s.milk, 'milk')}</div>
        <button class="btn btn--big racik__pour" type="button" data-pour>Tahan untuk menuang</button>
        <div class="racik__meter"><span>pahit</span><b></b><span>creamy</span></div>
        <div class="racik__actions"><button class="btn btn--ghost" type="button" data-next disabled>Sudah pas</button></div>`;
    } else if (s.step === 2) {
      panel.innerHTML = `<p class="racik__q">Kasih twist</p><p class="racik__hint">Ini yang bikin jadi koktail.</p>
        <div class="racik__opts">${chips(RACIK.twists, s.twist, 'twist')}</div>
        <div class="racik__actions"><button class="btn btn--big" type="button" data-done ${s.twist ? '' : 'disabled'}>Jadi!</button></div>`;
    } else {
      const r = getState().racik;
      const match = PRODUCTS.find((p) => p.id === r.match);
      panel.innerHTML = `<p class="racik__hint">Racikanmu bernama</p>
        <p class="racik__result-name">${r.name}</p>
        <p class="racik__recipe">${r.recipe}</p>
        <p class="racik__say">Nggak ada di menu, tapi ada di kamu. Paling dekat dengan <strong>${match.name}</strong>, jadi di bar bilang saja: <b>“${match.name}, ${r.ask}.”</b></p>
        <div class="racik__actions"><a class="btn" href="#dinding">Tempel di dinding</a><button class="btn btn--ghost" type="button" data-again>Racik lagi</button></div>`;
    }
    syncNext();
  }

  function finish() {
    const share = s.milkAmt / (COFFEE_LEVEL + s.milkAmt);
    const strength = RACIK.strengths.find((x) => share <= x.max);
    const top = mixHex(s.coffee.color, s.milk.color, clamp(share * 1.5));
    setState({
      racik: {
        name: `${s.twist.word} ${strength.word}`,
        recipe: `${s.coffee.label} · ${Math.round(share * 100)}% ${s.milk.label.toLowerCase()} · twist ${s.twist.label.toLowerCase()}`,
        ask: strength.ask,
        match: s.twist.match,
        colors: [mixHex(top, s.twist.tint, 0.75), top, mixHex(s.coffee.color, s.milk.color, clamp(share * 0.75))],
      },
    });
    s.step = 3;
    view();
    const r = glassEl.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height * 0.3, 90);
  }

  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.coffee) {
      s.coffee = RACIK.coffees.find((c) => c.id === b.dataset.coffee);
      s.pouring = true; setMouth('wow'); s.levelTo = COFFEE_LEVEL; kick();
      setTimeout(() => { s.pouring = false; setMouth('happy'); s.step = 1; view(); }, 750);
      view();
    } else if (b.dataset.milk) {
      s.milk = RACIK.milks.find((m) => m.id === b.dataset.milk);
      [...b.parentNode.children].forEach((c) => c.setAttribute('aria-pressed', c === b));
    } else if (b.dataset.twist) {
      s.twist = RACIK.twists.find((x) => x.id === b.dataset.twist);
      garnish.innerHTML = GARNISH[s.twist.id];
      garnish.animate([{ transform: 'translateY(-40px) scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.3,1.5,.5,1)' });
      view();
    } else if ('next' in b.dataset) {
      s.step = 2; view();
    } else if ('done' in b.dataset) {
      finish();
    } else if ('again' in b.dataset) {
      Object.assign(s, { step: 0, coffee: null, twist: null, levelTo: 0, milkAmt: 0 });
      garnish.innerHTML = ''; setMouth('sleepy'); view();
    }
    kick();
  });
  panel.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-pour]')) { e.preventDefault(); startPour(); kick(); } });
  addEventListener('pointerup', stopPour);
  addEventListener('pointercancel', stopPour);
  panel.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && e.target.closest('[data-pour]')) { e.preventDefault(); startPour(); kick(); } });
  panel.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stopPour(); });
  panel.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-pour]')) e.preventDefault(); });

  setMouth('sleepy');
  view();
  paint();
  whenVisible(glassEl, (v) => { s.visible = v; kick(); }, '20% 0px');
}
