// src/hooks/useFetchProjects.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  isPrivate?: boolean;
  accessToken?: string;
  createdAt: string;
  githubRepoId?: string
  webhookSecret?: string
  isWebhookActive?: boolean
}

const useFetchProjects = () => {
  const { API } = useApi();

  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await API.get("/projects");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useFetchProjects;
