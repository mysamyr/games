export function isSolvable({ boardWidth, boardHeight, boardConfig }) {
  const start = [0, 0]; // [col, row]
  const target = [boardWidth - 1, boardHeight - 1];

  const q = [];
  const seen = Array.from({ length: boardHeight }, () =>
    Array(boardWidth).fill(false)
  );

  q.push(start);
  seen[0][0] = true;

  while (q.length) {
    const [col, row] = q.shift();
    if (col === target[0] && row === target[1]) {
      return true;
    }

    // left
    if (col - 1 >= 0 && !seen[row][col - 1]) {
      // allowed if no right wall at left cell
      if (!boardConfig[row][col - 1][0]) {
        seen[row][col - 1] = true;
        q.push([col - 1, row]);
      }
    }

    // right
    if (col + 1 < boardWidth && !seen[row][col + 1]) {
      // allowed if no right wall at current cell
      if (!boardConfig[row][col][0]) {
        seen[row][col + 1] = true;
        q.push([col + 1, row]);
      }
    }

    // up
    if (row - 1 >= 0 && !seen[row - 1][col]) {
      // allowed if no bottom wall at upper cell
      if (!boardConfig[row - 1][col][1]) {
        seen[row - 1][col] = true;
        q.push([col, row - 1]);
      }
    }

    // down
    if (row + 1 < boardHeight && !seen[row + 1][col]) {
      // allowed if no bottom wall at current cell
      if (!boardConfig[row][col][1]) {
        seen[row + 1][col] = true;
        q.push([col, row + 1]);
      }
    }
  }

  return false;
}
