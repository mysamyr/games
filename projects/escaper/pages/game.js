import { Button, Div } from '../components/index.js';
import { decodeLevel } from '../features/maze.js';
import { clearBoard, getBoard, markPlayer } from '../features/ui.js';
import { navTo } from '../utils/navigation.js';
import { PATH } from '../constants.js';
import { getLevel } from '../utils/helpers.js';

const app = document.getElementById('app');

function startGame(level) {
  clearBoard(app);
  const decodedLevel = decodeLevel(level);
  let player = { x: 0, y: 0 };
  const board = getBoard(decodedLevel);
  markPlayer(board, 0, 0);

  function keyHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') move(-1, 0);
    if (e.key === 'ArrowDown' || e.key === 's') move(1, 0);
    if (e.key === 'ArrowLeft' || e.key === 'a') move(0, -1);
    if (e.key === 'ArrowRight' || e.key === 'd') move(0, 1);
  }

  function canMove(toR, toC) {
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

  function isFinished() {
    return (
      player.y === decodedLevel.boardHeight - 1 &&
      player.x === decodedLevel.boardWidth - 1
    );
  }

  function move(verticalDir, horizontalDir) {
    const toRow = player.y + verticalDir;
    const toColumn = player.x + horizontalDir;
    if (!canMove(toRow, toColumn)) return;
    player.x = toColumn;
    player.y = toRow;
    markPlayer(board, toRow, toColumn);
    if (isFinished()) {
      status.textContent = 'You escaped!';
      window.removeEventListener('keydown', keyHandler);
    }
  }

  function onRestart() {
    player = { x: 0, y: 0 };
    markPlayer(board, 0, 0);
    status.textContent = '';
    window.removeEventListener('keydown', keyHandler);
    window.addEventListener('keydown', keyHandler);
  }

  function onClickMenu() {
    window.removeEventListener('keydown', keyHandler);
    navTo();
  }

  const status = Div({
    className: 'game-status',
  });

  const controls = Div({
    className: 'game-controls',
    children: [
      Button({ text: 'Restart', onClick: onRestart }),
      Button({ text: 'Menu', onClick: onClickMenu }),
    ],
  });

  app.append(board, status, controls);

  window.addEventListener('keydown', keyHandler);
}

export default function (params) {
  const id = params.get('id');
  if (!id) {
    navTo(PATH.HOME);
    return;
  }

  const level = getLevel(id);
  if (!level) {
    app.append(
      Div({
        text: 'Level not found',
      }),
      Button({
        text: 'Go to Menu',
        onClick: () => navTo(),
      })
    );
    return;
  }

  startGame(level.g);
}
