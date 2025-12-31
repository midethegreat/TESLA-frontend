"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, Check } from "lucide-react"

interface PasswordResetProps {
  onClose: () => void
  isOpen: boolean
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onClose, isOpen }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<"current" | "new" | "confirm">("current")

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        throw new Error("Please fill in all fields")
      }

      if (passwords.new !== passwords.confirm) {
        throw new Error("New passwords do not match")
      }

      if (passwords.new.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to change password")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setPasswords({ current: "", new: "", confirm: "" })
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl max-w-md w-full">
        <div className="border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm flex items-center gap-2">
              <Check size={18} /> Password changed successfully!
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => handleInputChange("current", e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => handleInputChange("new", e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => handleInputChange("confirm", e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 flex items-center gap-2 transition"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordReset
