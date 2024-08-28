import io from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SERVER_URI}`);

export const receiveMessage = (callback) => {
    socket.on('receiveMessage', callback);
};

export const removeReceiveMessageListener = () => {
    socket.off('receiveMessage');
};

export default socket;