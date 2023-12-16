
import io from 'socket.io-client';

const useSocket = (server: string, roomId: string, userId: string) => {
    const socket = io(server, {
        query: { roomId, userId },
    })

    return socket
};


export default useSocket;
