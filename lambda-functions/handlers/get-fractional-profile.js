// lambda-functions/handlers/get-fractional-profile.js
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { requireAuth } = require("../utils/auth");
const { responses, success } = require("../utils/response");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || "eu-west-3" });

exports.handler = async (event) => {
  
    try {
      // 1. Authentication
      const auth = await requireAuth(event);
      if (!auth.success) return responses.unauthorized();
  
      // ✅ CORRECTION : Accéder aux données via auth.user
      const user = auth.user;
      const userId = user.userId;
      const userEmail = user.email;
      const username = user.username || userEmail;
  
  
      // 2. Vérifier que l'utilisateur est un professionnel
      
      try {
        const listGroupsCommand = new AdminListGroupsForUserCommand({
          Username: username,
          UserPoolId: process.env.USER_POOL_ID
        });
        
        const groupsResponse = await cognitoClient.send(listGroupsCommand);
        const userGroups = groupsResponse.Groups.map(group => group.GroupName);
        
        
        // Vérifier si l'utilisateur est professionnel ou admin
        const isProfessional = userGroups.includes('professional') || userGroups.includes('admin');
        
        if (!isProfessional) {
          return responses.unauthorized("Accès réservé aux professionnels uniquement");
        }
        
        
      } catch (cognitoError) {
        console.error("❌ Erreur lors de la vérification des groupes:", cognitoError);
        
        // Si l'erreur vient du username, essayer avec l'email
        if (cognitoError.name === 'InvalidParameterException' && userEmail && userEmail !== username) {
          
          try {
            const listGroupsCommand = new AdminListGroupsForUserCommand({
              Username: userEmail,
              UserPoolId: process.env.USER_POOL_ID
            });
            
            const groupsResponse = await cognitoClient.send(listGroupsCommand);
            const userGroups = groupsResponse.Groups.map(group => group.GroupName);
            
            
            const isProfessional = userGroups.includes('professional') || userGroups.includes('admin');
            
            if (!isProfessional) {
              return responses.unauthorized("Accès réservé aux professionnels uniquement");
            }
            
          } catch (retryError) {
            console.error("❌ Erreur lors du retry:", retryError);
            return responses.serverError("Erreur lors de la vérification des permissions");
          }
        } else {
          return responses.serverError("Erreur lors de la vérification des permissions");
        }
      }
      
    // 2. Get user profile from DynamoDB
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" }
      }
    });

    const { Item } = await client.send(getCommand);
    
    if (!Item) {
      return responses.notFound("User profile not found");
    }


    // 3. Extract fractional profile data
    const fractionalProfile = {
      // Basic user info
      userId: Item.userId?.S,
      firstName: Item.firstName?.S,
      lastName: Item.lastName?.S,
      email: Item.email?.S,
      role: Item.role?.S,
      
      // Company information
      companyName: Item.companyName?.S,
      companyType: Item.companyType?.S,
      licenseNumber: Item.licenseNumber?.S,
      experienceYears: Item.experienceYears?.N ? parseInt(Item.experienceYears.N) : null,
      
      // Business contact
      businessPhone: Item.businessPhone?.S,
      businessEmail: Item.businessEmail?.S,
      website: Item.website?.S,
      officeAddress: Item.officeAddress?.S,
      officeCountryCode: Item.officeCountryCode?.S,
      
      // Fractional metrics
      totalPropertiesListed: Item.totalPropertiesListed?.N ? parseInt(Item.totalPropertiesListed.N) : 0,
      activeListings: Item.activeListings?.N ? parseInt(Item.activeListings.N) : 0,
      averageFractionSize: Item.averageFractionSize?.N ? parseInt(Item.averageFractionSize.N) : null,
      averageFractionPrice: Item.averageFractionPrice?.N ? parseInt(Item.averageFractionPrice.N) : null,
      
      // Specializations and services
      fractionalSpecializations: Item.fractionalSpecializations?.L ? Item.fractionalSpecializations.L.map(s => s.S) : [],
      propertyTypes: Item.propertyTypes?.L ? Item.propertyTypes.L.map(p => p.S) : [],
      serviceAreas: Item.serviceAreas?.L ? Item.serviceAreas.L.map(s => s.S) : [],
      targetMarkets: Item.targetMarkets?.L ? Item.targetMarkets.L.map(t => t.S) : [],
      investorTypes: Item.investorTypes?.L ? Item.investorTypes.L.map(i => i.S) : [],
      salesMethods: Item.salesMethods?.L ? Item.salesMethods.L.map(s => s.S) : [],
      paymentMethods: Item.paymentMethods?.L ? Item.paymentMethods.L.map(p => p.S) : [],
      servicesOffered: Item.servicesOffered?.L ? Item.servicesOffered.L.map(s => s.S) : [],
      
      // Metadata
      profileType: Item.profileType?.S,
      createdAt: Item.createdAt?.S,
      updatedAt: Item.updatedAt?.S
    };

    
    return success(200, {
      success: true,
      message: "Fractional profile retrieved successfully",
      data: fractionalProfile
    });

  } catch (error) {
    console.error("❌ Error in get-fractional-profile:", error);
    
    if (error.name === "ResourceNotFoundException") {
      return responses.notFound("User profile not found");
    }
    
    return responses.serverError("Failed to retrieve fractional profile");
  }
};