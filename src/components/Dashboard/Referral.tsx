import React, { useState } from 'react';
import { CopyIcon, Check, UserCircle2, Users } from 'lucide-react';
import { useReferrals } from '@/hooks/dashboard/useReferrals';

const Referral: React.FC = () => {
  const { referrals, referralUrl } = useReferrals();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in max-w-2xl mx-auto pb-32 px-4 md:px-0">
      <h3 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.25em] opacity-90 text-center md:text-left">
        REFERRAL AND TREE
      </h3>

      <div className="space-y-4">
        <div className="w-full bg-[#242424]/60 border border-white/10 rounded-2xl py-4 px-5 flex items-center shadow-inner overflow-hidden">
          <span className="text-white/80 font-bold text-[10px] md:text-[11px] break-all w-full">{referralUrl}</span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-xs md:text-sm tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-[1.01] transition transform active:scale-95 flex items-center justify-center gap-3 group"
        >
          {copied ? <Check size={18} /> : <CopyIcon size={18} />}
          {copied ? 'COPIED' : 'Copy Link'}
        </button>

        <p className="text-white/50 text-[9px] font-black uppercase tracking-widest text-center md:text-left">
          {referrals.length} {referrals.length === 1 ? 'member' : 'members'} joined using this URL
        </p>
      </div>

      <div className="py-4 md:py-8 flex justify-center md:justify-start">
        <div className="relative w-32 h-20 md:w-40 md:h-24">
          <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-amber-500/50 rounded-full -translate-y-1/2"></div>
          <div className="w-full h-full rounded-[1.2rem] bg-gradient-to-br from-[#ff8c00] to-[#ff4500] p-[2px] shadow-2xl">
            <div className="w-full h-full bg-[#1c1c1c] rounded-[calc(1.2rem-2px)] flex flex-col items-center justify-center gap-1 md:gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 p-1">
                <UserCircle2 size={20} className="text-amber-500 opacity-60 md:size-[24px]" />
              </div>
              <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em]">IT'S ME</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d]/60 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">All Referral Logs</h3>
          <div className="flex items-center self-start md:self-auto gap-2 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
            <Users size={16} className="text-green-500" />
            <span className="text-[10px] font-bold text-green-400">Profit: $0</span>
          </div>
        </div>
        
        <div className="inline-block px-5 py-2.5 rounded-full border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-500/5">
          Total Referrals: {referrals.length}
        </div>
        
        <div className="h-[1px] w-full bg-white/5"></div>
        
        <div className="space-y-4">
          <div className="bg-[#141414] border border-white/5 border-dashed rounded-2xl p-8 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em] italic text-center">
              NO REFERRALS FOUND
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center md:items-start">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Direct</p>
            <p className="text-lg md:text-xl font-black text-white">{referrals.length}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center md:items-start">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Indirect</p>
            <p className="text-lg md:text-xl font-black text-white">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;