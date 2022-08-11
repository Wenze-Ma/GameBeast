import Utilities from "../../Utilities/Utilities";

const SignOutModal = ({modalRef, setModalOpen}) => {
    const handleOnLeave = () => {

    }
    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title' style={Utilities.isDarkMode ? {color: 'white'} : {}}>Are you sure to sign out?</h3>
            <span>Since you are playing online games, you will be redirected to home page after you sign out.</span>
            <div className='modal-button-wrapper' style={{marginBottom: '2rem', justifyContent: 'flex-end'}}>
                <button className='btn btn-secondary modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={() => setModalOpen(false)}>Cancel
                </button>
                <button className='btn btn-danger modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={handleOnLeave}>Leave
                </button>
            </div>
        </div>
    );
};

export default SignOutModal;
