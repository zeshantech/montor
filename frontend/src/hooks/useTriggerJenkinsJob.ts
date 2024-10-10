// src/hooks/useTriggerJenkinsJob.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

interface TriggerJobResponse {
  message: string;
}

const useTriggerJenkinsJob = () => {
  const queryClient = useQueryClient();

  return useMutation<TriggerJobResponse, Error, string>({
    mutationFn: async (jobName: string) => {
      const response = await API.post(
        `/jenkins/trigger/${encodeURIComponent(jobName)}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Optionally, refetch Jenkins jobs or job statuses
      queryClient.invalidateQueries(["jenkinsJobs"]);
    },
    onError: (error: any) => {
      console.error("Failed to trigger Jenkins job:", error);
      alert("Failed to trigger the Jenkins job. Please try again.");
    },
  });
};

export default useTriggerJenkinsJob;
