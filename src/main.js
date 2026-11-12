import './styles/main.css';
import { qs, qsa } from './lib/dom.js';
import { wordmark, siRiuh } from './brand/shapes.js';
import { initRise } from './lib/fx.js';
import { initHero } from './sections/hero.js';
import { initMenu } from './sections/menu.js';
import { initRacik } from './sections/racik.js';
import { initWall } from './sections/wall.js';
import { initPromises, initVoucher } from './sections/voucher.js';

qsa('[data-wordmark]').forEach((el) => { el.innerHTML = wordmark(); });
qsa('[data-mascot]').forEach((el) => { el.innerHTML = siRiuh({ mood: el.dataset.mascot }); });

// story: words light up as the paragraph travels up the screen
const story = qs('[data-reveal-words]');
story.innerHTML = story.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
const words = qsa('.w', story);
function lightWords() {
  const r = story.getBoundingClientRect();
  const p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35);
  const n = Math.round(Math.min(1, Math.max(0, p)) * words.length);
  words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
}
addEventListener('scroll', lightWords, { passive: true });
lightWords();

// marquee: duplicate the strip once so the CSS loop is seamless
const track = qs('[data-marquee]');
track.innerHTML += track.innerHTML;

qsa('.story__title, .racik__title, .racik__bench, .wall__title, .janji__title, .voucher__title, .ticket, .voucher__photo').forEach((el) => el.setAttribute('data-rise', ''));

initHero();
initMenu();
initRacik();
initWall();
initPromises();
initVoucher();
initRise();
