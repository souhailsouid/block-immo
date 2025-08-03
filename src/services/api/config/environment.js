/**
 * Configuration des environnements pour les APIs
 */

const environments = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    AWS_REGION: 'eu-west-3',
    GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  staging: {
    API_BASE_URL: 'https://staging-api.block-immo.com',
    AWS_REGION: 'eu-west-3',
    GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    CACHE_TTL: 10 * 60 * 1000, // 10 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  
  production: {
    API_BASE_URL: 'https://api.block-immo.com',
    AWS_REGION: 'eu-west-3',
    GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    CACHE_TTL: 15 * 60 * 1000, // 15 minutes
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
  },
};

// Détecter l'environnement
const getEnvironment = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  return environments[nodeEnv] || environments.development;
};

// Configuration actuelle
export const config = getEnvironment();

// Constantes d'API
export const API_CONFIG = {
  BASE_URL: config.API_BASE_URL,
  TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 60000,
  MAX_RETRIES: config.RETRY_ATTEMPTS,
  RETRY_DELAY: config.RETRY_DELAY,
  CACHE_TTL: config.CACHE_TTL,
  UPLOAD_MAX_SIZE: config.UPLOAD_MAX_SIZE,
};

// Configuration AWS
export const AWS_CONFIG = {
  REGION: config.AWS_REGION,
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOLS_ID,
  USER_POOL_WEB_CLIENT_ID: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
  IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
};

// Configuration Google Maps
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: config.GOOGLE_MAPS_API_KEY,
  LIBRARIES: ['places', 'geometry'],
  VERSION: 'weekly',
};

// Validation de la configuration
export const validateConfig = () => {
  const errors = [];

  if (!API_CONFIG.BASE_URL) {
    errors.push('API_BASE_URL is required');
  }

  if (!AWS_CONFIG.USER_POOL_ID) {
    errors.push('AWS_USER_POOLS_ID is required');
  }

  if (!AWS_CONFIG.USER_POOL_WEB_CLIENT_ID) {
    errors.push('AWS_USER_POOLS_WEB_CLIENT_ID is required');
  }

  if (!GOOGLE_MAPS_CONFIG.API_KEY) {
    errors.push('GOOGLE_MAPS_API_KEY is required');
  }

  if (errors.length > 0) {
    return false;
  }

  return true;
};

// Exporter la configuration par défaut
export default config; 