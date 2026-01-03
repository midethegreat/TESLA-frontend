
import {
  Car,
  Briefcase,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TARGET_COUNTS = {
  users: 4116636,
  deposit: 187428920,
  plans: 3117266,
  withdrawn: 273662623,
};

export default function Stats() {
  const [counts, setCounts] = useState({
    users: 500,
    deposit: 500,
    plans: 500,
    withdrawn: 500,
  });
  const [isAnimating, setIsAnimating] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 5000; // 5 seconds for initial count up
    const startTime = performance.now();
    const START_VALUE = 500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutExpo for a fast start that slows down
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        users: Math.floor(START_VALUE + (TARGET_COUNTS.users - START_VALUE) * easeProgress),
        deposit: Math.floor(START_VALUE + (TARGET_COUNTS.deposit - START_VALUE) * easeProgress),
        plans: Math.floor(START_VALUE + (TARGET_COUNTS.plans - START_VALUE) * easeProgress),
        withdrawn: Math.floor(START_VALUE + (TARGET_COUNTS.withdrawn - START_VALUE) * easeProgress),
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (isAnimating || !hasStarted) return;

    const interval = setInterval(() => {
      setCounts((prev) => ({
        users: prev.users + (Math.random() > 0.5 ? 1 : 0),
        deposit: prev.deposit + Math.floor(Math.random() * 5),
        plans: prev.plans + (Math.random() > 0.8 ? 1 : 0),
        withdrawn: prev.withdrawn + Math.floor(Math.random() * 10),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating, hasStarted]);

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
    <section id="about" ref={sectionRef} className="py-20 bg-transparent">
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
