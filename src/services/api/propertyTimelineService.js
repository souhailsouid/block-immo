
import { apiRequest, buildQueryUrl, formatApiResponse } from '../../utils/apiUtils';
/**
 * Met à jour la timeline d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} timelineData - Données de la timeline
 * @returns {Promise<Object>} Réponse de l'API
 */
export const updatePropertyTimeline = async (propertyId, timelineData) => {
  try {
    const response = await apiRequest(`/properties/${propertyId}/timeline`, {
      method: 'PUT',
      body: JSON.stringify({ timelineData })
    });

    const result = formatApiResponse(response);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère la timeline d'une propriété (via get-property)
 * @param {string} propertyId - ID de la propriété
 * @returns {Promise<Object>} Données de la propriété incluant la timeline
 */
export const getPropertyTimeline = async (propertyId) => {
  try {
    const response = await apiRequest(`/properties/${propertyId}`, {
      method: 'GET'
    });
    
    const result = formatApiResponse(response);
    return result.timelineData || [];
  } catch (error) {
    throw error;
  }
}; 