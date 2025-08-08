const { requireAuth } = require('../utils/auth');
const { getProperties } = require('../utils/dynamodb');
const { success, responses } = require('../utils/response');
const { validatePropertyFilters, validatePagination } = require('../utils/validation');
const { transformDynamoItemsToProperties } = require('../models/property');

/**
 * Handler pour récupérer la liste des propriétés
 * @param {Object} event - Event Lambda
 * @returns {Object} Réponse Lambda
 */
exports.handler = async (event) => {

  
  try {
    // 1. Authentification
    const authResult = await requireAuth(event);
    if (!authResult.success) {
      return responses.unauthorized();
    }
    

    // 2. Extraction et validation des paramètres
    let requestData = event;
    let filters = {};
    let pagination = { page: 1, limit: 20 };
    
    if (event.httpMethod === 'GET') {
      // Méthode GET - paramètres dans queryStringParameters
      const queryParams = event.queryStringParameters || {};
      
      // Extraire les filtres
      if (queryParams.city) filters.city = queryParams.city;
      if (queryParams.status) filters.status = queryParams.status;
      if (queryParams.minPrice) filters.minPrice = parseInt(queryParams.minPrice);
      if (queryParams.maxPrice) filters.maxPrice = parseInt(queryParams.maxPrice);
      if (queryParams.minBedrooms) filters.minBedrooms = parseInt(queryParams.minBedrooms);
      
      // Extraire la pagination
      if (queryParams.page) pagination.page = parseInt(queryParams.page);
      if (queryParams.limit) pagination.limit = parseInt(queryParams.limit);
    } else {
      // Méthode POST - paramètres dans le body
      if (event.body) {
        try {
          requestData = JSON.parse(event.body);
          filters = requestData.filters || {};
          pagination = requestData.pagination || { page: 1, limit: 20 };
        } catch (error) {
          requestData = event;
        }
      }
    }
    

    // 3. Validation des filtres
    const filterValidation = validatePropertyFilters(filters);
    if (!filterValidation.valid) {
      return responses.badRequest(filterValidation.errors.join(', '));
    }
    

    // 4. Validation de la pagination
    const validatedPagination = validatePagination(pagination);

    // 5. Récupération des propriétés
    const dynamoItems = await getProperties(filters, validatedPagination);

    // 6. Transformation des données
    const properties = transformDynamoItemsToProperties(dynamoItems);


    // 7. Réponse de succès
    return success(200, properties);

  } catch (error) {
    console.error('❌ Erreur dans get-properties:', error);
    return responses.serverError(error.message);
  }
};