/**
 * Validation des données d'entrée
 */

/**
 * Valider un ID de propriété
 * @param {string} propertyId - ID à valider
 * @returns {boolean} True si valide
 */
const validatePropertyId = (propertyId) => {
    return propertyId && typeof propertyId === 'string' && propertyId.trim().length > 0;
  };
  
  /**
   * Valider les filtres de propriétés
   * @param {Object} filters - Filtres à valider
   * @returns {Object} { valid: boolean, errors: Array }
   */
  const validatePropertyFilters = (filters) => {
    const errors = [];
    
    if (filters.minPrice && (isNaN(filters.minPrice) || filters.minPrice < 0)) {
      errors.push("minPrice doit être un nombre positif");
    }
    
    if (filters.maxPrice && (isNaN(filters.maxPrice) || filters.maxPrice < 0)) {
      errors.push("maxPrice doit être un nombre positif");
    }
    
    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      errors.push("minPrice ne peut pas être supérieur à maxPrice");
    }
    
    if (filters.minBedrooms && (isNaN(filters.minBedrooms) || filters.minBedrooms < 0)) {
      errors.push("minBedrooms doit être un nombre positif");
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Valider la pagination
   * @param {Object} pagination - Pagination à valider
   * @returns {Object} Pagination validée avec valeurs par défaut
   */
  const validatePagination = (pagination = {}) => {
    const page = Math.max(1, parseInt(pagination.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pagination.limit) || 20));
    
    return { page, limit };
  };

  
  
  module.exports = {
    validatePropertyId,
    validatePropertyFilters,
    validatePagination
  };