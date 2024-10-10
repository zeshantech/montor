// src/hooks/useDockerRealTimeUpdates.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../contexts/SocketContext';

const useDockerRealTimeUpdates = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleDockerContainerUpdate = (data: any) => {
      console.log('Docker Container Update:', data);
      // Invalidate or update specific queries as needed
      queryClient.invalidateQueries(['dockerContainers']);
    };

    socket.on('dockerContainerUpdate', handleDockerContainerUpdate);

    return () => {
      socket.off('dockerContainerUpdate', handleDockerContainerUpdate);
    };
  }, [socket, queryClient]);
};

export default useDockerRealTimeUpdates;
