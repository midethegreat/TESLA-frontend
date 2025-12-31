"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Camera, Loader2, Copy, Check, ShieldCheck, Upload, LockIcon, User } from "lucide-react"
import { useProfile } from "../hooks/useProfile"
import type { Profile } from "@/types/profile"
import KYCVerification from "./KYCVerification"
import PasswordReset from "./PasswordReset"

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, uploadAvatar, loading } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [kycOpen, setKycOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const [formData, setFormData] = useState<Partial<Profile>>({})

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        country: profile.country,
        city: profile.city,
        zipCode: profile.zipCode,
        address: profile.address,
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : '',
      })
    }
  }, [profile])

const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.[0]) return
  setError(null)
  setSuccess(null)
  
  const file = e.target.files[0]
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError("Image size too large. Maximum size is 5MB.")
    e.target.value = ''
    return
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    e.target.value = ''
    return
  }
  
  // Create image preview and check dimensions
  const img = new Image()
  const url = URL.createObjectURL(file)
  
  img.onload = async () => {
    // Show preview with dimensions
    const dimensions = `${img.width} x ${img.height}`
    
    // Check if image is square (1:1 ratio)
    const ratio = img.width / img.height
    const isSquare = Math.abs(ratio - 1) < 0.1
    
    // Check if image is too small
    const isTooSmall = img.width < 200 || img.height < 200
    
    let message = `Image: ${dimensions} pixels`
    if (!isSquare) message += " (not square - will be cropped)"
    if (isTooSmall) message += " (may appear blurry)"
    
    const shouldUpload = window.confirm(
      `${message}\n\n` +
      `For best results, use a square image at least 400x400 pixels.\n` +
      `Would you like to upload this image?`
    )
    
    URL.revokeObjectURL(url)
    
    if (!shouldUpload) {
      // Reset the file input
      e.target.value = ''
      return
    }
    
    try {
      setUploading(true)
      const response = await uploadAvatar(file)
      
      // Check if upload was successful
      if (response.success) {
        setSuccess(response.message || "Profile picture updated successfully")
      } else {
        setError(response.message || "Failed to upload avatar")
      }
      
      // Refresh profile data (optional)
      // await fetchProfile()
      
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar")
    } finally {
      setUploading(false)
      setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 3000)
    }
  }
  
  img.onerror = () => {
    setError("Failed to load image. Please try another file.")
    URL.revokeObjectURL(url)
    e.target.value = ''
  }
  
  img.src = url
}

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (profile?.kycVerified) {
      setError("Your profile is locked after KYC verification. Contact support for changes.")
      return
    }

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setSuccess("Profile updated successfully")
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "email" || name === "joiningDate") return
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const referralLink = `${window.location.origin}/register?referral=${profile?.referralId || ""}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 pb-8">
      <h2 className="text-white text-2xl font-bold">Settings</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {profile?.kycStatus === "pending" && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="text-blue-400 animate-spin" size={20} />
          <div>
            <p className="text-blue-400 font-semibold">KYC in Review</p>
            <p className="text-blue-400/80 text-sm">Your KYC documents are being reviewed. This typically takes 24-48 hours.</p>
          </div>
        </div>
      )}

      {profile?.kycVerified && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="text-green-400" size={20} />
          <div>
            <p className="text-green-400 font-semibold">KYC Verified</p>
            <p className="text-green-400/80 text-sm">Your profile is locked. Contact support for changes.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Avatar */}
      {/* Avatar */}
<div className="space-y-3">
  <label className="text-white font-semibold text-sm">Avatar</label>
  <p className="text-xs text-gray-400">
    Recommended: Square image (1:1 ratio), minimum 400x400 pixels, max 5MB
  </p>
  <div className="bg-[#1c1c1c] border border-white/5 rounded-lg p-4">
    <div className="relative w-32 h-32 mx-auto">
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-dashed border-amber-500/50 flex items-center justify-center overflow-hidden">
        {(profile?.avatarUrl || profile?.avatar) ? (
          <img
            src={profile.avatarUrl || profile.avatar || ''}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              const placeholder = parent?.querySelector('.avatar-placeholder')
              if (placeholder) placeholder.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`avatar-placeholder ${(profile?.avatarUrl || profile?.avatar) ? 'hidden' : ''}`}>
          <User className="text-amber-500" size={40} />
        </div>
      </div>
      <label 
        htmlFor="profile-pic" 
        className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition ${
          profile?.kycVerified || uploading 
            ? 'bg-gray-500 cursor-not-allowed opacity-50' 
            : 'bg-amber-500 hover:bg-amber-600'
        }`}
        title={profile?.kycVerified ? "Profile locked after KYC verification" : "Upload avatar (max 5MB)"}
      >
        {uploading ? (
          <Loader2 size={16} className="text-black animate-spin" />
        ) : (
          <Camera size={16} className="text-black" />
        )}
      </label>
      <input 
        id="profile-pic" 
        type="file" 
        accept="image/*" 
        onChange={handleProfilePictureChange} 
        className="hidden" 
        disabled={profile?.kycVerified || uploading}
      />
    </div>
  </div>
