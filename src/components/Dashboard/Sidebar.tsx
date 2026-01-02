import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  History,
  ArrowLeftRight,
  PlusCircle,
  ArrowUpCircle,
  Award,
  Users,
  SettingsIcon,
  LifeBuoy,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; 
import Logo from '../logo/logo';

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { name: 'Investment Plans', icon: <Layers size={20} />, path: '/dashboard/plans' },
  { name: 'Investment Logs', icon: <History size={20} />, path: '/dashboard/logs' },
  { name: 'Transactions', icon: <ArrowLeftRight size={20} />, path: '/dashboard/transactions' },
  { name: 'Deposit', icon: <PlusCircle size={20} />, path: '/dashboard/deposit' },
  { name: 'Withdraw', icon: <ArrowUpCircle size={20} />, path: '/dashboard/withdraw' },
  { name: 'Ranking', icon: <Award size={20} />, path: '/dashboard/ranking' },
  { name: 'Referral', icon: <Users size={20} />, path: '/dashboard/referral' },
  { name: 'Settings', icon: <SettingsIcon size={20} />, path: '/dashboard/settings' },
  { name: 'Support', icon: <LifeBuoy size={20} />, path: '/dashboard/support' },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSupportClick = () => {
    window.open('https://t.me/Allyssabroker', '_blank');
  };

  const handleLogout = () => {
    logout(); 
    navigate('/');
  };

  return (
    <aside
      className={`bg-[#0d0d0d] border-r border-white/5 hidden lg:flex flex-col transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-24"
      }`}
    >
      <div className="p-6 flex items-center justify-between ">
        <Logo
          size={isOpen ? "md" : "xs"}
          className={`h-6 tesla-red-filter transition-all ${
            !isOpen ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
          }`}
        />
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-white p-2 bg-white/5 rounded-xl"
        >
          <ChevronLeft size={20} className={!isOpen ? "rotate-180" : ""} />
        </button>
      </div>
      <nav className="flex-grow px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => {
          const isActive =
            window.location.pathname === item.path ||
            (item.path === "/dashboard/settings" &&
              window.location.pathname.includes("/dashboard/kyc")) ||
            (item.path === "/dashboard/settings" &&
              window.location.pathname.includes("/dashboard/reset-password"));

          return (
            <button
              key={idx}
              onClick={() =>
                item.path === "/dashboard/support"
                  ? handleSupportClick()
                  : navigate(item.path)
              }
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] transition-all relative group ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/30"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut size={18} />
          {isOpen && (
            <span className="text-[10px] font-black uppercase tracking-widest">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;