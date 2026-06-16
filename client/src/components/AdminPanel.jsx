import React, { useState, useEffect } from 'react';
import { Database, Save, X, Activity, Users, MapPin, Search, Trash2 } from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'Amazon Games / Prime Gaming',
    original_price: '$19.99',
    image_url: '',
    claim_url: '',
    description: '',
    instructions: '1. Log in to your Amazon Prime Account.\n2. Click the Claim button.\n3. Keep the game forever.',
    discount: '100% OFF'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [analytics, setAnalytics] = useState({ activeUsers: 0, demographics: {} });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/summary');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchGamesList = async () => {
    setGamesLoading(true);
    try {
      const res = await fetch('/api/games');
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (err) {
      console.error('Failed to fetch games list', err);
    } finally {
      setGamesLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesList();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/games/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to save game');
      }

      const savedGame = await res.json();
      setGames(prev => [savedGame, ...prev]);

      setSuccess('Game successfully injected into live database!');
      setFormData({
        title: '',
        platform: 'Amazon Games / Prime Gaming',
        original_price: '$19.99',
        image_url: '',
        claim_url: '',
        description: '',
        instructions: '1. Log in to your Amazon Prime Account.\n2. Click the Claim button.\n3. Keep the game forever.',
        discount: '100% OFF'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete game listing');
      }

      setGames(games.filter(g => g.id !== id));
      setSuccess('Game listing successfully deleted!');
      setDeletingId(null);
    } catch (err) {
      setError(err.message);
      setDeletingId(null);
    }
  };

  const filteredGames = games.filter(game => 
    (game.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (game.platform || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-8 glass shadow-xl animate-fade-in relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-dark-bg/60 text-gray-400 hover:text-white hover:bg-red-500/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-[#24324D] pb-4">
          <Database className="w-8 h-8 text-accent-neon" />
          <div>
            <h2 className="text-2xl font-black text-white">Manual Game Injector</h2>
            <p className="text-xs text-gray-400 mt-1">Secret Admin Panel to bypass Amazon anti-bot security.</p>
          </div>
        </div>

        {/* Live Analytics Dashboard */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-bg border border-[#00F2FE]/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#00F2FE]/5 group-hover:bg-[#00F2FE]/10 transition-colors"></div>
            <Activity className="w-8 h-8 text-[#00F2FE] mb-2 animate-pulse" />
            <h3 className="text-[#00F2FE] text-xs font-black uppercase tracking-widest mb-1">Live Active Users</h3>
            <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_#00F2FE]">{analytics.activeUsers}</span>
          </div>
          
          <div className="bg-dark-bg border border-[#24324D] rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-accent-neon" />
              <h3 className="text-xs font-bold text-gray-300 uppercase">Top Demographics</h3>
            </div>
            {Object.keys(analytics.demographics).length === 0 ? (
              <p className="text-sm text-gray-500 font-medium">Waiting for traffic...</p>
            ) : (
              <div className="space-y-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(analytics.demographics)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="text-lg">
                          {country === 'Unknown' ? '🌍' : `https://flagcdn.com/16x12/${country.toLowerCase()}.png` ? <img src={`https://flagcdn.com/16x12/${country.toLowerCase()}.png`} alt={country} className="inline w-4 h-3 rounded-sm"/> : country}
                        </span>
                        {country}
                      </span>
                      <span className="text-xs font-black text-accent-neon bg-accent-neon/10 px-2 py-0.5 rounded-md">{count}</span>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-bold flex items-center gap-2">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Game Title</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fallout New Vegas" 
                className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Platform</label>
              <select 
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
              >
                <option value="Amazon Games / Prime Gaming">Amazon Games / Prime Gaming</option>
                <option value="Steam">Steam</option>
                <option value="Epic Games Store">Epic Games Store</option>
                <option value="GOG">GOG</option>
                <option value="PlayStation Store">PlayStation Store</option>
                <option value="Xbox Store">Xbox Store</option>
                <option value="Itch.io">Itch.io</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Claim URL (The Link)</label>
              <input 
                required
                type="url" 
                name="claim_url"
                value={formData.claim_url}
                onChange={handleChange}
                placeholder="https://luna.amazon.com/..." 
                className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image URL (Cover Art)</label>
              <input 
                type="url" 
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Leave blank for auto-fallback" 
                className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Original Value</label>
              <input 
                type="text" 
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="e.g. $39.99" 
                className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Short blurb about the game..."
              className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Instructions</label>
            <textarea 
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
              className="w-full bg-dark-bg border border-[#24324D] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-neon"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? 'Injecting...' : 'Inject Game to Live Feed'}
            </button>
          </div>

        </form>

        {/* Manage Listings Section */}
        <div className="mt-12 border-t border-[#24324D] pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-neon" />
                Manage Active Listings
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Remove seeded, custom, or live GamerPower API games.
              </p>
            </div>
            
            {/* Search Box */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-bg/60 border border-[#24324D] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent-neon transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {gamesLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-t-2 border-accent-neon animate-spin mb-2"></div>
              <p className="text-xs text-gray-400 font-bold">Loading listings...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredGames.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#24324D] rounded-2xl">
                  <p className="text-sm text-gray-500 font-medium">No game listings found.</p>
                </div>
              ) : (
                filteredGames.map((game) => (
                  <div 
                    key={game.id}
                    className="flex items-center justify-between gap-4 p-4 bg-dark-bg/40 border border-[#24324D] hover:border-[#24324D]/80 rounded-2xl transition-all group relative overflow-hidden"
                  >
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-neon/0 via-accent-neon/5 to-accent-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-4 min-w-0 z-10">
                      {/* Image Thumbnail */}
                      <img 
                        src={game.image_url} 
                        alt={game.title} 
                        className="w-16 h-10 object-cover rounded-lg border border-[#24324D] bg-dark-bg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-accent-neon transition-colors duration-200">
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1e293b] text-gray-400 border border-[#334155]">
                            {game.platform}
                          </span>
                          <span className="text-[10px] font-bold text-accent-neon bg-accent-neon/10 px-2 py-0.5 rounded">
                            {game.original_price || 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button or confirmation */}
                    <div className="flex-shrink-0 z-10">
                      {deletingId === game.id ? (
                        <div className="flex items-center gap-1 bg-[#1e293b] p-1.5 rounded-xl border border-red-500/30">
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase rounded-lg transition-colors shadow-lg shadow-red-500/20"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2.5 py-1 bg-[#0B0F19] text-gray-400 hover:text-white text-[10px] font-black uppercase rounded-lg transition-colors border border-[#334155]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(game.id)}
                          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
