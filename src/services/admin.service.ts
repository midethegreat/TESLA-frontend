// services/api/admin.service.ts
import API from "./api";

// Types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
  country: string;
  emailVerified: boolean;
  referralId: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
  kycStatus: string;
  kycVerified: boolean;
  referralCount: number;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    country: string;
    emailVerified: boolean;
  };
}

export interface DashboardStats {
  totalUsers: number;
  emailVerified: number;
  kycPending: number;
  kycVerified: number;
  recentUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  }>;
  registrationByCountry: Record<string, number>;
}

export interface KYCRequest {
  userId: string;
  fullName: string;
  email: string;
  idType: string;
  dob: string;
  idFrontPath: string;
  idBackPath: string;
  selfiePath: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  userEmail?: string;
  userCreatedAt?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  emailVerified: number;
  kycVerified: number;
  kycPending: number;
  registrationByCountry: Record<string, number>;
  registrationTrend?: Array<{
    date: string;
    count: number;
  }>;
  userGrowth?: Array<{
    month: string;
    count: number;
  }>;
  activityStats?: {
    dailyRegistrations: Array<{
      date: string;
      count: number;
    }>;
    kycSubmissions: Array<{
      date: string;
      count: number;
    }>;
  };
}

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface KYCResponse {
  success: boolean;
  requests: KYCRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface KYCStats {
  totals: {
    pending: number;
    verified: number;
    rejected: number;
    all: number;
  };
  today: {
    pending: number;
    verified: number;
    rejected: number;
  };
  weekly?: {
    verified: number;
  };
  monthly?: {
    verified: number;
  };
}

// Admin Service
export const adminService = {

  login: async (
    credentials: AdminLoginRequest
  ): Promise<AdminLoginResponse> => {
    try {
      const response = await API.post("/api/admin/login", credentials);

      // Store tokens
      const { token, refreshToken, user } = response.data;

   
      adminService.setAdminToken(token);
      adminService.setAdminRefreshToken(refreshToken);
      adminService.setAdminUser(user);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  verifyToken: async (): Promise<{ success: boolean; user: any }> => {
    try {
      const response = await API.get("/api/admin/verify");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Token verification failed"
      );
    }
  },

  refreshToken: async (): Promise<{
    success: boolean;
    token: string;
    user: any;
  }> => {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await API.post("/api/admin/refresh", { refreshToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await API.get("/api/admin/logout");

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      return response.data;
    } catch (error: any) {
 
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      return { success: true, message: "Logged out successfully" };
    }
  },

  // ========== DASHBOARD ==========
  getDashboardStats: async (): Promise<{
    success: boolean;
    stats: DashboardStats;
  }> => {
    try {
      const response = await API.get("/api/admin/dashboard");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  },

  // ========== USERS MANAGEMENT ==========
  getAllUsers: async (
    page: number = 1,
    limit: number = 20,
    search: string = "",
    sortBy: string = "createdAt",
    sortOrder: string = "desc"
  ): Promise<UsersResponse> => {
    try {
      const response = await API.get("/api/admin/users", {
        params: { page, limit, search, sortBy, sortOrder },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  getUserDetails: async (
    userId: string
  ): Promise<{ success: boolean; user: any }> => {
    try {
      const response = await API.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  },

  updateUserStatus: async (
    userId: string,
    action: string,
    data?: any
  ): Promise<{ success: boolean; message: string; data: any }> => {
    try {
      const response = await API.put(`/api/admin/users/${userId}/status`, {
        action,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  },

  // ========== ANALYTICS ==========
  getAnalytics: async (): Promise<{
    success: boolean;
    analytics: AnalyticsData;
  }> => {
    try {
      const response = await API.get("/api/admin/analytics");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  },

  getDetailedAnalytics: async (
    period: string = "month"
  ): Promise<{
    success: boolean;
    period: string;
    data: any;
  }> => {
    try {
      const response = await API.get("/api/admin/analytics/detailed", {
        params: { period },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch detailed analytics"
      );
    }
  },

  // ========== KYC MANAGEMENT ==========
  getKYCRequests: async (
    page: number = 1,
    limit: number = 20
  ): Promise<KYCResponse> => {
    try {
      const response = await API.get("/api/admin/kyc/requests", {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch KYC requests"
      );
    }
  },

  getKYCStats: async (): Promise<{ success: boolean; stats: KYCStats }> => {
    try {
      const response = await API.get("/api/admin/kyc/stats");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch KYC stats"
      );
    }
  },

  approveKYC: async (
    userId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; profile: any }> => {
    try {
      const response = await API.post(`/api/admin/kyc/${userId}/approve`, {
        notes,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to approve KYC");
    }
  },

  rejectKYC: async (
    userId: string,
    reason: string
  ): Promise<{ success: boolean; message: string; profile: any }> => {
    try {
      const response = await API.post(`/api/admin/kyc/${userId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to reject KYC");
    }
  },

  // ========== UTILITY FUNCTIONS ==========
  setAdminToken: (token: string): void => {
    localStorage.setItem("adminToken", token);
  },

  getAdminToken: (): string | null => {
    return localStorage.getItem("adminToken");
  },

  setAdminRefreshToken: (refreshToken: string): void => {
    localStorage.setItem("adminRefreshToken", refreshToken);
  },

  getAdminRefreshToken: (): string | null => {
    return localStorage.getItem("adminRefreshToken");
  },

  setAdminUser: (user: any): void => {
    localStorage.setItem("adminUser", JSON.stringify(user));
  },

  getAdminUser: (): any | null => {
    const userStr = localStorage.getItem("adminUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdminLoggedIn: (): boolean => {
    return !!localStorage.getItem("adminToken");
  },

  clearAdminAuth: (): void => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
  },
};
