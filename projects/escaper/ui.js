import { Div } from './components/index.js';

export function getBoard(compact) {
  const { rowsCount, columnsCount, boardConfig } = compact;
  const board = Div({
    className: 'maze-board',
  });
  board.style.setProperty('--rows', columnsCount);
  board.style.setProperty('--cols', rowsCount);

  for (let column = 0; column < columnsCount; column++) {
    for (let row = 0; row < rowsCount; row++) {
      const cell = Div({
        className: 'cell',
      });
      cell.dataset.r = String(column);
      cell.dataset.c = String(row);
      if (row < rowsCount - 1 && boardConfig[column][row][0])
        cell.classList.add('wall-right');
      if (column < columnsCount - 1 && boardConfig[column][row][1])
        cell.classList.add('wall-down');
      board.appendChild(cell);
    }
  }

  return board;
}

export function markPlayer(board, row, column) {
  const prev = board.querySelector('.player');
  if (prev) prev.classList.remove('player');
  const cell = board.querySelector(
    `.cell[data-r='${row}'][data-c='${column}']`
  );
  if (cell) cell.classList.add('player');
}

export function clearBoard(container) {
  container.querySelectorAll('.maze-board').forEach(n => n.remove());
}
