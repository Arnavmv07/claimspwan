import React, { useState } from 'react';
import { Percent, ArrowRight, ExternalLink, ThumbsUp, Search } from 'lucide-react';
import { convertPrice } from '../utils/currency';

export default function SaleView({ sales, loading, error, onAdClick, onAdImpression, currency }) {
  const [activeSubTab, setActiveSubTab] = useState('PC'); // 'PC' | 'Xbox' | 'PS5'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-10' | 'under-20'

  const handleGetDealClick = (e, deal) => {
    e.stopPropagation();
    // Simulate an ad click/impression occasionally on redirection to boost earnings
    if (onAdClick) {
      onAdClick('in-feed');
    }
    window.open(deal.claim_url, '_blank', 'noopener,noreferrer');
  };

  // Helper to parse price string like "$19.99" to float 19.99
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  // Filter and Sort Data
  const getFilteredAndSortedSales = () => {
    let result = sales.filter((item) => {
      // 1. Platform Filter
      if (item.platform !== activeSubTab) return false;

      // 2. Search Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(query)) return false;
      }

      // 3. Price Tier Filter
      const price = parsePrice(item.sale_price);
      if (priceFilter === 'under-10' && price > 10.0) return false;
      if (priceFilter === 'under-20' && price > 20.0) return false;

      return true;
    });

    // 4. Sorting
    if (sortBy === 'alpha-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alpha-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => parsePrice(a.sale_price) - parsePrice(b.sale_price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => parsePrice(b.sale_price) - parsePrice(a.sale_price));
    }

    return result;
  };

  const filteredSales = getFilteredAndSortedSales();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      {/* Sub-Header & Controls Panel */}
      <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-6 glass shadow-xl mb-8 space-y-6 animate-fade-in">
        
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Percent class="w-6 h-6 text-accent-neon animate-pulse" />
              ClaimSpawn Premium Sales Aggregator
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl font-medium">
              Real-time daily-updating sales across PC, Xbox, and PS5. We scan storefronts globally to aggregate premium AAA games currently selling at a massive discount compared to their launch prices.
            </p>
          </div>

          {/* Role badge */}
          <span className="self-start md:self-auto px-3.5 py-1 bg-gradient-to-r from-blue-600/20 to-accent-glow/20 border border-accent-glow/30 text-accent-neon text-[10px] font-black uppercase tracking-widest rounded-xl">
            Live Daily Ticker Active
          </span>
        </div>

        {/* Filters Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#24324D]/60 items-center">
          
          {/* Sub-tabs: PC, Xbox, PS5 */}
          <div className="flex items-center gap-1.5 bg-dark-bg/60 border border-[#24324D] p-1 rounded-2xl md:col-span-2 select-none shadow-inner">
            {['PC', 'Xbox', 'PS5'].map((plat) => (
              <button
                key={plat}
                onClick={() => { setActiveSubTab(plat); setPriceFilter('all'); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                  activeSubTab === plat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-dark-card/50'
                }`}
              >
                {plat} Store Sales
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={`Search ${activeSubTab} deals...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-dark-bg border border-[#24324D] rounded-xl text-gray-200 focus:outline-none focus:border-accent-neon placeholder-gray-500 transition-all font-medium shadow-inner"
            />
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>

          {/* Sort dropdown */}
          <div className="w-full">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-dark-bg border border-[#24324D] rounded-xl text-gray-300 focus:outline-none focus:border-accent-neon font-bold shadow-inner cursor-pointer"
            >
              <option value="default">Sort: Featured Deals</option>
              <option value="alpha-asc">Alphabet: A to Z</option>
              <option value="alpha-desc">Alphabet: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Price filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 select-none">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider mr-2">Budget Filter:</span>
          {[
            { id: 'all', label: 'All Deals' },
            { id: 'under-10', label: 'Under $10' },
            { id: 'under-20', label: 'Under $20' }
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setPriceFilter(tier.id)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all ${
                priceFilter === tier.id
                  ? 'bg-accent-neon/15 border-accent-neon text-accent-neon shadow-glow-cyan'
                  : 'bg-dark-bg/40 border-[#24324D] text-gray-400 hover:text-white'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="w-full py-32 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-accent-neon animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold">Scanning Global Sale Feeds...</p>
        </div>
      ) : error ? (
        <div className="w-full py-32 text-center">
          <span className="text-5xl">⚠️</span>
          <h3 className="text-lg font-bold mt-4 text-red-400">Failed to Retrieve Sales</h3>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="w-full py-32 text-center bg-[#121A2A] border border-[#24324D] rounded-3xl glass shadow-lg">
          <span className="text-5xl animate-bounce block">💸</span>
          <h3 className="text-lg font-bold mt-4">No Discounted Games Found</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            We couldn't find any deals matching your search parameters. Try clearing your filters or changing your budget bracket!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 select-none pb-24">
          {filteredSales.map((deal, idx) => {
            return (
              <React.Fragment key={deal.id}>

                <div 
                  onClick={(e) => handleGetDealClick(e, deal)}
                  className="relative flex flex-col bg-[#121A2A] border border-blue-500/20 group-hover:border-blue-500/60 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group shadow-lg overflow-hidden h-[360px] justify-between"
                >
                  {/* Platform absolute tag */}
                  <span className="absolute top-2.5 right-2.5 z-10 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-[#003087] text-white rounded-lg shadow-sm border border-blue-500/30">
                    {deal.platform}
                  </span>

                  {/* Cover image */}
                  <div className="aspect-[460/215] w-full rounded-xl overflow-hidden relative mb-3 bg-dark-bg select-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A2A] via-transparent to-transparent z-10"></div>
                    <img 
                      src={deal.image_url} 
                      alt={deal.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 opacity-90"
                    />
                    
                    {/* Discount badge inside art */}
                    <div className="absolute bottom-2 left-2 z-20">
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-red-600 text-white rounded shadow-glow-purple">
                        {deal.discount}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="flex flex-col flex-grow justify-between select-none">
                    <div>
                      {/* Deal title */}
                      <h3 className="font-extrabold text-sm text-gray-200 mt-1 line-clamp-2 leading-tight group-hover:text-accent-neon transition-colors">
                        {deal.title}
                      </h3>
                      
                      {/* Telemetry info */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <ThumbsUp class="w-3 h-3 text-accent-neon" />
                          {(deal.upvotes || 0)} upvotes
                        </span>
                        {deal.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-accent-gold">
                            ★ {deal.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cost and Action button */}
                    <div className="mt-4 pt-3 border-t border-[#24324D] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest line-through">
                          {convertPrice(deal.original_price, currency)}
                        </span>
                        <span className="text-sm font-black text-accent-neon">
                          {convertPrice(deal.sale_price, currency)}
                        </span>
                      </div>

                      <button 
                        onClick={(e) => handleGetDealClick(e, deal)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-lg uppercase tracking-wider transition-all btn-click-active shadow-[0_0_10px_rgba(37,99,235,0.25)]"
                      >
                        Get Deal <ExternalLink class="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

    </div>
  );
}
