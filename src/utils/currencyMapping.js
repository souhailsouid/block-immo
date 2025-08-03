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
    return value.toLocaleString(locale, {
      style: 'currency',
      currency: 'USD',
    });
  }
}; 

/**
 * Mapping des devises vers les locales appropriées
 * Permet un affichage correct des devises selon leur région
 */
export const CURRENCY_LOCALE_MAPPING = {
  // Devises principales
  USD: 'en-US',      // Dollar US
  EUR: 'fr-FR',      // Euro (français)
  GBP: 'en-GB',      // Livre Sterling
  CHF: 'de-CH',      // Franc Suisse (allemand)
  AED: 'ar-AE',      // Dirham (arabe)
  
  // Autres devises européennes
  SEK: 'sv-SE',      // Couronne suédoise
  NOK: 'nb-NO',      // Couronne norvégienne
  DKK: 'da-DK',      // Couronne danoise
  PLN: 'pl-PL',      // Zloty polonais
  CZK: 'cs-CZ',      // Couronne tchèque
  HUF: 'hu-HU',      // Forint hongrois
  RON: 'ro-RO',      // Leu roumain
  BGN: 'bg-BG',      // Lev bulgare
  HRK: 'hr-HR',      // Kuna croate
  
  // Devises asiatiques
  JPY: 'ja-JP',      // Yen japonais
  CNY: 'zh-CN',      // Yuan chinois
  KRW: 'ko-KR',      // Won coréen
  SGD: 'en-SG',      // Dollar de Singapour
  HKD: 'zh-HK',      // Dollar de Hong Kong
  TWD: 'zh-TW',      // Dollar taïwanais
  INR: 'en-IN',      // Roupie indienne
  THB: 'th-TH',      // Baht thaïlandais
  MYR: 'ms-MY',      // Ringgit malaisien
  IDR: 'id-ID',      // Rupiah indonésien
  PHP: 'en-PH',      // Peso philippin
  
  // Devises américaines
  CAD: 'en-CA',      // Dollar canadien
  MXN: 'es-MX',      // Peso mexicain
  BRL: 'pt-BR',      // Real brésilien
  ARS: 'es-AR',      // Peso argentin
  CLP: 'es-CL',      // Peso chilien
  COP: 'es-CO',      // Peso colombien
  PEN: 'es-PE',      // Sol péruvien
  
  // Devises africaines
  ZAR: 'en-ZA',      // Rand sud-africain
  EGP: 'ar-EG',      // Livre égyptienne
  NGN: 'en-NG',      // Naira nigérian
  KES: 'sw-KE',      // Shilling kényan
  GHS: 'en-GH',      // Cedi ghanéen
  
  // Devises océaniennes
  AUD: 'en-AU',      // Dollar australien
  NZD: 'en-NZ',      // Dollar néo-zélandais
  
  // Devises du Moyen-Orient
  SAR: 'ar-SA',      // Riyal saoudien
  QAR: 'ar-QA',      // Riyal qatari
  KWD: 'ar-KW',      // Dinar koweïtien
  BHD: 'ar-BH',      // Dinar bahreïni
  OMR: 'ar-OM',      // Rial omanais
  JOD: 'ar-JO',      // Dinar jordanien
  LBP: 'ar-LB',      // Livre libanaise
  ILS: 'he-IL',      // Shekel israélien
  
  // Devises d'Europe de l'Est
  RUB: 'ru-RU',      // Rouble russe
  UAH: 'uk-UA',      // Hryvnia ukrainienne
  BYN: 'be-BY',      // Rouble biélorusse
  KZT: 'kk-KZ',      // Tenge kazakh
  UZS: 'uz-UZ',      // Sum ouzbek
  GEL: 'ka-GE',      // Lari géorgien
  AMD: 'hy-AM',      // Dram arménien
  AZN: 'az-AZ',      // Manat azerbaïdjanais
};

/**
 * Obtient la locale appropriée pour une devise donnée
 * @param {string} currency - Code de la devise (ex: 'USD', 'EUR')
 * @returns {string} Locale appropriée (ex: 'en-US', 'fr-FR')
 */
export const getCurrencyLocale = (currency) => {
  if (!currency) return 'en-US'; // Locale par défaut
  
  const normalizedCurrency = currency.toUpperCase();
  return CURRENCY_LOCALE_MAPPING[normalizedCurrency] || 'en-US';
};

/**
 * Obtient les options de formatage pour une devise donnée
 * @param {string} currency - Code de la devise
 * @returns {Object} Options de formatage
 */
