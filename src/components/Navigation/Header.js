import './header.css'
import Utilities from "../../Utilities/Utilities";
import {useState} from "react";
import DarkModeSwitch from "../../Utilities/DarkModeSwitch";


const Header = ({notify}) => {
    const [dummy, setDummy] = useState(0);

    const handleChange = () => {
        Utilities.toggleDarkMode();
        setDummy(dummy + 1);
        notify(dummy + 1);
    }

    return (
        <div className={`header ${Utilities.isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h3 className='title'>Game On Star</h3>
            <div className='control'>
                <DarkModeSwitch sx={{m: 1}} defaultChecked onChange={handleChange}/>
            </div>
        </div>
    );
};

export default Header;
