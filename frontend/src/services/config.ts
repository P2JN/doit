import Axios from "axios";
import { QueryClient, DefaultOptions } from "react-query";

const localHostnames = ["localhost", "127.0.0.1", "0.0.0.0"];
const isLocal = localHostnames.includes(window.location.hostname);

const BASE_URL =
  (isLocal ? "http" : "https") +
  "://" +
  window.location.hostname +
  (isLocal ? ":8000" : "");

export const API_URL = BASE_URL + "/api";

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Session interceptors
axiosInstance.interceptors.response.use((response) => {
  console.log("intercepted", response, response.data.key);

  if (response.data.key) {
    localStorage.setItem("token", response.data.key);
  }

  return response;
});

axiosInstance.interceptors.request.use((config) => {
  // if the request endpoint includes "auth" remove the token
  if (config.url?.includes("/auth/logout")) {
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
