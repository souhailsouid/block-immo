const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
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

    
    const userEmail = auth.user?.username;
    const userId = auth.user?.userId; // Ajout de l'ID utilisateur
    const userGroups = auth.user.groups || [];
    
    // Vérifier que l'utilisateur est professionnel ou admin
    const canCreate = userGroups.includes('professional') || userGroups.includes('admin');
    if (!canCreate) {
      return responses.forbidden("Accès réservé aux professionnels et administrateurs uniquement");
    }

    // 2. Données reçues
    let requestData;
    try {
      requestData = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
      console.error("Erreur parsing JSON:", error);
      return responses.badRequest("Corps de requête invalide");
    }

    const { step, data, propertyId } = requestData;
    
    if (!step) return responses.badRequest("Étape requise");
    if (!data) return responses.badRequest("Données requises");



    // 3. Logique de création/mise à jour
    let finalPropertyId = propertyId;
    let isNewProperty = false;

    if (!propertyId) {
      // 🆕 NOUVELLE PROPRIÉTÉ
      isNewProperty = true;
      finalPropertyId = `PROP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      
      // Créer la propriété avec statut DRAFT
      const now = new Date().toISOString();
      const newProperty = {
        PK: { S: `PROPERTY#${finalPropertyId}` },
        SK: { S: "METADATA" },
        propertyId: { S: finalPropertyId },
        status: { S: "IN_PROGRESS" }, // Changé de "DRAFT" à "IN_PROGRESS"
        createdBy: { S: userEmail },
        createdByUserId: { S: userId }, // Ajout de l'ID utilisateur
        createdAt: { S: now },
        updatedAt: { S: now },
        updatedBy: { S: userEmail },
        updatedByUserId: { S: userId } // Ajout de l'ID utilisateur
      };



      // Détection automatique du code pays
      let countryCode = null;
      if (data.country) {
        countryCode = detectCountryCode(data.country);
      }

      // Ajouter les données de base selon l'étape
      switch (step) {
        case 'basic':
          newProperty.title = { S: data.title || "" };
          newProperty.propertyType = { S: data.propertyType || "" };
          newProperty.description = { S: data.description || "" };
          if (data.surface) newProperty.surface = { N: data.surface.toString() };
          if (data.bedrooms) newProperty.bedrooms = { N: data.bedrooms.toString() };
          if (data.bathrooms) newProperty.bathrooms = { N: data.bathrooms.toString() };
          if (data.yearBuilt) newProperty.yearBuilt = { N: data.yearBuilt.toString() };
          if (data.energyClass) newProperty.energyClass = { S: data.energyClass };
          // Ajouter les champs de localisation
          if (data.country) newProperty.country = { S: data.country };
          if (data.state) newProperty.state = { S: data.state };
          if (data.city) newProperty.city = { S: data.city };
          if (countryCode) newProperty.countryCode = { S: countryCode };
          break;
        default:
          return responses.badRequest(`Étape ${step} non autorisée pour la création initiale`);
      }

      
      const putCommand = new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: newProperty
      });

      await client.send(putCommand);


    } else {
      // 🔄 MISE À JOUR D'UNE PROPRIÉTÉ EXISTANTE
      
      // Vérifier que la propriété existe
      const getCommand = new GetItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          PK: { S: `PROPERTY#${finalPropertyId}` },
          SK: { S: "METADATA" }
        }
      });

      const { Item } = await client.send(getCommand);
      if (!Item) return responses.notFound("Propriété non trouvée");

      // Vérifier que l'utilisateur peut modifier cette propriété
      if (Item.createdBy?.S !== userEmail && Item.createdByUserId?.S !== userId) {
        return responses.forbidden("Vous ne pouvez modifier que vos propres propriétés");
      }

      // Préparer les données à mettre à jour
      const now = new Date().toISOString();
      let fieldsToUpdate = { 
        updatedAt: { S: now },
        updatedBy: { S: userEmail }
      };

      // Déterminer le nouveau statut selon l'étape
      let newStatus = "IN_PROGRESS";
      if (step === 'contact') {
        newStatus = "COMMERCIALIZED"; // Changé de "COMPLETED" à "COMMERCIALIZED"
      }
      fieldsToUpdate.status = { S: newStatus };

      // Détection automatique du code pays pour les étapes avec localisation
      let countryCode = null;
      if (data.country && (step === 'basic' || step === 'location')) {
        countryCode = detectCountryCode(data.country);
      }

      // Ajouter les données selon l'étape
      switch (step) {
        case 'basic':
          fieldsToUpdate.title = { S: data.title || "" };
          fieldsToUpdate.propertyType = { S: data.propertyType || "" };
          fieldsToUpdate.description = { S: data.description || "" };
          if (data.surface) fieldsToUpdate.surface = { N: data.surface.toString() };
          if (data.bedrooms) fieldsToUpdate.bedrooms = { N: data.bedrooms.toString() };
          if (data.bathrooms) fieldsToUpdate.bathrooms = { N: data.bathrooms.toString() };
          if (data.yearBuilt) fieldsToUpdate.yearBuilt = { N: data.yearBuilt.toString() };
          if (data.energyClass) fieldsToUpdate.energyClass = { S: data.energyClass };
          // Ajouter les champs de localisation
          if (data.country) fieldsToUpdate.country = { S: data.country };
          if (data.state) fieldsToUpdate.state = { S: data.state };
          if (data.city) fieldsToUpdate.city = { S: data.city };
          if (countryCode) fieldsToUpdate.countryCode = { S: countryCode };
          break;

        case 'location':
          fieldsToUpdate.country = { S: data.country || "" };
          fieldsToUpdate.state = { S: data.state || "" };
          fieldsToUpdate.city = { S: data.city || "" };
          fieldsToUpdate.address = { S: data.address || "" };
          fieldsToUpdate.postalCode = { S: data.postalCode || "" };
          fieldsToUpdate.locationDescription = { S: data.locationDescription || "" };
          if (countryCode) fieldsToUpdate.countryCode = { S: countryCode };
          break;

        case 'details':
          if (data.surface) fieldsToUpdate.surface = { N: data.surface.toString() };
          if (data.bedrooms) fieldsToUpdate.bedrooms = { N: data.bedrooms.toString() };
          if (data.bathrooms) fieldsToUpdate.bathrooms = { N: data.bathrooms.toString() };
          if (data.brutYield) fieldsToUpdate.brutYield = { N: data.brutYield.toString() };
          if (data.netYield) fieldsToUpdate.netYield = { N: data.netYield.toString() };
          if (data.pricePerSquareFoot) fieldsToUpdate.pricePerSquareFoot = { N: data.pricePerSquareFoot.toString() };
          break;

        case 'pricing':
          fieldsToUpdate.pricing = { M: data };
          break;

        case 'photos':
          fieldsToUpdate.photos = { L: data.photos.map(photo => ({ S: photo })) };
          break;

        case 'timeline':
          fieldsToUpdate.timeline = { M: data };
          break;

        case 'calculator':
          fieldsToUpdate.calculator = { M: data };
          break;

        case 'contact':
          fieldsToUpdate.contact = { M: data };
          break;

        default:
          return responses.badRequest(`Étape inconnue: ${step}`);
      }

      // Construire l'expression de mise à jour
      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExpression.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = value;
      });

      const updateCommand = new UpdateItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          PK: { S: `PROPERTY#${finalPropertyId}` },
          SK: { S: "METADATA" }
        },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
      });

      await client.send(updateCommand);

    }

    // 4. Récupérer la propriété mise à jour pour la réponse
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `PROPERTY#${finalPropertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const { Item } = await client.send(getCommand);
    const updatedProperty = transformDynamoItemToProperty(Item);

    return success(200, {
      success: true,
      message: isNewProperty ? "Property created successfully" : "Property updated successfully",
      data: {
        propertyId: finalPropertyId,
        step,
        status: updatedProperty.status,
        isNewProperty,
        property: updatedProperty
      }
    });

  } catch (err) {
    console.error("❌ Erreur dans create-property:", err);
    return responses.serverError(err.message);
  }
};