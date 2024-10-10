// src/hooks/useJenkinsRealTimeUpdates.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../contexts/SocketContext';

const useJenkinsRealTimeUpdates = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleJenkinsJobUpdate = (data: any) => {
      console.log('Jenkins Job Update:', data);
      // Invalidate or update specific queries as needed
      queryClient.invalidateQueries(['jenkinsJobs']);
    };

    socket.on('jenkinsJobUpdate', handleJenkinsJobUpdate);

    return () => {
      socket.off('jenkinsJobUpdate', handleJenkinsJobUpdate);
    };
  }, [socket, queryClient]);
};

export default useJenkinsRealTimeUpdates;
