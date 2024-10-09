// src/hooks/useFetchProfile.ts

import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

const useFetchProfile = () => {
  return useQuery({
    queryKey: ['profile'], queryFn: async () => {
      const response = await API.get('/users/profile');
      return response.data;
    }
  });
};

export default useFetchProfile;
