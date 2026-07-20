import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  isRefreshing,
  setIsRefreshing,
  enqueueFailedRequest,
  processQueue,
} from "../helpers/refreshQueue.ts";
import { syncTokensToStore, clearSessionAndRedirect } from "../helpers/tokenSync.ts";

export const http = axios.create({
  baseURL: "http://localhost:5000",
});

// Separate instance for the refresh call — avoids triggering the response
// interceptor recursively if /auth/refresh itself returns a 401.
const refreshHttp = axios.create({
  baseURL: "http://localhost:5000",
});

// ── Request interceptor ────────────────────────────────────────────────────
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 once per request.
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    // A refresh is already in-flight — queue this request until it resolves.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        enqueueFailedRequest({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    setIsRefreshing(true);

    try {
      const { data } = await refreshHttp.post<{
        token: string;
        refreshToken: string;
      }>("/auth/refresh", { refreshToken: storedRefreshToken });

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      syncTokensToStore(data.token, data.refreshToken);

      processQueue(null, data.token);

      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      setIsRefreshing(false);
    }
  },
);
