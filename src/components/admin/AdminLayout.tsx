// components/Admin/AdminLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  Home,
  FileText as FileTextIcon,
  Shield,
} from "lucide-react";

import { adminService } from "../../services/admin.service";
import { useAdminAuth } from "@/hooks/dashboard/useAdminAuth";
import Logo from "../logo/logo";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { logout } = useAdminAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await adminService.getAdminUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <FileText size={20} />, label: "KYC", path: "/admin/kyc" },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: <FileTextIcon size={20} />,
      label: "Documents",
      path: "/admin/documents",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-400">Loading admin session...</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1c1c1c] border border-white/10"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1c1c1c] border-r border-white/10 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <Logo size="md" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Super Admin Only Section */}
            {isSuperAdmin && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 px-3 mb-2">
                  Super Admin Tools
                </p>
                <Link
                  to="/admin/superadmin"
                  className="flex items-center gap-3 p-3 rounded-lg text-amber-300 hover:bg-amber-500/10 transition"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Admin Management</span>
                </Link>
              </div>
            )}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center">
                <span className="font-bold">
                  {user.firstName?.[0] || user.email[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-gray-400 text-xs capitalize">
                    {user.role.toLowerCase()}
                  </span>
                  {isSuperAdmin && (
                    <span className="text-xs text-amber-500 font-medium">
                      • Super
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#1c1c1c]/80 backdrop-blur-lg border-b border-white/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Admin Dashboard</h2>
              <p className="text-gray-400 text-sm">
                Welcome back, {user.firstName || user.email}
                {isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-400 text-xs rounded-full">
                    SUPER ADMIN
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center">
                    <span className="font-bold text-sm">
                      {user.firstName?.[0] || user.email[0]}
                    </span>
                  </div>
                  <ChevronDown size={16} />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1c1c1c] border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 border-b border-white/10">
                    <p className="font-medium truncate">{user.email}</p>
                    <p className="text-gray-400 text-xs capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 transition text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
