// hooks/dashboard/useKyc.ts
import { ProfileService } from '@/services/Profile.service';
import type { KycStatusResponse } from '@/types/profile';
import { useState, useEffect, useCallback } from 'react';


export const useKyc = () => {
  const [kycStatus, setKycStatus] = useState<KycStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKycStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await ProfileService.getKycStatus();
      setKycStatus(status);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch KYC status');
      console.error('KYC fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  return {
    kycStatus,
    loading,
    error,
    fetchKycStatus,
  };
};