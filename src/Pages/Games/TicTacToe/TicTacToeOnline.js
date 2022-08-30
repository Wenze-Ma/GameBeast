import './tictactoe.css'
import {useEffect, useState} from "react";
import {GAME_STATE, getResultColor, map, winConditions} from "./TicTacToe";
import RoomService from "../../../Service/RoomService";
import {toast} from "react-toastify";

const TicTacToeOnline = ({room, user, socket, usersReady}) => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [gameState, setGameState] = useState(GAME_STATE.X_TURN);
    const [gameStateMap, setGameStateMap] = useState({});
    const [lock, setLock] = useState(false);
    useEffect(() => {
        if (room && user && socket) {
            if (room.members[0] === user.email) {
                setGameStateMap({
                    'X Turn': 'Your Turn',
                    'O Turn': 'Waiting for the other player...',
                    'X Wins': 'You Win!',
                    'O Wins': 'You Lose!',
                    'Draw': 'Draw',
                });
            } else if (usersReady[0] === user.email) {
                setGameStateMap({
                    'O Turn': 'Your Turn',
                    'X Turn': 'Waiting for the other player...',
                    'O Wins': 'You Win!',
                    'X Wins': 'You Lose!',
                    'Draw': 'Draw',
                });
            } else {
                setGameStateMap({
                    'O Turn': 'O\'s Turn',
                    'X Turn': 'X\'s Turn',
                    'O Wins': 'O Wins!',
                    'X Wins': 'X Wins!',
                    'Draw': 'Draw',
                });
            }
            setGameState(GAME_STATE.X_TURN);
        }
    }, [room, socket, user, usersReady]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on('tic-tac-toe-place-chess', (value, index, newState) => {
                setLock(false);
                board[index] = value;
                setGameState(GAME_STATE[newState]);
                setBoard(board);
                checkWin();
            });
        }
    });

    const handleOnClickCell = (index) => {
        if (board[index] !== '' || lock) return;
        if (user.email !== room.members[0] && user.email !== usersReady[0]) {
            toast.info("You are not in the game!");
            return;
        }
        switch (gameState) {
            case GAME_STATE.X_TURN:
                if (room.members[0] === user.email) {
                    if (socket.current) {
                        socket.current.emit('tic-tac-toe-place-chess', room._id, 'X', index, 'O_TURN');
                        setLock(true)
                    }
                } else {
                    toast.info("It's not your turn!");
                }
                break;
            case GAME_STATE.O_TURN:
                if (usersReady[0] === user.email) {
                    if (socket.current) {
                        socket.current.emit('tic-tac-toe-place-chess', room._id, 'O', index, 'X_TURN');
                        setLock(true);
                    }
                } else {
                    toast.info("It's not your turn!");
                }
                break;
            case GAME_STATE.X_WIN:
            case GAME_STATE.O_WIN:
            case GAME_STATE.TIE:
            default:
                return;
        }
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
                } else {
                    setGameState(GAME_STATE.O_WIN);
                }
                return;
            }
        }
        if (!board.includes('')) {
            setGameState(GAME_STATE.TIE);
        }
    }
    const isGameOver = gameState === GAME_STATE.X_WIN || gameState === GAME_STATE.O_WIN || gameState === GAME_STATE.TIE;

    if (isGameOver) {
        setTimeout(() => {
            if (socket?.current && room?.host === user?.email) {
                RoomService.endGame(room._id)
                    .then(() => {
                        socket.current.emit('end-game', room._id);
                    });
            }
        }, 1000);
    }

    return (
        <div className='ttt'>
            <div className='ttt-score'>
                <div className='game-state' style={{width: '100%'}}>
                    <p>{gameStateMap[gameState]}</p>
                </div>
            </div>
            <div className='ttt-table' style={{maxHeight: isGameOver ? '0' : '1000px'}}>
                <div className='ttt-table-layer'>
                    <div className={`online game-result${getResultColor(gameState)}`}
                         style={isGameOver ? {'animation': 'slide-up 1s'} : {}}><p>{gameStateMap[gameState]}</p></div>
                </div>

                {board.map((value, index) =>
                    <div className={`cell${value === '' && !isGameOver ? '' : ' occupied ' + value}`} key={index}
                         onClick={() => {
                             handleOnClickCell(index)
                         }}>
                        <div>{map[value]}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TicTacToeOnline;
