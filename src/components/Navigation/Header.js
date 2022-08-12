import './header.css'
import Utilities from "../../Utilities/Utilities";
import DarkModeSwitch from "../../Utilities/DarkModeSwitch";
import {useLocation, useNavigate} from "react-router-dom";
import {
    Search,
    SearchIconWrapper,
    SearchIconWrapperEnd, SearchMobile,
    StyledInputBase,
} from "../../Utilities/Search";
import {CloseIcon, MenuIcon, SearchIcon} from "../../Images/Icons/Icons";
import {useEffect, useRef, useState} from "react";
import {Divider} from "@mui/material";
import SignUpModal from "../Modals/SignUpModal";
import SignInModal from "../Modals/SignInModal";
import UserService from "../../Service/UserService";
import Cookies from 'js-cookie';
import {useOutsideHandler} from "../../Utilities/useOutSideHandler";
import {toast} from "react-toastify";
import MyToastContainer from "../../Utilities/MyToastContainer";


const Header = ({notify, dummy}) => {

    const navigate = useNavigate();
    const handleChange = () => {
        Utilities.toggleDarkMode(notify, dummy);
    }
    const [toExpand, setToExpand] = useState(false);
    const [profileExpand, setProfileExpand] = useState(false);
    const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const modalRef = useRef(null);
    const profileRef = useRef(null);
    const [user, setUser] = useState(null);
    useOutsideHandler(wrapperRef, toExpand, setToExpand);
    useOutsideHandler(modalRef, isModalOpen, setIsModalOpen);
    useOutsideHandler(profileRef, profileExpand, setProfileExpand);
    const gamesSelector = {
        width: '92px',
        left: 'calc(123px + 8%)',
        display: 'block',
    };
    const categoriesSelector = {
        width: '100px',
        left: 'calc(215px + 8%)',
        display: 'block',
    };
    const onlineSelector = {
        width: '96px',
        left: 'calc(318px + 8%)',
        display: 'block',
    }
    const url = window.location.href.split('/');

    let styles;

    if (url[url.length - 1] === 'games') {
        styles = gamesSelector;
    } else if (url[url.length - 1] === 'categories') {
        styles = categoriesSelector;
    } else if (url[url.length - 1] === 'online' && user) {
        styles = onlineSelector;
    } else {
        styles = {};
    }

    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(response => {
                setUser(response);
                Utilities.currentUser = response;
            });
    }, []);

    const onMobileSearch = () => {
        setIsMobileSearchFocused(true);
        const timeout = setTimeout(() => {
            inputRef.current.focus();
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    }

    const handleSignUp = (isSignUp) => {
        setIsModalOpen(true);
        setIsSignUp(isSignUp);
    }

    const handleSignOut = () => {
        setToExpand(false);
        setProfileExpand(false);
        if (url.includes('online') && url[url.length - 1] !== 'online') {
            toast.info('You are in an online game. Please leave the room first.');
            return;
        }
        UserService.signOut().then(() => {
            toast.info('Sign Out Succeeded');
            Cookies.remove('game_on_star_cookie');
            setUser(null);
            if (url.includes('online')) {
                navigate('/');
            }
        });
    }

    return (
        <div ref={wrapperRef}>
            <MyToastContainer/>
            <div className={`header ${Utilities.isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className='title' style={{display: isMobileSearchFocused ? 'none' : 'flex'}}>
                    <div className='menu-icon' onClick={() => setToExpand(!toExpand)}>
                        {toExpand ? <CloseIcon/> : <MenuIcon/>}
                    </div>
                    <h3 onClick={() => navigate('/')}>Game On Star</h3>
                </div>
                <div className='tabs'>
                    <p className='tab' onClick={() => navigate('/games')}>All Games</p>
                    <p className='tab' onClick={() => navigate('/categories')}>Categories</p>
                    <p className='tab' onClick={() => {
                        if (user) navigate('/online');
                        else toast.info('Please log in first');
                    }}>Play Online</p>
                    <div className='selected' style={styles}/>
                </div>
                <div className='control' style={{display: isMobileSearchFocused ? 'none' : 'flex'}}>
                    <Search className='search'>
                        <SearchIconWrapper sx={{zIndex: 1}}>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <div className='search-icon' onClick={onMobileSearch}>
                        <SearchIcon/>
                    </div>
                    <DarkModeSwitch sx={{m: 1}} checked={Utilities.isDarkMode} onChange={handleChange}/>
                    {/*<button className='btn btn-secondary button-sign-up'>Log In</button>*/}
                    <div className='button-sign-up'>
                        <button
                            className='btn btn-primary '
                            onClick={() => handleSignUp(true)}
                            style={{display: user ? 'none' : 'block'}}
                        >
                            Sign Up
                        </button>
                        <div className='avatar' style={{display: user ? 'flex' : 'none'}} onClick={() => {
                            setToExpand(false);
                            setProfileExpand(true)
                        }}>
                            <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                        </div>
                    </div>


                </div>
                <div className='search-mobile' style={{
                    display: isMobileSearchFocused ? 'flex' : 'none',
                    marginLeft: 10,
                    marginRight: 10,
                    width: '100%'
                }}>
                    <SearchMobile>
                        <SearchIconWrapper sx={{zIndex: 1}}>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                            inputRef={inputRef}
                            onBlur={() => setIsMobileSearchFocused(false)}
                            onKeyDown={e => {
                                if (e.key === 'Escape') {
                                    setIsMobileSearchFocused(false);
                                }
                            }}
                        />
                        <SearchIconWrapperEnd sx={{zIndex: 1}}>
                            <div className='escape'>
                                Esc
                            </div>
                        </SearchIconWrapperEnd>
                    </SearchMobile>
                </div>
                <div className={`nav-list ${Utilities.isDarkMode ? 'dark-mode2' : 'light-mode'}`}
                     style={{maxHeight: toExpand ? '500px' : 0}}>
                    <div className='tabs-mobile'>
                        <p className='tab-mobile' onClick={() => {
                            setToExpand(false);
                            navigate('/games');
                        }}>All Games</p>
                        <p className='tab-mobile' onClick={() => {
                            setToExpand(false);
                            navigate('/categories');
                        }}>Categories</p>
                        <p className='tab-mobile' onClick={() => {
                            if (user) {
                                setToExpand(false);
                                navigate('/online');
                            } else {
                                toast.info('Please log in first');
                            }
                        }}>Play Online</p>
                    </div>
                    <div className='divider'>
                        <Divider variant='fullWidth' color={Utilities.isDarkMode ? 'white' : '#E0E0E0'}/>
                    </div>
                    <div className='button-mobile' style={user ? {display: 'none'} : {}}>
                        <button className='btn btn-secondary' onClick={() => handleSignUp(false)}>
                            Sign In
                        </button>
                        <button className='btn btn-primary' onClick={() => handleSignUp(true)}>
                            Sign Up
                        </button>
                    </div>
                    <div className='profile-mobile' style={!user ? {display: 'none'} : {}}>
                        <div className='tab-mobile'>
                            <span>View My Profile</span>
                            <div className='avatar'>
                                <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                            </div>
                        </div>
                        <div className='tab-mobile'>
                            <span>Settings</span>
                        </div>
                        <div className='tab-mobile sign-out-mobile' onClick={handleSignOut}>
                            <span>Sign Out</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`profile-container ${Utilities.isDarkMode ? 'dark-mode2' : 'light-mode'}`} style={{display: profileExpand ? 'block' : 'none'}} ref={profileRef}>
                <div className='tab-mobile'>
                    <span>Profile</span>
                </div>
                <div className='tab-mobile'>
                    <span>Settings</span>
                </div>
                <div className='tab-mobile sign-out-mobile' onClick={handleSignOut}>
                    <span>Sign Out</span>
                </div>
            </div>
            <div className='modal-container' style={isModalOpen ? {display: 'block'} : {}}>
                {isSignUp ?
                    <SignUpModal modalRef={modalRef} setIsSignUp={setIsSignUp} setUser={setUser}
                                 setIsModelOpen={setIsModalOpen}/> :
                    <SignInModal modalRef={modalRef} setIsSignUp={setIsSignUp} setUser={setUser}
                                 setIsModalOpen={setIsModalOpen}/>
                }
            </div>
        </div>

    );
};

export default Header;
