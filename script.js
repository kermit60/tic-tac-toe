// implementation of tic tac toe

const Player = (name, symbol) => {
    this.name = name;
    this.symbol = symbol;
    const getName = () => name;
    const getSymbol = () => symbol;
    

    return {getName, getSymbol};
}

// all the necessary functionalities and methods for Game to work
const gameBoard = (() => {
    let grid = ['', '', '', '', '', '', '', '', ''];

    const setField = (symbol, position) => {
        if (grid[position] != null) {
            grid[position] = symbol;
            return true;
        } else {
            return false;
        }
    };

    const getField = (position) => {
        return grid[position];
    };

    const getGrid = () => grid;

    const reset = () => {
        grid = ['', '', '', '', '', '', '', '', ''];
    };


    const printGrid = () => {
        console.log(grid);
    };

    return {printGrid, setField, getField, getGrid, reset};

})()

// Scoreboard factory function 
const scoreboard = (() => {
    let playerOWins = 0;
    let playerXWins = 0;
    let playerTies = 0;

    const addPlayerO = () => ++playerOWins;
    const addPlayerX = () => ++playerXWins;
    const addPlayerTies = () => ++playerTies;
    const getPlayerOScore = () => playerOWins;
    const getPlayerXScore = () => playerXWins;
    const getPlayerTies = () => playerTies;
    const reset = () => {
        playerOWins = 0;
        playerXWins = 0;
        playerTies = 0;
    }

    return {addPlayerO, addPlayerTies, addPlayerX, getPlayerOScore, 
            getPlayerTies, getPlayerXScore, reset};
})();

// The working state of the game / main functions
const gameController = (function() {

    const playerX = Player("kermit", "X");
    const playerO = Player("ian", "O");

    let currentSymbol = playerX.getSymbol();

    const solutions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8],
                       [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8]]

    // function for checking ties
    const gameTie = () => {
        let count = 0;
        for (let position of gameBoard.getGrid()) {
            if (position === "") {
                count += 1;
            }
        }
        return count < 1;
    }

    const checkBoard = (symbol) => {
        
        for (let array of solutions) {
            console.log(array);
            const win = gameBoard.getField(array[0]) === symbol && 
                        gameBoard.getField(array[1]) === symbol && 
                        gameBoard.getField(array[2]) === symbol;
            if (win) {
                return true;
            }
        }
        return false;
    };

    const getCurrSymbol = () => currentSymbol;
    
    const setCurrSymbol = (symbol) => {
        currentSymbol = symbol;
    }; 

    const round = () => {
        gameBoard.reset();
        displayController.resetDisplay();
        displayController.enableCells();
        currentSymbol = playerX.getSymbol();

        gameBoard.printGrid();
    };

    const reset = () => {

        gameBoard.reset();
        scoreboard.reset();
        displayController.resetDisplay();
        displayController.enableCells();
        currentSymbol = playerX.getSymbol();
        displayController.changeOWins(0);
        displayController.changeTieWins(0);
        displayController.changeXWins(0);
        displayController.changePlayerTurn("X");
        gameBoard.printGrid();
    };

    return {solutions, checkBoard, reset, round, getCurrSymbol, setCurrSymbol, gameTie};

})();

