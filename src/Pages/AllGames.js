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
    new Game('Placeholder', 'https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/nastuh.jpg',
        'Game', 'Use border utilities to quickly style the border and border-radius of an element. Great for images, buttons.',
        'tic-tac-toe', 2,
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
