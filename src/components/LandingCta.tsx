import { Heart, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingCta() {
  return (
    <section className="py-24 bg-[#14120e]">
      <div className="bg-[#14120e] py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          <h2 className="text-xs md:text-5xl font-black font-display leading-tight uppercase tracking-tight text-white">
            We're a trusted community of over{" "}
            <span className="text-amber-400">4,000,000 users</span>. Join us
            with confidence and be part of a growing network dedicated to smart,
            secure investments.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/register"
              className="w-full sm:w-auto gradient-button px-10 py-4 rounded-full text-black font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-amber-500/40 hover:scale-105 transition transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Sun size={18} strokeWidth={3} />
              Join Us
            </Link>

            <a
              href="https://t.me/Allyssabroker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 px-10 py-4 rounded-full text-white font-black uppercase text-[10px] tracking-widest transition active:scale-95 flex items-center justify-center gap-3"
            >
              <Heart size={18} className="fill-current" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
