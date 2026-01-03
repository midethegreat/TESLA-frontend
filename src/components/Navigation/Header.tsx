import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Send, ChevronDown } from "lucide-react";
import Logo from "../logo/logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navigate = useNavigate();
  const telegramUrl = "https://t.me/Allyssabroker";

  return (
    <header className="fixed w-full z-[100] bg-[#14120e]/90 backdrop-blur-3xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard">
              <Logo/>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              to="/dashboard"
              className="text-amber-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-white transition"
            >
              Home
            </Link>
            <a
              href="#plans"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              Investment
            </a>
            <a
              href="#how-it-works"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              Strategy
            </a>
            <a
              href="#about"
              className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] hover:text-amber-400 transition"
            >
              About
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition font-black text-[9px] uppercase tracking-widest"
              >
                English
                <ChevronDown
                  size={10}
                  className={
                    langOpen
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>

              {langOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#1a1814]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl min-w-[120px]">
                  <button className="w-full text-left px-4 py-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 uppercase tracking-widest">
                    English
                  </button>
                </div>
              )}
            </div>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition"
            >
              <Send size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Telegram
              </span>
            </a>

            <button
              onClick={() => navigate("/login")}
              className="text-white hover:text-amber-400 transition font-black text-[9px] uppercase tracking-widest"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="gradient-button px-6 py-2.5 rounded-full text-black font-black text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-amber-500/10 hover:scale-105 transition"
            >
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/5 rounded-xl transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute w-[calc(100%-2rem)] left-4 top-24 z-[110] animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="bg-[#14120e] backdrop-blur-3xl border border-white/10 rounded-[2rem] py-10 px-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
            <div className="space-y-8 flex flex-col items-center">
              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard"
                className="text-amber-400 text-sm font-black uppercase tracking-[0.3em]"
              >
                Home
              </Link>

              <a
                href="#plans"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 text-sm font-black uppercase tracking-[0.3em]"
              >
                Investment
              </a>

              <a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 text-sm font-black uppercase tracking-[0.3em]"
              >
                Methodology
              </a>

              <div className="w-full h-[1px] bg-white/5"></div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="w-full text-white py-4 font-black uppercase tracking-[0.2em] border border-white/10 rounded-2xl text-[10px]"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
                className="w-full gradient-button text-black px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
              >
                Register Account
              </button>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 text-[8px] font-black uppercase tracking-widest"
              >
                <Send size={12} />
                Talk to Support
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
