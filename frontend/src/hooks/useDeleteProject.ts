// src/hooks/useDeleteProject.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

interface DeleteProjectResponse {
  message: string;
}

const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteProjectResponse, Error, string>({
    mutationFn: async (projectId: string) => {
      const response = await API.delete(`/projects/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error: any) => {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    },
  });
};

export default useDeleteProject;
