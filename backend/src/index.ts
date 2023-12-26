import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { Server, type Socket } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { getSession } from "next-auth/react";


const app = express();

const currentDir = process.cwd();

const keyPath = path.join(currentDir, 'server.key');
const certPath = path.join(currentDir, 'server.crt');
let httpServer
try {
  httpServer = createHttpsServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }, app)
} catch (error) {
  httpServer = createHttpServer(app);
}




const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  const session = await getSession({
    req: socket.request
  });
  console.log(session)

  next();
});

io.on('connection', (socket: Socket) => {
  console.log(`connect ${socket.id}`);

  socket.on('join-room', async (data: { roomId: string; userId: string }) => {
    const { roomId } = data;
    try {
      await socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

    } catch (error) {
      console.error(`Error joining room: ${error}`);
    }
  });

  socket.on('presence', async (data: { roomId: string; userId: string; presence: unknown }) => {
    try {
      const { roomId, userId, presence } = data;

      socket.broadcast.to(roomId).emit('presence', { userId, presence });
    } catch (error) {
      console.error(`Error updating presence: ${error}`);
    }

  }
  )

  socket.on('test', async (data: { roomId: string; userId: string; }) => {
    try {
      const { roomId, userId, } = data;

      socket.broadcast.to(roomId).emit('test', { userId, test:"oi" });
    } catch (error) {
      console.error(`Error updating presence: ${error}`);
    }

  })

  socket.on('update', async (data: { update: unknown; roomId: string; clientId: string }) => {
    const { update, roomId, clientId } = data;
    // console.log(`Socket ${socket.id} sent update for room ${roomId}`);



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

    }
  });

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
    //leave room
  });
});

httpServer.listen(3001, () => {
  console.log('Server started on port 3001');
});
