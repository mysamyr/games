/**
 * @param {{n: String}=} level
 * @returns {String}
 */
export function getLevelName(level) {
  return level?.n || '';
}

/**
 * @param {{g: Number[]}} level
 * @returns {Number[]} - [width, height]
 */
export function getLevelSize(level) {
  return [level?.g?.at(0), level?.g?.at(1)];
}

/**
 * @param {{boardWidth: Number, boardHeight: Number, boardConfig: Boolean[][][]}} param0
 * @returns {Number[]} - [width,height,wall1,wall2,...]
 */
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

/**
 * @param {Number[]} arr - [width,height,wall1,wall2,...]
 * @returns {{boardWidth: Number, boardHeight: Number, boardConfig: Boolean[][][]}}
 */
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

/**
 * @param {Number[]} arr - [width,height,wall1,wall2,...]
 * @returns {String} - "width,height,wall1wall2..."
 */
export function getLevelString(arr) {
  const w = arr[0];
  const h = arr[1];
  const wallsArr = arr.slice(2);

  return `${w},${h},${wallsArr.join('')}`;
}

/**
 * @param {String} str - "width,height,wall1wall2..."
 * @returns {Number[]} - [width,height,wall1,wall2,...]
 */
export function getLevelArrayFromString(str) {
  const [w, h, wallsString] = str.split(',');
  const wallsArr = wallsString.split('').map(Number);

  return [+w, +h, ...wallsArr];
}
