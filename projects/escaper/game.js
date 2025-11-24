import { Button, Div } from './components/index.js';
import { decodeLevel } from './maze.js';
import { getBoard, markPlayer, clearBoard } from './ui.js';
import { navTo } from './navigation.js';

const isFinished = (player, { rowsCount, columnsCount }) =>
  player.row === columnsCount - 1 && player.column === rowsCount - 1;

function canMove(player, decodedLevel, toR, toC) {
  if (
    toR < 0 ||
    toR >= decodedLevel.columnsCount ||
    toC < 0 ||
    toC >= decodedLevel.rowsCount
  )
    return false;
  const r = player.row;
  const c = player.column;
  const boardConfig = decodedLevel.boardConfig;
  // moving right
  if (toR === r && toC === c + 1) return !boardConfig[r][c][0];
  // moving left
  if (toR === r && toC === c - 1) return !boardConfig[r][toC][0];
  // moving down
  if (toR === r + 1 && toC === c) return !boardConfig[r][c][1];
  // moving up
  if (toR === r - 1 && toC === c) return !boardConfig[toR][c][1];
  return false;
}

export function startGame(container, level) {
  clearBoard(container);
  const decodedLevel = decodeLevel(level.g);
  let player = { row: 0, column: 0 };

  function move(dr, dc) {
    const toRow = player.row + dr;
    const toColumn = player.column + dc;
    if (!canMove(player, decodedLevel, toRow, toColumn)) return;
    player.row = toRow;
    player.column = toColumn;
    markPlayer(board, toRow, toColumn);
    if (isFinished(player, decodedLevel)) {
      status.textContent = 'You escaped!';
      window.removeEventListener('keydown', keyHandler);
    }
  }

  function keyHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') move(-1, 0);
    if (e.key === 'ArrowDown' || e.key === 's') move(1, 0);
    if (e.key === 'ArrowLeft' || e.key === 'a') move(0, -1);
    if (e.key === 'ArrowRight' || e.key === 'd') move(0, 1);
  }

  const board = getBoard(decodedLevel);
  markPlayer(board, 0, 0);

  const status = Div({
    className: 'game-status',
  });

  const controls = Div({
    className: 'game-controls',
  });

  const restart = Button({
    text: 'Restart',
    onClick: () => {
      player = { row: 0, column: 0 };
      markPlayer(board, 0, 0);
      status.textContent = '';
      window.removeEventListener('keydown', keyHandler);
      window.addEventListener('keydown', keyHandler);
    },
  });
  const back = Button({
    text: 'Menu',
    onClick: () => {
      window.removeEventListener('keydown', keyHandler);
      navTo();
    },
  });

  controls.append(restart, back);

  container.append(board, status, controls);

  window.addEventListener('keydown', keyHandler);
}
