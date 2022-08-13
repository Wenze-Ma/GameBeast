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
import MyToastContainer from "../Utilities/MyToastContainer";
import {toast} from "react-toastify";

const Online = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const modalRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [joined, setJoined] = useState(false);
    useOutsideHandler(modalRef, isModalOpen, setIsModalOpen);
    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                if (!user) {
                    navigate('/');
                } else {
                    setUser(user);
                }
            })
        RoomService.getAllRooms(setRooms);
    }, [navigate]);

    const handleOnCreate = () => {
        if (!joined) {
            setIsModalOpen(true);
        } else {
            toast.info('You are already in a room.');
        }
    }

    return (
        <div>
            <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
                <div className='room-create-button-container'>
                    <button className='btn btn-warning' onClick={handleOnCreate}>create a room</button>
                </div>
                <div className='room-list'>
                    {rooms.length ? rooms.map(room => <RoomCard key={room._id} room={room} user={user} setJoined={setJoined}/>) :
                        <p style={Utilities.isDarkMode ? {color: 'white'} : {}} className='hint'>
                            There are no rooms yet.
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className='btn-warning text-gradient' onClick={handleOnCreate} style={{cursor: 'pointer'}}> Create one</a>
                        </p>
                    }
                </div>
            </div>
            <div className='modal-container' style={isModalOpen ? {display: 'block'} : {}}>
                <CreateRoomModal modalRef={modalRef}/>
            </div>
        </div>
    );
}

export default Online;
