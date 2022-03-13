import { Server } from 'socket.io';
import { Server as HTTP_SERVER } from 'http';

const socketConfig = {
  cors: {
    origin: '*',
    credentials: true,
  },
};

const onConnectSocket = (socketServer: any) => (socket: any) => {
  socket.on('message', (msg: any) => {
    console.log('msg', msg);
    socketServer.emit('message', msg);
  });
};

const connectSocketServer = async (server: HTTP_SERVER) => {
  const socketServer = new Server(server, socketConfig);
  socketServer.on('connection', onConnectSocket(socketServer));
};

export default connectSocketServer;
