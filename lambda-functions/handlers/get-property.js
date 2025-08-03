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
  console.log('=== DÉBUT FONCTION get-property ===');
  console.log('Event reçu:', JSON.stringify(event, null, 2));
  
  try {
    // 1. Authentification
    const authResult = await requireAuth(event);
    if (!authResult.success) {
      console.log('❌ Authentification échouée');
      return responses.unauthorized();
    }
    
    console.log('✅ Authentification réussie');

    // 2. Validation de l'ID
    const propertyId = event.pathParameters?.id;
    if (!validatePropertyId(propertyId)) {
      console.log('❌ ID de propriété invalide:', propertyId);
      return responses.badRequest("ID de propriété requis");
    }
    
    console.log('✅ ID de propriété valide:', propertyId);

    // 3. Récupération de la propriété
    const dynamoItem = await getPropertyById(propertyId);
    if (!dynamoItem) {
      console.log('❌ Propriété non trouvée');
      return responses.notFound("Propriété");
    }
    
    console.log('✅ Propriété trouvée dans DynamoDB');

    // 4. Transformation des données
    const property = transformDynamoItemToProperty(dynamoItem);
    console.log('✅ Données transformées');

    // 5. Réponse de succès
    return success(200, property);

  } catch (error) {
    console.error('❌ Erreur dans get-property:', error);
    return responses.serverError(error.message);
  }
};