// src/hooks/useFetchWorkflowRuns.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export interface WorkflowRun {
  id: string;
  projectId: string;
  status: string;
  startedAt: string;
  completedAt: string;
  result: string;
}

const useFetchWorkflowRuns = () => {
  return useQuery<WorkflowRun[], Error>({
    queryKey: ["workflowRuns"],
    queryFn: async () => {
      const response = await API.get("/cicd/workflow-runs");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchWorkflowRuns;
