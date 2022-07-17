import jwtDecode from "jwt-decode";
import {useEffect} from "react";
import UserService from "../../Service/UserService";


const handleCallbackResponse = (response, setUser) => {
    const userObject = jwtDecode(response.credential);
    UserService.thirdPartySignIn({
        email: userObject.email,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
    }, setUser);
}

const GoogleLogin = ({setUser}) => {
    useEffect(() => {
        /* global google */
        if (typeof google === "undefined") return;
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: response => handleCallbackResponse(response, setUser)
        });
        google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            {theme: 'filled_blue', size: 'large', width: '250'}
        )
    }, [setUser]);

    return (
        <div id='signInDiv'></div>
    );
}

export default GoogleLogin;
