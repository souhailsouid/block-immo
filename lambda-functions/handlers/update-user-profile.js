const { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { detectCountryCode } = require("../utils/locationUtils");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== DÉBUT FONCTION update-user-profile ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // 1. Authentification
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    const userId = auth.userId;

    // 2. Données à mettre à jour
    let updateData;
    try {
      updateData = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
      console.error("Erreur parsing JSON:", error);
      return responses.badRequest("Corps de requête invalide");
    }

    console.log("📝 Données de profil reçues:", updateData);

    // 3. Validation des champs obligatoires
    const requiredFields = ["firstName", "lastName", "email"];
    const missingFields = requiredFields.filter(field => 
      !updateData[field] || updateData[field] === "" || updateData[field] === null
    );
    
    if (missingFields.length > 0) {
      return responses.badRequest(`Champs manquants: ${missingFields.join(", ")}`);
    }

    // 4. Récupération du profil existant
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" }
      }
    });

    const { Item } = await client.send(getCommand);
    const profileExists = !!Item;
    
    if (profileExists) {
      console.log("✅ Profil existant trouvé");
    } else {
      console.log("🆕 Profil non trouvé, création d'un nouveau profil");
    }

    // 5. Détection automatique du code pays pour la localisation
    const now = new Date().toISOString();
    let countryCode = null;
    
    if (updateData.location) {
      countryCode = detectCountryCode(updateData.location);
      console.log(`🌍 Localisation détectée: ${updateData.location} → Code pays: ${countryCode}`);
    }

    // 6. Préparation des données à mettre à jour
    const fieldsToUpdate = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      gender: updateData.gender || null,
      birthDate: updateData.birthDate || null,
      phone: updateData.phone || null,
      location: updateData.location || null,
      countryCode: countryCode, // Ajoute le code pays détecté automatiquement
      languages: updateData.languages || [],
      avatar: updateData.avatar || null,
      updatedAt: now
    };

    // 7. Ajout des données spécifiques au rôle
    if (updateData.role === 'PROFESSIONAL') {
      Object.assign(fieldsToUpdate, {
        agencyName: updateData.agencyName || null,
        agencyEmail: updateData.agencyEmail || null,
        agencyPhone: updateData.agencyPhone || null,
        agencyWebsite: updateData.agencyWebsite || null,
        officeAddress: updateData.officeAddress || null,
        officeCity: updateData.officeCity || null,
        officeCountry: updateData.officeCountry || null,
        officePostalCode: updateData.officePostalCode || null,
        position: updateData.position || null,
        specializations: updateData.specializations || [],
        availabilityHours: updateData.availabilityHours || null,
        responseTime: updateData.responseTime || null,
        notes: updateData.notes || null
      });
    }

    if (updateData.role === 'INVESTOR') {
      Object.assign(fieldsToUpdate, {
        investmentPreferences: updateData.investmentPreferences || [],
        budgetRange: updateData.budgetRange || null,
        preferredLocations: updateData.preferredLocations || [],
        investmentGoals: updateData.investmentGoals || null
      });
    }

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
        if (Array.isArray(value)) {
          expressionAttributeValues[attrValue] = { L: value.map(item => ({ S: item })) };
        } else if (typeof value === "number") {
          expressionAttributeValues[attrValue] = { N: value.toString() };
        } else if (key === "avatar" && typeof value === "object") {
          // Stocker l'avatar comme JSON string
          expressionAttributeValues[attrValue] = { S: JSON.stringify(value) };
        } else {
          expressionAttributeValues[attrValue] = { S: value.toString() };
        }
      }
    });

    // 9. Envoi de la commande Update
    const updateCommand = new UpdateItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" }
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    });

    const { Attributes } = await client.send(updateCommand);

    console.log("✅ Profil utilisateur mis à jour avec succès");

    return success(200, {
      success: true,
      message: "Profil utilisateur mis à jour avec succès",
      data: {
        userId: Attributes.PK.S.replace('USER#', ''),
        firstName: Attributes.firstName?.S,
        lastName: Attributes.lastName?.S,
        email: Attributes.email?.S,
        role: Attributes.role?.S,
        updatedAt: Attributes.updatedAt?.S
      }
    });

  } catch (err) {
    console.error("❌ Erreur dans update-user-profile:", err);
    return responses.serverError(err.message);
  }
}; 