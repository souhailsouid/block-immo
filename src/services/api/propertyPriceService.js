import { apiRequest, buildQueryUrl, formatApiResponse } from '../../utils/apiUtils';

/**
 * Met à jour le prix d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} priceData - Données de prix
 * @returns {Promise<Object>} Réponse de l'API
 */
export const updatePropertyPrice = async (propertyId, priceData) => {
  try {  
    const response = await apiRequest({
      endpoint: `/properties/${propertyId}/price`,
      method: 'PUT',
      data: priceData
    });

    const result = formatApiResponse(response);


    return result;
  } catch (error) {
    console.error('❌ Erreur dans updatePropertyPrice:', error);
    throw error;
  }
};

/**
 * Récupère les données de prix d'une propriété (via get-property)
 * @param {string} propertyId - ID de la propriété
 * @returns {Promise<Object>} Données de prix de la propriété
 */
export const getPropertyPrice = async (propertyId) => {
  try {

    const response = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'GET'
    });
    
    const result = formatApiResponse(response);
    
    // Extraire les données de prix
    return {
      propertyPrice: result.propertyPrice || null,
        numberOfInvestors: result.numberOfInvestors || null,
      status: result.status || 'open',
      fundingDate: result.fundingDate || null,
      closingDate: result.closingDate || null,
      yearlyInvestmentReturn: result.yearlyInvestmentReturn || null,
      currency: result.currency || 'USD'
    };
  } catch (error) {
    console.error('❌ Erreur dans getPropertyPrice:', error);
    throw error;
  }
};