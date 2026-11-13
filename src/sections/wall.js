// The loud wall: a scrapbook of the place. Photos can be nudged around.
import { WALL } from '../content.js';
import { qs, qsa, photoTag } from '../lib/dom.js';

const ALT = {
  'place-interior': 'The room before opening: checkered red and cream floor, round yellow tables, coloured bentwood chairs and a hand-painted flower mural.',
  'm-pour': "A barista's hand pouring espresso into a glass of iced tonic; the coffee curls down through it.",
  'm-toast': 'Four hands toasting with four different coffee cocktails over a yellow table, confetti in the air.',
  'place-bar': 'The blue-tiled bar with a yellow espresso machine and a neon RIUH sign; a barista shaking a drink.',
  'm-friends': 'Four friends laughing at a yellow table in front of the flower mural.',
  'm-pastry': 'The pastry case: croissants, pains au chocolat and glazed doughnuts.',
  'place-corner': 'A corner with a curved pink banquette, a yellow table and a tall window.',
  'm-after': 'A yellow table after a group has left: empty glasses, crumbs, confetti and a napkin with a smiley drawn on it.',
  'place-night': 'The front of RIUH at night, warm light and full tables.',
  'place-exterior': 'The front of RIUH in the afternoon, with its red awning and yellow sign.',
};

export function initWall() {
  const board = qs('[data-wall]');
  board.innerHTML = WALL.map(
    (w, i) => `<figure class="snap polaroid" data-rise style="--r:${w.rot}deg;--tr:${-w.rot * 1.4}deg;--tape:var(--${w.tape});--d:${(i % 4) * 0.06}s">
      ${photoTag(w.src, ALT[w.src] || '', '(max-width: 600px) 46vw, (max-width: 1100px) 31vw, 320px')}
      <figcaption>${w.cap}</figcaption></figure>`,
  ).join('');

  // drag to rearrange: horizontal intent only on touch, so the page still scrolls
  qsa('.snap', board).forEach((el) => {
    let start = null, ox = 0, oy = 0;
    el.addEventListener('pointerdown', (e) => { start = { x: e.clientX, y: e.clientY, ox, oy, moved: false }; });
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
