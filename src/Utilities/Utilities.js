class Utilities {
    static isDarkMode = false;

    static toggleDarkMode(setDummy, dummy) {
        Utilities.isDarkMode = !Utilities.isDarkMode;
        localStorage.setItem('isDarkMode', Utilities.isDarkMode.toString());
        setDummy(dummy + 1);
    }
}

export default Utilities;
