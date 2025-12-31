// components/Admin/AdminLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { adminService } from "../../services/admin.service";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = adminService.getAdminUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      icon: <BarChart3 size={20} />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <FileText size={20} />, label: "KYC", path: "/admin/kyc" },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  if (!user) {
    return null;
  }

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
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30">
                <BarChart3 className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tesla Admin</h1>
                <p className="text-gray-400 text-xs">Investment Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
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
                <p className="text-gray-400 text-xs capitalize">
                  {user.role.toLowerCase()} •{" "}
                  <span className="text-green-400">Online</span>
                </p>
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
