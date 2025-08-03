/**
 * Mapping entre codes pays (ISO 3166-1 alpha-2) et codes devises (ISO 4217)
 * Basé sur les standards internationaux
 */

const COUNTRY_TO_CURRENCY = {
  // États-Unis
  US: 'USD',
  
  // Émirats Arabes Unis
  AE: 'AED',
  
  // Pays de l'Union Européenne
  DE: 'EUR', // Allemagne
  FR: 'EUR', // France
  IT: 'EUR', // Italie
  ES: 'EUR', // Espagne
  NL: 'EUR', // Pays-Bas
  BE: 'EUR', // Belgique
  AT: 'EUR', // Autriche
  IE: 'EUR', // Irlande
  FI: 'EUR', // Finlande
  PT: 'EUR', // Portugal
  GR: 'EUR', // Grèce
  LU: 'EUR', // Luxembourg
  MT: 'EUR', // Malte
  CY: 'EUR', // Chypre
  SI: 'EUR', // Slovénie
  SK: 'EUR', // Slovaquie
  EE: 'EUR', // Estonie
  LV: 'EUR', // Lettonie
  LT: 'EUR', // Lituanie
  
  // Royaume-Uni
  GB: 'GBP',
  
  // Canada
  CA: 'CAD',
  
  // Australie
  AU: 'AUD',
  
  // Suisse
  CH: 'CHF',
  
  // Japon
  JP: 'JPY',
  
  // Chine
  CN: 'CNY',
  
  // Inde
  IN: 'INR',
  
  // Brésil
  BR: 'BRL',
  
  // Mexique
  MX: 'MXN',
  
  // Corée du Sud
  KR: 'KRW',
  
  // Singapour
  SG: 'SGD',
  
  // Hong Kong
  HK: 'HKD',
  
  // Arabie Saoudite
  SA: 'SAR',
  
  // Qatar
  QA: 'QAR',
  
  // Koweït
  KW: 'KWD',
  
  // Bahreïn
  BH: 'BHD',
  
  // Oman
  OM: 'OMR',
  
  // Jordanie
  JO: 'JOD',
  
  // Liban
  LB: 'LBP',
  
  // Égypte
  EG: 'EGP',
  
  // Maroc
  MA: 'MAD',
  
  // Tunisie
  TN: 'TND',
  
  // Algérie
  DZ: 'DZD',
  
  // Nigeria
  NG: 'NGN',
  
  // Kenya
  KE: 'KES',
  
  // Ghana
  GH: 'GHS',
  
  // Afrique du Sud
  ZA: 'ZAR',
  
  // Thaïlande
  TH: 'THB',
  
  // Malaisie
  MY: 'MYR',
  
  // Indonésie
  ID: 'IDR',
  
  // Philippines
  PH: 'PHP',
  
  // Vietnam
  VN: 'VND',
  
  // Suède
  SE: 'SEK',
  
  // Norvège
  NO: 'NOK',
  
  // Danemark
  DK: 'DKK',
  
  // Pologne
  PL: 'PLN',
  
  // République Tchèque
  CZ: 'CZK',
  
  // Hongrie
  HU: 'HUF',
  
  // Russie
  RU: 'RUB',
  
  // Turquie
  TR: 'TRY',
  
  // Israël
  IL: 'ILS',
};

/**
 * Obtient le code devise pour un code pays donné
 * @param {string} countryCode - Code pays ISO 3166-1 alpha-2 (ex: 'US', 'FR', 'AE')
 * @returns {string|null} Code devise ISO 4217 ou null si non trouvé
 */
const getCurrencyFromCountry = (countryCode) => {
  if (!countryCode) return null;
  
  const normalizedCountryCode = countryCode?.toUpperCase();
  return COUNTRY_TO_CURRENCY[normalizedCountryCode] || null;
};

/**
 * Valide si un code devise est supporté
 * @param {string} currencyCode - Code devise à valider
 * @returns {boolean} True si la devise est supportée
 */
const isValidCurrency = (currencyCode) => {
  if (!currencyCode) return false;
  
  const supportedCurrencies = [
    'USD', 'EUR', 'GBP', 'CHF', 'AED', 'CAD', 'AUD', 'JPY', 'CNY', 'INR',
    'BRL', 'MXN', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
    'RUB', 'TRY', 'ZAR', 'KRW', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'EGP',
    'NGN', 'KES', 'GHS', 'MAD', 'TND', 'QAR', 'SAR', 'KWD', 'BHD', 'OMR',
    'JOD', 'LBP', 'ILS'
  ];
  
  return supportedCurrencies.includes(currencyCode.toUpperCase());
};

/**
 * Obtient la devise par défaut basée sur le pays ou retourne une devise par défaut
 * @param {string} countryCode - Code pays
 * @param {string} fallbackCurrency - Devise par défaut si le pays n'est pas trouvé
 * @returns {string} Code devise
 */
const getCurrencyWithFallback = (countryCode, fallbackCurrency = 'USD') => {
  const currency = getCurrencyFromCountry(countryCode);
  return currency || fallbackCurrency;
};

module.exports = {
  getCurrencyFromCountry,
  isValidCurrency,
  getCurrencyWithFallback,
  COUNTRY_TO_CURRENCY
}; 