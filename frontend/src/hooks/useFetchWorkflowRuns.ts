// frontend/src/hooks/useFetchWorkflowRuns.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

export interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string;
  run_number: number;
  head_branch: string;
  head_sha: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

const useFetchWorkflowRuns = (projectId: string) => {
  const { API } = useApi();

  return useQuery<WorkflowRun[], Error>({
    queryKey: ["workflowRuns", projectId],
    queryFn: async () => {
      const response = await API.get<WorkflowRun[]>(`/cicd/workflow/${projectId}/runs`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchWorkflowRuns;
