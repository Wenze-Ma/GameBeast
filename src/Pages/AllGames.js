import './pages.css'
import GameCard from "../Components/GameCard/GameCard";
import Utilities from "../Utilities/Utilities";
import Game from "../Models/Game";
export const allGames = [
    new Game('Tic Tac Toe', require('../Images/Logos/ttt.png'),
        'Game', 'Tic-tac-toe is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.',
        'tic-tac-toe', [2, 2],
        {
            board: Array(9).fill(''),
            state: 'X_TURN',
        }),
    new Game('Wordle', require('../Images/Logos/wordle.png'),
        'Game', 'Wordle is a web-based word game created and developed by Welsh software engineer Josh Wardle, and owned and published by The New York Times Company since 2022. Players have six attempts to guess a five-letter word, with feedback given for each guess in the form of colored tiles indicating when letters match or occupy the correct position.',
        'wordle', [2, 10],
        {
            board: Array(9).fill(''),
            state: 'X_TURN',
        }),
];

const AllGames = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='card-list'>
                {allGames.map(game => <GameCard game={game} key={game.title}/>)}
            </div>
        </div>
    );
}

export default AllGames;
