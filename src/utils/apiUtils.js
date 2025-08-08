import { fetchAuthSession } from 'aws-amplify/auth';

// Configuration API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev';

/**
 * Récupérer le token d'authentification
 * @returns {Promise<string>} Token JWT
 */
export const getAuthToken = async () => {
  
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    throw new Error('Token d\'authentification non disponible');
  }

  return token;
};

/**
 * Effectuer une requête API authentifiée
 * @param {Object} options - Options de la requête
 * @returns {Promise<Object>} Réponse de l'API
 */
export const apiRequest = async (options = {}) => {
  try {
    const token = await getAuthToken();
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    // Gérer le body pour les méthodes POST/PUT
    let body = null;
    if (options.data && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase())) {
      body = JSON.stringify(options.data);
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    // Ajouter le body si présent
    if (body) {
      finalOptions.body = body;
    }

    const url = options.url || `${API_BASE_URL}${options.endpoint || ''}`;
    

    const response = await fetch(url, finalOptions);
    

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', errorText);
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Gérer le format de réponse de l'API Gateway
    if (result.body) {
      try {
        return JSON.parse(result.body);
      } catch (e) {
        return result.body;
      }
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur dans apiRequest:', error);
    throw error;
  }
};

/**
 * Construire une URL avec des paramètres de requête
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres de requête
 * @returns {string} URL complète
 */
export const buildQueryUrl = (baseUrl, params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Formater la réponse de l'API
 * @param {Object} result - Résultat de l'API
 * @returns {Object} Données formatées
 */
export const formatApiResponse = (result) => {
  return result.body ? JSON.parse(result.body) : result;
};

/**
 * Effectuer une requête API sans authentification
 * @param {string} endpoint - Endpoint de l'API
 * @param {Object} options - Options de la requête
 * @returns {Promise<Object>} Réponse de l'API
 */
export const apiRequestWithoutAuth = async (endpoint, options = {}) => {
  try {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };


    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Erreur dans apiRequestWithoutAuth:', error);
    throw error;
  }
};

export const apiRequestS3 = async (options = {}) => {
  try {
    const token = await getAuthToken();
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // ✅ Gérer le body pour les méthodes POST/PUT
    let body = null;
    let headers = { ...defaultOptions.headers };
    
    // ✅ GESTION SPÉCIALE POUR FormData
    if (options.body instanceof FormData) {
      body = options.body;
      // ✅ NE PAS définir Content-Type pour FormData - le navigateur le fait automatiquement
    } else if (options.data && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase())) {
      body = JSON.stringify(options.data);
      headers['Content-Type'] = 'application/json';
    } else if (options.body) {
      body = options.body;
      headers['Content-Type'] = 'application/json';
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    };

    // ✅ Pour FormData, s'assurer qu'on ne force pas de Content-Type
    if (options.body instanceof FormData) {
      delete finalOptions.headers['Content-Type'];
    }

    // Ajouter le body si présent
    if (body) {
      finalOptions.body = body;
    }

    const url = options.url || `${API_BASE_URL}${options.endpoint || ''}`;
    

    const response = await fetch(url, finalOptions);
  

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', errorText);
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Gérer le format de réponse de l'API Gateway
    if (result.body) {
      try {
        return JSON.parse(result.body);
      } catch (e) {
        return result.body;
      }
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur dans apiRequest:', error);
    throw error;
  }
};