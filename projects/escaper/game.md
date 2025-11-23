# Escaper game

Escaper is a 2d board game where player has to escape from a maze. The maze is represented as a grid of calls, tiled with walls.

The player can move in four directions: up, down, left, and right. The goal is to reach the exit point of the maze.

Enter is always in the top-left corner (0, 0) and exit is always in the bottom-right corner (n-1, m-1) where n is the number of rows and m is the number of columns in the maze.

## Main page should contain:

- List of 10 pre-defined mazes of varying difficulty levels (easy, medium, hard).
- List of user created mazes and stored in local storage.
- Button to create a new maze using maze editor.
- Button to start a game with selected maze.

## Game page should contain:

- Display of the maze grid.
- Player's current position highlighted.
- Controls to move the player (up, down, left, right).

## Editor page should contain:

- Display of an empty maze grid.
- Number selector to choose maze size (rows and columns).
- Displayed grid where user can click to toggle walls on and off.
- Button to save the created maze to local storage with a name.

## Technologies used:

- HTML/CSS for structure and styling.
- JavaScript for game logic and interactivity.
- Local storage for saving user-created mazes.

## Maze representation:

Mazes are stored in local storage as a JSON array of objects, each object containing the maze name and its board configuration.
Board configuration is a flat array of numbers. First 2 numbers represent the number of rows and columns respectively. The rest of the numbers (1 - active wall, 0 - no wall) represent the walls in following order:

- first vertical walls left-right, up-down.
- then horizontal walls up-down, left-right.
- Outer walls are always present and not stored in the array.

Example of maze representation:

```json
{
  "n": "Easy Maze",
  "g": [2, 2, 0, 1, 1, 0]
}
```

This represents a 2x2 maze with walls on the right of the first bottom cell and below the first upper cell.

Pre-defined mazes are hardcoded in the application as an array of such objects.
Example of pre-defined mazes:

```json
[
  { "n": "Easy Maze 1", "g": [2, 2, 0, 1, 1, 0] },
  { "n": "Medium Maze 1", "g": [3, 3, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0] },
  { "n": "Hard Maze 1", "g": [4, 4, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1] }
]
```

## Menu logic:

- Display pre-defined mazes and user-created mazes.
- User can select a maze and start the game.
- User can navigate to maze editor to create a new maze.
- User can delete user-created mazes from local storage using 'x' button near it.
- Option to go back to main menu from game and editor pages.
- Lvl link is technically a div with data attribute containing char ('i' for pre-defined or 'c' for custom) and number (index of a level in array).

## Game logic:

- Player starts at (0, 0).
- Player can move to adjacent cells if there is no wall blocking the way.
- Game ends when player reaches (n-1, m-1).
- Display a message when the player wins.
- Option to restart the game or go back to main menu after winning.

## Editor logic:

- User selects maze size (rows and columns).
- User clicks on cells to toggle walls on and off.
- User saves the maze with a name, which is stored in local storage.
- Before saving, validate that the maze has a valid path from start to exit.
- Display a message if the maze is invalid and prevent saving.
- After saving, return to main menu and display the new maze in the user-created mazes list.
- Option to delete user-created mazes from local storage.
