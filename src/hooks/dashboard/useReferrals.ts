// hooks/dashboard/useReferrals.ts
import { useState, useEffect } from 'react'
import { ReferralService } from '@/services/referral.service'
import { ProfileService } from '@/services/Profile.service'

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<any[]>([])
  const [referralUrl, setReferralUrl] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        // Get profile to get referralId
        const profile = await ProfileService.getProfile()
        
        // Generate referral URL
        const url = ReferralService.generateReferralUrl(profile.referralId)
        setReferralUrl(url)
        
        // Get referral stats
        const referralStats = await ReferralService.getStats()
        setStats(referralStats)
        
        // Get referral history
        const history = await ReferralService.getHistory()
        setReferrals(history)
      } catch (error) {
        console.error('Error fetching referral data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [])

  return { referrals, referralUrl, stats, loading }
}