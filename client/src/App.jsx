import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PlatformPills from './components/PlatformPills';
import HeroCarousel from './components/HeroCarousel';
import GameGrid from './components/GameGrid';
import GameDetail from './components/GameDetail';
import Vignette from './components/Vignette';
import PublisherHUD from './components/PublisherHUD';
import AdSlot from './components/AdSlot';
import SaleView from './components/SaleView';
import AdminPanel from './components/AdminPanel';
import { CURRENCIES, convertPrice, detectLocalCurrency } from './utils/currency';

const AD_CPM_RATES = {
  'leaderboard': 2.50,
  'in-feed': 3.00,
  'skyscraper': 4.50,
  'vignette-ad': 12.00
};
const AD_CPC = 0.45; // Cost Per Click

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sales States
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);

  // Currency State
  const [currency, setCurrency] = useState(() => detectLocalCurrency());

  // Filters and Routing States
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Upcoming' | 'Expired' | 'Sale'
  const [activePlatform, setActivePlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(null); // String or null
  const [isAdminView, setIsAdminView] = useState(false);

  // Vignette and Ad States
  const [vignetteGame, setVignetteGame] = useState(null); // Game object or null
  const [adStats, setAdStats] = useState({
    impressions: 0,
    clicks: 0,
    earnings: 0.0
  });

  // Fetch games database from backend on mount or when currency changes
  useEffect(() => {
    fetchGames();
  }, [currency]);

  // Fetch sales database when Sale tab becomes active or when currency changes
  useEffect(() => {
    if (activeTab === 'Sale') {
      fetchSales();
    }
  }, [activeTab, currency]);

  // Hash-based Deep Routing parser (Landing Pages)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        setIsAdminView(true);
        setSelectedGameId(null);
      } else {
        setIsAdminView(false);
        const match = hash.match(/^#\/game\/(.+)$/);
        if (match) {
          setSelectedGameId(match[1]);
        } else {
          setSelectedGameId(null);
        }
      }
    };

    handleHashChange(); // Run on mount

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectGame = (id) => {
    if (id) {
      window.location.hash = `#/game/${id}`;
    } else {
      window.location.hash = '';
    }
  };

  const fetchGames = () => {
    setLoading(true);
    fetch(`/api/games?currency=${currency}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to retrieve free games database');
        return res.json();
      })
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchSales = () => {
    setSalesLoading(true);
    setSalesError(null);
    fetch(`/api/sales?currency=${currency}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to retrieve sales database');
        return res.json();
      })
      .then(data => {
        setSales(data);
        setSalesLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSalesError(err.message);
        setSalesLoading(false);
      });
  };

  // 1. Log Ad Impressions
  const handleAdImpression = (adType) => {
    const cpm = AD_CPM_RATES[adType] || 1.50;
    const addedRevenue = cpm / 1000.0;
    setAdStats((prev) => ({
      impressions: prev.impressions + 1,
      clicks: prev.clicks,
      earnings: parseFloat((prev.earnings + addedRevenue).toFixed(5))
    }));
  };

  // 2. Log Ad Clicks
  const handleAdClick = (adType) => {
    setAdStats((prev) => ({
      impressions: prev.impressions,
      clicks: prev.clicks + 1,
      earnings: parseFloat((prev.earnings + AD_CPC).toFixed(5))
    }));
  };

  // 3. Claim Trigger (Open Vignette overlay)
  const handleClaimClick = (game) => {
    setVignetteGame(game);
  };

  // Helper: Reset search and pills when navigation tabs change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setActivePlatform('All');
    setSearchQuery('');
    handleSelectGame(null);
  };

  // Filter games based on current active tab, platform pill, and search query
  const getFilteredGames = () => {
    return games.filter((game) => {
      // Tab filter
      if (game.status !== activeTab) return false;

      // Platform pill filter
      if (activePlatform !== 'All') {
        if (activePlatform === 'Indie/Others') {
          const standardStores = [
            'Steam', 'Epic Games Store', 'GOG', 'Amazon Games / Prime Gaming', 
            'PlayStation Store', 'Xbox Store', 'Nintendo eShop', 'Itch.io'
          ];
          if (standardStores.includes(game.platform)) return false;
        } else {
          if (game.platform !== activePlatform) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesPlatform = game.platform.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPlatform) return false;
      }

      return true;
    });
  };

  const filteredGames = getFilteredGames();

  // Active high value games to show in hero carousel
  const activeGames = games.filter(g => g.status === 'Active' || g.status === 'Upcoming');

  return (
    <div className="flex flex-col min-h-screen relative bg-[#0B0F19]">
      
      {/* Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogoClick={() => handleSelectGame(null)}
        adStats={adStats}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Core Section */}
      <main className="flex-grow pb-24">
        {loading ? (
          <div className="w-full max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border-t-2 border-accent-neon animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold">Scanning Loot Database...</p>
          </div>
        ) : error ? (
          <div className="w-full max-w-7xl mx-auto px-4 py-32 text-center">
            <span className="text-5xl">⚠️</span>
            <h3 className="text-lg font-bold mt-4 text-red-400">Database Connection Failed</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
            <button 
              onClick={fetchGames}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-accent-neon to-accent-glow text-[#0B0F19] text-xs font-black uppercase rounded-xl"
            >
              Retry Connection
            </button>
          </div>
        ) : isAdminView ? (
          <AdminPanel 
            onClose={() => {
              window.location.hash = '';
              fetchGames();
            }}
          />
        ) : selectedGameId ? (
          /* Internal Router Detail Page (Deep Hash Landing Page) */
          <GameDetail 
            gameId={selectedGameId} 
            onBack={(gameId) => {
              if (gameId) {
                handleSelectGame(gameId);
              } else {
                handleSelectGame(null);
                fetchGames(); // refresh upvotes/ratings
              }
            }} 
            onClaimClick={handleClaimClick}
            allGames={games}
            onAdClick={handleAdClick}
            onAdImpression={handleAdImpression}
            currency={currency}
          />
        ) : activeTab === 'Sale' ? (
          /* Sale Dashboard Page */
          <SaleView 
            sales={sales}
            loading={salesLoading}
            error={salesError}
            onAdClick={handleAdClick}
            onAdImpression={handleAdImpression}
            currency={currency}
          />
        ) : (
          /* Dashboard Landing Page Grid */
          <>
            {/* Storefront pills badges */}
            <PlatformPills 
              activePlatform={activePlatform} 
              setActivePlatform={setActivePlatform} 
              games={games.filter(g => g.status === activeTab)}
            />

            {/* Slider carousel featuring the biggest active deal */}
            {activeTab !== 'Expired' && (
              <HeroCarousel 
                activeGames={activeGames} 
                onGameSelect={(id) => handleSelectGame(id)} 
                currency={currency}
              />
            )}

            {/* Main responsive grid layout with native native ad cards */}
            <GameGrid 
              games={filteredGames}
              onGameSelect={(id) => handleSelectGame(id)}
              onClaimClick={handleClaimClick}
              onAdClick={handleAdClick}
              onAdImpression={handleAdImpression}
              currency={currency}
            />
          </>
        )}
      </main>

      {/* Fullscreen Vignette Redirect Interstitial Modal */}
      {vignetteGame && (
        <Vignette 
          game={vignetteGame} 
          onClose={() => {
            setVignetteGame(null);
            fetchGames(); // refresh upvotes/ratings when returning to app
          }} 
          onAdClick={handleAdClick}
          onAdImpression={handleAdImpression}
          currency={currency}
        />
      )}

      {/* Footer */}
      <footer className="w-full bg-[#070A12] border-t border-[#24324D]/30 py-6 text-center select-none text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold">&copy; {new Date().getFullYear()} ClaimSpawn Aggregations. All rights reserved.</p>
          <p className="mt-1 text-[10px] text-gray-600 font-medium leading-relaxed">
            All brand trademarks (Steam, Epic Games Store, GOG, Amazon Games, PlayStation, Xbox, Nintendo) belong to their respective owners.
            Mock monetization simulation. No real cryptocurrency or currency involved.
          </p>
        </div>
      </footer>

    </div>
  );
}
