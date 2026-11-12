// Menu: five drinks, one per "page" of scroll. The glass in the middle is real-time 3D,
// loaded only when the section is about to appear; the photo is the fallback and the proof.
import { PRODUCTS } from '../content.js';
import { qs, clamp, stickyProgress, photoTag } from '../lib/dom.js';
import { whenVisible } from '../lib/fx.js';

export function initMenu() {
  const menu = qs('#menu');
  const info = qs('[data-menu-info]', menu);
  const photo = qs('[data-menu-photo]', menu);
  const ghost = qs('[data-menu-ghost]', menu);
  const dots = qs('[data-menu-dots]', menu);
  const canvas = qs('[data-menu-canvas]', menu);
  let index = -1;
  let gl = null;

  dots.innerHTML = PRODUCTS.map(
    (p, i) => `<button class="menu__dot" type="button" role="tab" style="--c:${p.bg}" aria-label="${p.name}" data-i="${i}"></button>`,
  ).join('');

  function render(i) {
    if (i === index) return;
    index = i;
    const p = PRODUCTS[i];
    menu.style.setProperty('--bg', p.bg);
    menu.style.setProperty('--fg', p.fg);
    menu.style.setProperty('--accent', p.accent);
    ghost.textContent = p.name.split(' ')[0];
    const taste = Object.entries(p.taste)
      .map(([k, v]) => `<span>${k}</span><span class="taste__dots" role="img" aria-label="${v} dari 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= v ? 'on' : ''}"></i>`).join('')}</span>`)
      .join('');
    info.innerHTML = `
      <p class="menu__count">${String(i + 1).padStart(2, '0')} / ${String(PRODUCTS.length).padStart(2, '0')}</p>
      <h3 class="menu__name">${p.name}</h3>
      <p class="menu__line">${p.line}</p>
      <ul class="menu__chips"><li class="chip chip--method">${p.method}</li>${p.ingredients.map((x) => `<li class="chip">${x}</li>`).join('')}</ul>
      <div class="taste">${taste}</div>`;
    photo.innerHTML = `${photoTag(`p-${p.id}`, `${p.name}: ${p.line}`, '(max-width: 900px) 92px, 250px')}<figcaption>Aslinya begini</figcaption>`;
    [...dots.children].forEach((d, k) => d.setAttribute('aria-selected', k === i ? 'true' : 'false'));
    gl?.show(i);
  }

  function goTo(i) {
    const n = PRODUCTS.length;
    i = clamp(i, 0, n - 1);
    const span = menu.offsetHeight - innerHeight;
    const top = menu.getBoundingClientRect().top + scrollY + ((i + 0.5) / n) * span;
    scrollTo({ top, behavior: 'smooth' });
  }

  const update = () => render(clamp(Math.floor(stickyProgress(menu) * PRODUCTS.length), 0, PRODUCTS.length - 1));
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  qs('[data-menu-prev]', menu).addEventListener('click', () => goTo(index - 1));
  qs('[data-menu-next]', menu).addEventListener('click', () => goTo(index + 1));
  dots.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) goTo(+b.dataset.i); });
  update();

  // 3D arrives late and on demand
  let asked = false;
  whenVisible(menu, (visible) => {
    if (visible && !asked) {
      asked = true;
      import('./glass3d.js')
        .then((m) => m.createGlassStage(canvas, PRODUCTS))
        .then((stage) => {
          gl = stage;
          menu.classList.add('has-3d');
          gl.show(index);
          gl.setActive(true);
        })
        .catch(() => menu.classList.add('no-3d'));
    }
    gl?.setActive(visible);
  }, '60% 0px');
}
