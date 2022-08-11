import './gamecard.css';
import {useNavigate} from "react-router-dom";
import RoomService from "../../Service/RoomService";

const RoomCard = ({room, user}) => {
    const navigate = useNavigate();
    return (
        <div className='room-card'>
            <div className='room-card-meta'>
                <span className='room-name btn-danger'>{room.roomName || 'Room Name'}</span>
                <span className='room-host'>{room.host || 'Room Host'}</span>
                <span className='room-description'>{room.description || 'This room has no description'}</span>
            </div>
            <div className='room-card-control'>
                <span>{room.members.length} / {room.capacity || 6}</span>
                <button className='btn btn-info' onClick={() => {
                    RoomService.joinRoom(room._id, user.email)
                        .then(response => {
                            if (response.data.success) {
                                navigate(room._id);
                            }
                        });
                }}>Join</button>
            </div>
        </div>
    )
}

export default RoomCard;
