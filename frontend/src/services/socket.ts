// src/services/socket.ts

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  public connect(token: string): Socket {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Connection Error:', err.message);
      });
    }
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
