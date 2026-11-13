// Menu: five drinks, one per "page" of scroll. Each is filmed being built, and the visitor's
// scroll is the bartender's hand: scrolling through a drink's page pours it, at their pace.
import { PRODUCTS } from '../content.js';
import { qs, clamp, stickyProgress, photo, BASE } from '../lib/dom.js';
import { whenVisible } from '../lib/fx.js';

const POUR_FROM = 0.06; // share of a drink's page before the pour starts
const POUR_TO = 0.8; // ...and where the finished drink holds

export function initMenu() {
  const menu = qs('#menu');
  const info = qs('[data-menu-info]', menu);
  const side = qs('[data-menu-side]', menu);
  const ghost = qs('[data-menu-ghost]', menu);
  const dots = qs('[data-menu-dots]', menu);
  const arch = qs('[data-menu-arch]', menu);
  const n = PRODUCTS.length;
  let index = -1, visible = false, raf = 0, armed = false;
  const now = new Array(n).fill(0); // eased playhead per clip, in seconds
  const want = new Array(n).fill(0);

  dots.innerHTML = PRODUCTS.map(
    (p, i) => `<button class="menu__dot" type="button" role="tab" style="--c:${p.bg}" aria-label="${p.name}" data-i="${i}"></button>`,
  ).join('');
  arch.innerHTML = PRODUCTS.map(
    (p) => `<video class="menu__video" muted playsinline preload="none" disablepictureinpicture tabindex="-1"
      poster="${photo(`p-${p.id}`).src.replace('-420', '-840')}" aria-label="${p.name} being built: ${p.ingredients.join(', ')}."></video>`,
  ).join('');
  const videos = [...arch.children];

  // clips are fetched only when the section is near, and primed so mobile browsers allow seeking
  function arm() {
    if (armed) return;
    armed = true;
    videos.forEach((v, i) => {
      v.src = `${BASE}media/drinks/${PRODUCTS[i].id}.mp4`;
      v.preload = 'auto';
      v.addEventListener('loadeddata', () => { v.classList.add('is-ready'); v.play().then(() => v.pause()).catch(() => {}); kick(); }, { once: true });
      v.load();
    });
  }

  function render(i) {
    if (i === index) return;
    index = i;
    const p = PRODUCTS[i];
    menu.style.setProperty('--bg', p.bg);
    menu.style.setProperty('--fg', p.fg);
    ghost.textContent = p.name.split(' ')[0];
    info.innerHTML = `
      <p class="menu__count">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</p>
      <h3 class="menu__name">${p.name}</h3>
      <p class="menu__line">${p.line}</p>
      <ul class="menu__chips">${p.ingredients.map((x) => `<li class="chip">${x}</li>`).join('')}</ul>`;
    const taste = Object.entries(p.taste)
      .map(([k, v]) => `<span>${k}</span><span class="taste__dots" role="img" aria-label="${v} out of 5">${[1, 2, 3, 4, 5].map((d) => `<i class="${d <= v ? 'on' : ''}"></i>`).join('')}</span>`)
      .join('');
    side.innerHTML = `
      <p class="menu__family">${p.family}</p>
      <p class="menu__gloss">${p.gloss}</p>
      <div class="taste">${taste}</div>`;
    videos.forEach((v, k) => v.classList.toggle('is-on', k === i));
    [...dots.children].forEach((d, k) => d.setAttribute('aria-selected', k === i ? 'true' : 'false'));
  }

  function update() {
    const t = stickyProgress(menu) * n;
    const i = clamp(Math.floor(t), 0, n - 1);
    render(i);
    const q = clamp((t - i - POUR_FROM) / (POUR_TO - POUR_FROM));
    menu.classList.toggle('is-poured', q >= 1);
    videos.forEach((v, k) => {
      const d = v.duration || 5;
      want[k] = k < i ? d - 0.05 : k > i ? 0 : q * (d - 0.05);
    });
    kick();
  }

  function tick() {
    raf = 0;
    let moving = false;
    const v = videos[index];
    if (v && v.readyState >= 2) {
      now[index] += (want[index] - now[index]) * 0.2;
      if (Math.abs(want[index] - now[index]) < 0.01) now[index] = want[index];
      else moving = true;
      // never queue a seek behind one still in flight: that is what makes scrubbed video stutter
      if (!v.seeking && Math.abs(v.currentTime - now[index]) > 0.02) v.currentTime = now[index];
      if (v.seeking) moving = true;
    }
    if (moving && visible) kick();
  }
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

  function goTo(i) {
    i = clamp(i, 0, n - 1);
    const span = menu.offsetHeight - innerHeight;
    // land where the drink is already poured, so jumping by button still shows the result
    scrollTo({ top: menu.getBoundingClientRect().top + scrollY + ((i + POUR_TO + 0.05) / n) * span, behavior: 'smooth' });
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  qs('[data-menu-prev]', menu).addEventListener('click', () => goTo(index - 1));
  qs('[data-menu-next]', menu).addEventListener('click', () => goTo(index + 1));
  dots.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) goTo(+b.dataset.i); });
  update();

  whenVisible(menu, (v) => { visible = v; if (v) { arm(); update(); } }, '80% 0px');
}
