// implementation of tic tac toe

const Player = (name, symbol) => {
    this.name = name;
    this.symbol = symbol;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getInput = () => prompt("Input: ");

    return {getName, getSymbol, getInput};
}

// all the necessary functionalities and methods for Game to work
const gameBoard = (() =>{
    let grid = ['', '', '', '', '', '', '', '', ''];

    const setField = (symbol, position) => {
        if (grid[position] != null) {
            grid[position] = symbol;
        } else {
            console.log("This position has already been occupied");
        }
    };

    const getField = (position) => {
        return grid[position];
    };

    const reset = () => {
        grid.map(val => {
            return null
        });
    };


    const printGrid = () => {
        console.log(grid);
    };

    return {printGrid, setField, getField, reset};

})()


// The working state of the game
const gameController = (function(){
    let rounds = 1;
    let isOver = false;

    const positions = {
        "t-l": 0,
        "t-m": 1, 
        "t-r": 2,
        "m-l": 3,
        "m-m": 4, 
        "m-r": 5, 
        "b-l": 6,
        "b-m": 7,
        "b-r": 8
    };

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

    const reset = () => {
        rounds = 1;
        gameBoard.reset();
        isOver = false;
    };

    return {positions, solutions, checkBoard, reset, getIsOver}
})()

// changes in the browser state of the game
const displayController = (() => {

})()

const player1 = Player(prompt("what's your name, player one?", "X"));
const player2 = Player(prompt("what's your name, player one?", "O"));

while (gameController.getIsOver() === false) {
    player1.getInput()
}
console.log("Game over!")