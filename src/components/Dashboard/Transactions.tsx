import React, { useState, useEffect } from 'react';
import { TransactionService, type Transaction, type TransactionType, type TransactionStatus } from '@/services/transaction.service';
import { Loader2, AlertCircle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    type?: TransactionType;
    status?: TransactionStatus;
  }>({
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters.page, filters.type, filters.status]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TransactionService.getMyTransactions(filters);
      setTransactions(response.transactions);
      setPagination({
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'PENDING':
        return <Clock size={16} className="text-amber-500" />;
      case 'FAILED':
        return <XCircle size={16} className="text-red-500" />;
      case 'CANCELLED':
        return <XCircle size={16} className="text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-500';
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-500';
      case 'FAILED':
        return 'bg-red-500/20 text-red-500';
      case 'CANCELLED':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-28 px-4">
      <div className="glass-card bg-[#1a1a1a]/40 border border-white/5 rounded-[2.5rem] p-4 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            My Transactions
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="flex-grow md:flex-initial px-4 py-2 rounded-full bg-white/5 text-sm text-white border border-white/10 focus:outline-none min-w-[120px]"
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
              <option value="PROFIT">Profit</option>
              <option value="BONUS">Bonus</option>
            </select>
            
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="flex-grow md:flex-initial px-4 py-2 rounded-full bg-white/5 text-sm text-white border border-white/10 focus:outline-none min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="w-full md:w-auto px-4 py-2 rounded-full bg-amber-500 text-black font-bold text-sm uppercase tracking-widest hover:bg-amber-600 transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Refresh'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}
        
        <div className="hidden md:block overflow-x-auto custom-scrollbar -mx-4 px-4 pb-4">
          <table className="w-full text-left min-w-[600px] md:min-w-[800px]">
            <thead>
              <tr className="bg-white/5 rounded-2xl overflow-hidden">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 first:rounded-l-2xl">
                  Date
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Description
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Reference
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Type</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Amount</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 last:rounded-r-2xl">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400">{formatDate(transaction.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{transaction.description}</span>
                        <span className="text-xs text-gray-500">{transaction.reference}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono text-gray-400 truncate max-w-[120px] block">
                        {transaction._id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        transaction.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-500' :
                        transaction.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black ${
                          transaction.type === 'DEPOSIT' || 
                          transaction.type === 'PROFIT' || 
                          transaction.type === 'BONUS' ||
                          transaction.type === 'REFERRAL_BONUS' ||
                          transaction.type === 'DEPOSIT_BONUS' ||
                          transaction.type === 'INVESTMENT_BONUS'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {transaction.type === 'DEPOSIT' || 
                           transaction.type === 'PROFIT' || 
                           transaction.type === 'BONUS' ||
                           transaction.type === 'REFERRAL_BONUS' ||
                           transaction.type === 'DEPOSIT_BONUS' ||
                           transaction.type === 'INVESTMENT_BONUS'
                            ? '+' : '-'}
                          ${transaction.amount.toFixed(2)}
                        </span>
                        {transaction.cryptoAmount && transaction.token && (
                          <span className="text-xs text-gray-500">
                            {transaction.cryptoAmount.toFixed(6)} {transaction.token}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {transaction.walletAddress && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Wallet:</span>
                          <span className="text-xs font-mono text-gray-400 truncate max-w-[150px]">
                            {transaction.walletAddress}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden space-y-4">
          {transactions.length === 0 ? (
            <div className="py-12 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Transactions Found</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction._id} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{formatDate(transaction.createdAt)}</p>
                    <p className="text-xs font-black text-white uppercase tracking-tight">{transaction.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      transaction.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-500' :
                      transaction.type === 'WITHDRAWAL' ? 'bg-red-500/20 text-red-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {transaction.type}
                    </span>
                    <p className="text-[9px] font-mono text-gray-600 truncate max-w-[120px]">REF: {transaction._id}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${
                      transaction.type === 'DEPOSIT' || 
                      transaction.type === 'PROFIT' || 
                      transaction.type === 'BONUS' ||
                      transaction.type === 'REFERRAL_BONUS' ||
                      transaction.type === 'DEPOSIT_BONUS' ||
                      transaction.type === 'INVESTMENT_BONUS'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {transaction.type === 'DEPOSIT' || 
                       transaction.type === 'PROFIT' || 
                       transaction.type === 'BONUS' ||
                       transaction.type === 'REFERRAL_BONUS' ||
                       transaction.type === 'DEPOSIT_BONUS' ||
                       transaction.type === 'INVESTMENT_BONUS'
                        ? '+' : '-'}
                      ${transaction.amount.toFixed(2)}
                    </p>
                    {transaction.cryptoAmount && transaction.token && (
                      <p className="text-[9px] text-gray-500 font-bold">
                        {transaction.cryptoAmount.toFixed(6)} {transaction.token}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <div className="text-sm text-gray-500">
              Showing {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page === 1 || loading}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (pagination.totalPages > 5) {
                    if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
                        filters.page === pageNum
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page === pagination.totalPages || loading}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;