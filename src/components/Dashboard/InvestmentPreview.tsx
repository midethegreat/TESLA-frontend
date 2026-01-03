import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import { INVESTMENT_PLANS } from '@/const/constants';
import type { InvestmentPlan } from '@/types/types';

const InvestmentPreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [investAmount, setInvestAmount] = useState('');
  
  const selectedPlan = location.state?.plan as InvestmentPlan || INVESTMENT_PLANS[0];
  
  const amount = Number.parseFloat(investAmount);
  const isAmountTooLow = isNaN(amount) || amount < selectedPlan.minInvestment;

  const handleInvestSubmit = () => {
    if (isAmountTooLow) return;
    navigate('/dashboard/deposit', { 
      state: { 
        depositAmount: investAmount,
        fromInvestment: true 
      } 
    });
  };

  const handlePlanChange = (planId: string) => {
    const plan = INVESTMENT_PLANS.find((p) => p.id === planId);
    if (plan) {
      navigate('/dashboard/investment-preview', { state: { plan } });
      setInvestAmount(plan.minInvestment.toString());
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-32 px-4 md:px-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/plans')}
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
                    onChange={(e) => handlePlanChange(e.target.value)}
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
                      className={`w-full bg-white border ${
                        isAmountTooLow ? 'border-red-500 bg-red-50/10' : 'border-white/10'
                      } rounded-md py-3 px-4 text-black font-black text-lg focus:outline-none transition-colors duration-200`}
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
                  {selectedPlan.capitalBack ? 'Yes' : 'No'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-6">
          <button
            onClick={handleInvestSubmit}
            disabled={isAmountTooLow}
            className={`px-10 py-3 rounded-lg text-white font-black uppercase text-[11px] tracking-widest shadow-2xl transition transform active:scale-95 ${
              isAmountTooLow
                ? 'bg-gray-700 cursor-not-allowed opacity-50'
                : 'bg-[#f97316] hover:scale-105'
            }`}
          >
            <CheckCircle2 size={14} className="inline mr-2" />
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPreview;