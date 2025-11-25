export function isSolvable({ boardWidth, boardHeight, boardConfig }) {
  const start = [0, 0];
  const target = [boardWidth - 1, boardHeight - 1];

  const q = [];
  const seen = Array.from({ length: boardHeight }, () =>
    Array(boardWidth).fill(false)
  );
  const parent = Array.from({ length: boardHeight }, () =>
    Array(boardWidth).fill(null)
  );

  q.push(start);
  seen[0][0] = true;

  while (q.length) {
    const [x, y] = q.shift();
    if (x === target[0] && y === target[1]) {
      return true;
    }
    // left
    if (x - 1 >= 0 && !seen[x - 1][y]) {
      // movement from (x,y) to (x - 1,y) allowed if no right wall at left cell (x - 1,y)
      if (!boardConfig[y][x - 1][0]) {
        seen[x - 1][y] = true;
        parent[x - 1][y] = [x, y];
        q.push([x - 1, y]);
      }
    }
    // right
    if (x + 1 < boardWidth && !seen[x + 1][y]) {
      // movement from (x,y) to (x + 1,y) allowed if no right wall at current cell (x,y)
      if (!boardConfig[y][x][0]) {
        seen[x + 1][y] = true;
        parent[x + 1][y] = [x, y];
        q.push([x + 1, y]);
      }
    }
    // up
    if (y - 1 >= 0 && !seen[x][y - 1]) {
      // movement from (x,y) to (x,y - 1) allowed if no bottom wall at upper cell (x,y - 1)
      if (!boardConfig[y - 1][x][1]) {
        seen[x][y - 1] = true;
        parent[x][y - 1] = [x, y];
        q.push([x, y - 1]);
      }
    }
    // down
    if (y + 1 < boardHeight && !seen[x][y + 1]) {
      // movement from (x,y) to (x,y + 1) allowed if no bottom wall at current cell (x,y)
      if (!boardConfig[y][x][1]) {
        seen[x][y + 1] = true;
        parent[x][y + 1] = [x, y];
        q.push([x, y + 1]);
      }
    }
  }
  return false;
}
