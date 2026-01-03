import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface KYCWarningProps {
  isVisible: boolean;
  onClose: () => void;
}

const KYCWarning: React.FC<KYCWarningProps> = ({ isVisible, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClosing = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

useEffect(() => {
  if (isVisible) {
    const timer = setTimeout(handleClosing, 5000);

    return () => {
      clearTimeout(timer);
      setIsClosing(false);
    };
  }
}, [isVisible, onClose]);

  if (!isVisible && !isClosing) return null;

  return (
    <div
      className={`fixed top-24 right-4 md:right-8 lg:right-12 z-[200] w-[calc(100%-2rem)] max-w-[420px] animate-in slide-in-from-right duration-500 ${
        isClosing ? 'animate-out slide-out-to-right' : ''
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-black/5">
        <div className="p-5 md:p-6 flex items-start gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
            <AlertTriangle size={20} className="md:size-[24px]" />
          </div>
          <div className="flex-grow space-y-1 pt-0.5">
            <h4 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">warning</h4>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-bold leading-tight">
              Your account is unverified with KYC.
            </p>
          </div>
          <button
            onClick={() => {
              setIsClosing(true);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-[4px] bg-amber-500/10 w-full">
          <div
            className={`h-full bg-gradient-to-r from-amber-400 to-amber-600 ${
              isClosing ? 'animate-none' : 'animate-kyc-timer'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default KYCWarning;