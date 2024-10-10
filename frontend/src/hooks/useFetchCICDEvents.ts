// src/hooks/useFetchCICDEvents.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export interface CICDEvent {
  id: string;
  projectId: string;
  eventType: string;
  timestamp: string;
  details: string;
}

const useFetchCICDEvents = (projectId: string) => {
  return useQuery<CICDEvent[], Error>({
    queryKey: ["cicdEvents", projectId],
    queryFn: async () => {
      const response = await API.get(`/cicd/${projectId}/events`);
      return response.data;
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchCICDEvents;
