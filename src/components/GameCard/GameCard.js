import './gamecard.css'
import {useNavigate} from "react-router-dom";

const GameCard = ({title, tag, description, href}) => {
    const navigate = useNavigate();
    return (
        <div className='card'>
            <div className='card-header'>
                <img src='https://demos.creative-tim.com/soft-ui-design-system-pro/assets/img/nastuh.jpg' alt=''/>
            </div>
            <div className='card-body'>
                <p className='tag btn-primary'>{tag}</p>
                <h5 className='card-title' onClick={() => navigate(href)}>{title}</h5>
                <p className='card-description'>{description}</p>
            </div>
        </div>
    );
}

export default GameCard;
