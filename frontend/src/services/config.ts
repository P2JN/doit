import Axios from "axios";
import { QueryClient, DefaultOptions } from "react-query";

const BASE_URL = "http://" + window.location.hostname + ":8000";

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
// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (response.data.token && response.data.id) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("userId", response.data.id);
//       localStorage.setItem("isAdmin", response.data.isAdmin);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//       localStorage.removeItem("isAdmin");
//       window.location.href = "/login";
//     } else if (error.response.status === 402) {
//       window.location.href = "/profile/payments";
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (config.headers)
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       delete config.headers.Authorization;
//     }
//   return config;
// });

// React Query

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
