// src/hooks/useLogin.ts

import { useMutation } from '@tanstack/react-query';
import API from '../services/api';
import { useAuth } from './useAuth';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: any;
}

const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await API.post<LoginResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.access_token, data.user);
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login failed. Please check your credentials.');
    }
  });
};

export default useLogin;
