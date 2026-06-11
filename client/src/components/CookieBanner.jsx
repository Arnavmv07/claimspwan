import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('claimspawn_cookie_consent');
    if (!consent) {
      // Small delay to make the entrance smooth and noticeable
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('claimspawn_cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 animate-fade-in">
      <div className="bg-[#121A2A]/90 border border-[#24324D] rounded-2xl p-5 shadow-2xl glass backdrop-blur-md flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <div className="p-2 bg-[#00F2FE]/10 rounded-xl text-[#00F2FE] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cookie & Privacy Consent</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed font-semibold">
              We and our partners (including Google and Monetag) use cookies to customize your experience, analyze traffic, and serve personalized gaming deals. Review our <a href="#/legal/privacy" className="text-accent-neon hover:underline font-bold">Privacy Policy</a> to learn more.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleAccept}
            className="px-5 py-2 bg-gradient-to-r from-accent-neon to-accent-glow hover:from-accent-glow hover:to-accent-neon text-[#0B0F19] text-xs font-black uppercase rounded-xl transition-all duration-300 shadow-glow-cyan btn-click-active"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
