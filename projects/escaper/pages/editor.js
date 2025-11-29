import { DEFAULT_LEVEL_SIZE, EDITOR_INFO_MESSAGE } from '../constants.js';
import { Button, Div, Input, Span } from '../components/index.js';
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
    if (column < decodedLevel.boardHeight - 1) {
      decodedLevel.boardConfig[column][row][1] =
        !decodedLevel.boardConfig[column][row][1];
      cell.classList.toggle('wall-down');
    }
  } else if (direction === 'right') {
    if (row < decodedLevel.boardWidth - 1) {
      decodedLevel.boardConfig[column][row][0] =
        !decodedLevel.boardConfig[column][row][0];
      cell.classList.toggle('wall-right');
    }
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
  const decodedLevel = level
    ? decodeLevel(level.g)
    : {
        boardWidth: DEFAULT_LEVEL_SIZE.WIDTH,
        boardHeight: DEFAULT_LEVEL_SIZE.HEIGHT,
        boardConfig: Array.from({ length: DEFAULT_LEVEL_SIZE.HEIGHT }, () =>
          Array.from({ length: DEFAULT_LEVEL_SIZE.WIDTH }, () => [false, false])
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
    const solvable = isSolvable(decodedLevel);
    if (solvable) {
      info.textContent = EDITOR_INFO_MESSAGE.SOLVABLE;
      info.classList.remove('red');
    } else {
      info.textContent = EDITOR_INFO_MESSAGE.UNSOLVABLE;
      info.classList.add('red');
    }
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

  let board = getBoard(decodedLevel);

  const nameInput = Input({
    placeholder: 'Level name',
    value: level?.n || '',
  });
  const info = Div({
    className: 'editor-info',
    text: EDITOR_INFO_MESSAGE.SOLVABLE,
  });

  function renderBoard() {
    const newBoard = getBoard(decodedLevel);
    board.replaceWith(newBoard);
    board = newBoard;
    board.addEventListener('click', onBoardClick);
    info.textContent = isSolvable(decodedLevel)
      ? EDITOR_INFO_MESSAGE.SOLVABLE
      : EDITOR_INFO_MESSAGE.UNSOLVABLE;
  }

  function onChangeWidth(e) {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) return;
    const oldW = decodedLevel.boardWidth;
    const newW = val;
    if (newW === oldW) return;
    if (newW > oldW) {
      // add new columns preserving existing rows
      for (let c = oldW; c < newW; c++) {
        decodedLevel.boardConfig = decodedLevel.boardConfig.map(column => [
          ...column,
          [false, false],
        ]);
      }
    } else {
      // shrink columns
      decodedLevel.boardConfig = decodedLevel.boardConfig.map(column =>
        column.slice(0, newW)
      );
    }
    decodedLevel.boardWidth = newW;
    renderBoard();
  }

  function onChangeHeight(e) {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) return;
    const w = decodedLevel.boardWidth;
    const oldH = decodedLevel.boardHeight;
    const newH = val;
    if (newH === oldH) return;
    if (newH > oldH) {
      // add columns
      for (let c = oldH; c < newH; c++) {
        decodedLevel.boardConfig.push(
          Array.from({ length: w }, () => [false, false])
        );
      }
    } else {
      // shrink columns
      decodedLevel.boardConfig = decodedLevel.boardConfig.slice(0, newH);
    }
    decodedLevel.boardHeight = newH;
    renderBoard();
  }

  const inputs = Div({
    className: 'controls-row',
    children: [
      nameInput,
      Span({
        text: 'Width:',
      }),
      Input({
        type: 'number',
        value: decodedLevel.boardWidth,
        min: 1,
        onChange: onChangeWidth,
      }),
      Span({
        text: 'Height:',
      }),
      Input({
        type: 'number',
        value: decodedLevel.boardHeight,
        min: 1,
        onChange: onChangeHeight,
      }),
    ],
  });
  const buttons = Div({
    className: 'controls-row',
    children: [
      Button({
        text: 'Save',
        onClick: onLevelSave,
      }),
      Button({
        text: 'Menu',
        onClick: () => navTo(),
      }),
    ],
  });

  const controls = Div({
    className: 'editor-controls',
    children: [inputs, buttons, info],
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
