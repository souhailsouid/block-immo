// Configuration de l'API Gateway
export const API_CONFIG = {
  // URL de base de l'API Gateway (mise à jour après déploiement)
  BASE_URL: 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev',
  
  // Endpoints disponibles
  ENDPOINTS: {
    // Propriétés
    PROPERTIES: '/properties',
    PROPERTY: (id) => `/properties/${id}`,
    PROPERTY_TABLE: (id) => `/properties/${id}/table`,
    PROPERTY_TIMELINE: (id) => `/properties/${id}/timeline`,
    PROPERTY_LOCATION: (id) => `/properties/${id}/location`,
    PROPERTY_PRICE: (id) => `/properties/${id}/price`,
    
    // Utilisateurs
    USER_PROFILE: '/user/profile',
    
    // Authentification
    VERIFY_ROLES: '/auth/verify-roles'
  },
  
  // Configuration des headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout des requêtes (en millisecondes)
  TIMEOUT: 30000,
  
  // Configuration CORS
  CORS: {
    credentials: 'include',
    mode: 'cors'
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction utilitaire pour ajouter les headers d'authentification
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  };
};

// Configuration pour les tests
export const TEST_CONFIG = {
  // URL de test (si différente de la production)
  TEST_BASE_URL: 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev'
};

// Export de la configuration complète
export default API_CONFIG; 