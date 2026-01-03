
export interface InvestmentPlan {
  id: string;
  name: string;
  returnLabel: string;
  minInvestment: number;
  maxInvestment: number;
  capitalBack: boolean;
  returnType: string;
  periods: number;
  withdrawType: string;
  isHot?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}
