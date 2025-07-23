import axios from "axios";
import { getEnvironment } from "@/config/env";

export const axiosInstance = axios.create({
  baseURL: getEnvironment().serverURI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response.data, // unwrap response.data
  (error) => {
    console.error(error);
    
    // Normalize the error
    const normalizedError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Internal server error",
      error: error.response?.data?.error || error.message,
    };
    return Promise.reject(normalizedError);
  }
);
