import type React from "react";
import { useState } from "react";
import {
  Users,
  FileText,
  BarChart3,
  Shield,
  TrendingUp,
  Globe,
} from "lucide-react";

import AdminUsers from "./AdminUsers";
import AdminKYC from "./AdminKYC";
import AdminAnalytics from "./AdminAnalytics";
import { useAdminDashboard } from "@/hooks/dashboard/useAdminDashboard";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "kyc" | "analytics">(
    "users"
  );
  const { stats, loading } = useAdminDashboard();

  return (
    <div className="space-y-6">
      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6"
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
          <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-amber-500/5 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-400 text-sm">+12.5%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Users className="text-amber-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-blue-500/5 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">KYC Pending</p>
                <p className="text-3xl font-bold mt-2">{stats.kycPending}</p>
                <p className="text-gray-500 text-sm mt-3">
                  {stats.kycVerified || 0} verified
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <FileText className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-green-500/5 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Email Verified</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.emailVerified}
                </p>
                <div className="mt-3">
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
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
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <Shield className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-purple-500/5 transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Countries</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.registrationByCountry
                    ? Object.keys(stats.registrationByCountry).length
                    : 0}
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  Active registrations
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Globe className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-white/10 bg-white/5">
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
              className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 border-r border-white/10 last:border-r-0 ${
                activeTab === tab.id
                  ? "text-amber-500 bg-amber-500/5 border-b-2 border-b-amber-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
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
  );
};

export default AdminDashboard;
