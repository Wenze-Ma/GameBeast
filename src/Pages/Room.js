import Utilities from "../Utilities/Utilities";
import {server} from "../config";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import UserService from "../Service/UserService";
import {useBlocker, usePrompt} from "../Utilities/blocker";

const Room = () => {
    const params = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
                    navigate('/');
                }
            });
        if (socket) {

        }
    }, [navigate, params.roomId])


    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const handleClick = () => {
        if (text.replace(/\s/g,'')) {
            setMessages([...messages, {sender: user.email, text: text}]);
            socket.current.emit('send-msg', {userId: user.email, text: text});
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-msg', message => {
                setMessages([...messages, {sender: message.sender, text: message.text}]);
            })
        }
    })

    return (
        <div style={{marginTop: '80px'}}>
            <input value={text} onChange={event => setText(event.target.value)}/>
            <button onClick={handleClick}>send</button>
            <div style={{width: 1000, height: 1000}}>
                {
                    messages.map((message, id) => <p key={id}>{message.sender}: {message.text}</p>)
                }
            </div>
        </div>
    );
}

export default Room;
