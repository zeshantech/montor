// src/hooks/useJenkinsRealTimeUpdates.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../contexts/SocketContext';
import { useNotifications } from '../contexts/NotificationsContext';

const useJenkinsRealTimeUpdates = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!socket) return;

    const handleJenkinsJobUpdate = (data: any) => {
      console.log('Jenkins Job Update:', data);
      queryClient.invalidateQueries(['jenkinsJobs']);

      // Push notification
      addNotification({
        message: `Jenkins Job "${data.jobName}" updated to ${data.status}.`,
        type: data.status === 'success' ? 'success' : data.status === 'error' ? 'error' : 'info',
      });
    };

    socket.on('jenkinsJobUpdate', handleJenkinsJobUpdate);

    return () => {
      socket.off('jenkinsJobUpdate', handleJenkinsJobUpdate);
    };
  }, [socket, queryClient, addNotification]);
};

export default useJenkinsRealTimeUpdates;
