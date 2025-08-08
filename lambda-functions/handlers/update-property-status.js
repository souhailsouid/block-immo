const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
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
    const canUpdate = userGroups.includes('professional') || userGroups.includes('admin');
    if (!canUpdate) {
      
      return responses.forbidden("Accès réservé aux professionnels et administrateurs uniquement");
    }

    // 2. Extraire les données
    const propertyId = event.pathParameters?.id;
    if (!propertyId) {
      return responses.badRequest("ID de propriété requis");
    }

    let requestData;
    try {
      requestData = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
      console.error("Erreur parsing JSON:", error);
      return responses.badRequest("Corps de requête invalide");
    }

    const { status } = requestData;
    if (!status) {
      return responses.badRequest("Nouveau statut requis");
    }

    // 3. Valider le statut
    const validStatuses = ['IN_PROGRESS', 'COMMERCIALIZED', 'FUNDED'];
    if (!validStatuses.includes(status)) {
      return responses.badRequest(`Statut invalide. Statuts autorisés: ${validStatuses.join(', ')}`);
    }

    
    // 4. Vérifier que la propriété existe
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

    // 5. Vérifier que l'utilisateur peut modifier cette propriété
    if (Item.createdBy?.S !== userEmail && Item.createdByUserId?.S !== userId) {
      
      return responses.forbidden("Vous ne pouvez modifier que vos propres propriétés");
    }

    // 6. Mettre à jour le statut
    const now = new Date().toISOString();
    const updateCommand = new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      },
      UpdateExpression: "SET #status = :status, #updatedAt = :updatedAt, #updatedBy = :updatedBy",
      ExpressionAttributeNames: {
        "#status": "status",
        "#updatedAt": "updatedAt",
        "#updatedBy": "updatedBy"
      },
      ExpressionAttributeValues: {
        ":status": { S: status },
        ":updatedAt": { S: now },
        ":updatedBy": { S: userEmail }
      },
      ReturnValues: "ALL_NEW"
    });

    const { Attributes: updatedItem } = await client.send(updateCommand);
    const updatedProperty = transformDynamoItemToProperty(updatedItem);

    

    return success(200, {
      success: true,
      message: "Property status updated successfully",
      data: {
        propertyId,
        oldStatus: Item.status?.S,
        newStatus: status,
        property: updatedProperty
      }
    });

  } catch (err) {
    console.error("❌ Erreur dans update-property-status:", err);
    return responses.serverError(err.message);
  }
}; 
 