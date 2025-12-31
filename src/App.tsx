import {
  BrowserRouter as Router,
  Routes,
  Route,
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

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
      </Routes>
    </Router>
  );
}