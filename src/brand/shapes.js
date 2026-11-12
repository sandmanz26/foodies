// Brand shapes, generated in code so they stay crisp at any size and cost zero requests.
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark.js';

/** A spiky "shout" burst. It is the brand mark: riuh means rowdy, and this is the noise. */
export function burstPath(points = 12, outer = 50, inner = 36, cx = 50, cy = 50, rot = 0) {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points + rot - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  return d + 'Z';
}

export function wordmark(cls = '') {
  const paths = WORDMARK_PATHS.map((p) => `<path class="wm-l" d="${p.d}"/>`).join('');
  return `<svg class="wordmark ${cls}" viewBox="${WORDMARK_VIEWBOX}" fill="currentColor" role="img" aria-label="RIUH">${paths}</svg>`;
}

/**
 * Si Riuh, the mascot: the burst with a face.
 * mood: 'happy' | 'wow' | 'wink' | 'sleepy'
 */
export function siRiuh({ mood = 'happy', fill = 'var(--tomat)', cls = '', arms = true } = {}) {
  const ink = 'var(--ink)';
  const eyes = {
    happy: `<path d="M35 47q4-7 8 0M57 47q4-7 8 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
    wow: `<ellipse cx="39" cy="45" rx="3.4" ry="4.6" fill="${ink}"/><ellipse cx="61" cy="45" rx="3.4" ry="4.6" fill="${ink}"/>`,
    wink: `<ellipse cx="39" cy="45" rx="3.4" ry="4.6" fill="${ink}"/><path d="M57 46q4-5 8 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
    sleepy: `<path d="M35 45q4 4 8 0M57 45q4 4 8 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  }[mood];
  const mouth = {
    happy: `<path d="M41 55q9 12 18 0z" fill="${ink}"/><path d="M45.5 60.5q4.5-3 9 0-4.500 3.600-9 0z" fill="var(--jambu)"/>`,
    wow: `<ellipse cx="50" cy="59" rx="4.600" ry="5.800" fill="${ink}"/>`,
    wink: `<path d="M42 56q8 8 16 0" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
    sleepy: `<path d="M45 58h10" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  }[mood];
  const limbs = arms
    ? `<g class="sr-arms" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round">
        <path class="sr-arm-l" d="M17 58q-12 -4 -11 -18"/><path class="sr-arm-r" d="M83 58q12 -4 11 -18"/>
        <path d="M40 86v10M60 86v10"/></g>`
    : '';
  return `<svg class="si-riuh ${cls}" viewBox="-2 -2 104 104" aria-hidden="true">
    ${limbs}
    <path class="sr-body" d="${burstPath(12, 46, 35)}" fill="${fill}" stroke="${fill}" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="31" cy="55" r="5" fill="var(--jambu)" opacity=".9"/><circle cx="69" cy="55" r="5" fill="var(--jambu)" opacity=".9"/>
    ${eyes}${mouth}
  </svg>`;
}
