import React, { useState } from "react";
import "./App.css";

const emptyGrid = Array(9).fill(Array(9).fill(""));

function App() {
  const [grid, setGrid] = useState(emptyGrid);
  const [error, setError] = useState("");

  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = value;
      setGrid(newGrid);
    }
  };

  const isValid = (grid) => {
    for (let i = 0; i < 9; i++) {
      const rows = new Set();
      const cols = new Set();
      const box = new Set();
      for (let j = 0; j < 9; j++) {
        // Row check
        if (grid[i][j] && rows.has(grid[i][j])) return false;
        rows.add(grid[i][j]);

        // Column check
        if (grid[j][i] && cols.has(grid[j][i])) return false;
        cols.add(grid[j][i]);

        // 3x3 box check
        const boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
        const boxCol = 3 * (i % 3) + (j % 3);
        if (grid[boxRow][boxCol] && box.has(grid[boxRow][boxCol])) return false;
        box.add(grid[boxRow][boxCol]);
      }
    }
    return true;
  };

  const solveSudoku = (grid) => {
    const findEmpty = (grid) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] === "") return [i, j];
        }
      }
      return null;
    };

    const isSafe = (grid, row, col, num) => {
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) return false;
      }
      const startRow = row - (row % 3), startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[i + startRow][j + startCol] === num) return false;
        }
      }
      return true;
    };

    const solve = (grid) => {
      const emptyPos = findEmpty(grid);
      if (!emptyPos) return true;
      const [row, col] = emptyPos;

      for (let num = 1; num <= 9; num++) {
        const strNum = String(num);
        if (isSafe(grid, row, col, strNum)) {
          grid[row][col] = strNum;
          if (solve(grid)) return true;
          grid[row][col] = "";
        }
      }
      return false;
    };

    const newGrid = grid.map((row) => row.slice());
    if (solve(newGrid)) setGrid(newGrid);
    else setError("No solution exists for the given Sudoku!");
  };

  const handleValidate = () => {
    if (isValid(grid)) {
      setError("");
      alert("The Sudoku grid is valid!");
    } else {
      setError("Invalid Sudoku grid. Please check your entries.");
    }
  };

  const handleSolve = () => {
    setError("");
    if (isValid(grid)) {
      solveSudoku(grid);
    } else {
      setError("Cannot solve. The current grid is invalid.");
    }
  };

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              value={cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              maxLength="1"
              className="cell"
            />
          ))
        )}
      </div>
      <button onClick={handleValidate}>Validate</button>
      <button onClick={handleSolve}>Solve</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
