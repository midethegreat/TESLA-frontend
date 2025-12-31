// services/kyc.service.ts
import API from "./api"
import type { AxiosResponse } from "axios"

export interface KYCData {
  fullName: string
  dateOfBirth: string
  country: string
  idType: "national_id" | "passport" | "drivers_license" | "other"
  idNumber: string
  idIssuedDate?: string
  idExpiryDate?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  gender?: string
  occupation?: string
  sourceOfFunds?: string
  purposeOfAccount?: string
  nationality?: string
}

export interface KYCStatus {
  kycStatus: "none" | "pending" | "verified" | "rejected"
  kycVerified: boolean
  kycSubmittedAt: string | null
  kycVerifiedAt: string | null
  kycRejectedAt: string | null
  kycRejectionReason: string | null
  fullName: string
  profileExists: boolean
}

export interface KYCDetails {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    gender?: string
    dateOfBirth?: string
    country?: string
    city?: string
    state?: string
    address?: string
    zipCode?: string
    joiningDate: string
  }
  kycInfo: {
    kycStatus: "none" | "pending" | "verified" | "rejected"
    kycVerified: boolean
    kycSubmittedAt: string | null
    kycVerifiedAt: string | null
    kycRejectedAt: string | null
    kycRejectionReason: string | null
  }
  kycDocuments?: {
    idType: "national_id" | "passport" | "drivers_license" | "other"
    idNumber: string
    idIssuedDate?: string
    idExpiryDate?: string
    occupation?: string
    sourceOfFunds?: string
    purposeOfAccount?: string
    idFrontImage: string | null
    idBackImage: string | null
    selfieWithDocument: string | null
  }
}

export interface KYCSubmission {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  country: string
  kycStatus: "none" | "pending" | "verified" | "rejected"
  kycSubmittedAt: string | null
  kycVerifiedAt: string | null
  kycRejectedAt: string | null
  kycRejectionReason: string | null
  user: {
    _id: string
    email: string
    firstName: string
    lastName: string
    createdAt: string
    lastLogin?: string
  }
}

export interface KYCStats {
  totals: {
    pending: number
    verified: number
    rejected: number
    all: number
  }
  today: {
    pending: number
    verified: number
    rejected: number
  }
  monthly: {
    verified: number
  }
}

class KYCService {
  // Submit KYC documents
  async submitKYC(data: KYCData, files: {
    idFront: File
    idBack: File
    selfie: File
  }): Promise<{ message: string; kycStatus: string; submissionDate: string }> {
    const formData = new FormData()
    
    // Add text fields
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof KYCData]
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value as string)
      }
    })
    
    // Add files
    formData.append("idFront", files.idFront)
    formData.append("idBack", files.idBack)
    formData.append("selfie", files.selfie)
    
    // Set proper content type for FormData
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    
    const response: AxiosResponse = await API.post("/kyc/submit", formData, config)
    return response.data
  }
  
  // Get current KYC status
  async getKYCStatus(): Promise<KYCStatus> {
    const response: AxiosResponse = await API.get("/kyc/status")
    return response.data
  }
  
  // Get detailed KYC information
  async getKYCDetails(): Promise<KYCDetails> {
    const response: AxiosResponse = await API.get("/kyc/my-details")
    return response.data
  }
  
  // Admin: Get all KYC submissions
  async getAllKYCSubmissions(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{
    submissions: KYCSubmission[]
    total: number
    page: number
    totalPages: number
  }> {
    const params: any = { page, limit }
    if (status) params.status = status
    
    const response: AxiosResponse = await API.get("/kyc/admin/submissions", { params })
    return response.data
  }
  
  // Admin: Get single KYC submission
  async getKYCSubmission(userId: string): Promise<any> {
    const response: AxiosResponse = await API.get(`/kyc/admin/submissions/${userId}`)
    return response.data
  }
  
  // Admin: Approve KYC
  async approveKYC(userId: string, notes?: string): Promise<{
    message: string
    profile: {
      kycStatus: string
      kycVerified: boolean
      kycVerifiedAt: string
      firstName: string
      lastName: string
    }
  }> {
    const response: AxiosResponse = await API.put(`/kyc/admin/approve/${userId}`, { notes })
    return response.data
  }
  
  // Admin: Reject KYC
  async rejectKYC(userId: string, reason: string): Promise<{
    message: string
    profile: {
      kycStatus: string
      kycVerified: boolean
      kycRejectedAt: string
      kycRejectionReason: string
    }
  }> {
    const response: AxiosResponse = await API.put(`/kyc/admin/reject/${userId}`, { reason })
    return response.data
  }
  
  // Admin: Get KYC statistics
  async getKYCStats(): Promise<KYCStats> {
    const response: AxiosResponse = await API.get("/kyc/admin/stats")
    return response.data
  }
  
  // Helper: Convert file to base64 (for preview)
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }
  
  // Helper: Validate ID number format
  validateIdNumber(idNumber: string, idType: string): boolean {
    if (!idNumber || idNumber.trim() === '') return false
    
    switch (idType) {
      case 'national_id':
        // Basic validation for Nigerian National ID (11 digits)
        return /^\d{11}$/.test(idNumber)
      case 'passport':
        // Passport numbers vary by country, basic validation
        return /^[A-Z0-9]{6,9}$/.test(idNumber)
      case 'drivers_license':
        // Driver's license validation
        return /^[A-Z0-9]{5,20}$/.test(idNumber)
      default:
        return idNumber.length >= 3 && idNumber.length <= 50
    }
  }
  
  // Helper: Get readable ID type name
  getIdTypeName(idType: string): string {
    switch (idType) {
      case 'national_id':
        return 'National ID'
      case 'passport':
        return 'International Passport'
      case 'drivers_license':
        return "Driver's License"
      case 'other':
        return 'Other Document'
      default:
        return idType
    }
  }
  
  // Helper: Get readable KYC status
  getKYCStatusText(status: string): string {
    switch (status) {
      case 'none':
        return 'Not Submitted'
      case 'pending':
        return 'Under Review'
      case 'verified':
        return 'Verified'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }
  
  // Helper: Get status color for UI
  getKYCStatusColor(status: string): string {
    switch (status) {
      case 'none':
        return 'text-gray-500'
      case 'pending':
        return 'text-yellow-500'
      case 'verified':
        return 'text-green-500'
      case 'rejected':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }
  
  // Helper: Mask ID number for display (for privacy)
  maskIdNumber(idNumber: string): string {
    if (!idNumber || idNumber.length < 4) return '****'
    const firstFour = idNumber.substring(0, 4)
    const lastFour = idNumber.substring(idNumber.length - 4)
    return `${firstFour}****${lastFour}`
  }
  
  // Helper: Format date for display
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

export const kycService = new KYCService()