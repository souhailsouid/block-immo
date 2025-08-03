const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { transformDynamoItemToProperty } = require("../models/property");
const { detectCountryCode } = require("../utils/locationUtils");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION update-property-location ===");
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

    console.log("📝 Données de localisation reçues:", updateData);

    // 4. Validation des données de localisation
    const requiredFields = ["country", "city"];
    const missingFields = requiredFields.filter(field => 
      !updateData[field] || updateData[field] === "" || updateData[field] === null
    );
    
    if (missingFields.length > 0) {
      return responses.badRequest(`Champs manquants: ${missingFields.join(", ")}`);
    }

    // 5. Validation des coordonnées si fournies
    if (updateData.latitude !== undefined) {
      const latitude = parseFloat(updateData.latitude);
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        return responses.badRequest("Latitude invalide. Doit être entre -90 et 90");
      }
    }

    if (updateData.longitude !== undefined) {
      const longitude = parseFloat(updateData.longitude);
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        return responses.badRequest("Longitude invalide. Doit être entre -180 et 180");
      }
    }

    // 6. Récupération de la propriété existante
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

    // 7. Détection automatique du code pays et préparation des données
    const now = new Date().toISOString();
    let countryCode = null;
    
    // Si un pays est fourni, détecter automatiquement le code pays
    if (updateData.country) {
      countryCode = detectCountryCode(updateData.country);
      console.log(`🌍 Pays fourni: ${updateData.country} → Code pays: ${countryCode}`);
    }
    
    // Champs spécifiques au PropertyLocationForm
    const fieldsToUpdate = {
      country: updateData.country,
      countryCode: countryCode, // Ajoute le code pays détecté automatiquement
      state: updateData.state || null,
      city: updateData.city,
      address: updateData.address || null,
      latitude: updateData.latitude !== undefined ? parseFloat(updateData.latitude) : null,
      longitude: updateData.longitude !== undefined ? parseFloat(updateData.longitude) : null,
      locationDescription: updateData.locationDescription || null,
      updatedAt: now
    };

    console.log("🔧 Champs à mettre à jour:", fieldsToUpdate);
    console.log(`🌍 Code pays détecté: ${countryCode}`);

    // 8. Construction de l'expression de mise à jour
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExpression.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        
        // Gestion des types de données
        if (typeof value === "number") {
          expressionAttributeValues[attrValue] = { N: value.toString() };
        } else {
          expressionAttributeValues[attrValue] = { S: value.toString() };
        }
      }
    });

    console.log("🔧 UpdateExpression:", `SET ${updateExpression.join(", ")}`);

    // 9. Envoi de la commande Update
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

    console.log("✅ Localisation de la propriété mise à jour avec succès");

    return success(200, {
      success: true,
      message: "Property location updated successfully",
      data: updatedProperty
    });

  } catch (err) {
    console.error("❌ Erreur dans update-property-location:", err);
    return responses.serverError(err.message);
  }
}; 