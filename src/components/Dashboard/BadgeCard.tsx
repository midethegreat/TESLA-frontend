import React from 'react';

interface BadgeCardProps {
  title: string;
  condition: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ title, condition }) => (
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
);

export default BadgeCard;