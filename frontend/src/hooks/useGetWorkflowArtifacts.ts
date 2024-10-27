import { useMutation } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface GetArtifactsData {
  projectId: string;
  workflowRunId: number;
}

interface WorkflowArtifactsResponse {
  artifacts: any[]; // Adjust the type according to the API response
}

const useGetWorkflowArtifacts = () => {
  const { API } = useApi();

  return useMutation<WorkflowArtifactsResponse, Error, GetArtifactsData>({
    mutationFn: async ({ projectId, workflowRunId }) => {
      const response = await API.get(`/cicd/workflow/${projectId}/artifacts/${workflowRunId}`);
      return response.data;
    },
  });
};

export default useGetWorkflowArtifacts;
