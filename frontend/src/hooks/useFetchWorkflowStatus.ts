// src/hooks/useFetchWorkflowStatus.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

interface WorkflowStatus {
  id: string;
  status: string;
  progress: number;
  startedAt: string;
  completedAt: string | null;
}

const useFetchWorkflowStatus = (workflowId: string) => {
  return useQuery<WorkflowStatus, Error>({
    queryKey: ["workflowStatus", workflowId],
    queryFn: async () => {
      const response = await API.get(`/cicd/workflow/${workflowId}/status`);
      return response.data;
    },
    enabled: !!workflowId,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
};

export default useFetchWorkflowStatus;
