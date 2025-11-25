import { Button, Div } from './components/index.js';
import { decodeLevel } from './maze.js';
import { getBoard, markPlayer, clearBoard } from './ui.js';
import { navTo } from './navigation.js';

const isFinished = (player, { boardWidth, boardHeight }) =>
  player.y === boardHeight - 1 && player.x === boardWidth - 1;

function canMove(player, decodedLevel, toR, toC) {
  if (
    toR < 0 ||
    toR >= decodedLevel.boardHeight ||
    toC < 0 ||
    toC >= decodedLevel.boardWidth
  )
    return false;
  const boardConfig = decodedLevel.boardConfig;
  // moving right
  if (toR === player.y && toC === player.x + 1)
    return !boardConfig[player.y][player.x][0];
  // moving left
  if (toR === player.y && toC === player.x - 1)
    return !boardConfig[player.y][toC][0];
  // moving down
  if (toR === player.y + 1 && toC === player.x)
    return !boardConfig[player.y][player.x][1];
  // moving up
  if (toR === player.y - 1 && toC === player.x)
    return !boardConfig[toR][player.x][1];
  return false;
}

export function startGame(container, level) {
  clearBoard(container);
  const decodedLevel = decodeLevel(level.g);
  let player = { x: 0, y: 0 };

  function move(verticalDir, horizontalDir) {
    const toRow = player.y + verticalDir;
    const toColumn = player.x + horizontalDir;
    if (!canMove(player, decodedLevel, toRow, toColumn)) return;
    player.x = toColumn;
    player.y = toRow;
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
      player = { x: 0, y: 0 };
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
