import { Div } from '../components';

export function getBoard(compact) {
  const { boardWidth, boardHeight, boardConfig } = compact;
  const board = Div({
    className: 'maze-board',
  });
  board.style.setProperty('--rows', boardHeight);
  board.style.setProperty('--cols', boardWidth);

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const cell = Div({
        className: 'cell',
      });
      cell.dataset.r = String(y);
      cell.dataset.c = String(x);
      if (x < boardWidth - 1 && boardConfig[y][x][0])
        cell.classList.add('wall-right');
      if (y < boardHeight - 1 && boardConfig[y][x][1])
        cell.classList.add('wall-down');
      if (x === boardWidth - 1 && y === boardHeight - 1)
        cell.classList.add('goal');
      board.appendChild(cell);
    }
  }

  return board;
}

export function markPlayer(board, y, x) {
  const prev = board.querySelector('.player');
  if (prev) prev.classList.remove('player');
  const cell = board.querySelector(`.cell[data-r='${y}'][data-c='${x}']`);
  if (cell) cell.classList.add('player');
}

export function clearBoard(container) {
  container.querySelectorAll('.maze-board').forEach(n => n.remove());
}
