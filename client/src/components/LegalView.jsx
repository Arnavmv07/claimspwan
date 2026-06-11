import React from 'react';

export default function LegalView({ type, onClose }) {
  const isPrivacy = type === 'privacy';
  const isTerms = type === 'terms';
  const isAbout = type === 'about';
  
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
          {isAbout ? 'About Us' : isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          {isAbout ? (
            <>
              <p><strong>Last Updated:</strong> June 11, 2026</p>
              
              <h2 className="text-xl font-bold text-white mt-4">Our Mission</h2>
              <p>
                Welcome to <strong>ClaimSpawn</strong>. Our mission is to make gaming more accessible to players worldwide by aggregating 100% official, legally free digital game deals in one unified hub. We believe that everyone should have access to quality interactive entertainment without having to resort to security risks, spyware, or digital piracy.
              </p>
              
              <h2 className="text-xl font-bold text-white mt-4">How It Works</h2>
              <p>
                We continuously scan and index active promotional campaigns across verified digital storefronts, including Steam, Epic Games Store, GOG, Prime Gaming, and major console stores. 
              </p>
              <p>
                When you click to claim a game on ClaimSpawn, we route you directly to the official digital distribution platform to checkout. We do not sell keys, hold user accounts, or handle payment transactions. This ensures your digital licenses are bound directly to your official store credentials, keeping your gaming library secure and permanently yours.
              </p>
              
              <h2 className="text-xl font-bold text-white mt-4">Data Sources & Attribution</h2>
              <p>
                To provide real-time updates on active gaming giveaways, our platforms aggregate official campaign data from verified APIs, including the GamerPower API. All game titles, brand marks, cover art, and store trademarks are the property of their respective owners and are used here solely for informational and editorial aggregation purposes.
              </p>

              <h2 className="text-xl font-bold text-white mt-4">Who We Are</h2>
              <p>
                ClaimSpawn was built by a small team of independent developers and passionate gaming advocates. We are dedicated to preservation, discoverability, and accessibility in the gaming community. If you have any inquiries, feedback, or partnerships, feel free to reach out to us at <a href="mailto:support@claimspawn.store" className="text-accent-neon hover:underline">support@claimspawn.store</a>.
              </p>
            </>
          ) : isPrivacy ? (
            <>
              <p><strong>Last Updated:</strong> June 10, 2026</p>
              <h2 className="text-xl font-bold text-white mt-4">1. Information We Collect</h2>
              <p>ClaimSpawn ("we," "our," or "us") respects your privacy. We do not require users to create accounts, and we do not collect personally identifiable information (PII) such as names, emails, or phone numbers unless explicitly provided for customer support.</p>
              
              <h2 className="text-xl font-bold text-white mt-4">2. Cookies and Tracking</h2>
              <p>We may use basic browser cookies and local storage to save your preferences (e.g., currency selections) and to ensure our website functions properly. We use third-party analytics and advertising partners (such as AdCash and Monetag) which may use cookies to serve personalized ads based on your visit to this and other websites.</p>
              
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
