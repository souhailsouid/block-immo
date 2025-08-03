
import { countries, languages, currencies } from 'countries-list';
// Convert countries data to the format expected by FormFieldSelect
export const getCountryOptions = () => {
  return Object.entries(countries)
    .map(([code, country]) => ({
      value: code.toUpperCase(),
      label: country.name
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
};

// Get country name by code
export const getCountryName = (code) => {
  if (!code) return '';
  const country = countries[code.toLowerCase()];
  return country ? country.name : code;
};

// Get country code by name

export const getCountryCode = (countryName) => {
  if (!countryName) return null;
  
  // Recherche exacte
  const exactMatch = Object.entries(countries).find(([code, country]) => 
    country.name.toLowerCase() === countryName.toLowerCase()
  );
  
  if (exactMatch) return exactMatch[0];
  
  // Recherche partielle (fallback)
  const partialMatch = Object.entries(countries).find(([code, country]) => 
    country.name.toLowerCase().includes(countryName.toLowerCase()) ||
    countryName.toLowerCase().includes(country.name.toLowerCase())
  );
  
  return partialMatch ? partialMatch[0] : null;
};