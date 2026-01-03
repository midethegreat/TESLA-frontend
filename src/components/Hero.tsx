import { Link } from "react-router-dom";
import { ArrowUpRight, UserPlus } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-12 md:pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-amber-500/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-600/5 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="glass-subtopic">
              <span className="text-white text-[9px] font-bold uppercase tracking-[0.2em]">
                Premium Financial Platform
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Tesla Investment
              <span className="text-amber-400"> Smart Growth</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto lg:mx-0">
              Professional investment solutions built for long term wealth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="gradient-button px-8 py-3.5 rounded-full text-black font-black flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:scale-105 transition"
              >
                <UserPlus size={16} />
                Create Account
              </Link>

              <Link
                to="/#how-it-works"
                className="bg-white/5 border border-white/10 px-8 py-3.5 rounded-full text-white font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:bg-white/10 transition"
              >
                <ArrowUpRight size={16} />
                How it works
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-8 lg:mt-0 animate-in fade-in slide-in-from-right duration-1000">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200"
                alt="Tesla"
                className="w-full h-[350px] md:h-[500px] object-cover group-hover:scale-105 transition duration-[2s]"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-6 glass-card p-4 md:p-6 rounded-2xl border border-amber-500/10 shadow-2xl max-w-[200px]">
              <div className="text-amber-400 font-black text-3xl md:text-4xl">
                4M+
              </div>
              <div className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                Trusted Investors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
