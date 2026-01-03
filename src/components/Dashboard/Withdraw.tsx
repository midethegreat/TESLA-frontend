import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, DollarSign, AlertTriangle, ArrowUpRight, Check, Fingerprint, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { TransactionService, type WithdrawRequest } from '@/services/transaction.service';
import { useAuth } from '@/hooks/useAuth';

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isKycVerified = (user as any)?.profile?.kycStatus === 'APPROVED' || (user as any)?.profile?.kycStatus === 'verified';
  const [withdrawStep, setWithdrawStep] = useState<'amount' | 'address'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawReceiveToken, setWithdrawReceiveToken] = useState('BTC');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      const response = await TransactionService.getMyWallet();
      setAvailableBalance(response.wallet.availableBalance);
    } catch (err: any) {
      console.error('Error fetching wallet:', err);
    } finally {
      setWalletLoading(false);
    }
  };

  const amountVal = Number.parseFloat(withdrawAmount || '0');
  const isAmountTooHigh = amountVal > availableBalance;
  const withdrawalCharge = 0; 

  const handleWithdraw = async () => {
    if (!withdrawAddress || amountVal <= 0 || isAmountTooHigh) return;

    try {
      setLoading(true);
      setError(null);

      const withdrawData: WithdrawRequest = {
        amount: amountVal,
        token: withdrawReceiveToken,
        walletAddress: withdrawAddress
      };

      const transaction = await TransactionService.createWithdrawal(withdrawData);
      

      navigate('/dashboard/transactions', {
        state: { 
          message: 'Withdrawal request submitted successfully!',
          transactionId: transaction._id
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process withdrawal');
      console.error('Withdrawal error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isKycVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 md:space-y-10 animate-in fade-in zoom-in duration-700 max-w-4xl mx-auto px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full animate-pulse"></div>
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] bg-[#141414] border border-white/10 flex items-center justify-center text-amber-500 shadow-2xl relative z-10 rotate-3 transition-transform duration-500">
            <Fingerprint size={48} strokeWidth={1.5} className="md:size-[56px]" />
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-2xl flex items-center justify-center text-white border-4 border-[#0a0a0a] z-20">
            <Lock size={16} fill="currentColor" className="md:size-[18px]" />
          </div>
        </div>

        <div className="text-center space-y-4 max-w-lg mx-auto">
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
            Identity Verification Required
          </h3>
          <p className="text-xs md:text-sm font-medium text-gray-400 leading-relaxed uppercase tracking-wider">
            To ensure the security of your funds and comply with financial regulations, all withdrawals require{' '}
            <span className="text-amber-500">KYC Verification</span>.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <button
            onClick={() => navigate('/dashboard/kyc')}
            className="w-full py-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black uppercase text-[11px] tracking-widest shadow-[0_20px_40px_rgba(245,158,11,0.2)] hover:scale-[1.05] transition transform active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck size={20} fill="currentColor" />
            Complete KYC Now
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (withdrawStep === 'address') {
    return (
      <div className="animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto pb-32 px-2">
        <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <button
            onClick={() => setWithdrawStep('amount')}
            className="absolute top-6 left-6 md:top-8 md:left-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-10 text-center">
            Withdrawal Details
          </h3>

          <div className="space-y-10 max-w-md mx-auto">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                Select Token to Receive
              </label>
              <div className="relative group">
                <select
                  value={withdrawReceiveToken}
                  onChange={(e) => setWithdrawReceiveToken(e.target.value)}
                  className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-200 focus:outline-none appearance-none cursor-pointer transition shadow-inner"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT TRC20)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
                Recipient Wallet Address
              </label>
              <input
                type="text"
                placeholder="Enter your wallet address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none transition shadow-inner placeholder:text-gray-700"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <div className="pt-6 flex justify-center">
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAddress || loading}
                className="w-full flex items-center justify-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-105 transition transform active:scale-95 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Withdrawal
                    <Check size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto pb-32 px-2">
      <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight text-center md:text-left">
            Withdraw
          </h3>
          <div className="flex flex-col items-center md:items-end bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">AVAILABLE BALANCE</span>
            {walletLoading ? (
              <Loader2 size={20} className="animate-spin text-amber-500 mt-1" />
            ) : (
              <span className="text-xl font-black text-amber-500">${availableBalance.toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
              From Wallet
            </label>
            <div className="relative group">
              <select className="w-full bg-[#242424]/80 border border-white/10 rounded-2xl py-5 px-6 text-sm text-gray-200 focus:outline-none appearance-none cursor-pointer transition shadow-inner">
                <option value="main">Main Wallet (USD)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-white/60 uppercase tracking-widest block">
              Enter Amount
            </label>
            <div className="relative group">
              <input
                type="number"
                placeholder="Enter Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.01"
                className={`w-full bg-[#242424]/80 border ${
                  isAmountTooHigh ? 'border-red-500/50' : 'border-white/10'
                } rounded-2xl py-5 px-8 text-xl font-bold text-white focus:outline-none transition shadow-inner placeholder:text-gray-700`}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 bg-white/5 w-10 h-10 rounded-full flex items-center justify-center border border-white/10">
                <DollarSign size={18} />
              </div>
            </div>
            {isAmountTooHigh && (
              <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
                <AlertTriangle size={14} />
                Insufficient Balance
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">REVIEW DETAILS</h4>
            <div className="bg-[#1a1a1a]/60 border border-white/10 border-dashed rounded-[2rem] p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Amount</span>
                <span className="text-sm font-black text-white/60">${withdrawAmount || '0'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Charge</span>
                <span className="text-sm font-black text-white/60">${withdrawalCharge}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-white/60">
                  ${(Number.parseFloat(withdrawAmount || '0') + withdrawalCharge).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-center lg:justify-start">
            <button
              onClick={() => !isAmountTooHigh && amountVal > 0 && setWithdrawStep('address')}
              disabled={isAmountTooHigh || amountVal <= 0}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] via-[#ff4d00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-[0_15px_30px_rgba(255,69,0,0.3)] hover:scale-105 transition transform active:scale-95 group disabled:opacity-50"
            >
              Proceed to withdraw
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;