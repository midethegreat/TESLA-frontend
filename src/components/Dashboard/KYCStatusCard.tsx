// components/KYCStatusCard.tsx
import React from 'react'
import { CheckCircle, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import type { KycStatusResponse } from '@/types/profile'

interface KYCStatusCardProps {
  kycStatus: KycStatusResponse
  onRetry?: () => void
  fullName?: string 
}

const KYCStatusCard: React.FC<KYCStatusCardProps> = ({ kycStatus, onRetry, fullName }) => {
  const getStatusConfig = () => {
    const status = kycStatus.kycStatus
    
    switch (status) {
      case 'verified':
        return {
          title: 'KYC Verified',
          description: 'Your identity has been successfully verified.',
          icon: <CheckCircle className="text-green-500" size={48} />,
          color: 'bg-green-500/10 border-green-500/20',
          textColor: 'text-green-400',
          showDate: true,
          date: kycStatus.kycVerifiedAt,
          dateLabel: 'Verified on',
          showDetails: true
        }
      case 'pending':
        return {
          title: 'KYC Under Review',
          description: 'Your documents are being reviewed. This usually takes 24-48 hours.',
          icon: <Clock className="text-yellow-500" size={48} />,
          color: 'bg-yellow-500/10 border-yellow-500/20',
          textColor: 'text-yellow-400',
          showDate: true,
          date: kycStatus.kycSubmittedAt,
          dateLabel: 'Submitted on',
          showDetails: true
        }
      case 'rejected':
        return {
          title: 'KYC Rejected',
          description: kycStatus.kycRejectionReason || 'Your KYC submission was rejected.',
          icon: <XCircle className="text-red-500" size={48} />,
          color: 'bg-red-500/10 border-red-500/20',
          textColor: 'text-red-400',
          showDate: true,
          date: kycStatus.kycRejectedAt,
          dateLabel: 'Rejected on',
          showDetails: true,
          showRetry: true
        }
      default:
        return {
          title: 'KYC Not Submitted',
          description: 'Complete KYC verification to unlock all platform features.',
          icon: <AlertCircle className="text-gray-500" size={48} />,
          color: 'bg-gray-500/10 border-gray-500/20',
          textColor: 'text-gray-400',
          showDate: false,
          showDetails: false,
          showRetry: false
        }
    }
  }

  const config = getStatusConfig()

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`glass-card ${config.color} border rounded-[2rem] p-8 md:p-12 shadow-2xl space-y-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            {config.icon}
          </div>
          <div>
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${config.textColor}`}>
              {config.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {config.description}
            </p>
            {fullName && (
              <p className="text-gray-300 text-sm font-medium mt-2">
                Name: {fullName}
              </p>
            )}
          </div>
        </div>
        
        {config.showDate && (
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {config.dateLabel}
            </p>
            <p className="text-white text-sm font-medium mt-1">
              {formatDate(config.date)}
            </p>
          </div>
        )}
      </div>

      {/* Status Details */}
      {config.showDetails && (
        <div className="space-y-4">
          {kycStatus.kycStatus === 'pending' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-yellow-500" />
                <h4 className="text-white font-bold">What happens next?</h4>
              </div>
              <ul className="space-y-2 pl-7">
                <li className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  Our compliance team is reviewing your documents
                </li>
                <li className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  You'll receive an email notification once the review is complete
                </li>
                <li className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  This process typically takes 24-48 business hours
                </li>
                <li className="text-gray-400 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  You cannot submit new documents while this review is in progress
                </li>
              </ul>
            </div>
          )}

          {kycStatus.kycStatus === 'rejected' && kycStatus.kycRejectionReason && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <h4 className="text-red-400 font-bold text-sm mb-1">Rejection Reason:</h4>
              <p className="text-gray-300 text-sm">{kycStatus.kycRejectionReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-bold rounded-xl hover:scale-[1.02] transition transform active:scale-95"
          >
            Submit New Documents
          </button>
        )}
        
        {kycStatus.kycStatus === 'verified' && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={20} />
            <span className="font-bold">Full platform access unlocked</span>
          </div>
        )}
        
        {kycStatus.kycStatus === 'pending' && (
          <button
            onClick={() => window.location.href = '/support'}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition"
          >
            Contact Support
          </button>
        )}
      </div>
    </div>
  )
}

export default KYCStatusCard