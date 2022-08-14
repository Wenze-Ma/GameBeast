import './gamecard.css'
import {useNavigate} from "react-router-dom";

const GameCard = ({game}) => {
    const navigate = useNavigate();
    return (
        <div className='card'>
            <div className='card-header'>
                <img src={game.src} alt=''/>
            </div>
            <div className='card-body'>
                <p className='tag btn-primary'>{game.tag}</p>
                <h5 className='card-title' onClick={() => navigate(game.href)}>{game.title}</h5>
                <p className='card-description'>{game.description}</p>
            </div>
        </div>
    );
}

export default GameCard;
