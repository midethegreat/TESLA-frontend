export type KycStatus = "none" | "pending" | "verified" | "rejected";
export type TierLevel = "Tesla Beginner" | "Tesla Investor" | "Tesla Pro" | "Tesla Elite";

export interface Profile {
  _id: string;
  user: string; // User ID
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string; // Changed from Date to string for form handling
  country?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  joiningDate: string; // Changed from Date to string
  
  // KYC Fields
  kycStatus: KycStatus;
  kycVerified: boolean;
  kycSubmittedAt?: string | null;
  kycVerifiedAt?: string | null;
  kycRejectedAt?: string | null;
  kycRejectionReason?: string | null;
  
  // Referral
  referralId: string;
  
  // User info (populated)
  email?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string; // Changed to string for form compatibility
  country?: string;
  city?: string;
  zipCode?: string;
  address?: string;
}

export interface UserStats {
  availableBalance: number;
  totalDeposit: number;
  totalInvestment: number;
  totalProfit: number;
  totalWithdraw: number;
  totalTransfer: number;
  totalReferralBonus: number;
  totalDepositBonus: number;
  totalInvestmentBonus: number;
  referralCount: number;
  rankAchieved: number;
  totalTicket: number;
  tierLevel: TierLevel;
  tierPoints: number;
  totalEarnings: number;
  netProfit: number;
  // Profile info for display
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

export interface KycStatusResponse {
  kycStatus: KycStatus;
  kycVerified: boolean;
  kycSubmittedAt?: string | null;
  kycVerifiedAt?: string | null;
  kycRejectedAt?: string | null;
  kycRejectionReason?: string | null;
}

// Avatar upload response
export interface AvatarUploadResponse {
  error: string;
  success: boolean;
  message: string;
  avatar: string;
  avatarUrl: string;
}