import { CUSTOM_LEVEL_NAME, LEVEL_SIZE } from '../constants/index.js';
import { getWallCount } from '../utils/helpers.js';
import { getLevelArrayFromString } from './maze.js';

/** Check if a board configuration is solvable using BFS
 *
 * @param {Object} param0
 * @param {number} param0.boardWidth
 * @param {number} param0.boardHeight
 * @param {Array<Array<[boolean, boolean]>>} param0.boardConfig - 2D array of cells, each cell is [hasRightWall, hasBottomWall]
 * @returns {boolean}
 */
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

/** Check level name validity
 *
 * @param {String} name
 * @returns {String|undefined} - error message or undefined if valid
 */
export function checkLevelName(name) {
  if (!name) {
    return 'Please enter a level name';
  }
  if (name.length < CUSTOM_LEVEL_NAME.MIN_LENGTH) {
    return `Level name must be at least ${CUSTOM_LEVEL_NAME.MIN_LENGTH} characters long`;
  }
  if (name.length > CUSTOM_LEVEL_NAME.MAX_LENGTH) {
    return `Level name must be at most ${CUSTOM_LEVEL_NAME.MAX_LENGTH} characters long`;
  }
}

/** Validate level seed format
 *
 * @param {String} seed - "width,height,walls..." walls is a string of 0s and 1s, not separated by commas
 * @returns {boolean}
 */
export function validateLevelSeed(seed) {
  if (!seed || typeof seed !== 'string' || !/^\d+,\d+,[01]+$/.test(seed)) {
    return false;
  }
  const [w, h, ...walls] = getLevelArrayFromString(seed);
  if (w < LEVEL_SIZE.MIN_WIDTH || w > LEVEL_SIZE.MAX_WIDTH) {
    return false;
  }
  if (h < LEVEL_SIZE.MIN_HEIGHT || h > LEVEL_SIZE.MAX_HEIGHT) {
    return false;
  }
  if (getWallCount(w, h) !== walls.length) return false;
  return true;
}
