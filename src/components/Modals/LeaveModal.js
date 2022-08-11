import Utilities from "../../Utilities/Utilities";

const LeaveModal = ({cancelNavigation, confirmNavigation, modalRef, isHost, onLeaveRoom}) => {
    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title' style={Utilities.isDarkMode ? {color: 'white'} : {}}>Are you sure to leave?</h3>
            {!isHost ? null:
                <span style={Utilities.isDarkMode ? {color: 'white'} : {}}>Since you are the host, the room will be dismissed after you leave.</span>
            }
            <div className='modal-button-wrapper' style={{marginBottom: '2rem', justifyContent: 'flex-end'}}>
                <button className='btn btn-secondary modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={cancelNavigation}>Cancel
                </button>
                <button className='btn btn-danger modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={() => {
                            confirmNavigation();
                            onLeaveRoom();
                        }}>Leave
                </button>
            </div>
        </div>
    );
}

export default LeaveModal;
