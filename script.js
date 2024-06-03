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

    const reset = () => {
        grid = ['', '', '', '', '', '', '', '', ''];
    };


    const printGrid = () => {
        console.log(grid);
    };

    return {printGrid, setField, getField, reset};

})()


// The working state of the game / main functions
const gameController = (function() {

    const playerX = Player("kermit", "X");
    const playerO = Player("ian", "O");

    let currentSymbol = playerX.getSymbol();

    const solutions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8],
                       [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8]]

    // function for checking ties


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

    const reset = () => {

        gameBoard.reset();
        displayController.resetDisplay();
        displayController.enableCells();
        currentSymbol = playerX.getSymbol();
        
        gameBoard.printGrid();
    };

    return {solutions, checkBoard, reset, getCurrSymbol, setCurrSymbol}
})();

// changes in the browser state of the game
const displayController = (() => {
    let lastClicked = 0;

    // Changing the cells, adding to cells, 
    const cells = document.querySelectorAll(".cells");

    console.log(cells);
    cells.forEach(cell => {
        cell.addEventListener('mouseover', (e) => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                e.target.textContent = gameController.getCurrSymbol();
            }
        });

        cell.addEventListener('mouseout', (e) => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                e.target.textContent = "";
            }
        });

        cell.addEventListener('click', e => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                e.target.textContent = gameController.getCurrSymbol();
                lastClicked = e.target.dataset.value;
                console.log(lastClicked);
                gameBoard.setField(gameController.getCurrSymbol(), lastClicked);
                gameBoard.printGrid();
                changePlayerTurn();
                // checking to see if gamestate is true, then there's a winner
                const gameState = gameController.checkBoard(gameController.getCurrSymbol());
                if (gameState) {
                    disableCells();
                    console.log(`${gameController.getCurrSymbol()} has won!`);
                }
                gameController.setCurrSymbol(gameController.getCurrSymbol() === "X" ? "O" : "X");
            }
        });

    });

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
    playerTurn.textContent = `${gameController.getCurrSymbol()}'s Turn`
    const changePlayerTurn = () => {
        playerTurn.textContent = `${gameController.getCurrSymbol()}'s Turn`
    };

    const resetDisplay = () => {
        cells.forEach(cell => {
            cell.textContent = "";
        });
    };

    // reset button
    const restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click', () => {
        gameController.reset();
    });

    return {changePlayerTurn, resetDisplay, disableCells, enableCells}

})();

