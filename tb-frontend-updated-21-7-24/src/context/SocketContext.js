import React, { createContext, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    useEffect(() => {
        const socket = io(`${process.env.REACT_APP_SERVER_URI}`);
        return () => socket.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={{}}>
            {children}
        </SocketContext.Provider>
    );
};
