import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard,
  Layers,
  History,
  ArrowLeftRight,
  PlusCircle,
  ArrowUpCircle,
  Award,
  Users,
  SettingsIcon,
  LifeBuoy,
  LogOut,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  User,
  Ticket,
  Percent,
  Star,
  Zap,
  MousePointer2,
  Briefcase,
  RefreshCw,
  Clock,
  Ban,
  CheckCircle2,
  Check,
  LinkIcon,
  TrendingUp,
  Home,
  UserPlus,
  ExternalLink,
  Camera,
  Calendar,
  Lock,
  ShieldCheck,
  Loader2,
  Megaphone,
  UserCircle2,
  FolderOpen,
  DollarSign,
  Trophy,
  ArrowUpFromLine,
  X,
  Upload,
  Fingerprint,
} from "lucide-react"
import { INVESTMENT_PLANS } from "@/const/constants"
import type { InvestmentPlan } from "@/types/types"
import DocumentUpload from "./DocumentUpload"
import ProfileSettings from "./ProfileSettings"
import AdminPanel from "./AdminPanel"




type TabType =
  | "dashboard"
  | "all-schemas"
  | "logs"
  | "transactions"
  | "add-money"
  | "withdraw"
  | "ranking"
  | "referral"
  | "settings"
  | "support"
  | "notifications"
  | "kyc-verify"
  | "reset-password"
  | "schema-preview"

const WALLET_ADDRESSES = {
  BTC: "bc1qtwpjzek0287rwf7czvsrc8x8tnnxk87hymcvvk",
  "ETH (ERC20)": "0x4dFdE34c560637496A5825003fE71B3D0a571a1a",
  "USDT (TRC20)": "TWWRQmKytJjxMZSbD9gpdU9jKsB5Dzy7xp",
}

const BADGES = [
  {
    title: "Tesla Investment Beginner",
    condition: "By signing up to the account",
    id: 1,
  },
  {
    title: "Tesla Investment",
    condition: "By earning $30 from the site",
    id: 2,
  },
]

const BadgeCard: React.FC<{ title: string; condition: string }> = ({ title, condition }) => (
  <div className="w-full bg-[#1c1c1c]/40 border border-white/5 rounded-[2.5rem] p-10 md:p-12 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500 hover:border-white/10 transition-colors group">
    <div className="space-y-1">
      <span className="text-[10px] md:text-[12px] font-medium text-gray-500 uppercase tracking-[0.3em]">ranking-</span>
      <span className="text-[10px] md:text-[12px] font-medium text-gray-500 uppercase tracking-[0.3em] block">
        badge
      </span>
    </div>

    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight max-w-[240px] group-hover:scale-105 transition-transform">
      {title}
    </h3>

    <div className="bg-[#2a2a2a]/60 border border-white/10 rounded-full px-6 py-3.5 shadow-inner">
      <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
        {condition}
      </span>
    </div>
  </div>
)

