(function() {
    'use strict';

    const grid_cells = document.querySelectorAll('.grid_cell');
    const winner_text = document.querySelector('.winner_text');
    const restart_btn = document.querySelector('.restart_btn');

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

    let cell_placeholders = ["", "", "", "", "", "", "", "", ""];
    let active_player = "X";
    let game_status = false;

    function startGame() {
        grid_cells.forEach(cell => cell.addEventListener('click', clickCell));
        restart_btn.addEventListener('click', playAgain);
        winner_text.textContent = `${active_player}'s turn`;
        game_status = true;
    }

    function clickCell() {
        const cellIndex = this.getAttribute('cellIndex');

        if (cell_placeholders[cellIndex] !== "" || !game_status) return;

        updateCell(this, cellIndex);
        winnerStatus();
    }

    function updateCell(cell, index) {
        cell_placeholders[index] = active_player;
        cell.textContent = active_player;
    }

    function switchPlayer() {
        active_player = (active_player === "X") ? "O" : "X";
        winner_text.textContent = `${active_player}'s turn`;
    }

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

    function playAgain() {
        active_player = "X";
        cell_placeholders = ["", "", "", "", "", "", "", "", ""];
        winner_text.textContent = `${active_player}'s turn`;
        grid_cells.forEach(cell => cell.textContent = "");
        game_status = true;
    }

    startGame();
})();
