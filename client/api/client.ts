import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

// Lets AuthProvider react to a 401 without a page reload
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

const AUTH_PATHS = [
  "/user/login",
  "/user/register",
  "/user/me",
  "/user/logout",
];

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (err: AxiosError) => {
    const url = err.config?.url ?? "";
    const isAuthCall = AUTH_PATHS.some((p) => url.includes(p));

    // Session expired while using the app (not a login/me call)
    if (err.response?.status === 401 && !isAuthCall) {
      onUnauthorized?.();
    }

    return Promise.reject(err);
  },
);

export default api;
