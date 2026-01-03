import { Mail, Loader2, RefreshCw, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authService,
  type ResetRequestData,
  type ResetConfirmData,
} from "../../services/auth.service";

export default function Reset() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  // Step 1: Request reset
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data: ResetRequestData = { email };
      const res = await authService.resetRequest(data);

      if (!res.data.success) {
        setError(res.data.message || "Reset request failed");
        return;
      }

      setStep("verify");
      setSuccess("Reset code sent! Please check your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset request failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm reset
  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setRefreshing(true);

    try {
      const data: ResetConfirmData = { email, code, newPassword };
      const res = await authService.resetConfirm(data);

      if (!res.data.success) {
        setError(res.data.message || "Reset failed");
        return;
      }

      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleBack = () => {
    if (step === "verify") {
      setStep("request");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(null);
    } else {
      navigate("/login");
    }
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 font-display">
        <div className="w-full max-w-xl glass-card p-10 md:p-12 rounded-2xl text-center space-y-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <ShieldCheck size={40} className="text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Create New Password</h1>
            <p className="text-gray-400 text-sm">
              Enter the 6-digit code sent to <span className="text-amber-500 font-bold">{email}</span>
            </p>
          </div>

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleResetConfirm} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block text-left">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block text-left">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block text-left">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={refreshing}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black uppercase text-xs flex justify-center items-center gap-2 hover:scale-[1.02] transition transform active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {refreshing ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <RefreshCw size={16} />
              )}
              Reset Password
            </button>
          </form>

          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase hover:text-white transition pt-4"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 font-display">
      <div className="w-full max-w-xl glass-card p-10 md:p-12 rounded-2xl text-center space-y-8 border border-white/10 shadow-2xl">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <Lock size={40} className="text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Forgot Password</h1>
          <p className="text-gray-400 text-sm">
            No worries! Enter your email and we'll send you a reset code.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleResetRequest} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block text-left">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase text-xs flex justify-center items-center gap-2 hover:scale-[1.02] transition transform active:scale-95 disabled:opacity-50 shadow-xl shadow-orange-500/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>

        <button
          onClick={handleBack}
          className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase hover:text-white transition pt-4"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
      <style>{`
        .glass-card {
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(10px);
        }
        input {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
