// App.tsx (Updated)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Reset from "./components/Auth/ResetPassword";

import Home from "./Pages/Home/Home";
import Layout from "./components/Navigation/Layout";
import AuthGuard from "./components/Auth/AuthGuard";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ResetPassword from "./components/Auth/ResetPassword";
import DashboardHome from "./components/Dashboard/DashboardHome";
import Deposit from "./components/Dashboard/Deposit";
import InvestmentLogs from "./components/Dashboard/InvestmentLogs";
import InvestmentPreview from "./components/Dashboard/InvestmentPreview";
import KYCVerify from "./components/Dashboard/KYCVerify";
import Ranking from "./components/Dashboard/Ranking";
import Referral from "./components/Dashboard/Referral";
import Support from "./components/Dashboard/Support";
import Transactions from "./components/Dashboard/Transactions";
import Withdraw from "./components/Dashboard/Withdraw";
import InvestmentPlans from "./components/InvestmentPlans";
import Settings from "./components/Dashboard/Settings";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminKYC from "./components/admin/AdminKYC";
import AdminLayout from "./components/admin/AdminLayout";
import AdminPanel from "./components/admin/AdminPanel";
import  AdminRoute  from "./components/admin/AdminRoute";
import AdminUsers from "./components/admin/AdminUsers";
import AdminLogin from "./components/Auth/AdminLogin";




export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />

        {/* Admin Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Public Home Page */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        {/* User Dashboard Routes (Protected) */}
        <Route
          path="/dashboard/*"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          {/* Define all dashboard routes here */}
          <Route index element={<DashboardHome />} />
          <Route path="plans" element={<InvestmentPlans />} />
          <Route path="investment-preview" element={<InvestmentPreview />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="referral" element={<Referral />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="settings" element={<Settings />} />
          <Route path="kyc" element={<KYCVerify />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="logs" element={<InvestmentLogs />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Admin Dashboard Routes (Protected) */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="kyc" element={<AdminKYC />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="documents" element={<AdminPanel />} />
          <Route
            path="settings"
            element={<div className="p-6">Admin Settings (Coming Soon)</div>}
          />
        </Route>

        {/* Redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