export const getCurrencyFormatOptions = (currency) => {
  const locale = getCurrencyLocale(currency);
  
  return {
    style: 'currency',
    currency: currency.toUpperCase(),
    locale: locale,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
};

/**
 * Formate un montant selon la devise avec la locale appropriée
 * @param {number} amount - Montant à formater
 * @param {string} currency - Code de la devise
 * @param {string} fallbackLocale - Locale de fallback (optionnel)
 * @returns {string} Montant formaté
 */
export const formatCurrencyWithLocale = (amount, currency, fallbackLocale = 'en-US') => {
  if (!amount || !currency) return '';
  
  try {
    const locale = getCurrencyLocale(currency);
    const options = getCurrencyFormatOptions(currency);
    
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    // Fallback en cas d'erreur
    return new Intl.NumberFormat(fallbackLocale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }
};

/**
 * Obtient les informations complètes sur une devise
 * @param {string} currency - Code de la devise
 * @returns {Object} Informations sur la devise
 */
export const getCurrencyInfo = (currency) => {
  if (!currency) return null;
  
  const normalizedCurrency = currency.toUpperCase();
  const locale = getCurrencyLocale(normalizedCurrency);
  
  return {
    code: normalizedCurrency,
    locale: locale,
    formatOptions: getCurrencyFormatOptions(normalizedCurrency),
    isRTL: locale.startsWith('ar') || locale.startsWith('he'), // Langues de droite à gauche
  };
};

/**
 * Génère la liste complète des devises pour les selects
 * @returns {Array} Liste des devises avec labels et symboles
 */
export const getCurrencyOptions = () => {
  const currencyFlags = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', CHF: '🇨🇭', AED: '🇦🇪',
    CAD: '🇨🇦', AUD: '🇦🇺', JPY: '🇯🇵', CNY: '🇨🇳', INR: '🇮🇳',
    BRL: '🇧🇷', MXN: '🇲🇽', SGD: '🇸🇬', HKD: '🇭🇰', SEK: '🇸🇪',
    NOK: '🇳🇴', DKK: '🇩🇰', PLN: '🇵🇱', CZK: '🇨🇿', HUF: '🇭🇺',
    RUB: '🇷🇺', TRY: '🇹🇷', ZAR: '🇿🇦', KRW: '🇰🇷', THB: '🇹🇭',
    MYR: '🇲🇾', IDR: '🇮🇩', PHP: '🇵🇭', VND: '🇻🇳', EGP: '🇪🇬',
    NGN: '🇳🇬', KES: '🇰🇪', GHS: '🇬🇭', MAD: '🇲🇦', TND: '🇹🇳',
    QAR: '🇶🇦', SAR: '🇸🇦', KWD: '🇰🇼', BHD: '🇧🇭', OMR: '🇴🇲',
    JOD: '🇯🇴', LBP: '🇱🇧', ILS: '🇮🇱',
  };

  const currencyNames = {
    USD: 'Dollar US', EUR: 'Euro', GBP: 'Livre Sterling', CHF: 'Franc Suisse', AED: 'Dirham',
    CAD: 'Dollar Canadien', AUD: 'Dollar Australien', JPY: 'Yen', CNY: 'Yuan', INR: 'Roupie',
    BRL: 'Real', MXN: 'Peso', SGD: 'Dollar de Singapour', HKD: 'Dollar de Hong Kong', SEK: 'Couronne Suédoise',
    NOK: 'Couronne Norvégienne', DKK: 'Couronne Danoise', PLN: 'Zloty', CZK: 'Couronne Tchèque', HUF: 'Forint',
    RUB: 'Rouble', TRY: 'Lira Turque', ZAR: 'Rand', KRW: 'Won', THB: 'Baht',
    MYR: 'Ringgit', IDR: 'Rupiah', PHP: 'Peso Philippin', VND: 'Dong', EGP: 'Livre Égyptienne',
    NGN: 'Naira', KES: 'Shilling Kenyan', GHS: 'Cedi', MAD: 'Dirham Marocain', TND: 'Dinar Tunisien',
    QAR: 'Riyal', SAR: 'Riyal Saoudien', KWD: 'Dinar Koweïtien', BHD: 'Dinar Bahreïni', OMR: 'Rial Omanais',
    JOD: 'Dinar Jordanien', LBP: 'Livre Libanaise', ILS: 'Shekel',
  };

  const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', CHF: 'CHF', AED: 'د.إ',
    CAD: 'C$', AUD: 'A$', JPY: '¥', CNY: '¥', INR: '₹',
    BRL: 'R$', MXN: 'MXN$', SGD: 'S$', HKD: 'HK$', SEK: 'kr',
    NOK: 'kr', DKK: 'kr', PLN: 'zł', CZK: 'Kč', HUF: 'Ft',
    RUB: '₽', TRY: '₺', ZAR: 'R', KRW: '₩', THB: '฿',
    MYR: 'RM', IDR: 'Rp', PHP: '₱', VND: '₫', EGP: 'E£',
    NGN: '₦', KES: 'KSh', GHS: 'GH₵', MAD: 'MAD', TND: 'TND',
    QAR: 'QR', SAR: 'SAR', KWD: 'KWD', BHD: 'BHD', OMR: 'OMR',
    JOD: 'JOD', LBP: 'LBP', ILS: '₪',
  };

  return Object.keys(CURRENCY_LOCALE_MAPPING).map(currency => ({
    value: currency,
    label: `${currencyFlags[currency] || '🏳️'} ${currencyNames[currency] || currency} (${currencySymbols[currency] || currency})`,
    symbol: currencySymbols[currency] || currency,
    flag: currencyFlags[currency] || '🏳️',
    name: currencyNames[currency] || currency,
  }));
}; 