const SchemaCard: React.FC<{ plan: InvestmentPlan; onInvest: (plan: InvestmentPlan) => void }> = ({
  plan,
  onInvest,
}) => (
  <div
    className={`relative w-full rounded-[1.5rem] overflow-hidden border transition-all duration-500 flex flex-col glass-card group ${plan.isHot ? "border-amber-500/30 bg-[#1a140d]/80" : "border-white/5 bg-[#0d0d0d]/80"}`}
  >
    <div className="relative h-28 flex flex-col justify-center px-6 overflow-hidden flex-shrink-0">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 transform translate-x-8 -translate-y-8 pointer-events-none">
        <img
          src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-2xl font-black tracking-tight uppercase text-white relative z-10">{plan.name}</h3>
      <div className="flex items-center gap-2 mt-1 relative z-10">
        <span className="bg-white/10 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
          {plan.returnLabel}
        </span>
        {plan.isHot && (
          <span className="bg-orange-500/20 text-orange-400 text-[8px] font-black px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">
            HOT SCHEMA
          </span>
        )}
      </div>
    </div>

    <div className="px-6 py-6 space-y-4 flex-grow flex flex-col">
      {[
        {
          label: "Investment",
          val: `$${plan.minInvestment}-$${plan.maxInvestment}`,
          icon: <MousePointer2 size={12} className="text-gray-500" />,
        },
        {
          label: "Capital Back",
          val: plan.capitalBack ? "Yes" : "No",
          icon: <Briefcase size={12} className="text-gray-500" />,
        },
        { label: "Return Type", val: plan.returnType, icon: <RefreshCw size={12} className="text-gray-500" /> },
        { label: "Periods", val: `${plan.periods} Times`, icon: <Clock size={12} className="text-gray-500" /> },
        { label: "Withdraw", val: plan.withdrawType, icon: <Wallet size={12} className="text-gray-500" /> },
        { label: "Cancel", val: "In 30 Minutes", icon: <Ban size={12} className="text-gray-500" /> },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center text-[11px] font-medium">
          <div className="flex items-center gap-3 text-gray-400 uppercase tracking-wider">
            {item.icon}
            {item.label}
          </div>
          <div className="text-amber-500 font-bold">{item.val}</div>
        </div>
      ))}

      <div className="pt-6 mt-auto flex flex-col items-center gap-3">
        <button
          onClick={() => onInvest(plan)}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition transform shadow-xl shadow-amber-500/10 active:scale-95"
        >
          <CheckCircle2 size={14} fill="currentColor" className="text-amber-500" />
          <span className="text-white drop-shadow-md">Invest Now</span>
        </button>
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isKycWarningVisible, setKycWarningVisible] = useState(false)
  const [isKycVerified, setIsKycVerified] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const lastKycWarningTimeRef = useRef<number>(0)

  const telegramUrl = "https://t.me/Allyssabroker"

  // Balance Management
  const availableBalance = 0

  // Investment Preview State
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [investAmount, setInvestAmount] = useState<string>("")

  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: "mid",
    lastName: "jole",
    username: "Username",
    gender: "male",
    dob: "",
    phone: "",
    country: "Nigeria",
    city: "",
    zipCode: "",
    address: "",
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const registrationDate = "N/A" // Assuming Firebase is removed, this needs to be fetched differently or set

  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Price State
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})
  const [isPricesLoading, setIsPricesLoading] = useState(true)

  // Deposit State
  const [depositStep, setDepositStep] = useState<"entry" | "payment">("entry")
  const [selectedToken, setSelectedToken] = useState<keyof typeof WALLET_ADDRESSES | "">("")
  const [depositAmount, setDepositAmount] = useState<string>("")
  const [addressCopied, setAddressCopied] = useState(false)

  // Withdrawal State
  const [withdrawStep, setWithdrawStep] = useState<"amount" | "address">("amount")
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")
  const [withdrawAddress, setWithdrawAddress] = useState<string>("")
  const [withdrawReceiveToken, setWithdrawReceiveToken] = useState<string>("BTC")
  const withdrawalCharge = 0

  // KYC Verification State
  const [kycData, setKycData] = useState({
    fullName: "",
    country: "Nigeria",
    docType: "National ID",
    dob: "",
  })
  const [kycFront, setKycFront] = useState<string | null>(null)
  const [kycBack, setKycBack] = useState<string | null>(null)
  const [kycSelfie, setKycSelfie] = useState<string | null>(null)
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch Live Prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
        )
        if (!response.ok) throw new Error("Price service unavailable")
        const data = await response.json()
        setTokenPrices({
          BTC: data.bitcoin.usd,
          "ETH (ERC20)": data.ethereum.usd,
          "USDT (TRC20)": data.tether.usd,
        })
      } catch (error) {
        console.error("Error fetching prices:", error)
        // Fallback to static prices if API fails
        setTokenPrices({ BTC: 98500, "ETH (ERC20)": 2650, "USDT (TRC20)": 1 })
      } finally {
        setIsPricesLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const storedReferrals = JSON.parse(localStorage.getItem("tesla_referrals") || "[]")
    setReferrals(storedReferrals)

    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [activeTab])

  // KYC Auto-dismiss Timer Effect
  useEffect(() => {
    let timer: any
    if (isKycWarningVisible) {
      timer = setTimeout(() => {
        setKycWarningVisible(false)
      }, 5000) // 5 seconds
    }
    return () => clearTimeout(timer)
  }, [isKycWarningVisible])

  const referralId = "YbYSaqsQ" // Hardcoded for now, replace with actual user ID logic
  const referralUrl = `https://investwithtsla.web.app/register.html?invite=${referralId}Zg`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setAddressCopied(true)
    setTimeout(() => setAddressCopied(false), 2000)
  }

  const handleTabChange = (id: TabType) => {
    setProfileDropdownOpen(false)
    setNotificationOpen(false)

    const now = Date.now()
    const cooldownPeriod = 5 * 60 * 1000 // 5 minutes in ms

    if (
      !isKycVerified &&
      id !== "kyc-verify" &&
      id !== "settings" &&
      now - lastKycWarningTimeRef.current > cooldownPeriod
    ) {
      setKycWarningVisible(false)
      setTimeout(() => {
        setKycWarningVisible(true)
        lastKycWarningTimeRef.current = Date.now()
      }, 10)
    }

    if (id === "support") {
      window.open(telegramUrl, "_blank")
      // Don't change activeTab if opening in new tab
    } else {
      setActiveTab(id)
      if (id === "add-money") setDepositStep("entry")
      if (id === "withdraw") setWithdrawStep("amount")
    }
  }

  const handleOpenPreview = (plan: InvestmentPlan) => {
    setSelectedPlan(plan)
    setInvestAmount(plan.minInvestment.toString())
    setActiveTab("schema-preview")
  }

  const calculateCryptoAmount = () => {
    if (!selectedToken || !depositAmount || !tokenPrices[selectedToken]) return "0.000000"
    const usd = Number.parseFloat(depositAmount)
    const price = tokenPrices[selectedToken]
    return (usd / price).toFixed(selectedToken === "BTC" ? 8 : 6)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSaveProfile = async () => {
    setSaveLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSaveLoading(false)
    alert("Profile updated successfully!")
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "avatar" | "front" | "back" | "selfie",
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        if (target === "avatar") setAvatarPreview(result)
        if (target === "front") setKycFront(result)
        if (target === "back") setKycBack(result)
        if (target === "selfie") setKycSelfie(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleKycSubmit = async () => {
    if (!kycData.fullName || !kycData.dob || !kycFront || !kycBack || !kycSelfie) {
      alert("Please fill all fields and upload all required documents.")
      return
    }
    setIsSubmittingKyc(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmittingKyc(false)
    setIsKycVerified(true)
    alert("KYC documents submitted successfully for review!")
    handleTabChange("dashboard")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError(null)
    setResetLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResetSuccess(true)
    setResetLoading(false)
  }

  const menuItems: { id: TabType; name: string; icon: React.ReactNode }[] = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "all-schemas", name: "All Schemas", icon: <Layers size={18} /> },
    { id: "logs", name: "Schema Logs", icon: <History size={18} /> },
    { id: "transactions", name: "All Transactions", icon: <ArrowLeftRight size={18} /> },
    { id: "add-money", name: "Add Money", icon: <PlusCircle size={18} /> },
    { id: "withdraw", name: "Withdraw", icon: <ArrowUpCircle size={18} /> },
    { id: "ranking", name: "Ranking Badge", icon: <Award size={18} /> },
    { id: "referral", name: "Referral", icon: <Users size={18} /> },
    { id: "settings", name: "Settings", icon: <SettingsIcon size={18} /> },
    { id: "support", name: "Support Tickets", icon: <LifeBuoy size={18} /> },
  ]

  const bottomNavItems = [
    { id: "dashboard", label: "Home", icon: <Home size={22} /> },
    { id: "add-money", label: "Deposit", icon: <Wallet size={22} /> },
    { id: "all-schemas", label: "Plans", icon: <Layers size={22} /> },
    { id: "referral", label: "Referral", icon: <UserPlus size={22} /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon size={22} /> },
  ]

  const stats = [
    { label: "Total Deposit", value: "$0", color: "bg-[#e2f9cc]", textColor: "text-black", icon: <Wallet size={16} /> },
    {
      label: "Total Investment",
      value: "$0.00",
      color: "bg-[#d9e8fb]",
      textColor: "text-black",
      icon: <Layers size={16} />,
    },
    {
      label: "Total Profit",
      value: "$0.00",
      color: "bg-[#f9f3d1]",
      textColor: "text-black",
      icon: <Percent size={16} />,
    },
    {
      label: "Total Transfer",
      value: "$0.00",
      color: "bg-[#f2f2f2]",
      textColor: "text-black",
      icon: <ArrowUpRight size={16} />,
    },
    {
      label: "Total Withdraw",
      value: "$0.00",
      color: "bg-[#eaf4ff]",
      textColor: "text-black",
      icon: <ArrowUpCircle size={16} />,
    },
    {
      label: "Profit",
      value: "$0",
      color: "bg-[#f2f2f2]",
      textColor: "text-gray-400",
      icon: <AlertTriangle size={16} />,
    },
    { label: "Referral Bonus", value: "$0", color: "bg-[#e7f90e]", textColor: "text-black", icon: <Users size={16} /> },
    { label: "Deposit Bonus", value: "$0", color: "bg-[#fbe0d7]", textColor: "text-black", icon: <Zap size={16} /> },
    {
      label: "Investment Bonus",
      value: "$0",
      color: "bg-[#d8dbff]",
      textColor: "text-black",
      icon: <Award size={16} />,
    },
    {
      label: "Total Referral",
      value: referrals.length.toString(),
      color: "bg-[#e2f9f5]",
      textColor: "text-black",
      icon: <User size={16} />,
    },
    { label: "Rank Achieved", value: "1", color: "bg-[#f9ebea]", textColor: "text-black", icon: <Star size={16} /> },
    { label: "Total Ticket", value: "0", color: "bg-[#f9f9db]", textColor: "text-black", icon: <Ticket size={16} /> },
  ]

  const renderDashboardHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-32 lg:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-2 md:px-0">
        <div className="lg:col-span-7">
          <div className="glass-card bg-[#141414] border border-white/5 rounded-[2.5rem] p-1 overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="bg-gradient-to-br from-[#ffd700] via-[#ffcc00] to-[#ffa500] p-6 md:p-10 rounded-[2.3rem] space-y-4 flex-grow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
              <span className="text-black font-black text-4xl md:text-6xl block tracking-tighter">
                ${availableBalance}
              </span>
              <div className="flex items-center gap-2 text-black/60">
                <Wallet size={18} />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
                  Available Balance
                </span>
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => handleTabChange("add-money")}
                className="flex-grow py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-orange-500/30 hover:scale-[1.02] transition transform active:scale-95"
              >
                Deposit Now
              </button>
              <button
                onClick={() => handleTabChange("all-schemas")}
                className="flex-grow py-4 rounded-full bg-white/5 text-gray-400 font-black uppercase text-[11px] tracking-widest border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition"
              >
                <ArrowUpRight size={16} /> Invest
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-amber-500/20 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tier Level</h4>
                <p className="text-sm font-black text-amber-500 uppercase tracking-tight">Tesla Beginner</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Invite Friends</h4>
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Share & Earn</div>
            </div>
            <div className="flex items-center gap-3 bg-black/40 rounded-2xl px-4 py-4 md:px-5 border border-white/5 hover:border-white/20 transition group overflow-hidden">
              <LinkIcon size={14} className="text-gray-600 group-hover:text-amber-500 transition flex-shrink-0" />
              <span className="text-[10px] md:text-[11px] font-bold text-gray-500 truncate flex-grow">
                {referralUrl}
              </span>
              <button onClick={handleCopy} className="text-gray-400 hover:text-white transition p-1 flex-shrink-0">
                {copied ? <Check size={16} className="text-green-500" /> : <CopyIcon size={16} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 flex-grow">
            {[
              { id: "add-money", name: "Add Funds", icon: <PlusCircle size={20} /> },
              { id: "all-schemas", name: "Grow", icon: <TrendingUp size={20} /> },
              { id: "withdraw", name: "Cash Out", icon: <ArrowUpCircle size={20} /> },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleTabChange(btn.id as TabType)}
                className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-3xl bg-[#141414] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
              >
                <div className="text-gray-600 group-hover:text-amber-500 transition-transform group-hover:scale-110 duration-300">
                  {btn.icon}
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition text-center">
                  {btn.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-6 pt-8 px-2">
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] px-2">ALL NAVIGATIONS</h3>
        <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
          <div className="absolute bottom-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent opacity-50"></div>

          <div className="grid grid-cols-3 gap-y-10 gap-x-2">
            {[
              { id: "all-schemas", name: "Plans", icon: <Layers size={22} /> },
              {
                id: "logs",
                name: "Invest Logs",
                icon: (
                  <div className="relative">
                    <FolderOpen size={22} />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full border-2 border-[#1a1a1a]"></div>
                  </div>
                ),
              },
              {
                id: "transactions",
                name: "Transactions",
                icon: (
                  <div className="flex flex-col -space-y-1.5">
                    <ChevronRight size={14} className="rotate-0 ml-2" />
                    <ChevronLeft size={14} className="rotate-0" />
                  </div>
                ),
              },
              { id: "add-money", name: "Deposit", icon: <DollarSign size={22} /> },
              { id: "withdraw", name: "Withdraw", icon: <ArrowUpFromLine size={22} /> },
              {
                id: "ranking",
                name: "Ranking",
                icon: (
                  <div className="relative">
                    <Trophy size={22} />
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
                      1
                    </div>
                  </div>
                ),
              },
              { id: "referral", name: "Referral", icon: <UserPlus size={22} /> },
              { id: "kyc-verify", name: "KYC Verify", icon: <ShieldCheck size={22} /> },
              { id: "reset-password", name: "Password", icon: <Lock size={22} /> },
              { id: "settings", name: "Settings", icon: <SettingsIcon size={22} /> },
              { id: "support", name: "Support", icon: <Megaphone size={22} /> },
              {
                id: "notifications",
                name: "Notifications",
                icon: (
                  <div className="relative">
                    <Bell size={22} />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                ),
              },
            ].map((nav, i) => (
              <button
                key={i}
                onClick={() => handleTabChange(nav.id as TabType)}
                className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
              >
                <div className="text-white opacity-80">{nav.icon}</div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                  {nav.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-6 pt-4 px-2">
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] px-2">ALL STATISTIC</h3>
        <div className="space-y-4">
          <div className="bg-[#e2f9cc] rounded-full p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center p-3 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                  <Wallet size={24} />
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2488/2488749.png"
                  className="w-full h-full object-contain relative z-10"
                  alt=""
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-black leading-none">${availableBalance}</span>
                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest mt-1">
                  Total Deposit
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#d9e8fb] rounded-full p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center p-4">
                <div className="w-full h-full rounded-full bg-gray-400/50 flex items-center justify-center text-black/60 font-black text-xs">
                  $
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-black leading-none">$0</span>
                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest mt-1">
                  Total Investment
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-12">
          <button className="bg-[#242424] text-[#888888] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
            Load more
          </button>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.color} rounded-3xl p-6 space-y-4 border border-black/5 flex flex-col justify-between h-40 shadow-xl shadow-black/5 hover:-translate-y-1 transition duration-300 cursor-default group`}
          >
            <div className="flex justify-between items-start">
              <span className={`${stat.textColor} font-black text-2xl tracking-tighter`}>{stat.value}</span>
              <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center text-black/40 group-hover:scale-110 transition">
                {stat.icon}
              </div>
            </div>
            <span className={`${stat.textColor} text-[10px] font-black uppercase tracking-[0.2em] opacity-60`}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRanking = () => (
    <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-32 px-4 md:px-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleTabChange("dashboard")}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">All The Badges</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {BADGES.map((badge) => (
          <BadgeCard key={badge.id} title={badge.title} condition={badge.condition} />
        ))}
      </div>
    </div>
  )

  const renderSchemaPreview = () => {
    if (!selectedPlan) return null

    const amount = Number.parseFloat(investAmount)
    const isAmountTooLow = isNaN(amount) || amount < selectedPlan.minInvestment

    const handleInvestSubmit = () => {
      if (isAmountTooLow) return
      setDepositAmount(investAmount)
      setActiveTab("add-money")
    }

    return (
      <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-32 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleTabChange("all-schemas")}
            className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Schema Preview</h3>
        </div>

        <div className="glass-card bg-[#14120e]/95 border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-10">
          <div className="space-y-2">
            <h4 className="text-lg md:text-2xl font-black text-white leading-tight">Review and Confirm Investment</h4>
          </div>

          <div className="border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5 w-1/3">
                    Select Schema:
                  </td>
                  <td className="py-5 px-6">
                    <select
                      value={selectedPlan.id}
                      onChange={(e) => {
                        const plan = INVESTMENT_PLANS.find((p) => p.id === e.target.value)
                        if (plan) handleOpenPreview(plan)
                      }}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold text-sm focus:outline-none w-full max-w-sm"
                    >
                      {INVESTMENT_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Profit Holiday:
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-300">No</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Amount:
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-300">
                    Minimum {selectedPlan.minInvestment} USD - Maximum {selectedPlan.maxInvestment} USD
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Enter Amount:
                  </td>
                  <td className="py-5 px-6">
                    <div className="relative max-w-[400px]">
                      <input
                        type="number"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className={`w-full bg-white border ${isAmountTooLow ? "border-red-500 bg-red-50/10" : "border-white/10"} rounded-md py-3 px-4 text-black font-black text-lg focus:outline-none transition-colors duration-200`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none text-gray-400">
                        <ChevronDown size={14} className="rotate-180" />
                        <ChevronDown size={14} />
                      </div>
                      {isAmountTooLow && (
                        <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">
                          Minimum {selectedPlan.minInvestment} USD Required
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Return of Interest:
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-300">
                    {selectedPlan.returnLabel} ({selectedPlan.returnType})
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Number of Period:
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-300">{selectedPlan.periods} Times</td>
                </tr>
                <tr>
                  <td className="py-5 px-6 text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5">
                    Capital Back:
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-gray-300">
                    {selectedPlan.capitalBack ? "Yes" : "No"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-6">
            <button
              onClick={handleInvestSubmit}
              disabled={isAmountTooLow}
              className={`px-10 py-3 rounded-lg text-white font-black uppercase text-[11px] tracking-widest shadow-2xl transition transform active:scale-95 ${isAmountTooLow ? "bg-gray-700 cursor-not-allowed opacity-50" : "bg-[#f97316] hover:scale-105"}`}
            >
              Invest Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderTransactions = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-28">
      <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-8">
          My Deposits / Transactions
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-white/5 rounded-2xl overflow-hidden">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 first:rounded-l-2xl">
                  Description
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Transaction ID
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Type</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Amount</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Charge</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 last:rounded-r-2xl">
                  Gateway
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-24 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">
                  No transactions found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAddMoney = () => {
    if (depositStep === "payment" && selectedToken) {
      const address = WALLET_ADDRESSES[selectedToken]
      const cryptoAmount = calculateCryptoAmount()
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}&bgcolor=ffffff&color=000000`
      return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500 max-w-[800px] mx-auto pb-32 px-2 md:px-0 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={() => setDepositStep("entry")}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5 flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="space-y-0.5">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Complete Payment</h3>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Scan or copy address to pay
              </p>
            </div>
          </div>

          <div className="glass-card bg-[#141414]/90 border border-white/10 rounded-[2.5rem] p-6 md:p-12 text-center space-y-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden w-full max-w-md md:max-w-xl">
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                Send Exactly
              </span>
              <div className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight break-all px-2">
                {cryptoAmount}
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                In {selectedToken.split(" ")[0]} (≈ ${depositAmount} USD)
              </span>
            </div>

            <div className="flex justify-center">
              <div className="w-40 h-40 md:w-56 lg:w-64 aspect-square bg-white p-2 md:p-3 rounded-[1.5rem] shadow-2xl relative flex items-center justify-center overflow-hidden">
                <img src={qrUrl || "/placeholder.svg"} alt="QR Code" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="space-y-3 max-w-sm mx-auto w-full">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">
                Official Wallet Address
              </label>
              <div className="flex items-center gap-2 bg-black/60 rounded-xl md:rounded-2xl px-3 py-3 md:px-5 md:py-4 border border-white/10 group">
                <span className="text-[9px] md:text-[11px] lg:text-xs font-bold text-gray-400 truncate flex-grow text-left select-all">
                  {address}
                </span>
                <button
                  onClick={() => handleCopyAddress(address)}
                  className="bg-amber-500/10 p-2 rounded-lg md:rounded-xl text-amber-500 hover:bg-amber-500 hover:text-black transition flex-shrink-0"
                >
                  {addressCopied ? <Check size={14} /> : <CopyIcon size={14} />}
                </button>
              </div>
            </div>

            <div className="pt-2 w-full">
              <button
                onClick={() => handleTabChange("transactions")}
                className="w-full max-w-sm mx-auto py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition active:scale-[0.98]"
              >
                I Have Made Payment
              </button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-28 px-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Deposit Amount</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enter your deposit details</p>
          </div>
          <button
            onClick={() => handleTabChange("transactions")}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition"
          >
            Deposit History
          </button>
        </div>

        <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-14 space-y-12 shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Payment Method
            </label>
            <div className="relative group">
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value as any)}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer shadow-inner"
              >
                <option value="">--Select Token--</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH (ERC20)">Ethereum (ETH ERC20)</option>
                <option value="USDT (TRC20)">Tether (USDT TRC20)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Enter Amount (USD):
            </label>
            <div className="relative group">
              <input
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-6 px-8 text-xl md:text-2xl font-bold text-white focus:outline-none transition shadow-inner placeholder:text-gray-700"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 font-black text-lg">
                $
              </div>
            </div>
          </div>
          <div className="pt-6 flex justify-center md:justify-end">
            <button
              disabled={!selectedToken || !depositAmount || isPricesLoading}
              onClick={() => setDepositStep("payment")}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest hover:scale-[1.02] transition transform active:scale-95 group disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderWithdraw = () => {
    if (!isKycVerified) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 md:space-y-10 animate-in fade-in zoom-in duration-700 max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] bg-[#141414] border border-white/10 flex items-center justify-center text-amber-500 shadow-2xl relative z-10 rotate-3 transition-transform duration-500">
              <Fingerprint size={48} strokeWidth={1.5} className="md:size-[56px]" />
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-2xl flex items-center justify-center text-white border-4 border-[#0a0a0a] z-20">
              <Lock size={16} fill="currentColor" className="md:size-[18px]" />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-lg mx-auto">
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              Identity Verification Required
            </h3>
            <p className="text-xs md:text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-wider">
              To ensure the security of your funds and comply with financial regulations, all withdrawals require{" "}
              <span className="text-amber-500">KYC Verification</span>.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <button
              onClick={() => handleTabChange("kyc-verify")}
              className="w-full py-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black uppercase text-[11px] tracking-widest shadow-[0_20px_40px_rgba(245,158,11,0.2)] hover:scale-[1.05] transition transform active:scale-95 flex items-center justify-center gap-3"
            >
              <ShieldCheck size={20} fill="currentColor" />
              Complete KYC Now
            </button>
            <button
              onClick={() => handleTabChange("dashboard")}
              className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition"
            >
              Return to Home
            </button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-4 md:gap-8 w-full">
            {[
              { label: "Compliance", icon: <Check size={14} className="text-green-500" /> },
              { label: "Anti-Fraud", icon: <Check size={14} className="text-green-500" /> },
              { label: "Secure Exit", icon: <Check size={14} className="text-green-500" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const amountVal = Number.parseFloat(withdrawAmount || "0")
    const isAmountTooHigh = amountVal > availableBalance

    if (withdrawStep === "address") {
      return (
        <div className="animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto pb-32 px-2">
          <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setWithdrawStep("amount")}
              className="absolute top-6 left-6 md:top-8 md:left-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-10 text-center">
              Withdrawal Details
            </h3>

            <div className="space-y-10 max-w-md mx-auto">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                  Select Token to Receive
                </label>
                <div className="relative group">
                  <select
                    value={withdrawReceiveToken}
                    onChange={(e) => setWithdrawReceiveToken(e.target.value)}
                    className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-200 focus:outline-none appearance-none cursor-pointer transition shadow-inner"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT TRC20)</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none transition shadow-inner placeholder:text-gray-700"
                />
              </div>

              <div className="pt-6 flex justify-center">
                <button
                  disabled={!withdrawAddress}
                  className="w-full flex items-center justify-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-105 transition transform active:scale-95 group disabled:opacity-50"
                >
                  Confirm Withdrawal
                  <Check size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="animate-in fade-in duration-700 max-w-4xl mx-auto pb-32 px-2">
        <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight text-center md:text-left">
              Withdraw
            </h3>
            <div className="flex flex-col items-center md:items-end bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">AVAILABLE BALANCE</span>
              <span className="text-xl font-black text-amber-500">${availableBalance}</span>
            </div>
          </div>

          <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                From Wallet
              </label>
              <div className="relative group">
                <select className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-200 focus:outline-none appearance-none cursor-pointer transition shadow-inner">
                  <option value="main">Main Wallet (USD)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                Enter Amount
              </label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className={`w-full bg-[#242424]/80 border ${isAmountTooHigh ? "border-red-500/50" : "border-white/10"} rounded-2xl py-5 px-8 text-xl font-bold text-white focus:outline-none transition shadow-inner placeholder:text-gray-700`}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 bg-white/5 w-10 h-10 rounded-full flex items-center justify-center border border-white/10">
                  <DollarSign size={18} />
                </div>
              </div>
              {isAmountTooHigh && (
                <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
                  <AlertTriangle size={14} />
                  Insufficient Balance
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-[11px] font-black text-white uppercase tracking-widest">REVIEW DETAILS</h4>
              <div className="bg-[#1a1a1a]/60 border border-white/10 border-dashed rounded-[2rem] p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Amount</span>
                  <span className="text-sm font-black text-white/60">${withdrawAmount || "0"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Charge</span>
                  <span className="text-sm font-black text-white/60">${withdrawalCharge}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Total</span>
                  <span className="text-sm font-black text-white/60">
                    ${Number.parseFloat(withdrawAmount || "0") + withdrawalCharge}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-center lg:justify-start">
              <button
                onClick={() => !isAmountTooHigh && amountVal > 0 && setWithdrawStep("address")}
                disabled={isAmountTooHigh || amountVal <= 0}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-105 transition transform active:scale-95 group disabled:opacity-50"
              >
                Proceed to withdraw
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-32 px-2 md:px-0">
      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-12 relative overflow-hidden">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight text-center md:text-left">
          Profile Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleTabChange("kyc-verify")}
            className="flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition flex-shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-0.5 flex-grow">
              <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest">
                Verify Identity
              </h4>
              <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Complete KYC verification
              </p>
            </div>
            <ChevronRight className="text-gray-600 flex-shrink-0" size={18} />
          </button>
          <button
            onClick={() => handleTabChange("reset-password")}
            className="flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition flex-shrink-0">
              <Lock size={28} />
            </div>
            <div className="space-y-0.5 flex-grow">
              <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest">
                Change Password
              </h4>
              <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Update your security
              </p>
            </div>
            <ChevronRight className="text-gray-600 flex-shrink-0" size={18} />
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">Avatar</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-[320px] aspect-[16/10] bg-[#1c1c1c] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-amber-500/30 transition-all shadow-inner relative overflow-hidden mx-auto md:mx-0"
          >
            {avatarPreview ? (
              <img src={avatarPreview || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={32} className="text-gray-700 group-hover:text-amber-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Select Avatar</span>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { label: "First Name", name: "firstName", type: "text", placeholder: "First Name" },
            { label: "Last Name", name: "lastName", type: "text", placeholder: "Last Name" },
            { label: "Username", name: "username", type: "text", placeholder: "Username" },
            { label: "Gender", name: "gender", type: "select", options: ["male", "female", "other"], disabled: true },
            { label: "Date of Birth", name: "dob", type: "date", placeholder: "Date of Birth" },
            { label: "Email Address", name: "email", type: "email", placeholder: "user@example.com", readOnly: true },
            { label: "Phone", name: "phone", type: "tel", placeholder: "Phone Number" },
            { label: "Country", name: "country", type: "text", placeholder: "Country" },
            { label: "City", name: "city", type: "text", placeholder: "City" },
            { label: "Zip Code", name: "zipCode", type: "text", placeholder: "Zip Code" },
            { label: "Address", name: "address", type: "text", placeholder: "Address" },
            { label: "Joining Date", name: "joiningDate", type: "text", placeholder: registrationDate, readOnly: true },
          ].map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
                {field.label}
              </label>
              <div className="relative group">
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    disabled={field.disabled}
                    value={profileData[field.name as keyof typeof profileData]}
                    onChange={handleProfileChange}
                    className={`w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-sm ${field.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-gray-300 focus:outline-none appearance-none shadow-inner`}
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
                    value={field.readOnly ? field.placeholder : profileData[field.name as keyof typeof profileData]}
                    onChange={handleProfileChange}
                    readOnly={field.readOnly}
                    className={`w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 md:py-5 px-6 text-sm ${field.readOnly ? "text-gray-500 italic bg-black/20" : "text-gray-300"} focus:outline-none transition shadow-inner`}
                  />
                )}
                {field.type === "select" && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                )}
                {field.type === "date" && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Calendar size={18} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 flex justify-center md:justify-end">
          <button
            disabled={saveLoading}
            onClick={handleSaveProfile}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition transform active:scale-95 group disabled:opacity-50"
          >
            {saveLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Save Changes <ExternalLink size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderReferralContent = () => (
    <div className="space-y-8 animate-in fade-in max-w-2xl mx-auto pb-32 px-2 md:px-0">
      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.25em] opacity-90 text-center md:text-left">
        REFERRAL AND TREE
      </h3>

      <div className="space-y-4">
        <div className="w-full bg-[#242424]/60 border border-white/10 rounded-2xl py-4 px-5 flex items-center shadow-inner overflow-hidden">
          <span className="text-white/80 font-bold text-[10px] md:text-[11px] truncate w-full">{referralUrl}</span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-xs md:text-sm tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-[1.01] transition transform active:scale-95 flex items-center justify-center gap-3 group"
        >
          {copied ? <Check size={18} /> : <CopyIcon size={18} />}
          {copied ? "COPIED" : "Copy Link"}
        </button>

        <p className="text-white/50 text-[9px] font-black uppercase tracking-widest text-center md:text-left">
          0 peoples are joined by using this URL
        </p>
      </div>

      <div className="py-8 flex justify-center md:justify-start">
        <div className="relative w-40 h-24">
          <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-amber-500/50 rounded-full -translate-y-1/2"></div>
          <div className="w-full h-full rounded-[1.2rem] bg-gradient-to-br from-[#ff8c00] to-[#ff4500] p-[2px] shadow-2xl">
            <div className="w-full h-full bg-[#1c1c1c] rounded-[calc(1.2rem-2px)] flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 p-1">
                {avatarPreview ? (
                  <img src={avatarPreview || "/placeholder.svg"} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <UserCircle2 size={24} className="text-amber-500 opacity-60" />
                )}
              </div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">IT'S ME</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-8">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">All Referral Logs</h3>
        <div className="inline-block px-5 py-2.5 rounded-full border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-500/5">
          Referral Profit: 0 USD
        </div>
        <div className="h-[1px] w-full bg-white/5"></div>
        <div className="bg-[#141414] border border-white/5 border-dashed rounded-2xl h-24 flex items-center justify-center">
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] italic">
            NO DATA LOGS FOUND
          </span>
        </div>
      </div>
    </div>
  )

  const renderKycVerify = () => (
    <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-32 px-2 md:px-0">
      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">KYC Verification</h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Secure your account by verifying your identity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Full Legal Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={kycData.fullName}
              onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none transition shadow-inner"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={kycData.dob}
                onChange={(e) => setKycData({ ...kycData, dob: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none shadow-inner"
              />
              <Calendar
                size={18}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">Country</label>
            <div className="relative">
              <select
                value={kycData.country}
                onChange={(e) => setKycData({ ...kycData, country: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none appearance-none shadow-inner cursor-pointer"
              >
                <option>Nigeria</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Type of Document
            </label>
            <div className="relative">
              <select
                value={kycData.docType}
                onChange={(e) => setKycData({ ...kycData, docType: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none appearance-none shadow-inner cursor-pointer"
              >
                <option>National ID</option>
                <option>International Passport</option>
                <option>Driver's License</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <h4 className="text-[12px] md:text-[14px] font-black text-white uppercase tracking-widest text-center md:text-left">
            Document Upload
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Front of Document", state: kycFront, setter: "front", ref: frontInputRef },
              { label: "Back of Document", state: kycBack, setter: "back", ref: backInputRef },
              { label: "Selfie with Document", state: kycSelfie, setter: "selfie", ref: selfieInputRef },
            ].map((upload, i) => (
              <div key={i} className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                  {upload.label}
                </label>
                <div
                  onClick={() => upload.ref.current?.click()}
                  className="aspect-video bg-[#1c1c1c] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-500/30 transition-all shadow-inner relative overflow-hidden group"
                >
                  {upload.state ? (
                    <img
                      src={upload.state || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                      alt={upload.label}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-700 group-hover:text-amber-500/50" />
                      <span className="text-[9px] font-black uppercase text-gray-600">Click to Upload</span>
                    </div>
                  )}
                  <input
                    ref={upload.ref}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, upload.setter as any)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-center md:justify-end">
          <button
            disabled={isSubmittingKyc}
            onClick={handleKycSubmit}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-16 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.05] transition transform active:scale-95 group disabled:opacity-50"
          >
            {isSubmittingKyc ? <Loader2 className="animate-spin" size={20} /> : "Submit Documents"}
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardHome()
      case "all-schemas":
        return (
          <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-28 px-2 md:px-0">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">Investment Plans</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Choose your financial growth strategy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {INVESTMENT_PLANS.map((plan) => (
                <SchemaCard key={plan.id} plan={plan} onInvest={handleOpenPreview} />
              ))}
            </div>
          </div>
        )
      case "referral":
        return renderReferralContent()
      case "add-money":
        return renderAddMoney()
      case "transactions":
      case "logs":
        return renderTransactions()
      case "settings":
        return <ProfileSettings /> // Replaced renderSettings() with imported component
      case "withdraw":
        return renderWithdraw()
      case "ranking":
        return renderRanking()
      case "support":
        return <AdminPanel /> // Replaced support rendering with imported component
      case "kyc-verify":
        return <DocumentUpload /> // Replaced kyc-verify rendering with imported component
      case "reset-password":
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in duration-500 relative">
            <div className="w-full max-w-[600px] lg:max-w-[700px] glass-card p-8 md:p-16 rounded-[2.5rem] border border-white/10 z-10 text-center shadow-2xl relative overflow-hidden">
              <h1 className="text-2xl md:text-4xl font-black mb-3 uppercase text-white tracking-tight">
                Security Center
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">
                Update your Password
              </p>
              {resetSuccess ? (
                <div className="space-y-6">
                  <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold uppercase tracking-widest">
                    Success! Check your email.
                  </div>
                  <button
                    onClick={() => {
                      setResetSuccess(false)
                      handleTabChange("settings")
                    }}
                    className="px-12 py-4 rounded-full bg-white/5 text-white font-black uppercase text-[10px] border border-white/10 transition"
                  >
                    Settings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-8 text-left max-w-sm mx-auto">
                  <div className="space-y-2">
                    <input
                      required
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-[#1c1c1c]/60 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="pt-2 flex flex-col items-center">
                    <button
                      disabled={resetLoading}
                      type="submit"
                      className="w-full py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition transform active:scale-95 flex items-center justify-center gap-3"
                    >
                      {resetLoading ? <Loader2 className="animate-spin" size={16} /> : "Reset Link"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )
      case "schema-preview":
        return renderSchemaPreview()
      default:
        return renderDashboardHome()
    }
  }

  const isSubPage =
    activeTab === "kyc-verify" ||
    activeTab === "reset-password" ||
    activeTab === "schema-preview" ||
    activeTab === "ranking"

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-display overflow-hidden selection:bg-amber-500/30">
      <style>{`
        @keyframes kycProgress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-kyc-timer { animation: kycProgress 5s linear forwards; }
      `}</style>

      {isKycWarningVisible && !isKycVerified && (
        <div className="fixed top-24 right-4 md:right-8 lg:right-12 z-[200] w-[calc(100%-2rem)] max-w-[420px] animate-in slide-in-from-right duration-500">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-black/5">
            <div className="p-5 md:p-6 flex items-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                <AlertTriangle size={20} className="md:size-[24px]" />
              </div>
              <div className="flex-grow space-y-1 pt-0.5">
                <h4 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">warning</h4>
                <p className="text-[13px] md:text-[14px] text-gray-500 font-bold leading-tight">
                  Your account is unverified with KYC.
                </p>
              </div>
              <button onClick={() => setKycWarningVisible(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 h-[4px] bg-amber-500/10 w-full">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 animate-kyc-timer"></div>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`bg-[#0d0d0d] border-r border-white/5 hidden lg:flex flex-col transition-all duration-300 z-50 ${sidebarOpen ? "w-64" : "w-24"}`}
      >
        <div className="p-6 flex items-center justify-between h-24">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
            alt="Tesla"
            className={`h-6 tesla-red-filter transition-all ${!sidebarOpen ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"}`}
          />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white p-2 bg-white/5 rounded-xl"
          >
            <ChevronLeft size={20} className={!sidebarOpen ? "rotate-180" : ""} />
          </button>
        </div>
        <nav className="flex-grow px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => {
            const isSettingsSub = ["kyc-verify", "reset-password"].includes(activeTab)
            const isPlansSub = activeTab === "schema-preview"
            const isActive =
              activeTab === item.id ||
              (isSettingsSub && item.id === "settings") ||
              (isPlansSub && item.id === "all-schemas")

            return (
              <button
                key={idx}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] transition-all relative group ${isActive ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/30" : "text-gray-500 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">{item.name}</span>
                )}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col h-full relative w-full overflow-hidden">
        <header className="h-20 lg:h-24 border-b border-white/5 px-4 md:px-8 flex items-center justify-between bg-[#0d0d0d]/80 backdrop-blur-3xl relative z-40 w-full">
          <div className="flex items-center gap-4">
            {isSubPage && (
              <button
                onClick={() =>
                  handleTabChange(
                    activeTab === "schema-preview" ? "all-schemas" : activeTab === "ranking" ? "dashboard" : "settings",
                  )
                }
                className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] text-white truncate max-w-[150px] md:max-w-none">
                {activeTab.replace("-", " ")}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6 relative">
            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">EN</span>
              <ChevronDown size={14} />
            </div>

            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 relative border border-white/5 group active:scale-95 transition-transform"
              >
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d0d]"></span>
              </button>

              {notificationOpen && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-80 md:w-96 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest mb-4">
                    Notifications
                  </h3>
                  <div className="w-full h-[1px] bg-white/5 mb-6"></div>
                  <div className="bg-[#242424]/60 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      No Notification Found!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center border border-white/20 overflow-hidden shadow-xl shadow-orange-500/20 active:scale-95 transition-transform"
              >
                {avatarPreview ? (
                  <img src={avatarPreview || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-white brightness-0 invert" />
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-4 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleTabChange("settings")}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                    >
                      <SettingsIcon size={18} className="text-gray-500 group-hover:text-amber-500" />
                      <span className="text-sm font-bold uppercase tracking-widest">Settings</span>
                    </button>
                    <button
                      onClick={() => handleTabChange("reset-password")}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                    >
                      <Lock size={18} className="text-gray-500 group-hover:text-amber-500" />
                      <span className="text-sm font-bold uppercase tracking-widest">Change Password</span>
                    </button>
                    <button
                      onClick={() => handleTabChange("support")}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                    >
                      <Megaphone size={18} className="text-gray-500 group-hover:text-amber-500" />
                      <span className="text-sm font-bold uppercase tracking-widest">Support Tickets</span>
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <button
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all group"
                    >
                      <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                        <LogOut size={14} className="ml-0.5" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 relative z-0 custom-scrollbar scroll-smooth w-full">
          {renderContent()}
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around z-[100] shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
          {bottomNavItems.map((item) => {
            const isSettingsSub = ["kyc-verify", "reset-password"].includes(activeTab)
            const isPlansSub = activeTab === "schema-preview"
            const isActive =
              activeTab === item.id ||
              (isSettingsSub && item.id === "settings") ||
              (isPlansSub && item.id === "all-schemas") ||
              (activeTab === "ranking" && item.id === "dashboard")

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className="flex flex-col items-center justify-center gap-1.5 min-w-[60px] transition-all"
              >
                <div
                  className={`relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-[16px] md:rounded-[18px] transition-all duration-300 ${isActive ? "bg-gradient-to-b from-[#ff8c00] to-[#ff4500]" : "text-gray-300"}`}
                >
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    size: 22,
                    className: isActive ? "text-white" : "text-white/60",
                  })}
                </div>
                <span
                  className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-center ${isActive ? "text-white" : "text-white/50"}`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

