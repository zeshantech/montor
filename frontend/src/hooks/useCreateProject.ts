// src/hooks/useCreateProject.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

interface CreateProjectData {
  name: string;
  description?: string;
}

interface CreateProjectResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProjectResponse, Error, CreateProjectData>({
    mutationFn: async (projectData: CreateProjectData) => {
      const response = await API.post("/projects", projectData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error: any) => {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    },
  });
};

export default useCreateProject;
