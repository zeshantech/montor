// src/hooks/useStartDockerContainer.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

const useStartDockerContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerId: string) => {
      const response = await API.post(
        `/docker/containers/${containerId}/start`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dockerContainers"]);
    },
    onError: (error: any) => {
      console.error("Failed to start container:", error);
      alert("Failed to start the container. Please try again.");
    },
  });
};

export default useStartDockerContainer;
