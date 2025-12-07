export const PATH = {
  HOME: '/',
  GAME: '/game',
  EDITOR: '/editor',
};

export const LEVEL_TYPE = {
  PREDEFINED: 'i',
  CUSTOM: 'c',
};

export const EDITOR_INFO_MESSAGE = {
  SOLVABLE: 'Solvable',
  UNSOLVABLE: 'Unsolvable',
};

export const GAME_STATUS_MESSAGE = {
  ESCAPED: 'You escaped!',
  ESCAPED_LAST: 'You escaped the last default level! Congratulations!',
};

export const DEFAULT_LEVEL_SIZE = {
  WIDTH: 3,
  HEIGHT: 3,
};

export const LEVEL_SIZE = {
  MIN_WIDTH: 2,
  MIN_HEIGHT: 2,
  MAX_WIDTH: 24,
  MAX_HEIGHT: 24,
};

export const CUSTOM_LEVEL_NAME = {
  MAX_LENGTH: 20,
  MIN_LENGTH: 3,
};

export const CONFETTI_PIECE_COUNT = 30;

export const STORAGE_LEVELS_KEY = 'escaper:levels:v1';
export const STORAGE_PROGRESS_KEY = 'escaper:progress:v1';
