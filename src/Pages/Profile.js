import Utilities from "../Utilities/Utilities";
import {useEffect, useState} from "react";
import UserService from "../Service/UserService";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        UserService.getUserByCookie(Cookies.get('game_on_star_cookie'))
            .then(user => {
                if (user) {
                    setUser(user);
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                } else {
                    navigate('/');
                }
            });
    }, [navigate]);

    const handleOnSave = () => {
        if (!user) return;
        if (user.firstName === firstName && user.lastName === lastName) {
            toast.info('You haven\'t made a change!');
        }
    };

    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            <div className='profile-page-container'>
                <div className='profile-info-container'>
                    <span className='modal-title btn-primary text-gradient'>Profile</span>
                    <div className='avatar user-avatar'>
                        <img src={user?.picture || ''} alt={`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`} width='100%' height='100%'/>
                    </div>
                    <form id='profile-form'>
                        <label>Email</label>
                        <div className='input-group'>
                            <input type='email' aria-label='Email' className='form-control' disabled
                                   value={user?.email || ''}/>
                        </div>
                        <label>First Name</label>
                        <div className='input-group'>
                            <input type='text' placeholder='First Name' aria-label='fName' className='form-control'
                                   value={firstName} onChange={event => setFirstName(event.target.value)}/>
                        </div>
                        <label>Last Name</label>
                        <div className='input-group'>
                            <input type='text' placeholder='Last Name' aria-label='lName' className='form-control'
                                   value={lastName} onChange={event => setLastName(event.target.value)}/>
                        </div>
                    </form>
                    <div className='modal-button-wrapper'>
                        <button className='btn btn-primary modal-button' onClick={handleOnSave}>Save</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;
