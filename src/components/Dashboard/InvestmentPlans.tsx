import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_PLANS } from '@/const/constants';
import type { InvestmentPlan } from '@/types/types';
import SchemaCard from './SchemaCard';

const InvestmentPlans: React.FC = () => {
  const navigate = useNavigate();

  const handleInvest = (plan: InvestmentPlan) => {
    navigate('/dashboard/investment-preview', { state: { plan } });
  };

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
          <SchemaCard key={plan.id} plan={plan} onInvest={handleInvest} />
        ))}
      </div>
    </div>
  );
};

export default InvestmentPlans;