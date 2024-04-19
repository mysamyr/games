export function generateBoard(difficulty) {
  const main = document.createElement('main');
  main.append(generateGameBoard(difficulty.cols, difficulty.rows));
  return [generateStatus(difficulty.mines), main];
}

function generateStatus(minesCount) {
  const status = document.createElement('header');
  const homeBtn = document.createElement('div');
  homeBtn.id = 'homeButton';
  homeBtn.innerHTML = 'Home';
  homeBtn.classList.add('btn');
  const timer = document.createElement('div');
  timer.id = 'timer';
  timer.classList.add('header-text');
  timer.innerText = 'Time: 0s';
  const mines = document.createElement('div');
  mines.id = 'mines';
  mines.classList.add('header-text');
  mines.innerText = `Mines left: ${minesCount}`;
  const restartBtn = document.createElement('div');
  restartBtn.id = 'restartButton';
  restartBtn.innerHTML = 'Restart';
  restartBtn.classList.add('btn');
  status.append(homeBtn, timer, mines, restartBtn);
  return status;
}

function generateGameBoard(cols, rows) {
  const gameBoard = document.createElement('div');
  gameBoard.id = 'gameBoard';
  gameBoard.style['gridTemplateColumns'] = `repeat(${cols}, auto)`;
  gameBoard.style['gridTemplateRows'] =
    `grid-template-rows: repeat(${rows}, auto)`;
  return gameBoard;
}
