// src/contexts/SocketContext.tsx

import React, { createContext, useContext, useEffect } from 'react';
import socketService from '../services/socket';
import { useAuth } from '../hooks/useAuth';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      const newSocket = socketService.connect(user.token);
      setSocket(newSocket);

      return () => {
        socketService.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated, user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
