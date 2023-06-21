const startBtn = (() => {
    let state = {started: false}
    const gameBoardDom = document.querySelector('.game-board')
    const startBtnDom = document.querySelector('.start')
    const vs = document.querySelector('.vs')
    const cardType = document.querySelectorAll('.type')
    const playerOne = document.querySelector('.player-one')
    const playerTwo = document.querySelector('.player-two')
    startBtnDom.addEventListener('click', () => {
        if (Object.keys(gameBoard.players).length === 2) {
            state.started = true
            gameBoardDom.classList.toggle('invisible')
            // gameBoard.squares.forEach(square => {
            //     //square.classList.toggle('preSquares')
            //     square.classList.toggle('square-dim')
            // })
            startBtnDom.classList.toggle('disable')
            startBtnDom.classList.toggle('invisible')
            resetBtn.reset.classList.toggle('invisible')
            vs.classList.toggle('invisible')
            cardType.forEach(card => card.classList.toggle('close'))
            playerOne.classList.toggle('border-rad')
            playerTwo.classList.toggle('border-rad')
        } else {
            alert('add players first')
        }
    })
    return {
        state: state,
        startBtnDom: startBtnDom
    }
})()

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
            if (startBtn.state.started) {
                calculateCurrentTurn()
                if (!currentPlayer.isAI) {
                    //console.log(gameBoardArray)
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
        updateArray(currentPlayer, position)
        displayArray()
        createNumArray(currentPlayer)

        if (checkIfWon(currentPlayer)) {
            winner = true
            displayWin.displayWinner(winner, false, currentPlayer)
            for (let j=0; j < squares.length; j++) {
                squares[j].classList.toggle('disable')
            }
        } else if (checkIfDraw()) {
            displayWin.displayWinner(winner, true, currentPlayer)
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
                //console.log(`${currentPlayer.name} you won!`)
                return true
            }
        }

        for (let i = 0; i < 3; i++) {
            rowCounts[i] = numRepArray[i].reduce((accumulator, currValue) => accumulator + currValue, 0)
            colCounts[i] = numRepArray[0][i] + numRepArray[1][i] + numRepArray[2][i]
            if (rowCounts[i] >= 3 || colCounts[i] >= 3) {
                //console.log(`${currentPlayer.name} you won!`)
                return true
            }
        }
        return false
    }

    const checkIfDraw = () => {
        if (!gameBoardArray.includes(undefined)) {
            console.log(gameBoardArray)
            console.log('is draw')
            return true
        }
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
        displayArray: displayArray,
        updatePlayerTurn: updatePlayerTurn,
        createNumArray: createNumArray,
        checkIfWon: checkIfWon,

        set winner (value) {
            winner = value
        },

        get winner () {
            return winner
        },

        players: players,
        numRepArray: numRepArray,
        gameBoardArray: gameBoardArray,
        splicedArray: splicedArray,
        squares: squares
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

        chosenPosition = findBestMove(gameBoardArray)
        return chosenPosition
    }

    const findBestMove = (gameBoardArray) => {
        let bestScore = -1000
        let bestMove = 0
        for (let i = 0; i < gameBoardArray.length; i++) {
            if (gameBoardArray[i] === undefined) {
                let currentMove = i
                let currentBoard = gameBoardArray.slice()
                currentBoard[i] = 'O'
                let currentScore = minimax(currentBoard, 0, false)
                if (currentScore > bestScore) {
                    bestMove = currentMove
                    bestScore = currentScore
                }
                currentBoard[i] = undefined
            }
        }
        console.log(bestScore)
        return bestMove
    }

    const minimax = (board, depth, isMax) => {
        let score = eval(board)
        if (score === 10) {
            return score
        } else if (score === -10) {
            return score
        } else if (!board.includes(undefined)) {
            return 0
        }

        if (isMax) {
            let max = -1000
            for (let i = 0; i < board.length; i++) {
                if (board[i] === undefined) {
                    board[i] = 'O'
                    max = Math.max(minimax(board, depth + 1, !isMax), max)
                    board[i] = undefined
                }
            }
            return max
        } else {
            let min = 1000
            for (let i = 0; i < board.length; i++) {
                if (board[i] === undefined) {
                    board[i] = 'X'
                    min = Math.min(minimax(board, depth + 1, !isMax), min)
                    board[i] = undefined
                }
            }
            return min
        }
    }

    const eval = (board) => {
        if ((board[0] == 'O' && board[1] == 'O' && board[2] == 'O')
            || (board[3] == 'O' && board[4] == 'O' && board[5] == 'O')
            || (board[6] == 'O' && board[7] == 'O' && board[8] == 'O')
            || (board[0] == 'O' && board[3] == 'O' && board[6] == 'O')
            || (board[1] == 'O' && board[4] == 'O' && board[7] == 'O')
            || (board[2] == 'O' && board[5] == 'O' && board[8] == 'O')
            || (board[0] == 'O' && board[4] == 'O' && board[8] == 'O')
            || (board[2] == 'O' && board[4] == 'O' && board[6] == 'O')) {
            return 10
        } else if ((board[0] == 'X' && board[1] == 'X' && board[2] == 'X')
            || (board[3] == 'X' && board[4] == 'X' && board[5] == 'X')
            || (board[6] == 'X' && board[7] == 'X' && board[8] == 'X')
            || (board[0] == 'X' && board[3] == 'X' && board[6] == 'X')
            || (board[1] == 'X' && board[4] == 'X' && board[7] == 'X')
            || (board[2] == 'X' && board[5] == 'X' && board[8] == 'X')
            || (board[0] == 'X' && board[4] == 'X' && board[8] == 'X')
            || (board[2] == 'X' && board[4] == 'X' && board[6] == 'X')) {
            return -10
        } else {
            return 0
        }
    }

    const findValidPosition = (gameBoardArray) => {
        let validPosition = []
        //console.log(gameBoardArray)
        for (let i = 0; i < gameBoardArray.length; i++) {
            if (gameBoardArray[i] === undefined) {
                //console.log('entered')
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

const createPlayer = (() => {
    const formContainerOne = document.querySelector('.form-container.one')
    const formContainerTwo = document.querySelector('.form-container.two')

    const send = (formContainer, form) => {
        const selector = "[name='name" + formContainer.classList[1] + "']"

        if (form.checkValidity()) {
            const playerName = document.querySelector(selector).value
            const playerType = formContainer.id
    
            const playerBtn = formContainer.querySelector('button')
            playerBtn.textContent = playerName
    
            let player = playerFactory(playerName, playerType)
            
            gameBoard.addPlayer(player)
            //console.log(player)
            form.classList.toggle('invisible')
            playerBtn.classList.toggle('invisible')
            checkPlayerCount()
            event.preventDefault()
        }
    }

    const playerOneBtn = document.querySelector('.player-one')
    playerOneBtn.addEventListener('click', () => {
        onClickAction(formContainerOne)
    })

    const playerTwoBtn = document.querySelector('.player-two')
    playerTwoBtn.addEventListener('click', () => {
        onClickAction(formContainerTwo)
    })
    const onClickAction = (formContainer) => {
        const nameSelector = 'name' + formContainer.classList[1]
        const form = document.createElement('form')
        const name = document.createElement('input')
        name.setAttribute('type', 'text')
        name.setAttribute('name', nameSelector)
        name.setAttribute('placeholder', 'name')
        name.required = true
        name.classList.add('form-entry')
    
        const submit = document.createElement('input')
        submit.setAttribute('type', 'submit')
        submit.addEventListener('click', () => {
            send(formContainer, form)//send(id)
        })
        submit.value = 'Add'
        submit.classList.add('submit')
    
        form.appendChild(name)
        form.appendChild(submit)
        form.classList.add('form')

        formContainer.appendChild(form)

        const playerBtn = formContainer.querySelector('button')
        playerBtn.classList.toggle('disable')
        playerBtn.classList.toggle('invisible')

        if (playerBtn.classList[0] === 'player-two') {
            playerBtn.classList.toggle('border-rad-right')
        }

        if (formContainer.classList[1] === 'two') {
            const ai = document.querySelector('.ai')
            ai.classList.toggle('invisible')
        }
    }

    const checkPlayerCount = () => {
        if (Object.keys(gameBoard.players).length === 2) {
            startBtn.startBtnDom.classList.toggle('invisible')
        }
    }

    return {
        checkPlayerCount: checkPlayerCount
    }
})()

const createAI = (() => {
    const aiButton = document.querySelector('.ai')
    const playerBtn = document.querySelector('.player-two')
    aiButton.addEventListener('click', () => {
        gameBoard.addPlayer(computerPlayer)
        playerBtn.classList.toggle('invisible')
        aiButton.classList.toggle('disable')
        aiButton.classList.toggle('border-rad-left')
        createPlayer.checkPlayerCount()
    })
})()

const displayWin = (() => {
    const win = document.querySelector('.win')

    const displayWinner = (isWin, isDraw, currentPlayer) => {
        if (isWin) {
            win.textContent = `${currentPlayer.name} won!`
        } else {
            win.textContent = ''
        }

        if(isDraw) {
            win.textContent = `It's a tie!`
        }
    }

    return {
        displayWinner: displayWinner
    }
})()

const resetBtn = (() => {
    const reset = document.querySelector('.reset')

    reset.addEventListener('click', () => {
        const squares = document.querySelectorAll('.square')
        for (let i = 0; i < gameBoard.gameBoardArray.length; i++) {
            gameBoard.gameBoardArray[i] = undefined
        }

        if (gameBoard.winner === true) {
            for (let j=0; j < squares.length; j++) {
                squares[j].classList.toggle('disable')
            }
            gameBoard.winner = false
        }

        if (gameBoard.winner === false) {
            displayWin.displayWinner(gameBoard.winner, false, {})
        }

        gameBoard.numRepArray.length = 0
        gameBoard.splicedArray.length = 0

        for (player in gameBoard.players) {
            console.log(gameBoard.players[player])
            if (gameBoard.players[player].playerType === 'X' && gameBoard.players[player].isTurn === false) {
                console.log('entered update')
                gameBoard.updatePlayerTurn()
            }
        }

        for (let i=0; i < squares.length; i++) {
            squares[i].textContent = ''
            squares[i].style.color = 'white';
        }

    })
    
    return {
        reset
    }
})()

