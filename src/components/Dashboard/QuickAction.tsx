import React from 'react';
import { Link } from 'react-router-dom';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  link: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, action, link, color }) => {
  return (
    <div className={`rounded-2xl p-6 border ${color} hover:border-white/30 transition-colors`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {icon}
      </div>
      <Link
        to={link}
        className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
      >
        {action}
      </Link>
    </div>
  );
};

export default QuickAction;