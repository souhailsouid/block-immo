const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-3" });
const TABLE_NAME = "real_estate_app";

/**
 * Récupérer une propriété par ID
 * @param {string} propertyId - ID de la propriété
 * @returns {Object|null} Propriété ou null si non trouvée
 */
const getPropertyById = async (propertyId) => {
  try {
    
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: { S: `PROPERTY#${propertyId}` },
        SK: { S: "METADATA" }
      }
    });

    const result = await client.send(command);
    
    if (!result.Item) {
      return null;
    }

    return result.Item;
    
  } catch (error) {
    console.error('❌ Erreur DynamoDB getPropertyById:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les propriétés avec filtres
 * @param {Object} filters - Filtres à appliquer
 * @param {Object} pagination - Paramètres de pagination
 * @returns {Array} Liste des propriétés
 */
const getProperties = async (filters = {}, pagination = { page: 1, limit: 20 }) => {
  try {
     
    
    const { page = 1, limit = 20 } = pagination;
    
    // Construire l'expression de filtrage
    let filterExpression = "SK = :sk";
    let expressionAttributeValues = {
      ":sk": { S: "METADATA" }
    };

    // Ajouter des filtres supplémentaires
    if (filters.city) {
      filterExpression += " AND city = :city";
      expressionAttributeValues[":city"] = { S: filters.city };
    }

    let expressionAttributeNames = {};
    if (filters.status) {
      filterExpression += " AND #status = :status";
      expressionAttributeValues[":status"] = { S: filters.status };
      expressionAttributeNames["#status"] = "status";
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        filterExpression += " AND price >= :minPrice";
        expressionAttributeValues[":minPrice"] = { N: filters.minPrice.toString() };
      }
      if (filters.maxPrice) {
        filterExpression += " AND price <= :maxPrice";
        expressionAttributeValues[":maxPrice"] = { N: filters.maxPrice.toString() };
      }
    }

    if (filters.minBedrooms) {
      filterExpression += " AND bedrooms >= :minBedrooms";
      expressionAttributeValues[":minBedrooms"] = { N: filters.minBedrooms.toString() };
    }

    const commandParams = {
      TableName: TABLE_NAME,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit,
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
      commandParams.ExpressionAttributeNames = expressionAttributeNames;
    }

    const command = new ScanCommand(commandParams);
    const data = await client.send(command);

      
    return data.Items;
    
  } catch (error) {
    console.error('❌ Erreur DynamoDB getProperties:', error);
    throw error;
  }
};

const buildUpdateExpression = (fields) => {
  const updateExpression = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) {
      const nameKey = `#${key}`;
      const valueKey = `:${key}`;

      updateExpression.push(`${nameKey} = ${valueKey}`);
      ExpressionAttributeNames[nameKey] = key;

      ExpressionAttributeValues[valueKey] = typeof value === 'number'
        ? { N: value.toString() }
        : { S: value.toString() };
    }
  }

  return {
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };
}

module.exports = {
  getPropertyById,
  getProperties,
  client,
  TABLE_NAME,
  buildUpdateExpression
};