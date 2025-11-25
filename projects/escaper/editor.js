import { Button, Div, Input } from './components/index.js';
import { decodeLevel, encodeCompact } from './maze.js';
import { isSolvable } from './validator.js';
import { getBoard, clearBoard } from './ui.js';
import { saveCustomLevel } from './store.js';
import { navTo } from './navigation.js';

export function openEditor(container, level) {
  clearBoard(container);
  // todo remove hardcoded size
  const decodedLevel = level
    ? decodeLevel(level.g)
    : {
        boardWidth: 3,
        boardHeight: 3,
        boardConfig: Array.from({ length: 3 }, () =>
          Array.from({ length: 3 }, () => [false, false])
        ),
      };

  const board = getBoard(decodedLevel);

  const controls = Div({
    className: 'editor-controls',
  });

  const nameInput = Input({
    placeholder: 'Level name',
    value: level?.n || '',
  });
  const saveBtn = Button({
    text: 'Save',
    onClick: () => {
      if (!nameInput.value) {
        alert('Please enter a level name');
        return;
      }
      const solvable = isSolvable(decodedLevel);
      if (!solvable) {
        alert('Maze invalid (no path from start to exit)');
        return;
      }
      const encodedLevel = encodeCompact(decodedLevel);
      const lvl = { n: nameInput.value, g: encodedLevel };
      saveCustomLevel(lvl);
      alert('Saved');
      navTo();
    },
  });
  const back = Button({
    text: 'Menu',
    onClick: () => navTo(),
  });
  const info = Div({
    className: 'editor-info',
    text: 'Solvable',
  });

  controls.append(nameInput, saveBtn, back, info);

  container.append(controls, board);

  board.addEventListener('click', e => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const column = parseInt(cell.dataset.r, 10);
    const row = parseInt(cell.dataset.c, 10);
    if (e.shiftKey) {
      if (column < decodedLevel.boardWidth - 1)
        decodedLevel.boardConfig[column][row][1] =
          !decodedLevel.boardConfig[column][row][1];
      cell.classList.toggle('wall-down');
    } else {
      if (row < decodedLevel.boardHeight - 1)
        decodedLevel.boardConfig[column][row][0] =
          !decodedLevel.boardConfig[column][row][0];
      cell.classList.toggle('wall-right');
    }
    const solvable = isSolvable(decodedLevel);
    info.textContent = solvable ? 'Solvable' : 'Unsolvable';
  });
}
