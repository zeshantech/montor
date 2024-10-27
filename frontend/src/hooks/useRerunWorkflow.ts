import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";
import { toast } from "react-toastify";

interface RerunWorkflowData {
  projectId: string;
  workflowRunId: number;
}

interface RerunWorkflowResponse {
  message: string;
}

const useRerunWorkflow = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation<RerunWorkflowResponse, Error, RerunWorkflowData>({
    mutationFn: async (data: RerunWorkflowData) => {
      const response = await API.post(`/cicd/workflow/${data.projectId}/rerun/${data.workflowRunId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Workflow rerun triggered successfully.");
      queryClient.invalidateQueries({ queryKey: ["workflowRuns", variables.projectId] });
    },
    onError: (error) => {
      console.error("Failed to rerun workflow:", error);
      toast.error("Failed to rerun workflow. Please try again.");
    },
  });
};

export default useRerunWorkflow;
