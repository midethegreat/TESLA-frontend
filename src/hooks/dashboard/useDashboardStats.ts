// hooks/dashboard/useDashboardStats.ts
import { useState, useEffect, useCallback } from 'react';

import type { UserStats } from '@/types/profile';
import { ProfileService } from '@/services/Profile.service';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await ProfileService.getStats();
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard statistics');
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
};