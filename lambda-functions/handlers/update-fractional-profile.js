// lambda-functions/handlers/update-fractional-profile.js
const { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");
const { detectCountryCode } = require("../utils/locationUtils");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  console.log("=== START update-fractional-profile FUNCTION ===");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // 1. Authentication
    const auth = await requireAuth(event);
    if (!auth.success) return responses.unauthorized();

    // ✅ CORRECTION : Accéder aux données via auth.user
    const user = auth.user;
    const userId = user.userId;
    const userEmail = user.email;
    const username = user.username || userEmail;

    console.log("🔐 Auth info:", { userId, userEmail, username });

    // 2. Vérifier que l'utilisateur est un professionnel
    console.log("🔐 Vérification du rôle utilisateur...");
    
    try {
      const listGroupsCommand = new AdminListGroupsForUserCommand({
        Username: username,
        UserPoolId: process.env.USER_POOL_ID
      });
      
      const groupsResponse = await cognitoClient.send(listGroupsCommand);
      const userGroups = groupsResponse.Groups.map(group => group.GroupName);
      
      console.log("👥 Groupes de l'utilisateur:", userGroups);
      
      // Vérifier si l'utilisateur est professionnel ou admin
      const isProfessional = userGroups.includes('professional') || userGroups.includes('admin');
      
      if (!isProfessional) {
        console.log("❌ Accès refusé: Utilisateur non professionnel");
        return responses.unauthorized("Accès réservé aux professionnels uniquement");
      }
      
      console.log("✅ Accès autorisé: Utilisateur professionnel");
      
    } catch (cognitoError) {
      console.error("❌ Erreur lors de la vérification des groupes:", cognitoError);
      
      // Si l'erreur vient du username, essayer avec l'email
      if (cognitoError.name === 'InvalidParameterException' && userEmail && userEmail !== username) {
        console.log("🔄 Retry avec email...");
        try {
          const listGroupsCommand = new AdminListGroupsForUserCommand({
            Username: userEmail,
            UserPoolId: process.env.USER_POOL_ID
          });
          
          const groupsResponse = await cognitoClient.send(listGroupsCommand);
          const userGroups = groupsResponse.Groups.map(group => group.GroupName);
          
          console.log("👥 Groupes de l'utilisateur (email):", userGroups);
          
          const isProfessional = userGroups.includes('professional') || userGroups.includes('admin');
          
          if (!isProfessional) {
            console.log("❌ Accès refusé: Utilisateur non professionnel");
            return responses.unauthorized("Accès réservé aux professionnels uniquement");
          }
          
          console.log("✅ Accès autorisé: Utilisateur professionnel");
        } catch (retryError) {
          console.error("❌ Erreur lors du retry:", retryError);
          return responses.serverError("Erreur lors de la vérification des permissions");
        }
      } else {
        return responses.serverError("Erreur lors de la vérification des permissions");
      }
    }
    // 3. Parse request data
    let updateData;
    try {
      updateData = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
      console.error("JSON parsing error:", error);
      return responses.badRequest("Invalid request body");
    }

    console.log("�� Fractional profile data received:", updateData);

    // 4. Get existing profile
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
      console.log("✅ Existing profile found");
    } else {
      console.log("�� Profile not found, creating new profile");
    }

    // 5. Auto-detect country code for location
    const now = new Date().toISOString();
    let countryCode = null;
    
    if (updateData.officeAddress) {
      countryCode = detectCountryCode(updateData.officeAddress);
      console.log(`�� Location detected: ${updateData.officeAddress} → Country code: ${countryCode}`);
    }

    // 6. Prepare fractional profile data
    const fractionalData = {
      // Company Information
      companyName: updateData.companyName,
      companyType: updateData.companyType,
      licenseNumber: updateData.licenseNumber,
      experienceYears: updateData.experienceYears,
      
      // Business Contact
      businessPhone: updateData.businessPhone || null,
      businessEmail: updateData.businessEmail,
      website: updateData.website || null,
      officeAddress: updateData.officeAddress || null,
      officeCountryCode: countryCode,
      
      // Fractional Metrics
      totalPropertiesListed: updateData.totalPropertiesListed && updateData.totalPropertiesListed !== "" ? parseInt(updateData.totalPropertiesListed) : 0,
      activeListings: updateData.activeListings && updateData.activeListings !== "" ? parseInt(updateData.activeListings) : 0,
      averageFractionSize: updateData.averageFractionSize || null,
      averageFractionPrice: updateData.averageFractionPrice || null,
      
      // Specializations and Services
      fractionalSpecializations: updateData.fractionalSpecializations || [],
      propertyTypes: updateData.propertyTypes || [],
      serviceAreas: updateData.serviceAreas || [],
      targetMarkets: updateData.targetMarkets || [],
      investorTypes: updateData.investorTypes || [],
      salesMethods: updateData.salesMethods || [],
      paymentMethods: updateData.paymentMethods || [],
      servicesOffered: updateData.servicesOffered || [],
      
      // Metadata
      updatedAt: now,
      profileType: "FRACTIONAL_PROFESSIONAL"
    };

    // 7. Prepare DynamoDB item
    const item = {
      PK: { S: `USER#${userId}` },
      SK: { S: "PROFILE" },
      userId: { S: userId },
      role: { S: "PROFESSIONAL" },
      profileType: { S: "FRACTIONAL_PROFESSIONAL" },
      createdAt: { S: profileExists ? Item.createdAt.S : now },
      updatedAt: { S: now },
      
      // Basic user info (if not exists, use from auth)
      firstName: { S: profileExists ? Item.firstName.S : auth.firstName || "" },
      lastName: { S: profileExists ? Item.lastName.S : auth.lastName || "" },
      email: { S: profileExists ? Item.email.S : auth.email || "" },
      
      // Fractional specific data
      companyName: { S: fractionalData.companyName },
      companyType: { S: fractionalData.companyType },
      licenseNumber: { S: fractionalData.licenseNumber },
      experienceYears: { N: fractionalData.experienceYears.toString() },
      
      businessPhone: fractionalData.businessPhone ? { S: fractionalData.businessPhone } : { NULL: true },
      businessEmail: { S: fractionalData.businessEmail },
      website: fractionalData.website ? { S: fractionalData.website } : { NULL: true },
      officeAddress: fractionalData.officeAddress ? { S: fractionalData.officeAddress } : { NULL: true },
      officeCountryCode: fractionalData.officeCountryCode ? { S: fractionalData.officeCountryCode } : { NULL: true },
      
      totalPropertiesListed: { N: fractionalData.totalPropertiesListed.toString() },
      activeListings: { N: fractionalData.activeListings.toString() },
      averageFractionSize: fractionalData.averageFractionSize ? { N: fractionalData.averageFractionSize.toString() } : { NULL: true },
      averageFractionPrice: fractionalData.averageFractionPrice ? { N: fractionalData.averageFractionPrice.toString() } : { NULL: true },
      
      fractionalSpecializations: { L: fractionalData.fractionalSpecializations.map(s => ({ S: s })) },
      propertyTypes: { L: fractionalData.propertyTypes.map(p => ({ S: p })) },
      serviceAreas: { L: fractionalData.serviceAreas.map(s => ({ S: s })) },
      targetMarkets: { L: fractionalData.targetMarkets.map(t => ({ S: t })) },
      investorTypes: { L: fractionalData.investorTypes.map(i => ({ S: i })) },
      salesMethods: { L: fractionalData.salesMethods.map(s => ({ S: s })) },
      paymentMethods: { L: fractionalData.paymentMethods.map(p => ({ S: p })) },
      servicesOffered: { L: fractionalData.servicesOffered.map(s => ({ S: s })) }
    };

    // 8. Update or create profile
    if (profileExists) {
      console.log("🔄 Updating existing profile");
      
      const updateExpression = [
        "SET companyName = :companyName",
        "companyType = :companyType",
        "licenseNumber = :licenseNumber",
        "experienceYears = :experienceYears",
        "businessEmail = :businessEmail",
        "totalPropertiesListed = :totalPropertiesListed",
        "activeListings = :activeListings",
        "fractionalSpecializations = :fractionalSpecializations",
        "propertyTypes = :propertyTypes",
        "serviceAreas = :serviceAreas",
        "targetMarkets = :targetMarkets",
        "investorTypes = :investorTypes",
        "salesMethods = :salesMethods",
        "paymentMethods = :paymentMethods",
        "servicesOffered = :servicesOffered",
        "profileType = :profileType",
        "updatedAt = :updatedAt"
      ];

      const expressionAttributeValues = {
        ":companyName": { S: fractionalData.companyName },
        ":companyType": { S: fractionalData.companyType },
        ":licenseNumber": { S: fractionalData.licenseNumber },
        ":experienceYears": { N: fractionalData.experienceYears.toString() },
        ":businessEmail": { S: fractionalData.businessEmail },
        ":totalPropertiesListed": { N: fractionalData.totalPropertiesListed.toString() },
        ":activeListings": { N: fractionalData.activeListings.toString() },
        ":fractionalSpecializations": { L: fractionalData.fractionalSpecializations.map(s => ({ S: s })) },
        ":propertyTypes": { L: fractionalData.propertyTypes.map(p => ({ S: p })) },
        ":serviceAreas": { L: fractionalData.serviceAreas.map(s => ({ S: s })) },
        ":targetMarkets": { L: fractionalData.targetMarkets.map(t => ({ S: t })) },
        ":investorTypes": { L: fractionalData.investorTypes.map(i => ({ S: i })) },
        ":salesMethods": { L: fractionalData.salesMethods.map(s => ({ S: s })) },
        ":paymentMethods": { L: fractionalData.paymentMethods.map(p => ({ S: p })) },
        ":servicesOffered": { L: fractionalData.servicesOffered.map(s => ({ S: s })) },
        ":profileType": { S: "FRACTIONAL_PROFESSIONAL" },
        ":updatedAt": { S: now }
      };

      // Add optional fields if they exist
      if (fractionalData.businessPhone) {
        updateExpression.push("businessPhone = :businessPhone");
        expressionAttributeValues[":businessPhone"] = { S: fractionalData.businessPhone };
      }
      if (fractionalData.website) {
        updateExpression.push("website = :website");
        expressionAttributeValues[":website"] = { S: fractionalData.website };
      }
      if (fractionalData.officeAddress) {
        updateExpression.push("officeAddress = :officeAddress");
        expressionAttributeValues[":officeAddress"] = { S: fractionalData.officeAddress };
      }
      if (fractionalData.officeCountryCode) {
        updateExpression.push("officeCountryCode = :officeCountryCode");
        expressionAttributeValues[":officeCountryCode"] = { S: fractionalData.officeCountryCode };
      }
      if (fractionalData.averageFractionSize) {
        updateExpression.push("averageFractionSize = :averageFractionSize");
        expressionAttributeValues[":averageFractionSize"] = { N: fractionalData.averageFractionSize.toString() };
      }
      if (fractionalData.averageFractionPrice) {
        updateExpression.push("averageFractionPrice = :averageFractionPrice");
        expressionAttributeValues[":averageFractionPrice"] = { N: fractionalData.averageFractionPrice.toString() };
      }

      const updateCommand = new UpdateItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: "PROFILE" }
        },
        UpdateExpression: updateExpression.join(", "),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
      });

      const result = await client.send(updateCommand);
      console.log("✅ Profile updated successfully");
      
      return success(200, {
        success: true,
        message: "Fractional professional profile updated successfully",
        data: result.Attributes
      });

    } else {
      console.log("🆕 Creating new fractional profile");
      
      const putCommand = new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: item
      });

      await client.send(putCommand);
      console.log("✅ New fractional profile created successfully");
      
      return success(200, {
        success: true,
        message: "New fractional professional profile created successfully",
        data: item
      });
    }

  } catch (error) {
    console.error("❌ Error in update-fractional-profile:", error);
    
    if (error.name === "ValidationException") {
      return responses.badRequest("Invalid data format");
    }
    
    if (error.name === "ConditionalCheckFailedException") {
      return responses.badRequest("Profile update failed - condition not met");
    }
    
    return responses.serverError("Failed to update fractional profile");
  }
};