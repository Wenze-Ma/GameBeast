import './pages.css'
import GameCard from "../components/GameCard/GameCard";
import Utilities from "../Utilities/Utilities";

const Game = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='card-list'>
                <GameCard tag='House' title='Tic Tac Toe' description='stupid game'/>
                <GameCard tag='House' title='Shared Coworking' description='Use border utilities to quickly style the border and border-radius of an element. Great for images, buttons.'/>
            </div>
        </div>
    );
}

export default Game;
