import express from 'express';
import { createServer } from 'http';
import { Server, type Socket } from 'socket.io';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5173'],
  },
});

// Stores the state of each room, with records for each room
const roomsState: Record<string, Record<string, unknown>> = {};

io.on('connection', (socket: Socket) => {
  console.log(`connect ${socket.id}`);

  socket.on('join-room', async (data: { roomId: string; userId: string }) => {
    const { roomId } = data;
    try {
      await socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      // Send the current state of the room to the newly joined client
      if (roomsState[roomId]) {
        socket.emit('update', { type: 'init', snapshot: { store: roomsState[roomId] } });
      } else {
        roomsState[roomId] = {}; // Initialize the room state if it doesn't exist
      }
    } catch (error) {
      console.error(`Error joining room: ${error}`);
    }
  });

  socket.on('presence', (data: { roomId: string; userId: string; presence: unknown }) => {
    const { roomId, userId, presence } = data;

    socket.broadcast.to(roomId).emit('presence', { userId, presence });
  }
  )



  socket.on('update', (data: { update: unknown; roomId: string; clientId: string }) => {
    const { update, roomId, clientId } = data;
    console.log(`Socket ${socket.id} sent update for room ${roomId}`);

    // Ensure room state is initialized
    if (!roomsState[roomId]) {
      roomsState[roomId] = {};
    }

    try {
      // const { added, updated, removed } = update.changes;

      // Merge the update into the room's state
      //Remind me to remove this shit and make it take from db instead
      // if (added?.length) {
      //   added.forEach(record => {
      //     roomsState[roomId][record.id] = record;
      //   });
      // }
      // if (updated?.length) {
      //   updated.forEach(([, to]) => {
      //     roomsState[roomId][to.id] = to;
      //   });
      // }
      // if (removed?.length) {
      //   removed.forEach(record => {
      //     delete roomsState[roomId][record.id];
      //   });
      // }


      // Broadcast the changes to all other clients in the room, except the sender
      socket.broadcast.to(roomId).emit('update', { type: 'update', update, clientId });
    } catch (err) {
      console.error(err);
      // Send recovery snapshot to the sender
      socket.emit('recovery', { snapshot: { store: roomsState[roomId] } });
    }
  });

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
    // Cleanup when a socket disconnects
    Object.keys(roomsState).forEach(roomId => {
      if (roomsState[roomId][socket.id]) {
        delete roomsState[roomId][socket.id];
        // Optionally, broadcast the change
        io.to(roomId).emit('update', { type: 'recovery', snapshot: { store: roomsState[roomId] } });
      }
    });
  });
});

httpServer.listen(3001, () => {
  console.log('Server started on port 3001');
});
