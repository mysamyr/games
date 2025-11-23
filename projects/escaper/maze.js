export function encodeCompact(n, m, right, down) {
  const out = [n, m];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m - 1; c++) {
      out.push(right[r][c] ? 1 : 0);
    }
  }
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < m; c++) {
      out.push(down[r][c] ? 1 : 0);
    }
  }
  return out;
}

// todo fix this piece of shit
export function decodeLevel([rows, columns, ...config]) {
  let idx = 0;
  // vertical walls (right walls) n * (m-1)
  const right = Array.from({ length: rows }, () => Array(columns).fill(false));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      right[r][c] = !!config[idx++];
    }
  }
  // horizontal walls (down walls) (n-1) * m
  const down = Array.from({ length: rows }, () => Array(columns).fill(false));
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      down[r][c] = !!config[idx++];
    }
  }
  return { n: rows, m: columns, right, down };
}
