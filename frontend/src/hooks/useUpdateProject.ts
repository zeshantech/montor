// src/hooks/useUpdateProject.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

interface UpdateProjectData {
  name?: string;
  description?: string;
}

interface UpdateProjectResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProjectResponse,
    Error,
    { id: string; data: UpdateProjectData }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await API.put(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error: any) => {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    },
  });
};

export default useUpdateProject;
