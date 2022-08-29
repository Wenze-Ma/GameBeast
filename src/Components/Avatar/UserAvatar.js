import './avatar.css';
import {useEffect, useState} from "react";
import UserService from "../../Service/UserService";
import {STATUS} from "../../Pages/Room";

const UserAvatar = ({email, status}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        UserService.getUserByEmail(email)
            .then(response => setUser(response.data.user));
    }, [email]);
    const style = status === STATUS.HOST ? 'btn-primary' : (status === STATUS.PREPARE ? 'btn-warning' : (status === STATUS.READY ? 'btn-ready' : 'btn-secondary'));
    return (
        <div className='user-box'>
            <div className='user-info-container'>
                <div className='avatar'>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</div>
                <div className='user-name'>{user?.firstName || user?.lastName || user?.email || 'N/A'}</div>
            </div>
            <span className={`user-tag text-gradient ${style}`}>{status}</span>
        </div>
    );
};

export default UserAvatar;
