import { listAllLevels } from '../store/index.js';
import { LEVEL_TYPE } from '../constants/index.js';

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

/** Parse level data from query parameter string
 * @param {string} id - The level identifier in the format "kind-idx"
 * @returns {{idx: Number, kind: String, level: {n: String, g: Number[], c: Boolean}}|null} An object containing idx, kind, and level data, or null if invalid
 */
export const parseLevelDataFromId = id => {
  if (isNil(id)) return null;
  const [kind, idxStr] = id.split('-');
  const idx = parseInt(idxStr, 10);
  const { predefined, custom } = listAllLevels();

  const level = kind === LEVEL_TYPE.PREDEFINED ? predefined[idx] : custom[idx];
  if (!level) return null;

  return {
    idx,
    kind,
    level,
  };
};

// Calculate the number of walls in a maze of size (x, y)
export const getWallCount = (x, y) => 2 * x * y - (x + y);
