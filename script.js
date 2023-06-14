const gameBoard = (() => {
    let gameBoardArray = [];
    let players = {};
    let currentPlayer = null
    let splicedArray = []
    let numRepArray = []
    let winner = null

    const squares = document.querySelectorAll('.square')
    for (let i=0; i < squares.length; i++) {
        squares[i].addEventListener('click', () => {
            calculateCurrentTurn()
            run(currentPlayer, Number(squares[i].dataset.index))
            // calculateCurrentTurn()
            // updateArray(currentPlayer, Number(squares[i].dataset.index))
            // displayArray()
            // createNumArray(currentPlayer)

            // if (checkIfWon(currentPlayer)) {
            //     for (let j=0; j < squares.length; j++) {
            //         squares[j].classList.add('disable')
            //     }
            // }
        })
    }

    const run = (currentPlayer, position) => {
        //calculateCurrentTurn()
        updateArray(currentPlayer, position)
        displayArray()
        createNumArray(currentPlayer)

        if (checkIfWon(currentPlayer)) {
            for (let j=0; j < squares.length; j++) {
                squares[j].classList.add('disable')
            }
        }
    }

    const createNumArray = (currentPlayer) => {
        for (let i = 0; i < 3; i++) {
            let tempArray = gameBoardArray.slice()
            splicedArray[i] = tempArray.splice(i*3, 3)
            numRepArray[i] = splicedArray[i].map((x) => {
                if (x === currentPlayer.playerType) {
                    return x = 1
                } else {
                    return x = 0
                }
            })
        }
    }

    const checkIfWon = (currentPlayer) => {
        let rowCounts = []
        let colCounts = []
        let diagOne = [numRepArray[0][0], numRepArray[1][1], numRepArray[2][2]]
        let diagTwo = [numRepArray[0][2], numRepArray[1][1], numRepArray[2][0]]

        let diagCounts = [[diagOne.reduce((a, b) => a + b, 0)], [diagTwo.reduce((a,b) => a + b)]]
        for (let i = 0; i < 2; i++) {
            //console.log(diagCounts[i])
            if (diagCounts[i] >= 3) {
                console.log(`${currentPlayer.name} you won!`)
                return true
            }
        }

        for (let i = 0; i < 3; i++) {
            rowCounts[i] = numRepArray[i].reduce((accumulator, currValue) => accumulator + currValue, 0)
            colCounts[i] = numRepArray[0][i] + numRepArray[1][i] + numRepArray[2][i]
            if (rowCounts[i] >= 3 || colCounts[i] >= 3) {
                console.log(`${currentPlayer.name} you won!`)
                return true
            }
        }
        return false
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
        run: run,
        numRepArray: numRepArray,
    }
})()

const playerFactory = (name, playerType) => {
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

const computerPlayer = ((name) => {
    const computer = playerFactory(name)

    return {
        computer
    }
})('AI')

const playerOne = playerFactory('Derek', 'X')
const playerTwo = playerFactory('Zach', 'O')

gameBoard.addPlayer(playerOne)
gameBoard.addPlayer(playerTwo)

