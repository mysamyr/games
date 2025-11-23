import { Button, Div } from './components/index.js';
import { decodeLevel } from './maze.js';
import { getBoard, markPlayer, clearBoard } from './ui.js';

const isFinished = (player, comp) =>
  player.r === comp.n - 1 && player.c === comp.m - 1;

export function startGame(container, level, onFinish) {
  clearBoard(container);
  const comp = decodeLevel(level.g || level);
  const board = getBoard(comp);
  container.appendChild(board);
  let player = { r: 0, c: 0 };
  let ended = false;
  markPlayer(board, 0, 0);

  const status = Div({
    className: 'game-status',
  });
  container.appendChild(status);

  const controls = Div({
    className: 'game-controls',
  });

  const restart = Button({
    text: 'Restart',
    onClick: () => {
      player = { r: 0, c: 0 };
      markPlayer(board, 0, 0);
      status.textContent = '';
      ended = false;
    },
  });
  controls.appendChild(restart);

  const back = Button({
    text: 'Menu',
    onClick: () => {
      window.removeEventListener('keydown', keyHandler);
      onFinish && onFinish();
    },
  });
  controls.appendChild(back);

  container.appendChild(controls);

  function canMove(toR, toC) {
    const n = comp.n;
    const m = comp.m;
    if (toR < 0 || toR >= n || toC < 0 || toC >= m) return false;
    const r = player.r;
    const c = player.c;
    if (toR === r && toC === c + 1) return !comp.right[r][c];
    if (toR === r && toC === c - 1) return !comp.right[r][toC];
    if (toR === r + 1 && toC === c) return !comp.down[r][c];
    if (toR === r - 1 && toC === c) return !comp.down[toR][c];
    return false;
  }

  function move(dr, dc) {
    const toR = player.r + dr;
    const toC = player.c + dc;
    if (!canMove(toR, toC)) return;
    player.r = toR;
    player.c = toC;
    markPlayer(board, toR, toC);
    if (isFinished(player, comp)) {
      status.textContent = 'You escaped!';
      ended = true;
    }
  }

  window.addEventListener('keydown', keyHandler);
  function keyHandler(e) {
    if (ended) return;
    if (e.key === 'ArrowUp' || e.key === 'w') move(-1, 0);
    if (e.key === 'ArrowDown' || e.key === 's') move(1, 0);
    if (e.key === 'ArrowLeft' || e.key === 'a') move(0, -1);
    if (e.key === 'ArrowRight' || e.key === 'd') move(0, 1);
  }
}
