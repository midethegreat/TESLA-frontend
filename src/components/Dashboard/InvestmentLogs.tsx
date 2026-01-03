import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, TrendingUp, Wallet, CheckCircle2 } from 'lucide-react';

const InvestmentLogs: React.FC = () => {
  const navigate = useNavigate();

  const logs = [
    {
      id: 1,
      plan: 'Tesla Basic',
      amount: '$100',
      status: 'active',
      profit: '$5',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      icon: <TrendingUp className="text-green-500" size={20} />,
    },
    {
      id: 2,
      plan: 'Tesla Pro',
      amount: '$500',
      status: 'completed',
      profit: '$75',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      icon: <CheckCircle2 className="text-blue-500" size={20} />,
    },
    {
      id: 3,
      plan: 'Tesla Elite',
      amount: '$1000',
      status: 'pending',
      profit: '$0',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      icon: <Clock className="text-amber-500" size={20} />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-28 px-4">
      <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-4 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Investment Logs</h3>
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar -mx-4 px-4 pb-4">
          <table className="w-full text-left min-w-[600px] md:min-w-[800px]">
            <thead>
              <tr className="bg-white/5 rounded-2xl overflow-hidden">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 first:rounded-l-2xl">
                  Investment Plan
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Amount
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Profit</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Start Date</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">End Date</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 last:rounded-r-2xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          {log.icon}
                        </div>
                        <span className="font-bold text-white">{log.plan}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-amber-500" />
                        <span className="font-bold text-white">{log.amount}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-bold text-green-500">{log.profit}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-300">{log.startDate}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-300">{log.endDate}</span>
                    </td>
                    <td className="py-5 px-6">
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Wallet size={32} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
                          NO INVESTMENT LOGS FOUND
                        </p>
                        <p className="text-gray-500 text-sm mt-2">Start investing to see your logs here</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      {log.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest">{log.plan}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{log.startDate}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Invested</p>
                    <p className="text-sm font-black text-white">{log.amount}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Profit</p>
                    <p className="text-sm font-black text-green-500">{log.profit}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
                  <span className="text-gray-500 uppercase tracking-widest font-black">Ends on</span>
                  <span className="text-gray-300 font-bold">{log.endDate}</span>
                </div>
                
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-white/5">
                  View Full Details
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Logs Found</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Showing {logs.length} of {logs.length} investments
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-xs font-medium transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentLogs;