import { NUMBERS_CNT, GRID_SIZE, DIFFICULTIES } from "./util.js";

export function generateBoard(difficulty) {
  const wrap = document.querySelector(".wrap");
  const statusBox = generateStatus(difficulty);
  wrap.appendChild(statusBox);
  const grid = generateGrid(wrap);
  wrap.appendChild(grid);
  const numbers = generateNumbers(wrap);
  wrap.appendChild(numbers);
}

function generateStatus(difficulty) {
  const statusBox = document.createElement("div");
  statusBox.classList.add("status");
  statusBox.innerHTML = `
    <div>Difficulty: <span class="status-difficulty">${DIFFICULTIES[difficulty].name}</span></div>
    <div>Mistakes: <span class="status-mistakes">0</span></div>
    <div>Time: <span class="status-time">00:00</span></div>
  `;
  return statusBox;
}

function generateGrid() {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    grid.appendChild(cell);
  }
  return grid;
}

function generateNumbers() {
  const numbers = document.createElement("div");
  numbers.classList.add("numbers");
  for (let i = 0; i < NUMBERS_CNT; i++) {
    const numberElement = document.createElement("div");
    if (i === NUMBERS_CNT - 1) {
      numberElement.classList.add("remove");
      numberElement.innerHTML = "x";
    } else {
      numberElement.classList.add("number");
      numberElement.innerHTML = `${i + 1}`;
    }
    numbers.appendChild(numberElement);
  }
  return numbers;
}
