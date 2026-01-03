import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { Profile, KycStatusResponse, UpdateProfileDto, AvatarUploadResponse } from '@/types/profile';
import { ProfileService } from '@/services/Profile.service';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [profileData, kycData] = await Promise.all([
        ProfileService.getProfile(),
        ProfileService.getKycStatus(),
      ]);
      
      setProfile(profileData);
      setKycStatus(kycData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = async (updateData: UpdateProfileDto): Promise<{ success: boolean; profile?: Profile; error?: string }> => {
    try {
      const updatedProfile = await ProfileService.updateProfile(updateData);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Update failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Upload avatar - returns AvatarUploadResponse directly
  const uploadAvatar = async (file: File): Promise<AvatarUploadResponse> => {
    try {
      const response = await ProfileService.uploadAvatar(file);
      
      // Update profile state with new avatar
      if (profile) {
        setProfile({ 
          ...profile, 
          avatar: response.avatar,
          avatarUrl: response.avatarUrl 
        });
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Avatar upload failed';
      // Return error in the same format as success
      return {
        success: false,
        message: errorMessage,
        avatar: '',
        avatarUrl: '',
        error:''
      };
    }
  };

  // Refresh KYC status
  const refreshKycStatus = async (): Promise<{ success: boolean; kycStatus?: KycStatusResponse; error?: string }> => {
    try {
      const kycData = await ProfileService.getKycStatus();
      setKycStatus(kycData);
      return { success: true, kycStatus: kycData };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Failed to refresh KYC status' 
      };
    }
  };

  // Get current user from auth
  const getCurrentUser = () => {
    return authService.getCurrentUser();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Logout
  const logout = () => {
    authService.logout();
    setProfile(null);
    setKycStatus(null);
  };

  // Refresh profile
  const refreshProfile = async (): Promise<void> => {
    return fetchProfile();
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return {
    profile,
    kycStatus,
    loading,
    error,
    fetchProfile,
    refreshProfile,
    updateProfile,
    uploadAvatar,
    refreshKycStatus,
    getCurrentUser,
    isAuthenticated,
    logout,
  };
};