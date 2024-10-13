// src/hooks/useFetchProject.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";
import { Project } from "./useFetchProjects";

const useFetchProject = (projectId: string) => {
  const { API } = useApi();

  return useQuery<Project, Error>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await API.get(`/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useFetchProject;
