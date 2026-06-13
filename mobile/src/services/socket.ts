import { io, Socket } from 'socket.io-client';
import { useLeadsStore } from '../store/leadsStore';

// replace with your machine's local IP, e.g. http://192.168.1.5:3000
const SERVER_URL = 'http://localhost:3000'; // Using localhost for Web testing

let socket: Socket | null = null;

export const connectSocket = () => {
  if (socket) return;

  socket = io(SERVER_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
  });

  const { setConnected, addLead } = useLeadsStore.getState();

  socket.on('connect', () => {
    console.log('[Socket] connected:', socket?.id);
    setConnected(true);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] disconnected');
    setConnected(false);
  });

  socket.on('new_lead', (lead) => {
    addLead(lead);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] connect_error:', error.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
