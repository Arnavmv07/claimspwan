import React from 'react';
import GameCard from './GameCard';
import AdSlot from './AdSlot';

export default function GameGrid({ 
  games, 
  onGameSelect, 
  onClaimClick,
  onAdClick,
  onAdImpression,
  currency
}) {
  if (games.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center select-none">
        <span className="text-5xl">🔍</span>
        <h3 className="text-lg font-bold mt-4 text-gray-300">No free deals found</h3>
        <p className="text-sm text-gray-500 mt-1">Try resetting your storefront filter badges or adjusting your search term.</p>
      </div>
    );
  }

  // Inject AdSlot into the rendering flow
  // We can render items in a flat grid. After every 4th card, we add an Ad slot.
  const renderGridItems = () => {
    return games.map((game) => (
      <GameCard 
        key={`game-${game.id}`}
        game={game} 
        onGameSelect={onGameSelect}
        onClaimClick={onClaimClick}
        currency={currency}
      />
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Grid title & counter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <span>🎮</span> EXPLORE FREE LOOT ({games.length})
        </h2>
        <span className="text-xs text-gray-500 font-bold">Grid Ad Slots Active</span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderGridItems()}
      </div>

    </div>
  );
}
