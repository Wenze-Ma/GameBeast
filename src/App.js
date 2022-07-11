import Header from "./components/Navigation/Header";
import Utilities from "./Utilities/Utilities";
import {useState} from "react";

function App() {
    const [, setDummy] = useState(0);
    return (
        <div className="App">
            <Header notify={setDummy}/>
            <div style={{backgroundColor: Utilities.isDarkMode ? 'black' : 'white', width: '100vw', height: '100vh'}}>

            </div>
        </div>
    );
}

export default App;
