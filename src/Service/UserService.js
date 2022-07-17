import axios from "axios";
import {server} from "../config";
import Utilities from "../Utilities/Utilities";

const UserService = {
    signUp: (values, setUser) => {
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
                }
            });
    },
    signIn: (values, setUser) => {
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
                } else {
                    console.log('failed');
                }
            });
    },
    thirdPartySignIn: (values, setUser) => {
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
                } else {
                    console.log('failed third party');
                }
            })
    }
}

export default UserService;
