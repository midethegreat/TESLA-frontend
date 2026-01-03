import React from 'react';
import {
  MousePointer2,
  Briefcase,
  RefreshCw,
  Clock,
  Wallet,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import type { InvestmentPlan } from '@/types/types';

interface SchemaCardProps {
  plan: InvestmentPlan;
  onInvest: (plan: InvestmentPlan) => void;
}

const SchemaCard: React.FC<SchemaCardProps> = ({ plan, onInvest }) => (
  <div
    className={`relative w-full rounded-[1.5rem] overflow-hidden border transition-all duration-500 flex flex-col glass-card group ${
      plan.isHot
        ? 'border-amber-500/30 bg-[#1a140d]/80'
        : 'border-white/5 bg-[#0d0d0d]/80'
    }`}
  >
    <div className="relative h-28 flex flex-col justify-center px-6 overflow-hidden flex-shrink-0">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 transform translate-x-8 -translate-y-8 pointer-events-none">
        <img
          src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-2xl font-black tracking-tight uppercase text-white relative z-10">
        {plan.name}
      </h3>
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
          label: 'Investment',
          val: `$${plan.minInvestment}-$${plan.maxInvestment}`,
          icon: <MousePointer2 size={12} className="text-gray-500" />,
        },
        {
          label: 'Capital Back',
          val: plan.capitalBack ? 'Yes' : 'No',
          icon: <Briefcase size={12} className="text-gray-500" />,
        },
        {
          label: 'Return Type',
          val: plan.returnType,
          icon: <RefreshCw size={12} className="text-gray-500" />,
        },
        {
          label: 'Periods',
          val: `${plan.periods} Times`,
          icon: <Clock size={12} className="text-gray-500" />,
        },
        {
          label: 'Withdraw',
          val: plan.withdrawType,
          icon: <Wallet size={12} className="text-gray-500" />,
        },
        {
          label: 'Cancel',
          val: 'In 30 Minutes',
          icon: <Ban size={12} className="text-gray-500" />,
        },
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
);

export default SchemaCard;