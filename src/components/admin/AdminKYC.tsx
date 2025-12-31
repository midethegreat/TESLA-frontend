// components/AdminKYC.tsx (Updated)
"use client";

import type React from "react";
import { useState } from "react";
import { Check, X, Loader2, ChevronDown, FileText, Users } from "lucide-react";
import { useAdminKYC } from "@/hooks/dashboard/useAdminKYC";
const AdminKYC: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { requests, loading, approveKYC, rejectKYC } = useAdminKYC();

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await approveKYC(userId);
    } catch (error) {
      console.error("Failed to approve KYC");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    setProcessingId(userId);
    try {
      await rejectKYC(userId, rejectReason);
      setRejectReason("");
      setExpandedId(null);
    } catch (error) {
      console.error("Failed to reject KYC");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <Loader2 className="animate-spin inline-block mr-2" size={20} />
          Loading KYC requests...
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No pending KYC requests
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.userId}
              className="bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === request.userId ? null : request.userId
                  )
                }
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
              >
                <div className="text-left">
                  <p className="font-semibold text-white">{request.fullName}</p>
                  <p className="text-sm text-gray-400">
                    {request.email} • {request.idType}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition ${
                    expandedId === request.userId ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedId === request.userId && (
                <div className="border-t border-white/10 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">
                        Date of Birth
                      </p>
                      <p className="text-white">{request.dob}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Submitted On</p>
                      <p className="text-white">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Email</p>
                      <p className="text-white text-sm">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">ID Type</p>
                      <p className="text-white capitalize">
                        {request.idType.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">ID Front</p>
                      {request.idFrontPath ? (
                        <img
                          src={request.idFrontPath}
                          alt="ID Front"
                          className="w-full h-48 object-cover rounded border border-white/10"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 rounded border border-white/10 flex items-center justify-center">
                          <FileText className="text-gray-600" size={48} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">ID Back</p>
                      {request.idBackPath ? (
                        <img
                          src={request.idBackPath}
                          alt="ID Back"
                          className="w-full h-48 object-cover rounded border border-white/10"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 rounded border border-white/10 flex items-center justify-center">
                          <FileText className="text-gray-600" size={48} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">
                        Selfie with Document
                      </p>
                      {request.selfiePath ? (
                        <img
                          src={request.selfiePath}
                          alt="Selfie"
                          className="w-full h-48 object-cover rounded border border-white/10"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 rounded border border-white/10 flex items-center justify-center">
                          <Users className="text-gray-600" size={48} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(request.userId)}
                      disabled={processingId === request.userId}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request.userId ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Check size={18} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.userId)}
                      disabled={processingId === request.userId}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request.userId ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <X size={18} />
                      )}
                      Reject
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Reason for rejection (required)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please provide a clear reason for rejection (minimum 5
                      characters)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminKYC;
