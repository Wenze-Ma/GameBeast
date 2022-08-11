import {ToastContainer} from "react-toastify";
import Utilities from "./Utilities";

const MyToastContainer = () => {
    return <ToastContainer autoClose={1000} theme={Utilities.isDarkMode ? 'dark' : 'light'} closeOnClick
                           pauseOnHover newestOnTop={false} draggable pauseOnFocusLoss rtl={false} hideProgressBar/>;
};

export default MyToastContainer;
