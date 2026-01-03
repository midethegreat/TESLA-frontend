import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Award, Trophy, Star } from 'lucide-react';


const BADGES = [
  {
    title: 'Tesla Investment Beginner',
    condition: 'By signing up to the account',
    id: 1,
    icon: <Award className="text-amber-500" />,
    color: 'from-amber-500/10 to-orange-500/10',
  },
  {
    title: 'Tesla Investment Pro',
    condition: 'By earning $30 from the site',
    id: 2,
    icon: <Trophy className="text-orange-500" />,
    color: 'from-orange-500/10 to-red-500/10',
  },
  {
    title: 'Tesla Investment Elite',
    condition: 'Invest $500+',
    id: 3,
    icon: <Star className="text-red-500" />,
    color: 'from-red-500/10 to-pink-500/10',
  },
  {
    title: 'Tesla Investment Master',
    condition: 'Refer 10+ friends',
    id: 4,
    icon: <Trophy className="text-purple-500" />,
    color: 'from-purple-500/10 to-indigo-500/10',
  },
  {
    title: 'Tesla Investment Legend',
    condition: 'Total profit $1000+',
    id: 5,
    icon: <Star className="text-yellow-500" />,
    color: 'from-yellow-500/10 to-amber-500/10',
  },
  {
    title: 'Tesla Investment Whale',
    condition: 'Deposit $5000+',
    id: 6,
    icon: <Award className="text-blue-500" />,
    color: 'from-blue-500/10 to-cyan-500/10',
  },
];

const Ranking: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-32 px-4 md:px-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">All The Badges</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Earn badges by completing achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`bg-gradient-to-br ${badge.color} border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              {badge.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                {badge.title}
              </h3>
              <div className="mt-3 bg-black/30 rounded-full px-4 py-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  {badge.condition}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">STATUS:</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">NOT EARNED</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card bg-[#141414]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <h4 className="text-lg font-black text-white uppercase tracking-tight">Ranking Progress</h4>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current Rank: Tesla Beginner</span>
            <span className="text-amber-500 font-bold">Level 1</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-1/4"></div>
          </div>
          <div className="text-[10px] text-gray-500 text-center">
            25% to next rank • Need $75 more profit
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;