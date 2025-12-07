import { Button, Div, Header, Paragraph } from '../components/index.js';
import { decodeLevel, getLevelName } from '../features/maze.js';
import {
  clearWinAnimation,
  getBoard,
  markPlayer,
  playWinAnimation,
} from '../features/ui.js';
import { navTo } from '../utils/navigation.js';
import { GAME_STATUS_MESSAGE, LEVEL_TYPE, PATH } from '../constants/index.js';
import {
  hasNextLevel,
  hasPrevLevel,
  markLevelCompleted,
} from '../store/index.js';
import { getLevel } from '../utils/helpers.js';

const app = document.getElementById('app');

function startGame({ level, idx, kind }) {
  const decodedLevel = decodeLevel(level.g);
  const board = getBoard(decodedLevel);
  let player = { x: 0, y: 0 };
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

  function movePlayer(newY, newX) {
    player.x = newX;
    player.y = newY;
    markPlayer(board, newY, newX);
  }

  function unlockNextLevel() {
    if (level.c) return; // already completed
    markLevelCompleted(idx);
    const nextLevelBtn = document.getElementById('next-level-btn');
    if (nextLevelBtn) {
      nextLevelBtn.disabled = false;
    }
  }

  function onWin() {
    status.textContent =
      kind === LEVEL_TYPE.PREDEFINED && !hasNextLevel(idx)
        ? GAME_STATUS_MESSAGE.ESCAPED_LAST
        : GAME_STATUS_MESSAGE.ESCAPED;
    window.removeEventListener('keydown', keyHandler);
    playWinAnimation(board, status);
    unlockNextLevel();
  }

  function move(newY, newX) {
    const toRow = player.y + newY;
    const toColumn = player.x + newX;
    if (!canMove(toRow, toColumn)) return;
    movePlayer(toRow, toColumn);
    if (isFinished()) {
      onWin();
    }
  }

  function onRestart() {
    player = { x: 0, y: 0 };
    markPlayer(board, 0, 0);
    status.textContent = '';
    clearWinAnimation(board, status);
    // reattach in case it was removed on win
    window.addEventListener('keydown', keyHandler);
  }

  function onClickMenu() {
    window.removeEventListener('keydown', keyHandler);
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

  function getControlsSection() {
    const controls = Div({
      className: 'column',
      children: [
        Div({
          className: 'row',
          children: [
            Button({ text: 'Restart', onClick: onRestart }),
            Button({ text: 'Menu', onClick: onClickMenu }),
          ],
        }),
      ],
    });

    if (kind === LEVEL_TYPE.PREDEFINED) {
      const navigationButtons = Div({
        className: 'row',
      });

      if (hasPrevLevel(idx)) {
        navigationButtons.appendChild(
          Button({
            className: 'orange',
            text: 'Prev Level',
            onClick: onClickPrevLevel,
          })
        );
      }
      if (hasNextLevel(idx)) {
        navigationButtons.appendChild(
          Button({
            id: 'next-level-btn',
            className: 'orange',
            text: 'Next Level',
            disabled: !level.c,
            onClick: onClickNextLevel,
          })
        );
      }
      controls.appendChild(navigationButtons);
    }

    return controls;
  }

  const status = Paragraph({
    className: 'info',
  });

  app.append(
    Header({
      text: `Level: ${getLevelName(level)}`,
    }),
    status,
    board,
    getControlsSection()
  );

  window.addEventListener('keydown', keyHandler);
}

export default function (params) {
  const id = params.get('id');
  if (!id) {
    navTo();
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

  startGame(level);
}
