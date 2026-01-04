import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Mail, Clock, Send, ChevronDown, ChevronUp } from 'lucide-react';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How to deposit funds?',
      a: 'To deposit funds, navigate to the Deposit page, select your preferred cryptocurrency, enter the amount in USD, and follow the payment instructions provided.'
    },
    {
      q: 'Withdrawal process explained',
      a: 'Once your KYC is approved, you can request a withdrawal from the Withdraw page. Enter the amount and your wallet address. Requests are processed within 24-48 hours.'
    },
    {
      q: 'Investment plan details',
      a: 'We offer various investment strategies with different ROI and periods. You can view all available options on the Investment Plans page.'
    },
    {
      q: 'KYC verification guide',
      a: 'Go to the KYC section in your dashboard, upload a clear photo of your ID (front and back) and a selfie holding your ID. Our system auto-approves verified documents.'
    },
    {
      q: 'Referral program FAQ',
      a: 'Share your unique referral link found in the Referral section. You earn bonuses when your friends join and invest in our premium strategies.'
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    alert('Ticket submitted successfully!');
    setSubject('');
    setMessage('');
  };

  const openTelegram = () => {
    window.open('https://t.me/Allyssabroker', '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto pb-32 px-2 md:px-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Support Center</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Get help with your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Contact Support</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={openTelegram}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
              >
                <MessageSquare size={24} className="text-blue-500" />
                <span className="font-bold text-white">Telegram</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Live Chat</span>
              </button>

              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                <Mail size={24} className="text-green-500" />
                <span className="font-bold text-white">Email</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">support@teslainvest.com</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h5 className="text-sm font-bold text-white mb-4">Response Time</h5>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">Average response time: 2-4 hours</span>
              </div>
            </div>
          </div>

          {/* Create Ticket Form */}
          <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Create New Ticket</h4>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What do you need help with?"
                  className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none transition shadow-inner"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none transition shadow-inner resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest shadow-xl hover:scale-[1.02] transition transform flex items-center justify-center gap-3"
              >
                <Send size={16} />
                Submit Ticket
              </button>
            </form>
          </div>
        </div>

        {/* Quick Help Collapsible FAQ */}
        <div className="space-y-6">
          <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Quick Help</h4>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className={`text-sm font-bold transition-colors ${openFaq === index ? 'text-amber-500' : 'text-gray-300 group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={16} className="text-amber-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500 group-hover:text-white" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="mt-3 text-xs text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
