import axios from "axios";
import {server} from "../config";
import Utilities from "../Utilities/Utilities";
import Cookies from 'js-cookie';
import {toast} from "react-toastify";

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
                    toast.error('This email is already registered');
                } else {
                    toast.success('Sign up succeeded and you have been logged in');
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
                    toast.success('Log in succeeded');
                    setUser(response.data.user);
                    Utilities.currentUser = response.data.user;
                    Cookies.set('game_on_star_cookie', response.data.cookie);
                    setIsModalOpen(false);
                } else {
                    toast.error('Wrong credentials');
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
                    toast.success('Log in succeeded');
                    setUser(response.data.user);
                    Utilities.currentUser = response.data.user;
                    Cookies.set('game_on_star_cookie', response.data.cookie);
                    setIsModalOpen(false);
                } else {
                    toast.error('Log in failed');
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
    },
    getUserByEmail: (email) => {
        return axios.get(`${server}/users/get/${email}`);
    }
}

export default UserService;
