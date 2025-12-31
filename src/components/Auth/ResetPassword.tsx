import { Mail, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
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

      navigate("/login");
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
    } else {
      navigate("/login");
    }
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl glass-card p-12 rounded-2xl text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Mail size={40} className="text-amber-500" />
            </div>
          </div>

          <h1 className="text-2xl font-black uppercase">Reset Password</h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter the code sent to {email} and your new password
          </p>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold uppercase">
              {error}
            </div>
          )}

          <form onSubmit={handleResetConfirm} className="space-y-4">
            <input
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="input w-full"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input w-full"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input w-full"
            />

            <button
              type="submit"
              disabled={refreshing}
              className="w-full py-4 rounded-full bg-amber-500 text-black font-black uppercase text-xs flex justify-center items-center gap-2"
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
            className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl glass-card p-12 rounded-2xl text-center">
        <h1 className="text-3xl font-black uppercase">Forgot Password</h1>
        <p className="text-gray-400 text-sm mt-2">
          Enter your email to reset password
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold uppercase my-4">
            {error}
          </div>
        )}

        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-orange-500 font-black uppercase text-xs flex justify-center"
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
          className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase mt-4"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </div>
  );
}
