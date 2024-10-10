// src/hooks/useFetchDockerLogs.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const useFetchDockerLogs = (containerId: string) => {
  return useQuery<string, Error>({
    queryKey: ["dockerLogs", containerId],
    queryFn: async () => {
      const response = await API.get(`/docker/containers/${containerId}/logs`);
      return response.data;
    },
    enabled: !!containerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchDockerLogs;
