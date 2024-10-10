// src/hooks/useFetchSystemLogs.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const useFetchSystemLogs = () => {
  return useQuery<string[], Error>({
    queryKey: ["systemLogs"],
    queryFn: async () => {
      const response = await API.get("/system/logs"); // Ensure this endpoint exists and is admin-protected
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export default useFetchSystemLogs;
