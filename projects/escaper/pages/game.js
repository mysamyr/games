import { Button, Div, Header, Paragraph } from '../components/index.js';
import { decodeLevel, getLevelName } from '../features/maze.js';
import {
  clearWinAnimation,
  getBoard,
  markGoal,
  markPlayer,
  playWinAnimation,
} from '../features/ui.js';
import { navTo } from '../utils/navigation.js';
import { GAME_STATUS_MESSAGE, LEVEL_TYPE, PATH } from '../constants/index.js';
import {
  hasNextLevel,
  hasPrevLevel,
  isPrevLevelCompleted,
  markLevelCompleted,
} from '../store/index.js';
import { parseLevelDataFromId } from '../utils/helpers.js';
import Snackbar from '../features/snackbar.js';

const app = document.getElementById('app');

function userHasAccessToLevel(level) {
  if (level.kind !== LEVEL_TYPE.PREDEFINED || !level.idx) return true;
  return !!isPrevLevelCompleted(level.idx);
}

function startGame({ level, idx, kind }) {
  const decodedLevel = decodeLevel(level.g);
  const board = getBoard(decodedLevel);
  let player = { x: 0, y: 0 };
  const status = Paragraph({
    className: 'info',
  });
  const isLastLevel = kind === LEVEL_TYPE.PREDEFINED && !hasNextLevel(idx);

  function detachListeners() {
    window.removeEventListener('keydown', keyHandler);
    window.removeEventListener('popstate', onPopState);
  }

  function attachListeners() {
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('popstate', onPopState);
  }

  function onPopState() {
    detachListeners();
  }

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
    detachListeners();
    playWinAnimation(board, status, isLastLevel);
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
    markGoal(board, decodedLevel.boardHeight - 1, decodedLevel.boardWidth - 1);
    status.textContent = '';
    clearWinAnimation(board, status);
    // reattach in case it was removed on win
    attachListeners();
  }

  function onClickMenu() {
    detachListeners();
    navTo();
  }

  function onClickPrevLevel() {
    detachListeners();
    navTo(`${PATH.GAME}?id=${LEVEL_TYPE.PREDEFINED}-${idx - 1}`);
  }

  function onClickNextLevel() {
    detachListeners();
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
      if (!isLastLevel) {
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

  app.append(
    Header({
      lvl: 1,
      text: `Level: ${getLevelName(level)}`,
    }),
    status,
    board,
    getControlsSection()
  );

  markPlayer(board, 0, 0);
  markGoal(board, decodedLevel.boardHeight - 1, decodedLevel.boardWidth - 1);
  attachListeners();
}

export default function (params) {
  const id = params.get('id');
  if (!id) {
    navTo();
    return;
  }

  const level = parseLevelDataFromId(id);
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
  if (!userHasAccessToLevel(level)) {
    Snackbar.displayMsg(
      'This level is locked. Complete previous levels to unlock it.'
    );
    navTo();
    return;
  }

  startGame(level);
}
