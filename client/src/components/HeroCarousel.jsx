import React, { useState, useEffect } from 'react';
import { Eye, ArrowLeft, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { convertPrice } from '../utils/currency';

export default function HeroCarousel({ activeGames, onGameSelect, currency }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter games that are "Active" and are of high original price value (e.g. >= $29.99 or custom)
  const featuredGames = activeGames.filter(g => g.status === 'Active' || g.status === 'Upcoming').slice(0, 3);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredGames.length);
    }, 8000); // 8-second slide
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  if (featuredGames.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="h-96 rounded-3xl bg-dark-card border border-[#24324D] flex flex-col items-center justify-center text-center p-8 glass">
          <span className="text-6xl animate-bounce">🎁</span>
          <h2 className="text-xl font-bold mt-4">Looking for Loot?</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md">All games are currently claimed. Check the Expired tab or watch for Upcoming freebies!</p>
        </div>
      </div>
    );
  }

  const game = featuredGames[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredGames.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredGames.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 select-none relative group">
      
      {/* Background Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-purple to-accent-neon rounded-[2.2rem] opacity-35 blur-xl group-hover:opacity-45 transition duration-1000"></div>
      
      {/* Main Slide Card */}
      <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden bg-dark-card border border-[#24324D] shadow-2xl glass">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={game.image_url} 
            alt={game.title}
            className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/90 via-[#0B0F19]/60 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          
          <div className="flex flex-col max-w-2xl">
            {/* Storefront Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg text-white ${
                game.platform === 'Epic Games Store' ? 'bg-black border border-white/20' :
                game.platform === 'Steam' ? 'bg-[#003087]' :
                game.platform === 'GOG' ? 'bg-[#9146FF]' : 'bg-[#1C2C4E]'
              }`}>
                {game.platform}
              </span>
              {game.status === 'Upcoming' ? (
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-accent-gold text-dark-bg rounded-lg">
                  UPCOMING DEAL
                </span>
              ) : (
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-green-500 text-white rounded-lg animate-pulse">
                  ACTIVE FREEBIE
                </span>
              )}
            </div>

            {/* Game Title */}
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md tracking-tight">
              {game.title}
            </h1>

            {/* Value comparison */}
            <div className="flex items-center gap-3 mt-3 text-xs md:text-sm font-semibold">
              <span className="text-gray-400">Value: <span className="line-through">{convertPrice(game.original_price, currency)}</span></span>
              <span className="text-accent-neon font-black text-sm uppercase tracking-wider">{game.discount}</span>
              {game.epic_creator_tag && (
                <span className="text-[10px] font-extrabold text-accent-purple tracking-widest bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded">
                  SUPPORT CREATOR TAG
                </span>
              )}
            </div>

            {/* Live Ticking Countdown Widget */}
            <div className="mt-5">
              <CountdownTimer targetDate={game.end_date} startDate={game.start_date} status={game.status} />
            </div>

            {/* Interactive Actions */}
            <div className="flex items-center gap-4 mt-6">
              <button 
                onClick={() => onGameSelect(game.id)}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-neon to-accent-glow hover:from-accent-glow hover:to-accent-neon text-[#0B0F19] text-xs font-black uppercase tracking-widest rounded-xl shadow-glow-cyan transform transition-all duration-300 btn-click-active"
              >
                <Eye class="w-4 h-4" />
                View Deal
              </button>
              
              <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-dark-bg/60 border border-[#24324D] rounded-xl text-[10px] font-extrabold text-gray-400">
                <span className="text-accent-neon">★</span>
                <span>COMMUNITY RATING: {game.community_rating > 0 ? `${game.community_rating} / 5` : 'UNRATED'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Manual Slideshow Arrows */}
        {featuredGames.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-dark-bg/70 border border-[#24324D] text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 hover:border-accent-neon transition-all"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-dark-bg/70 border border-[#24324D] text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 hover:border-accent-neon transition-all"
            >
              <ArrowRight class="w-5 h-5" />
            </button>
          </>
        )}

      </div>
    </div>
  );
}

// Live Countdown Sub-Component
function CountdownTimer({ targetDate, startDate, status }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(targetDate).getTime();
      const start = new Date(startDate).getTime();

      if (status === 'Upcoming') {
        const diff = start - now;
        if (diff <= 0) {
          setTimeLeft('Starts now!');
          return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`Unlocks in: ${d}d : ${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`);
      } else {
        const diff = end - now;
        if (diff <= 0) {
          setTimeLeft('Deal Expired');
          setIsExpired(true);
          return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`Ends in: ${d}d : ${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startDate, status]);

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-dark-bg/60 border border-[#24324D] rounded-xl text-xs font-black uppercase tracking-wider text-[#00F2FE]">
      <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse"></span>
      <span className="font-mono">{timeLeft}</span>
    </div>
  );
}
