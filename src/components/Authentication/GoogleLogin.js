import jwtDecode from "jwt-decode";
import {useEffect} from "react";

const handleCallbackResponse = (response) => {
    console.log(response.credential)
    const userObject = jwtDecode(response.credential);
    console.log(userObject);
}

const GoogleLogin = () => {
    useEffect(() => {
        /* global google */
        if (typeof google === "undefined") return;
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        });
        google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            {theme: 'filled_blue', size: 'large', width: '250'}
        )
    }, []);

    return (
        <div id='signInDiv'></div>
    );
}

export default GoogleLogin;
