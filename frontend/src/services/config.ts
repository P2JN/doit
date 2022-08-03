import Axios from "axios";
import { QueryClient, DefaultOptions } from "react-query";

const localHostnames = ["localhost", "127.0.0.1", "0.0.0.0"];
export const isDevEnv = localHostnames.includes(window.location.hostname);

export const BASE_URL =
  (isDevEnv ? "http" : "https") +
  "://" +
  window.location.hostname +
  (isDevEnv ? ":8000" : "");

export const API_URL = BASE_URL + "/api";

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const GOOGLE_CALLBACK_URL = "http://localhost:3000/auth/login";

// Axios

export const axiosInstance = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Error handling interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Session interceptors
axiosInstance.interceptors.response.use((response) => {
  if (response.data.key) {
    localStorage.setItem("token", response.data.key);
  }

  return response;
});

axiosInstance.interceptors.request.use((config) => {
  // if the request origin includes "logout" or "login" remove the token
  if (config.url?.includes("logout") || config.url?.includes("login")) {
    localStorage.removeItem("token");
  }

  const token = localStorage.getItem("token");
  if (config.headers)
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    } else {
      delete config.headers.Authorization;
    }
  return config;
});

// React Query

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
