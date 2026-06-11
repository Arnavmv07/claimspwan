import React, { useState } from 'react';
import { Percent, ArrowRight, ExternalLink, ThumbsUp, Search } from 'lucide-react';
import { convertPrice, rewriteRegionalUrl } from '../utils/currency';

const CONSOLE_REGIONAL_PRICES = {
  'xbox-forza-horizon-5': {
    USD: { original: '$59.99', sale: '$29.99' },
    GBP: { original: '£54.99', sale: '£27.49' },
    EUR: { original: '€69.99', sale: '€34.99' },
    INR: { original: '₹3,999', sale: '₹1,999' },
    CAD: { original: 'C$79.99', sale: 'C$39.99' },
    AUD: { original: 'A$99.95', sale: 'A$49.97' },
    JPY: { original: '¥7,900', sale: '¥3,950' },
    CNY: { original: '¥398', sale: '¥199' }
  },
  'xbox-halo-infinite': {
    USD: { original: '$59.99', sale: '$29.99' },
    GBP: { original: '£54.99', sale: '£27.49' },
    EUR: { original: '€69.99', sale: '€34.99' },
    INR: { original: '₹3,999', sale: '₹1,999' },
    CAD: { original: 'C$79.99', sale: 'C$39.99' },
    AUD: { original: 'A$99.95', sale: 'A$49.97' },
    JPY: { original: '¥7,900', sale: '¥3,950' },
    CNY: { original: '¥398', sale: '¥199' }
  },
  'xbox-cyberpunk-2077': {
    USD: { original: '$59.99', sale: '$29.99' },
    GBP: { original: '£54.99', sale: '£27.49' },
    EUR: { original: '€69.99', sale: '€34.99' },
    INR: { original: '₹3,999', sale: '₹1,999' },
    CAD: { original: 'C$79.99', sale: 'C$39.99' },
    AUD: { original: 'A$99.95', sale: 'A$49.97' },
    JPY: { original: '¥7,900', sale: '¥3,950' },
    CNY: { original: '¥398', sale: '¥199' }
  },
  'ps5-spiderman-2': {
    USD: { original: '$69.99', sale: '$49.99' },
    GBP: { original: '£69.99', sale: '£49.99' },
    EUR: { original: '€79.99', sale: '€57.59' },
    INR: { original: '₹4,999', sale: '₹3,499' },
    CAD: { original: 'C$89.99', sale: 'C$64.79' },
    AUD: { original: 'A$124.95', sale: 'A$89.96' },
    JPY: { original: '¥9,800', sale: '¥7,056' },
    CNY: { original: '¥468', sale: '¥336' }
  },
  'ps5-god-of-war-ragnarok': {
    USD: { original: '$69.99', sale: '$39.99' },
    GBP: { original: '£69.99', sale: '£39.99' },
    EUR: { original: '€79.99', sale: '€45.59' },
    INR: { original: '₹4,999', sale: '₹2,799' },
    CAD: { original: 'C$89.99', sale: 'C$51.29' },
    AUD: { original: 'A$124.95', sale: 'A$71.22' },
    JPY: { original: '¥9,800', sale: '¥5,586' },
    CNY: { original: '¥468', sale: '¥266' }
  },
  'ps5-last-of-us-part-1': {
    USD: { original: '$69.99', sale: '$39.99' },
    GBP: { original: '£69.99', sale: '£39.99' },
    EUR: { original: '€79.99', sale: '€45.59' },
    INR: { original: '₹4,999', sale: '₹2,799' },
    CAD: { original: 'C$89.99', sale: 'C$51.29' },
    AUD: { original: 'A$124.95', sale: 'A$71.22' },
    JPY: { original: '¥9,800', sale: '¥5,586' },
    CNY: { original: '¥468', sale: '¥266' }
  },
  'ps5-demons-souls': {
    USD: { original: '$69.99', sale: '$29.99' },
    GBP: { original: '£69.99', sale: '£29.99' },
    EUR: { original: '€79.99', sale: '€34.39' },
    INR: { original: '₹4,999', sale: '₹1,999' },
    CAD: { original: 'C$89.99', sale: 'C$38.69' },
    AUD: { original: 'A$124.95', sale: 'A$53.72' },
    JPY: { original: '¥9,800', sale: '¥4,214' },
    CNY: { original: '¥468', sale: '¥201' }
  }
};

const CONSOLE_UNIVERSAL_URLS = {
  'xbox-forza-horizon-5': 'https://www.microsoft.com/store/productId/9nkx70bbcdrn',
  'xbox-halo-infinite': 'https://www.microsoft.com/store/productId/9pp627106m4v',
  'xbox-cyberpunk-2077': 'https://www.microsoft.com/store/productId/bx3m8l83bbrw',
  'ps5-spiderman-2': 'https://store.playstation.com/concept/10003732',
  'ps5-god-of-war-ragnarok': 'https://store.playstation.com/concept/10001314',
  'ps5-last-of-us-part-1': 'https://store.playstation.com/concept/10003554',
  'ps5-demons-souls': 'https://store.playstation.com/concept/10000293'
};

export default function SaleView({ sales, loading, error, currency }) {
  const [activeSubTab, setActiveSubTab] = useState('PC'); // 'PC' | 'Xbox' | 'PS5'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-10' | 'under-20'

  // Complete frontend sanitization / pricing override
  const sanitizedSales = sales.filter(item => item.id !== 'xbox-elden-ring').map((item) => {
    let claimUrl = item.claim_url;

    // Overwrite with universal direct short redirect links
    if (CONSOLE_UNIVERSAL_URLS[item.id]) {
      claimUrl = CONSOLE_UNIVERSAL_URLS[item.id];
    }

    return {
      ...item,
      claim_url: claimUrl
    };
  });

  const handleGetDealClick = (e, deal) => {
    e.stopPropagation();
    const targetUrl = rewriteRegionalUrl(deal.claim_url, currency);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper to parse price string like "$19.99" to float 19.99
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  // Filter and Sort Data
  const getFilteredAndSortedSales = () => {
    let result = sanitizedSales.filter((item) => {
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
              Real-time daily-updating sales for PC. We scan PC storefronts globally to aggregate premium AAA games currently selling at a massive discount compared to their launch prices.
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
            {['PC'].map((plat) => (
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
