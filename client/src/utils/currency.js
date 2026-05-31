export const CURRENCIES = {
  USD: { label: 'USD ($)', symbol: '$', rate: 1.0, regionalRate: 1.0 },
  EUR: { label: 'EUR (€)', symbol: '€', rate: 0.92, regionalRate: 0.95 },
  GBP: { label: 'GBP (£)', symbol: '£', rate: 0.78, regionalRate: 0.83 },
  INR: { label: 'INR (₹)', symbol: '₹', rate: 83.5, regionalRate: 45.0 },   // Dynamic regional pricing multiplier for Indian Rupees (PPP game store index)
  CAD: { label: 'CAD (C$)', symbol: 'C$', rate: 1.37, regionalRate: 1.33 },
  AUD: { label: 'AUD (A$)', symbol: 'A$', rate: 1.51, regionalRate: 1.50 },
  JPY: { label: 'JPY (¥)', symbol: '¥', rate: 156.0, regionalRate: 135.0 }, // Dynamic regional pricing multiplier for Japanese Yen
  CNY: { label: 'CNY (¥)', symbol: '¥', rate: 7.25, regionalRate: 4.8 }     // Dynamic regional pricing multiplier for Chinese Yuan
};

export function detectLocalCurrency() {
  try {
    // 1. Prioritize Timezone detection (system clock/location - extremely reliable geographical indicator)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzLower = tz.toLowerCase();
    
    if (tzLower.includes('europe/london') || tzLower.includes('europe/belfast')) return 'GBP';
    if (tzLower.includes('asia/kolkata') || tzLower.includes('asia/calcutta')) return 'INR';
    if (tzLower.includes('america/toronto') || tzLower.includes('america/vancouver') || tzLower.includes('america/edmonton') || tzLower.includes('america/winnipeg')) return 'CAD';
    if (tzLower.includes('australia/') || tzLower.includes('pacific/auckland')) return 'AUD';
    if (tzLower.includes('asia/tokyo')) return 'JPY';
    if (tzLower.includes('asia/shanghai') || tzLower.includes('asia/urumqi') || tzLower.includes('asia/hong_kong') || tzLower.includes('asia/macao')) return 'CNY';
    
    const euroTimezones = ['europe/paris', 'europe/berlin', 'europe/rome', 'europe/madrid', 'europe/amsterdam', 'europe/brussels', 'europe/dublin', 'europe/vienna', 'europe/helsinki', 'europe/lisbon', 'europe/athens'];
    if (euroTimezones.some(et => tzLower.includes(et))) return 'EUR';

    // 2. Fallback to browser languages/locales (often defaults to en-US even for international users)
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    const l = locale.toLowerCase();
    
    if (l.includes('-gb') || l.includes('en-gb')) return 'GBP';
    if (l.includes('-in') || l.includes('hi-') || l.includes('en-in')) return 'INR';
    if (l.includes('-ca') || l.includes('en-ca')) return 'CAD';
    if (l.includes('-au') || l.includes('en-au')) return 'AUD';
    if (l.includes('-jp') || l.includes('ja-')) return 'JPY';
    if (l.includes('-cn') || l.includes('zh-')) return 'CNY';
    
    // Eurozone countries
    const euroLocales = ['-de', '-fr', '-it', '-es', '-nl', '-be', '-ie', '-at', '-fi', '-pt', '-gr', '-sk', '-si', '-ee', '-lv', '-lt', '-cy', '-mt'];
    if (euroLocales.some(el => l.includes(el))) return 'EUR';
    
  } catch (e) {
    console.error('[Currency Auto-Detect] Error detecting local currency:', e);
  }
  
  return 'USD'; // Default fallback
}

export function getStorefrontLocale(currencyKey) {
  const mapping = {
    USD: 'en-us',
    GBP: 'en-gb',
    EUR: 'de-de', // Germany as the largest Eurozone market
    INR: 'en-in',
    CAD: 'en-ca',
    AUD: 'en-au',
    JPY: 'ja-jp',
    CNY: 'zh-cn'
  };
  return mapping[currencyKey] || 'en-us';
}

