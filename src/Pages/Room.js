import Utilities from "../Utilities/Utilities";
import {server} from "../config";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import UserService from "../Service/UserService";
import RoomService from "../Service/RoomService";
import LeaveModal from "../Components/Modals/LeaveModal";
import {useOutsideHandler} from "../Utilities/useOutSideHandler";
import GameCardMini from "../Components/GameCard/GameCardMini";
import UserAvatar from "../Components/Avatar/UserAvatar";
import {toast} from "react-toastify";
import {allGames} from "./AllGames";
import TicTacToe from "./Games/TicTacToe";
import TicTacToeOnline from "./Games/TicTacToeOnline";

const Room = () => {
    const params = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [room, setRoom] = useState(null);
    const modalRef = useRef(null);
    const [gameSelected, setGameSelected] = useState(-1);
    const [showPrompt, setShowPrompt] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    useOutsideHandler(modalRef, showPrompt, setShowPrompt);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const handleClick = () => {
        if (text.replace(/\s/g, '') && room && user) {
            // setMessages([...messages, {sender: user.email, text: text}]);
            socket.current.emit('send-message', room._id, user.email, text);
        }
    }


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
                    setGameSelected(response.data.room.gameSelected);
                    setGameStarted(response.data.room.gameStarted);
                    if (currentUsers.length === 0) {
                        setCurrentUsers(response.data.room.members);
                    }
                }
            });
    }, [currentUsers.length, navigate, params.roomId, user]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-message', (userId, message) => {
                setMessages([...messages, {sender: userId, text: message}]);
            });
            socket.current.on('join-room', userId => {
                console.log("Join", userId)
                if (!currentUsers.includes(userId)) {
                    if (userId === user?.email) {
                        toast.info('You have joined the room');
                    } else {
                        toast.info(userId + ' has joined the room');
                    }
                    setCurrentUsers([...currentUsers, userId]);
                }
            });
            socket.current.on('leave-room', userId => {
                console.log("Leave")
                toast.info(userId + ' leaved the room');
                setCurrentUsers(currentUsers.filter(current => current !== userId));
            });
            socket.current.on('game-select', index => {
                setGameSelected(index);
            });
            socket.current.on('game-start', () => {
                setGameStarted(true);
            });
            socket.current.on('end-game', () => {
                setGameStarted(false);
            });
            return () => {
                socket.current.off('receive-message');
                socket.current.off('join-room');
                socket.current.off('leave-room');
                socket.current.off('game-select');
                socket.current.off('tic-tac-toe-place-chess');
                socket.current.off('end-game');
            }
        }
    });

    const onLeaveRoom = () => {
        RoomService.leaveRoom(room._id, user.email)
            .then(() => {
                socket.current.emit('leave-room', room._id, user.email);
                socket.current.disconnect();
                toast.info('You have leaved the room');
                navigate('/online');
            });
    }

    const handleOnSelect = (index) => {
        if (socket.current && room && user) {
            if (user.email === room.host) {
                socket.current.emit('game-select', room._id, index);
            } else if (gameSelected !== index) {
                toast.info('Only host can select the game');
            }
        }
    };

    const handleOnStart = () => {
        if (socket.current && room && user) {
            if (user.email === room.host) {
                if (gameSelected === -1) {
                    toast.info('Please select a game first');
                } else if (allGames[gameSelected].requiredPlayerNumber !== room.members.length) {
                    toast.info('This game requires ' + allGames[gameSelected].requiredPlayerNumber + ' players');
                } else {
                    RoomService.startGame(room._id, allGames[gameSelected].gameData)
                        .then(response => {
                            if (response.data.success) {
                                socket.current.emit('game-start', room._id);
                            }
                        });
                }
            } else {
                toast.info('Only host can start the game');
            }
        }
    }

    return (
        <div>
            <div className='modal-container' style={showPrompt ? {display: 'block'} : {}}>
                <LeaveModal cancelNavigation={() => setShowPrompt(false)} confirmNavigation={onLeaveRoom}
                            modalRef={modalRef} room={room} user={user}/>
            </div>
            <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
                <div className='control-container'>
                    <button className='btn btn-secondary' onClick={() => setShowPrompt(true)}>Leave Room</button>
                    <button className='btn btn-primary'
                            style={{marginLeft: 20, display: gameStarted ? 'none' : 'inline-block'}}
                            onClick={handleOnStart}>Start Game
                    </button>
                </div>
                <div className='room-container'>
                    <div className='users-container'>
                        {currentUsers.map(current => <UserAvatar email={current} key={current}/>)}
                    </div>
                    {gameStarted ? <TicTacToeOnline room={room} socket={socket} user={user} setRoom={setRoom} setGameStarted={setGameStarted}/> :
                        <div className='game-selection-container'>
                            <div className='card-list'>
                                {allGames.map((game, index) =>
                                    <GameCardMini game={game} key={index}
                                                  isSelected={gameSelected === index}
                                                  select={() => handleOnSelect(index)}/>
                                )}
                            </div>
                        </div>
                    }
                    {/*<TicTacToeOnline room={room} socket={socket} user={user}/>*/}
                </div>
                {/*<div>*/}
                {/*    <p>current users: {currentUsers.join(', ')}</p>*/}
                {/*    <input value={text} onChange={event => setText(event.target.value)}/>*/}
                {/*    <button onClick={handleClick}>send</button>*/}
                {/*    {*/}
                {/*        messages.map((message, id) => <p key={id}>{message.sender}: {message.text}</p>)*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default Room;
