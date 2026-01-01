import type React from "react";
import { useState } from "react";
import { Users, FileText, Loader2, Download } from "lucide-react";
import { useAdminUsers } from "@/hooks/dashboard/useAdminUsers";
import { useAdminDocuments } from "@/hooks/dashboard/useAdminDocuments";
import { adminService } from "@/services/admin.service";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "documents">(
    "documents"
  );
  const { users, loading: usersLoading } = useAdminUsers();
  const { documents, loading: docsLoading } = useAdminDocuments();

  const currentUser = adminService.getAdminUser();
  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  const loading = activeTab === "users" ? usersLoading : docsLoading;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "documents"
              ? "bg-amber-500 text-black"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          <FileText size={18} />
          Documents
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "users"
              ? "bg-amber-500 text-black"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          <Users size={18} />
          Users
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <p className="text-gray-400">
            Loading {activeTab === "documents" ? "documents" : "users"}...
          </p>
        </div>
      ) : activeTab === "documents" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">
              {documents.length > 0
                ? `${documents.length} Document${
                    documents.length === 1 ? "" : "s"
                  } Uploaded`
                : "No Documents Found"}
            </h3>
            <button className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold py-2 px-4 rounded-lg transition">
              <Download size={16} />
              Export
            </button>
          </div>

          {documents.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1c1c1c] border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      File Name
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      Size
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      Uploaded
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-white/5 hover:bg-white/5 transition last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {doc.firstName} {doc.lastName}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {doc.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="text-gray-300 truncate max-w-xs"
                          title={doc.fileName}
                        >
                          {doc.fileName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400 text-xs uppercase bg-white/5 px-2 py-1 rounded">
                          {doc.fileType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {formatDate(doc.uploadedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <a
                            href={doc.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-500 hover:text-amber-400 transition text-sm font-medium"
                          >
                            View
                          </a>
                          {isSuperAdmin && (
                            <>
                              <span className="text-gray-600">•</span>
                              <button className="text-blue-500 hover:text-blue-400 transition text-sm font-medium">
                                Download
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                No documents uploaded
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Users haven't uploaded any documents yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">
              {users.length > 0
                ? `${users.length} Registered User${
                    users.length === 1 ? "" : "s"
                  }`
                : "No Users Found"}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users..."
                className="bg-[#0d0d0d] border border-white/10 rounded-lg py-2 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.slice(0, 12).map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Country:</span>
                          <span className="text-white">
                            {user.country || "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Joined:</span>
                          <span className="text-gray-400">
                            {user.createdAt ? formatDate(user.createdAt) : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">KYC:</span>
                          <span
                            className={`px-2 py-1 rounded ${getKYCStatusColor(
                              user.kycStatus
                            )}`}
                          >
                            {getKYCStatusText(user.kycStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-semibold">
                      Referrals: {user.referralCount || 0}
                    </span>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        user.emailVerified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      Email: {user.emailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                No users found
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                No users have registered yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions for KYC status
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
export default AdminPanel;
