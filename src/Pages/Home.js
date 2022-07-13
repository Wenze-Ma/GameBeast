import Utilities from "../Utilities/Utilities";

const Home = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            Hello
        </div>
    );
}

export default Home;
