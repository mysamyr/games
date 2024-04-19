export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const NUMBERS_CNT = 10;

export const DIFFICULTIES = {
  1: {
    name: "TEST",
    count: 1,
  },
  2: {
    name: "EASY",
    count: 30,
  },
  3: {
    name: "MEDIUM",
    count: 40,
  },
  4: {
    name: "HARD",
    count: 50,
  },
};

export function convertIndexToPosition(idx) {
  return {
    row: Math.floor(idx / GRID_SIZE),
    column: idx % GRID_SIZE,
  };
}

export function convertPositionToIndex(row, column) {
  return row * GRID_SIZE + column;
}
