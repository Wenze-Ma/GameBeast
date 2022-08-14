import './gamecard.css'
import {CheckIcon} from "../../Images/Icons/Icons";

const GameCardMini = ({game, isSelected, select}) => {
    return (
        <div className='card card-mini' onClick={select}>
            <div className='card-header'>
                <img src={game.src} alt=''/>
            </div>
            <div className='card-body'>
                <h5 className='card-title'>{game.title}</h5>
            </div>
            <div className='card-layer' style={{display: isSelected ? 'block' : 'none'}}>
                <CheckIcon/>
            </div>
        </div>
    );
}

export default GameCardMini;
