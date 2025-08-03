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
  console.log('=== DÉBUT FONCTION get-properties ===');
  console.log('Event reçu:', JSON.stringify(event, null, 2));
  
  try {
    // 1. Authentification
    const authResult = await requireAuth(event);
    if (!authResult.success) {
      console.log('❌ Authentification échouée');
      return responses.unauthorized();
    }
    
    console.log('✅ Authentification réussie');

    // 2. Extraction et validation des paramètres
    let requestData = event;
    let filters = {};
    let pagination = { page: 1, limit: 20 };
    
    if (event.httpMethod === 'GET') {
      // Méthode GET - paramètres dans queryStringParameters
      console.log('Méthode GET détectée');
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
      console.log('Méthode POST détectée');
      if (event.body) {
        try {
          requestData = JSON.parse(event.body);
          filters = requestData.filters || {};
          pagination = requestData.pagination || { page: 1, limit: 20 };
        } catch (error) {
          console.log('Erreur parsing body:', error);
          requestData = event;
        }
      }
    }
    
    console.log('Filtres extraits:', filters);
    console.log('Pagination extraite:', pagination);

    // 3. Validation des filtres
    const filterValidation = validatePropertyFilters(filters);
    if (!filterValidation.valid) {
      console.log('❌ Filtres invalides:', filterValidation.errors);
      return responses.badRequest(filterValidation.errors.join(', '));
    }
    
    console.log('✅ Filtres validés');

    // 4. Validation de la pagination
    const validatedPagination = validatePagination(pagination);
    console.log('✅ Pagination validée:', validatedPagination);

    // 5. Récupération des propriétés
    const dynamoItems = await getProperties(filters, validatedPagination);
    console.log(`✅ ${dynamoItems.length} propriétés récupérées`);

    // 6. Transformation des données
    const properties = transformDynamoItemsToProperties(dynamoItems);
    console.log('✅ Données transformées');

    // 7. Réponse de succès
    return success(200, properties);

  } catch (error) {
    console.error('❌ Erreur dans get-properties:', error);
    return responses.serverError(error.message);
  }
};