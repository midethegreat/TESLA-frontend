import { Mail, Loader2, RefreshCw, ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  authService,
  type RegisterData,
  type VerifyEmailData,
} from "../../services/auth.service";

export default function Register() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "Nigeria",
    password: "",
    confirmPassword: "",
    referralId: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setFormData(prev => ({ ...prev, referralId: ref }));
      localStorage.setItem("referralCode", ref);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        referralId: formData.referralId || undefined,
      };

      const { data } = await authService.register(registerData);

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      setUserEmail(formData.email);
      setSuccess("Registration successful! Check your email for verification code.");
      setStep("verify");
      setShowCodeInput(true);
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!userEmail || !verificationCode) {
      setError("Please enter verification code");
      return;
    }

    setRefreshing(true);
    setError(null);

    try {
      const verifyData: VerifyEmailData = { 
        email: userEmail, 
        code: verificationCode 
      };
      
      const { data } = await authService.verifyEmail(verifyData);

      if (!data.success) {
        setError(data.message || "Verification failed");
        return;
      }

      setSuccess("Email verified successfully! Redirecting to login...");
      
      localStorage.removeItem("referralCode");
      

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!userEmail) return;
    
    setRefreshing(true);
    setError(null);
    
    try {

      const { data } = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userEmail,
        password: formData.password,
        country: formData.country,
        referralId: formData.referralId,
      });
      
      if (data.success) {
        setSuccess("Verification code resent! Check your email.");
      } else {
        setError("Failed to resend code");
      }
    } catch (err: any) {
      setError("Failed to resend verification code");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = () => {
    setStep("register");
    setUserEmail(null);
    setError(null);
    setSuccess(null);
    setVerificationCode("");
    setShowCodeInput(false);
  };

  // Verification Step
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 font-display">
        <div className="w-full max-w-xl glass-card p-10 md:p-12 rounded-2xl text-center space-y-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Mail size={40} className="text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-gray-400 text-sm">
              We sent a verification code to
            </p>
            <p className="text-amber-500 font-bold text-lg">{userEmail}</p>
            <p className="text-xs text-gray-500 mt-2">
              Check your inbox and spam folder
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

          {showCodeInput && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block text-left">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
                  maxLength={6}
                />
              </div>
              
              <button
                onClick={handleVerifyEmail}
                disabled={refreshing || !verificationCode}
                className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition transform active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-500/20"
              >
                {refreshing ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={resendVerificationCode}
              disabled={refreshing}
              className="w-full py-3 rounded-full bg-white/5 text-gray-400 font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              {refreshing ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <RefreshCw size={14} />
              )}
              Resend Code
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase hover:text-white transition"
            >
              <ArrowLeft size={14} /> Use Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Step
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 font-display">
      <div className="w-full max-w-3xl glass-card p-10 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
            Join Tesla Investment Platform
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              First Name
            </label>
            <input
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Last Name
            </label>
            <input
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition appearance-none"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>

          {/* Referral ID (Optional) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Referral ID (Optional)
              <span className="text-[8px] text-gray-500 ml-2">Get bonus rewards</span>
            </label>
            <div className="relative">
              <input
                name="referralId"
                placeholder="Enter referral code"
                value={formData.referralId}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
              <UserPlus className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[8px] text-gray-500">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Terms Agreement */}
          <div className="md:col-span-2 flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <input 
              type="checkbox" 
              required 
              className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" 
            />
            <p className="text-[10px] text-gray-400">
              I agree to the <span className="text-amber-500 cursor-pointer">Terms of Service</span> and <span className="text-amber-500 cursor-pointer">Privacy Policy</span>. I confirm that I am at least 18 years old.
            </p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 font-black uppercase text-[10px] tracking-widest flex justify-center items-center gap-2 hover:scale-[1.02] transition transform active:scale-95 disabled:opacity-50 shadow-xl shadow-orange-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="md:col-span-2 text-center pt-6 border-t border-white/5">
            <p className="text-xs text-gray-400 uppercase">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-orange-400 hover:text-orange-300 transition font-bold"
              >
                Login Here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style >{`
        .glass-card {
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(10px);
        }
        
        input, select {
          transition: all 0.2s ease;
        }
        
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </div>
  );
}