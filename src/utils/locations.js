import { Country, State, City } from 'country-state-city';

// Get all countries
export const getAllCountries = () => {
  return Country.getAllCountries().map(country => ({
      value: country.name,
      code: country.isoCode,
      label: country.name
  }));
};

// Get states/regions for a specific country
export const getStatesByCountry = (countryCode) => {
  if (!countryCode) return [];
  
  const states = State.getStatesOfCountry(countryCode);
  return states.map(state => ({
    value: state.isoCode,
    label: state.name
  }));
};

// Get cities for a specific state/region
export const getCitiesByState = (countryCode, stateCode) => {
  if (!countryCode || !stateCode) return [];
  
  const cities = City.getCitiesOfState(countryCode, stateCode);
  
  // Éliminer les doublons et créer des clés uniques
  const uniqueCities = cities.reduce((acc, city, index) => {
    const existingCity = acc.find(c => c.value === city.name);
    if (!existingCity) {
      acc.push({
        value: city.name,
        label: city.name,
        key: `${city.name}-${countryCode}-${stateCode}-${index}`
      });
    }
    return acc;
  }, []);
  
  return uniqueCities;
};

// Get all cities for a country (without state filter)
export const getCitiesByCountry = (countryCode) => {
  if (!countryCode) return [];
  
  const cities = City.getCitiesOfCountry(countryCode);
  
  // Éliminer les doublons et créer des clés uniques
  const uniqueCities = cities.reduce((acc, city, index) => {
    const existingCity = acc.find(c => c.value === city.name);
    if (!existingCity) {
      acc.push({
        value: city.name,
        label: city.name,
        key: `${city.name}-${countryCode}-${index}`
      });
    }
    return acc;
  }, []);
  
  return uniqueCities;
};

// Get country name by code
export const getCountryNameByCode = (countryCode) => {
  if (!countryCode) return '';
  const country = Country.getCountryByCode(countryCode);
  return country ? country.name : countryCode;
};

// Get state name by code
export const getStateNameByCode = (countryCode, stateCode) => {
  if (!countryCode || !stateCode) return '';
  const states = State.getStatesOfCountry(countryCode);
  const state = states.find(s => s.isoCode === stateCode);
  return state ? state.name : stateCode;
};

// Check if country has states/regions
export const hasStates = (countryCode) => {
  if (!countryCode) return false;
  const states = State.getStatesOfCountry(countryCode);
  return states.length > 0;
};

// Get location hierarchy for a country
export const getLocationHierarchy = (countryCode) => {
  if (!countryCode) return { hasStates: false, hasCities: false };
  
  const states = State.getStatesOfCountry(countryCode);
  const cities = City.getCitiesOfCountry(countryCode);
  
  return {
    hasStates: states.length > 0,
    hasCities: cities.length > 0,
    statesCount: states.length,
    citiesCount: cities.length
  };
}; 