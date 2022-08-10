import Utilities from "../../Utilities/Utilities";
import './modals.css'
import {Divider} from "@mui/material";
import MyGoogleLogin from "../Authentication/MyGoogleLogin";
import {useState} from "react";
import {EyeCloseIcon, EyeOpenIcon} from "../../Images/Icons/Icons";
import UserService from "../../Service/UserService";

const SignInModal = ({modalRef, setIsSignUp, setUser, setIsModalOpen}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [eyeOpen, setEyeOpen] = useState(false);

    const handleOnSubmit = (event) => {
        event.preventDefault();
        UserService.signIn({
            email: email,
            password: password,
        }, setUser, setIsModalOpen);
    }

    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title btn-info text-gradient'>Welcome Back</h3>
            <div className='modal-form'>
                <form id='signInForm' onSubmit={handleOnSubmit}>
                    <label>Email</label>
                    <div className='input-group'>
                        <input type='email' placeholder='Email' aria-label='Email' className='form-control'
                               required value={email} onChange={event => setEmail(event.target.value)}/>
                    </div>
                    <label>Password</label>
                    <div className='input-group'>
                        <input type={eyeOpen ? 'text' : 'password'} placeholder='Password' aria-label='Password'
                               className='form-control' required value={password}
                               onChange={(event) => setPassword(event.target.value)}/>
                        <div className='icon-wrapper' onClick={() => setEyeOpen(!eyeOpen)}>{eyeOpen ? <EyeCloseIcon/> :
                            <EyeOpenIcon/>}</div>
                    </div>
                </form>
            </div>
            <div className='modal-button-wrapper'>
                <button className='btn btn-info modal-button' form='signInForm' type='submit'>SIGN IN</button>
            </div>
            <div className='modal-footer'>
                <p>
                    Don't have an account?
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className='btn-primary text-gradient' onClick={() => setIsSignUp(true)}> Sign up</a>
                </p>
            </div>
            <Divider className='modal-divider'>Other Options</Divider>
            <div className='modal-button-wrapper'>
                {/*<button className='btn btn-google modal-button button-logo'>*/}
                {/*    <div className='logo-wrapper'>*/}
                {/*        <GoogleIcon/>*/}
                {/*    </div>*/}
                {/*    <span>continue with google</span>*/}
                {/*</button>*/}
                <MyGoogleLogin setUser={setUser} setIsModalOpen={setIsModalOpen}/>
            </div>
        </div>
    );
}

export default SignInModal;
