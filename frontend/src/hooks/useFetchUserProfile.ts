// src/hooks/useFetchUserProfile.ts

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../services/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

const useFetchUserProfile = () => {
  const { API } = useApi();

  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await API.get("/users/profile");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useFetchUserProfile;
