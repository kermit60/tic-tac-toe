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
    let isOver = false;

    const playerX = Player("kermit", "X");
    const playerO = Player("ian", "O");

    let currentSymbol = playerX.getSymbol();

    const solutions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8]
                       [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8]]

    const checkBoard = (player) => {
        const symbol = player.getSymbol();

        for (let array in solutions) {
            const win = array.reduce((prev, index) => {
                return gameBoard.getField(index) === symbol && prev
            }, true);
            if (win) {
                isOver = true;
            }
        }
        isOver  = false;
    };

    const getIsOver = () => isOver;

    const getCurrSymbol = () => currentSymbol;

    const reset = () => {
        gameBoard.reset();
        displayController.resetDisplay();
        isOver = false;
        gameBoard.printGrid();
    };

    return {solutions, checkBoard, reset, getIsOver, getCurrSymbol}
})()

// changes in the browser state of the game
const displayController = (() => {
    let lastClicked = 0;

    // Changing the cells, adding to cells, 
    const cells = document.querySelectorAll(".cells");

    console.log(cells);
    cells.forEach(cell => {
        cell.addEventListener('mouseover', (e) => {
            e.target.textContent = gameController.getCurrSymbol();
        });

        cell.addEventListener('mouseout', (e) => {
            if (!gameBoard.getField(e.target.dataset.value)) {
                e.target.textContent = "";
            }
        });

        cell.addEventListener('click', e => {
            e.target.textContent = gameController.getCurrSymbol();
            lastClicked = e.target.dataset.value;
            console.log(lastClicked);
            gameBoard.setField(gameController.getCurrSymbol(), lastClicked)
            gameBoard.printGrid();
        });

    });
    
    // Changing scoreboard and player turns
    const playerTurn = document.querySelector('.player-turn');
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

    return {changePlayerTurn, resetDisplay}

})();

