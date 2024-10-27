import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";

const useStartDockerContainer = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerId: string) => {
      const response = await API.post(`/docker/containers/${containerId}/start`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dockerContainers"] });
    },
    onError: (error) => {
      console.error("Failed to start container:", error);
      alert("Failed to start the container. Please try again.");
    },
  });
};

export default useStartDockerContainer;
