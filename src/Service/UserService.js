import axios from "axios";
import {server} from "../config";
import Utilities from "../Utilities/Utilities";
import Cookies from 'js-cookie';

const UserService = {
    signUp: (values, setUser, setIsModalOpen) => {
        const user = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
        };
        axios.post(`${server}/users/signup`, user)
            .then(response => {
                if (response.data.existed) {
                    console.log('existed');
                } else {
                    console.log('registered');
                    setUser(response.data.user);
                    Cookies.set('game_on_star_cookie', response.data.cookie);
                    setIsModalOpen(false);
                }
            });
    },
    signIn: (values, setUser, setIsModalOpen) => {
        const user = {
            email: values.email,
            password: values.password,
        };
        axios.post(`${server}/users/signin`, user)
            .then(response => {
                if (response.data.success) {
                    console.log('success');
                    setUser(response.data.user);
                    Utilities.currentUser = response.data.user;
                    Cookies.set('game_on_star_cookie', response.data.cookie);
                    setIsModalOpen(false);
                } else {
                    console.log('failed');
                }
            });
    },
    thirdPartySignIn: (values, setUser, setIsModalOpen) => {
        const user = {
            email: values.email,
            thirdParty: true,
            firstName: values.firstName,
            lastName: values.lastName,
        };
        axios.post(`${server}/users/signup`, user)
            .then(response => {
                if (response.data.success || response.data.existed) {
                    console.log('success third party');
                    setUser(response.data.user);
                    Utilities.currentUser = response.data.user;
                    Cookies.set('game_on_star_cookie', response.data.cookie);
                    setIsModalOpen(false);
                } else {
                    console.log('failed third party');
                }
            })
    },
    getUserByCookie: (cookie) => {
        return axios.post(`${server}/users/user`, {cookie: cookie})
            .then(response => {
                if (response.data.success) {
                    return response.data.user;
                }
                return null;
            })
    },
    signOut: () => {
        return axios.post(`${server}/users/signout`, {cookie: Cookies.get('game_on_star_cookie')})
    }
}

export default UserService;
