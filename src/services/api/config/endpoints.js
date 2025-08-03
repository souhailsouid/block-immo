// Configuration des endpoints API
const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Utilisateurs
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    NOTIFICATIONS: '/users/notifications',
    SETTINGS: '/users/settings',
    UPLOAD_AVATAR: '/users/avatar',
  },

  // Propriétés
  PROPERTIES: {
    LIST: '/properties',
    DETAIL: (id) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
    SEARCH: '/properties/search',
    FILTER: '/properties/filter',
    UPLOAD_PHOTOS: (id) => `/properties/${id}/photos`,
    DELETE_PHOTO: (propertyId, photoId) => `/properties/${propertyId}/photos/${photoId}`,
    LOCATION: (id) => `/properties/${id}/location`,
    CALCULATOR: (id) => `/properties/${id}/calculator`,
  },

  // Investissements
  INVESTMENTS: {
    PORTFOLIO: '/investments/portfolio',
    BUY_SHARES: '/investments/buy-shares',
    SELL_SHARES: '/investments/sell-shares',
    TRANSACTIONS: '/investments/transactions',
    RECENT_TRANSACTIONS: '/investments/transactions/recent',
    TRANSACTION_DETAIL: (id) => `/investments/transactions/${id}`,
    CALCULATOR: '/investments/calculator',
    PERFORMANCE: '/investments/performance',
    DIVIDENDS: '/investments/dividends',
  },

  // KYC (Know Your Customer)
  KYC: {
    SUBMIT: '/kyc/submit',
    STATUS: '/kyc/status',
    DOCUMENTS: '/kyc/documents',
    UPLOAD_DOCUMENT: '/kyc/documents/upload',
    VERIFY: '/kyc/verify',
  },

  // Uploads
  UPLOADS: {
    IMAGES: '/uploads/images',
    DOCUMENTS: '/uploads/documents',
    AVATAR: '/uploads/avatar',
  },

  // Géolocalisation
  GEO: {
    SEARCH: '/geo/search',
    REVERSE: '/geo/reverse',
    SUGGESTIONS: '/geo/suggestions',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    SETTINGS: '/notifications/settings',
  },

  // Analytics et Rapports
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PROPERTY_PERFORMANCE: '/analytics/property-performance',
    PORTFOLIO_ANALYSIS: '/analytics/portfolio',
    MARKET_TRENDS: '/analytics/market-trends',
  },
};

// Configuration des paramètres de requête par défaut
export const DEFAULT_QUERY_PARAMS = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Configuration des timeouts par endpoint
export const ENDPOINT_TIMEOUTS = {
  UPLOAD: 60000, // 60 secondes pour les uploads
  SEARCH: 10000, // 10 secondes pour les recherches
  CALCULATOR: 15000, // 15 secondes pour les calculs
  DEFAULT: 30000, // 30 secondes par défaut
};

export default API_ENDPOINTS; 