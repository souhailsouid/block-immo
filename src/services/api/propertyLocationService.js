import { apiRequest, formatApiResponse } from '../../utils/apiUtils';

/**
 * Met à jour la localisation d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} locationData - Données de localisation
 * @returns {Promise<Object>} Réponse de l'API
 */
export const updatePropertyLocation = async (propertyId, locationData) => {
  try {
    const response = await apiRequest(`/properties/${propertyId}/location`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    });

    const result = formatApiResponse(response);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère la localisation d'une propriété (via get-property)
 * @param {string} propertyId - ID de la propriété
 * @returns {Promise<Object>} Données de localisation de la propriété
 */
export const getPropertyLocation = async (propertyId) => {
  try {
    const response = await apiRequest(`/properties/${propertyId}`, {
      method: 'GET'
    });
    
    const result = formatApiResponse(response);
    // Extraire les données de localisation
    return {
      country: result.country || '',
      state: result.state || '',
      city: result.city || '',
      address: result.address || '',
      latitude: result.latitude || null,
      longitude: result.longitude || null,
      locationDescription: result.locationDescription || ''
    };
  } catch (error) {
    throw error;
  }
}; 