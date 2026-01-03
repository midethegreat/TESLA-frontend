// services/referral.service.ts
import API from "./api"

export interface Referral {
  _id: string
  referrerId: string
  referredUserId: string
  bonusAmount: number
  status: "PENDING" | "PAID"
  createdAt: Date
}

export interface ReferralStats {
  totalReferrals: number
  totalEarnings: number
  pendingEarnings: number
  referralCode: string
  referralUrl: string
}

export const ReferralService = {
  // Get referral stats
  getStats: async (): Promise<ReferralStats> => {
    const { data } = await API.get("/api/referrals/stats")
    return data
  },

  // Get referral history
  getHistory: async (): Promise<Referral[]> => {
    const { data } = await API.get("/api/referrals/history")
    return data
  },

  // Generate referral URL
  generateReferralUrl: (referralId: string): string => {
    const baseUrl = window.location.origin
    return `${baseUrl}/register?ref=${referralId}`
  },

  // Get referral details by code
  getByCode: async (code: string): Promise<{ referrerId: string, email: string }> => {
    const { data } = await API.get(`/api/referrals/code/${code}`)
    return data
  }
}