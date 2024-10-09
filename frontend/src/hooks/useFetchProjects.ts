// src/hooks/useFetchProjects.ts

import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

const useFetchProjects = () => {
  return useQuery({
    queryKey: ['projects'], queryFn: async () => {
      const response = await API.get('/projects');
      return response.data;
    }
  });
};

export default useFetchProjects;
