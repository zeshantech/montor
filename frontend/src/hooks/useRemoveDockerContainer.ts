// src/hooks/useRemoveDockerContainer.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";

const useRemoveDockerContainer = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerId: string) => {
      const response = await API.delete(`/docker/containers/${containerId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dockerContainers"]);
    },
    onError: (error: any) => {
      console.error("Failed to remove container:", error);
      alert("Failed to remove the container. Please try again.");
    },
  });
};

export default useRemoveDockerContainer;
