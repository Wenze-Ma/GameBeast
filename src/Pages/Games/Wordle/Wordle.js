import Utilities from "../../../Utilities/Utilities";
import './wordle.css';
import {useEffect, useState} from "react";
import {check_dict, dict} from "../../../Utilities/dictionary";
import {toast} from "react-toastify";
import UserService from "../../../Service/UserService";
import RoomService from "../../../Service/RoomService";

const CELL_STATE = {
    CORRECT: 'correct',
    INCORRECT: 'incorrect',
    WRONG_POSITION: 'wrong-position',
    NOT_FILLED: 'false',
}

const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const checkWin = (status) => {
    let isWin = true;
    status.forEach(s => {
        if (s !== CELL_STATE.CORRECT) {
            isWin = false;
        }
    });
    return isWin;
}

const Wordle = ({isOnline, room, socket, user, usersReady, onlineTarget}) => {
    const [numLetters, setNumLetters] = useState('5');
    const [words, setWords] = useState(Array(6).fill('').map(_ => Array(5).fill('')));
    const [position, setPosition] = useState({row: 0, column: 0});
    const [flippedCells, setFlippedCells] = useState(Array(6).fill('').map(_ => Array(5).fill(false)));
    const [lock, setLock] = useState(false);
    const [target, setTarget] = useState(onlineTarget || dict['5'][Math.floor(Math.random() * dict['5'].length)]);
    const [wordState, setWordState] = useState(Array(6).fill('').map(_ => Array(5).fill(CELL_STATE.NOT_FILLED)));
    const [gameOver, setGameOver] = useState(false);
    const [hintNum, setHintNum] = useState(1);
    const [pressedKeys, setPressedKeys] = useState(Array(26).fill(CELL_STATE.NOT_FILLED));
    const [usersInGame, setUsersInGame] = useState(Array(usersReady?.length).fill({}));
    const [usersStatus, setUsersStatus] = useState(Array(usersReady?.length).fill('').map(_ => Array(5).fill(CELL_STATE.INCORRECT)));
    const [usersTries, setUsersTries] = useState(new Set());

    useEffect(() => {
        if (isOnline && socket?.current) {
            socket.current.on('wordle-send-word', (newStatus, email) => {
                const index = usersReady.indexOf(email);
                usersStatus[index] = newStatus;
                setUsersStatus([...usersStatus]);
            });
            socket.current.on('wordle-fail', (email) => {
                usersTries.add(email);
                setUsersTries(new Set(Array.from(usersTries)));
            });
            socket.current.on('wordle-pick-target', t => {
                setTarget(t);
            });
        }
    });

    useEffect(() => {
        if (isOnline && user.email === room.host) {
            if (usersTries.size === usersReady.length) {
                    RoomService.endGame(room._id)
                        .then(() => {
                            socket.current.emit('end-game', room._id, null, target);
                        });
            } else {
                for (let i = 0; i < usersStatus.length; i++) {
                    if (checkWin(usersStatus[i])) {
                        RoomService.endGame(room._id)
                            .then(() => {
                                socket.current.emit('end-game',room._id, usersReady[i], target);
                            });
                    }
                }
            }
        }
    }, [usersStatus, usersTries]);

    useEffect(() => {
        if (usersReady) {
            const fetchUsers = async () => {
                for (const u of usersReady) {
                    await UserService.getUserByEmail(u)
                        .then(response => {
                            usersInGame[usersReady.indexOf(u)] = response.data.user;
                        });
                }
                return usersInGame;
            };
            fetchUsers().then(result => setUsersInGame([...result]));
        }
    }, []);

    useEffect(() => {
        if (isOnline && room && socket.current && user) {
            if (user.email === room.host) {
                socket.current.emit('wordle-pick-target', room._id, onlineTarget);
            }
        }
    }, [isOnline, onlineTarget, room, socket, user]);


    useEffect(() => {
        reset();
    }, [numLetters]);

    useEffect(() => {
        const keyDownHandler = async event => {
            if (position.row >= 6 || gameOver) return;
            if (event.keyCode === 13) {
                event.preventDefault();
            }
            await pressKey(event.key);
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        }
    }, [numLetters, position.column, position.row, words]);

    useEffect(() => {
        if (position.row >= 6) {
            if (!isOnline) {
                toast.info("The word is " + target);
            }
            setGameOver(true);
            if (isOnline && socket.current && !checkWin(wordState[5])) {
                socket.current.emit('wordle-fail', room._id, user.email);
            }
        }
    }, [position]);

    if (gameOver && !isOnline) {
        setTimeout(() => {
            reset();
            setGameOver(false);
        }, 2000);
    }

    const reset = () => {
        if (lock) return;
        setWords(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill('')));
        setFlippedCells(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill(false)));
        setWordState(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill(CELL_STATE.NOT_FILLED)));
        setPosition({row: 0, column: 0});
        setTarget(dict[numLetters][Math.floor(Math.random() * dict[numLetters].length)]);
        setPressedKeys(Array(26).fill(CELL_STATE.NOT_FILLED));
        setHintNum(1);
    }

    const flip = async (currentRow, i) => {
        flippedCells[currentRow][i] = true;
        setFlippedCells([...flippedCells]);
        const letter = words[currentRow][i];
        if (target[i].toUpperCase() === letter) {
            wordState[currentRow][i] = CELL_STATE.CORRECT;
            pressedKeys[letter.charCodeAt(0) - 65] = CELL_STATE.CORRECT;
        } else if (target.toUpperCase().includes(letter)) {
            wordState[currentRow][i] = CELL_STATE.WRONG_POSITION;
            if (pressedKeys[letter.charCodeAt(0) - 65] !== CELL_STATE.CORRECT)
                pressedKeys[letter.charCodeAt(0) - 65] = CELL_STATE.WRONG_POSITION;
        } else {
            wordState[currentRow][i] = CELL_STATE.INCORRECT;
            pressedKeys[letter.charCodeAt(0) - 65] = CELL_STATE.INCORRECT;
        }
        setWordState([...wordState]);
        setPressedKeys([...pressedKeys]);
        await new Promise(r => setTimeout(r, 200));
    }

    const showHint = () => {
        if (position.row === 0) {
            toast.info("You need to enter at least one word!");
            return;
        }
        if (hintNum === 0) {
            toast.info("You've used all your hints!");
            return;
        }
        const count = wordState[position.row - 1].filter(s => s === CELL_STATE.CORRECT).length;
        if (count === numLetters - 1) {
            toast.info("You cannot use hint for the last letter");
            return;
        }
        let index = wordState[position.row - 1].indexOf(CELL_STATE.INCORRECT);
        if (index === -1) {
            index = wordState[position.row - 1].indexOf(CELL_STATE.WRONG_POSITION);
        }
        words[position.row - 1][index] = target[index].toUpperCase();
        wordState[position.row - 1][index] = CELL_STATE.CORRECT;
        pressedKeys[target[index].charCodeAt(0) - 65] = CELL_STATE.CORRECT;
        setWords([...words]);
        setWordState([...wordState]);
        setPressedKeys([...pressedKeys]);
        setHintNum(hintNum - 1);
    }

    const pressKey = async (key) => {
        const isCharacter = /[a-zA-Z]/g.test(key);
        if (isOnline && !usersReady.includes(user.email)) return;
        if (!lock && key.length === 1 && isCharacter && position.column < numLetters) {
            words[position.row][position.column] = key.toUpperCase();
            setWords(words);
            setPosition({column: position.column + 1, row: position.row});
        } else if (key === 'Enter' && position.column === parseInt(numLetters)) {
            const currentRow = position.row;
            if (!check_dict[numLetters].includes(words[currentRow].join('').toLowerCase())) {
                toast.info('It is not a word!');
                return;
            }
            setLock(true);
            for (let i = 0; i < numLetters; i++) {
                await flip(currentRow, i);
            }
            setLock(false);
            if (words[position.row].join('').toLowerCase() === target) {
                if (!isOnline) {
                    toast.success('Congratulations! The word is ' + target);
                }
                setGameOver(true);
            }
            if (isOnline && socket.current) {
                socket.current.emit('wordle-send-word', room._id, wordState[currentRow], user.email);
            }
            setPosition({row: position.row + 1, column: 0});
        } else if (key === 'Backspace' && position.column > 0) {
            words[position.row][position.column - 1] = '';
            setWords(words);
            setPosition({row: position.row, column: position.column - 1});
        }
    }

    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='wordle-game'>
                <div className='wordle-body'>
                    {!isOnline ?
                        <div className='wordle-control'>
                            <form>
                                <label htmlFor='letters'>Number of letters</label>
                                <select id='letters' onChange={(event) => setNumLetters(event.target.value)}
                                        value={numLetters}>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                    <option value='6'>6</option>
                                </select>
                            </form>
                            <div>
                                <button className='btn btn-info' onClick={showHint}>Hint: {hintNum}</button>
                                <button className='btn btn-secondary' onClick={reset}>Reset</button>
                            </div>
                        </div> :
                        <div className='wordle-users'>
                            {usersReady.map((u, index) =>
                                u === user.email ? null :
                                    <div className='wordle-user' key={u}>
                                        <div className='avatar wordle-user-avatar'>
                                            <img src={usersInGame[index]?.picture || ''}
                                                 alt={`${usersInGame[index]?.firstName?.charAt(0)}${usersInGame[index]?.lastName?.charAt(0)}`}
                                                 width='100%' height='100%'/>
                                        </div>
                                        <span>{usersInGame[index]?.firstName || usersInGame[index]?.lastName?.charAt(0)}</span>
                                        <div className='wordle-user-score'>
                                            {usersStatus[index].map((s, i) => <div
                                                className={`cell wordle-board-cell ${s}`} key={i}/>)}
                                        </div>
                                    </div>
                            )}
                        </div>
                    }
                    {isOnline && !usersReady.includes(user.email) ? null :
                        <div className='wordle-board'
                             style={{
                                 gridTemplateColumns: 'repeat(' + numLetters + ', var(--cell-width))',
                                 gridTemplateRows: 'repeat(' + numLetters + ', var(--cell-width))'
                             }}
                        >
                            {words.map((word, index) =>
                                word.map((letter, index2) =>
                                    <div
                                        className={`wordle-board-cell cell ${flippedCells[index][index2] && 'is-flipped'} ${(wordState[index][index2] === CELL_STATE.CORRECT && 'correct') || (wordState[index][index2] === CELL_STATE.INCORRECT && 'incorrect') || (wordState[index][index2] === CELL_STATE.WRONG_POSITION && 'wrong-position')} ${position.row === index && position.column - 1 === index2 && 'add-text'}`}
                                        key={index * numLetters + index2}>{letter}</div>
                                )
                            )}
                        </div>
                    }
                </div>
                {isOnline && !usersReady.includes(user.email) ? null :
                    <div className='wordle-keyboard'>
                        <div className='keyboard-row'>
                            {keyboard[0].map(key => <div
                                className={`keyboard-cell ${pressedKeys[key.charCodeAt(0) - 65]}`}
                                key={key} onClick={() => pressKey(key)}>{key}</div>)}
                        </div>
                        <div className='keyboard-row'>
                            {keyboard[1].map(key => <div
                                className={`keyboard-cell ${pressedKeys[key.charCodeAt(0) - 65]}`}
                                key={key} onClick={() => pressKey(key)}>{key}</div>)}
                        </div>
                        <div className='keyboard-row'>
                            <div className='keyboard-cell keyboard-control' onClick={() => pressKey('Enter')}>Enter
                            </div>
                            {keyboard[2].map(key => <div
                                className={`keyboard-cell ${pressedKeys[key.charCodeAt(0) - 65]}`}
                                key={key} onClick={() => pressKey(key)}>{key}</div>)}
                            <div className='keyboard-cell keyboard-control' onClick={() => pressKey('Backspace')}>Del
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Wordle;
