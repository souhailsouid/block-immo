const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { transformDynamoItemToProperty } = require("../models/property");
const { getCurrencyFromCountry, isValidCurrency } = require("../utils/currencyUtils");
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
    } catch (error) {
      console.error("Erreur parsing JSON:", error);
      return responses.badRequest("Corps de requête invalide");
    }

    
    // 4. Validation des données de prix
    const requiredFields = ["propertyPrice", "status"];
    const missingFields = requiredFields.filter(field => 
      !updateData[field] || updateData[field] === "" || updateData[field] === null
    );
    
    if (missingFields.length > 0) {
      return responses.badRequest(`Champs manquants: ${missingFields.join(", ")}`);
    }

    // 5. Détection automatique du code pays et gestion de la devise
    let currency = updateData.currency;
    let countryCode = null;
    
    // Si un pays est fourni, détecter automatiquement le code pays
    if (updateData.country) {
      countryCode = detectCountryCode(updateData.country);
      
    }
    
    // Si pas de devise fournie mais un code pays est détecté, déterminer automatiquement la devise
    if (!currency && countryCode) {
      currency = getCurrencyFromCountry(countryCode);
      
      if (!currency) {
        currency = 'USD'; // Devise par défaut
      }
    }
    
    // Si toujours pas de devise, utiliser USD par défaut
    if (!currency) {
      currency = 'USD';
    }
    
    // Validation de la devise
    if (!isValidCurrency(currency)) {
      return responses.badRequest(`Devise non supportée: ${currency}`);
    }

    // 6. Validation des valeurs numériques
    if (updateData.propertyPrice !== undefined) {
      const propertyPrice = parseFloat(updateData.propertyPrice);
      if (isNaN(propertyPrice) || propertyPrice <= 0) {
        return responses.badRequest("Le prix de la propriété doit être supérieur à 0");
      }
    }



    if (updateData.yearlyInvestmentReturn !== undefined) {
      const yearlyInvestmentReturn = parseFloat(updateData.yearlyInvestmentReturn);
      if (isNaN(yearlyInvestmentReturn) || yearlyInvestmentReturn < 0) {
        return responses.badRequest("Le rendement annuel doit être positif");
      }
    }



    // 7. Validation des dates
    if (updateData.fundingDate && updateData.closingDate) {
      const fundingDate = new Date(updateData.fundingDate);
      const closingDate = new Date(updateData.closingDate);
      
      if (fundingDate > closingDate) {
        return responses.badRequest("La date de financement ne peut pas être après la date de clôture");
      }
    }

    // 8. Récupération de la propriété existante
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const { Item } = await client.send(getCommand);
    if (!Item) return responses.notFound("Propriété");

      

    // 9. Préparation des données de prix à mettre à jour
    const now = new Date().toISOString();
    
    // Champs spécifiques au PropertyPriceForm
    const fieldsToUpdate = {
      propertyPrice: updateData.propertyPrice !== undefined ? parseFloat(updateData.propertyPrice) : null,
      status: updateData.status || null,
      fundingDate: updateData.fundingDate ? new Date(updateData.fundingDate).toISOString() : null,
      closingDate: updateData.closingDate ? new Date(updateData.closingDate).toISOString() : null,
      yearlyInvestmentReturn: updateData.yearlyInvestmentReturn !== undefined ? parseFloat(updateData.yearlyInvestmentReturn) : null,
      currency: currency, // Utilise la devise déterminée automatiquement
      countryCode: countryCode, // Ajoute le code pays détecté automatiquement
      updatedAt: now
    };

    

    // 10. Construction de l'expression de mise à jour
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



    // 11. Envoi de la commande Update
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

    

    return success(200, {
      success: true,
      message: "Property price updated successfully",
      data: updatedProperty
    });

  } catch (err) {
    console.error("❌ Erreur dans update-property-price:", err);
    return responses.serverError(err.message);
  }
}; 