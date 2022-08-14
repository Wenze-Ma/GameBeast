import './avatar.css';
import {useEffect, useState} from "react";
import UserService from "../../Service/UserService";

const UserAvatar = ({email}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        UserService.getUserByEmail(email)
            .then(response => setUser(response.data.user));
    }, [email])
    return (
        <div className='user-container'>
            <div className='avatar user-avatar'>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</div>
            <span className='user-name'>{user?.firstName || user?.lastName || user?.email || 'N/A'}</span>
        </div>
    );
};

export default UserAvatar;
