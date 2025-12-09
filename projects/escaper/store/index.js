import {
  STORAGE_LEVELS_KEY,
  STORAGE_PROGRESS_KEY,
} from '../constants/index.js';
import { getWallCount } from '../utils/helpers.js';
import { getLevelArrayFromString, getLevelString } from '../features/maze.js';

const predefined = [
  '2,2,0110',
  '3,2,0110101',
  '3,3,000000101101',
  '4,5,1000100101000000100010110110101',
  '7,6,10000001010101101011111110100000010001000010011000110100100100010101011',
  '8,9,1000101010101001101011101100001100110110011011001110010110000100010000001001000100001011010000111001010000011100101010100100000',
  '8,9,1000001010101101101001111110101000100110001101000111010000010000110010001001000100001011010001010011010000011110101111100100101',
];

function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_LEVELS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCustom(arr) {
  localStorage.setItem(STORAGE_LEVELS_KEY, JSON.stringify(arr));
}

function saveProgress(arr) {
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(arr));
}

function checkLevel(name, grid) {
  if (!name || typeof name !== 'string') return false;
  if (!Array.isArray(grid)) return false;
  const size = getWallCount(grid[0], grid[1]) + 2;
  return grid.length === size;
}

export function listAllLevels() {
  const progress = loadProgress();
  return {
    predefined: predefined.map(getLevelArrayFromString).map((g, idx) => ({
      n: String(idx + 1), // name: string
      g, // grid: integer[]
      c: !!progress[idx], // completed: boolean
    })),
    custom: loadCustom().map(lvl => ({
      n: lvl.n,
      g: getLevelArrayFromString(lvl.g),
    })),
  };
}

export function saveCustomLevel(name, grid) {
  const error = checkLevel(name, grid);
  if (!error) {
    throw new Error('Invalid level data');
  }
  const arr = loadCustom();
  arr.push({ n: name, g: getLevelString(grid) });
  saveCustom(arr);
}

export function updateCustomLevel(idx, name, grid) {
  const error = checkLevel(name, grid);
  if (!error) {
    throw new Error('Invalid level data');
  }
  const arr = loadCustom();
  arr[idx] = { n: name, g: getLevelString(grid) };
  saveCustom(arr);
}

export function deleteCustomLevel(idx) {
  const arr = loadCustom();
  arr.splice(idx, 1);
  saveCustom(arr);
}

export function hasPrevLevel(currIdx) {
  return currIdx > 0;
}

export function hasNextLevel(currIdx) {
  return currIdx < predefined.length - 1;
}

export function isPrevLevelCompleted(currIdx) {
  if (currIdx === 0) return true;
  const progress = loadProgress();
  return !!progress[currIdx - 1];
}

export function markLevelCompleted(idx) {
  const progress = loadProgress();
  progress[idx] = true;
  saveProgress(progress);
}

export function clearProgress() {
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify([]));
}
