import React, { useState, useEffect } from 'react';
import { ThumbsUp, Gift, ExternalLink } from 'lucide-react';
import { convertPrice } from '../utils/currency';

const BRAND_THEMES = {
  'Steam': {
    bg: 'border-blue-500/20 group-hover:border-blue-500/60',
    badge: 'bg-[#107c10] text-[#00F2FE]',
    accent: 'text-[#00F2FE]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'Epic Games Store': {
    bg: 'border-white/10 group-hover:border-white/40',
    badge: 'bg-black border border-white/20 text-white',
    accent: 'text-white',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'GOG': {
    bg: 'border-purple-500/20 group-hover:border-purple-500/60',
    badge: 'bg-[#B624FF]/25 border border-[#B624FF]/40 text-[#B624FF]',
    accent: 'text-[#B624FF]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'Amazon Games / Prime Gaming': {
    bg: 'border-[#9146FF]/20 group-hover:border-[#9146FF]/60',
    badge: 'bg-[#9146FF] text-white',
    accent: 'text-[#9146FF]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'PlayStation Store': {
    bg: 'border-[#003087]/20 group-hover:border-[#003087]/60',
    badge: 'bg-[#003087] text-white',
    accent: 'text-[#00F2FE]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'Xbox Store': {
    bg: 'border-[#107c10]/20 group-hover:border-[#107c10]/60',
    badge: 'bg-[#107c10] text-white',
    accent: 'text-[#107c10]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'Nintendo eShop': {
    bg: 'border-[#e60012]/20 group-hover:border-[#e60012]/60',
    badge: 'bg-[#e60012] text-white',
    accent: 'text-[#e60012]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'Itch.io': {
    bg: 'border-[#fa5c5c]/20 group-hover:border-[#fa5c5c]/60',
    badge: 'bg-[#fa5c5c] text-white',
    accent: 'text-[#fa5c5c]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  },
  'default': {
    bg: 'border-[#24324D] group-hover:border-[#00F2FE]/40',
    badge: 'bg-[#1C2C4E] text-[#00F2FE]',
    accent: 'text-[#00F2FE]',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.25)]'
  }
};

export default function GameCard({ game, onGameSelect, onClaimClick, currency }) {
  const theme = BRAND_THEMES[game.platform] || BRAND_THEMES['default'];
  const isUpcoming = game.status === 'Upcoming';
  const isExpired = game.status === 'Expired';

  const handleClaimClick = (e) => {
    e.stopPropagation(); // Avoid triggering open detail page
    if (onClaimClick) {
      onClaimClick(game);
    }
  };

  return (
    <div 
      onClick={() => onGameSelect(game.id)}
      className={`relative flex flex-col bg-[#121A2A] border rounded-2xl p-4 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group shadow-lg overflow-hidden h-[380px] justify-between ${theme.bg}`}
    >
      
      {/* Storefront Badge absolute tag */}
      <span className={`absolute top-2.5 right-2.5 z-10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-sm ${theme.badge}`}>
        {game.platform}
      </span>

      {/* Card Cover Art */}
      <div className="aspect-[460/215] w-full rounded-xl overflow-hidden relative mb-3 bg-dark-bg select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#121A2A] via-transparent to-transparent z-10"></div>
        <img 
          src={game.image_url} 
          alt={game.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 opacity-90"
        />
        
        {/* Dynamic Countdown Ribbon Overlay */}
        <div className="absolute bottom-2 left-2 z-20">
          <CardCountdown targetDate={game.end_date} startDate={game.start_date} status={game.status} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow justify-between select-none">
        <div>
          {/* Game Title */}
          <h3 className="font-extrabold text-sm text-gray-200 mt-1 line-clamp-2 leading-tight group-hover:text-accent-neon transition-colors">
            {game.title}
          </h3>
          
          {/* Rating and Upvote Row */}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold">
            <span className="flex items-center gap-1">
              <ThumbsUp class="w-3 h-3 text-accent-neon" />
              {(game.upvotes || 0)} upvotes
            </span>
            {game.community_rating > 0 && (
              <span className="flex items-center gap-0.5 text-accent-gold">
                ★ {game.community_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Button Actions */}
        <div className="mt-4 pt-3 border-t border-[#24324D] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest line-through">
              {convertPrice(game.original_price, currency)}
            </span>
            <span className={`text-xs font-black uppercase tracking-wider ${isExpired ? 'text-gray-500' : 'text-accent-neon'}`}>
              {isExpired ? 'EXPIRED' : '100% OFF'}
            </span>
          </div>

          {isExpired ? (
            <button 
              disabled
              className="px-3.5 py-1.5 bg-[#1B2435] text-gray-500 font-extrabold text-xs rounded-lg cursor-not-allowed uppercase"
            >
              Expired
            </button>
          ) : isUpcoming ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onGameSelect(game.id); }}
              className="px-3 py-1.5 bg-[#1C2C4E] hover:bg-accent-purple hover:text-white text-accent-purple font-black text-xs rounded-lg transition-all"
            >
              PREVIEW
            </button>
          ) : (
            <button 
              onClick={handleClaimClick}
              className={`flex items-center gap-1 px-4 py-2 font-black text-xs rounded-lg uppercase tracking-wider transition-all btn-click-active ${theme.btn}`}
            >
              Claim Game <ExternalLink class="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

// Inline Countdown for Card Component
function CardCountdown({ targetDate, startDate, status }) {
  const [timerText, setTimerText] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(targetDate).getTime();
      const start = new Date(startDate).getTime();

      if (status === 'Expired') {
        setTimerText('Deal ended');
        setExpired(true);
        return;
      }

      if (status === 'Upcoming') {
        const diff = start - now;
        if (diff <= 0) {
          setTimerText('Starts now');
          return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimerText(`Unlocks: ${d}d:${h.toString().padStart(2, '0')}h`);
      } else {
        const diff = end - now;
        if (diff <= 0) {
          setTimerText('Expired');
          setExpired(true);
          return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (d > 0) {
          setTimerText(`Ends in: ${d}d : ${h}h`);
        } else {
          setTimerText(`Ends in: ${h}h : ${m}m`);
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [targetDate, startDate, status]);

  if (expired) {
    return (
      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#1A2233] text-gray-500 border border-[#24324D] rounded-md">
        Expired
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-dark-bg/85 border border-[#24324D] text-[#00F2FE] rounded-md">
      {timerText}
    </span>
  );
}