// changes in the browser state of the game
const displayController = (() => {
    let lastClicked = 0;

    // Changing the cells, adding to cells, 
    const cells = document.querySelectorAll(".cells");

    // popup prompt 
    const prompt = document.querySelector("#prompt");
    const quitButton = document.querySelector(".quit-button");
    const nextRoundButton = document.querySelector("#round-button");
    const winner = document.querySelector(".winner");
    const container = document.querySelector(".container");
    

    quitButton.addEventListener("click", e => {
        gameController.reset();
        prompt.setAttribute('disabled', true);
        container.classList.remove("dim");
    });

    nextRoundButton.addEventListener("click", e => {
        gameController.round();
        prompt.setAttribute('disabled', true);
        container.classList.remove("dim");
    });

    console.log(cells);
    cells.forEach(cell => {
        cell.addEventListener('mouseover', (e) => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                if (gameController.getCurrSymbol() == "X") {
                    cell.classList.add("x-icon");
                } else {
                    cell.classList.add("o-icon");
                }
                
            }
        });

        cell.addEventListener('mouseout', (e) => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                if (gameController.getCurrSymbol() == "X") {
                    cell.classList.remove("x-icon");
                } else {
                    cell.classList.remove("o-icon");
                }
            }
        });

        cell.addEventListener('click', e => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                lastClicked = e.target.dataset.value;
                console.log(lastClicked);
                gameBoard.setField(gameController.getCurrSymbol(), lastClicked);
                gameBoard.printGrid();
                changePlayerTurn();
                // checking to see if gamestate is true, then there's a winner
                const gameState = gameController.checkBoard(gameController.getCurrSymbol());
                if (gameState) {
                    console.log(`${gameController.getCurrSymbol()} has won!`);
                    if (gameController.getCurrSymbol() === "X") {
                        playRound("X");
                        console.log("X WON!")
                    } else {
                        playRound("O");
                        console.log("O WON!")
                    }
                } else if (gameController.gameTie()) {
                    playRound("tie")
                    console.log("Game is tied!")
                }
                
                gameController.setCurrSymbol(gameController.getCurrSymbol() === "X" ? "O" : "X");
                displayController.changePlayerTurn();
            }
        });

    });

    const playRound = (roundWin) => {
        disableCells();
        container.classList.add("dim");
        winner.classList.remove("x-prompt-icon");
        winner.classList.remove("o-prompt-icon");
        winner.classList.add("shift-padding");
        if (roundWin === 'tie') {
            scoreboard.addPlayerTies();
            displayController.changeTieWins(scoreboard.getPlayerTies());
            winner.textContent = "IT'S A TIE!";
            winner.classList.remove("shift-padding");
        } else if (roundWin === 'X') {
            scoreboard.addPlayerX();
            displayController.changeXWins(scoreboard.getPlayerXScore());
            winner.classList.add("x-prompt-icon");
            winner.textContent = "TAKES THE ROUND!"
        } else {
            scoreboard.addPlayerO();
            displayController.changeOWins(scoreboard.getPlayerOScore());
            winner.classList.add("o-prompt-icon");
            winner.textContent = "TAKES THE ROUND!"
        }
        prompt.removeAttribute("disabled");
    }

    // function for disabling all of the divs
    const disableCells = () => {
        cells.forEach(cell => {
            cell.setAttribute('disabled', true);
        });
    };

    // function for enabling all the divs
    const enableCells = () => {
        cells.forEach(cell => {
            cell.removeAttribute('disabled');
        });
    };
    
    // Changing scoreboard and player turns
    const playerTurn = document.querySelector('.player-turn');
    playerTurn.classList.add("x-small-icon");

    const changePlayerTurn = (symbol) => {
        if (gameController.getCurrSymbol() === "X") {
            playerTurn.classList.remove('o-small-icon');
            playerTurn.classList.add("x-small-icon");
        } else {
            playerTurn.classList.remove('x-small-icon');
            playerTurn.classList.add("o-small-icon");
        }
        
    };

    const resetDisplay = () => {
        cells.forEach(cell => {
            cell.classList.remove("x-icon");
            cell.classList.remove("o-icon");
            
        });
        playerTurn.classList.add("x-small-icon");
        playerTurn.classList.remove("o-small-icon");
    };

    const playerXWins = document.querySelector("#player-x-wins > .score");
    const playerOWins = document.querySelector("#player-o-wins > .score");
    const playerTies = document.querySelector("#player-ties > .score");

    const changeXWins = (numWins) => {
        playerXWins.textContent = numWins;
    }

    const changeOWins = (numWins) => {
        playerOWins.textContent = numWins;
    }

    const changeTieWins = (numWins) => {
        playerTies.textContent = numWins;
    }

    // reset button
    const restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click', () => {
        gameController.reset();
    });


    return {changePlayerTurn, resetDisplay, disableCells, enableCells, 
            changeOWins, changeXWins, changeTieWins
    }

})();

