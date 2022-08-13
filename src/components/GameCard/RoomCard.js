import './gamecard.css';
import {useNavigate} from "react-router-dom";
import RoomService from "../../Service/RoomService";
import {useEffect} from "react";
import {toast} from "react-toastify";

const RoomCard = ({room, user, setJoined}) => {
    const navigate = useNavigate();
    const isIn = room?.members.includes(user?.email);
    useEffect(() => {
        if (room && user && isIn) {
            setJoined(true);
        }
    }, [isIn, room, setJoined, user]);
    return (
        <div className='room-card'>
            <div className='room-card-meta'>
                <span className='room-name btn-danger'>{room.roomName || 'Room Name'}</span>
                <span className='room-host'>{room.host || 'Room Host'}</span>
                <span className='room-description'>{room.description || 'This room has no description'}</span>
            </div>
            <div className='room-card-control'>
                <span>{room.members.length} / {room.capacity || 6}</span>
                <button className={`btn ${isIn ? 'btn-primary' : 'btn-info'}`} onClick={() => {
                    if (isIn) {
                        navigate(room._id);
                    } else {
                        RoomService.joinRoom(room._id, user.email)
                            .then(response => {
                                if (response.data.success) {
                                    navigate(room._id);
                                }
                            })
                            .catch(error => {
                                toast.error('Failed joining in');
                            });
                    }
                }}>{isIn ? 'Go Back' : 'Join'}</button>
            </div>
        </div>
    )
}

export default RoomCard;
