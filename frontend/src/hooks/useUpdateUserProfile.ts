import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface UpdateUserProfileData {
  name: string;
  email: string;
}

interface UpdateUserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

const useUpdateUserProfile = () => {
  const { API } = useApi();
  const queryClient = useQueryClient();

  return useMutation<UpdateUserProfileResponse, Error, UpdateUserProfileData>({
    mutationFn: async (data: UpdateUserProfileData) => {
      const response = await API.put("/users/profile", data); // Ensure this endpoint exists
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
    },
  });
};

export default useUpdateUserProfile;
