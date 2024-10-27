import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";
import { toast } from "react-toastify";

interface TriggerWorkflowData {
  projectId: string;
  workflowName: string;
}

interface TriggerWorkflowResponse {
  message: string;
}

const useTriggerWorkflow = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation<TriggerWorkflowResponse, Error, TriggerWorkflowData>({
    mutationFn: async (data: TriggerWorkflowData) => {
      const response = await API.post(`/cicd/workflow/${data.projectId}/trigger/${encodeURIComponent(data.workflowName)}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Workflow triggered successfully.");
      queryClient.invalidateQueries({ queryKey: ["workflowRuns"] });
    },
    onError: (error) => {
      console.error("Failed to trigger workflow:", error);
      toast.error("Failed to trigger workflow. Please try again.");
    },
  });
};

export default useTriggerWorkflow;
