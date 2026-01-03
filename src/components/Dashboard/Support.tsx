import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Mail, Phone, Clock, ExternalLink, Send } from 'lucide-react';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [tickets] = useState([
    {
      id: 1,
      subject: 'Deposit Not Showing',
      status: 'open',
      lastUpdated: '2 hours ago',
      priority: 'high',
      messages: 3,
    },
    {
      id: 2,
      subject: 'Withdrawal Question',
      status: 'closed',
      lastUpdated: '3 days ago',
      priority: 'medium',
      messages: 5,
    },
    {
      id: 3,
      subject: 'Investment Plan Query',
      status: 'open',
      lastUpdated: '1 day ago',
      priority: 'low',
      messages: 2,
    },
  ]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'open' 
      ? 'bg-green-500/10 text-green-500' 
      : 'bg-gray-500/10 text-gray-500';
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Phone size={24} className="text-purple-500" />
                <span className="font-bold text-white">Phone</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">+1 (234) 567-8900</span>
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

        {/* Ticket History */}
        <div className="space-y-6">
          <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Ticket History</h4>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-bold text-white truncate">{ticket.subject}</h5>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                      <MessageSquare size={12} />
                      <span>{ticket.messages}</span>
                      <Clock size={12} />
                      <span>{ticket.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
              View All Tickets
            </button>
          </div>

          {/* FAQ Quick Links */}
          <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-4">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Quick Help</h4>
            {[
              'How to deposit funds?',
              'Withdrawal process explained',
              'Investment plan details',
              'KYC verification guide',
              'Referral program FAQ',
            ].map((faq, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span className="text-sm text-gray-300">{faq}</span>
                <ExternalLink size={16} className="text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;