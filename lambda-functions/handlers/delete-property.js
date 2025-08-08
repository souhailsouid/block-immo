const { DynamoDBClient, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { transformDynamoItemToProperty } = require("../models/property");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {

  try {
    // 1. Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    
    const userEmail = auth.user?.username;
    const userId = auth.user?.userId;
    const userGroups = auth.user.groups || [];
    
    // Vérifier que l'utilisateur est professionnel ou admin
    const canDelete = userGroups.includes('professional') || userGroups.includes('admin');
    if (!canDelete) {
      return responses.forbidden("Accès réservé aux professionnels et administrateurs uniquement");
    }

    // 2. Récupérer l'ID de la propriété depuis les paramètres de route
    const propertyId = event.pathParameters?.id;
    if (!propertyId) {
      return responses.badRequest("ID de propriété requis");
    }

    // 3. Vérifier que la propriété existe et récupérer ses informations
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const { Item } = await client.send(getCommand);
    if (!Item) {
      return responses.notFound("Propriété non trouvée");
    }


    // 4. Vérifier que l'utilisateur peut supprimer cette propriété
    const propertyCreatedBy = Item.createdBy?.S;
    const propertyCreatedByUserId = Item.createdByUserId?.S;
    

    // L'utilisateur peut supprimer s'il est le créateur ou s'il est admin
    const isOwner = (propertyCreatedBy === userEmail) || (propertyCreatedByUserId === userId);
    const isAdmin = userGroups.includes('admin');

    if (!isOwner && !isAdmin) {
      return responses.forbidden("Vous ne pouvez supprimer que vos propres propriétés");
    }


    // 5. Supprimer la propriété
    const deleteCommand = new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      },
      ReturnValues: "ALL_OLD"
    });

    const { Attributes: deletedProperty } = await client.send(deleteCommand);
    const transformedProperty = transformDynamoItemToProperty(deletedProperty);



    return success(200, {
      success: true,
      message: "Property deleted successfully",
      data: {
        propertyId: propertyId,
        deletedProperty: transformedProperty
      }
    });

  } catch (err) {
    console.error("❌ Erreur dans delete-property:", err);
    return responses.serverError(err.message);
  }
}; 
 