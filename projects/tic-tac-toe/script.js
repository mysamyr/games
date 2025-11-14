import { PLAYERS, winConditions } from './util.js';

const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');

let options = new Array(9).fill('');
let currentPlayer = PLAYERS.X;
let running = false;

function initializeGame() {
  cells.forEach((cell, idx) =>
    cell.addEventListener('click', () => cellClicked(idx))
  );
  restartBtn.addEventListener('click', restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked(cellIndex) {
  if (options[cellIndex] !== '' || !running) return;

  updateCell(cellIndex);
  checkWinner(cellIndex);
}

function updateCell(idx) {
  options[idx] = currentPlayer;
  cells[idx].textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA === '' || cellB === '' || cellC === '') continue;
    if (cellA === cellB && cellB === cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  } else if (!options.includes('')) {
    statusText.textContent = `Draw!`;
    running = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = PLAYERS.X;
  options = new Array(9).fill('');
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => (cell.textContent = ''));
  running = true;
}

initializeGame();
