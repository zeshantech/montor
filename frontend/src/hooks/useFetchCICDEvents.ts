import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

export interface CICDEvent {
  id: number;
  eventType: string;
  status: string;
  commitSha: string;
  branch: string;
  createdAt: string;
}

const useFetchCICDEvents = (projectId: string) => {
  const { API } = useApi();

  return useQuery<CICDEvent[], Error>({
    queryKey: ["cicdEvents", projectId],
    queryFn: async () => {
      const response = await API.get<CICDEvent[]>(`/cicd/${projectId}/events`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useFetchCICDEvents;
