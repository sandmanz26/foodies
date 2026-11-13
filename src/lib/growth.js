// Growth plumbing: everything here turns a visit into something measurable or shareable,
// without a backend. See brand/STRATEGY.md ("Website sebagai mesin penjualan").
import { STORE } from '../content.js';
import { qs } from './dom.js';

/** Analytics hook. Events land in window.dataLayer, ready for GTM / GA4 once a container is added. */
export function track(event, data = {}) {
  (window.dataLayer = window.dataLayer || []).push({ event, ...data, source: source() });
}

const clean = (s) => (s || '').replace(/[^\p{L}\p{N} .'-]/gu, '').trim().slice(0, 18);

/** Where this visitor came from: remembered for the session so later actions can be attributed. */
function source() {
  try {
    const q = new URLSearchParams(location.search);
    const s = q.get('utm_source') || (q.get('from') ? 'friend' : '');
    if (s) sessionStorage.setItem('riuh:src', clean(s));
    return sessionStorage.getItem('riuh:src') || 'direct';
  } catch {
    return 'direct';
  }
}

/** A WhatsApp chat with the bar, pre-filled. This is the lead: the conversation lands in the bar's inbox. */
export function whatsappLink(text) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`${text} (via ${source()})`)}`;
}

/** A personal invite link. Opening it greets the friend by the inviter's name. */
export const inviteLink = (name) => `${location.origin}${location.pathname}?from=${encodeURIComponent(clean(name))}`;

export function initGrowth() {
  source();
  const from = clean(new URLSearchParams(location.search).get('from'));
  const box = qs('[data-invite]');
  if (from && box) {
    box.hidden = false;
    box.innerHTML = `<p></p><a class="btn" href="#voucher">Claim mine</a><button class="invite__x" type="button" aria-label="Dismiss">×</button>`;
    const b = document.createElement('b');
    b.textContent = from; // text node: a name from a URL is never treated as markup
    box.firstChild.append(b, ' saved you a seat at RIUH. First round is on us.');
    box.addEventListener('click', (e) => { if (e.target.closest('.invite__x, a')) box.hidden = true; });
    track('invite_opened');
  }
  // one listener reports every marked call to action
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track);
  });
}
