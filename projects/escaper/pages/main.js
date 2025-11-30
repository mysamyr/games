import { navTo } from '../utils/navigation.js';
import { LEVEL_TYPE, PATH } from '../constants/index.js';
import { deleteCustomLevel, listAllLevels } from '../store/index.js';
import { Button, Div, Header, Span } from '../components/index.js';

const app = document.getElementById('app');

const onDeleteLevel = idx => {
  // todo better confirmation modal
  if (confirm('Delete this custom maze?')) {
    deleteCustomLevel(idx);
    location.reload();
  }
};

const makeLevelItem = (lvl, idx, type) => {
  const item = Div({
    className: 'level-item',
    children: [
      Span({ text: lvl.n || lvl.name || `Level ${idx}` }),
      Button({
        text: 'Play',
        onClick: () => navTo(`${PATH.GAME}?id=${type}-${idx}`),
      }),
    ],
  });

  if (type === LEVEL_TYPE.CUSTOM) {
    const edit = Button({
      text: 'Edit',
      onClick: () => navTo(`${PATH.EDITOR}?id=${type}-${idx}`),
    });
    const del = Button({
      className: 'delete',
      text: '✕',
      title: 'Delete',
      onClick: () => {
        onDeleteLevel(idx);
      },
    });
    item.append(edit, del);
  }
  return item;
};

const makeSection = (title, arr, type) => {
  const sect = Div({
    className: 'level-section',
    children: [
      Header({
        lvl: 3,
        text: title,
      }),
    ],
  });
  arr.forEach((lvl, idx) => {
    sect.appendChild(makeLevelItem(lvl, idx, type));
  });
  return sect;
};

export default function () {
  const { predefined, custom } = listAllLevels();

  const header = Header({
    text: 'Escaper',
    className: 'header',
  });

  const controls = Div({
    className: 'menu-controls',
    children: [
      Button({
        text: 'Create new maze',
        onClick: () => navTo(PATH.EDITOR),
      }),
    ],
  });

  const list = Div({
    className: 'levels-list',
    children: [
      makeSection('Pre-defined', predefined, LEVEL_TYPE.PREDEFINED),
      makeSection('Custom', custom, LEVEL_TYPE.CUSTOM),
    ],
  });

  app.append(header, controls, list);
}
