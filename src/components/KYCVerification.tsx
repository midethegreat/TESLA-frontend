"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X, Loader2, Check } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface KYCVerificationProps {
  onClose: () => void
  isOpen: boolean
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ onClose, isOpen }) => {
  const { user } = useAuth()
  const [step, setStep] = useState<"form" | "upload" | "submit">("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [kycData, setKycData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "",
    dob: user?.dateOfBirth || "",
    idType: "passport",
  })

  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  })

  const [previews, setPreviews] = useState({
    idFront: "",
    idBack: "",
    selfie: "",
  })

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setKycData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (field: "idFront" | "idBack" | "selfie") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }))

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviews((prev) => ({
        ...prev,
        [field]: event.target?.result as string,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!kycData.fullName || !kycData.dob || !kycData.idType) {
        throw new Error("Please fill in all required fields")
      }

      if (!files.idFront || !files.idBack || !files.selfie) {
        throw new Error("Please upload all required documents")
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("fullName", kycData.fullName)
      formData.append("dob", kycData.dob)
      formData.append("idType", kycData.idType)
      formData.append("idFront", files.idFront)
      formData.append("idBack", files.idBack)
      formData.append("selfie", files.selfie)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kyc/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit KYC")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setStep("form")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1c1c1c] border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">KYC Verification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm flex items-center gap-2">
              <Check size={18} /> KYC submitted successfully! Admin will review soon.
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Personal Information</h3>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={kycData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={kycData.dob}
                  onChange={handleInputChange}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">ID Type *</label>
                <select
                  name="idType"
                  value={kycData.idType}
                  onChange={handleInputChange}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="passport">Passport</option>
                  <option value="national-id">National ID</option>
                  <option value="driver-license">Driver's License</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Documents *</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["idFront", "idBack", "selfie"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="text-white text-sm font-medium capitalize">
                    {field === "idFront" ? "ID Front" : field === "idBack" ? "ID Back" : "Selfie with ID"}
                  </label>
                  <div
                    className="border-2 border-dashed border-amber-500/30 rounded-lg p-4 text-center cursor-pointer hover:border-amber-500/60 transition"
                    onClick={() => {
                      const input = document.getElementById(`file-${field}`) as HTMLInputElement
                      input?.click()
                    }}
                  >
                    {previews[field as keyof typeof previews] ? (
                      <img
                        src={previews[field as keyof typeof previews] || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-amber-500 mb-2" />
                        <p className="text-xs text-gray-400">Click to upload</p>
                      </div>
                    )}
                    <input
                      id={`file-${field}`}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange(field as "idFront" | "idBack" | "selfie")}
                      className="hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-white/10">
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
              Submit KYC
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default KYCVerification
