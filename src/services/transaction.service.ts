import API from "./api"

export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "INVESTMENT" | "PROFIT" | "BONUS" | "REFERRAL_BONUS" | "DEPOSIT_BONUS" | "INVESTMENT_BONUS"
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"

export interface Transaction {
  _id: string
  user: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  description: string
  reference: string
  metadata: Record<string, any>
  walletAddress?: string
  cryptoAmount?: number
  token?: string
  recipientId?: string
  adminNote?: string
  processedBy?: string
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  _id: string
  user: string
  balance: number
  availableBalance: number
  lockedBalance: number
  totalDeposits: number
  totalWithdrawals: number
  totalInvestments: number
  totalProfits: number
  currency: string
  lastTransaction?: string
  createdAt: Date
  updatedAt: Date
}

export interface DepositRequest {
  amount: number
  token: string
  walletAddress?: string
  cryptoAmount?: number
}

export interface WithdrawRequest {
  amount: number
  token: string
  walletAddress: string
}

export interface PaginatedResponse {
  transactions: Transaction[]
  total: number
  page: number
  totalPages: number
}

export interface TransactionStats {
  totalDeposits: number
  totalDepositsCount: number
  totalWithdrawals: number
  totalWithdrawalsCount: number
  todayDeposits: number
  todayDepositsCount: number
  todayWithdrawals: number
  todayWithdrawalsCount: number
  monthlyDeposits: number
  monthlyDepositsCount: number
  monthlyWithdrawals: number
  monthlyWithdrawalsCount: number
  pendingDeposits: number
  pendingWithdrawals: number
  activeUsers: number
}

export interface WalletResponse {
  wallet: Wallet
  recentTransactions: Transaction[]
}

export const TransactionService = {
  // Get user transactions with pagination
  getMyTransactions: async (params?: {
    page?: number
    limit?: number
    type?: TransactionType
    status?: TransactionStatus
  }): Promise<PaginatedResponse> => {
    const { data } = await API.get("/api/transactions/me", { params })
    return data
  },

  // Get user wallet with recent transactions
  getMyWallet: async (): Promise<WalletResponse> => {
    const { data } = await API.get("/api/transactions/wallet")
    return data
  },

  // Get transaction by ID
  getTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await API.get(`/api/transactions/${id}`)
    return data
  },

  // Create deposit request
  createDeposit: async (depositData: DepositRequest): Promise<Transaction> => {
    const { data } = await API.post("/api/transactions/deposit", depositData)
    return data
  },

  // Create withdrawal request
  createWithdrawal: async (withdrawData: WithdrawRequest): Promise<Transaction> => {
    const { data } = await API.post("/api/transactions/withdraw", withdrawData)
    return data
  },

  // Verify deposit (admin only)
  verifyDeposit: async (transactionId: string, adminNote?: string): Promise<{ message: string; transaction: Transaction }> => {
    const { data } = await API.post(`/api/transactions/${transactionId}/verify`, { adminNote })
    return data
  },

  // Approve withdrawal (admin only)
  approveWithdrawal: async (transactionId: string, adminNote?: string, transactionHash?: string): Promise<{ message: string; transaction: Transaction }> => {
    const { data } = await API.post(`/api/transactions/${transactionId}/approve`, { adminNote, transactionHash })
    return data
  },

  // Reject transaction (admin only)
  rejectTransaction: async (transactionId: string, adminNote?: string): Promise<{ message: string; transaction: Transaction }> => {
    const { data } = await API.post(`/api/transactions/${transactionId}/reject`, { adminNote })
    return data
  },

  // Get all transactions (admin only)
  getAllTransactions: async (params?: {
    page?: number
    limit?: number
    type?: TransactionType
    status?: TransactionStatus
    userId?: string
  }): Promise<PaginatedResponse> => {
    const { data } = await API.get("/api/transactions/admin/all", { params })
    return data
  },

  // Get transaction statistics (admin only)
  getTransactionStats: async (): Promise<TransactionStats> => {
    const { data } = await API.get("/api/transactions/admin/stats")
    return data
  },

  // Add funds (admin only - for testing)
  addFunds: async (userId: string, amount: number, description?: string): Promise<{
    message: string
    transaction: Transaction
    wallet: Wallet
  }> => {
    const { data } = await API.post("/api/transactions/admin/add-funds", {
      userId,
      amount,
      description
    })
    return data
  }
}