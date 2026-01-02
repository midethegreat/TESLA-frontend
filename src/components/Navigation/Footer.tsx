import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube, Send } from "lucide-react";

export default function Footer() {
  const telegramUrl = "https://t.me/Allyssabroker";

  return (
    <footer id="contact" className="pt-24 pb-12 bg-[#14120e] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-32">
          <div className="lg:col-span-7">
            <div className="overflow-hidden shadow-2xl border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200"
                alt="Tesla investment"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8 text-left">
            <h2 className="text-3xl md:text-4xl font-black leading-[1.1] text-white">
              Tesla Investment Growth Platform
            </h2>
            <p className="text-gray-400 text-sm">
              Secure crypto investment platform with automated trading systems.
              Trusted by millions of users worldwide.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-lg">
              Pages
            </h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-lg">
              Support
            </h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/reset" className="hover:text-amber-400 transition">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-lg">
              Company
            </h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-6 text-gray-500">
            <a href="https://x.com/Tesla" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Youtube size={20} />
            </a>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Send size={20} />
            </a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © Tesla Investment 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
