import Utilities from "../../Utilities/Utilities";

const LeaveModal = ({cancelNavigation, confirmNavigation, modalRef, room, user}) => {
    return (
        <div className={`modal ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`} ref={modalRef}>
            <h3 className='modal-title' style={Utilities.isDarkMode ? {color: 'white'} : {}}>Are you sure to leave?</h3>
            {room?.members.length === 1 ?
                <span style={Utilities.isDarkMode ? {color: 'white'} : {}}>Since you are the last player, the room will be dismissed after you leave.</span> :
                room?.host === user?.email ?
                    <span style={Utilities.isDarkMode ? {color: 'white'} : {}}>Since you are the host, the ownership will be transferred to the next player after you leave.</span> :
                    null
            }
            <div className='modal-button-wrapper' style={{marginBottom: '2rem', justifyContent: 'flex-end'}}>
                <button className='btn btn-secondary modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={cancelNavigation}>Cancel
                </button>
                <button className='btn btn-danger modal-button' style={{width: '100px', margin: '0 10px'}}
                        onClick={confirmNavigation}>Leave
                </button>
            </div>
        </div>
    );
}

export default LeaveModal;
