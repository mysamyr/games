const STORAGE_KEY = 'escaper:levels:v1';

const predefined = [
  { n: 'Easy 2x2 1', g: [2, 2, 0, 1, 1, 0] },
  { n: 'Easy 2x2 2', g: [2, 2, 1, 0, 0, 1] },
  { n: 'Easy 3x2', g: [3, 2, 0, 1, 1, 0, 1, 0, 1] },
  { n: 'Easy 3x3 1', g: [3, 3, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0] },
  { n: 'Easy 3x3 2', g: [3, 3, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1] },
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
