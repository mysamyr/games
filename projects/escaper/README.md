Escaper - small maze SPA

How to run

- Open `index.html` in a browser that supports ES modules (most modern browsers).
- Navigation is hash-based: `#/` main, `#/game?id=i-0` play predefined level 0, `#/editor` open editor.

Files

- main.js - router + app bootstrap
- store.js - localStorage persistence for custom levels
- maze.js - compact maze encode/decode helpers
- validator.js - BFS solver
- ui.js - DOM rendering helpers
- game.js - gameplay logic and controls
- editor.js - simple editor to toggle walls (click toggles right wall, shift-click toggles down wall)

Notes

- Uses the compact format described in the project's game.md. Editor toggles walls between cells and validates solvability before save.
- No build step required.