export function rewriteRegionalUrl(url, currencyKey) {
  if (!url) return url;
  
  // 1. Rewrite Steam links (append country code parameter &cc=IN/GB/DE/US/etc.)
  if (url.includes('steampowered.com/') || url.includes('steamcommunity.com/')) {
    const steamCc = {
      USD: 'US',
      GBP: 'GB',
      EUR: 'DE',
      INR: 'IN',
      CAD: 'CA',
      AUD: 'AU',
      JPY: 'JP',
      CNY: 'CN'
    }[currencyKey] || 'US';
    
    // Check if URL has existing parameters
    let cleanUrl = url.replace(/([?&])cc=[A-Z]{2}/gi, '');
    if (cleanUrl.endsWith('&') || cleanUrl.endsWith('?')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}cc=${steamCc}`;
  }

  // 2. Rewrite PlayStation Store links (ensure localized concept/product URL)
  if (url.includes('store.playstation.com')) {
    const locale = getStorefrontLocale(currencyKey);
    // Find conceptId or productId from the URL
    const conceptMatch = url.match(/\/concept\/([0-9]+)/i);
    if (conceptMatch) {
      return `https://store.playstation.com/${locale}/concept/${conceptMatch[1]}`;
    }
    const productMatch = url.match(/\/product\/([A-Z0-9-]+)/i);
    if (productMatch) {
      return `https://store.playstation.com/${locale}/product/${productMatch[1]}`;
    }
    // Fallback: if it already has a locale, replace it
    const localeRegex = /store\.playstation\.com\/[a-z]{2}-[a-z]{2}\//i;
    if (localeRegex.test(url)) {
      return url.replace(localeRegex, `store.playstation.com/${locale}/`);
    }
    return `https://store.playstation.com/${locale}/`;
  }

  // 3. Rewrite Xbox Store / Microsoft Store links
  if (url.includes('xbox.com') || url.includes('microsoft.com')) {
    const locale = getStorefrontLocale(currencyKey);
    // Extract Product ID (12 alphanumeric characters, e.g. 9nkx70bbcdrn or bx3m8l83bbrw)
    const prodIdMatch = url.match(/(?:productId\/|store\/)([a-z0-9]{12})/i);
    if (prodIdMatch) {
      return `https://www.xbox.com/${locale}/games/store/a/${prodIdMatch[1]}`;
    }
    // Fallback: replace locale in xbox.com URLs
    if (url.includes('xbox.com')) {
      const localeRegex = /xbox\.com\/[a-z]{2}-[a-z]{2}\//i;
      if (localeRegex.test(url)) {
        return url.replace(localeRegex, `xbox.com/${locale}/`);
      }
    }
  }
  
  return url;
}

export function convertPrice(priceStr, currencyKey) {
  if (!priceStr) return '';
  const trimmed = priceStr.trim();
  
  // Handle standard free strings
  if (trimmed.toLowerCase() === 'free' || trimmed === '$0.00' || trimmed === '0.00' || trimmed.toLowerCase().includes('free')) {
    return 'FREE';
  }

  // If the price string does not contain '$' and contains other non-USD symbols, it is already converted!
  if (!trimmed.includes('$') && trimmed.match(/[^0-9.\s]/)) {
    return trimmed;
  }
  
  // Extract numeric value
  const match = trimmed.match(/[0-9.]+/);
  if (!match) return trimmed;
  
  const usdValue = parseFloat(match[0]);
  if (isNaN(usdValue)) return trimmed;
  
  const currency = CURRENCIES[currencyKey] || CURRENCIES.USD;
  // Apply actual digital game storefront regional pricing multipliers (Purchasing Power Parity index)
  const converted = usdValue * currency.regionalRate;
  
  // Format beautifully (no decimal places for JPY/CNY/INR if they are high, JPY is standard integer only)
  const isIntegerOnly = currencyKey === 'JPY' || currencyKey === 'INR' || currencyKey === 'CNY';
  const decimals = isIntegerOnly ? 0 : 2;
  const formattedValue = converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  // Clean symbol presentation
  return `${currency.symbol}${formattedValue}`;
}
