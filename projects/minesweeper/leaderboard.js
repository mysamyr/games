export function saveToLeaderboard(seconds, difficulty) {
  const board = JSON.parse(localStorage.getItem('leaderboard'));
  board[difficulty].push(seconds);
  localStorage.setItem('leaderboard', JSON.stringify(board));
}

export function getLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard'));
}

export function initLeaderboard() {
  const board = localStorage.getItem('leaderboard');
  if (!board) {
    const defaultBoard = {
      easy: [],
      medium: [],
      hard: [],
    };
    localStorage.setItem('leaderboard', JSON.stringify(defaultBoard));
  }
}
