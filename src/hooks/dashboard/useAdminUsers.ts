// hooks/useAdminUsers.ts (Updated)
import { adminService, type AdminUser, type UsersResponse } from "@/services/admin.service";
import { useState, useEffect } from "react";

interface UseAdminUsersProps {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useAdminUsers = (props?: UseAdminUsersProps) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = props || {};

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    limit,
    totalPages: 0,
  });

  const fetchUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response: UsersResponse = await adminService.getAllUsers(
        params?.page || page,
        params?.limit || limit,
        params?.search || search,
        params?.sortBy || sortBy,
        params?.sortOrder || sortOrder
      );

      if (response.success) {
        setUsers(response.users);
        setPagination(response.pagination);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminService.isAdminLoggedIn()) {
      fetchUsers();
    }
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    refetch: fetchUsers,
  };
};
