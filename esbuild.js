import * as esbuild from 'esbuild';
import { join, dirname } from 'node:path';
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECTS = ['minesweeper', 'snake', 'sudoku', 'tic-tac-toe', 'escaper'];

function createDir(path) {
  try {
    mkdirSync(path);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

function moveIndexFile(proj) {
  createDir(join(__dirname, 'dist', proj));
  copyFileSync(
    join(__dirname, 'projects', proj, 'index.html'),
    join(__dirname, 'dist', proj, 'index.html')
  );
}
function moveRest(proj) {
  return esbuild.build({
    entryPoints: [`projects/${proj}/main.js`, `projects/${proj}/styles.css`],
    outdir: `dist/${proj}`,
    bundle: true,
    minify: true,
    minifyWhitespace: true,
    minifySyntax: true,
    write: true,
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11'],
  });
}

(async () => {
  createDir(join(__dirname, 'dist'));
  // move root index.html
  copyFileSync(
    join(__dirname, 'projects', 'index.html'),
    join(__dirname, 'dist', 'index.html')
  );
  for (let proj of PROJECTS) {
    moveIndexFile(proj);
    await moveRest(proj);
  }
})();
