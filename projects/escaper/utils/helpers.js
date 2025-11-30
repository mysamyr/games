import { listAllLevels } from '../store/index.js';
import { LEVEL_TYPE } from '../constants/index.js';

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const getLevel = id => {
  const [kind, idxStr] = id.split('-');
  const idx = parseInt(idxStr, 10);
  const { predefined, custom } = listAllLevels();

  return {
    idx,
    kind,
    level: kind === LEVEL_TYPE.PREDEFINED ? predefined[idx] : custom[idx],
  };
};
