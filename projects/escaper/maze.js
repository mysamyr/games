export function encodeCompact({ rowsCount, columnsCount, boardConfig }) {
  const out = [rowsCount, columnsCount];
  for (let column = 0; column < columnsCount; column++) {
    for (let row = 0; row < rowsCount; row++) {
      if (row < rowsCount - 1) {
        out.push(+boardConfig[column][row][0]);
      }
    }
  }
  for (let row = 0; row < rowsCount; row++) {
    for (let column = 0; column < columnsCount; column++) {
      if (column < columnsCount - 1) {
        out.push(+boardConfig[column][row][1]);
      }
    }
  }
  return out;
}

export function decodeLevel([rowsCount, columnsCount, ...config]) {
  let idx = 0;

  const boardConfig = Array.from({ length: columnsCount }, () =>
    Array.from({ length: rowsCount }, () => Array())
  );
  for (let column = 0; column < columnsCount; column++) {
    for (let row = 0; row < rowsCount; row++) {
      const rightWall = row < rowsCount - 1 ? !!config[idx++] : false;
      boardConfig[column][row].push(rightWall);
    }
  }
  for (let row = 0; row < rowsCount; row++) {
    for (let column = 0; column < columnsCount; column++) {
      const downWall = column < columnsCount - 1 ? !!config[idx++] : false;
      boardConfig[column][row].push(downWall);
    }
  }

  return { rowsCount, columnsCount, boardConfig };
}
