import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { Str } from "../../common"

export default function useSocket() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = SocketIOClient(Str.apiUrl);
        setSocket(socket);

        return () => {
            socket.close();
        };
    }, []);

    return socket;
}
