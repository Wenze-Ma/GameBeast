import './pages.css'
import GameCard from "../Components/GameCard/GameCard";
import Utilities from "../Utilities/Utilities";
import Game from "../Models/Game";

export const allGames = [
    new Game('Tic Tac Toe', 'https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/nastuh.jpg',
        'Game', 'stupid game', 'tic-tac-toe', 2,
        {
            board: Array(9).fill(''),
            state: 'X_TURN',
        }),
    new Game('Wordle', 'https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/nastuh.jpg',
        'Game', 'another stupid game',
        'wordle', 2,
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
