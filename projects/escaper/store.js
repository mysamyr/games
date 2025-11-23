const STORAGE_KEY = 'escaper:levels:v1';

const predefined = [
  { n: 'Easy Maze 1', g: [2, 2, 0, 1, 1, 0] },
  { n: 'Easy Maze 2', g: [2, 2, 1, 0, 0, 1] },
  { n: 'Easy Maze 3', g: [3, 3, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0] },
  { n: 'Medium Maze 1', g: [4, 4, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1] },
  {
    n: 'Medium Maze 2',
    g: [
      5, 5, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    ],
  },
  {
    n: 'Hard Maze 1',
    g: [
      6, 6, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0,
    ],
  },
  { n: 'Tricky 1', g: [3, 4, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0] },
  {
    n: 'Tricky 2',
    g: [4, 3, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  },
  { n: 'Maze 9', g: [3, 3, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] },
  { n: 'Maze 10', g: [3, 2, 0, 1, 1, 0, 1, 0, 1] },
];

function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCustom(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function listAllLevels() {
  return { predefined, custom: loadCustom() };
}

export function saveCustomLevel(level) {
  const arr = loadCustom();
  arr.push(level);
  saveCustom(arr);
  return arr.length - 1;
}

export function updateCustomLevel(idx, level) {
  const arr = loadCustom();
  arr[idx] = level;
  saveCustom(arr);
}

export function deleteCustomLevel(idx) {
  const arr = loadCustom();
  arr.splice(idx, 1);
  saveCustom(arr);
}

export function clearCustom() {
  saveCustom([]);
}
