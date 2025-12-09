import { navTo } from '../utils/navigation.js';
import { LEVEL_TYPE, PATH } from '../constants/index.js';
import {
  clearProgress,
  deleteCustomLevel,
  listAllLevels,
} from '../store/index.js';
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
    className: 'column',
    children: [
      Header({
        lvl: 3,
        text: 'Default levels:',
      }),
      Div({
        className: 'levels-section grid',
        children: lvls.map((lvl, idx) =>
          Button({
            text: `Level ${getLevelName(lvl)}`,
            disabled: idx && !lvls[idx - 1].c, // lock if previous not completed (except first)
            onClick: () =>
              navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx}`),
          })
        ),
      }),
    ],
  });

const makeCustomSection = lvls => {
  const levelsSection = lvls.length
    ? lvls.map((lvl, idx) =>
        Div({
          className: 'level-item',
          children: [
            Span({
              className: 'bold',
              text: getLevelName(lvl),
            }),
            Span({
              text: getLevelSize(lvl).join(' x '),
            }),
            Button({
              text: 'Play',
              onClick: () =>
                navTo(`${PATH.GAME}?id=${LEVEL_TYPE.CUSTOM}-${idx}`),
            }),
            Button({
              className: 'orange',
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
      )
    : [Span({ text: 'No custom levels created yet.' })];
  return Div({
    className: 'column',
    children: [
      Header({
        lvl: 3,
        text: 'Custom levels:',
      }),
      Div({
        className: 'levels-section',
        children: levelsSection,
      }),
    ],
  });
};

export default function () {
  const { predefined, custom } = listAllLevels();

  app.append(
    Header({
      lvl: 1,
      text: 'Escaper',
    }),
    Div({
      className: 'levels-list',
      children: [makePredefinedSection(predefined), makeCustomSection(custom)],
    }),
    Div({
      className: 'row',
      children: [
        Button({
          text: 'Create custom maze',
          onClick: () => navTo(PATH.EDITOR),
        }),
        Button({
          className: 'red',
          text: 'Clear current progress',
          onClick: () => {
            // todo: do use modal
            clearProgress();
            location.reload();
          },
        }),
      ],
    })
  );
}
