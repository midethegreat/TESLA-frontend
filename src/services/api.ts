// services/api.ts (Updated)
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "https://tesla-backend-2da8.onrender.com",
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
  return url?.includes("/api/admin/") || false;
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

    // Skip refresh for login endpoints completely
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/admin/login")
    ) {
      return Promise.reject(error);
    }

    // Skip if already retried or flagged to skip
    if (originalRequest._skipAuthRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAdmin = isAdminRequest(originalRequest.url);

    if (error.response?.status === 401 && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let token: string;

        if (isAdmin) {
          const { adminService } = await import("./admin.service");
          const refreshResponse = await adminService.refreshToken();
          token = refreshResponse.token;
        } else {
          const { authService } = await import("./auth.service");
          const refreshResponse = await authService.refreshToken();
          token = refreshResponse.token;
        }

        originalRequest.headers.Authorization = `Bearer ${token}`;
        setToken(isAdmin, token);
        processQueue(null, token);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(error, null);

        if (isAdmin) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          localStorage.removeItem("adminUser");
          if (!window.location.pathname.includes("/admin/login")) {
            window.location.href = "/admin/login";
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default API;
