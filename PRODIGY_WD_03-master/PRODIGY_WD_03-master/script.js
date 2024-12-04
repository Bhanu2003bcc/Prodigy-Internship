// Game variables
let board = Array(9).fill(null);
let playerScore = 0;
let aiScore = 0;
let isPlayerTurn = true;

// Elements
const cells = document.querySelectorAll('.cell');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const restartBtn = document.getElementById('restart-btn');

// Add click event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handlePlayerMove(index));
});

// Restart game
restartBtn.addEventListener('click', restartGame);

// Handle player move
function handlePlayerMove(index) {
    if (!board[index] && isPlayerTurn) {
        board[index] = 'X';
        cells[index].innerText = 'X';
        cells[index].style.color = "#ffcc00";
        isPlayerTurn = false;

        if (checkWin('X')) {
            updateScore('player');
        } else if (!board.includes(null)) {
            alert("It's a tie!");
            restartGame();
        } else {
            setTimeout(aiMove, 500);
        }
    }
}

// AI move using simple strategy
function aiMove() {
    let move = findBestMove();
    board[move] = 'O';
    cells[move].innerText = 'O';
    cells[move].style.color = "#28a745";
    isPlayerTurn = true;

    if (checkWin('O')) {
        updateScore('ai');
    } else if (!board.includes(null)) {
        alert("It's a tie!");
        restartGame();
    }
}

// Simple AI move selection (random empty cell)
function findBestMove() {
    let availableMoves = board.map((cell, idx) => (cell === null ? idx : null)).filter((cell) => cell !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Check for a win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
            pattern.forEach((index) => cells[index].classList.add('winner'));
            return true;
        }
    }
    return false;
}

// Update score
function updateScore(winner) {
    if (winner === 'player') {
        playerScore++;
        playerScoreEl.innerText = `Player: ${playerScore}`;
        alert("Player wins!");
    } else if (winner === 'ai') {
        aiScore++;
        aiScoreEl.innerText = `AI: ${aiScore}`;
        alert("AI wins!");
    }
    restartGame();
}

// Restart game
function restartGame() {
    board.fill(null);
    cells.forEach((cell) => {
        cell.innerText = '';
        cell.classList.remove('winner');
    });
    isPlayerTurn = true;
}
