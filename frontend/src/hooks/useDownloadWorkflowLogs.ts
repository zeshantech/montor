import { useMutation } from "@tanstack/react-query";
import { useApi } from "../services/api";

export interface LogEntry {
  filePath: string;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug" | "success" | "other";
  message: string;
}

interface DownloadLogsData {
  projectId: string;
  workflowRunId: number;
}

interface WorkflowLogsResponse {
  message: string;
  logs: LogEntry[];
}

const useDownloadWorkflowLogs = () => {
  const { API } = useApi();

  return useMutation<WorkflowLogsResponse, Error, DownloadLogsData>({
    mutationFn: async ({ projectId, workflowRunId }) => {
      const response = await API.get<WorkflowLogsResponse>(`/cicd/workflow/${projectId}/run-logs/${workflowRunId}`);
      return response.data;
    },
  });
};

export default useDownloadWorkflowLogs;
