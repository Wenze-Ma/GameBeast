import Utilities from "../../Utilities/Utilities";
import './modals.css'
import {Divider} from "@mui/material";
import MyGoogleLogin from "../Authentication/MyGoogleLogin";
import {useState} from "react";
import {EyeCloseIcon, EyeOpenIcon} from "../../Images/Icons/Icons";
import UserService from "../../Service/UserService";

const capitalize = word => {
    return word[0].toUpperCase() + word.slice(1);
}

const SignUpModal = ({modalRef, setIsSignUp, setUser, setIsModelOpen}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [eyeOpen, setEyeOpen] = useState(false);

    const handleOnSubmit = (event) => {
        event.preventDefault();
        UserService.signUp({
            email: email,
            firstName: capitalize(firstName),
            lastName: capitalize(lastName),
            password: password1,
        }, setUser, setIsModelOpen);
    }

    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title btn-primary text-gradient'>Register a New Account</h3>
            <div className='modal-form'>
                <form id='signUpForm' onSubmit={handleOnSubmit}>
                    <label>First Name</label>
                    <div className='input-group'>
                        <input type='text' placeholder='First Name' aria-label='First Name' className='form-control'
                               required value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
                    </div>
                    <label>Last Name</label>
                    <div className='input-group'>
                        <input type='text' placeholder='Last Name' aria-label='Last Name' className='form-control'
                               required value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                    </div>
                    <label>Email</label>
                    <div className='input-group'>
                        <input type='email' placeholder='Email' aria-label='Email' className='form-control'
                               required value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </div>
                    <label>Password</label>
                    <div className='input-group' >
                        <input type={eyeOpen ? 'text' : 'password'} placeholder='Password' aria-label='Password'
                               className='form-control' required name='password1'
                               value={password1} onChange={(event) => setPassword1(event.target.value)}/>
                        <div className='icon-wrapper' onClick={() => setEyeOpen(!eyeOpen)}>{eyeOpen ? <EyeCloseIcon/> : <EyeOpenIcon/>}</div>
                    </div>
                    {/*<label>Confirm Password</label>*/}
                    {/*<div className='input-group'>*/}
                    {/*    <input type='password' placeholder='Confirm Password' aria-label='Password'*/}
                    {/*           className='form-control' required name='password2'*/}
                    {/*           value={password2} onChange={(event) => setPassword2(event.target.value)}/>*/}
                    {/*</div>*/}
                </form>
            </div>
            <div className='modal-button-wrapper'>
                <button className='btn btn-primary modal-button' form='signUpForm' type='submit'>SIGN UP</button>
            </div>
            <div className='modal-footer'>
                <p>
                    Already have an account?
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className='btn-info text-gradient' onClick={() => setIsSignUp(false)}> Sign in</a>
                </p>
            </div>
            <Divider className='modal-divider'>Other Options</Divider>
            <div className='modal-button-wrapper'>
                {/*<button className='btn btn-google modal-button button-logo' id='google-button'>*/}
                {/*    <div className='logo-wrapper'>*/}
                {/*        <GoogleIcon/>*/}
                {/*    </div>*/}
                {/*    <span>continue with google</span>*/}
                {/*</button>*/}
                <MyGoogleLogin setUser={setUser} setIsModalOpen={setIsModelOpen}/>

            </div>
        </div>
    );
}

export default SignUpModal;
