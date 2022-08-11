import Utilities from "../Utilities/Utilities";
import {server} from "../config";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import UserService from "../Service/UserService";
import {useBlocker, usePrompt} from "../Utilities/useBlocker";
import RoomService from "../Service/RoomService";
import {useCallbackPrompt} from "../Utilities/useCallbackPrompt";
import LeaveModal from "../components/Modals/LeaveModal";
import {useOutsideHandler} from "../Utilities/useOutSideHandler";

const Room = () => {
    const params = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [room, setRoom] = useState(null);
    const modalRef = useRef(null);
    const [showDialog, setShowDialog] = useState(true);
    const [showPrompt, setShowPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog, user, room);
    useOutsideHandler(modalRef, showPrompt, setShowPrompt);


    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                if (user) {
                    setUser(user);
                    if (!socket.current) {
                        socket.current = io(server);
                        socket.current.emit('add-user', user.email);
                        socket.current.emit('join-room', {roomId: params.roomId, email: user.email});
                    }
                } else {
                    setShowDialog(false);
                }
            });
        RoomService.getRoom(params.roomId)
            .then(response => {
                if (!response.data.room) {
                    setShowDialog(false);
                    navigate('/online');
                } else {
                    setRoom(response.data.room);
                }
            });
    }, [navigate, params.roomId]);

    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const handleClick = () => {
        if (text.replace(/\s/g, '')) {
            setMessages([...messages, {sender: user.email, text: text}]);
            socket.current.emit('send-msg', {userId: user.email, text: text});
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-msg', message => {
                setMessages([...messages, {sender: message.sender, text: message.text}]);
            });
            socket.current.on('joined', email => {
                setCurrentUsers([...currentUsers, email]);
            });
        }
    });

    const onLeaveRoom = () => {
        socket.current.emit('leave-room', {roomId: room._id, email: user.email});
        if (room.host === user.email) {
            RoomService.deleteRoom(room._id)
                .then(() => {
                    navigate('/online')
                });
        } else {
            RoomService.leaveRoom(room._id, user.email)
                .then(() => navigate('/online'));
        }
    }
    // window.addEventListener('beforeunload', (ev) => {
    //     ev.preventDefault();
    //     console.log("HIHIHII")
    // })

    return (
        <div>
            <div className='modal-container' style={showPrompt ? {display: 'block'} : {}}>
                <LeaveModal cancelNavigation={cancelNavigation} confirmNavigation={confirmNavigation}
                            modalRef={modalRef} isHost={room?.host === user?.email} onLeaveRoom={onLeaveRoom}/>
            </div>
            <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
                <button className='btn btn-secondary' onClick={() => navigate('/online')}>Leave Room</button>
                <div>
                    <p>current users: {currentUsers}</p>
                    <input value={text} onChange={event => setText(event.target.value)}/>
                    <button onClick={handleClick}>send</button>
                    <div style={{width: 1000, height: 1000}}>
                        {
                            messages.map((message, id) => <p key={id}>{message.sender}: {message.text}</p>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;
