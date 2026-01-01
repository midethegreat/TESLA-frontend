import type React from "react";
import { useState, useEffect } from "react";
import {
  LogOut,
  Users,
  FileText,
  BarChart3,
  Shield,
  Activity,
  TrendingUp,
  Globe,
} from "lucide-react";

import AdminUsers from "./AdminUsers";
import AdminKYC from "./AdminKYC";
import AdminAnalytics from "./AdminAnalytics";
import { useAdminAuth } from "@/hooks/dashboard/useAdminAuth";
import { useAdminDashboard } from "@/hooks/dashboard/useAdminDashboard";
import { adminService } from "@/services/admin.service";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "kyc" | "analytics">(
    "users"
  );
  const [user, setUser] = useState<any>(null);
  const { stats, loading, refetch } = useAdminDashboard();
  const { logout } = useAdminAuth();

 useEffect(() => {
   const fetchUser = async () => {
     const currentUser = await adminService.getAdminUser();
     setUser(currentUser);
   };

   fetchUser();
 }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = () => {
    refetch();
  };

  const isSuperAdmin = user?.role === "SUPERADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#1c1c1c] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-amber-500">
                Role: {isSuperAdmin ? "Super Admin" : "Admin"}
              </p>
              {isSuperAdmin && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-400 text-xs rounded-full">
                  SUPER ADMIN
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Logged in as:</span>
              </div>
              <span className="text-white">{user?.email}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <Activity size={16} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1c1c1c] border border-white/10 rounded-lg p-6"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-400 text-sm">+12.5%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Users className="text-amber-500" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">KYC Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.kycPending}</p>
                  <p className="text-gray-500 text-sm mt-3">
                    {stats.kycVerified || 0} verified
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FileText className="text-blue-500" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Email Verified</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.emailVerified}
                  </p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.totalUsers > 0
                              ? (stats.emailVerified / stats.totalUsers) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Shield className="text-green-500" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Countries</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.registrationByCountry
                      ? Object.keys(stats.registrationByCountry).length
                      : 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-3">
                    Active registrations
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Globe className="text-purple-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Tabs */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-lg">
          <div className="flex border-b border-white/10">
            {[
              { id: "users", label: "Users", icon: <Users size={18} /> },
              {
                id: "kyc",
                label: "KYC Requests",
                icon: <FileText size={18} />,
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: <BarChart3 size={18} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "text-amber-500 border-b-2 border-amber-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "kyc" && <AdminKYC />}
            {activeTab === "analytics" && <AdminAnalytics />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
