
import  { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '@/const/constants';


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#14120e]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="glass-subtopic mb-4">
            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
              Tesla Investment Faq
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="border-b border-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between py-8 text-left group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-gray-500 text-xl font-light">
                    {openIndex === idx ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </span>
                  <span
                    className={`text-lg md:text-xl font-bold transition-colors uppercase tracking-tight ${
                      openIndex === idx ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                </div>
                <span className="text-gray-600 group-hover:text-amber-400 transition-colors">
                  {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx ? "max-h-96 pb-10" : "max-h-0"
                }`}
              >
                <p className="text-gray-400 leading-relaxed pl-14 text-sm font-light">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
