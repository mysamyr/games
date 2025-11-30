import { PATH } from './constants.js';
import { initModal } from './features/modal.js';
import { navTo, parseHash } from './utils/navigation.js';

import MainPage from './pages/main.js';
import GamePage from './pages/game.js';
import EditorPage from './pages/editor.js';

const app = document.getElementById('app');

function router() {
  const { path, params } = parseHash();
  app.innerHTML = '';
  switch (path) {
    case PATH.GAME:
      GamePage(params);
      break;
    case PATH.EDITOR:
      EditorPage(params);
      break;
    default:
      MainPage();
  }
}

initModal();

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// expose nav for debugging
window.escaperNav = navTo;
