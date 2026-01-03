// hooks/useAdminKYC.ts (Updated)
import { type KYCRequest, type KYCStats, type KYCResponse, adminService } from "@/services/admin.service";
import { useState, useEffect } from "react";


interface UseAdminKYCProps {
  page?: number;
  limit?: number;
}

export const useAdminKYC = (props?: UseAdminKYCProps) => {
  const { page = 1, limit = 20 } = props || {};

  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [stats, setStats] = useState<KYCStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    limit,
    totalPages: 0,
  });

  const fetchKYCRequests = async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response: KYCResponse = await adminService.getKYCRequests(
        params?.page || page,
        params?.limit || limit
      );

      if (response.success) {
        setRequests(response.requests);
        setPagination(response.pagination);
      } else {
        throw new Error("Failed to fetch KYC requests");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch KYC requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKYCStats = async () => {
    try {
      const response = await adminService.getKYCStats();

      if (response.success) {
        setStats(response.stats);
      } else {
        throw new Error("Failed to fetch KYC stats");
      }
    } catch (err: any) {
      console.error("Failed to fetch KYC stats:", err);
    }
  };

  const approveKYC = async (userId: string, notes?: string) => {
    try {
      const response = await adminService.approveKYC(userId, notes);

      if (response.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.userId === userId ? { ...req, status: "verified" } : req
          )
        );

        // Refresh stats
        await fetchKYCStats();

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to approve KYC");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to approve KYC");
    }
  };

  const rejectKYC = async (userId: string, reason: string) => {
    try {
      const response = await adminService.rejectKYC(userId, reason);

      if (response.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.userId === userId ? { ...req, status: "rejected" } : req
          )
        );

        // Refresh stats
        await fetchKYCStats();

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to reject KYC");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to reject KYC");
    }
  };

  useEffect(() => {
    if (adminService.isAdminLoggedIn()) {
      fetchKYCRequests();
      fetchKYCStats();
    }
  }, []);

  return {
    requests,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchKYCRequests,
    fetchStats: fetchKYCStats,
    approveKYC,
    rejectKYC,
  };
};
