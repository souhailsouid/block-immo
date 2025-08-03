import { apiRequest, buildQueryUrl, formatApiResponse } from '../../utils/apiUtils';

/**
 * Met à jour le prix d'une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {Object} priceData - Données de prix
 * @returns {Promise<Object>} Réponse de l'API
 */
export const updatePropertyPrice = async (propertyId, priceData) => {
  try {
    console.log('🔄 Mise à jour du prix pour la propriété:', propertyId);
    console.log('📝 Données de prix:', priceData);
    
    const response = await apiRequest({
      endpoint: `/properties/${propertyId}/price`,
      method: 'PUT',
      data: priceData
    });

    const result = formatApiResponse(response);
    console.log('✅ Prix mis à jour avec succès:', result);

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
    console.log('🔍 Récupération des données de prix pour la propriété:', propertyId);

    const response = await apiRequest({
      endpoint: `/properties/${propertyId}`,
      method: 'GET'
    });
    
    const result = formatApiResponse(response);
    console.log('✅ Données de prix récupérées avec succès:', result);
    
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