import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";
import { toast } from "react-toastify";

interface CancelWorkflowData {
  projectId: string;
  workflowRunId: number;
}

interface CancelWorkflowResponse {
  message: string;
}

const useCancelWorkflow = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation<CancelWorkflowResponse, Error, CancelWorkflowData>({
    mutationFn: async (data: CancelWorkflowData) => {
      const response = await API.post(`/cicd/workflow/${data.projectId}/cancel/${data.workflowRunId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Workflow canceled successfully.");
      queryClient.invalidateQueries({ queryKey: ["workflowRuns", variables.projectId] });
    },
    onError: (error) => {
      console.error("Failed to cancel workflow:", error);
      toast.error("Failed to cancel workflow. Please try again.");
    },
  });
};

export default useCancelWorkflow;
