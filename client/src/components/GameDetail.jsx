import React, { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Star, Calendar, Cpu, ShieldCheck, Gift, CheckCircle2, Bookmark, Flame } from 'lucide-react';
import AdSlot from './AdSlot';
import { convertPrice } from '../utils/currency';

export default function GameDetail({ 
  gameId, 
  onBack, 
  onClaimClick,
  allGames,
  onAdClick,
  onAdImpression,
  currency
}) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVoted, setUserVoted] = useState(null); // 'up' | 'down' | null
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch single game detail on mount
  useEffect(() => {
    setLoading(true);
    fetch(`/api/games/${gameId}`)
      .then(res => {
        if (!res.ok) throw new Error('Game not found');
        return res.json();
      })
      .then(data => {
        setGame(data);
        setLoading(false);
        
        // Dynamically update document Title & Meta Description for SEO
        document.title = `Claim ${data.title} for Free on ${data.platform} | Claimspwan`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `Get a 100% free digital copy of ${data.title} on ${data.platform}. View system requirements, claim steps, and reviews on Claimspwan.`);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });

    // Reset title on unmount
    return () => {
      document.title = "Claimspwan | Free Gaming Aggregator & Mystery Deals";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "Track and claim games currently available to claim for free across Steam, Epic Games, GOG, Prime Gaming, PlayStation, Xbox, and Nintendo! Optimized listings with affiliate claims.");
      }
    };
  }, [gameId]);

  const handleVote = (type) => {
    if (userVoted === type) return;

    fetch(`/api/games/${gameId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type === 'up' ? 'up' : 'down' })
    })
    .then(res => res.json())
    .then(updatedGame => {
      setGame(updatedGame);
      setUserVoted(type);
    })
    .catch(err => console.error('Error voting:', err));
  };

  const handleRate = (ratingValue) => {
    setUserRating(ratingValue);
    fetch(`/api/games/${gameId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: ratingValue })
    })
    .then(res => res.json())
    .then(updatedGame => {
      setGame(updatedGame);
    })
    .catch(err => console.error('Error rating:', err));
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-accent-neon animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold">Scanning Loot Database...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-32 text-center">
        <span className="text-5xl">⚠️</span>
        <h3 className="text-lg font-bold mt-4">Error loading game details</h3>
        <p className="text-sm text-gray-500 mt-1">{error || 'Game not found in database.'}</p>
        <button 
          onClick={() => onBack()}
          className="mt-6 px-6 py-2 bg-dark-card border border-[#24324D] rounded-xl text-xs font-black uppercase text-accent-neon"
        >
          Return to Grid
        </button>
      </div>
    );
  }

  // Get upcoming games list for the sidebar calendar
  const upcomingGames = allGames
    .filter(g => g.status === 'Upcoming' && g.id !== game.id)
    .slice(0, 3);

  // Platform brand theme colors
  const brandColors = {
    'Steam': 'text-[#00F2FE]',
    'Epic Games Store': 'text-white',
    'GOG': 'text-[#B624FF]',
    'PlayStation Store': 'text-[#00F2FE]',
    'Xbox Store': 'text-[#107c10]',
    'Nintendo eShop': 'text-[#e60012]',
    'Amazon Games / Prime Gaming': 'text-[#9146FF]'
  };
  const platformColorClass = brandColors[game.platform] || 'text-accent-neon';

  // Dynamic key highlights to give detailed perspective
  const getGameKeyHighlights = () => {
    const titleLower = game.title.toLowerCase();
    if (titleLower.includes('civilization')) {
      return [
        "Construct vast empires and guide your civilization from the Stone Age to the Space Age.",
        "Expand your borders dynamically and establish active research paths.",
        "Engage with historical world leaders in stateful diplomacy options."
      ];
    }
    if (titleLower.includes('bioshock')) {
      return [
        "Explore the iconic, dark underwater city of Rapture and the cloud city of Columbia.",
        "Modify your DNA with plasmids to deploy elemental powers in active battle.",
        "Immersive storyline featuring full remastered visual upgrades."
      ];
    }
    return [
      "100% Free Full Digital Download: Yours to keep in your personal library forever.",
      "Vibrant Multiplayer & Singleplayer elements (depending on platform rules).",
      "Seamless integration: Binds directly to your official store credentials."
    ];
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Back navigation */}
      <button 
        onClick={() => onBack()}
        className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-accent-neon transition-colors btn-click-active"
      >
        <ArrowLeft class="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Grid Layout: Left Columns (span 2) vs Right Sticky Sidebar (span 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns (Details, Upvotes, System Specs, Main CTA) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Showcase Panel */}
          <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-6 glass relative overflow-hidden flex flex-col md:flex-row gap-6 shadow-2xl">
            
            {/* Left side subcolumn: Game cover & upvote/downvote */}
            <div className="w-full md:w-56 flex flex-col items-center gap-4 flex-shrink-0">
              <div className="w-full h-72 rounded-2xl overflow-hidden bg-dark-bg border border-[#24324D] relative shadow-lg">
                <img 
                  src={game.image_url} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dynamic Upvote/Downvote actions */}
              <div className="w-full flex items-center justify-between gap-3 px-1">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-black transition-all btn-click-active ${
                    userVoted === 'up' 
                      ? 'bg-green-500/20 border-green-500 text-green-400 font-extrabold' 
                      : 'bg-[#18233C] border-[#24324D] text-gray-300 hover:border-green-500/50 hover:text-green-400'
                  }`}
                >
                  <ThumbsUp class="w-4 h-4" /> UP ({game.upvotes || 0})
                </button>
                <button
                  onClick={() => handleVote('down')}
                  className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-black transition-all btn-click-active ${
                    userVoted === 'down' 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-[#18233C] border-[#24324D] text-gray-300 hover:border-red-500/50 hover:text-red-400'
                  }`}
                >
                  <ThumbsDown class="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic community rating star interaction */}
              <div className="w-full bg-dark-bg/60 border border-[#24324D] rounded-xl p-3 text-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold mb-1.5">Your Rating</span>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleRate(val)}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-125 duration-100"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          (hoverRating || userRating || game.community_rating || 0) >= val
                            ? 'text-accent-gold fill-accent-gold'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-accent-neon font-bold mt-1.5 font-mono">
                  {game.community_rating > 0 ? `Rating: ${game.community_rating.toFixed(1)} / 5.0` : 'Not Rated'}
                </div>
              </div>

            </div>

            {/* Right side subcolumn: Game Info & Glowing CTA */}
            <div className="flex-1 flex flex-col justify-between">
              
              <div>
                {/* Storefront badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-dark-bg/80 border border-[#24324D] rounded-lg text-xs font-black uppercase text-white mb-4">
                  <span className={`w-2 h-2 rounded-full bg-accent-neon`}></span>
                  Store: <span className={platformColorClass}>{game.platform}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                  {game.title}
                </h1>

                {/* Original price row */}
                <div className="flex items-center gap-3 text-sm font-semibold mb-6">
                  <span className="text-gray-400">Original price: <span className="line-through">{convertPrice(game.original_price, currency)}</span></span>
                  <span className="text-accent-neon font-black uppercase">{game.discount}</span>
                  {game.epic_creator_tag && (
                    <span className="text-[9px] font-black text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded uppercase">
                      Creator Tag Loaded
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs text-gray-300 border-t border-[#24324D] pt-4 leading-relaxed font-medium">
                  <p>🎟️ <span className="text-gray-400">Offer Type:</span> 100% Free digital copy (keep forever).</p>
                  <p>🔑 <span className="text-gray-400">Method:</span> Direct storefront checkout, no external key needed.</p>
                  <p>🛡️ <span className="text-gray-400">Safety Guarantee:</span> Officially aggregated from verified publishers only.</p>
                </div>
              </div>

              {/* CENTER CALL TO ACTION: Massive Glowing Pulse Claim Button */}
              <div className="mt-8 relative select-none">
                {game.status === 'Expired' ? (
                  <div className="w-full text-center py-4 bg-dark-bg/80 border border-red-500/20 text-red-500 font-extrabold uppercase rounded-2xl">
                    ⚠️ This Free Offer Has Expired
                  </div>
                ) : game.status === 'Upcoming' ? (
                  <div className="w-full text-center py-4 bg-dark-bg/85 border border-accent-gold/20 text-accent-gold font-extrabold uppercase rounded-2xl">
                    ⏳ Upcoming Deal - Unlocks when countdown expires
                  </div>
                ) : (
                  <>
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-neon via-accent-purple to-accent-glow rounded-2xl opacity-60 blur-md animate-pulse"></div>
                    
                    <button
                      onClick={() => onClaimClick(game)}
                      className="relative w-full py-4.5 bg-[#0B0F19] border border-accent-neon hover:bg-gradient-to-r hover:from-accent-neon hover:to-accent-purple hover:text-[#0B0F19] text-accent-neon font-extrabold uppercase text-sm tracking-widest rounded-2xl transition-all duration-300 shadow-glow-cyan flex items-center justify-center gap-2 btn-click-active text-center py-4"
                    >
                      <Gift class="w-5 h-5 text-accent-gold animate-bounce" />
                      CLAIM FREE KEY HERE
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>

          {/* GAME DETAILS & LOOT PERSPECTIVE SECTION */}
          <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-6 glass space-y-6">
            
            {/* DEDICATED ABOUT THE GAME SECTION */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent-neon flex items-center gap-2 border-b border-[#24324D] pb-2">
                <Bookmark class="w-4 h-4 text-accent-neon" /> ABOUT THE GAME
              </h3>
              <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                {game.description || `Claim ${game.title} for absolutely free on ${game.platform}! Bind it permanently to your account library during this limited time campaign.`}
              </p>
            </div>

            {/* Dynamic recommendation perspective box */}
            <div className="bg-[#18233C]/50 border border-[#24324D]/60 rounded-2xl p-4.5 space-y-2">
              <span className="text-[10px] text-accent-purple font-black uppercase tracking-widest block flex items-center gap-1">
                <Flame class="w-3.5 h-3.5 text-accent-purple" /> Claimspwan Aggregator Perspective
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                ⭐️ <strong className="text-gray-300">Why we recommend it:</strong> Claiming free games from official storefronts like {game.platform} is a fantastic, zero-risk way to broaden your digital catalog. {game.title} currently scores a strong {game.community_rating > 0 ? `${game.community_rating}/5` : 'high rating'} within the community, making it an absolute must-add to your personal library before the promotional countdown ends!
              </p>
            </div>

            {/* Key features bullets */}
            <div className="space-y-3">
              <span className="text-[10px] text-accent-purple font-black uppercase tracking-widest block">Key Features</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getGameKeyHighlights().map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-dark-bg/30 border border-[#24324D]/50 rounded-xl p-3 text-xs text-gray-300 font-semibold">
                    <CheckCircle2 class="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step walkthrough instructions */}
            {game.status === 'Active' && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] text-[#00F2FE] font-black uppercase tracking-widest block">How to Claim This Free Deal</span>
                <ol className="space-y-2.5 text-xs text-gray-400 font-semibold pl-1">
                  {game.instructions ? (
                    <li className="flex flex-col gap-2.5 bg-dark-bg/40 border border-[#24324D]/50 rounded-xl p-3.5 text-xs text-gray-300 font-medium">
                      <span className="text-accent-neon font-black font-mono tracking-widest text-[9px] uppercase">DIRECT CLAIM WALKTHROUGH:</span>
                      <p className="leading-relaxed">{game.instructions}</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-normal italic">
                        Note: Make sure you are logged in to your official {game.platform} account to allow the license to bind permanently.
                      </p>
                    </li>
                  ) : (
                    <>
                      <li className="flex gap-2">
                        <span className="text-accent-neon font-black font-mono">1.</span>
                        <span>Click the glowing <strong className="text-white">CLAIM FREE KEY HERE</strong> button above.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-neon font-black font-mono">2.</span>
                        <span>You will trigger our secure Vignette interstitial. Once the 5-second countdown ends, you will be redirected to the official storefront.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent-neon font-black font-mono">3.</span>
                        <span>On the storefront, sign in with your active account credentials (or create a new one for 100% free).</span>
                      </li>
                    </>
                  )}
                </ol>
              </div>
            )}

          </div>

          {/* System Requirements Panel */}
          <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-6 glass">
            <h3 className="text-sm font-black uppercase tracking-wider text-accent-neon flex items-center gap-2 mb-4">
              <Cpu class="w-4 h-4" /> PC SYSTEM REQUIREMENTS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Minimum */}
              <div className="bg-dark-bg/40 border border-[#24324D] rounded-2xl p-4.5 space-y-2.5">
                <span className="text-[10px] text-accent-purple font-black uppercase tracking-widest block">Minimum Specifications</span>
                <p className="text-gray-300 leading-relaxed font-semibold">
                  {game.system_requirements?.minimum || "OS: Windows 10 64-bit | Core specifications required for standard setup."}
                </p>
              </div>

              {/* Recommended */}
              <div className="bg-dark-bg/40 border border-[#24324D] rounded-2xl p-4.5 space-y-2.5">
                <span className="text-[10px] text-[#00F2FE] font-black uppercase tracking-widest block">Recommended Specifications</span>
                <p className="text-gray-300 leading-relaxed font-semibold">
                  {game.system_requirements?.recommended || "Instructions: Checkout on storefront."}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Sticky Sidebar (300x600 skyscraper + Upcoming Freebies Calendar) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Upcoming Freebies Calendar */}
          <div className="bg-[#121A2A] border border-[#24324D] rounded-3xl p-6 glass shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-accent-purple flex items-center gap-2 mb-4">
              <Calendar class="w-4 h-4" /> UPCOMING CALENDAR
            </h3>

            {upcomingGames.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500">
                No future freebies loaded in calendar.
              </div>
            ) : (
              <div className="space-y-3.5 select-none">
                {upcomingGames.map((g) => (
                  <div 
                    key={g.id}
                    onClick={() => { onBack(g.id); }}
                    className="flex items-center gap-3 p-3 bg-dark-bg/40 border border-[#24324D] hover:border-accent-purple rounded-xl cursor-pointer transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#0F172A]">
                      <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{g.title}</h4>
                      <p className="text-[10px] text-accent-purple font-extrabold mt-0.5">{g.platform}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                        Opens: {new Date(g.start_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
