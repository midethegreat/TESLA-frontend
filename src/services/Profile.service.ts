import type { 
  Profile, 
  UpdateProfileDto, 
  UserStats, 
  KycStatusResponse,
  AvatarUploadResponse 
} from "@/types/profile"
import API from "./api"

export const ProfileService = {
  // Get user profile
  getProfile: async (): Promise<Profile> => {
    try {
      const { data } = await API.get("/api/profile/me")
      return data
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      throw error
    }
  },

  // Update profile
  updateProfile: async (profileData: UpdateProfileDto): Promise<Profile> => {
    try {
      const { data } = await API.put("/api/profile/me", profileData)
      return data
    } catch (error: any) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  // Get user statistics for dashboard
  getStats: async (): Promise<UserStats> => {
    try {
      const { data } = await API.get("/api/profile/stats")
      return data
    } catch (error: any) {
      console.error("Error fetching stats:", error)
      throw error
    }
  },

  // Get KYC status
  getKycStatus: async (): Promise<KycStatusResponse> => {
    try {
      const { data } = await API.get("/api/profile/kyc-status")
      return data
    } catch (error: any) {
      console.error("Error fetching KYC status:", error)
      throw error
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const { data } = await API.post("/api/profile/avatar", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      })
      return data
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      throw error
    }
  },
};