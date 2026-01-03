// hooks/useAdminAuth.ts
import { adminService, type AdminLoginRequest } from "@/services/admin.service";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback(
    async (credentials: AdminLoginRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.login(credentials);

        if (response.success) {
          // Store tokens and user data
          adminService.setAdminToken(response.token);
          adminService.setAdminRefreshToken(response.refreshToken);
          adminService.setAdminUser(response.user);

          // Redirect to admin dashboard
          navigate("/admin/dashboard");

          return { success: true, user: response.user };
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err: any) {
        setError(err.message || "Login failed");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await adminService.logout();
      adminService.clearAdminAuth();
      navigate("/admin/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      adminService.clearAdminAuth();
      navigate("/admin/login");
    }
  }, [navigate]);

  const verifySession = useCallback(async () => {
    try {
      if (!adminService.isAdminLoggedIn()) {
        return { success: false, message: "No admin session found" };
      }

      const response = await adminService.verifyToken();

      if (response.success) {
        return { success: true, user: response.user };
      } else {
        adminService.clearAdminAuth();
        return { success: false, message: "Session expired" };
      }
    } catch (err: any) {
      adminService.clearAdminAuth();
      return {
        success: false,
        message: err.message || "Session verification failed",
      };
    }
  }, []);

  return {
    loading,
    error,
    login,
    logout,
    verifySession,
    isLoggedIn: adminService.isAdminLoggedIn,
    getCurrentUser: adminService.getAdminUser,
  };
};
