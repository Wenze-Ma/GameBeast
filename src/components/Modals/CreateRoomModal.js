import Utilities from "../../Utilities/Utilities";
import {useEffect, useState} from "react";
import UserService from "../../Service/UserService";
import Cookies from "js-cookie";
import RoomService from "../../Service/RoomService";
import {useNavigate} from "react-router-dom";

const CreateRoomModal = ({modalRef}) => {
    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [roomCapacity, setRoomCapacity] = useState(6);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                setUser(user);
                setRoomName(`${user.firstName || user.lastName || user.email || '???'}'s Room`);
            });
    }, [])

    const handleOnSubmit = (event) => {
        event.preventDefault();
        RoomService.createRooms(user._id, roomName, roomCapacity, description)
            .then((response) => navigate(response.data.room._id));
    }

    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title btn-warning text-gradient'>Create a Room</h3>
            <div className='modal-form'>
                <form id='createRoomForm' onSubmit={handleOnSubmit}>
                    <label>Room Name</label>
                    <div className='input-group'>
                        <input type='text' placeholder='Room Name' aria-label='name' className='form-control'
                               required value={roomName} onChange={event => setRoomName(event.target.value)}/>
                    </div>
                    <label>Description</label>
                    <div className='input-group'>
                        <input type='text' placeholder='Description' aria-label='Description' className='form-control'
                               value={description} onChange={event => setDescription(event.target.value)}/>
                    </div>
                    <label>Room Capacity</label>
                    <div className='input-group'>
                        <input type='number' placeholder='Room Capacity' aria-label='capacity' className='form-control'
                               required value={roomCapacity} onChange={event => setRoomCapacity(parseInt(event.target.value))}
                               min={2} max={10}
                        />
                    </div>
                </form>
            </div>
            <div className='modal-button-wrapper' style={{marginBottom: '2rem'}}>
                <button className='btn btn-warning modal-button' form='createRoomForm' type='submit'>Create</button>
            </div>
        </div>
    );
}

export default CreateRoomModal;
