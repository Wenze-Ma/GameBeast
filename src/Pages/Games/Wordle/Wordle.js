import Utilities from "../../../Utilities/Utilities";
import './wordle.css';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import {dict} from "../../../Utilities/dictionary";
import {toast} from "react-toastify";

const CELL_STATE = {
    CORRECT: 'correct',
    INCORRECT: 'incorrect',
    WRONG_POSITION: 'wrong-position',
    NOT_FILLED: 'false',
}

const Wordle = () => {
    const [numLetters, setNumLetters] = useState('5');
    const [words, setWords] = useState(Array(6).fill('').map(_ => Array(5).fill('')));
    const [position, setPosition] = useState({row: 0, column: 0});
    const [flippedCells, setFlippedCells] = useState(Array(6).fill('').map(_ => Array(5).fill(false)));
    const [lock, setLock] = useState(false);
    const [dictionary, setDictionary] = useState(dict['5']);
    const [target, setTarget] = useState(dictionary[Math.floor(Math.random() * dictionary.length)]);
    const [wordState, setWordState] = useState(Array(6).fill('').map(_ => Array(5).fill(CELL_STATE.NOT_FILLED)));
    const [gameOver, setGameOver] = useState(false);
    const [hasHint, setHasHint] = useState(true);
    useEffect(() => {
        reset();
    }, [numLetters]);

    useEffect(() => {
        const keyDownHandler = async event => {
            if (position.row >= 6 || gameOver) return;
            if(event.keyCode === 13){
                event.preventDefault();
            }
            const isCharacter = /[a-zA-Z]/g.test(event.key);
            if (!lock && event.key.length === 1 && isCharacter && position.column < numLetters) {
                words[position.row][position.column] = event.key.toUpperCase();
                setWords(words);
                setPosition({column: position.column + 1, row: position.row});
            } else if (event.key === 'Enter' && position.column === parseInt(numLetters)) {
                const currentRow = position.row;
                if (!dictionary.includes(words[currentRow].join('').toLowerCase())) {
                    toast.info('It is not a word!');
                    return;
                }
                setLock(true);
                for (let i = 0; i < numLetters; i++) {
                    await flip(currentRow, i);
                }
                setLock(false);
                if (words[position.row].join('').toLowerCase() === target) {
                    toast.success('Congratulations! The word is ' + target);
                    setGameOver(true);
                }
                setPosition({row: position.row + 1, column: 0});
                setHasHint(true);
            } else if (event.key === 'Backspace' && position.column > 0) {
                words[position.row][position.column - 1] = '';
                setWords(words);
                setPosition({row: position.row, column: position.column - 1});
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        }
    }, [numLetters, position.column, position.row, words]);

    useEffect(() => {
        if (position.row >= 6) {
            toast.info("The word is " + target);
            setGameOver(true);
        }
    }, [position]);

    if (gameOver) {
        setTimeout(() => {
            reset();
            setGameOver(false);
        }, 2000)
    }

    const reset = () => {
        if (lock) return;
        setWords(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill('')));
        setFlippedCells(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill(false)));
        setWordState(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill(CELL_STATE.NOT_FILLED)));
        setPosition({row: 0, column: 0});
        setDictionary(dict[numLetters]);
        setTarget(dict[numLetters][Math.floor(Math.random() * dict[numLetters].length)]);
    }

    console.log(target);

    const flip = async (currentRow, i) => {
        flippedCells[currentRow][i] = true;
        setFlippedCells([...flippedCells]);
        const letter = words[currentRow][i];
        if (target[i].toUpperCase() === letter) {
            wordState[currentRow][i] = CELL_STATE.CORRECT;
        } else if (target.toUpperCase().includes(letter)) {
            wordState[currentRow][i] = CELL_STATE.WRONG_POSITION;
        } else {
            wordState[currentRow][i] = CELL_STATE.INCORRECT;
        }
        setWordState([...wordState]);
        await new Promise(r => setTimeout(r, 200));
    }

    const showHint = () => {
        if (position.row === 0) {
            toast.info("You need to enter at least one word!");
            return;
        }
        if (!hasHint) {
            toast.info("You can only use hint once in the same round!");
            return;
        }
        setHasHint(false);
        for (let i = 0; i < numLetters; i++) {
            const value = wordState[position.row - 1][i];
            if (value !== CELL_STATE.CORRECT) {
                words[position.row - 1][i] = target[i].toUpperCase();
                wordState[position.row - 1][i] = CELL_STATE.CORRECT;
                setWords([...words]);
                setWordState([...wordState]);
                break;
            }
        }
    }

    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div>
                <div className='wordle-body'>
                    <div className='wordle-control'>
                        <FormControl variant="standard" sx={{m: 1, width: 100}}>
                            <InputLabel id='letter-number-select'>Number of letters</InputLabel>
                            <Select value={numLetters} onChange={event => setNumLetters(event.target.value)}>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                            </Select>
                        </FormControl>
                        <div>
                            <button className='btn btn-info' onClick={showHint}>Hint</button>
                            <button className='btn btn-secondary' onClick={reset}>Reset</button>
                        </div>
                    </div>
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
                </div>
                <div className='wordle-keyboard'>

                </div>
            </div>
        </div>
    )
}

export default Wordle;
