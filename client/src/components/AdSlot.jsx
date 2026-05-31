import React, { useEffect } from 'react';
import { ExternalLink, Flame } from 'lucide-react';

export default function AdSlot({ type, onAdClick, onAdImpression }) {
  useEffect(() => {
    // Record impression when ad mounts
    if (onAdImpression) {
      onAdImpression(type);
    }
  }, [type]);

  const handleAdClick = () => {
    if (onAdClick) {
      onAdClick(type);
    }
  };

  // 1. Leaderboard Ad (728x90)
  if (type === 'leaderboard') {
    return (
      <div 
        onClick={handleAdClick}
        className="w-full max-w-5xl mx-auto my-6 px-4 py-3 bg-[#111A2E] border border-[#24324D] rounded-xl cursor-pointer hover:border-accent-neon transition-all duration-300 relative overflow-hidden group select-none"
      >
        <div className="absolute top-1 right-2 text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Sponsored Ad Unit</div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-accent-neon to-accent-purple rounded-lg flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-all">
              <Flame class="w-6 h-6 text-white animate-bounce-slow" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200 group-hover:text-accent-neon transition-colors">🔥 CyberQuest MMO: Claim $100 Starter Pack FREE!</h4>
              <p className="text-xs text-gray-400">Join over 10M players worldwide. Instant digital delivery.</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-accent-neon to-accent-glow hover:from-accent-glow hover:to-accent-neon text-[#0B0F19] text-xs font-bold rounded-lg shadow-glow-cyan transition-all btn-click-active">
            PLAY NOW <ExternalLink class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Skyscraper Ad (300x600)
  if (type === 'skyscraper') {
    return (
      <div 
        onClick={handleAdClick}
        className="w-full h-[550px] bg-ad-pattern border border-[#24324D] rounded-2xl p-6 cursor-pointer hover:border-accent-purple transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
      >
        <div className="absolute top-2 right-3 text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Sponsored Ad</div>
        
        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-accent-purple to-accent-neon rounded-2xl flex items-center justify-center shadow-glow-purple group-hover:rotate-12 transition-all duration-500 mb-6">
            <span className="text-4xl">🔮</span>
          </div>
          <h4 className="font-extrabold text-lg text-white group-hover:text-accent-purple transition-colors mb-2">Valkyrie Chronicles RPG</h4>
          <p className="text-sm text-gray-400 px-2 leading-relaxed">Experience next-gen turn-based strategy in your browser. Play free now!</p>
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <div className="w-full h-24 bg-[#162137] rounded-xl p-3 border border-[#24324D] text-xs text-left">
            <span className="text-[10px] text-accent-neon font-bold">LIMITED TIME</span>
            <p className="text-gray-300 font-semibold mt-1">Unlock 50 Free Summons + SSR Hero today!</p>
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-accent-purple to-accent-glow text-white font-extrabold rounded-xl shadow-glow-purple hover:opacity-90 transition-all btn-click-active">
            CLAIM CODE <ExternalLink class="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. In-Feed native ad unit (300x250 card layout)
  if (type === 'in-feed') {
    return (
      <div 
        onClick={handleAdClick}
        className="relative flex flex-col bg-gradient-to-b from-[#18233C] to-[#121A2A] border border-[#24324D] rounded-2xl p-4 cursor-pointer hover:border-accent-neon transition-all duration-300 group overflow-hidden h-[380px] justify-between shadow-lg"
      >
        <div className="absolute top-2 right-3 text-[8px] uppercase tracking-widest text-accent-neon font-extrabold px-1.5 py-0.5 bg-dark-bg/60 border border-accent-neon/30 rounded">SPONSORED</div>
        
        <div className="h-44 w-full rounded-xl overflow-hidden relative mb-3 bg-[#111827]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#121A2A] via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[#0F172A] opacity-80 group-hover:scale-105 transition-all duration-700 flex items-center justify-center">
            <span className="text-5xl animate-pulse">🎮</span>
          </div>
        </div>

        <div className="flex flex-col flex-grow justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-accent-purple tracking-wider">MOCK ADSENSE NATIVE UNIT</span>
            <h4 className="font-bold text-base text-gray-200 mt-1 line-clamp-1 group-hover:text-accent-neon transition-colors">QuestCraft: Mine, Craft & Earn Crypto</h4>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">The internet's first decentralized mining simulation. Zero gas fees for new accounts.</p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#24324D] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest line-through">$29.99</span>
              <span className="text-xs font-black text-accent-neon">PLAY FOR FREE</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C2C4E] hover:bg-accent-neon hover:text-[#0B0F19] text-accent-neon font-bold text-xs rounded-lg transition-all duration-300">
              CLAIM DEAL <ExternalLink class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Interstitial Inline ad unit (300x250) for vignette screen
  if (type === 'vignette-ad') {
    return (
      <div 
        onClick={handleAdClick}
        className="w-full max-w-sm bg-[#162035] border-2 border-accent-neon rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 relative shadow-glow-cyan text-left select-none"
      >
        <div className="absolute top-2 right-3 text-[8px] uppercase tracking-widest text-accent-neon font-extrabold px-1.5 py-0.5 bg-dark-bg/60 border border-accent-neon/30 rounded">VIGNETTE SPONSOR</div>
        
        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5">
          ⭐ LootBox Royale: Open Free Box!
        </h4>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Unlock rare skins, Steam wallet keys, and gaming gear. 100% win rate. Verification takes 15 seconds.
        </p>

        <div className="w-full bg-[#0F172A] border border-[#24324D] rounded-xl p-3 text-xs text-gray-300 mb-4">
          <span className="text-[10px] text-accent-purple font-extrabold block mb-1">USER REVIEWS</span>
          "I got a $20 Steam Card on my second spin! Legitimate aggregator promotion." - arnav_r
        </div>

        <button className="w-full py-2.5 bg-gradient-to-r from-accent-neon to-accent-glow text-[#0B0F19] font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all btn-click-active text-center">
          OPEN FREE BOX NOW
        </button>
      </div>
    );
  }

  return null;
}
