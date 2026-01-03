// components/ProtectedAdminRoute.tsx
import { adminService } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
 
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!adminService.isAdminLoggedIn()) {
          setIsAuthorized(false);
          return;
        }

        const user = adminService.getAdminUser();

        if (!user) {
          setIsAuthorized(false);
          return;
        }

        if (requireSuperAdmin && user.role !== "SUPERADMIN") {
          setIsAuthorized(false);
          return;
        }

        const response = await adminService.verifyToken();

        if (response.success) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireSuperAdmin, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};
