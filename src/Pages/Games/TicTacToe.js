import Utilities from "../../Utilities/Utilities";
import './tictactoe.css'
import {useState} from "react";

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]
]

const GAME_STATE = {
    'X_TURN': 'X Turn',
    'O_TURN': 'O Turn',
    'X_WIN': 'X Wins',
    'O_WIN': 'O Wins',
    'TIE': 'Draw',
}


const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [gameState, setGameState] = useState(GAME_STATE.X_TURN);
    const [xScore, setXScore] = useState(0);
    const [oScore, setOScore] = useState(0);
    const handleOnClickCell = (index) => {
        if (board[index] !== '') return;
        switch (gameState) {
            case GAME_STATE.X_TURN:
                board[index] = 'X';
                setGameState(GAME_STATE.O_TURN);
                break;
            case GAME_STATE.O_TURN:
                board[index] = 'O';
                setGameState(GAME_STATE.X_TURN);
                break;
            case GAME_STATE.X_WIN:
            case GAME_STATE.O_WIN:
            case GAME_STATE.TIE:
            default:
                return;
        }
        setBoard(board);
        checkWin();
    }

    const checkWin = () => {
        if (gameState === GAME_STATE.O_WIN || gameState === GAME_STATE.X_WIN || gameState === GAME_STATE.TIE) return;
        for (let i = 0; i < winConditions.length; i++) {
            const winCondition = winConditions[i];
            if (board[winCondition[0]] !== '' &&
                board[winCondition[0]] === board[winCondition[1]] &&
                board[winCondition[0]] === board[winCondition[2]]) {

                if (board[winCondition[0]] === 'X') {
                    setGameState(GAME_STATE.X_WIN);
                    setXScore(xScore + 1);
                    // showWinLine(i, 'X');

                } else {
                    setGameState(GAME_STATE.O_WIN);
                    setOScore(oScore + 1);
                    // showWinLine(i, 'O');
                }
                return;
            }
        }
        if (!board.includes('')) {
            setGameState(GAME_STATE.TIE);
        }
    }

    // const showWinLine = (winIndex, win) => {
    //     const winLineElements = document.querySelectorAll('.win-line');
    //     winLineElements[winIndex].classList.add('active');
    //     winLineElements[winIndex].classList.add(win);
    // }
    //
    // const resetWinLine = () => {
    //     const winLineElements = document.querySelectorAll('.win-line');
    //     winLineElements.forEach(w => {
    //         w.classList.remove('active');
    //         w.classList.remove('X');
    //         w.classList.remove('O');
    //     })
    // }

    const isGameOver = gameState === GAME_STATE.X_WIN || gameState === GAME_STATE.O_WIN || gameState === GAME_STATE.TIE;

    if (isGameOver) {
        setTimeout(() => {
            setBoard(Array(9).fill(''));
            setGameState(GAME_STATE.X_TURN);
            // resetWinLine();
        }, 1000);
    }

    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='ttt'>
                <div className='ttt-score'>
                    <div className={`text-group${gameState === GAME_STATE.X_TURN ? ' current-turn' : ''}`}>
                        <span className='text X text-header'>X</span>
                        <span className='text text-body'>{xScore}</span>
                    </div>
                    <div className='game-state'>
                        <p>{gameState}</p>
                    </div>
                    <div className={`text-group${gameState === GAME_STATE.O_TURN ? ' current-turn' : ''}`}>
                        <span className='text O text-header'>O</span>
                        <span className='text text-body'>{oScore}</span>
                    </div>
                </div>
                <div className='ttt-table'>
                    {/*<div className='ttt-table-layer'>*/}
                    {/*    <div className='win-line-horizontal'>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*    </div>*/}
                    {/*    <div className='win-line-vertical'>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*    </div>*/}
                    {/*    <div className='win-line-diagonal'>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*        <div className={`win-line`}></div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {board.map((value, index) =>
                        <div className={`cell${value === '' && !isGameOver ? '' : ' occupied ' + value}`} key={index}
                             onClick={() => {
                                 handleOnClickCell(index)
                             }}>
                            <div>{value}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TicTacToe;
