// hooks/useDownloadWorkflowLogs.ts

import { useMutation } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface DownloadLogsData {
  projectId: string;
  workflowRunId: number;
}

interface WorkflowLogsResponse {
  message: string;
  logs: string;
}

const useDownloadWorkflowLogs = () => {
  const { API } = useApi();

  return useMutation<WorkflowLogsResponse, Error, DownloadLogsData>({
    mutationFn: async ({ projectId, workflowRunId }) => {
      const response = await API.get(
        `/cicd/workflow/${projectId}/run-logs/${workflowRunId}`
      );
      return response.data;
    },
  });
};

export default useDownloadWorkflowLogs;
