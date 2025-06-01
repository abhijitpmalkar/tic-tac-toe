document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const messageEl = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
    
    let currentBoard = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameOver = false;
    
    // Create board cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
    
    function handleCellClick(e) {
        if (gameOver) return;
        
        const index = e.target.dataset.index;
        
        // Human move
        if (currentBoard[index] === "" && currentPlayer === "X") {
            makeMove(index, "X");
            
            if (checkWinner()) return;
            
            // Computer move
            currentPlayer = "O";
            setTimeout(computerMove, 500);
        }
    }
    
    function makeMove(index, player) {
        currentBoard[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.style.pointerEvents = 'none';
    }
    
    function computerMove() {
        if (gameOver) return;
        
        // Simple AI (same logic as Python version)
        let move = findWinningMove("O") || 
                 findWinningMove("X") || 
                 centerOrCornerMove();
        
        if (move !== null) {
            makeMove(move, "O");
            checkWinner();
        }
        
        currentPlayer = "X";
    }
    
    function findWinningMove(player) {
        // Try to win or block
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === "") return c;
            if (currentBoard[a] === player && currentBoard[c] === player && currentBoard[b] === "") return b;
            if (currentBoard[b] === player && currentBoard[c] === player && currentBoard[a] === "") return a;
        }
        return null;
    }
    
    function centerOrCornerMove() {
        // Prefer center, then corners
        if (currentBoard[4] === "") return 4;
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => currentBoard[i] === "");
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        // Any available move
        const available = currentBoard.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
        return available.length > 0 ? available[0] : null;
    }
    
    function checkWinner() {
        const winner = findWinner();
        if (winner) {
            gameOver = true;
            if (winner === "Tie") {
                messageEl.textContent = "It's a tie!";
            } else {
                messageEl.textContent = `${winner === "X" ? "You" : "Computer"} wins!`;
            }
            return true;
        }
        return false;
    }
    
    function findWinner() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]            // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        
        return currentBoard.includes("") ? null : "Tie";
    }
    
    resetBtn.addEventListener('click', resetGame);
    
    function resetGame() {
        currentBoard = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameOver = false;
        messageEl.textContent = "Your turn!";
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = "";
            cell.style.pointerEvents = 'auto';
        });
    }
});
