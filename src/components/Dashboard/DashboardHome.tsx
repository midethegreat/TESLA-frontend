// components/dashboard/DashboardHome.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpRight, 
  Award, 
  LinkIcon, 
  CopyIcon, 
  Check, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  Trophy, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Megaphone, 
  Bell, 
  Home, 
  FolderOpen, 
  ArrowLeftRight, 
  ArrowUpFromLine,
  Percent,
  User,
  Star,
  Ticket,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useReferrals } from '@/hooks/dashboard/useReferrals';
import { useBalance } from '@/hooks/dashboard/useBalance';

const DashboardHome: React.FC = () => {
  const { referrals, referralUrl } = useReferrals();
  const { availableBalance } = useBalance();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Total Deposit", value: "$0", color: "bg-[#e2f9cc]", textColor: "text-black", icon: <Wallet size={16} /> },
    { label: "Total Investment", value: "$0.00", color: "bg-[#d9e8fb]", textColor: "text-black", icon: <Layers size={16} /> },
    { label: "Total Profit", value: "$0.00", color: "bg-[#f9f3d1]", textColor: "text-black", icon: <Percent size={16} /> },
    { label: "Total Transfer", value: "$0.00", color: "bg-[#f2f2f2]", textColor: "text-black", icon: <ArrowUpRight size={16} /> },
    { label: "Total Withdraw", value: "$0.00", color: "bg-[#eaf4ff]", textColor: "text-black", icon: <ArrowUpFromLine size={16} /> },
    { label: "Profit", value: "$0", color: "bg-[#f2f2f2]", textColor: "text-gray-400", icon: <AlertTriangle size={16} /> },
    { label: "Referral Bonus", value: "$0", color: "bg-[#e7f90e]", textColor: "text-black", icon: <UserPlus size={16} /> },
    { label: "Deposit Bonus", value: "$0", color: "bg-[#fbe0d7]", textColor: "text-black", icon: <Zap size={16} /> },
    { label: "Investment Bonus", value: "$0", color: "bg-[#d8dbff]", textColor: "text-black", icon: <Award size={16} /> },
    { label: "Total Referral", value: referrals.length.toString(), color: "bg-[#e2f9f5]", textColor: "text-black", icon: <User size={16} /> },
    { label: "Rank Achieved", value: "1", color: "bg-[#f9ebea]", textColor: "text-black", icon: <Star size={16} /> },
    { label: "Total Ticket", value: "0", color: "bg-[#f9f9db]", textColor: "text-black", icon: <Ticket size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-32 lg:pb-8">
      {/* Main Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-2 md:px-0">
        <div className="lg:col-span-7">
          <div className="glass-card bg-[#141414] border border-white/5 rounded-[2.5rem] p-1 overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="bg-gradient-to-br from-[#ffd700] via-[#ffcc00] to-[#ffa500] p-6 md:p-10 rounded-[2.3rem] space-y-4 flex-grow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
              <span className="text-black font-black text-4xl md:text-6xl block tracking-tighter">
                ${availableBalance.toFixed(2)}
              </span>
              <div className="flex items-center gap-2 text-black/60">
                <Wallet size={18} />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
                  Available Balance
                </span>
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
              <Link
                to="/dashboard/deposit"
                className="flex-grow py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-orange-500/30 hover:scale-[1.02] transition transform active:scale-95 text-center"
              >
                Deposit Now
              </Link>
              <Link
                to="/dashboard/plans"
                className="flex-grow py-4 rounded-full bg-white/5 text-gray-400 font-black uppercase text-[11px] tracking-widest border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition text-center"
              >
                <ArrowUpRight size={16} /> Invest
              </Link>
            </div>
          </div>
        </div>

        {/* Side Cards */}
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
              { id: "deposit", name: "Add Funds", icon: <DollarSign size={20} />, path: "/dashboard/deposit" },
              { id: "plans", name: "Grow", icon: <TrendingUp size={20} />, path: "/dashboard/plans" },
              { id: "withdraw", name: "Cash Out", icon: <ArrowUpFromLine size={20} />, path: "/dashboard/withdraw" },
            ].map((btn) => (
              <Link
                key={btn.id}
                to={btn.path}
                className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-3xl bg-[#141414] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
              >
                <div className="text-gray-600 group-hover:text-amber-500 transition-transform group-hover:scale-110 duration-300">
                  {btn.icon}
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition text-center">
                  {btn.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Section */}
      <div className="lg:hidden space-y-6 pt-8 px-2">
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] px-2">ALL NAVIGATIONS</h3>
        <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
          <div className="grid grid-cols-3 gap-y-10 gap-x-2">
            {[
              { id: "plans", name: "Plans", icon: <Layers size={22} />, path: "/dashboard/plans" },
              { id: "logs", name: "Invest Logs", icon: <FolderOpen size={22} />, path: "/dashboard/logs" },
              { id: "transactions", name: "Transactions", icon: <ArrowLeftRight size={22} />, path: "/dashboard/transactions" },
              { id: "deposit", name: "Deposit", icon: <DollarSign size={22} />, path: "/dashboard/deposit" },
              { id: "withdraw", name: "Withdraw", icon: <ArrowUpFromLine size={22} />, path: "/dashboard/withdraw" },
              { id: "ranking", name: "Ranking", icon: <Trophy size={22} />, path: "/dashboard/ranking" },
              { id: "referral", name: "Referral", icon: <UserPlus size={22} />, path: "/dashboard/referral" },
              { id: "kyc", name: "KYC Verify", icon: <ShieldCheck size={22} />, path: "/dashboard/kyc" },
              { id: "security", name: "Password", icon: <Lock size={22} />, path: "/dashboard/reset-password" },
              { id: "settings", name: "Settings", icon: <Home size={22} />, path: "/dashboard/settings" },
              { id: "support", name: "Support", icon: <Megaphone size={22} />, path: "https://t.me/Allyssabroker", external: true },
              { id: "notifications", name: "Notifications", icon: <Bell size={22} />, path: "/dashboard/notifications" },
            ].map((nav) => (
              nav.external ? (
                <a
                  key={nav.id}
                  href={nav.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
                >
                  <div className="text-white opacity-80">{nav.icon}</div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                    {nav.name}
                  </span>
                </a>
              ) : (
                <Link
                  key={nav.id}
                  to={nav.path}
                  className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
                >
                  <div className="text-white opacity-80">{nav.icon}</div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                    {nav.name}
                  </span>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Stats Section */}
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
                <span className="text-2xl font-black text-black leading-none">${availableBalance.toFixed(2)}</span>
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

      {/* Desktop Stats Grid */}
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
  );
};

export default DashboardHome;