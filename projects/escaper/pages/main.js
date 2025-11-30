import { navTo } from '../utils/navigation.js';
import { PATH, LEVEL_TYPE } from '../constants/index.js';
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

const makePredefinedSection = arr => {
  const container = Div();
  const sect = Div({
    className: 'default-level-section',
  });
  arr.forEach((lvl, idx) => {
    sect.appendChild(
      Div({
        children: [
          Button({
            text: `Level ${lvl.n}`,
            onClick: () =>
              navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx}`),
          }),
        ],
      })
    );
  });
  container.append(
    Header({
      lvl: 3,
      text: 'Default levels:',
    }),
    sect
  );
  return container;
};

const makeCustomSection = arr => {
  const container = Div();
  const sect = Div({
    className: 'custom-level-section',
  });
  arr.forEach((lvl, idx) => {
    sect.appendChild(
      Div({
        className: 'level-item',
        children: [
          Span({ text: lvl.n }),
          Button({
            text: 'Play',
            onClick: () => navTo(`${PATH.GAME}?id=${LEVEL_TYPE.CUSTOM}-${idx}`),
          }),
          Button({
            className: 'edit',
            text: 'Edit',
            onClick: () =>
              navTo(`${PATH.EDITOR}?id=${LEVEL_TYPE.CUSTOM}-${idx}`),
          }),
          Button({
            className: 'delete',
            text: '✕',
            title: 'Delete',
            onClick: () => {
              onDeleteLevel(idx);
            },
          }),
        ],
      })
    );
  });
  container.append(
    Header({
      lvl: 3,
      text: 'Custom levels:',
    }),
    sect
  );
  return container;
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
        text: 'Create custom maze',
        onClick: () => navTo(PATH.EDITOR),
      }),
    ],
  });

  const list = Div({
    className: 'levels-list',
    children: [makePredefinedSection(predefined), makeCustomSection(custom)],
  });

  app.append(header, list, controls);
}
