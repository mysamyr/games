import { listAllLevels } from '../store.js';
import { LEVEL_TYPE } from '../constants.js';

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const getLevel = id => {
  const [kind, idxStr] = id.split('-');
  const idx = parseInt(idxStr, 10);
  const { predefined, custom } = listAllLevels();

  return kind === LEVEL_TYPE.PREDEFINED ? predefined[idx] : custom[idx];
};
