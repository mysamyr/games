import { navTo } from '../utils/navigation.js';
import { LEVEL_TYPE, PATH } from '../constants/index.js';
import { deleteCustomLevel, listAllLevels } from '../store/index.js';
import { Button, Div, Header, Span } from '../components/index.js';
import { getLevelName, getLevelSize } from '../features/maze.js';
import Modal from '../features/modal.js';

const app = document.getElementById('app');

const onDeleteLevel = idx => {
  const onConfirm = () => {
    deleteCustomLevel(idx);
    location.reload();
  };
  Modal.show(
    Div({
      className: 'modal-content',
      children: [
        Header({ lvl: 3, text: 'Delete this custom maze?' }),
        Div({
          className: 'modal-buttons',
          children: [
            Button({
              text: 'Cancel',
              onClick: () => Modal.hide(),
            }),
            Button({
              className: 'red',
              text: 'Delete',
              onClick: onConfirm,
            }),
          ],
        }),
      ],
    })
  );
};

const makePredefinedSection = lvls =>
  Div({
    children: [
      Header({
        lvl: 3,
        text: 'Default levels:',
      }),
      Div({
        className: 'default-level-section',
        children: lvls.map((lvl, idx) =>
          Div({
            className: 'level-item',
            children: [
              Button({
                text: `Level ${getLevelName(lvl)}`,
                onClick: () =>
                  navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx}`),
              }),
            ],
          })
        ),
      }),
    ],
  });

const makeCustomSection = lvls =>
  Div({
    children: [
      Header({
        lvl: 3,
        text: 'Custom levels:',
      }),
      Div({
        className: 'custom-level-section',
        children: lvls.map((lvl, idx) =>
          Div({
            className: 'level-item',
            children: [
              Span({
                text: `${getLevelName(lvl)} ${getLevelSize(lvl).join(' x ')}`,
              }),
              Button({
                text: 'Play',
                onClick: () =>
                  navTo(`${PATH.GAME}?id=${LEVEL_TYPE.CUSTOM}-${idx}`),
              }),
              Button({
                className: 'edit',
                text: 'Edit',
                onClick: () =>
                  navTo(`${PATH.EDITOR}?id=${LEVEL_TYPE.CUSTOM}-${idx}`),
              }),
              Button({
                className: 'red',
                text: '✕',
                title: 'Delete',
                onClick: () => onDeleteLevel(idx),
              }),
            ],
          })
        ),
      }),
    ],
  });

export default function () {
  const { predefined, custom } = listAllLevels();

  const header = Header({
    text: 'Escaper',
    className: 'header',
  });

  const buttons = Div({
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

  app.append(header, list, buttons);
}
