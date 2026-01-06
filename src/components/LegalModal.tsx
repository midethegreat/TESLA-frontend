import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = type === 'privacy' ? {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Information We Collect',
        text: 'We collect information you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us. This information may include: name, email address, phone number, postal address, profile picture, payment method, and other information you choose to provide.'
      },
      {
        heading: '2. Use of Information',
        text: 'We use the information we collect to: Provide, maintain, and improve our services; process transactions and send related information; send you technical notices, updates, security alerts, and support and administrative messages; respond to your comments, questions, and customer service requests.'
      },
      {
        heading: '3. Sharing of Information',
        text: 'We may share information about you as follows: With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.'
      },
      {
        heading: '4. Security',
        text: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.'
      },
      {
        heading: '5. Cookies and Other Tracking Technologies',
        text: 'Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies.'
      },
      {
        heading: '6. Your Rights',
        text: 'You may update, correct, or delete information about you at any time by logging into your online account or emailing us.'
      }
    ]
  } : {
    title: 'Terms of Service',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By accessing or using our services, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to all of these terms, do not use our services.'
      },
      {
        heading: '2. Changes to Terms',
        text: 'We reserve the right to change or modify these Terms at any time and in our sole discretion. If we make changes to these Terms, we will provide notice of such changes, such as by sending an email notification or providing notice through our services.'
      },
      {
        heading: '3. Eligibility',
        text: 'You must be at least 18 years of age to access or use our services. By using our services, you represent and warrant that you (a) are 18 years of age or older; (b) have not been previously suspended or removed from our services; and (c) have full power and authority to enter into this agreement.'
      },
      {
        heading: '4. User Accounts',
        text: 'You may need to register for an account to access some or all of our services. You must provide accurate, current, and complete information during the registration process and keep your account information up-to-date.'
      },
      {
        heading: '5. Prohibited Conduct',
        text: 'You agree that you will not violate any law, contract, intellectual property or other third-party right or commit a tort, and that you are solely responsible for your conduct while accessing or using our services.'
      },
      {
        heading: '6. Limitation of Liability',
        text: 'To the fullest extent permitted by applicable law, in no event shall we be liable for any indirect, special, incidental, consequential, exemplary, or punitive damages of any kind.'
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(251,191,36,0.1)] animate-in fade-in zoom-in duration-300 border border-amber-500/20">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">{content.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-amber-500 hover:bg-white/5 rounded-full transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {content.sections.map((section, index) => (
            <div key={index} className="space-y-4 group">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full group-hover:h-8 transition-all duration-300"></span>
                {section.heading}
              </h3>
              <p className="text-gray-400 leading-relaxed text-base font-medium pl-4 border-l border-white/5 group-hover:border-amber-500/30 transition-colors">
                {section.text}
              </p>
            </div>
          ))}
          <div className="pt-8 border-t border-white/5 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
            Legal Document ID: TS-2026-X942 • Last updated: Jan 06, 2026
          </div>
        </div>
        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-center">
          <button
            onClick={onClose}
            className="gradient-button px-10 py-3 rounded-full text-sm tracking-widest uppercase hover:scale-105 transition-transform duration-200 shadow-lg shadow-amber-500/20"
          >
            Acknowledge & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
