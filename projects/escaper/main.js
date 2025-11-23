import { LEVEL_TYPE, PATH } from './constants.js';
import { Button, Div, Header } from './components/index.js';
import { listAllLevels } from './store.js';
import { startGame } from './game.js';
import { openEditor } from './editor.js';
import { navTo, parseHash } from './navigation.js';

const app = document.getElementById('app');

function renderMain() {
  const header = Header({
    text: 'Escaper',
    className: 'header',
  });

  const controls = Div({
    className: 'menu-controls',
  });

  const newBtn = Button({
    text: 'Create new maze',
    onClick: () => navTo(PATH.EDITOR),
  });
  controls.appendChild(newBtn);

  app.appendChild(header);
  app.appendChild(controls);

  const { predefined, custom } = listAllLevels();

  const list = Div({
    className: 'levels-list',
  });

  const makeSection = (title, arr, type) => {
    const sect = Div({
      className: 'level-section',
    });
    const h = Header({
      lvl: 3,
      text: title,
    });
    sect.appendChild(h);
    arr.forEach((lvl, idx) => {
      const item = Div({
        className: 'level-item',
      });
      const name = document.createElement('span');
      name.textContent = lvl.n || lvl.name || `Level ${idx}`;
      item.appendChild(name);
      const play = Button({
        text: 'Play',
        onClick: () => navTo(`${PATH.GAME}?id=${type}-${idx}`),
      });
      item.appendChild(play);

      if (type === LEVEL_TYPE.CUSTOM) {
        const del = Button({
          className: 'delete',
          text: '✕',
          title: 'Delete',
          onClick: () => {
            if (confirm('Delete this custom maze?')) {
              import('./store.js').then(s => {
                s.deleteCustomLevel(idx);
                renderMain();
              });
            }
          },
        });
        item.appendChild(del);

        const edit = Button({
          text: 'Edit',
          onClick: () => navTo(`${PATH.EDITOR}?id=${type}-${idx}`),
        });
        item.appendChild(edit);
      }

      sect.appendChild(item);
    });
    return sect;
  };

  list.appendChild(
    makeSection('Pre-defined', predefined, LEVEL_TYPE.PREDEFINED)
  );
  list.appendChild(makeSection('Custom', custom, LEVEL_TYPE.CUSTOM));

  app.appendChild(list);
}

async function renderGame(params) {
  const id = params.get('id');
  if (!id) {
    navTo(PATH.HOME);
    return;
  }

  const [kind, idxStr] = id.split('-');
  const idx = parseInt(idxStr, 10);
  const { predefined, custom } = listAllLevels();
  const level = kind === LEVEL_TYPE.PREDEFINED ? predefined[idx] : custom[idx];
  if (!level) {
    app.appendChild(
      Div({
        text: 'Level not found',
      })
    );
    return;
  }
  startGame(app, level, () => navTo());
}

async function renderEditor(params) {
  const id = params.get('id');
  if (!id) {
    openEditor(app, null, () => navTo());
  } else {
    const [kind, idxStr] = id.split('-');
    const idx = parseInt(idxStr, 10);
    const { predefined, custom } = listAllLevels();
    const level =
      kind === LEVEL_TYPE.PREDEFINED
        ? structuredClone(predefined[idx])
        : structuredClone(custom[idx]);
    openEditor(app, level, () => navTo());
  }
}

function router() {
  const { path, params } = parseHash();
  app.innerHTML = '';
  switch (path) {
    case PATH.GAME:
      renderGame(params);
      break;
    case PATH.EDITOR:
      renderEditor(params);
      break;
    default:
      renderMain();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// expose nav for debugging
window.escaperNav = navTo;
