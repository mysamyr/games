import { CONFETTI_PIECE_COUNT } from '../constants/index.js';
import { Div } from '../components';

const app = document.getElementById('app');

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
      board.appendChild(cell);
    }
  }

  return board;
}

// todo: fix meeting player and goal
export function markPlayer(board, y, x) {
  let player = board.querySelector('.player');
  const isInit = !player;
  if (!player) {
    player = Div({ className: 'player' });
  }
  const cell = board.querySelector(`.cell[data-r='${y}'][data-c='${x}']`);

  const startPos = player.getBoundingClientRect();
  cell.appendChild(player);
  if (isInit) return;
  const endPos = player.getBoundingClientRect();

  const dx = startPos.left - endPos.left;
  const dy = startPos.top - endPos.top;

  player.style.transition = 'none';
  player.style.transform = `translate(${dx}px, ${dy}px)`;

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      player.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
      player.style.transform = 'translate(0, 0)';
    })
  );
}

export function clearMarkers(board) {
  const goal = board.querySelector('.goal');
  goal.remove();
}

export function markGoal(board, y, x) {
  const goal = board.querySelector('.goal') || Div({ className: 'goal' });
  const cell = board.querySelector(`.cell[data-r='${y}'][data-c='${x}']`);
  cell.appendChild(goal);
}

export function clearWinAnimation(boardEl, statusEl, confettiEls) {
  boardEl.classList.remove('escaper-win');
  if (statusEl) statusEl.classList.remove('escaper-win');
  const confetti =
    confettiEls || document.querySelectorAll('.escaper-confetti');
  confetti.forEach(n => n.remove());
}

function createConfettiPieces(
  count = CONFETTI_PIECE_COUNT,
  minMs = 5000,
  maxMs = 10000
) {
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

export function playWinAnimation(boardEl, statusEl) {
  boardEl.classList.add('escaper-win');
  statusEl.classList.add('escaper-win');

  const confetti = createConfettiPieces();
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

  setTimeout(() => clearWinAnimation(boardEl, null, confetti), cleanupAfter);
}
