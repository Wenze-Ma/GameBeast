import Utilities from "../Utilities/Utilities";
import {server} from "../config";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import UserService from "../Service/UserService";
import RoomService from "../Service/RoomService";
import LeaveModal from "../components/Modals/LeaveModal";
import {useOutsideHandler} from "../Utilities/useOutSideHandler";
import {useCallbackPrompt} from "../Utilities/useCallbackPrompt";
import MyToastContainer from "../Utilities/MyToastContainer";

const Room = () => {
    const params = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [room, setRoom] = useState(null);
    const modalRef = useRef(null);
    // useCallbackPrompt(false, user, room);
    const [showPrompt, setShowPrompt] = useState(false);
    useOutsideHandler(modalRef, showPrompt, setShowPrompt);


    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                if (user) {
                    setUser(user);
                    if (!socket.current) {
                        socket.current = io(server);
                        socket.current.emit('join-room', params.roomId, user.email);
                    }
                } else {
                    navigate('/');
                }
            });
    }, [navigate, params.roomId]);

    useEffect(() => {
        RoomService.getRoom(params.roomId)
            .then(response => {
                if (!response.data.room) {
                    navigate('/online');
                    socket.current.disconnect();
                } else {
                    setRoom(response.data.room);
                    setCurrentUsers(response.data.room.members);
                }
            });
    }, [navigate, params.roomId, user]);

    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const handleClick = () => {
        if (text.replace(/\s/g, '') && room && user) {
            // setMessages([...messages, {sender: user.email, text: text}]);
            socket.current.emit('send-message', room._id, user.email, text);
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-message', (userId, message) => {
                setMessages([...messages, {sender: userId, text: message}]);
            });
            socket.current.on('join-room', userId => {
                if (!currentUsers.includes(userId)) {
                    setCurrentUsers([...currentUsers, userId]);
                }
            });
            socket.current.on('leave-room', userId => {
                setCurrentUsers(currentUsers.filter(current => current !== userId));
            });
            return () => {
                socket.current.off('receive-message');
                socket.current.off('join-room');
                socket.current.off('leave-room');
            }
        }
    });

    const onLeaveRoom = () => {
        RoomService.leaveRoom(room._id, user.email)
            .then(() => {
                socket.current.emit('leave-room', room._id, user.email);
                socket.current.disconnect();
                navigate('/online');
            });
    }

    return (
        <div>
            <div className='modal-container' style={showPrompt ? {display: 'block'} : {}}>
                <LeaveModal cancelNavigation={() => setShowPrompt(false)} confirmNavigation={onLeaveRoom}
                            modalRef={modalRef} room={room} user={user}/>
            </div>
            <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
                <button className='btn btn-secondary' onClick={() => setShowPrompt(true)}>Leave Room</button>
                <div>
                    <p>current users: {currentUsers.join(', ')}</p>
                    <input value={text} onChange={event => setText(event.target.value)}/>
                    <button onClick={handleClick}>send</button>
                    {
                        messages.map((message, id) => <p key={id}>{message.sender}: {message.text}</p>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Room;
