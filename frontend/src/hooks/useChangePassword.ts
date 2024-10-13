// src/hooks/useChangePassword.ts

import { useMutation } from "@tanstack/react-query";
import API from "../services/api";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordData>({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await API.post("/users/change-password", data); // Ensure this endpoint exists
      return response.data;
    },
    onError: (error: any) => {
      console.error("Failed to change password:", error);
    },
  });
};

export default useChangePassword;
