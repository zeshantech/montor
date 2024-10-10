// src/hooks/useFetchDockerContainers.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export interface DockerContainer {
  Id: string;
  Names: string[];
  Image: string;
  Command: string;
  Created: number;
  State: string;
  Status: string;
  Ports: any[];
  Labels: { [key: string]: string };
  SizeRw: number;
  SizeRootFs: number;
}

const useFetchDockerContainers = () => {
  return useQuery<DockerContainer[], Error>({
    queryKey: ["dockerContainers"],
    queryFn: async () => {
      const response = await API.get("/docker/containers");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useFetchDockerContainers;
