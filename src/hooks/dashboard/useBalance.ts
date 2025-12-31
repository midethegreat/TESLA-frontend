// hooks/dashboard/useBalance.ts
import { ProfileService } from '@/services/Profile.service';
import { useState, useEffect, useCallback } from 'react';

interface DepositState {
  amount: string;
  selectedToken: string;
  step: 'entry' | 'payment';
  address: string;
}

interface WithdrawState {
  amount: string;
  selectedToken: string;
  step: 'amount' | 'address';
  address: string;
}

export const useBalance = () => {
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deposit states
  const [depositState, setDepositState] = useState<DepositState>({
    amount: '',
    selectedToken: '',
    step: 'entry',
    address: '',
  });

  // Withdraw states
  const [withdrawState, setWithdrawState] = useState<WithdrawState>({
    amount: '',
    selectedToken: 'BTC',
    step: 'amount',
    address: '',
  });

  // Fetch balance from backend
  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await ProfileService.getStats();
      setAvailableBalance(stats.availableBalance);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance');
      console.error('Balance fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch live token prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
        );
        
        if (!response.ok) throw new Error("Price service unavailable");
        
        const data = await response.json();
        setTokenPrices({
          BTC: data.bitcoin.usd,
          "ETH (ERC20)": data.ethereum.usd,
          "USDT (TRC20)": data.tether.usd,
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
        // Fallback to static prices
        setTokenPrices({ BTC: 98500, "ETH (ERC20)": 2650, "USDT (TRC20)": 1 });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Deposit actions
  const setDepositAmount = useCallback((amount: string) => {
    setDepositState(prev => ({ ...prev, amount }));
  }, []);

  const setDepositToken = useCallback((token: string) => {
    setDepositState(prev => ({ ...prev, selectedToken: token }));
  }, []);

  const setDepositStep = useCallback((step: 'entry' | 'payment') => {
    setDepositState(prev => ({ ...prev, step }));
  }, []);

  // Withdraw actions
  const setWithdrawAmount = useCallback((amount: string) => {
    setWithdrawState(prev => ({ ...prev, amount }));
  }, []);

  const setWithdrawToken = useCallback((token: string) => {
    setWithdrawState(prev => ({ ...prev, selectedToken: token }));
  }, []);

  const setWithdrawStep = useCallback((step: 'amount' | 'address') => {
    setWithdrawState(prev => ({ ...prev, step }));
  }, []);

  const setWithdrawAddress = useCallback((address: string) => {
    setWithdrawState(prev => ({ ...prev, address }));
  }, []);

  // Helper functions
  const calculateCryptoAmount = (token: string, usdAmount: string) => {
    if (!token || !usdAmount || !tokenPrices[token]) return "0.000000";
    const usd = parseFloat(usdAmount);
    const price = tokenPrices[token];
    return (usd / price).toFixed(token === "BTC" ? 8 : 6);
  };

  const refreshBalance = async () => {
    await fetchBalance();
  };

  return {
    // Balance state
    availableBalance,
    tokenPrices,
    isLoading,
    error,
    
    // Deposit state and actions
    depositState,
    setDepositAmount,
    setDepositToken,
    setDepositStep,
    
    // Withdraw state and actions
    withdrawState,
    setWithdrawAmount,
    setWithdrawToken,
    setWithdrawStep,
    setWithdrawAddress,
    
    // Helper functions
    calculateCryptoAmount,
    refreshBalance,
  };
};