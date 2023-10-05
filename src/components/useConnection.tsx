import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface Props {
    socket: Socket,
    username: string,
}

export default function useConnections ({socket, username}: Props) {
    const [connectionStatus, setConnectionStatus] = useState(false);

    useEffect(() => {
        const onConnect = () => {
          setConnectionStatus(true);
        };
    
        const onDisconnect = () => {
          setConnectionStatus(false);
        };
    
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
    
        return () => {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
        };
      }, []);

      const connect = (username: string) => {
        if (username === "") return alert("Please enter a username");
    
        if (!connectionStatus) {
          socket.connect();
          socket.emit("join user", username);
        }
      };
    
      const disconnect = () => {
        socket.disconnect();
      };

    return {connectionStatus, connect, disconnect}
}