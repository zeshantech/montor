// src/services/api.ts

import axios from "axios";
import { useAuth } from "@clerk/clerk-react"; // Import Clerk's method to get the token

export function useApi() {
  const { getToken } = useAuth();

  const API = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  API.interceptors.request.use(
    async (config) => {
      const token = await getToken(); // Await the token
      console.log(token, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return { API };
}
