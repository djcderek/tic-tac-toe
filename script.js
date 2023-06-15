const gameBoard = (() => {
    let gameBoardArray = Array.apply(null, Array(9)).map(function () {});//[];
    let players = {};
    let currentPlayer = null
    let splicedArray = []
    let numRepArray = []
    let winner = null

    const squares = document.querySelectorAll('.square')
    for (let i=0; i < squares.length; i++) {
        squares[i].addEventListener('click', () => {
            calculateCurrentTurn()
            if (!currentPlayer.isAI) {
                run(currentPlayer, Number(squares[i].dataset.index))
                nudgeAI()
            } else if (currentPlayer.isAI) {
                for (player in players) {
                    if (players[player].isAI) {
                        let position = players[player].calculateMove(gameBoardArray)
                        run(players[player], position)
                    }
                }
            }
        })
    }

    const nudgeAI = () => {
        if (winner != true) {
            for (player in players) {
                if (players[player].isAI) {
                    players[player].simClick()
                }
            }
        }
    }

    const run = (currentPlayer, position) => {
        //calculateCurrentTurn()
        updateArray(currentPlayer, position)
        displayArray()
        createNumArray(currentPlayer)

        if (checkIfWon(currentPlayer)) {
            winner = true
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
        gameBoardArray: gameBoardArray,
    }
})()

const playerFactory = (name, playerType) => {
    let isWinner = false;
    let isAI = false;
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
        isAI: isAI
    }
}

const computerPlayer = ((name, playerType) => {
    const computer = playerFactory(name)
    computer.isAI = true
    computer.playerType = playerType

    const simClick = () => {
        const squares = document.querySelectorAll('.square')
        const singleSquare = squares[0].click()
    }

    const calculateMove = (gameBoardArray) => {
        let validPositions = findValidPosition(gameBoardArray)
        let randomIndex = Math.floor(Math.random()*validPositions.length)
        let chosenPosition = validPositions[randomIndex]
        console.log(chosenPosition)
        return chosenPosition
    }

    const findValidPosition = (gameBoardArray) => {
        let validPosition = []
        console.log(gameBoardArray)
        for (let i = 0; i < gameBoardArray.length; i++) {
            if (gameBoardArray[i] === undefined) {
                console.log('entered')
                validPosition.push(i)
            }
        }
        return validPosition
    }

    return {
        name: computer.name,
        isTurn: computer.isTurn,
        playerType: computer.playerType,
        isAI: computer.isAI,
        calculateMove: calculateMove,
        findValidPosition: findValidPosition,
        simClick: simClick
    }
})('AI', 'O')

const playerOne = playerFactory('Derek', 'X')
const playerTwo = playerFactory('Zach', 'O')

gameBoard.addPlayer(playerOne)
gameBoard.addPlayer(computerPlayer)
//gameBoard.addPlayer(playerTwo)

