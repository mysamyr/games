import {
  CUSTOM_LEVEL_NAME,
  DEFAULT_LEVEL_SIZE,
  EDITOR_INFO_MESSAGE,
  LEVEL_SIZE,
} from '../constants/index.js';
import {
  Button,
  Div,
  Header,
  Input,
  Paragraph,
  Span,
} from '../components/index.js';
import { decodeLevel, encodeLevel, getLevelName } from '../features/maze.js';
import { isSolvable } from '../features/validator.js';
import Modal from '../features/modal.js';
import Snackbar from '../features/snackbar.js';
import { getBoard } from '../features/ui.js';
import { saveCustomLevel, updateCustomLevel } from '../store/index.js';
import { navTo } from '../utils/navigation.js';
import { getLevel } from '../utils/helpers.js';

const app = document.getElementById('app');

function openEditor(level, idx) {
  const decodedLevel = level
    ? decodeLevel(level.g)
    : {
        boardWidth: DEFAULT_LEVEL_SIZE.WIDTH,
        boardHeight: DEFAULT_LEVEL_SIZE.HEIGHT,
        boardConfig: Array.from({ length: DEFAULT_LEVEL_SIZE.HEIGHT }, () =>
          Array.from({ length: DEFAULT_LEVEL_SIZE.WIDTH }, () => [false, false])
        ),
      };

  let board = getBoard(decodedLevel);

  const nameInput = Input({
    placeholder: 'Level name',
    value: getLevelName(level),
    min: CUSTOM_LEVEL_NAME.MIN_LENGTH,
    max: CUSTOM_LEVEL_NAME.MAX_LENGTH,
  });
  const info = Div({
    className: 'info',
    style: { color: 'var(--green)' },
    text: EDITOR_INFO_MESSAGE.SOLVABLE,
  });
  const saveBtn = Button({
    text: 'Save',
    className: 'green',
    onClick: onLevelSave,
  });

  function addRightWall({ column, row, cell }) {
    if (row < decodedLevel.boardWidth - 1) {
      decodedLevel.boardConfig[column][row][0] =
        !decodedLevel.boardConfig[column][row][0];
      cell.classList.toggle('wall-right');
    }
  }

  function addDownWall({ column, row, cell }) {
    if (column < decodedLevel.boardHeight - 1) {
      decodedLevel.boardConfig[column][row][1] =
        !decodedLevel.boardConfig[column][row][1];
      cell.classList.toggle('wall-down');
    }
  }

  function checkSolvability() {
    if (isSolvable(decodedLevel)) {
      info.textContent = EDITOR_INFO_MESSAGE.SOLVABLE;
      info.style.color = 'var(--green)';
      saveBtn.disabled = false;
    } else {
      info.textContent = EDITOR_INFO_MESSAGE.UNSOLVABLE;
      info.style.color = 'var(--red)';
      saveBtn.disabled = true;
    }
  }

  function onBoardClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const clickFunc = e.shiftKey ? addDownWall : addRightWall;
    clickFunc({
      column: parseInt(cell.dataset.r, 10),
      row: parseInt(cell.dataset.c, 10),
      cell,
    });
    checkSolvability();
  }

  function checkLevelName(name) {
    if (!name) {
      return 'Please enter a level name';
    }
    if (name.length < CUSTOM_LEVEL_NAME.MIN_LENGTH) {
      return `Level name must be at least ${CUSTOM_LEVEL_NAME.MIN_LENGTH} characters long`;
    }
    if (name.length > CUSTOM_LEVEL_NAME.MAX_LENGTH) {
      return `Level name must be at most ${CUSTOM_LEVEL_NAME.MAX_LENGTH} characters long`;
    }
  }

  function saveLevel(lvl) {
    try {
      saveCustomLevel(nameInput.value, lvl);
      Snackbar.displayMsg(`Saved level ${nameInput.value}`);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  }

  function updateLevel(idx, lvl) {
    try {
      updateCustomLevel(idx, nameInput.value, lvl);
      Snackbar.displayMsg(`Updated level ${nameInput.value}`);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  }

  function onLevelSave() {
    const nameErrorMsg = checkLevelName(nameInput.value);
    if (nameErrorMsg) {
      Snackbar.displayMsg(nameErrorMsg);
      return;
    }
    if (!isSolvable(decodedLevel)) {
      Snackbar.displayMsg('Level is unsolvable');
      return;
    }
    const encodedLevel = encodeLevel(decodedLevel);
    if (level && !isNaN(idx)) {
      updateLevel(idx, encodedLevel);
    } else {
      saveLevel(encodedLevel);
    }
    navTo();
  }

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
    if (isNaN(val) || val < LEVEL_SIZE.MIN_WIDTH || val > LEVEL_SIZE.MAX_WIDTH)
      return;
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
    if (
      isNaN(val) ||
      val < LEVEL_SIZE.MIN_HEIGHT ||
      val > LEVEL_SIZE.MAX_HEIGHT
    )
      return;
    const oldH = decodedLevel.boardHeight;
    const newH = val;
    if (newH === oldH) return;
    if (newH > oldH) {
      // add columns
      for (let c = oldH; c < newH; c++) {
        decodedLevel.boardConfig.push(
          Array.from({ length: decodedLevel.boardWidth }, () => [false, false])
        );
      }
    } else {
      // shrink columns
      decodedLevel.boardConfig = decodedLevel.boardConfig.slice(0, newH);
    }
    decodedLevel.boardHeight = newH;
    renderBoard();
  }

  function onClickClearBoard() {
    decodedLevel.boardConfig = decodedLevel.boardConfig.map(col =>
      col.map(() => [false, false])
    );

    renderBoard();
  }

  const buttons = Div({
    className: 'row',
    children: [
      saveBtn,
      Button({
        text: 'Menu',
        onClick: () => navTo(),
      }),
      Button({
        text: 'Reset',
        onClick: () => location.reload(),
      }),
      Button({
        text: 'Clear',
        onClick: onClickClearBoard,
      }),
      Button({
        text: 'Show seed',
        className: 'orange',
        onClick: () =>
          Modal.show(Paragraph({ text: encodeLevel(decodedLevel).join('') })),
      }),
    ],
  });

  app.append(
    Div({
      className: 'row',
      children: [
        Span({
          text: 'Name:',
        }),
        nameInput,
        Span({
          text: 'Width:',
        }),
        Input({
          type: 'number',
          value: decodedLevel.boardWidth,
          min: LEVEL_SIZE.MIN_WIDTH,
          max: LEVEL_SIZE.MAX_WIDTH,
          onChange: onChangeWidth,
        }),
        Span({
          text: 'Height:',
        }),
        Input({
          type: 'number',
          value: decodedLevel.boardHeight,
          min: LEVEL_SIZE.MIN_HEIGHT,
          max: LEVEL_SIZE.MAX_HEIGHT,
          onChange: onChangeHeight,
        }),
        Button({
          text: '?',
          className: 'grey help-btn',
          onClick: () =>
            Modal.show(
              Div({
                className: 'modal-content',
                children: [
                  Header({ text: 'Editor Instructions', lvl: 2 }),
                  Paragraph({
                    text: 'Use the editor to create and save your own custom maze levels. You can add walls, set the board size, and save your creation for later play.',
                  }),
                  Header({ text: 'Controls', lvl: 2 }),
                  Paragraph({
                    text: '<b>LMB click</b> — add right (vertical) wall',
                  }),
                  Paragraph({
                    text: '<b>Shift + LMB</b> — add bottom (horizontal) wall',
                  }),
                  Paragraph({
                    text: 'Add a name (3-20 characters) and click <b>Save</b> to store the level',
                  }),
                  Paragraph({
                    text: '<b>Reset</b> button — reset board to initial state',
                  }),
                  Paragraph({
                    text: '<b>Clear</b> button — clear all walls on the board',
                  }),
                  Paragraph({
                    text: '<b>Show seed</b> button — show board text representation',
                  }),
                ],
              })
            ),
        }),
      ],
    }),
    info,
    board,
    buttons
  );

  board.addEventListener('click', onBoardClick);
}

// todo: edit show seed to enter seed in editor
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

  openEditor(level.level, level.idx);
}
