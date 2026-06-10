import React from 'react';

export default function LegalView({ type, onClose }) {
  const isPrivacy = type === 'privacy';
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 animate-fade-in text-gray-300">
      <button 
        onClick={onClose}
        className="mb-8 flex items-center text-sm font-bold text-accent-neon hover:text-white transition-colors"
      >
        &larr; BACK TO GAMES
      </button>

      <div className="bg-[#121A2F] border border-[#24324D] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          {isPrivacy ? (
            <>
              <p><strong>Last Updated:</strong> June 10, 2026</p>
              <h2 className="text-xl font-bold text-white mt-4">1. Information We Collect</h2>
              <p>ClaimSpawn ("we," "our," or "us") respects your privacy. We do not require users to create accounts, and we do not collect personally identifiable information (PII) such as names, emails, or phone numbers unless explicitly provided for customer support.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">2. Cookies and Tracking</h2>
              <p>We may use basic browser cookies and local storage to save your preferences (e.g., currency selections) and to ensure our website functions properly. We use third-party analytics and advertising partners (such as AdCash) which may use cookies to serve personalized ads based on your visit to this and other websites.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">3. Third-Party Links</h2>
              <p>Our website contains links to external websites (Steam, Epic Games, GOG, etc.). We are not responsible for the privacy practices or the content of these external sites. Once you leave our site, this Privacy Policy no longer applies.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">4. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at support@claimspawn.store.</p>
            </>
          ) : (
            <>
              <p><strong>Last Updated:</strong> June 10, 2026</p>
              <h2 className="text-xl font-bold text-white mt-4">1. Acceptance of Terms</h2>
              <p>By accessing and using ClaimSpawn, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">2. Nature of Service</h2>
              <p>ClaimSpawn is an aggregator of publicly available video game discounts and giveaways. We do not host, sell, or distribute any game files or digital rights. All transactions or claims occur on third-party platforms (e.g., Steam, Epic Games). We cannot guarantee the availability of any listed promotional offer.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">3. Intellectual Property</h2>
              <p>All game titles, cover art, and trademarks are the property of their respective owners. Their use on this website is solely for informational purposes and does not imply endorsement.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">4. Limitation of Liability</h2>
              <p>In no event shall ClaimSpawn or its operators be liable for any indirect, incidental, special, consequential or punitive damages arising out of your access to or use of the service.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
