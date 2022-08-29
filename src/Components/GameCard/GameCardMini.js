import './gamecard.css'
import {CheckIcon} from "../../Images/Icons/Icons";

const GameCardMini = ({game}) => {
    return (
        <div className='card card-mini'>
            <div className='card-header'>
                <img src={game.src} alt=''/>
            </div>
            <div className='card-body'>
                <h5 className='card-title'>{game.title}</h5>
            </div>
        </div>
    );
}

export default GameCardMini;
