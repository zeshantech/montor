// src/hooks/useConnectRepo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

interface ConnectRepoData {
  repositoryUrl: string;
}

interface ConnectRepoResponse {
  message: string;
  repository: string;
}

const useConnectRepo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ConnectRepoResponse,
    Error,
    { projectId: string; data: ConnectRepoData }
  >({
    mutationFn: async ({ projectId, data }) => {
      const response = await API.post(
        `/projects/${projectId}/connect-repo`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error: any) => {
      console.error("Failed to connect repository:", error);
      alert("Failed to connect repository. Please try again.");
    },
  });
};

export default useConnectRepo;
