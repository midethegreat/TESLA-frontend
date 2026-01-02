import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Lock, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Adjust path as needed

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); 
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 // Get the avatar URL to display
  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      return user?.avatarUrl;
    }
    
    if (user?.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      return `${window.location.origin}${user.avatar}`;
    }
    
    return null;
  };

  const avatarUrl = getAvatarUrl();
    

  const handleLogout = () => {
    logout(); 
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="h-20 lg:h-24 border-b border-white/5 px-4 md:px-8 flex items-center justify-between bg-[#0d0d0d]/80 backdrop-blur-3xl relative z-40 w-full">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] text-white truncate max-w-[150px] md:max-w-none">
            Dashboard
          </h2>
          <p className="text-xs text-gray-400">Welcome back, {user?.firstName || 'User'}!</p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6 relative">
        <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-gray-400">
          <span className="text-[10px] font-black uppercase tracking-widest">EN</span>
          <ChevronDown size={14} />
        </div>

        {/* Notification Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 relative border border-white/5 group active:scale-95 transition-transform"
          >
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d0d]"></span>
          </button>

          {notificationOpen && (
            <div className="fixed md:absolute top-24 md:top-[calc(100%+12px)] right-4 md:right-0 w-[calc(100%-32px)] md:w-96 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
              <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest mb-4">
                Notifications
              </h3>
              <div className="w-full h-[1px] bg-white/5 mb-6"></div>
              <div className="bg-[#242424]/60 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  No Notification Found!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
  onClick={() => setProfileOpen(!profileOpen)}
  className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center border-2 border-white/30 overflow-hidden shadow-xl shadow-orange-500/30 active:scale-95 transition-transform group hover:shadow-orange-500/40"
>
  {avatarUrl ? (
    <div className="absolute inset-0 w-full h-full">
      <img 
        src={avatarUrl} 
        alt={`${user?.firstName} ${user?.lastName}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-600/20 mix-blend-overlay"></div>
    </div>
  ) : (
    <>
      <User size={20} className="text-white relative z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-600 animate-pulse-slow"></div>
    </>
  )}
  
  {/* Hover ring effect */}
  <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-white/50 transition-all duration-300"></div>
</button>

          {profileOpen && (
            <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-4 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <div className="space-y-1">
                <Link
                  to="/dashboard/settings"
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={18} className="text-gray-500 group-hover:text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Settings</span>
                </Link>
                <Link
                  to="/dashboard/reset-password"
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                  onClick={() => setProfileOpen(false)}
                >
                  <Lock size={18} className="text-gray-500 group-hover:text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Change Password</span>
                </Link>
                <Link
                  to="/dashboard/support"
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group"
                  onClick={() => setProfileOpen(false)}
                >
                  <HelpCircle size={18} className="text-gray-500 group-hover:text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Support Tickets</span>
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all group"
                >
                  <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                    <LogOut size={14} className="ml-0.5" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;