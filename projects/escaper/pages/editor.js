import { EDITOR_INFO_MESSAGE } from '../constants.js';
import { Button, Div, Input } from '../components/index.js';
import { decodeLevel, encodeCompact } from '../features/maze.js';
import { isSolvable } from '../features/validator.js';
import { clearBoard, getBoard } from '../features/ui.js';
import { saveCustomLevel, updateCustomLevel } from '../store.js';
import { navTo } from '../utils/navigation.js';
import { getLevel } from '../utils/helpers.js';
import Snackbar from '../features/snackbar.js';

const app = document.getElementById('app');

function addWall({ decodedLevel, column, row, direction, cell }) {
  if (direction === 'down') {
    if (column < decodedLevel.boardWidth - 1)
      decodedLevel.boardConfig[column][row][1] =
        !decodedLevel.boardConfig[column][row][1];
    cell.classList.toggle('wall-down');
  } else if (direction === 'right') {
    if (row < decodedLevel.boardHeight - 1)
      decodedLevel.boardConfig[column][row][0] =
        !decodedLevel.boardConfig[column][row][0];
    cell.classList.toggle('wall-right');
  }
}

function addRightWall({ decodedLevel, column, row, cell }) {
  addWall({
    decodedLevel,
    column,
    row,
    direction: 'right',
    cell,
  });
}

function addDownWall({ decodedLevel, column, row, cell }) {
  addWall({
    decodedLevel,
    column,
    row,
    direction: 'down',
    cell,
  });
}

function openEditor(level, idx) {
  clearBoard(app);
  // todo remove hardcoded size - via modal???
  const decodedLevel = level
    ? decodeLevel(level.g)
    : {
        boardWidth: 3,
        boardHeight: 3,
        boardConfig: Array.from({ length: 3 }, () =>
          Array.from({ length: 3 }, () => [false, false])
        ),
      };

  function onBoardClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const column = parseInt(cell.dataset.r, 10);
    const row = parseInt(cell.dataset.c, 10);
    if (e.shiftKey) {
      addDownWall({
        decodedLevel,
        column,
        row,
        cell,
      });
    } else {
      addRightWall({
        decodedLevel,
        column,
        row,
        cell,
      });
    }
    info.textContent = isSolvable(decodedLevel)
      ? EDITOR_INFO_MESSAGE.SOLVABLE
      : EDITOR_INFO_MESSAGE.UNSOLVABLE;
  }

  function onLevelSave() {
    if (!nameInput.value) {
      Snackbar.displayMsg('Please enter a level name');
      return;
    }
    const solvable = isSolvable(decodedLevel);
    if (!solvable) {
      Snackbar.displayMsg('Level is unsolvable');
      return;
    }
    const encodedLevel = encodeCompact(decodedLevel);
    const lvl = { n: nameInput.value, g: encodedLevel };
    if (level && !isNaN(idx)) {
      updateCustomLevel(idx, lvl);
      Snackbar.displayMsg(`Updated level ${nameInput.value}`);
    } else {
      saveCustomLevel(lvl);
      Snackbar.displayMsg(`Saved level ${nameInput.value}`);
    }
    navTo();
  }

  const board = getBoard(decodedLevel);

  const nameInput = Input({
    placeholder: 'Level name',
    value: level?.n || '',
  });
  const info = Div({
    className: 'editor-info',
    text: EDITOR_INFO_MESSAGE.SOLVABLE,
  });

  const controls = Div({
    className: 'editor-controls',
    children: [
      nameInput,
      Button({
        text: 'Save',
        onClick: onLevelSave,
      }),
      Button({
        text: 'Menu',
        onClick: () => navTo(),
      }),
      info,
    ],
  });

  app.append(controls, board);

  board.addEventListener('click', onBoardClick);
}

export default function (params) {
  const id = params.get('id');
  if (!id) {
    openEditor();
    return;
  }

  const level = getLevel(id);
  if (!level) {
    openEditor();
    return;
  }

  openEditor(level, id.split('-')[1]);
}
