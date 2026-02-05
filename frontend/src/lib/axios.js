

import axios from "axios";
import { getToken } from "@clerk/clerk-react";

const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5000/api" : "https://interview-craft-red.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include Clerk JWT token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting Clerk token:", error);
  }
  return config;
});
