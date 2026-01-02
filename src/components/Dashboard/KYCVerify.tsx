// pages/KYCVerify.tsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronDown, Upload, Loader2, ShieldCheck } from 'lucide-react'
import { kycService } from '@/services/kyc.service'
import { useKyc } from '@/hooks/dashboard/useKyc'
import { useProfile } from '@/hooks/useProfile' 
import KYCStatusCard from './KYCStatusCard'


const KYCVerify: React.FC = () => {
  const navigate = useNavigate()
  const { kycStatus, loading: kycLoading, fetchKycStatus } = useKyc()
  const { profile } = useProfile() 
  
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [kycData, setKycData] = useState({
    fullName: '',
    country: 'Nigeria',
    idType: 'national_id' as 'national_id' | 'passport' | 'drivers_license',
    idNumber: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    gender: 'male' as 'male' | 'female' | 'other',
    occupation: '',
    sourceOfFunds: '',
    purposeOfAccount: '',
    nationality: 'Nigeria',
    idIssuedDate: '',
    idExpiryDate: ''
  })
  
  const [kycFront, setKycFront] = useState<File | null>(null)
  const [kycBack, setKycBack] = useState<File | null>(null)
  const [kycSelfie, setKycSelfie] = useState<File | null>(null)
  
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)


  useEffect(() => {
    if (kycStatus && (kycStatus.kycStatus === 'pending' || kycStatus.kycStatus === 'verified')) {

      setError(null)
      setSuccess(null)
    }
  }, [kycStatus])

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'front' | 'back' | 'selfie'
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`${target === 'front' ? 'ID Front' : target === 'back' ? 'ID Back' : 'Selfie'} image is too large. Max size is 10MB.`)
        return
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, and WebP are allowed.')
        return
      }
      
      // Store file
      if (target === 'front') {
        setKycFront(file)
        const reader = new FileReader()
        reader.onloadend = () => setFrontPreview(reader.result as string)
        reader.readAsDataURL(file)
      } else if (target === 'back') {
        setKycBack(file)
        const reader = new FileReader()
        reader.onloadend = () => setBackPreview(reader.result as string)
        reader.readAsDataURL(file)
      } else if (target === 'selfie') {
        setKycSelfie(file)
        const reader = new FileReader()
        reader.onloadend = () => setSelfiePreview(reader.result as string)
        reader.readAsDataURL(file)
      }
      
      setError(null)
    }
  }

  const handleKycSubmit = async () => {
    // Validate required fields
    if (!kycData.fullName || !kycData.dateOfBirth || !kycData.country || !kycData.idType || !kycData.idNumber) {
      setError('Please fill all required fields: Full Name, Date of Birth, Country, ID Type, and ID Number.')
      return
    }
    
    // Validate ID number
    if (!kycService.validateIdNumber(kycData.idNumber, kycData.idType)) {
      setError('Please enter a valid ID number.')
      return
    }
    
    // Validate files
    if (!kycFront || !kycBack || !kycSelfie) {
      setError('Please upload all required documents: ID Front, ID Back, and Selfie.')
      return
    }
    
    setIsSubmittingKyc(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Submit KYC data
      const result = await kycService.submitKYC(kycData, {
        idFront: kycFront,
        idBack: kycBack,
        selfie: kycSelfie
      })
      
      setSuccess(result.message)
      
      // Refresh KYC status
      await fetchKycStatus()
      
    } catch (err: any) {
      console.error('KYC submission error:', err)
      setError(err.response?.data?.message || 'Failed to submit KYC documents. Please try again.')
    } finally {
      setIsSubmittingKyc(false)
    }
  }

  const handleRetryKYC = () => {

    setKycData({
      fullName: '',
      country: 'Nigeria',
      idType: 'national_id',
      idNumber: '',
      dateOfBirth: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      gender: 'male',
      occupation: '',
      sourceOfFunds: '',
      purposeOfAccount: '',
      nationality: 'Nigeria',
      idIssuedDate: '',
      idExpiryDate: ''
    })
    setKycFront(null)
    setKycBack(null)
    setKycSelfie(null)
    setFrontPreview(null)
    setBackPreview(null)
    setSelfiePreview(null)
    setError(null)
    setSuccess(null)
  }

  if (kycLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-orange-500" size={32} />
          <p className="mt-4 text-gray-400 text-sm">Loading KYC status...</p>
        </div>
      </div>
    )
  }

  // Get full name from profile if available
  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : ''


  if (kycStatus && (kycStatus.kycStatus === 'pending' || kycStatus.kycStatus === 'verified')) {
    return (
      <div className="space-y-10 animate-in fade-in max-w-4xl mx-auto pb-32 px-4">
        <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">KYC Verification Status</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Track your identity verification progress
              </p>
            </div>
          </div>
          
          <KYCStatusCard 
            kycStatus={kycStatus} 
            fullName={fullName}
            onRetry={kycStatus.kycStatus === 'pending' ? handleRetryKYC : undefined}
          />
          
          <div className="pt-6 flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If KYC is rejected or none, show submission form
  const showForm = !kycStatus || kycStatus.kycStatus === 'none' || kycStatus.kycStatus === 'rejected'
  
  if (!showForm) {
    return null // Should not reach here, but as fallback
  }

  return (
    <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-32 px-2 md:px-0">
      {/* Error/Success Messages */}
      {error && (
        <div className="glass-card bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="glass-card bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="text-green-400 text-sm font-medium">{success}</p>
          <p className="text-green-300 text-xs mt-1">Your KYC status is being updated...</p>
        </div>
      )}
      
      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">KYC Verification</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Secure your account by verifying your identity
            </p>
          </div>
        </div>

        {/* Show previous rejection reason if any */}
        {kycStatus?.kycStatus === 'rejected' && kycStatus.kycRejectionReason && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h4 className="text-red-400 font-bold text-sm mb-1">Previous Rejection:</h4>
            <p className="text-gray-300 text-sm">{kycStatus.kycRejectionReason}</p>
            <p className="text-gray-400 text-xs mt-2">Please correct the issues above and resubmit.</p>
          </div>
        )}

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Full Name */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Full Legal Name *
            </label>
            <input
              type="text"
              placeholder="Enter full name as it appears on ID"
              value={kycData.fullName}
              onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition shadow-inner"
            />
          </div>
          
          {/* Date of Birth */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Date of Birth *
            </label>
            <div className="relative">
              <input
                type="date"
                value={kycData.dateOfBirth}
                onChange={(e) => setKycData({ ...kycData, dateOfBirth: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 shadow-inner"
                max={new Date().toISOString().split('T')[0]}
              />
              <Calendar
                size={18}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
          
          {/* Country */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">Country *</label>
            <div className="relative">
              <select
                value={kycData.country}
                onChange={(e) => setKycData({ ...kycData, country: e.target.value, nationality: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 appearance-none shadow-inner cursor-pointer"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          
          {/* ID Type */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Type of Document *
            </label>
            <div className="relative">
              <select
                value={kycData.idType}
                onChange={(e) => setKycData({ ...kycData, idType: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 appearance-none shadow-inner cursor-pointer"
              >
                <option value="national_id">National ID</option>
                <option value="passport">International Passport</option>
                <option value="drivers_license">Driver's License</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          
          {/* ID Number */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              ID Number *
            </label>
            <input
              type="text"
              placeholder="Enter ID number"
              value={kycData.idNumber}
              onChange={(e) => setKycData({ ...kycData, idNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition shadow-inner"
            />
          </div>
          
          {/* Phone */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={kycData.phone}
              onChange={(e) => setKycData({ ...kycData, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition shadow-inner"
            />
          </div>
        </div>

        {/* Additional Information (Optional fields) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              value={kycData.address}
              onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition shadow-inner"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              City
            </label>
            <input
              type="text"
              placeholder="Enter your city"
              value={kycData.city}
              onChange={(e) => setKycData({ ...kycData, city: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition shadow-inner"
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <h4 className="text-[12px] md:text-[14px] font-black text-white uppercase tracking-widest text-center md:text-left">
            Document Upload *
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Front of Document */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                Front of Document *
              </label>
              <div
                onClick={() => frontInputRef.current?.click()}
                className="aspect-video bg-[#1c1c1c] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-500/30 transition-all shadow-inner relative overflow-hidden group"
              >
                {frontPreview ? (
                  <>
                    <img
                      src={frontPreview}
                      className="w-full h-full object-cover"
                      alt="ID Front Preview"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium text-white">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-700 group-hover:text-amber-500/50" />
                    <span className="text-[9px] font-black uppercase text-gray-600">Click to Upload</span>
                  </div>
                )}
                <input
                  ref={frontInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'front')}
                />
              </div>
            </div>
            
            {/* Back of Document */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                Back of Document *
              </label>
              <div
                onClick={() => backInputRef.current?.click()}
                className="aspect-video bg-[#1c1c1c] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-500/30 transition-all shadow-inner relative overflow-hidden group"
              >
                {backPreview ? (
                  <>
                    <img
                      src={backPreview}
                      className="w-full h-full object-cover"
                      alt="ID Back Preview"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium text-white">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-700 group-hover:text-amber-500/50" />
                    <span className="text-[9px] font-black uppercase text-gray-600">Click to Upload</span>
                  </div>
                )}
                <input
                  ref={backInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'back')}
                />
              </div>
            </div>
            
            {/* Selfie with Document */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                Selfie with Document *
              </label>
              <div
                onClick={() => selfieInputRef.current?.click()}
                className="aspect-video bg-[#1c1c1c] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-500/30 transition-all shadow-inner relative overflow-hidden group"
              >
                {selfiePreview ? (
                  <>
                    <img
                      src={selfiePreview}
                      className="w-full h-full object-cover"
                      alt="Selfie Preview"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium text-white">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-700 group-hover:text-amber-500/50" />
                    <span className="text-[9px] font-black uppercase text-gray-600">Click to Upload</span>
                  </div>
                )}
                <input
                  ref={selfieInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'selfie')}
                />
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-500 text-center">
            * Required fields. Upload clear images of your ID and a selfie holding the ID.
            Max file size: 10MB each. Supported formats: JPG, PNG, WebP.
          </p>
        </div>

        <div className="pt-6 flex justify-center md:justify-end">
          <button
            disabled={isSubmittingKyc}
            onClick={handleKycSubmit}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-16 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.05] transition transform active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingKyc ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              'Submit Documents'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KYCVerify