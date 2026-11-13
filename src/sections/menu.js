// Menu: five drinks, one per "page" of scroll. Each one is built on camera: the clip starts
// on an empty glass and ends on the finished drink, and plays whenever its drink comes up.
import { PRODUCTS } from '../content.js';
import { qs, clamp, stickyProgress, photo, BASE, reducedMotion } from '../lib/dom.js';
import { whenVisible } from '../lib/fx.js';

export function initMenu() {
  const menu = qs('#menu');
  const info = qs('[data-menu-info]', menu);
  const side = qs('[data-menu-side]', menu);
  const ghost = qs('[data-menu-ghost]', menu);
  const dots = qs('[data-menu-dots]', menu);
  const video = qs('[data-menu-video]', menu);
  let index = -1;
  let visible = false;

  dots.innerHTML = PRODUCTS.map(
    (p, i) => `<button class="menu__dot" type="button" role="tab" style="--c:${p.bg}" aria-label="${p.name}" data-i="${i}"></button>`,
  ).join('');

  function play() {
    if (!visible || index < 0) return;
    const src = `${BASE}media/drinks/${PRODUCTS[index].id}.mp4`;
    if (!video.src.endsWith(src.replace(/^\.\//, ''))) video.src = src;
    if (reducedMotion()) return; // the poster already shows the finished drink
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  function render(i) {
    if (i === index) return;
    index = i;
    const p = PRODUCTS[i];
    menu.style.setProperty('--bg', p.bg);
    menu.style.setProperty('--fg', p.fg);
    ghost.textContent = p.name.split(' ')[0];
    info.innerHTML = `
      <p class="menu__count">${String(i + 1).padStart(2, '0')} / ${String(PRODUCTS.length).padStart(2, '0')}</p>
      <h3 class="menu__name">${p.name}</h3>
      <p class="menu__line">${p.line}</p>
      <ul class="menu__chips">${p.ingredients.map((x) => `<li class="chip">${x}</li>`).join('')}</ul>`;
    const taste = Object.entries(p.taste)
      .map(([k, v]) => `<span>${k}</span><span class="taste__dots" role="img" aria-label="${v} out of 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= v ? 'on' : ''}"></i>`).join('')}</span>`)
      .join('');
    side.innerHTML = `
      <p class="menu__family">${p.family}</p>
      <p class="menu__gloss">${p.gloss}</p>
      <div class="taste">${taste}</div>`;
    video.poster = photo(`p-${p.id}`).src.replace('-420', '-840');
    video.setAttribute('aria-label', `${p.name} being built: ${p.ingredients.join(', ')}.`);
    video.removeAttribute('src');
    video.load();
    [...dots.children].forEach((d, k) => d.setAttribute('aria-selected', k === i ? 'true' : 'false'));
    play();
  }

  function goTo(i) {
    const n = PRODUCTS.length;
    i = clamp(i, 0, n - 1);
    const span = menu.offsetHeight - innerHeight;
    scrollTo({ top: menu.getBoundingClientRect().top + scrollY + ((i + 0.5) / n) * span, behavior: 'smooth' });
  }

  const update = () => render(clamp(Math.floor(stickyProgress(menu) * PRODUCTS.length), 0, PRODUCTS.length - 1));
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  qs('[data-menu-prev]', menu).addEventListener('click', () => goTo(index - 1));
  qs('[data-menu-next]', menu).addEventListener('click', () => goTo(index + 1));
  qs('[data-menu-replay]', menu).addEventListener('click', () => { video.currentTime = 0; video.play().catch(() => {}); });
  dots.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) goTo(+b.dataset.i); });
  update();

  whenVisible(menu, (v) => {
    const was = visible;
    visible = v;
    if (v && !was) play();
    if (!v) video.pause();
  }, '10% 0px');
}
