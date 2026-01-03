// hooks/useAdminAnalytics.ts (Updated)
import { adminService, type AnalyticsData } from "@/services/admin.service";
import { useState, useEffect } from "react";

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAnalytics();

      if (response.success) {
        setAnalytics(response.analytics);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAnalytics = async (period: string = "month") => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getDetailedAnalytics(period);

      if (response.success) {
        return response.data;
      } else {
        throw new Error("Failed to fetch detailed analytics");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch detailed analytics");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminService.isAdminLoggedIn()) {
      fetchAnalytics();
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    fetchDetailedAnalytics,
  };
};
