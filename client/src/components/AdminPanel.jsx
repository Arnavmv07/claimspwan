import React, { useState } from 'react';
import { Database, Save, X, Info } from 'lucide-react';

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

      </div>
    </div>
  );
}
