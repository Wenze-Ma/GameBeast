import Utilities from "../Utilities/Utilities";

const Home = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            Welcome! Check <a href='/games'>all games</a>
        </div>
    );
}

export default Home;
