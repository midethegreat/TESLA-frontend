import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Wallet, Users, Settings } from 'lucide-react';

const DashboardBottomNav: React.FC = () => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/dashboard' },
    { icon: <TrendingUp size={22} />, label: 'Invest', path: '/dashboard/plans' },
    { icon: <Wallet size={22} />, label: 'Wallet', path: '/dashboard/deposit' },
    { icon: <Users size={22} />, label: 'Referral', path: '/dashboard/referral' },
    { icon: <Settings size={22} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around z-[100] shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1.5 min-w-[60px] transition-all ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <div
              className={`relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-[16px] md:rounded-[18px] transition-all duration-300 ${
                navItems.find((n) => n.path === item.path)?.path === '/dashboard'
                  ? 'bg-gradient-to-b from-[#ff8c00] to-[#ff4500]'
                  : ''
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                size: 22,
                className: item.path === '/dashboard' ? 'text-white' : 'text-white/60',
              })}
            </div>
            <span
              className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-center ${
                item.path === '/dashboard' ? 'text-white' : 'text-white/50'
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default DashboardBottomNav;