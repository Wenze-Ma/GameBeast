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
import TicTacToe from "./Games/TicTacToe/TicTacToe";
import TicTacToeOnline from "./Games/TicTacToe/TicTacToeOnline";
import {ArrowLeft} from "../Images/Icons/Icons";
import Wordle from "./Games/Wordle/Wordle";

export const STATUS = {
    HOST: 'HOST',
    PREPARE: 'PREPARING...',
    READY: 'READY',
    WATCH: 'WATCHING...',
}

const getOnlineGame = (gameSelected, room, socket, user, usersReady) => {
    switch (gameSelected) {
        case 0:
            return <TicTacToeOnline room={room} socket={socket} user={user} usersReady={usersReady}/>
        case 1:
            return <Wordle isOnline={true} room={room} socket={socket} user={user} usersReady={usersReady}/>
        default:
            return null
    }
}

const Room = () => {
    const params = useParams();
    const socket = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [room, setRoom] = useState(null);
    const modalRef = useRef(null);
    const [gameSelected, setGameSelected] = useState(0);
    const [showPrompt, setShowPrompt] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    useOutsideHandler(modalRef, showPrompt, setShowPrompt);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [showUsers, setShowUsers] = useState(true);
    const [usersReady, setUsersReady] = useState([]);
    const [usersWatching, setUsersWatching] = useState([]);
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
                    if (socket.current) {
                        socket.current.disconnect();
                    }
                } else {
                    setRoom(response.data.room);
                    setGameSelected(response.data.room.gameSelected);
                    setGameStarted(response.data.room.gameStarted);
                    setUsersWatching(response.data.room.watchers);
                    setUsersReady(response.data.room.usersReady);
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
                if (usersReady.includes(userId)) {
                    setUsersReady(usersReady.filter(u => u !== userId));
                    setShowUsers(true);
                }
                if (usersWatching.includes(userId)) {
                    setUsersWatching(usersWatching.filter(u => u !== userId));
                }
                setCurrentUsers(currentUsers.filter(current => current !== userId));
            });
            socket.current.on('game-select', index => {
                setGameSelected(index);
            });
            socket.current.on('game-start', () => {
                setGameStarted(true);
                setShowUsers(false);
            });
            socket.current.on('end-game', (winner, target) => {
                toast.info(winner ? "The winner is " + winner +"!" : "Tie game!");
                if (target) {
                    toast.info('The word is ' + target);
                }
                setGameStarted(false);
                setUsersReady([room.host]);
                setShowUsers(true);
            });
            socket.current.on('ready', userId => {
                if (usersReady.includes(userId)) {
                    setUsersReady(usersReady.filter(u => u !== userId));
                } else {
                    setUsersReady([...usersReady, userId]);
                }
            });
            socket.current.on('watch', userId => {
                if (usersReady.includes(userId)) {
                    setUsersReady(usersReady.filter(u => u !== userId));
                }
                if (usersWatching.includes(userId)) {
                    setUsersWatching(usersWatching.filter(u => u !== userId));
                } else {
                    setUsersWatching([...usersWatching, userId]);
                }
            });
            return () => {
                socket.current.off('receive-message');
                socket.current.off('join-room');
                socket.current.off('leave-room');
                socket.current.off('game-select');
                socket.current.off('game-start');
                socket.current.off('tic-tac-toe-place-chess');
                socket.current.off('end-game');
                socket.current.off('ready');
                socket.current.off('watch');
                socket.current.off('wordle-send-word');
                socket.current.off('wordle-pick-target');
                socket.current.off('wordle-fail');
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
                if (usersReady.length + usersWatching.length < room.members.length) {
                    toast.info('Please wait for all users to get ready!');
                } else if (usersReady.length < allGames[gameSelected].requiredPlayerNumber[0] || usersReady.length > allGames[gameSelected].requiredPlayerNumber[1]) {
                    const requiredNumber = allGames[gameSelected].requiredPlayerNumber;
                    const number = requiredNumber[0] === requiredNumber[1] ? requiredNumber[0] : `${requiredNumber[0]} - ${requiredNumber[1]}`;
                    toast.info('This game requires ' + number + ' players');
                } else {
                    RoomService.startGame(room._id, allGames[gameSelected].gameData)
                        .then(response => {
                            if (response.data.success) {
                                socket.current.emit('game-start', room._id);
                            }
                        });
                }
            } else {
                RoomService.getReady(room._id, user.email)
                    .then(_ => socket.current.emit('ready', room._id, user.email));
            }
        }
    }

    const handleOnWatch = () => {
        if (socket.current && room && user) {
            if (user.email !== room.host) {
                setUsersReady(usersReady.filter(u => u !== user.email));
                RoomService.watchGame(room._id, user.email)
                    .then(_ => socket.current.emit('watch', room._id, user.email));
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
                <div className='users-container' style={{maxWidth: showUsers ? 1000 : 0}}>
                    <div className='arrow' onClick={() => setShowUsers(!showUsers)}>
                        <ArrowLeft showUsers={showUsers}/>
                    </div>
                    <div className='users-wrapper'>
                        <div className='users'>
                            {currentUsers.map(current => <UserAvatar email={current} key={current}
                                                                     status={current === room?.host ? STATUS.HOST :
                                                                         (usersWatching.includes(current) ? STATUS.WATCH :
                                                                             (usersReady.includes(current) ? STATUS.READY : STATUS.PREPARE))}/>)}
                        </div>
                        <div className='control-container'>
                            <button className='btn btn-secondary' onClick={() => setShowPrompt(true)}>
                                Leave Room
                            </button>
                            <button className='btn btn-warning'
                                    style={{marginLeft: 20, display: gameStarted || room?.host === user?.email ? 'none' : 'inline-block'}}
                                    onClick={handleOnWatch}
                            >
                                {usersWatching.includes(user?.email) ? 'Join' : 'Watch'} Game
                            </button>
                        </div>
                    </div>
                </div>
                {gameStarted ? getOnlineGame(gameSelected, room, socket, user, usersReady) :
                    <div className='game-selection-container'>
                        <div className='game-card-container'>
                            <div className='arrow-container'
                                 onClick={() => handleOnSelect(gameSelected === 0 ? allGames.length - 1 : gameSelected - 1)}>
                                <ArrowLeft showUsers={true}/>
                            </div>
                            <GameCardMini game={allGames[gameSelected]}/>
                            <div className='arrow-container'
                                 onClick={() => handleOnSelect(gameSelected === allGames.length - 1 ? 0 : gameSelected + 1)}>
                                <ArrowLeft showUsers={false}/>
                            </div>
                        </div>
                        <div className='game-info'>
                            Game settings...
                        </div>
                        <div className='game-control'
                             style={{display: usersWatching.includes(user?.email) ? 'none' : 'flex'}}>
                            <button
                                className={`btn ${(user?.email === room?.host || !usersReady.includes(user?.email)) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{marginLeft: 20, display: gameStarted ? 'none' : 'inline-block'}}
                                onClick={handleOnStart}
                            >
                                {user?.email === room?.host ? 'Start Game' : (usersReady.includes(user?.email) ? 'Unready' : 'Ready')}
                            </button>
                        </div>
                    </div>
                }

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
