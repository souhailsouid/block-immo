/**
 * Property data types and validation schemas
 */

// Property financial data types
export const PROPERTY_FINANCIAL_TYPES = {
  brutYield: 'number', // Percentage (0-100)
  netYield: 'number',  // Percentage (0-100)
  pricePerSquareFoot: 'number', // Currency amount
  surface: 'number', // Square feet/meters
  yearBuilt: 'number', // Year
  bedrooms: 'number', // Count
  bathrooms: 'number', // Count
};

// Property location data types
export const PROPERTY_LOCATION_TYPES = {
  country: 'string',
  state: 'string',
  city: 'string',
  countryCode: 'string', // ISO 3166-1 alpha-2
};

// Property basic info types
export const PROPERTY_BASIC_TYPES = {
  title: 'string',
  propertyType: 'string', // 'Villa', 'Apartment', 'House', etc.
  status: 'string', // 'Available', 'Sold', 'Under Contract', etc.
  energyClass: 'string', // 'A', 'B', 'C', etc.
};

// Complete property data structure
export const PROPERTY_DATA_STRUCTURE = {
  ...PROPERTY_BASIC_TYPES,
  ...PROPERTY_LOCATION_TYPES,
  ...PROPERTY_FINANCIAL_TYPES,
};

// Validation ranges for numeric fields
export const VALIDATION_RANGES = {
  brutYield: { min: 0, max: 100 },
  netYield: { min: 0, max: 100 },
  pricePerSquareFoot: { min: 0, max: 100000 },
  surface: { min: 1, max: 100000 },
  yearBuilt: { min: 1800, max: new Date().getFullYear() },
  bedrooms: { min: 0, max: 20 },
  bathrooms: { min: 0, max: 20 },
};

// Helper functions for type conversion
export const convertToNumber = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  const parsed = parseFloat(value);
  return isNaN(parsed) ? '' : parsed;
};

export const convertToString = (value) => {
  return value?.toString() || '';
};

export const formatPercentage = (value) => {
  const num = convertToNumber(value);
  return num === '' ? '' : `${num}%`;
};

export const formatCurrencyValue = (value, currency = 'USD') => {
  const num = convertToNumber(value);
  return num === '' ? '' : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(num);
}; 