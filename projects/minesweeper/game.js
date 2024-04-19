import { difficultyLevels } from './util.js';

export class Minesweeper {
  constructor(difficulty) {
    this.difficulty = difficultyLevels[difficulty];
    this.cells = [];
    this.minePlaces = [];
    this.minesLeft = this.difficulty.mines;
    this.generateMines();
  }

  generateMines() {
    const { mines, rows, cols } = this.difficulty;
    while (this.minePlaces.length < mines) {
      const number = Math.floor(Math.random() * rows * cols);
      if (!this.minePlaces.includes(number)) this.minePlaces.push(number);
    }
  }

  incrementMinesLeft() {
    this.minesLeft++;
  }

  decrementMinesLeft() {
    this.minesLeft--;
  }

  clearMines() {
    this.minePlaces = [];
    this.minesLeft = this.difficulty.mines;
  }
}
