import React from 'react';

const PLATFORMS = [
  { name: 'All', label: 'All Stores', color: 'hover:border-accent-neon hover:text-accent-neon' },
  { name: 'Steam', label: 'Steam', color: 'hover:border-[#107c10] hover:text-[#00F2FE]' },
  { name: 'Epic Games Store', label: 'Epic Games', color: 'hover:border-white hover:text-white' },
  { name: 'GOG', label: 'GOG', color: 'hover:border-[#B624FF] hover:text-[#B624FF]' },
  { name: 'Amazon Games / Prime Gaming', label: 'Prime Gaming', color: 'hover:border-[#9146FF] hover:text-[#9146FF]' },
  { name: 'PlayStation Store', label: 'PlayStation', color: 'hover:border-[#003087] hover:text-[#00F2FE]' },
  { name: 'Xbox Store', label: 'Xbox', color: 'hover:border-[#107c10] hover:text-[#107c10]' },
  { name: 'Nintendo eShop', label: 'Nintendo', color: 'hover:border-[#e60012] hover:text-[#e60012]' },
  { name: 'Itch.io', label: 'Itch.io', color: 'hover:border-[#fa5c5c] hover:text-[#fa5c5c]' },
  { name: 'Indie/Others', label: 'Indies & Others', color: 'hover:border-gray-400 hover:text-gray-200' }
];

export default function PlatformPills({ activePlatform, setActivePlatform, games }) {
  // Calculate game count per platform
  const getCount = (platformName) => {
    if (platformName === 'All') return games.length;
    if (platformName === 'Indie/Others') {
      const standardStores = ['Steam', 'Epic Games Store', 'GOG', 'Amazon Games / Prime Gaming', 'PlayStation Store', 'Xbox Store', 'Nintendo eShop', 'Itch.io'];
      return games.filter(g => !standardStores.includes(g.platform)).length;
    }
    return games.filter(g => g.platform === platformName).length;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scroll-smooth select-none no-scrollbar">
        {PLATFORMS.map((plat) => {
          const count = getCount(plat.name);
          const isActive = activePlatform === plat.name;

          return (
            <button
              key={plat.name}
              onClick={() => setActivePlatform(plat.name)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 btn-click-active ${
                isActive
                  ? 'bg-gradient-to-r from-accent-purple to-accent-glow text-white border-accent-neon shadow-glow-purple scale-105'
                  : `bg-dark-card border-[#24324D] text-gray-400 ${plat.color}`
              }`}
            >
              <span>{plat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                isActive ? 'bg-[#0B0F19] text-[#00F2FE]' : 'bg-[#18233C] text-gray-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
