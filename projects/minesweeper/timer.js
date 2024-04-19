let timerInterval;
let startTime;

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const seconds = elapsedTime % 60;
  const minutes = Math.floor(elapsedTime / 60);
  document.getElementById('timer').textContent =
    `Time: ${minutes ? minutes + 'm' : ''} ${seconds}s`;
}

export function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 200);
}

export function stopTimer() {
  clearInterval(timerInterval);
}

export function getSeconds(currentTime) {
  return Math.floor((currentTime - startTime) / 1000);
}
