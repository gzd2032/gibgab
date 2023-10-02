import { io } from "socket.io-client";

const URL: string = process.env.NODE_ENV === 'production' ? 'https://gibgab-server.onrender.com' : 'ws://localhost:8000'

export const socket = io(URL, {
    autoConnect: false
});
