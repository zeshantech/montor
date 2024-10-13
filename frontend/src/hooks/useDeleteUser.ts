// src/hooks/useDeleteUser.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";

const useDeleteUser = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await API.delete(`/users/${userId}`); // Ensure this endpoint exists and is admin-protected
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error: any) => {
      console.error("Failed to delete user:", error);
      alert("Failed to delete the user. Please try again.");
    },
  });
};

export default useDeleteUser;
