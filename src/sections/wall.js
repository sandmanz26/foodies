// Dinding Riuh: a scrapbook of the place. Photos can be nudged around; the visitor's own
// drink from the Racik section gets taped up among them.
import { WALL } from '../content.js';
import { qs, qsa, photoTag } from '../lib/dom.js';
import { onState } from '../lib/state.js';

const ALT = {
  'place-interior': 'Interior RIUH di pagi hari: lantai kotak merah-krem, meja bundar kuning, kursi warna-warni, dan mural bunga di dinding.',
  'm-pour': 'Tangan barista menuang espresso ke gelas tonic berisi es; kopi turun berpilin.',
  'm-toast': 'Empat tangan bersulang dengan empat coffee cocktail berbeda di atas meja kuning, confetti beterbangan.',
  'place-bar': 'Bar berlapis ubin biru dengan mesin espresso kuning dan lampu neon RIUH; barista sedang mengocok shaker.',
  'm-friends': 'Empat sahabat tertawa di meja kuning di depan mural bunga.',
  'm-pastry': 'Etalase pastry: croissant, pain au chocolat, dan donat berglasir warna-warni.',
  'place-corner': 'Pojok dengan sofa pink melengkung, meja kuning, dan jendela besar.',
  'm-after': 'Meja kuning setelah ditinggal: gelas kosong, remah croissant, confetti, dan serbet bergambar senyum.',
  'place-night': 'Tampak depan RIUH di malam hari, lampu hangat dan meja-meja terisi.',
  'place-exterior': 'Tampak depan RIUH di sore hari dengan awning merah dan papan nama kuning.',
};

function swatch(colors) {
  return `<svg class="snap__swatch" viewBox="0 0 62 78" aria-hidden="true"><defs><linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset=".25" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient><clipPath id="swc"><path d="M8 6 13 66Q14 72 20 72H42Q48 72 49 66L54 6Z"/></clipPath></defs><rect x="0" y="18" width="62" height="60" fill="url(#sw)" clip-path="url(#swc)"/><path d="M8 6 13 66Q14 72 20 72H42Q48 72 49 66L54 6" fill="none" stroke="#2A1610" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function initWall() {
  const board = qs('[data-wall]');
  const cards = WALL.map(
    (w, i) => `<figure class="snap polaroid" data-rise style="--r:${w.rot}deg;--tr:${-w.rot * 1.4}deg;--tape:var(--${w.tape});--d:${(i % 4) * 0.06}s">
      ${photoTag(w.src, ALT[w.src] || '', '(max-width: 600px) 46vw, (max-width: 1100px) 31vw, 320px')}
      <figcaption>${w.cap}</figcaption></figure>`,
  );
  cards.splice(2, 0, `<div class="snap snap--yours polaroid" data-rise data-yours style="--r:2.5deg;--tr:4deg;--tape:var(--tomat)"></div>`);
  board.innerHTML = cards.join('');

  const yours = qs('[data-yours]', board);
  onState(({ racik }) => {
    yours.innerHTML = racik
      ? `${swatch(racik.colors)}<p class="snap__label">Racikanmu</p><p class="snap__name">${racik.name}</p><p class="snap__meta">${racik.recipe}</p>`
      : `<p class="snap__label">Tempat ini kosong</p><p class="snap__name">Buat racikanmu</p><p class="snap__meta">Racik dulu, nanti kami tempel di sini.</p><a class="btn" href="#racik">Racik sekarang</a>`;
  });

  // drag to rearrange: horizontal intent only on touch, so the page still scrolls
  qsa('.snap', board).forEach((el) => {
    let start = null, ox = 0, oy = 0;
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a,button')) return;
      start = { x: e.clientX, y: e.clientY, ox, oy, moved: false };
    });
    el.addEventListener('pointermove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!start.moved) {
        if (Math.hypot(dx, dy) < 8) return;
        if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) { start = null; return; }
        start.moved = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-held');
      }
      ox = start.ox + dx; oy = start.oy + dy;
      el.style.transform = `translate(${ox}px, ${oy}px) rotate(${dx * 0.02}deg) scale(1.04)`;
    });
    const drop = () => {
      if (!start) return;
      if (start.moved) {
        el.classList.remove('is-held');
        el.style.transform = `translate(${ox}px, ${oy}px) rotate(var(--r))`;
      }
      start = null;
    };
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
  });
}
