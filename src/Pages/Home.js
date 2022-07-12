import Utilities from "../Utilities/Utilities";

const Home = () => {
    return (
        <div style={{backgroundColor: Utilities.isDarkMode ? '#011E3C' : 'white', width: '100%', height: '200vh', marginTop: '64px'}}>
            Hello
        </div>
    );
}

export default Home;
