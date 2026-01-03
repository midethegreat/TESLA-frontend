// components/AdminUsers.tsx (Updated)
"use client";

import { useAdminUsers } from "@/hooks/dashboard/useAdminUsers";
import { adminService } from "@/services/admin.service";
import type React from "react";
import { useState } from "react";

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, loading, refetch } = useAdminUsers();

  // Get current user role from localStorage
  const currentUser = adminService.getAdminUser();
  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400";
      case "pending":
      case "submitted":
        return "bg-yellow-500/20 text-yellow-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getKYCStatusText = (status: string) => {
    if (!status) return "Not Submitted";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by email, name, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
        />
        <button
          onClick={() => refetch()}
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold py-3 px-4 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Country
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Date Joined
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Referrals
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  KYC Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">
                  Email Verified
                </th>
                {isSuperAdmin && (
                  <th className="text-left py-3 px-4 font-semibold text-gray-400">
                    User ID
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 9 : 8}
                    className="py-8 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{user.email}</span>
                        {user.emailVerified && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                            ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.firstName
                        ? `${user.firstName} ${user.lastName || ""}`
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{user.country || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {user.createdAt ? formatDate(user.createdAt) : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-semibold">
                        {user.referralCount || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${getKYCStatusColor(
                          user.kycStatus
                        )}`}
                      >
                        {getKYCStatusText(user.kycStatus)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          user.emailVerified
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.emailVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    {isSuperAdmin && (
                      <td
                        className="py-3 px-4 text-gray-400 text-xs font-mono"
                        title={user.id}
                      >
                        {user.id.substring(0, 8)}...
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
