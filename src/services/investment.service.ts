// services/investment.service.ts
import API from "./api"

export interface InvestmentPlan {
  id: string
  name: string
  minInvestment: number
  maxInvestment: number
  returnLabel: string
  returnType: string
  periods: number
  capitalBack: boolean
  withdrawType: string
  isHot?: boolean
}

export interface Investment {
  _id: string
  user: string
  planId: string
  planName: string
  amount: number
  status: "ACTIVE" | "COMPLETED" | "CANCELLED"
  startDate: Date
  endDate?: Date
  expectedProfit: number
  actualProfit: number
  capitalBack: boolean
  periods: number
  currentPeriod: number
  createdAt: Date
  updatedAt: Date
}

export const InvestmentService = {
  // Get all investment plans
  getPlans: async (): Promise<InvestmentPlan[]> => {
    const { data } = await API.get("/api/investments/plans")
    return data
  },

  // Create new investment
  createInvestment: async (planId: string, amount: number): Promise<Investment> => {
    const { data } = await API.post("/api/investments", { planId, amount })
    return data
  },

  // Get user investments
  getMyInvestments: async (): Promise<Investment[]> => {
    const { data } = await API.get("/api/investments/me")
    return data
  },

  // Get investment by ID
  getInvestment: async (id: string): Promise<Investment> => {
    const { data } = await API.get(`/api/investments/${id}`)
    return data
  },

  // Cancel investment (if allowed)
  cancelInvestment: async (id: string): Promise<{ message: string }> => {
    const { data } = await API.delete(`/api/investments/${id}`)
    return data
  }
}