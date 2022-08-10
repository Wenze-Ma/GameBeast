import Utilities from "../Utilities/Utilities";
import {server} from "../config";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import RoomCard from "../components/GameCard/RoomCard";
import GameCard from "../components/GameCard/GameCard";
import Cookies from 'js-cookie';
import RoomService from "../Service/RoomService";
import CreateRoomModal from "../components/Modals/CreateRoomModal";
import {useOutsideHandler} from "../Utilities/useOutSideHandler";
import UserService from "../Service/UserService";

const Online = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const modalRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useOutsideHandler(modalRef, isModalOpen, setIsModalOpen);
    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                if (!user) {
                    navigate('/');
                }
            })
        RoomService.getAllRooms(setRooms);
    }, [navigate]);

    return (
        <div>
            <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
                <div className='room-create-button-container'>
                    <button className='btn btn-warning' onClick={() => setIsModalOpen(true)}>create a room</button>
                </div>
                <div className='room-list'>
                    {rooms.map(room => <RoomCard key={room._id} room={room}/>)}
                </div>
            </div>
            <div className='modal-container' style={isModalOpen ? {display: 'block'} : {}}>
                <CreateRoomModal modalRef={modalRef}/>
            </div>
        </div>
    );
}

export default Online;
