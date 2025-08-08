// lambda-functions/handlers/update-property.js

const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { transformDynamoItemToProperty } = require("../models/property");
const { detectCountryCode } = require("../utils/locationUtils");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  
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
    } catch (e) {
      return responses.badRequest("Corps de requête invalide");
    }

    const requiredFields = ["title", "propertyType", "surface", "bedrooms", "bathrooms", "yearBuilt"];
    const missingFields = requiredFields.filter(field => updateData[field] === undefined || updateData[field] === null);
    if (missingFields.length > 0) return responses.badRequest(`Champs manquants: ${missingFields.join(", ")}`);

    // 4. Récupération de la propriété existante
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const { Item } = await client.send(getCommand);
    if (!Item) return responses.notFound("Propriété");

    // 5. Détection automatique du code pays et construction de l'expression de mise à jour
    const now = new Date().toISOString();
    let countryCode = null;
    
    // Si un pays est fourni, détecter automatiquement le code pays
    if (updateData.country) {
      countryCode = detectCountryCode(updateData.country);
      
    }
    
    const fieldsToUpdate = { 
      ...updateData, 
      countryCode: countryCode, // Ajoute le code pays détecté automatiquement
      updatedAt: now 
    };

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExpression.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = typeof value === "number" ? { N: value.toString() } : { S: value.toString() };
      }
    });

    // 6. Envoi de la commande Update
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

    return success(200, updatedProperty);
  } catch (err) {
    console.error("❌ Erreur dans update-property:", err);
    return responses.serverError(err.message);
  }
};
