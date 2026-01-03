import { Link } from "react-router-dom";
import {
  MousePointer2,
  Briefcase,
  RefreshCw,
  Clock,
  Wallet,
  Ban,
  Zap,
} from "lucide-react";
import type { InvestmentPlan } from "@/types/types";
import { INVESTMENT_PLANS } from "@/const/constants";


function PlanCard({ plan }: { plan: InvestmentPlan }) {
  return (
    <div
      className={`relative w-full h-full rounded-[1.5rem] overflow-hidden border transition-all flex flex-col glass-card ${
        plan.isHot
          ? "border-amber-500/40 bg-[#1e1a14]/95"
          : "border-white/5 bg-[#14120e]/95"
      }`}
    >
      {/* Header */}
      <div className="relative h-32 px-6 flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          alt=""
        />
        <div className="relative z-10">
          <h3 className="text-xl font-black uppercase text-white">
            {plan.name}
          </h3>
          <div className="flex gap-2 mt-1">
            <span className="bg-amber-500/10 text-amber-400 text-[8px] font-black px-2 py-0.5 rounded uppercase">
              {plan.returnLabel}
            </span>
            {plan.isHot && (
              <span className="bg-orange-500/10 text-orange-400 text-[8px] font-black px-2 py-0.5 rounded uppercase">
                Hot
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-3 flex flex-col flex-grow">
        {[
          {
            label: "Investment",
            val: `$${plan.minInvestment}-$${plan.maxInvestment}`,
            icon: <MousePointer2 size={12} />,
          },
          {
            label: "Capital Back",
            val: plan.capitalBack ? "Yes" : "No",
            icon: <Briefcase size={12} />,
          },
          {
            label: "Return Type",
            val: plan.returnType,
            icon: <RefreshCw size={12} />,
          },
          {
            label: "Periods",
            val: `${plan.periods} Times`,
            icon: <Clock size={12} />,
          },
          {
            label: "Withdraw",
            val: plan.withdrawType,
            icon: <Wallet size={12} />,
          },
          {
            label: "Cancel",
            val: "30 Minutes",
            icon: <Ban size={12} />,
          },
        ].map((row, i) => (
          <div key={i} className="flex justify-between text-[10px]">
            <div className="flex items-center gap-2 text-gray-400">
              {row.icon}
              {row.label}
            </div>
            <div className="text-amber-400 font-bold">{row.val}</div>
          </div>
        ))}

        <div className="pt-4 mt-auto">
          <Link
            to="/login"
            className="w-full py-3 rounded-full gradient-button text-black font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition"
          >
            <Zap size={12} />
            Invest Now
          </Link>

          <p className="text-center text-[8px] text-amber-500/40 mt-3 font-bold uppercase tracking-widest">
            No Profit Holidays
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvestmentPlans() {
  return (
    <section id="plans" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="glass-subtopic mb-4">
            <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
              Premium Strategies
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase text-white">
            Investment plans built for results
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INVESTMENT_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
