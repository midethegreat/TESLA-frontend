

export default function Process() {
  const mainSteps = [
    {
      title: "Create Your Account",
      desc: "Registering on our website gives you instant access to personalized investment opportunities, helping you confidently start building your financial future.",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      title: "Verify Email",
      desc: "You'll need to verify your email to complete your registration and begin your investment journey.",
      icon: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    },
    {
      title: "Verify KYC",
      desc: "You'll need to verify your KYC (Know Your Customer) details to ensure a secure and compliant investment experience.",
      icon: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    },
    {
      title: "Deposit Funds",
      desc: "Once your account is verified, you can deposit funds to begin your investment journey with us.",
      icon: "https://cdn-icons-png.flaticon.com/512/2488/2488749.png",
    },
  ];

  const finalStep = {
    title: "Choose an Investment Plan",
    desc: "Choose an investment plan that aligns with your goals, and let us help you grow your wealth with tailored strategies.",
    icon: "https://cdn-icons-png.flaticon.com/512/1000/1000851.png",
  };

  return (
    <section id="how-it-works" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center mb-16">
          <div className="glass-subtopic">
            <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
              Methodology
            </span>
          </div>
        </div>

        <div className="relative mb-20">
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-white/10 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {mainSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-6 hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-lg"
                    />
                  </div>
                  {idx !== mainSteps.length - 1 && (
                    <>
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-white/20 -translate-y-1/2"></div>
                      <div className="hidden lg:block absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-white/20 -translate-y-1/2"></div>
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-black uppercase tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-[11px] md:text-sm leading-relaxed max-w-[240px] mx-auto font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-6 hover:scale-110 transition-transform duration-500 shadow-2xl">
            <img
              src={finalStep.icon}
              alt={finalStep.title}
              className="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-lg"
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-black uppercase tracking-tight text-white">
              {finalStep.title}
            </h3>
            <p className="text-gray-400 text-[11px] md:text-sm leading-relaxed max-w-[240px] mx-auto font-light">
              {finalStep.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


