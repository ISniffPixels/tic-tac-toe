(function() {
    'use strict';

    // Cached DOM elements
    const grid_cells = document.querySelectorAll('.grid_cell');
    const winner_text = document.querySelector('.winner_text');
    const restart_btn = document.querySelector('.restart_btn');

    // Winning combinations
    const xo_match = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Game state variables
    let cell_placeholders = ["", "", "", "", "", "", "", "", ""];
    let active_player = "X";
    let game_status = false;

    // Initialize game and add event listeners
    function startGame() {
        grid_cells.forEach(cell => cell.addEventListener('click', clickCell));
        restart_btn.addEventListener('click', playAgain);
        winner_text.textContent = `${active_player}'s turn`;
        game_status = true;
    }

    // Handle cell click event
    function clickCell() {
        const cellIndex = this.getAttribute('cellIndex');

        // Prevent moves on taken cells or when game is inactive
        if (cell_placeholders[cellIndex] !== "" || !game_status) return;

        updateCell(this, cellIndex);
        winnerStatus();
    }

    // Update cell with active player's marker
    function updateCell(cell, index) {
        cell_placeholders[index] = active_player;
        cell.textContent = active_player;
    }

    // Switch the active player
    function switchPlayer() {
        active_player = (active_player === "X") ? "O" : "X";
        winner_text.textContent = `${active_player}'s turn`;
    }

    // Check the game for a win or draw
    function winnerStatus() {
        let winnerFound = false;

        for (let i = 0; i < xo_match.length; i++) {
            const [a, b, c] = xo_match[i];
            if (cell_placeholders[a] === "" || cell_placeholders[b] === "" || cell_placeholders[c] === "") continue;
            if (cell_placeholders[a] === cell_placeholders[b] && cell_placeholders[b] === cell_placeholders[c]) {
                winnerFound = true;
                break;
            }
        }

        if (winnerFound) {
            winner_text.textContent = `${active_player} wins!`;
            game_status = false;
        } else if (!cell_placeholders.includes("")) {
            winner_text.textContent = `Draw!`;
            game_status = false;
        } else {
            switchPlayer();
        }
    }

    // Reset the game to play again
    function playAgain() {
        active_player = "X";
        cell_placeholders = ["", "", "", "", "", "", "", "", ""];
        winner_text.textContent = `${active_player}'s turn`;
        grid_cells.forEach(cell => cell.textContent = "");
        game_status = true;
    }

    // Start the game immediately upon script load
    startGame();
})();
