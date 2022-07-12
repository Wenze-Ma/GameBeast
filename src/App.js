import Header from "./components/Navigation/Header";
import Utilities from "./Utilities/Utilities";
import {useState} from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Games from "./Pages/Games";
import Categories from "./Pages/Categories";

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
                <Route path='/games' element={<Games/>}/>
                <Route path='/categories' element={<Categories/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
