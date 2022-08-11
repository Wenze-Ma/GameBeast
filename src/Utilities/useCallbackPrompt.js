import {useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useBlocker} from "./useBlocker";
import RoomService from "../Service/RoomService";

export const useCallbackPrompt = (when, user, room) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPrompt, setShowPrompt] = useState(false);
    const [lastLocation, setLastLocation] = useState(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    const cancelNavigation = useCallback(() => {
        setShowPrompt(false);
    }, []);

    const handleBlockedNavigation = useCallback(nextLocation => {
        if (!confirmedNavigation && nextLocation.location.pathname !== location.pathname) {
            setShowPrompt(true);
            setLastLocation(nextLocation);
            return false;
        }
        return true;
    }, [confirmedNavigation, location.pathname]);

    const confirmNavigation = useCallback(() => {
        setShowPrompt(false);
        setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            navigate(lastLocation.location.pathname);
        }
    }, [confirmedNavigation, lastLocation, navigate]);

    useBlocker(handleBlockedNavigation, when);

    return [showPrompt, setShowPrompt, confirmNavigation, cancelNavigation];
}
