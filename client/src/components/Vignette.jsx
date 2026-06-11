import React, { useState, useEffect } from 'react';
import { ShieldCheck, Flame, Loader2, Sparkles, X } from 'lucide-react';
import { rewriteRegionalUrl } from '../utils/currency';

export default function Vignette({ 
  game, 
  onClose, 
  currency
}) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [redirectReady, setRedirectReady] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setRedirectReady(true);
      executeRedirect();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const executeRedirect = () => {
    let finalUrl = game.claim_url;

    // Append Epic Creator Tag or GOG affiliate campaign parameters
    if (game.platform === 'Epic Games Store' && game.epic_creator_tag) {
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}tag=${game.epic_creator_tag}`;
    } else if (game.platform === 'Steam') {
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}utm_source=claimspawn&utm_medium=aggregator`;
    } else if (game.platform === 'GOG') {
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl = `${finalUrl}${separator}pp=claimspawn-affiliate-id`;
    }

    const localizedUrl = rewriteRegionalUrl(finalUrl, currency);
    console.log(`Triggering external claim redirect to: ${localizedUrl}`);
    
    // Open in a new tab
    window.open(localizedUrl, '_blank', 'noopener,noreferrer');
    
    // Close the vignette and return user to site dashboard
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/95 backdrop-blur-xl p-4 select-none animate-fade-in">
      
      {/* Background radial cyan/purple light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-accent-purple/10 to-accent-neon/10 rounded-full blur-3xl opacity-60"></div>
      
      {/* Close button (allows skipping or returning if stuck) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-dark-card border border-[#24324D] text-gray-400 hover:text-white hover:border-accent-neon transition-all"
        title="Return to ClaimSpawn"
      >
        <X class="w-5 h-5" />
      </button>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl bg-dark-card border border-[#24324D] rounded-3xl p-8 glass shadow-2xl flex flex-col items-center text-center space-y-6 overflow-hidden">
        
        {/* Progress header */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00F2FE]">
          <Loader2 class="w-4 h-4 animate-spin text-accent-neon" />
          <span>Generating Secure Affiliate Claim Link...</span>
        </div>

        {/* Live countdown timer widget */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Decorative circular spinner */}
          <div className="absolute inset-0 rounded-full border-4 border-[#18233C]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accent-neon border-r-accent-purple animate-spin-slow"></div>
          <span className="text-3xl font-black text-white font-mono animate-pulse">
            {secondsLeft > 0 ? secondsLeft : '🚀'}
          </span>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            You are leaving ClaimSpawn for <span className="text-accent-neon">{game.platform}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Please wait while we establish a secure connection. Your support through our affiliate tags helps keep ClaimSpawn 100% free!
          </p>
        </div>

        {/* Dynamic Verification Seal */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-[10px] text-green-400 font-extrabold">
          <ShieldCheck class="w-4 h-4" />
          <span>OFFICIALLY VERIFIED SECURE &bull; NO MALWARE &bull; 0% REDIRECT FEES</span>
        </div>

      </div>

    </div>
  );
}
