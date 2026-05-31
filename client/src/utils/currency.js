export const CURRENCIES = {
  USD: { label: 'USD ($)', symbol: '$', rate: 1.0 },
  EUR: { label: 'EUR (€)', symbol: '€', rate: 0.92 },
  GBP: { label: 'GBP (£)', symbol: '£', rate: 0.78 },
  INR: { label: 'INR (₹)', symbol: '₹', rate: 83.5 },
  CAD: { label: 'CAD (C$)', symbol: 'C$', rate: 1.37 },
  AUD: { label: 'AUD (A$)', symbol: 'A$', rate: 1.51 },
  JPY: { label: 'JPY (¥)', symbol: '¥', rate: 156.0 },
  CNY: { label: 'CNY (¥)', symbol: '¥', rate: 7.25 }
};

export function convertPrice(priceStr, currencyKey) {
  if (!priceStr) return '';
  const trimmed = priceStr.trim();
  
  // Handle standard free strings
  if (trimmed.toLowerCase() === 'free' || trimmed === '$0.00' || trimmed === '0.00' || trimmed.toLowerCase().includes('free')) {
    return 'FREE';
  }
  
  // Extract numeric value
  const match = trimmed.match(/[0-9.]+/);
  if (!match) return trimmed;
  
  const usdValue = parseFloat(match[0]);
  if (isNaN(usdValue)) return trimmed;
  
  const currency = CURRENCIES[currencyKey] || CURRENCIES.USD;
  const converted = usdValue * currency.rate;
  
  // Format beautifully (no decimal places for JPY/CNY/INR if they are high, or JPY is standard no decimals)
  const decimals = (currencyKey === 'JPY') ? 0 : 2;
  const formattedValue = converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  // Clean symbol presentation
  return `${currency.symbol}${formattedValue}`;
}
