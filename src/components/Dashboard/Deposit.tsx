import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, CopyIcon, Check, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useTokenPrices } from '@/hooks/dashboard/useTokenPrices';
import { TransactionService, type DepositRequest } from '@/services/transaction.service';

const WALLET_ADDRESSES = {
  BTC: "bc1qtwpjzek0287rwf7czvsrc8x8tnnxk87hymcvvk",
  "ETH (ERC20)": "0x4dFdE34c560637496A5825003fE71B3D0a571a1a",
  "USDT (TRC20)": "TWWRQmKytJjxMZSbD9gpdU9jKsB5Dzy7xp",
} as const;

type TokenType = keyof typeof WALLET_ADDRESSES;

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const [depositStep, setDepositStep] = useState<'entry' | 'payment'>('entry');
  const [selectedToken, setSelectedToken] = useState<TokenType | ''>('');
  const [depositAmount, setDepositAmount] = useState('');
  const [addressCopied, setAddressCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { tokenPrices, isLoading: pricesLoading } = useTokenPrices();

  // Type guard to ensure selectedToken is a valid TokenType
  const isValidToken = (token: string): token is TokenType => {
    return token in WALLET_ADDRESSES;
  };

  const calculateCryptoAmount = () => {
    if (!selectedToken || !depositAmount || !tokenPrices[selectedToken]) return '0.000000';
    const usd = Number.parseFloat(depositAmount);
    const price = tokenPrices[selectedToken];
    const cryptoAmount = (usd / price);
    
    // Format based on token type
    if (selectedToken === 'BTC') {
      return cryptoAmount.toFixed(8);
    } else if (selectedToken === 'ETH (ERC20)') {
      return cryptoAmount.toFixed(6);
    } else if (selectedToken === 'USDT (TRC20)') {
      return cryptoAmount.toFixed(2); // USDT is usually 1:1 with USD
    }
    return cryptoAmount.toFixed(6);
  };

  const getCryptoAmountForDeposit = () => {
    const cryptoAmount = calculateCryptoAmount();
    return parseFloat(cryptoAmount);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const validateDeposit = (): { valid: boolean; message?: string } => {
    const amount = Number.parseFloat(depositAmount);
    
    if (!selectedToken || !isValidToken(selectedToken)) {
      return { valid: false, message: 'Please select a payment method' };
    }
    
    if (!depositAmount || amount <= 0) {
      return { valid: false, message: 'Please enter a valid amount' };
    }
    
    // Check minimum deposit amount (e.g., $10)
    const MIN_DEPOSIT = 10;
    if (amount < MIN_DEPOSIT) {
      return { valid: false, message: `Minimum deposit amount is $${MIN_DEPOSIT}` };
    }
    
    return { valid: true };
  };

  const handleCreateDeposit = async () => {
    const validation = validateDeposit();
    if (!validation.valid) {
      setError(validation.message || 'Invalid deposit details');
      return;
    }

    const token = selectedToken as TokenType;

    try {
      setLoading(true);
      setError(null);

      const cryptoAmount = getCryptoAmountForDeposit();
      const tokenCode = token.split(' ')[0];

      const depositData: DepositRequest = {
        amount: Number.parseFloat(depositAmount),
        token: tokenCode,
        walletAddress: WALLET_ADDRESSES[token],
        cryptoAmount: cryptoAmount
      };


      
      const transaction = await TransactionService.createDeposit(depositData);

      
      navigate('/dashboard/transactions', {
        state: { 
          message: 'Deposit request created successfully!',
          transactionId: transaction._id,
          type: 'deposit'
        }
      });
    } catch (err: any) {
      console.error('Deposit error details:', err);
      setError(err.response?.data?.message || 'Failed to create deposit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    const validation = validateDeposit();
    if (!validation.valid) {
      setError(validation.message || 'Invalid deposit details');
      return;
    }
    setError(null);
    setDepositStep('payment');
  };

  if (depositStep === 'payment' && (!selectedToken || !isValidToken(selectedToken))) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <p className="text-gray-600 text-sm">Invalid token selection. Please go back and select a valid token.</p>
          <button
            onClick={() => setDepositStep('entry')}
            className="px-6 py-2 rounded-full bg-amber-500 text-black font-bold text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (depositStep === 'payment' && selectedToken && isValidToken(selectedToken)) {
    const address = WALLET_ADDRESSES[selectedToken];
    const cryptoAmount = calculateCryptoAmount();
    const tokenCode = selectedToken.split(' ')[0];
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      address
    )}&bgcolor=ffffff&color=000000`;

    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500 max-w-[800px] mx-auto pb-32 px-2 md:px-0 flex flex-col items-center">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => setDepositStep('entry')}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5 flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Complete Payment</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Scan or copy address to pay
            </p>
          </div>
        </div>

        <div className="glass-card bg-[#141414]/90 border border-white/10 rounded-[2.5rem] p-6 md:p-12 text-center space-y-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden w-full max-w-md md:max-w-xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                Send Exactly
              </span>
              <div className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight break-all px-2">
                {cryptoAmount}
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                {tokenCode} (≈ ${depositAmount} USD)
              </span>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              <p className="text-xs">Any amount different from {cryptoAmount} {tokenCode}</p>
              <p className="text-xs">may result in delays or loss of funds.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-40 h-40 md:w-56 lg:w-64 aspect-square bg-white p-2 md:p-3 rounded-[1.5rem] shadow-2xl relative flex items-center justify-center overflow-hidden">
              <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="space-y-3 max-w-sm mx-auto w-full">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">
              Official Wallet Address
            </label>
            <div className="flex items-center gap-2 bg-black/60 rounded-xl md:rounded-2xl px-3 py-3 md:px-5 md:py-4 border border-white/10 group">
              <span className="text-[9px] md:text-[11px] lg:text-xs font-bold text-gray-400 truncate flex-grow text-left select-all">
                {address}
              </span>
              <button
                onClick={() => handleCopyAddress(address)}
                className="bg-amber-500/10 p-2 rounded-lg md:rounded-xl text-amber-500 hover:bg-amber-500 hover:text-black transition flex-shrink-0"
              >
                {addressCopied ? <Check size={14} /> : <CopyIcon size={14} />}
              </button>
            </div>
            <p className="text-[8px] text-gray-600">
              Network: {selectedToken.includes('TRC20') ? 'TRC20' : selectedToken.includes('ERC20') ? 'ERC20' : 'Bitcoin'}
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="pt-2 w-full space-y-4">
            <div className="space-y-2">
              <button
                onClick={handleCreateDeposit}
                disabled={loading}
                className="w-full max-w-sm mx-auto py-4 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin inline mr-2" />
                    Creating Deposit Request...
                  </>
                ) : (
                  'I Have Made Payment'
                )}
              </button>
              <button
                onClick={() => navigate('/dashboard/transactions')}
                className="w-full max-w-sm mx-auto py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold uppercase text-[9px] tracking-widest hover:bg-white/10 transition"
              >
                View My Deposits
              </button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest">
                Important Notice
              </p>
              <div className="text-[8px] text-gray-600 space-y-1">
                <p>• Click "I Have Made Payment" only after sending the crypto</p>
                <p>• Transactions typically take 1-6 network confirmations</p>
                <p>• Your deposit will be reviewed and credited within 24 hours</p>
                <p>• Contact support if your deposit is not credited within 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-28 px-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Deposit Amount</h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enter your deposit details</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/transactions')}
          className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition hover:shadow-orange-500/30"
        >
          Deposit History
        </button>
      </div>

      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-14 space-y-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-in slide-in-from-top-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
            Payment Method
          </label>
          <div className="relative group">
            <select
              value={selectedToken}
              onChange={(e) => {
                setSelectedToken(e.target.value as TokenType);
                setError(null);
              }}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-5 px-6 text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer shadow-inner hover:border-white/10 transition"
            >
              <option value="">--Select Token--</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH (ERC20)">Ethereum (ETH ERC20)</option>
              <option value="USDT (TRC20)">Tether (USDT TRC20)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">
            Enter Amount (USD):
          </label>
          <div className="relative group">
            <input
              type="number"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
                setError(null);
              }}
              min="10"
              step="0.01"
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-6 px-8 text-xl md:text-2xl font-bold text-white focus:outline-none transition shadow-inner placeholder:text-gray-700 hover:border-white/10"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 font-black text-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-[10px] text-gray-600 text-center">
            Minimum deposit: $10
          </p>
        </div>
        
        {selectedToken && depositAmount && tokenPrices[selectedToken as TokenType] && (
          <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-400">You will send:</p>
            <p className="text-2xl font-black text-white mt-1">
              {calculateCryptoAmount()} {selectedToken.split(' ')[0]}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Current price: ${tokenPrices[selectedToken as TokenType].toFixed(2)} per {selectedToken.split(' ')[0]}
            </p>
          </div>
        )}
        
        <div className="pt-6 flex justify-center md:justify-end">
          <button
            disabled={!selectedToken || !depositAmount || pricesLoading}
            onClick={handleProceedToPayment}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest hover:scale-[1.02] transition transform active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Payment
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
            Deposit Instructions
          </h4>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Select your preferred cryptocurrency above</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt=1.5 flex-shrink-0"></div>
              <span>Enter the USD amount you wish to deposit</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Send the exact crypto amount to the provided address</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Click "I Have Made Payment" after sending the crypto</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Your deposit will be credited after network confirmation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Deposit;