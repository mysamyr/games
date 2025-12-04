export function getLevelName(level) {
  return level?.n || '';
}

export function getLevelSize(level) {
  return [level?.g?.at(0), level?.g?.at(1)];
}

export function encodeLevel({ boardWidth, boardHeight, boardConfig }) {
  const out = [boardWidth, boardHeight];
  for (let column = 0; column < boardHeight; column++) {
    for (let row = 0; row < boardWidth; row++) {
      if (row < boardWidth - 1) {
        out.push(+boardConfig[column][row][0]);
      }
    }
  }
  for (let row = 0; row < boardWidth; row++) {
    for (let column = 0; column < boardHeight; column++) {
      if (column < boardHeight - 1) {
        out.push(+boardConfig[column][row][1]);
      }
    }
  }
  return out;
}

export function decodeLevel([boardWidth, boardHeight, ...config]) {
  let idx = 0;

  const boardConfig = Array.from({ length: boardHeight }, () =>
    Array.from({ length: boardWidth }, () => Array())
  );
  for (let column = 0; column < boardHeight; column++) {
    for (let row = 0; row < boardWidth; row++) {
      const rightWall = row < boardWidth - 1 ? !!config[idx++] : false;
      boardConfig[column][row].push(rightWall);
    }
  }
  for (let row = 0; row < boardWidth; row++) {
    for (let column = 0; column < boardHeight; column++) {
      const downWall = column < boardHeight - 1 ? !!config[idx++] : false;
      boardConfig[column][row].push(downWall);
    }
  }

  return { boardWidth, boardHeight, boardConfig };
}
