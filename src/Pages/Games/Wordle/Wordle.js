import Utilities from "../../../Utilities/Utilities";
import './wordle.css';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";

const Wordle = () => {
    const [numLetters, setNumLetters] = useState('5');
    const [words, setWords] = useState(Array(6).fill('').map(_ => Array(5).fill('')));
    const [position, setPosition] = useState({row: 0, column: 0});
    const [flippedCells, setFlippedCells] = useState(Array(6).fill('').map(_ => Array(5).fill(false)));
    const [lock, setLock] = useState(false);
    useEffect(() => {
        reset();
    }, [numLetters]);


    useEffect(() => {
        const keyDownHandler = async event => {
            if (position.row >= 6) return;
            const isCharacter = /[a-zA-Z]/g.test(event.key);
            if (!lock && event.key.length === 1 && isCharacter && position.column < numLetters) {
                words[position.row][position.column] = event.key.toUpperCase();
                setWords(words);
                setPosition({column: position.column + 1, row: position.row});
            } else if (event.key === 'Enter' && position.column === parseInt(numLetters)) {
                const currentRow = position.row;
                setLock(true);
                for (let i = 0; i < numLetters; i++) {
                    await flip(currentRow, i);
                }
                setLock(false);
                setPosition({row: position.row + 1, column: 0});
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

    const reset = () => {
        setWords(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill('')));
        setFlippedCells(Array(6).fill('').map(_ => Array(parseInt(numLetters)).fill(false)));
        setPosition({row: 0, column: 0});
    }

    const flip = async (currentRow, i) => {
        flippedCells[currentRow][i] = true;
        setFlippedCells([...flippedCells]);
        await new Promise(r => setTimeout(r, 200));
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
                            <button className='btn btn-info'>Hint</button>
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
                                    className={`wordle-board-cell cell ${flippedCells[index][index2] && 'is-flipped'} ${position.row === index && position.column - 1 === index2 && 'add-text'}`}
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
