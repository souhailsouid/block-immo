/**
 * Mapping between country codes (ISO 3166-1 alpha-2) and currency codes (ISO 4217)
 * This is a subset of common countries - you can expand this as needed
 */

export const COUNTRY_TO_CURRENCY = {
  // United States
  US: 'USD',
  
  // United Arab Emirates
  AE: 'AED',
  
  // European Union countries
  DE: 'EUR', // Germany
  FR: 'EUR', // France
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  IE: 'EUR', // Ireland
  FI: 'EUR', // Finland
  PT: 'EUR', // Portugal
  GR: 'EUR', // Greece
  LU: 'EUR', // Luxembourg
  MT: 'EUR', // Malta
  CY: 'EUR', // Cyprus
  SI: 'EUR', // Slovenia
  SK: 'EUR', // Slovakia
  EE: 'EUR', // Estonia
  LV: 'EUR', // Latvia
  LT: 'EUR', // Lithuania
  
  // United Kingdom
  GB: 'GBP',
  
  // Canada
  CA: 'CAD',
  
  // Australia
  AU: 'AUD',
  
  // Switzerland
  CH: 'CHF',
  
  // Japan
  JP: 'JPY',
  
  // China
  CN: 'CNY',
  
  // India
  IN: 'INR',
  
  // Brazil
  BR: 'BRL',
  
  // Mexico
  MX: 'MXN',
  
  // South Korea
  KR: 'KRW',
  
  // Singapore
  SG: 'SGD',
  
  // Hong Kong
  HK: 'HKD',
  
  // Saudi Arabia
  SA: 'SAR',
  
  // Qatar
  QA: 'QAR',
  
  // Kuwait
  KW: 'KWD',
  
  // Bahrain
  BH: 'BHD',
  
  // Oman
  OM: 'OMR',
  
  // Jordan
  JO: 'JOD',
  
  // Lebanon
  LB: 'LBP',
  
  // Egypt
  EG: 'EGP',
  
  // Morocco
  MA: 'MAD',
  
  // Tunisia
  TN: 'TND',
  
  // Algeria
  DZ: 'DZD',
  
  // Nigeria
  NG: 'NGN',
  
  // South Africa
  ZA: 'ZAR',
  
  // Kenya
  KE: 'KES',
  
  // Ghana
  GH: 'GHS',
  
  // Ethiopia
  ET: 'ETB',
  
  // Tanzania
  TZ: 'TZS',
  
  // Uganda
  UG: 'UGX',
  
  // Rwanda
  RW: 'RWF',
  
  // Burundi
  BI: 'BIF',
  
  // Democratic Republic of Congo
  CD: 'CDF',
  
  // Republic of Congo
  CG: 'XAF',
  
  // Cameroon
  CM: 'XAF',
  
  // Central African Republic
  CF: 'XAF',
  
  // Chad
  TD: 'XAF',
  
  // Equatorial Guinea
  GQ: 'XAF',
  
  // Gabon
  GA: 'XAF',
  
  // Senegal
  SN: 'XOF',
  
  // Ivory Coast
  CI: 'XOF',
  
  // Burkina Faso
  BF: 'XOF',
  
  // Mali
  ML: 'XOF',
  
  // Niger
  NE: 'XOF',
  
  // Togo
  TG: 'XOF',
  
  // Benin
  BJ: 'XOF',
  
  // Guinea-Bissau
  GW: 'XOF',
  
  // Russia
  RU: 'RUB',
  
  // Ukraine
  UA: 'UAH',
  
  // Poland
  PL: 'PLN',
  
  // Czech Republic
  CZ: 'CZK',
  
  // Hungary
  HU: 'HUF',
  
  // Romania
  RO: 'RON',
  
  // Bulgaria
  BG: 'BGN',
  
  // Croatia
  HR: 'HRK',
  
  // Serbia
  RS: 'RSD',
  
  // Bosnia and Herzegovina
  BA: 'BAM',
  
  // Montenegro
  ME: 'EUR',
  
  // North Macedonia
  MK: 'MKD',
  
  // Albania
  AL: 'ALL',
  
  // Kosovo
  XK: 'EUR',
  
  // Turkey
  TR: 'TRY',
  
  // Israel
  IL: 'ILS',
  
  // Iran
  IR: 'IRR',
  
  // Iraq
  IQ: 'IQD',
  
  // Syria
  SY: 'SYP',
  
  // Yemen
  YE: 'YER',
  
  // Pakistan
  PK: 'PKR',
  
  // Bangladesh
  BD: 'BDT',
  
  // Sri Lanka
  LK: 'LKR',
  
  // Nepal
  NP: 'NPR',
  
  // Bhutan
  BT: 'BTN',
  
  // Maldives
  MV: 'MVR',
  
  // Myanmar
  MM: 'MMK',
  
  // Thailand
  TH: 'THB',
  
  // Vietnam
  VN: 'VND',
  
  // Cambodia
  KH: 'KHR',
  
  // Laos
  LA: 'LAK',
  
  // Malaysia
  MY: 'MYR',
  
  // Indonesia
  ID: 'IDR',
  
  // Philippines
  PH: 'PHP',
  
  // Taiwan
  TW: 'TWD',
  
  // New Zealand
  NZ: 'NZD',
  
  // Chile
  CL: 'CLP',
  
  // Argentina
  AR: 'ARS',
  
  // Colombia
  CO: 'COP',
  
  // Peru
  PE: 'PEN',
  
  // Venezuela
  VE: 'VES',
  
  // Ecuador
  EC: 'USD',
  
  // Uruguay
  UY: 'UYU',
  
  // Paraguay
  PY: 'PYG',
  
  // Bolivia
  BO: 'BOB',
  
  // Guyana
  GY: 'GYD',
  
  // Suriname
  SR: 'SRD',
  
  // French Guiana
  GF: 'EUR',
  
  // Iceland
  IS: 'ISK',
  
  // Norway
  NO: 'NOK',
  
  // Sweden
  SE: 'SEK',
  
  // Denmark
  DK: 'DKK',
  
  // Faroe Islands
  FO: 'DKK',
  
  // Greenland
  GL: 'DKK',
};

/**
 * Get currency code from country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {string} ISO 4217 currency code or 'USD' as fallback
 */
export const getCurrencyFromCountry = (countryCode) => {
  if (!countryCode) return 'USD';
  
  const currency = COUNTRY_TO_CURRENCY[countryCode.toUpperCase()];
  return currency || 'USD'; // Default to USD if country not found
};

/**
 * Format currency with proper currency code
 * @param {number} value - Amount to format
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrencyByCountry = (value, countryCode, locale = 'en-US') => {
  const currencyCode = getCurrencyFromCountry(countryCode);
  
  try {
    return value?.toLocaleString(locale, {
      style: 'currency',
      currency: currencyCode,
    });
  } catch (error) {
    // Fallback to USD if currency formatting fails
    console.warn(`Currency formatting failed for ${currencyCode}, falling back to USD`);
    return value.toLocaleString(locale, {
      style: 'currency',
      currency: 'USD',
    });
  }
}; 