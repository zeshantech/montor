// src/hooks/useStopDockerContainer.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

const useStopDockerContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerId: string) => {
      const response = await API.post(`/docker/containers/${containerId}/stop`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dockerContainers"]);
    },
    onError: (error: any) => {
      console.error("Failed to stop container:", error);
      alert("Failed to stop the container. Please try again.");
    },
  });
};

export default useStopDockerContainer;
