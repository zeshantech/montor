// src/hooks/useRegistration.ts

import { useMutation } from '@tanstack/react-query';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const useRegistration = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await API.post('/users/register', data);
      return response.data;
    },
    onSuccess: () => {
      alert('Registration successful. Please login.');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      alert('Registration failed. Please try again.');
    },
  });
};

export default useRegistration;
