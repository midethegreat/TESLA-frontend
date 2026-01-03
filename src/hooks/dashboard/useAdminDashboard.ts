// hooks/useAdminDashboard.ts (Updated)
import { adminService, type DashboardStats } from "@/services/admin.service";
import { useState, useEffect } from "react";

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    emailVerified: 0,
    kycPending: 0,
    kycVerified: 0,
    recentUsers: [],
    registrationByCountry: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getDashboardStats();

      if (response.success) {
        setStats(response.stats);
      } else {
        throw new Error("Failed to fetch dashboard stats");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminService.isAdminLoggedIn()) {
      fetchDashboardStats();
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats,
  };
};
