// src/hooks/useFetchUsers.ts

import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const useFetchUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await API.get("/users"); // Ensure this endpoint exists and is admin-protected
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export default useFetchUsers;
