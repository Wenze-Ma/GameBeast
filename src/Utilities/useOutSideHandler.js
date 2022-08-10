import {useEffect} from "react";

export const useOutsideHandler = (ref, toExpand, setToExpand) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && toExpand) {
                setToExpand(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setToExpand, toExpand]);
}
