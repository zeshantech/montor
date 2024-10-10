// src/hooks/useFetchWebhooks.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

interface Webhook {
  id: string;
  eventType: string;
  repositoryUrl: string;
  timestamp: string;
  details: string;
}

const useFetchWebhooks = () => {
  return useQuery<Webhook[], Error>({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const response = await API.get("/webhooks/github");
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
};

export default useFetchWebhooks;
