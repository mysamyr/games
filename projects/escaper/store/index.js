import {
  STORAGE_LEVELS_KEY,
  STORAGE_PROGRESS_KEY,
} from '../constants/index.js';
import { getWallCount } from '../utils/helpers.js';

const predefined = [
  [2, 2, 0, 1, 1, 0],
  [2, 2, 1, 0, 0, 1],
  [3, 2, 0, 1, 1, 0, 1, 0, 1],
  [3, 3, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [3, 3, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
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
    predefined: predefined.map((g, idx) => ({
      n: String(idx + 1), // name: string
      g, // grid: integer[]
      c: !!progress[idx], // completed: boolean
    })),
    custom: loadCustom(),
  };
}

export function saveCustomLevel(name, grid) {
  const error = checkLevel(name, grid);
  if (!error) {
    throw new Error('Invalid level data');
  }
  const arr = loadCustom();
  arr.push({ n: name, g: grid });
  saveCustom(arr);
}

export function updateCustomLevel(idx, name, grid) {
  const error = checkLevel(name, grid);
  if (!error) {
    throw new Error('Invalid level data');
  }
  const arr = loadCustom();
  arr[idx] = { n: name, g: grid };
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
