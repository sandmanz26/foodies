// Promises, voucher and visit details. The voucher is made in the browser: there is no
// backend, so the code identifies a claim to the barista but is not validated by a server.
import { PROMISES, VOUCHER, STORE, BRAND } from '../content.js';
import { qs, qsa, photo } from '../lib/dom.js';
import { siRiuh, wordmark } from '../brand/shapes.js';
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from '../brand/wordmark.js';
import { getState, setState, onState } from '../lib/state.js';
import { confetti } from '../lib/fx.js';

const fmtDate = (ms) => new Date(ms).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function makeCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no look-alike characters
  const a = new Uint32Array(5);
  crypto.getRandomValues(a);
  return `RIUH-${[...a].map((n) => abc[n % abc.length]).join('')}`;
}

export function initPromises() {
  const TEXT_DARK = { jambu: 1 };
  qs('[data-janji]').innerHTML = PROMISES.map(
    (p, i) => `<li class="janji__card" data-rise style="--c:var(--${p.color});--r:${[-2, 1.5, -1, 2][i]}deg;--d:${i * 0.08}s;${TEXT_DARK[p.color] ? '--t:var(--ink);' : ''}">
      <div class="janji__face">${siRiuh({ mood: p.mood, fill: 'var(--kunyit)', arms: false })}</div>
      <h3>${p.title}</h3><p>${p.body}</p></li>`,
  ).join('');
}

export function initVoucher() {
  const ticket = qs('[data-ticket]');
  const form = qs('[data-voucher-form]');
  const error = qs('[data-voucher-error]');
  qs('[data-voucher-lead]').textContent = `${VOUCHER.offer} ${VOUCHER.condition}. Klaim di sini, simpan, lalu tunjukkan ke barista.`;
  qs('[data-visit]').innerHTML = `
    <dt>Alamat</dt><dd>${STORE.address.join(', ')} · <a href="${STORE.mapsUrl}" target="_blank" rel="noopener">Buka peta</a></dd>
    <dt>Jam buka</dt><dd>${STORE.hours}</dd>
    <dt>Instagram</dt><dd>${STORE.instagram}</dd>`;
  qs('[data-footer-small]').textContent = `© ${new Date().getFullYear()} ${BRAND.name} ${BRAND.descriptor}. 0% alkohol, 100% riuh.`;
  qsa('img[data-photo]').forEach((img) => {
    const p = photo(img.dataset.photo, '(max-width: 860px) 90vw, 440px');
    Object.assign(img, { src: p.src, srcset: p.srcset, sizes: p.sizes, width: p.width, height: p.height });
  });

  onState(({ voucher, racik }) => {
    ticket.classList.toggle('is-claimed', !!voucher);
    ticket.innerHTML = `
      <div class="ticket__card">
        <div class="ticket__main">
          <div class="ticket__mark">${wordmark()}</div>
          <p class="ticket__offer">${VOUCHER.offer}</p>
          <p class="ticket__cond">${VOUCHER.condition}</p>
          <p class="ticket__for">${voucher ? `untuk ${esc(voucher.name)}${racik ? `, peracik ${racik.name}` : ''}` : 'untuk kamu'}</p>
          <p class="ticket__fine">${voucher ? `Berlaku sampai ${fmtDate(voucher.until)} · satu kali pakai` : `Berlaku ${VOUCHER.validDays} hari sejak diklaim`}</p>
        </div>
        <div class="ticket__stub"><span class="ticket__code">${voucher ? voucher.code : 'RIUH-?????'}</span></div>
        ${voucher ? '' : '<div class="ticket__lock">Isi namamu dulu,<br/>nanti kodenya muncul.</div>'}
      </div>
      ${voucher ? '<div class="ticket__actions"><button class="btn" type="button" data-save>Simpan gambar</button></div>' : ''}`;
    form.hidden = !!voucher;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = new FormData(form).get('nama').toString().trim();
    if (name.length < 2) {
      error.hidden = false;
      error.textContent = 'Tulis nama panggilanmu dulu, minimal dua huruf.';
      form.elements.nama.focus();
      return;
    }
    error.hidden = true;
    setState({ voucher: { name, code: makeCode(), until: Date.now() + VOUCHER.validDays * 864e5 } });
    const r = ticket.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, 140);
  });

  ticket.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-save]')) return;
    const { voucher, racik } = getState();
    await document.fonts.ready;
    const W = 1200, H = 630;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#F04E23'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#FFC93C'; x.fillRect(W - 250, 0, 250, H);
    x.setLineDash([16, 14]); x.lineWidth = 5; x.strokeStyle = '#2A1610';
    x.beginPath(); x.moveTo(W - 250, 0); x.lineTo(W - 250, H); x.stroke(); x.setLineDash([]);
    // wordmark from the same paths as the on-page logo
    const [vx, vy, vw] = WORDMARK_VIEWBOX.split(' ').map(Number);
    const s = 300 / vw;
    x.save(); x.translate(70 - vx * s, 70 - vy * s); x.scale(s, s); x.fillStyle = '#FFC93C';
    WORDMARK_PATHS.forEach((p) => x.fill(new Path2D(p.d))); x.restore();
    x.fillStyle = '#FFF4E0'; x.textBaseline = 'top';
    x.font = '400 104px "Bagel Fat One"'; x.fillText(VOUCHER.offer, 70, 230);
    x.font = '600 38px "Bricolage Grotesque"'; x.fillText(VOUCHER.condition, 72, 350);
    x.fillStyle = '#FFC93C'; x.font = '400 50px "Gochi Hand"';
    x.fillText(`untuk ${voucher.name}${racik ? `, peracik ${racik.name}` : ''}`.slice(0, 44), 72, 430);
    x.fillStyle = '#FFF4E0'; x.font = '500 28px "Bricolage Grotesque"';
    x.fillText(`Berlaku sampai ${fmtDate(voucher.until)} · satu kali pakai`, 72, 506);
    x.fillText(STORE.address.join(', '), 72, 546);
    x.save(); x.translate(W - 125, H / 2); x.rotate(-Math.PI / 2);
    x.fillStyle = '#2A1610'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '400 72px "Bagel Fat One"';
    x.fillText(voucher.code, 0, 0); x.restore();
    const a = document.createElement('a');
    a.download = `voucher-${voucher.code}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
  });
}
