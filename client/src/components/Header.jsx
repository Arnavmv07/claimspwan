import React from 'react';
import { Search, Flame, Calendar, History, ShieldAlert, Award } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  onLogoClick,
  adStats
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-accent-neon to-accent-purple rounded-xl flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-all">
            <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🎁</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              CLAIM<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent-glow">SPWAN</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-extrabold -mt-1 group-hover:text-accent-neon transition-colors">Free Gaming Aggregator</span>
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-dark-card border border-[#24324D] p-1 rounded-xl glass shadow-md">
          <button
            onClick={() => setActiveTab('Active')}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
              activeTab === 'Active'
                ? 'bg-gradient-to-r from-accent-neon to-accent-glow text-[#0B0F19] shadow-glow-cyan'
                : 'text-gray-400 hover:text-white hover:bg-dark-bg/40'
            }`}
          >
            <Flame class="w-4 h-4" />
            Active Deals
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
              activeTab === 'Upcoming'
                ? 'bg-gradient-to-r from-accent-purple to-accent-glow text-white shadow-glow-purple'
                : 'text-gray-400 hover:text-white hover:bg-dark-bg/40'
            }`}
          >
            <Calendar class="w-4 h-4" />
            Upcoming
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
          </button>

          <button
            onClick={() => setActiveTab('Expired')}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${
              activeTab === 'Expired'
                ? 'bg-[#1C2C4E] text-[#00F2FE] border border-accent-neon/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-bg/40'
            }`}
          >
            <History class="w-4 h-4" />
            Expired
          </button>
        </nav>

        {/* Right: Search Input & Ad-Hub Status */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-40 sm:w-60 md:w-64 select-none">
            <input
              type="text"
              placeholder="Search free games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-dark-bg border border-[#24324D] rounded-xl text-gray-200 focus:outline-none focus:border-accent-neon placeholder-gray-500 transition-all font-medium"
            />
            <Search class="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>

          {/* Publisher Admin Speed Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-accent-purple/20 to-accent-neon/20 border border-accent-neon/30 rounded-xl text-[10px] text-accent-neon font-extrabold select-none">
            <Award class="w-3.5 h-3.5 animate-spin-slow text-accent-gold" />
            <span>EST. EARNINGS: ${(adStats?.earnings || 0).toFixed(4)}</span>
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#24324D] bg-[#0E1525] py-2.5">
        <button
          onClick={() => setActiveTab('Active')}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
            activeTab === 'Active' ? 'text-accent-neon' : 'text-gray-400'
          }`}
        >
          <Flame class="w-4 h-4" />
          Active
        </button>
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
            activeTab === 'Upcoming' ? 'text-accent-purple' : 'text-gray-400'
          }`}
        >
          <Calendar class="w-4 h-4" />
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('Expired')}
          className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
            activeTab === 'Expired' ? 'text-accent-glow' : 'text-gray-400'
          }`}
        >
          <History class="w-4 h-4" />
          Expired
        </button>
      </div>
    </header>
  );
}
