const gameBoard = (() => {
    let gameBoardArray = [];
    let players = {};
    let currentPlayer = null

    const squares = document.querySelectorAll('.square')
    for (let i=0; i < squares.length; i++) {
        squares[i].addEventListener('click', () => {
            console.log(`${squares[i].dataset.index} was clicked`)
            calculateCurrentTurn()
            updateArray(currentPlayer, Number(squares[i].dataset.index))
            displayArray()
        })
    }

    const displayArray = () => {
        for (let i=0; i < squares.length; i++) {
            if (gameBoardArray[i] !== undefined) {
                squares[i].textContent = gameBoardArray[i]
                squares[i].style.color = 'white';
            }
        }
    }

    const addPlayer = (player) => {
        players[player.name] = player
        player.gameBoard = gameBoardArray
    }

    const updatePlayerTurn = function() {
        for (player in players) {
            players[player].isTurn = !players[player].isTurn
        }
    }

    const calculateCurrentTurn = function() {
        for (player in players) {
            if (players[player].isTurn) {
                currentPlayer = players[player]
            }
        }
    }

    const updateArray = (currPlayer, position) => {
        if (gameBoardArray[position] === undefined) {
            gameBoardArray[position] = currPlayer.playerType
            updatePlayerTurn()
        }
    }

    return {
        addPlayer: addPlayer,
    }
})()

const personFactory = (name, playerType) => {
    let isWinner = false;
    let isTurn = null;
    let gameBoard = null

    if (playerType === 'X') {
        isTurn = true;
    } else {
        isTurn = false;
    }

    return {
        name: name,
        isTurn: isTurn,
        playerType: playerType,
        //gameBoard: gameBoard
    }
}

const playerOne = personFactory('Derek', 'X')
const playerTwo = personFactory('Zach', 'O')

gameBoard.addPlayer(playerOne)
gameBoard.addPlayer(playerTwo)

