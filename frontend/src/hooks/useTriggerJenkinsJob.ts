// src/hooks/useTriggerJenkinsJob.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import { toast } from "react-toastify";

const useTriggerJenkinsJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobName: string) => {
      const response = await API.post(
        `/jenkins/trigger/${encodeURIComponent(jobName)}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Jenkins job triggered successfully.");
      queryClient.invalidateQueries(["jenkinsJobs"]);
    },
    onError: () => {
      toast.error("Failed to trigger Jenkins job.");
    },
  });
};

export default useTriggerJenkinsJob;
