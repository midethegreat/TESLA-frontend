import { useState, useEffect } from 'react';

export const useTokenPrices = () => {
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd'
        );
        if (!response.ok) throw new Error('Price service unavailable');
        const data = await response.json();
        setTokenPrices({
          BTC: data.bitcoin.usd,
          'ETH (ERC20)': data.ethereum.usd,
          'USDT (TRC20)': data.tether.usd,
        });
      } catch (error) {
        console.error('Error fetching prices:', error);
        setTokenPrices({ BTC: 98500, 'ETH (ERC20)': 2650, 'USDT (TRC20)': 1 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return { tokenPrices, isLoading };
};