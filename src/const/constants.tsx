import type { FAQItem, InvestmentPlan, ProcessStep } from "@/types/types";



export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'trial',
    name: 'Trial Plan',
    returnLabel: 'Daily 20%',
    minInvestment: 500,
    maxInvestment: 4999,
    capitalBack: true,
    returnType: 'Period',
    periods: 15,
    withdrawType: 'Anytime'
  },
  {
    id: 'bronze',
    name: 'Bronze Plan',
    returnLabel: 'Weekly 35%',
    minInvestment: 5000,
    maxInvestment: 9999,
    capitalBack: true,
    returnType: 'Period',
    periods: 15,
    withdrawType: 'Anytime',
    isHot: true
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    returnLabel: 'Weekly 40%',
    minInvestment: 10000,
    maxInvestment: 29999,
    capitalBack: true,
    returnType: 'Period',
    periods: 5,
    withdrawType: 'Anytime'
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    returnLabel: 'Weekly 45%',
    minInvestment: 30000,
    maxInvestment: 59999,
    capitalBack: true,
    returnType: 'Period',
    periods: 5,
    withdrawType: 'Anytime'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    returnLabel: 'Weekly 50%',
    minInvestment: 60000,
    maxInvestment: 100000,
    capitalBack: true,
    returnType: 'Period',
    periods: 20,
    withdrawType: 'Anytime',
    isHot: true
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What types of investments do you offer?",
    answer: "We specialize in cryptocurrency investments, utilizing a high-intelligence, accurate trading system to maximize returns. Our platform offers various crypto assets, tailored to suit different risk levels and financial goals."
  },
  {
    question: "How do I start investing with you?",
    answer: "Simply create an account, verify your email and KYC documents, and deposit funds using any of our supported cryptocurrency payment methods."
  },
  {
    question: "What are the fees associated with investing?",
    answer: "We maintain a transparent fee structure. Most investment plans have zero management fees, while withdrawal fees vary depending on the chosen cryptocurrency network."
  },
  {
    question: "How do you ensure the security of my investments?",
    answer: "We use high-grade security protocols, including multi-factor authentication, cold storage for assets, and end-to-end encryption for all personal data."
  },
  {
    question: "Can I access my investments anytime?",
    answer: "Yes, our platform offers anytime withdrawal for most plans, ensuring you maintain liquidity and control over your capital."
  },
  {
    question: "What is the minimum investment amount?",
    answer: "The minimum investment amount starts as low as $500 for our Trial Plan, making professional-grade investment accessible to everyone."
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Create Your Account",
    description: "Registering on our website gives you instant access to personalized investment opportunities.",
    icon: "👤"
  },
  {
    title: "Verify Email",
    description: "You'll need to verify your email to complete your registration and begin your investment journey.",
    icon: "✉️"
  },
  {
    title: "Verify KYC",
    description: "You'll need to verify your KYC details to ensure a secure and compliant investment experience.",
    icon: "📋"
  },
  {
    title: "Deposit Funds",
    description: "Once your account is verified, you can deposit funds to begin your investment journey with us.",
    icon: "💰"
  },
  {
    title: "Choose an Investment Plan",
    description: "Select a plan that aligns with your goals, and let us help you grow your wealth.",
    icon: "📊"
  }
];
