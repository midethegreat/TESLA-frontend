import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Coins, TrendingUp } from "lucide-react";
import { INVESTMENT_PLANS } from "@/const/constants";

export default function Calculator() {
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTMENT_PLANS[0].id);
  const [amount, setAmount] = useState(500);

  const profit = useMemo(() => {
    const plan = INVESTMENT_PLANS.find((p) => p.id === selectedPlanId);
    if (!plan) return 0;

    const percent = Number(plan.returnLabel.match(/\d+/)?.[0] || 0);
    return amount * (percent / 100) * plan.periods;
  }, [selectedPlanId, amount]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="glass-subtopic mb-6">
          <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
            Profit Estimator
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-12">
          Earnings Analysis
        </h2>

        <div className="glass-card p-6 md:p-10 rounded-[2rem] border border-white/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[8px] font-black text-amber-500/40 uppercase tracking-widest text-left mb-2 ml-2">
                Strategy
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-gray-300 text-xs"
              >
                {INVESTMENT_PLANS.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    className="bg-[#1a1814]"
                  >
                    {plan.name}
                  </option>
                ))}
              </select>
              <TrendingUp
                size={16}
                className="absolute right-4 bottom-3.5 text-amber-500/20"
              />
            </div>

            <div className="relative">
              <label className="block text-[8px] font-black text-amber-500/40 uppercase tracking-widest text-left mb-2 ml-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 px-5 text-white font-bold text-sm"
              />
              <Coins
                size={16}
                className="absolute right-4 bottom-3.5 text-amber-500/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-amber-500/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="block text-amber-500/40 uppercase text-[8px] font-black tracking-widest">
                  Projected Profit
                </span>
                <span className="text-white font-black text-3xl md:text-4xl">
                  ${profit.toLocaleString()}
                </span>
              </div>

              <Link
                to="/login"
                className="w-full md:w-auto gradient-button px-8 py-3.5 rounded-full text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition"
              >
                Begin Investing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
