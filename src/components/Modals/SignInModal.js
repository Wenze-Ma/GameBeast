import Utilities from "../../Utilities/Utilities";
import './modals.css'
import {Divider} from "@mui/material";
import GoogleLogin from "../Authentication/GoogleLogin";
import {useState} from "react";

const SignInModal = ({modalRef, setIsSignUp}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleOnSubmit = (event) => {
        event.preventDefault();
        console.log(email, password);
    }

    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title btn-info text-gradient'>Welcome Back</h3>
            <div className='modal-form'>
                <form id='signInForm' onSubmit={handleOnSubmit}>
                    <label>Email</label>
                    <div className='input-group'>
                        <input type='email' placeholder='Email' aria-label='Email' className='form-control'
                               required value={email} onChange={event => {
                            setEmail(event.target.value)
                        }}/>
                    </div>
                    <label>Password</label>
                    <div className='input-group'>
                        <input type='password' placeholder='Password' aria-label='Password'
                               className='form-control' required value={password} onChange={event => {
                            setPassword(event.target.value)
                        }}/>

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
                <GoogleLogin/>
            </div>
        </div>
    );
}

export default SignInModal;
