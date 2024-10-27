// src/hooks/useFetchSystemMetrics.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface SystemMetrics {
  cpuLoad: {
    cores: number;
    loadAverages: number[];
  };
  freeMemory: number;
  totalMemory: number;
  usedMemory: number;
  uptime: number;
}

const useFetchSystemMetrics = () => {
  const { API } = useApi();

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
