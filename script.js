const board = document.getElementById('board');
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const size = 8;
let grid = [];

// Create a random grid of candies
function createBoard() {
  grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      row.push(randomColor);
      const candy = document.createElement('div');
      candy.classList.add('candy', randomColor);
      candy.setAttribute('data-row', i);
      candy.setAttribute('data-col', j);
      candy.addEventListener('click', handleCandyClick);
      board.appendChild(candy);
    }
    grid.push(row);
  }
}

// Handle candy click
let selectedCandy = null;

function handleCandyClick(event) {
  const clickedCandy = event.target;
  const row = parseInt(clickedCandy.getAttribute('data-row'));
  const col = parseInt(clickedCandy.getAttribute('data-col'));

  if (!selectedCandy) {
    selectedCandy = { row, col, candy: clickedCandy };
  } else {
    if (canSwap(selectedCandy.row, selectedCandy.col, row, col)) {
      swapCandies(selectedCandy.row, selectedCandy.col, row, col);
    }
    selectedCandy = null;
  }
}

// Swap two candies on the grid
function swapCandies(row1, col1, row2, col2) {
  const tempColor = grid[row1][col1];
  grid[row1][col1] = grid[row2][col2];
  grid[row2][col2] = tempColor;

  updateBoard();
  checkMatches();
}

// Check for matching candies
function checkMatches() {
  // Simple match-check logic (check for horizontal and vertical matches)
  let matches = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Horizontal match
      if (j < size - 2 && grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
        matches.push({ row: i, col: j });
        matches.push({ row: i, col: j + 1 });
        matches.push({ row: i, col: j + 2 });
      }

      // Vertical match
      if (i < size - 2 && grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
        matches.push({ row: i, col: j });
        matches.push({ row: i + 1, col: j });
        matches.push({ row: i + 2, col: j });
      }
    }
  }

  // Remove matches
  if (matches.length > 0) {
    for (const match of matches) {
      const { row, col } = match;
      grid[row][col] = null;
    }
    updateBoard();
    setTimeout(() => {
      dropCandies();
    }, 500);
  }
}

// Drop candies to fill empty spaces
function dropCandies() {
  for (let col = 0; col < size; col++) {
    let emptySpaces = [];
    for (let row = size - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        emptySpaces.push(row);
      } else if (emptySpaces.length > 0) {
        const emptyRow = emptySpaces.pop();
        grid[emptyRow][col] = grid[row][col];
        grid[row][col] = null;
      }
    }
  }
  updateBoard();
}

// Update the board with the grid
function updateBoard() {
  const candies = document.querySelectorAll('.candy');
  candies.forEach(candy => {
    const row = parseInt(candy.getAttribute('data-row'));
    const col = parseInt(candy.getAttribute('data-col'));
    const color = grid[row][col];
    candy.className = `candy ${color}`;
  });
}

// Initialize the game
createBoard();

