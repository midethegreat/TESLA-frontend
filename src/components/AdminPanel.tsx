"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Users, FileText, Loader2 } from "lucide-react"


interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  country: string
  emailVerified: boolean
  createdAt: string
}

interface AdminDocument {
  id: string
  fileName: string
  fileType: string
  filePath: string
  fileSize: number
  uploadedAt: string
  email: string
  firstName: string
  lastName: string
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "uploads" | "images">("uploads")
  const [users, setUsers] = useState<AdminUser[]>([])
  const [documents, setDocuments] = useState<AdminDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("uploads")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "uploads" ? "bg-amber-500 text-black" : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          <FileText size={18} />
          Documents
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "users" ? "bg-amber-500 text-black" : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          <Users size={18} />
          Users
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : activeTab === "uploads" ? (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">
            {documents.length > 0 ? `${documents.length} Documents Uploaded` : "No Documents"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">File Name</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Size</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Uploaded</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-white">
                      {doc.firstName} {doc.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-300 truncate">{doc.fileName}</td>
                    <td className="px-4 py-3 text-gray-400">{(doc.fileSize / 1024).toFixed(2)} KB</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`${import.meta.env.VITE_API_URL}${doc.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:text-amber-400 transition"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-white font-semibold">
            {users.length > 0 ? `${users.length} Registered Users` : "No Users"}
          </h3>
          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {user.country} •{" "}
                      {user.emailVerified ? (
                        <span className="text-green-400">Verified</span>
                      ) : (
                        <span className="text-orange-400">Pending Verification</span>
                      )}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