</div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", name: "firstName", type: "text", required: true },
            { label: "Last Name", name: "lastName", type: "text", required: true },
            { label: "Username", name: "username", type: "text", required: true },
            { label: "Gender", name: "gender", type: "select", options: ["male", "female", "other"] },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Email", name: "email", type: "text", readOnly: true, required: true },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Country", name: "country", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Zip Code", name: "zipCode", type: "text" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-white text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={String(formData[field.name as keyof Profile] || "")}
                  onChange={handleInputChange}
                  disabled={profile?.kycVerified || loading}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Gender</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={String(formData[field.name as keyof Profile] || "")}
                  onChange={handleInputChange}
                  readOnly={field.readOnly}
                  disabled={profile?.kycVerified || loading || field.readOnly}
                  className={`w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition ${
                    field.readOnly ? "text-gray-500 cursor-not-allowed" : ""
                  }`}
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
        </div>

        {/* Address (full width) */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={String(formData.address || "")}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            disabled={profile?.kycVerified || loading}
            rows={3}
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your full address"
          />
        </div>

        {/* Joining Date (readonly) */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Joining Date</label>
          <input
            type="text"
            value={String(formData.joiningDate || "")}
            readOnly
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Referral Link */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <label className="text-white font-semibold text-sm">Referral Link</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none" 
            />
            <button 
              type="button" 
              onClick={copyReferralLink} 
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Share this link with others. When they register and verify their email, they'll appear in your referrals.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={loading || profile?.kycVerified}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] min-h-[44px]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "✎"}
            Save Changes
          </button>
        </div>
      </form>

      {/* KYC Section */}
      <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">KYC Verification</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
            profile?.kycStatus === "verified" 
              ? "bg-green-500/20 text-green-500" 
              : profile?.kycStatus === "pending"
              ? "bg-amber-500/20 text-amber-500"
              : "bg-gray-500/20 text-gray-500"
          }`}>
            {profile?.kycStatus?.toUpperCase() || "NOT STARTED"}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Complete KYC verification to unlock full platform features and increase withdrawal limits.
        </p>
        <button
          type="button"
          onClick={() => setKycOpen(true)}
          disabled={profile?.kycStatus === "pending" || profile?.kycVerified}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          {profile?.kycStatus === "pending" ? "KYC In Review" : 
           profile?.kycVerified ? "KYC Verified" : 
           "Start KYC Verification"}
        </button>
      </div>

      {/* Password Reset Section */}
      <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Change Password</h3>
        <p className="text-gray-400 text-sm mb-4">
          Update your password to keep your account secure. Use a strong password with at least 8 characters.
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setResetPasswordOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <LockIcon size={18} />
            Change Password
          </button>
        </div>
      </div>

      <KYCVerification isOpen={kycOpen} onClose={() => setKycOpen(false)} />
      <PasswordReset isOpen={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
    </div>
  )
}

export default ProfileSettings