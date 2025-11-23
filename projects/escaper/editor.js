import { Button, Div, Input } from './components/index.js';
import { decodeLevel, encodeCompact } from './maze.js';
import { isSolvable } from './validator.js';
import { getBoard, clearBoard } from './ui.js';
import { saveCustomLevel } from './store.js';
import { navTo } from './navigation.js';

export function openEditor(container, level, onSaved) {
  clearBoard(container);
  const comp = level?.g
    ? decodeLevel(level.g)
    : {
        n: 5,
        m: 5,
        right: Array.from({ length: 5 }, () => Array(5).fill(false)),
        down: Array.from({ length: 5 }, () => Array(5).fill(false)),
      };

  const board = getBoard(comp);
  container.appendChild(board);

  const controls = Div({
    className: 'editor-controls',
  });

  const nameIn = Input({
    placeholder: 'Level name',
    value: level?.n || '',
  });
  controls.appendChild(nameIn);

  const saveBtn = Button({
    text: 'Save',
    onClick: () => {
      const sol = isSolvable(comp);
      if (!sol) {
        alert('Maze invalid (no path from start to exit)');
        return;
      }
      const compactArr = encodeCompact(comp.n, comp.m, comp.right, comp.down);
      const lvl = { n: nameIn.value || 'Custom', g: compactArr };
      saveCustomLevel(lvl);
      alert('Saved');
      onSaved && onSaved();
    },
  });
  controls.appendChild(saveBtn);

  const back = Button({
    text: 'Menu',
    onClick: () => navTo(),
  });
  controls.appendChild(back);

  const info = Div({
    className: 'editor-info',
  });
  controls.appendChild(info);

  container.appendChild(controls);

  // todo
  // board.addEventListener('click', e => {
  //   const cell = e.target.closest('.cell');
  //   if (!cell) return;
  //   const r = parseInt(cell.dataset.r, 10);
  //   const c = parseInt(cell.dataset.c, 10);
  //   if (e.shiftKey) {
  //     if (r < comp.n - 1) comp.down[r][c] = !comp.down[r][c];
  //   } else {
  //     if (c < comp.m - 1) comp.right[r][c] = !comp.right[r][c];
  //   }
  //   clearBoard(container);
  //   getBoard(comp);
  //   container.appendChild(board);
  //   const solv = isSolvable(comp);
  //   info.textContent = solv ? 'Solvable' : 'Unsolvable';
  // });
}
