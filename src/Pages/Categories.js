import Utilities from "../Utilities/Utilities";

const Categories = () => {
    return (
        <div className={`page ${Utilities.isDarkMode ? 'page-dark-mode' : 'page-light-mode'}`}>
            Categories
        </div>
    );
}

export default Categories;
