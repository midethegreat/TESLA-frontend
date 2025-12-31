// services/api.ts (Updated)
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Update the Authorization header and retry
      prom.config.headers.Authorization = `Bearer ${token}`;
      prom.resolve(API(prom.config));
    }
  });
  failedQueue = [];
};

// Check if request is for admin endpoints
const isAdminRequest = (url: string | undefined): boolean => {
  return url?.startsWith("/admin/") || false;
};

// Get appropriate token based on request type
const getToken = (isAdmin: boolean): string | null => {
  if (isAdmin) {
    return localStorage.getItem("adminToken");
  }
  return localStorage.getItem("token");
};

// Set appropriate token based on request type
const setToken = (isAdmin: boolean, token: string): void => {
  if (isAdmin) {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.setItem("token", token);
  }
};

// Get appropriate refresh token based on request type
const getRefreshToken = (isAdmin: boolean): string | null => {
  if (isAdmin) {
    return localStorage.getItem("adminRefreshToken");
  }
  return localStorage.getItem("refreshToken");
};

// Add request interceptor to include appropriate auth token
API.interceptors.request.use(
  (config) => {
    const isAdmin = isAdminRequest(config.url);
    const token = getToken(isAdmin);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _skipAuthRefresh?: boolean;
    };

    // Skip if this is a refresh token request or already retried
    if (originalRequest._skipAuthRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAdmin = isAdminRequest(originalRequest.url);

    // If error is 401 (Unauthorized)
    if (error.response?.status === 401 && originalRequest) {
      // Skip refresh for auth endpoints (except login)
      if (
        originalRequest.url?.includes("/auth/") &&
        !originalRequest.url?.includes("/auth/login") &&
        !originalRequest.url?.includes("/admin/login")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        let token: string;

        if (isAdmin) {
          // Use admin refresh token
          const { adminService } = await import("./admin.service");
          const refreshResponse = await adminService.refreshToken();
          token = refreshResponse.token;
        } else {
          // Use regular user refresh token
          const { authService } = await import("./auth.service");
          const refreshResponse = await authService.refreshToken();
          token = refreshResponse.token;
        }

        // Update the original request's header
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Update token in localStorage
        setToken(isAdmin, token);

        // Process all queued requests
        processQueue(null, token);

        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed in interceptor:", refreshError);

        // Process all queued requests with error
        processQueue(error, null);

        // Clear appropriate auth data
        if (isAdmin) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          localStorage.removeItem("adminUser");

          // Redirect to admin login page if not already there
          if (!window.location.pathname.includes("/admin/login")) {
            window.location.href = "/admin/login";
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Redirect to regular login page if not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default API;
