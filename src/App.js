import Header from "./components/Navigation/Header";
import Utilities from "./Utilities/Utilities";
import {useState} from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Games from "./Pages/AllGames";
import Categories from "./Pages/Categories";
import TicTacToe from "./Pages/Games/TicTacToe";
import Online from "./Pages/Online";
import Room from "./Pages/Room";

function App() {
    const [dummy, setDummy] = useState(0);
    if (!localStorage.getItem('isDarkMode')) {
        localStorage.setItem('isDarkMode', 'false');
    } else {
        Utilities.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    }
    return (
        <BrowserRouter>
            <Header notify={setDummy} dummy={dummy}/>
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/games' element={<Games/>}/>
                <Route exact path='/categories' element={<Categories/>}/>
                <Route exact path='/games/tic-tac-toe' element={<TicTacToe/>}/>
                <Route exact path='/online' element={<Online/>}/>
                <Route exact path='/online/:roomId' element={<Room/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
