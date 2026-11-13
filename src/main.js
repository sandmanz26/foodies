import './styles/main.css';
import { qs, qsa, stickyProgress } from './lib/dom.js';
import { wordmark, siRiuh } from './brand/shapes.js';
import { initRise } from './lib/fx.js';
import { initHero } from './sections/hero.js';
import { initMenu } from './sections/menu.js';
import { initStir } from './sections/stir.js';
import { initWall } from './sections/wall.js';
import { initRules, initVoucher } from './sections/voucher.js';
import { initGrowth } from './lib/growth.js';

qsa('[data-wordmark]').forEach((el) => { el.innerHTML = wordmark(); });
qsa('[data-mascot]').forEach((el) => { el.innerHTML = siRiuh({ mood: el.dataset.mascot }); });

// story: one pinned scene, driven by scroll. Two bad options arrive, get stamped out,
// and the room floods with colour as the third option takes over.
const story = qs('#story');
const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
function playStory() {
  const p = stickyProgress(story);
  const st = story.style;
  st.setProperty('--in', seg(p, 0.04, 0.24).toFixed(3));
  st.setProperty('--stamp-a', seg(p, 0.28, 0.34).toFixed(3));
  st.setProperty('--stamp-b', seg(p, 0.36, 0.42).toFixed(3));
  st.setProperty('--out', seg(p, 0.46, 0.62).toFixed(3));
  st.setProperty('--flood', seg(p, 0.5, 0.72).toFixed(3));
  st.setProperty('--say', seg(p, 0.66, 0.86).toFixed(3));
}
addEventListener('scroll', playStory, { passive: true });
addEventListener('resize', playStory);
playStory();

// marquee: duplicate the strip once so the CSS loop is seamless
const track = qs('[data-marquee]');
track.innerHTML += track.innerHTML;

qsa('.stir__title, .stir__bench, .wall__title, .rules__title, .voucher__title, .ticket, .voucher__photo').forEach((el) => el.setAttribute('data-rise', ''));

initHero();
initMenu();
initStir();
initWall();
initRules();
initVoucher();
initRise();
initGrowth();
