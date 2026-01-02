import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Calendar, ChevronDown, Loader2, ExternalLink, ShieldCheck, Bell, Globe, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useKyc } from '@/hooks/dashboard/useKyc';
import { useAuth } from '@/hooks/useAuth';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom hooks
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  const { kycStatus } = useKyc();
    const {  user } = useAuth(); 
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    gender: 'male',
    dob: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    city: '',
    zipCode: '',
    address: '',
    joiningDate: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        gender: profile.gender || 'male',
        dob: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        email: profile.email || '',
        phone: profile.phone || '',
        country: profile.country || 'Nigeria',
        city: profile.city || '',
        zipCode: profile.zipCode || '',
        address: profile.address || '',
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A',
      });
    }
  }, [profile]);

    const getAvatarUrl = () => {
    // Use avatarUrl if available
    if (user?.avatarUrl) {
      return user?.avatarUrl;
    }
    
    if (user?.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      return `${window.location.origin}${user.avatar}`;
    }
 
    return null;
  };

  const avatarUrl = getAvatarUrl();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveError(null); 
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
   
      const updateData: any = {};
      

      const updateFields = ['firstName', 'lastName', 'username', 'gender', 'phone', 'country', 'city', 'zipCode', 'address'];
      
      updateFields.forEach(field => {
        if (profileData[field as keyof typeof profileData] !== undefined) {
          updateData[field] = profileData[field as keyof typeof profileData];
        }
      });
      

      if (profileData.dob) {
        updateData.dateOfBirth = new Date(profileData.dob);
      }
      
      const result = await updateProfile(updateData);
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.error || 'Failed to update profile');
      }
    } catch (error: any) {
      setSaveError(error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadLoading(true);
    
    try {
      const result = await uploadAvatar(file);
      if (!result.success) {
        setSaveError(result.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      setSaveError(error.message || 'Failed to upload avatar');
    } finally {
      setUploadLoading(false);
  
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getKycStatusBadge = () => {
    if (!kycStatus) return null;
    
    const statusConfig = {
      none: { label: 'Not Verified', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      pending: { label: 'Under Review', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      verified: { label: 'Verified', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
      rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    
    const config = statusConfig[kycStatus.kycStatus] || statusConfig.none;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${config.color}`}>
        {kycStatus.kycStatus === 'verified' && <CheckCircle size={12} />}
        {kycStatus.kycStatus === 'rejected' && <AlertCircle size={12} />}
        {config.label}
      </div>
    );
  };

  const settingsCards = [
    {
      title: 'Security Settings',
      description: 'Password, 2FA, and security options',
      icon: <ShieldCheck className="text-amber-500" size={24} />,
      onClick: () => navigate('/dashboard/reset-password'),
      color: 'bg-amber-500/10 border-amber-500/20',
      badge: null,
    },
    {
      title: 'KYC Verification',
      description: 'Verify your identity',
      icon: <User className="text-green-500" size={24} />,
      onClick: () => navigate('/dashboard/kyc'),
      color: 'bg-green-500/10 border-green-500/20',
      badge: getKycStatusBadge(),
    },
    {
      title: 'Notification Settings',
      description: 'Email and push notifications',
      icon: <Bell className="text-blue-500" size={24} />,
      onClick: () => {},
      color: 'bg-blue-500/10 border-blue-500/20',
      badge: null,
    },
    {
      title: 'Language & Region',
      description: 'App language and timezone',
      icon: <Globe className="text-purple-500" size={24} />,
      onClick: () => {},
      color: 'bg-purple-500/10 border-purple-500/20',
      badge: null,
    },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-orange-500" size={32} />
          <p className="mt-4 text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-32 px-2 md:px-0">
      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Profile Settings
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Tier Level:
            </span>
            <span className="text-amber-500 font-black text-sm">
              Tesla Beginner
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {saveSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle size={16} />
            Profile updated successfully!
          </div>
        )}
        
        {saveError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {saveError}
          </div>
        )}

        {/* Quick Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {settingsCards.map((card, index) => (
            <button
              key={index}
              onClick={card.onClick}
              className={`flex flex-col items-start p-6 rounded-2xl border hover:border-white/30 transition-colors ${card.color} text-left relative`}
            >
              <div className="mb-4">{card.icon}</div>
              <div className="flex items-center justify-between w-full mb-2">
                <h4 className="text-lg font-bold text-white">{card.title}</h4>
                {card.badge && card.badge}
              </div>
              <p className="text-sm text-gray-400">{card.description}</p>
              {kycStatus?.kycStatus === 'rejected' && card.title === 'KYC Verification' && (
                <p className="text-xs text-red-400 mt-2">
                  Reason: {kycStatus.kycRejectionReason || 'Not specified'}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Avatar Upload */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl}  alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadLoading ? (
                  <Loader2 className="animate-spin text-white" size={18} />
                ) : (
                  <Camera size={18} className="text-white" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadLoading}
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Upload a new profile picture</p>
              <p className="text-[10px] text-gray-500">JPG, PNG or GIF, max 2MB</p>
              {uploadLoading && (
                <p className="text-xs text-amber-500 mt-2">Uploading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'First Name', editable: true },
            { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Last Name', editable: true },
            { label: 'Username', name: 'username', type: 'text', placeholder: 'Username', editable: true },
            {
              label: 'Gender',
              name: 'gender',
              type: 'select',
              options: ['male', 'female', 'other'],
              editable: true,
            },
            { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: 'Date of Birth', editable: true },
            {
              label: 'Email Address',
              name: 'email',
              type: 'email',
              placeholder: 'user@example.com',
              editable: false,
            },
            { label: 'Phone', name: 'phone', type: 'tel', placeholder: 'Phone Number', editable: true },
            { label: 'Country', name: 'country', type: 'text', placeholder: 'Country', editable: true },
            { label: 'City', name: 'city', type: 'text', placeholder: 'City', editable: true },
            { label: 'Zip Code', name: 'zipCode', type: 'text', placeholder: 'Zip Code', editable: true },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Address', editable: true },
            {
              label: 'Account Created',
              name: 'joiningDate',
              type: 'text',
              placeholder: 'N/A',
              editable: false,
            },
            {
              label: 'Referral ID',
              name: 'referralId',
              type: 'text',
              placeholder: profile?.referralId || 'N/A',
              editable: false,
            },
          ].map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
                {field.label}
              </label>
              <div className="relative group">
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    disabled={!field.editable || saveLoading}
                    value={profileData[field.name as keyof typeof profileData]}
                    onChange={handleProfileChange}
                    className={`w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-sm ${
                      !field.editable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } text-gray-300 focus:outline-none appearance-none shadow-inner`}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={
                      field.name === 'referralId'
                        ? field.placeholder
                        : profileData[field.name as keyof typeof profileData] || ''
                    }
                    onChange={handleProfileChange}
                    readOnly={!field.editable}
                    disabled={saveLoading}
                    placeholder={field.placeholder}
                    className={`w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-sm ${
                      !field.editable ? 'text-gray-500 italic bg-black/20 cursor-not-allowed' : 'text-gray-300'
                    } focus:outline-none transition shadow-inner disabled:opacity-50`}
                  />
                )}
                {field.type === 'select' && field.editable && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                )}
                {field.type === 'date' && field.editable && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Calendar size={18} />
                  </div>
                )}
                {!field.editable && field.name === 'email' && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <span className="text-xs font-bold">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* KYC Warning if not verified */}
        {kycStatus && !kycStatus.kycVerified && (
          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-amber-500 font-bold text-sm mb-1">Identity Verification Required</h4>
                <p className="text-gray-400 text-sm">
                  Complete KYC verification to unlock full platform features, including withdrawals.
                  Your current status is: <span className="font-bold">{kycStatus.kycStatus.toUpperCase()}</span>
                </p>
                <button
                  onClick={() => navigate('/dashboard/kyc')}
                  className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 flex justify-center md:justify-end">
          <button
            disabled={saveLoading || !profile}
            onClick={handleSaveProfile}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition transform active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving Changes...
              </>
            ) : (
              <>
                Save Changes <ExternalLink size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;