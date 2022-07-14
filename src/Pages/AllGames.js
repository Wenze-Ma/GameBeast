import './pages.css'
import GameCard from "../components/GameCard/GameCard";
import Utilities from "../Utilities/Utilities";

const AllGames = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='card-list'>
                <GameCard tag='Game' title='Tic Tac Toe' description='stupid game' href='tic-tac-toe'/>
                <GameCard tag='Game' title='Placeholder' description='Use border utilities to quickly style the border and border-radius of an element. Great for images, buttons.' href='tic-tac-toe'/>
            </div>
        </div>
    );
}

export default AllGames;
