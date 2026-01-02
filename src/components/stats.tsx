
import {
  Car,
  Briefcase,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Stats() {
  const [counts, setCounts] = useState({
    users: 4116636,
    deposit: 187428920,
    plans: 3117266,
    withdrawn: 273662623,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        users: prev.users + (Math.random() > 0.5 ? 1 : 0),
        deposit: prev.deposit + Math.floor(Math.random() * 5),
        plans: prev.plans + (Math.random() > 0.8 ? 1 : 0),
        withdrawn: prev.withdrawn + Math.floor(Math.random() * 10),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Total Users", value: counts.users.toLocaleString() },
    { label: "Total Deposit", value: counts.deposit.toLocaleString() },
    { label: "Active Investment Plans", value: counts.plans.toLocaleString() },
    { label: "Total Withdrawn", value: counts.withdrawn.toLocaleString() },
  ];

  const features = [
    {
      title: "Multiple Crypto Payments",
      desc: "Fast, secure, and seamless transactions to fund your journey.",
      icon: <Car size={32} className="text-amber-500" />,
    },
    {
      title: "Tailored Plans",
      desc: "Suited to your unique goals and risk tolerance levels.",
      icon: <Briefcase size={32} className="text-amber-500" />,
    },
    {
      title: "Accurate Trading",
      desc: "Precision market predictions using advanced AI algorithms.",
      icon: <Cpu size={32} className="text-amber-500" />,
    },
    {
      title: "High Grade Security",
      desc: "Military grade protection with multi-factor authentication.",
      icon: <ShieldCheck size={32} className="text-amber-500" />,
    },
  ];

  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <div className="glass-subtopic mb-2">
            <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
              Why Tesla Investment?
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight">
            Trusted Financial Partnership
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-4 p-6 glass-card rounded-2xl border-white/5"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-2">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-white">
                {f.title}
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-[200px]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 py-16 border-t border-white/5">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-gray-600 text-[8px] font-black tracking-widest uppercase mb-1">
                METRIC TRACKER
              </div>
              <div className="text-amber-500 text-[10px] font-black tracking-[0.2em] uppercase">
                {s.label}
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter tabular-nums overflow-hidden">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


