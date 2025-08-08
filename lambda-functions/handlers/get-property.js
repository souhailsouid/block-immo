const { requireAuth } = require('../utils/auth');
const { getPropertyById } = require('../utils/dynamodb');
const { success, responses } = require('../utils/response');
const { validatePropertyId } = require('../utils/validation');
const { transformDynamoItemToProperty } = require('../models/property');

/**
 * Handler pour récupérer une propriété spécifique
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

    // 2. Validation de l'ID
    const propertyId = event.pathParameters?.id;
    if (!validatePropertyId(propertyId)) {
      
      return responses.badRequest("ID de propriété requis");
    }
    
    
    // 3. Récupération de la propriété
    const dynamoItem = await getPropertyById(propertyId);
    if (!dynamoItem) {
      
      return responses.notFound("Propriété");
    }
    
    
    // 4. Transformation des données
    const property = transformDynamoItemToProperty(dynamoItem);
    
    // 5. Réponse de succès
    return success(200, property);

  } catch (error) {
    console.error('❌ Erreur dans get-property:', error);
    return responses.serverError(error.message);
  }
};