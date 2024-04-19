import { Minesweeper } from './game.js';
import { generateBoard } from './generator.js';
import { getSeconds, startTimer, stopTimer } from './timer.js';
import {
  getLeaderboard,
  initLeaderboard,
  saveToLeaderboard,
} from './leaderboard.js';

// todo add leaderboard display

let minesweeper;
let gameOver = false;
init();

function updateMinesLeft() {
  document.getElementById('mines').textContent =
    `Mines left: ${minesweeper.minesLeft}`;
}

function checkIfAllCellsRevealed() {
  return minesweeper.cells.every(row =>
    row.every(cell => {
      const { row, col } = cell.dataset;
      const cellIdx =
        parseInt(row) * minesweeper.difficulty.cols + parseInt(col);
      return (
        cell.classList.contains('revealed') ||
        minesweeper.minePlaces.includes(cellIdx)
      );
    })
  );
}

function getAdjacentCells(row, col) {
  const res = [];
  const { cols, rows } = minesweeper.difficulty;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        res.push({ row: newRow, col: newCol });
      }
    }
  }
  return res;
}

function showAdjacentCellsRecursive(row, col) {
  const cell = minesweeper.cells[row][col];
  if (cell.classList.contains('revealed')) return;
  cell.classList.add('revealed');
  if (cell.classList.contains('flag')) {
    cell.classList.remove('flag');
    minesweeper.incrementMinesLeft();
  }
  const adjacentCells = getAdjacentCells(row, col);
  const minesCount = adjacentCells.reduce((acc, { row, col }) => {
    const cellIdx = row * minesweeper.difficulty.cols + col;
    return acc + minesweeper.minePlaces.includes(cellIdx);
  }, 0);
  if (minesCount) {
    cell.textContent = minesCount;
  } else {
    adjacentCells.forEach(({ row, col }) =>
      showAdjacentCellsRecursive(row, col)
    );
  }
}

function showAllMines() {
  stopTimer();
  minesweeper.cells.flat().forEach(cell => {
    const { row, col } = cell.dataset;
    const cellIdx = parseInt(row) * minesweeper.difficulty.cols + parseInt(col);
    if (minesweeper.minePlaces.includes(cellIdx)) {
      if (!cell.classList.contains('revealed')) {
        cell.classList.add('mine');
      }
      cell.innerHTML = '&#10039;';
    }
  });
}

function revealCell(event) {
  if (gameOver) return;
  const cell = event.target;
  if (cell.classList.contains('revealed') || cell.classList.contains('flag'))
    return;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const cellIdx = row * minesweeper.difficulty.cols + col;
  if (minesweeper.minePlaces.includes(cellIdx)) {
    gameOver = Date.now();
    showAllMines();
    setTimeout(() => alert('You loose! Try again'), 100);
    return;
  }
  showAdjacentCellsRecursive(row, col);
  updateMinesLeft();
  if (checkIfAllCellsRevealed()) {
    gameOver = Date.now();
    showAllMines();
    saveToLeaderboard(getSeconds(gameOver), minesweeper.difficulty.name);
    setTimeout(() => {
      if (
        confirm(
          `Congratulation! You win and spend ${getSeconds(gameOver)} seconds! Press OK to start a new game`
        )
      ) {
        location.reload();
      }
    }, 100);
  }
}

function setFlag(event) {
  event.preventDefault();
  if (gameOver) return;
  const cell = event.target;
  if (
    cell.classList.contains('revealed') ||
    (!cell.classList.contains('flag') && !minesweeper.minesLeft)
  )
    return;
  cell.classList.contains('flag')
    ? minesweeper.incrementMinesLeft()
    : minesweeper.decrementMinesLeft();
  updateMinesLeft();
  cell.classList.toggle('flag');
}

function renderField() {
  for (let i = 0; i < minesweeper.difficulty.rows; i++) {
    minesweeper.cells[i] = [];
    for (let j = 0; j < minesweeper.difficulty.cols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i.toString();
      cell.dataset.col = j.toString();
      if (minesweeper.difficulty.rows * minesweeper.difficulty.cols < 100) {
        cell.style.width = '50px';
        cell.style.height = '50px';
      }
      cell.addEventListener('click', revealCell);
      cell.addEventListener('contextmenu', setFlag, false);
      document.getElementById('gameBoard').appendChild(cell);
      minesweeper.cells[i][j] = cell;
    }
  }
}

function resetCells() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('revealed', 'flag', 'mine');
    cell.innerText = '';
  });
}

function restart() {
  stopTimer();
  resetCells();
  minesweeper.clearMines();
  updateMinesLeft();
  minesweeper.generateMines();
  startTimer();
  gameOver = false;
}

function renderGameBoard() {
  document.body.append(...generateBoard(minesweeper.difficulty));
  renderField();
  startTimer();
  document
    .getElementById('homeButton')
    .addEventListener('click', () => location.reload());
  document.getElementById('restartButton').addEventListener('click', () => {
    if (gameOver || confirm('Are you sure you want to restart the game?'))
      restart();
  });
}

function init() {
  initLeaderboard();
  const diffBtns = document.querySelectorAll('.btn');

  diffBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      minesweeper = new Minesweeper(e.target.dataset.diff);

      document.body.innerText = '';
      renderGameBoard();
    });
  });

  document.getElementById('leaderboard').addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log(getLeaderboard());
  });
}
