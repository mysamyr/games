import { Button, Div, Header, Paragraph } from '../components/index.js';
import { decodeLevel } from '../features/maze.js';
import { clearBoard, getBoard, markPlayer } from '../features/ui.js';
import { navTo } from '../utils/navigation.js';
import { GAME_STATUS_MESSAGE, LEVEL_TYPE, PATH } from '../constants/index.js';
import { hasNextLevel, hasPrevLevel } from '../store/index.js';
import { getLevel } from '../utils/helpers.js';

const app = document.getElementById('app');

function createConfettiPieces(count = 24, minMs = 5000, maxMs = 10000) {
  const pieces = [];
  const rect = app.getBoundingClientRect();
  const globalLeft = rect.left + window.scrollX;
  const globalTop = rect.top + window.scrollY;
  for (let i = 0; i < count; i++) {
    const duration = Math.round(Math.random() * (maxMs - minMs) + minMs);
    const delay = Math.round(Math.random() * 500);
    const left = globalLeft + Math.random() * rect.width;
    // start slightly above the board so pieces visibly fall down it
    const startTop = globalTop - Math.round(Math.random() * 40 + 30);

    const el = Div({
      className: 'escaper-confetti',
      style: {
        left: `${left}px`,
        top: `${startTop}px`,
        background: `hsl(${Math.round(Math.random() * 360)}, 80%, 60%)`,
        transform: `rotate(${Math.random() * 360}deg)`,
        zIndex: '9',
        animationDuration: `${duration}ms, ${duration}ms`,
        animationDelay: `${delay}ms, ${delay}ms`,
      },
    });
    const rot = Math.round(Math.random() * 360);
    el.style.setProperty('--start-rot', `${rot}deg`);

    pieces.push(el);
  }
  return pieces;
}

function playWinAnimation(boardEl, statusEl) {
  boardEl.classList.add('escaper-win');
  statusEl.classList.add('escaper-win');

  const confetti = createConfettiPieces(30);
  confetti.forEach(c => {
    app.appendChild(c);
  });

  // compute the longest animation duration (first value before comma)
  const maxDuration = confetti.reduce((max, el) => {
    const dur = el.style.animationDuration || '';
    const first = dur.split(',')[0].trim(); // e.g. "6000ms"
    const n = parseFloat(first) || 0;
    return Math.max(max, n);
  }, 0);

  const cleanupAfter = maxDuration + 500;

  setTimeout(() => {
    confetti.forEach(c => c.remove());
    boardEl.classList.remove('escaper-win');
  }, cleanupAfter);
}

function startGame({ level, idx, kind }) {
  clearBoard(app);
  const decodedLevel = decodeLevel(level.g);
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

  function move(newY, newX) {
    const toRow = player.y + newY;
    const toColumn = player.x + newX;
    if (!canMove(toRow, toColumn)) return;
    player.x = toColumn;
    player.y = toRow;
    markPlayer(board, toRow, toColumn);
    if (isFinished()) {
      status.textContent =
        kind === LEVEL_TYPE.PREDEFINED && !hasNextLevel(idx)
          ? GAME_STATUS_MESSAGE.ESCAPED_LAST
          : GAME_STATUS_MESSAGE.ESCAPED;
      window.removeEventListener('keydown', keyHandler);
      playWinAnimation(board, status);
    }
  }

  function onRestart() {
    player = { x: 0, y: 0 };
    markPlayer(board, 0, 0);
    status.textContent = '';
    board.classList.remove('escaper-win');
    status.classList.remove('escaper-win');
    document.querySelectorAll('.escaper-confetti').forEach(n => n.remove());
    window.removeEventListener('keydown', keyHandler);
    window.addEventListener('keydown', keyHandler);
  }

  function onClickMenu() {
    window.removeEventListener('keydown', keyHandler);
    board.classList.remove('escaper-win');
    status.classList.remove('escaper-win');
    document.querySelectorAll('.escaper-confetti').forEach(n => n.remove());
    navTo();
  }

  function onClickPrevLevel() {
    window.removeEventListener('keydown', keyHandler);
    navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx - 1}`);
  }

  function onClickNextLevel() {
    window.removeEventListener('keydown', keyHandler);
    navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx + 1}`);
  }

  const status = Paragraph({
    className: 'game-status',
  });

  const controls = Div({
    className: 'game-controls',
    children: [
      Button({ text: 'Restart', onClick: onRestart }),
      Button({ text: 'Menu', onClick: onClickMenu }),
    ],
  });

  if (kind === LEVEL_TYPE.PREDEFINED) {
    const controlButtons = Div({
      className: 'controls-row',
    });

    if (hasPrevLevel(idx)) {
      controlButtons.appendChild(
        Button({
          text: 'Prev Level',
          onClick: onClickPrevLevel,
        })
      );
    }
    if (hasNextLevel(idx)) {
      // todo is level was completed
      controlButtons.appendChild(
        Button({
          text: 'Next Level',
          onClick: onClickNextLevel,
        })
      );
    }
    controls.appendChild(controlButtons);
  }

  app.append(
    Header({
      text: `Level: ${level.n}`,
    }),
    board,
    status,
    controls
  );

  window.addEventListener('keydown', keyHandler);
}

export default function (params) {
  const id = params.get('id');
  if (!id) {
    navTo(PATH.HOME);
    return;
  }

  const level = getLevel(id);
  if (!level.level) {
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

  startGame(level);
}
