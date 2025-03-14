'use strict';

(function() {
    const grid_cells = document.querySelectorAll('.grid_cell');
    const winner_text = document.querySelector('.winner_text');
    const restart_btn = document.querySelector('.restart_btn');
    const score_reset_btn =  document.querySelector('.score_reset_btn');
    const name_submit_btn = document.querySelector('.name_submit');
    const overlay = document.querySelector('.name_entry_overlay');
    const player_x = document.querySelector('.player_x');
    const player_o = document.querySelector('.player_o');
    const score_x = document.querySelector('.score_x');
    const score_o = document.querySelector('.score_o');
    
    // SAVES PLAYER SCORES IN BROWSER API
    let store_scores = JSON.parse(localStorage.getItem("store_scores")) || {player_x: 0, player_o: 0}

    // COLLECTION OF ARRAYS REPRESENTING POSSIBLE WINNING COMBINATIONS THROUGH INDECEES.
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

    // REPRESENTS INDIVIDUAL GRIDS AND THEIR POSITIONS
    let cell_placeholders = ["", "", "", "", "", "", "", "", ""];
    let active_player = "X";
    let game_status = false;

    function startGame() { 
        // STORED NAME INPUT FROM OVERLAY FORM BEFORE GAME STARTS
        const x = document.querySelector('#player_one').value.trim();
        const o = document.querySelector('#player_two').value.trim();

        // SAVES NAMES ENTERED INTO BROWSWER API
        if (x) localStorage.setItem("player_x", x);
        if (o) localStorage.setItem("player_o", o);

        player_x.textContent = `${x || "Player One"} is X`;
        player_o.textContent = `${o || "Player Two"} is O`;

        score_x.textContent = `${store_scores.player_x}`;
        score_o.textContent = `${store_scores.player_o}`;

        grid_cells.forEach(cell => cell.addEventListener('click', clickCell));
        winner_text.textContent = `${active_player}'s turn`;
        game_status = true;

        overlay.classList.add('name_entry_overlay_fade');
        overlay.style.visibility = 'hidden';
    }

    restart_btn.addEventListener('click', playAgain);
    score_reset_btn.addEventListener('click', scoreReset);

    window.addEventListener("DOMContentLoaded", () => {
        const playerOneInput = document.querySelector('#player_one');
        const playerTwoInput = document.querySelector('#player_two');
    
        playerOneInput.value = localStorage.getItem("player_x") || "";
        playerTwoInput.value = localStorage.getItem("player_o") || "";
    });
     
    function clickCell() {
        const cellIndex = this.dataset.cellIndex;

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

       for(let i=0; i < xo_match.length; i++) {
            const winner = xo_match[i];
            const cellA = cell_placeholders[winner[0]];
            const cellB = cell_placeholders[winner[1]];
            const cellC = cell_placeholders[winner[2]];

            if(cellA === "" || cellB === "" || cellC === "") continue;
            if(cellA === cellB && cellB === cellC) {
                winnerFound = true;
                winner.forEach((i) => {
                    grid_cells[i].setAttribute('style', 'animation: scaleFont 1s ease-in-out');
                    // TERNARY OPERATOR APPROACH TO ASSIGN WINNING COLORS FOR X AND O MATCHES
                    active_player === 'X' ?
                    grid_cells[i].style.backgroundColor = 'lightgreen' :
                    grid_cells[i].style.backgroundColor = 'pink'
                    grid_cells[i].style.transition = '1s';
                });

                break;
            }
       }

        if (winnerFound) {
            winner_text.textContent = `${active_player} wins!`;

            if(active_player === "X") {  
                store_scores.player_x++;
                score_x.textContent = `${store_scores.player_x}`;
            } else if(active_player === "O") {
                store_scores.player_o++;
                score_o.textContent = `${store_scores.player_o}`
            }
       
            game_status = false;
        } else if (!cell_placeholders.includes("")) {
            winner_text.textContent = `Draw!`;
            game_status = false;
        } else {
            switchPlayer();
            return;
        }

        localStorage.setItem("store_scores", JSON.stringify(store_scores));
    }

    function playAgain() {
        active_player = "X";
        cell_placeholders = ["", "", "", "", "", "", "", "", ""];
        winner_text.textContent = `${active_player}'s turn`;
        grid_cells.forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "";
            cell.style.animation = "";
            cell.style.transition = "";
            cell.addEventListener('click', clickCell);
        });
        game_status = true;
    }

    function scoreReset() {
        store_scores = {player_x: 0, player_o: 0};
        score_x.textContent = `${store_scores.player_x}`;
        score_o.textContent = `${store_scores.player_o}`;

        localStorage.setItem("store_scores", JSON.stringify(store_scores));
    }

    name_submit_btn.addEventListener('click', startGame);
})();
