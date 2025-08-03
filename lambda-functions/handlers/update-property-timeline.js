const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { transformDynamoItemToProperty } = require("../models/property");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION update-property-timeline ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // 1. Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    // 2. ID de la propriété
    const propertyId = event.pathParameters?.id;
    if (!propertyId) return responses.badRequest("ID de propriété requis");

    // 3. Données à mettre à jour
    let updateData;
    try {
      updateData = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
      console.error("Erreur parsing JSON:", error);
      return responses.badRequest("Corps de requête invalide");
    }

    console.log("📝 Données timeline reçues:", updateData);

    // 4. Validation des données de timeline
    if (!updateData.timelineData || !Array.isArray(updateData.timelineData)) {
      return responses.badRequest("timelineData est requis et doit être un tableau");
    }

    // Validation de chaque événement de timeline
    const validStatuses = ['completed', 'pending', 'projected'];
    for (let i = 0; i < updateData.timelineData.length; i++) {
      const event = updateData.timelineData[i];
      
      if (!event.status || !validStatuses.includes(event.status)) {
        return responses.badRequest(`Statut invalide pour l'événement ${i + 1}. Doit être: ${validStatuses.join(', ')}`);
      }
      
      if (!event.title || event.title.trim() === '') {
        return responses.badRequest(`Titre requis pour l'événement ${i + 1}`);
      }
      
      if (!event.description || event.description.trim() === '') {
        return responses.badRequest(`Description requise pour l'événement ${i + 1}`);
      }
      
      if (!event.date) {
        return responses.badRequest(`Date requise pour l'événement ${i + 1}`);
      }
      
      // Validation de la date
      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) {
        return responses.badRequest(`Date invalide pour l'événement ${i + 1}`);
      }
    }

    // 5. Récupération de la propriété existante
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const { Item } = await client.send(getCommand);
    if (!Item) return responses.notFound("Propriété");

    console.log("✅ Propriété existante trouvée");

    // 6. Préparation des données de timeline à mettre à jour
    const now = new Date().toISOString();
    
    // Traitement des données de timeline
    const processedTimelineData = updateData.timelineData.map((event, index) => {
      // Configuration des couleurs selon le statut
      const statusConfig = {
        completed: { color: 'success' },
        pending: { color: 'info' },
        projected: { color: 'secondary' }
      };

      // Formatage de la date pour l'affichage
      const formatDateForDisplay = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        return d.toLocaleDateString('en-US', options);
      };

      return {
        ...event,
        color: statusConfig[event.status]?.color || 'info',
        dateTime: formatDateForDisplay(event.date),
        lastItem: index === updateData.timelineData.length - 1,
        // Conversion de la date en string pour DynamoDB
        date: new Date(event.date).toISOString()
      };
    });

    console.log("🔧 Timeline traitée:", processedTimelineData);

    // 7. Construction de l'expression de mise à jour
    const updateExpression = ["#timelineData = :timelineData", "#updatedAt = :updatedAt"];
    const expressionAttributeNames = {
      "#timelineData": "timelineData",
      "#updatedAt": "updatedAt"
    };
    const expressionAttributeValues = {
      ":timelineData": { L: processedTimelineData.map(event => ({ M: {
        status: { S: event.status },
        icon: { S: event.icon || 'event' },
        title: { S: event.title },
        date: { S: event.date },
        description: { S: event.description },
        color: { S: event.color },
        dateTime: { S: event.dateTime },
        lastItem: { BOOL: event.lastItem },
        badges: { L: (event.badges || []).map(badge => ({ S: badge })) }
      }})) },
      ":updatedAt": { S: now }
    };

    console.log("🔧 UpdateExpression:", `SET ${updateExpression.join(", ")}`);

    // 8. Envoi de la commande Update
    const updateCommand = new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    });

    const { Attributes } = await client.send(updateCommand);
    const updatedProperty = transformDynamoItemToProperty(Attributes);

    console.log("✅ Timeline de la propriété mise à jour avec succès");

    return success(200, {
      success: true,
      message: "Property timeline updated successfully",
      data: updatedProperty
    });

  } catch (err) {
    console.error("❌ Erreur dans update-property-timeline:", err);
    return responses.serverError(err.message);
  }
}; 