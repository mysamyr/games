export function isSolvable(comp) {
  const n = comp.n;
  const m = comp.m;
  const right = comp.right;
  const down = comp.down;
  const start = [0, 0];
  const target = [n - 1, m - 1];

  const q = [];
  const seen = Array.from({ length: n }, () => Array(m).fill(false));
  const parent = Array.from({ length: n }, () => Array(m).fill(null));

  q.push(start);
  seen[0][0] = true;

  while (q.length) {
    const [r, c] = q.shift();
    if (r === target[0] && c === target[1]) {
      // reconstruct
      let cur = [r, c];
      while (cur) {
        cur = parent[cur[0]][cur[1]];
      }
      return true;
    }
    // left
    if (c - 1 >= 0 && !seen[r][c - 1]) {
      // movement from (r,c-1) to (r,c) allowed if right[r][c-1] == false
      if (!right[r][c - 1]) {
        seen[r][c - 1] = true;
        parent[r][c - 1] = [r, c];
        q.push([r, c - 1]);
      }
    }
    // right
    if (c + 1 < m && !seen[r][c + 1]) {
      if (!right[r][c]) {
        seen[r][c + 1] = true;
        parent[r][c + 1] = [r, c];
        q.push([r, c + 1]);
      }
    }
    // up
    if (r - 1 >= 0 && !seen[r - 1][c]) {
      // movement from (r-1,c) to (r,c) allowed if down[r-1][c] == false
      if (!down[r - 1][c]) {
        seen[r - 1][c] = true;
        parent[r - 1][c] = [r, c];
        q.push([r - 1, c]);
      }
    }
    // down
    if (r + 1 < n && !seen[r + 1][c]) {
      if (!down[r][c]) {
        seen[r + 1][c] = true;
        parent[r + 1][c] = [r, c];
        q.push([r + 1, c]);
      }
    }
  }
  return false;
}
