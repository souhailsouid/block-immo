/**
 * Configuration pour les fonctions Lambda AWS
 */

// Noms des fonctions Lambda par environnement
const LAMBDA_FUNCTIONS = {
  development: {
    GET_PROPERTIES: 'get-properties-dev',
    CREATE_PROPERTY: 'create-property-dev',
    UPDATE_PROPERTY: 'update-property-dev',
    DELETE_PROPERTY: 'delete-property-dev',
    GET_PROPERTY: 'get-property-dev',
    SEARCH_PROPERTIES: 'search-properties-dev',
    GET_USER_PROPERTIES: 'get-user-properties-dev',
    GET_PROPERTY_STATS: 'get-property-stats-dev',
    UPLOAD_PROPERTY_IMAGES: 'upload-property-images-dev',
    DELETE_PROPERTY_IMAGE: 'delete-property-image-dev',
    BUY_SHARES: 'buy-shares-dev',
    SELL_SHARES: 'sell-shares-dev',
    GET_PORTFOLIO: 'get-portfolio-dev',
    GET_TRANSACTIONS: 'get-transactions-dev',
  },
  
  staging: {
    GET_PROPERTIES: 'get-properties-staging',
    CREATE_PROPERTY: 'create-property-staging',
    UPDATE_PROPERTY: 'update-property-staging',
    DELETE_PROPERTY: 'delete-property-staging',
    GET_PROPERTY: 'get-property-staging',
    SEARCH_PROPERTIES: 'search-properties-staging',
    GET_USER_PROPERTIES: 'get-user-properties-staging',
    GET_PROPERTY_STATS: 'get-property-stats-staging',
    UPLOAD_PROPERTY_IMAGES: 'upload-property-images-staging',
    DELETE_PROPERTY_IMAGE: 'delete-property-image-staging',
    BUY_SHARES: 'buy-shares-staging',
    SELL_SHARES: 'sell-shares-staging',
    GET_PORTFOLIO: 'get-portfolio-staging',
    GET_TRANSACTIONS: 'get-transactions-staging',
  },
  
  production: {
    GET_PROPERTIES: 'get-properties-prod',
    CREATE_PROPERTY: 'create-property-prod',
    UPDATE_PROPERTY: 'update-property-prod',
    DELETE_PROPERTY: 'delete-property-prod',
    GET_PROPERTY: 'get-property-prod',
    SEARCH_PROPERTIES: 'search-properties-prod',
    GET_USER_PROPERTIES: 'get-user-properties-prod',
    GET_PROPERTY_STATS: 'get-property-stats-prod',
    UPLOAD_PROPERTY_IMAGES: 'upload-property-images-prod',
    DELETE_PROPERTY_IMAGE: 'delete-property-image-prod',
    BUY_SHARES: 'buy-shares-prod',
    SELL_SHARES: 'sell-shares-prod',
    GET_PORTFOLIO: 'get-portfolio-prod',
    GET_TRANSACTIONS: 'get-transactions-prod',
  },
};

// Détecter l'environnement
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Configuration actuelle
export const LAMBDA_CONFIG = {
  REGION: process.env.REACT_APP_AWS_REGION || 'eu-west-1',
  FUNCTIONS: LAMBDA_FUNCTIONS[getEnvironment()],
  TIMEOUT: 30000, // 30 secondes
  MAX_PAYLOAD_SIZE: 6 * 1024 * 1024, // 6MB (limite Lambda)
};

// Fonction utilitaire pour obtenir le nom d'une fonction Lambda
export const getLambdaFunctionName = (functionKey) => {
  return LAMBDA_CONFIG.FUNCTIONS[functionKey] || functionKey;
};

// Configuration des variables d'environnement requises
export const REQUIRED_ENV_VARS = {
  AWS_REGION: process.env.REACT_APP_AWS_REGION,
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOLS_ID,
  CLIENT_ID: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
};

// Validation de la configuration Lambda
export const validateLambdaConfig = () => {
  const errors = [];

  if (!REQUIRED_ENV_VARS.AWS_REGION) {
    errors.push('REACT_APP_AWS_REGION is required');
  }

  if (!REQUIRED_ENV_VARS.USER_POOL_ID) {
    errors.push('REACT_APP_AWS_USER_POOLS_ID is required');
  }

  if (!REQUIRED_ENV_VARS.CLIENT_ID) {
    errors.push('REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID is required');
  }

  if (errors.length > 0) {
    return false;
  }

  return true;
};
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default LAMBDA_CONFIG; 