import axios from "axios";
import {server} from "../config";


const RoomService = {
    getAllRooms: (setRooms) => {
        axios.get(`${server}/rooms/all`)
            .then(response => {
                setRooms(response.data.rooms);
            })
    },
    createRooms: (_id, roomName, capacity, description) => {
        const room = {
            _id: _id,
            roomName: roomName,
            capacity: capacity,
            description: description,
        };
        return axios.post(`${server}/rooms/create`, room);
    }
}

export default RoomService;
