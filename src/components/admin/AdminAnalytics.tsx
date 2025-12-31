// components/AdminAnalytics.tsx (Updated)
"use client";

import type React from "react";
import { FileText, Users } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/dashboard/useAdminAnalytics";

const AdminAnalytics: React.FC = () => {
  const { analytics, loading } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-700 rounded w-1/5"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Registrations</p>
          <p className="text-4xl font-bold text-white">
            {analytics?.totalUsers || 0}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Email Verified</p>
          <p className="text-4xl font-bold text-green-400">
            {analytics?.emailVerified || 0}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">KYC Verified</p>
          <p className="text-4xl font-bold text-amber-400">
            {analytics?.kycVerified || 0}
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Pending KYC</p>
          <p className="text-4xl font-bold text-blue-400">
            {analytics?.kycPending || 0}
          </p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">
          Registration by Country
        </h3>
        <div className="space-y-2">
          {analytics?.registrationByCountry &&
            Object.entries(analytics.registrationByCountry).map(
              ([country, count]) => (
                <div
                  key={country}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-400">{country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded"
                        style={{
                          width: `${
                            (count / (analytics?.totalUsers || 1)) * 100
                          }%`,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                    <span className="text-white font-semibold min-w-8">
                      {count}
                    </span>
                  </div>
                </div>
              )
            )}
        </div>
      </div>

      {/* Additional analytics section */}
      {analytics?.activityStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">
              Daily Registrations (Last 7 Days)
            </h3>
            <div className="space-y-2">
              {analytics.activityStats.dailyRegistrations.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <Users className="text-amber-500" size={16} />
                    <span className="text-white font-semibold">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">
              Daily KYC Submissions (Last 7 Days)
            </h3>
            <div className="space-y-2">
              {analytics.activityStats.kycSubmissions.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-500" size={16} />
                    <span className="text-white font-semibold">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
