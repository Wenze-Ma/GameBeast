import jwtDecode from "jwt-decode";
import {useEffect} from "react";
import UserService from "../../Service/UserService";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";


const handleCallbackResponse = (response, setUser, setIsModalOpen) => {
    const userObject = jwtDecode(response.credential);
    UserService.thirdPartySignIn({
        email: userObject.email,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
    }, setUser, setIsModalOpen);
}

const googleSuccess = (response, setUser, setIsModalOpen) => {
    const userObject = jwtDecode(response.credential);
    UserService.thirdPartySignIn({
        email: userObject.email,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
    }, setUser, setIsModalOpen);
}


const MyGoogleLogin = ({setUser, setIsModalOpen}) => {
    // useEffect(() => {
    //     /* global google */
    //     if (typeof google === "undefined") return;
    //     google.accounts.id.initialize({
    //         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    //         callback: response => handleCallbackResponse(response, setUser, setIsModalOpen)
    //     });
    //     google.accounts.id.renderButton(
    //         document.getElementById('signInDiv'),
    //         {theme: 'filled_blue', size: 'large', width: '250'}
    //     )
    // }, [setUser]);

    return (
        // <div id='signInDiv'>
            <GoogleOAuthProvider clientId='23469379019-hp3u32a40857ijk6p575jd99kfe7omfq.apps.googleusercontent.com'>
                <GoogleLogin
                    onSuccess={(response) => googleSuccess(response, setUser, setIsModalOpen)}
                    onFailure={googleSuccess}
                />
            </GoogleOAuthProvider>
         // </div>
    );
}

export default MyGoogleLogin;
