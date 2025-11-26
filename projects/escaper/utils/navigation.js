import { PATH } from '../constants.js';

export function parseHash() {
  const hash = location.hash.replace(/^#/, '') || PATH.HOME;
  const [path, q] = hash.split('?');
  const params = new URLSearchParams(q || '');
  return { path, params };
}

export function navTo(path = PATH.HOME) {
  location.hash = path;
}
