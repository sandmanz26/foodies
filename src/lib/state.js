// Tiny persistent store. There is no backend: everything the visitor makes stays in their browser.
const KEY = 'riuh:v2';
const listeners = new Set();
let state = { stirred: false, voucher: null };
try {
  state = { ...state, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
} catch {
  /* private mode or blocked storage: the site still works, it just forgets */
}

export const getState = () => state;
export function setState(patch) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(state));
}
export function onState(fn) {
  listeners.add(fn);
  fn(state);
}
