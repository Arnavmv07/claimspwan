import React, { useState, useEffect } from 'react';
import { AreaChart, Clock, Eye, MousePointerClick, DollarSign, ChevronUp, ChevronDown, Sliders } from 'lucide-react';

export default function PublisherHUD({ stats }) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Stopwatch for Time on Site
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      
      {/* Floating Minimize/Maximize Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-accent-purple to-accent-glow hover:from-accent-glow hover:to-accent-purple text-white rounded-2xl shadow-glow-purple border border-accent-purple/35 transition-all duration-300 btn-click-active text-xs font-black uppercase tracking-wider"
        >
          <AreaChart class="w-4 h-4 animate-pulse text-[#00F2FE]" />
          <span>Publisher HUD</span>
        </button>
      ) : (
        /* Expanded HUD Dashboard */
        <div className="w-80 bg-[#121A2A] border-2 border-accent-purple rounded-3xl p-5 glass shadow-glow-purple flex flex-col space-y-4 animate-fade-in relative">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#24324D]">
            <div className="flex items-center gap-2">
              <Sliders class="w-4 h-4 text-accent-neon animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-widest text-white">PUBLISHER AD HUD</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-dark-bg/60 border border-[#24324D] text-gray-400 hover:text-white"
            >
              <ChevronDown class="w-4 h-4" />
            </button>
          </div>

          {/* Time on site metric */}
          <div className="flex items-center justify-between p-3 bg-dark-bg/40 border border-[#24324D] rounded-2xl">
            <div className="flex items-center gap-2">
              <Clock class="w-4 h-4 text-[#00F2FE]" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time on Site</span>
            </div>
            <span className="text-xs font-mono font-black text-accent-neon">
              {formatTime(timeSpent)}
            </span>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Impressions */}
            <div className="flex flex-col bg-dark-bg/40 border border-[#24324D] rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Eye class="w-3.5 h-3.5 text-accent-purple" />
                <span className="text-[9px] uppercase tracking-wider font-bold">Impressions</span>
              </div>
              <span className="text-lg font-mono font-black text-white">
                {stats.impressions}
              </span>
            </div>

            {/* Clicks */}
            <div className="flex flex-col bg-dark-bg/40 border border-[#24324D] rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <MousePointerClick class="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-[9px] uppercase tracking-wider font-bold">Ad Clicks</span>
              </div>
              <span className="text-lg font-mono font-black text-white">
                {stats.clicks}
              </span>
            </div>

          </div>

          {/* Total Revenue Display */}
          <div className="bg-gradient-to-r from-accent-purple/10 to-accent-neon/10 border border-accent-neon/40 rounded-2xl p-4.5 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-glow/5 rounded-full blur-xl"></div>
            
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Simulated Ad Revenue</span>
            <div className="flex items-center justify-center gap-1">
              <DollarSign class="w-6 h-6 text-accent-neon animate-pulse" />
              <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent-glow">
                {stats.earnings.toFixed(5)}
              </span>
            </div>
            
            <span className="text-[8px] text-accent-purple font-extrabold uppercase tracking-widest block mt-2">
              CPM: $5.50 Avg &bull; CPC: $0.45 avg
            </span>
          </div>

          {/* Mini Interactive Help */}
          <p className="text-[9px] text-gray-500 leading-tight text-center px-1 font-medium">
            Interactive: Viewing and clicking simulated Leaderboard, Skyscraper, In-Feed, and Vignette ads updates earnings in real time!
          </p>

        </div>
      )}

    </div>
  );
}
