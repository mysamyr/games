import { Div } from './components/index.js';

export function getBoard(compact) {
  const { n, m } = compact;
  const board = Div({
    className: 'maze-board',
  });
  board.style.setProperty('--rows', n);
  board.style.setProperty('--cols', m);

  // create n*m cells
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      const cell = Div({
        className: 'cell',
      });
      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      if (c < m - 1 && compact.right[r][c]) cell.classList.add('wall-right');
      if (r < n - 1 && compact.down[r][c]) cell.classList.add('wall-down');
      board.appendChild(cell);
    }
  }

  return board;
}

export function markPlayer(board, r, c) {
  const prev = board.querySelector('.player');
  if (prev) prev.classList.remove('player');
  const cell = board.querySelector(`.cell[data-r='${r}'][data-c='${c}']`);
  if (cell) cell.classList.add('player');
}

export function clearBoard(container) {
  container.querySelectorAll('.maze-board').forEach(n => n.remove());
}
