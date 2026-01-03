// components/Admin/AdminRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { Navigate,  useLocation } from "react-router-dom";
import { adminService } from "../../services/admin.service";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if admin token exists
        if (!adminService.isAdminLoggedIn()) {
          setIsAuthorized(false);
          return;
        }

        // Get current user
        const user = adminService.getAdminUser();

        if (!user) {
          setIsAuthorized(false);
          return;
        }

        // Check if user has admin or superadmin role
        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
          setIsAuthorized(false);
          return;
        }

        // Verify token with server
        const response = await adminService.verifyToken();

        if (response.success) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Admin auth check error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
          <div>
            <p className="text-gray-300 font-medium">Verifying Admin Access</p>
            <p className="text-gray-500 text-sm mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to admin login with return URL
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
