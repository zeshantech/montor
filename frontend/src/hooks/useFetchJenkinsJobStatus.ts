// src/hooks/useFetchJenkinsJobStatus.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface JenkinsJobStatus {
  result: string | null;
  duration: number;
  timestamp: number;
}

const useFetchJenkinsJobStatus = (jobName: string) => {
  const { API } = useApi();

  return useQuery<JenkinsJobStatus, Error>({
    queryKey: ["jenkinsJobStatus", jobName],
    queryFn: async () => {
      const response = await API.get(
        `/jenkins/status/${encodeURIComponent(jobName)}`
      );
      return response.data;
    },
    enabled: !!jobName, // Only run if jobName is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchJenkinsJobStatus;
