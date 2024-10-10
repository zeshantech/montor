// src/hooks/useFetchJenkinsJobs.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export interface JenkinsJob {
  name: string;
  color: string;
}

const useFetchJenkinsJobs = () => {
  return useQuery<JenkinsJob[], Error>({
    queryKey: ["jenkinsJobs"],
    queryFn: async () => {
      const response = await API.get("/jenkins/jobs");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useFetchJenkinsJobs;
