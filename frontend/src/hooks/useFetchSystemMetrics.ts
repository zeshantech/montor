// src/hooks/useFetchSystemMetrics.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

interface SystemMetrics {
  cpuLoad: number[];
  freeMemory: number;
  totalMemory: number;
  usedMemory: number;
  uptime: number;
}

const useFetchSystemMetrics = () => {
  return useQuery<SystemMetrics, Error>({
    queryKey: ["systemMetrics"],
    queryFn: async () => {
      const response = await API.get("/monitoring/system");
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 1,
  });
};

export default useFetchSystemMetrics;
