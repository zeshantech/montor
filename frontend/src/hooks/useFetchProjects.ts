// src/hooks/useFetchProjects.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const useFetchProjects = () => {
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
