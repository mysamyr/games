import { PATH } from './constants/index.js';
import { parseHash } from './utils/navigation.js';
import Modal from './features/modal.js';

import MainPage from './pages/main.js';
import GamePage from './pages/game.js';
import EditorPage from './pages/editor.js';

const app = document.getElementById('app');

function clearPage() {
  app.innerHTML = '';
  Modal.hide();
}

function router() {
  clearPage();
  const { path, params } = parseHash();
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

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
