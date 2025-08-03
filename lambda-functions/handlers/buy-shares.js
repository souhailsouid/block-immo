const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const InvestmentModel = require('../models/investment');
const TransactionModel = require('../models/transaction');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-3' });
const dynamodb = DynamoDBDocumentClient.from(client);

const PROPERTIES_TABLE = process.env.DYNAMODB_TABLE || 'real_estate_app';
const INVESTMENTS_TABLE = process.env.INVESTMENTS_TABLE || 'block-immo-api-investments-dev';
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || 'block-immo-api-transactions-dev';

/**
 * Lambda pour acheter des parts d'une propriété
 */
exports.handler = async (event) => {
  try {
    console.log('🔄 Buy shares event:', JSON.stringify(event, null, 2));

    // Vérifier la méthode HTTP
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parser le body
    const requestBody = JSON.parse(event.body);
    console.log('🔍 Received request body:', requestBody);
    const {
      propertyId,
      userId,
      investment,
      blocks,
      ownershipPercentage,
      returnRate = 7,
      currency = 'EUR',
      paymentMethod = 'BANK_TRANSFER',
      propertyTitle,
      propertyLocation,
      propertyImage
    } = requestBody;

    // Validation des données
    console.log('🔍 Validation check:', { propertyId, userId, investment, blocks });
    
    const missingFields = [];
    if (!propertyId) missingFields.push('propertyId');
    if (!userId) missingFields.push('userId');
    if (!investment || investment <= 0) missingFields.push('investment');
    if (!blocks || blocks <= 0) missingFields.push('blocks');
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ 
          error: `Missing or invalid required fields: ${missingFields.join(', ')}`,
          receivedData: { propertyId, userId, investment, blocks }
        })
      };
    }

    // Vérifier que la propriété existe
    const propertyParams = {
      TableName: PROPERTIES_TABLE,
      Key: {
        PK: `PROPERTY#${propertyId}`,
        SK: 'METADATA'
      }
    };

    const propertyResult = await dynamodb.send(new GetCommand(propertyParams));
    if (!propertyResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Property not found' })
      };
    }

    const property = propertyResult.Item;

    // Vérifier que la propriété est disponible pour l'investissement
    if (property.status !== 'COMMERCIALIZED' && property.status !== 'ACTIVE') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Property is not available for investment' })
      };
    }

    // Générer les IDs
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const investmentId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculer les retours estimés
    const yearlyReturn = (investment * returnRate) / 100;
    const monthlyReturn = yearlyReturn / 12;
    const quarterlyReturn = yearlyReturn / 4;

    // Créer l'investissement avec le modèle
    const investmentData = {
      investmentId,
      propertyId,
      userId,
      investment,
      blocks,
      ownershipPercentage,
      returnRate,
      estimatedYearlyReturn: yearlyReturn,
      estimatedMonthlyReturn: monthlyReturn,
      estimatedQuarterlyReturn: quarterlyReturn,
      currency,
      status: 'ACTIVE',
      propertyTitle: propertyTitle || property.title || property.propertyTitle,
      propertyLocation: propertyLocation || property.location || property.city,
      propertyImage: propertyImage || property.images?.[0] || '/src/assets/images/products/product-1-min.jpg',
    };

    // Créer la transaction avec le modèle
    const transactionData = {
      transactionId,
      investmentId,
      propertyId,
      userId,
      amount: investment,
      blocks,
      type: 'PURCHASE',
      status: 'CONFIRMED',
      currency,
      paymentMethod,
      returnRate,
      propertyTitle: propertyTitle || property.title || property.propertyTitle,
      propertyLocation: propertyLocation || property.location || property.city,
    };

    // Sauvegarder l'investissement et la transaction en parallèle
    const [investmentResult, transactionResult] = await Promise.all([
      InvestmentModel.create(investmentData),
      TransactionModel.create(transactionData)
    ]);

    console.log('✅ Investment and transaction created successfully:', {
      investmentId,
      transactionId
    });

    // Retourner la réponse
    const response = {
      success: true,
      data: {
        transactionId,
        investmentId,
        propertyId,
        blocks,
        investment,
        ownershipPercentage,
        status: 'CONFIRMED',
        timestamp: new Date().toISOString(),
        estimatedReturnYear: yearlyReturn,
        estimatedReturnQuarter: quarterlyReturn,
        estimatedReturnMonth: monthlyReturn,
        returnRate: returnRate,
        currency: currency,
        paymentMethod: paymentMethod,
        transactionType: 'PURCHASE',
        propertyTitle: investmentResult.propertyTitle,
        propertyLocation: investmentResult.propertyLocation,
        propertyImage: investmentResult.propertyImage,
      },
      message: 'Investment successful!'
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('❌ Error in buy-shares:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}; 