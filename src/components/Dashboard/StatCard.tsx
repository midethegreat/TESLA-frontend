import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend} this month
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;