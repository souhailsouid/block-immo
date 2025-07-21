import { countries } from 'countries-list';

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
export const getCountryCode = (name) => {
  if (!name) return '';
  const entry = Object.entries(countries).find(([code, country]) => 
    country.name.toLowerCase() === name.toLowerCase()
  );
  return entry ? entry[0].toUpperCase() : '';
}; 