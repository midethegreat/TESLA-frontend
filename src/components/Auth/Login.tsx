// components/Auth/Login.tsx
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import Logo from "../logo/logo";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (!data.success || !data.token) {
        setError(data.message || "Login failed");
        return;
      }


      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-6 font-display">
      <div className="mb-8">
        <Link to="/">
          <Logo size="xl" />
        </Link>
      </div>

      <div className="w-full max-w-[700px] glass-card p-10 md:p-16 rounded-2xl border border-white/10 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase">
          Tesla Investment
        </h1>

        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 mb-12">
          Login to your account
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
              />
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Remember me
              </span>
            </label>

            <Link
              to="/reset"
              className="text-[10px] font-bold uppercase text-orange-400 hover:text-orange-300 transition"
            >
              Forget password
            </Link>
          </div>

          <div className="pt-4 flex flex-col items-center gap-8">
            <button
              disabled={loading}
              type="submit"
              className="w-full max-w-xs py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 font-black uppercase text-[10px] flex justify-center items-center gap-2 hover:scale-[1.02] transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Logging in...</span>
                </>
              ) : (
                "Account Login"
              )}
            </button>

            <p className="text-[10px] font-bold uppercase text-gray-400">
              No account?{" "}
              <Link 
                to="/register" 
                className="text-orange-400 hover:text-orange-300 transition"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .glass-card {
          background: rgba(20, 20, 20, 0.7);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .tesla-red-filter {
          filter: invert(26%) sepia(85%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
        }
        
        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </div>
  );
}