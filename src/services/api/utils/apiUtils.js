import { DEFAULT_QUERY_PARAMS } from '../config/endpoints';

/**
 * Utilitaires pour les services API
 */

/**
 * Construire les paramètres de requête avec les valeurs par défaut
 * @param {Object} params - Paramètres personnalisés
 * @param {Object} defaults - Valeurs par défaut
 * @returns {Object} Paramètres complets
 */
export const buildQueryParams = (params = {}, defaults = DEFAULT_QUERY_PARAMS) => {
  return {
    ...defaults,
    ...params,
  };
};

/**
 * Construire une URL avec des paramètres de requête
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres de requête
 * @returns {string} URL complète
 */
export const buildUrl = (baseUrl, params = {}) => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryString = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `${baseUrl}?${queryString}`;
};

/**
 * Formater les données pour l'envoi à l'API
 * @param {Object} data - Données à formater
 * @returns {Object} Données formatées
 */
export const formatApiData = (data) => {
  if (!data) return data;

  const formatted = { ...data };

  // Supprimer les propriétés undefined/null
  Object.keys(formatted).forEach(key => {
    if (formatted[key] === undefined || formatted[key] === null) {
      delete formatted[key];
    }
  });

  return formatted;
};

/**
 * Valider les données avant envoi
 * @param {Object} data - Données à valider
 * @param {Object} schema - Schéma de validation
 * @returns {Object} Résultat de validation
 */
export const validateApiData = (data, schema) => {
  if (!schema) {
    return { isValid: true, errors: [] };
  }

  try {
    schema.validateSync(data, { abortEarly: false });
    return { isValid: true, errors: [] };
  } catch (validationError) {
    return {
      isValid: false,
      errors: validationError.errors,
    };
  }
};

/**
 * Gérer la pagination des résultats
 * @param {Array} items - Éléments de la page
 * @param {Object} pagination - Informations de pagination
 * @returns {Object} Données paginées
 */
export const formatPaginatedResponse = (items, pagination) => {
  return {
    items,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || items.length,
      totalPages: Math.ceil((pagination.total || items.length) / (pagination.limit || 20)),
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    },
  };
};

/**
 * Retry automatique pour les requêtes API
 * @param {Function} apiCall - Fonction d'appel API
 * @param {number} maxRetries - Nombre maximum de tentatives
 * @param {number} delay - Délai entre les tentatives (ms)
 * @returns {Promise} Résultat de l'appel API
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Ne pas retry pour les erreurs 4xx (sauf 429)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

/**
 * Debounce pour les appels API
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai d'attente (ms)
 * @returns {Function} Fonction debouncée
 */
export const debounceApiCall = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Cache simple pour les requêtes API
 */
export class ApiCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Récupérer une valeur du cache
   * @param {string} key - Clé de cache
   * @returns {any} Valeur en cache ou null
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Vérifier l'expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Stocker une valeur en cache
   * @param {string} key - Clé de cache
   * @param {any} value - Valeur à stocker
   * @param {number} ttl - Time to live en millisecondes
   */
  set(key, value, ttl = 5 * 60 * 1000) { // 5 minutes par défaut
    // Nettoyer le cache si nécessaire
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Supprimer une clé du cache
   * @param {string} key - Clé à supprimer
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Vider le cache
   */
  clear() {
    this.cache.clear();
  }
}

// Instance globale du cache
export const apiCache = new ApiCache();

/**
 * Wrapper pour les appels API avec cache
 * @param {string} cacheKey - Clé de cache
 * @param {Function} apiCall - Fonction d'appel API
 * @param {number} ttl - Time to live en millisecondes
 * @returns {Promise} Résultat de l'appel API
 */
export const cachedApiCall = async (cacheKey, apiCall, ttl = 5 * 60 * 1000) => {
  // Vérifier le cache
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Appel API
  const result = await apiCall();
  
  // Mettre en cache
  apiCache.set(cacheKey, result, ttl);
  
  return result;
};

/**
 * Formater les erreurs API pour l'affichage
 * @param {Error} error - Erreur API
 * @returns {string} Message d'erreur formaté
 */
export const formatApiError = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return 'Une erreur inattendue est survenue';
}; 