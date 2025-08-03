const { countries } = require('countries-list');

/**
 * Détecte le code pays à partir du nom du pays
 * @param {string} countryName - Nom du pays
 * @returns {string|null} Code pays ISO ou null si non trouvé
 */
const detectCountryCode = (countryName) => {
  if (!countryName) return null;
  
  const normalizedCountry = countryName.toLowerCase().trim();
  
  // Recherche directe dans countries-list
  for (const [code, country] of Object.entries(countries)) {
    if (country.name.toLowerCase() === normalizedCountry ||
        country.native.toLowerCase() === normalizedCountry) {
      return code.toUpperCase();
    }
  }
  
  return null;
};

/**
 * Obtient le nom du pays à partir du code
 * @param {string} countryCode - Code pays ISO
 * @returns {string|null} Nom du pays ou null si non trouvé
 */
const getCountryName = (countryCode) => {
  if (!countryCode) return null;
  
  const country = countries[countryCode.toLowerCase()];
  return country ? country.name : null;
};

/**
 * Valide si un code pays est valide
 * @param {string} countryCode - Code pays à valider
 * @returns {boolean} True si le code est valide
 */
const isValidCountryCode = (countryCode) => {
  if (!countryCode) return false;
  return countries.hasOwnProperty(countryCode.toLowerCase());
};

module.exports = {
  detectCountryCode,
  getCountryName,
  isValidCountryCode
}; 