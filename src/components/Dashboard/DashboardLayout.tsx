import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardBottomNav from './DashboardBottomNav';
import DashboardHeader from './DashboardHeader';
import KYCWarning from './KYCWarning';
import DashboardSidebar from './Sidebar';
import { authService } from '@/services/auth.service';
import {  RefreshCw } from 'lucide-react';
import { ProfileService } from '@/services/Profile.service';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isKycWarningVisible, setKycWarningVisible] = useState(false);
 const navigate = useNavigate();
  const [, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {    
      const profile = await ProfileService.getProfile();
      
      const updatedUser = {
        ...currentUser,
        profile: profile
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    }
  };

  useEffect(() => {
    console.log("Dashboard mounting, checking auth...");
    
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = authService.isAuthenticated();
       
        
        if (!isAuthenticated) {
          console.log("Not authenticated, redirecting to login");
          navigate("/login");
          return;
        }

        // Get current user from localStorage
        let user = authService.getCurrentUser();
    
        
        if (!user) {
          console.log("No user found in localStorage, but token exists");
          
          const token = localStorage.getItem("token");
          if (token) {
            user = {
              id: "unknown",
              email: "user@example.com",
              firstName: "User",
              lastName: "",
              role: "CUSTOMER",
              referralId: "",
              emailVerified: true,
              profile: null
            };
            
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Created minimal user");
          } else {
            console.log("No token either, redirecting to login");
            navigate("/login");
            return;
          }
        }
        
        setCurrentUser(user);
        
        await fetchUserProfile();
        
      } catch (error) {
        console.error("Auth check error:", error);
        setError("Authentication error");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };


  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-orange-500 rounded-lg text-white flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 px-4 py-2 bg-gray-700 rounded-lg text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-display overflow-hidden selection:bg-amber-500/30">
      <style>{`
        @keyframes kycProgress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-kyc-timer { animation: kycProgress 5s linear forwards; }
        
        /* Custom scrollbar styling - only show when needed */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        /* Hide scrollbar when not needed */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <KYCWarning isVisible={isKycWarningVisible} onClose={() => setKycWarningVisible(false)} />

      {/* Desktop Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area - FIXED VERSION */}
      <div className="flex-1 flex flex-col min-h-0 h-screen">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
            
            {/* Add bottom padding for mobile nav */}
            <div className="h-24 lg:hidden"></div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <DashboardBottomNav />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;