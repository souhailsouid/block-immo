import { apiRequest, formatApiResponse } from 'utils/apiUtils';

/**
 * Créer ou mettre à jour une propriété par étape
 * @param {Object} params - Paramètres de la requête
 * @param {string} params.step - Étape de création/mise à jour (basic, location, details, pricing, photos, timeline, calculator, contact)
 * @param {Object} params.data - Données de l'étape
 * @param {string} [params.propertyId] - ID de la propriété (optionnel pour la première étape)
 * @returns {Promise<Object>} Propriété créée ou mise à jour
 */
export const createOrUpdateProperty = async ({ step, data, propertyId = null }) => {
  try {
    const requestData = {
      step,
      data,
      ...(propertyId && { propertyId })
    };

    // Si on a un propertyId, utiliser PUT pour mettre à jour
    // Sinon, utiliser POST pour créer
    const method = propertyId ? 'PUT' : 'POST';
    const endpoint = propertyId ? `/properties/${propertyId}` : '/properties';

    const result = await apiRequest({
      endpoint,
      method,
      data: requestData
    });
    
    const response = formatApiResponse(result);

    return response;
  } catch (error) {
    console.error('❌ Erreur dans createOrUpdateProperty:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les propriétés
 * @param {Object} filters - Filtres pour la recherche
 * @param {Object} pagination - Paramètres de pagination
 * @returns {Promise<Array>} Liste des propriétés
 */
export const getProperties = async (filters = {}, pagination = {}) => {
  try {
    
    // Construire les paramètres de requête
    const params = new URLSearchParams();
    
    // Ajouter les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    // Ajouter la pagination
    if (pagination.page) params.append('page', pagination.page);
    if (pagination.limit) params.append('limit', pagination.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    const result = await apiRequest({
      endpoint,
      method: 'GET'
    });
    const properties = formatApiResponse(result);
    return properties;
  } catch (error) {
    console.error('❌ Erreur dans getProperties:', error);
    throw error;
  }
};

/**
 * Récupérer les détails d'une propriété spécifique par ID
 * @param {string|number} propertyId - ID de la propriété
 * @returns {Promise<Object>} Détails de la propriété
 */
export const getPropertyDetails = async (propertyId) => {
  try {

    const result = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'GET'
    });

    const propertyDetails = formatApiResponse(result);

    return propertyDetails;

  } catch (error) {
    console.error('❌ Erreur dans getPropertyDetails:', error);
    throw error;
  }
};

/**
 * Récupérer une propriété spécifique
 * @param {string} propertyId - ID de la propriété
 * @returns {Promise<Object>} Propriété
 */
export const getProperty = async (propertyId) => {
  try {

    const result = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'GET'
    });
    const property = formatApiResponse(result);
    return property;
  } catch (error) {
    console.error('❌ Erreur dans getProperty:', error);
    throw error;
  }
};

/**
 * Mettre à jour une propriété complète
 * @param {string} propertyId - ID de la propriété
 * @param {Object} propertyData - Données complètes de la propriété
 * @returns {Promise<Object>} Propriété mise à jour
 */
export const updateProperty = async (propertyId, propertyData) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'PUT',
      data: propertyData
    });
    const updatedProperty = formatApiResponse(result);
    return updatedProperty;
  } catch (error) {
    console.error('❌ Erreur dans updateProperty:', error);
    throw error;
  }
};

/**
 * Mettre à jour la localisation d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} locationData - Données de localisation
 * @returns {Promise<Object>} Propriété mise à jour
 */
export const updatePropertyLocation = async (propertyId, locationData) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/location`,
      method: 'PUT',
      data: locationData
    });
    const updatedProperty = formatApiResponse(result);
    return updatedProperty;
  } catch (error) {
    console.error('❌ Erreur dans updatePropertyLocation:', error);
    throw error;
  }
};

/**
 * Mettre à jour les détails de la table d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} tableData - Données de la table
 * @returns {Promise<Object>} Propriété mise à jour
 */
export const updatePropertyTable = async (propertyId, tableData) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/table`,
      method: 'PUT',
      data: tableData
    });
    const updatedProperty = formatApiResponse(result);
    return updatedProperty;
  } catch (error) {
    console.error('❌ Erreur dans updatePropertyTable:', error);
    throw error;
  }
};

/**
 * Mettre à jour la timeline d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} timelineData - Données de la timeline
 * @returns {Promise<Object>} Propriété mise à jour
 */
export const updatePropertyTimeline = async (propertyId, timelineData) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/timeline`,
      method: 'PUT',
      data: timelineData
    });
    const updatedProperty = formatApiResponse(result);
    return updatedProperty;
  } catch (error) {
    console.error('❌ Erreur dans updatePropertyTimeline:', error);
    throw error;
  }
};

/**
 * Récupérer les photos d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @returns {Promise<Array>} Liste des photos
 */
export const getPropertyPhotos = async (propertyId) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/photos`,
      method: 'GET'
    });
    const photos = formatApiResponse(result);
    return photos;
  } catch (error) {
    console.error('❌ Erreur dans getPropertyPhotos:', error);
    throw error;
  }
};

/**
 * Gérer les photos d'une propriété (ajout, suppression, réorganisation)
 * @param {string} propertyId - ID de la propriété
 * @param {Object} photoData - Données des photos
 * @returns {Promise<Object>} Résultat de la gestion
 */
export const managePropertyPhotos = async (propertyId, photoData) => {
  try {
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/photos/manage`,
      method: 'PUT',
      data: photoData
    });
    const response = formatApiResponse(result);
    return response;
  } catch (error) {
    console.error('❌ Erreur dans managePropertyPhotos:', error);
    throw error;
  }
};

export const updatePropertyStatus = async (propertyId, newStatus) => {
  try {

    const result = await apiRequest({
      endpoint: `/properties/${propertyId}/status`,
      method: 'PUT',
      data: { status: newStatus }
    });

    const response = formatApiResponse(result);
    return response;
  } catch (error) {
    console.error('❌ Erreur dans updatePropertyStatus:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    
    const result = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'DELETE'
    });
    
    const response = formatApiResponse(result);
    return response;
  } catch (error) {
    console.error('❌ Erreur dans deleteProperty:', error);
    throw error;
  }
};

// Export de tous les services pour maintenir la compatibilité
export const propertyServices = {
  updateProperty,
  updatePropertyLocation,
  updatePropertyTable,
  updatePropertyTimeline,
  managePropertyPhotos,
};