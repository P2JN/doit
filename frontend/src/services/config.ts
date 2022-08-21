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

// Timezone interceptor, passes the timezone hours diff
axiosInstance.interceptors.request.use((config) => {
  const timezone = new Date().getTimezoneOffset() / 60;
  if (config.headers) {
    config.headers.timezone = timezone;
  }
  return config;
});

// Local language interceptor
axiosInstance.interceptors.request.use((config) => {
  const language = "es-es";
  if (config.headers) {
    config.headers["Accept-Language"] = language;
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
