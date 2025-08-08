const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-3' });
const dynamodb = DynamoDBDocumentClient.from(client);

const INVESTMENTS_TABLE = process.env.INVESTMENTS_TABLE || 'investments-table';

/**
 * Modèle pour les investissements
 */
class InvestmentModel {
  /**
   * Créer un nouvel investissement
   * @param {Object} investmentData - Données de l'investissement
   * @returns {Promise<Object>} Investissement créé
   */
  static async create(investmentData) {
    const {
      investmentId,
      propertyId,
      userId,
      investment,
      blocks,
      ownershipPercentage,
      returnRate,
      estimatedYearlyReturn,
      estimatedMonthlyReturn,
      estimatedQuarterlyReturn,
      currency,
      status = 'ACTIVE',
      propertyTitle,
      propertyLocation,
      propertyImage
    } = investmentData;

    const timestamp = new Date().toISOString();
    
    const item = {
      // Clés primaires
      PK: `USER#${userId}`,
      SK: `INVESTMENT#${investmentId}`,
      
      // Données de l'investissement
      investmentId,
      propertyId,
      userId,
      investment,
      blocks,
      ownershipPercentage,
      returnRate,
      estimatedYearlyReturn,
      estimatedMonthlyReturn,
      estimatedQuarterlyReturn,
      currency,
      status,
      
      // Données de la propriété (pour éviter les jointures)
      propertyTitle,
      propertyLocation,
      propertyImage,
      
      // Métadonnées
      createdAt: timestamp,
      updatedAt: timestamp,
      
      // Index secondaires
      GSI1PK: `PROPERTY#${propertyId}`,
      GSI1SK: `INVESTMENT#${investmentId}`,
      GSI2PK: `STATUS#${status}`,
      GSI2SK: `INVESTMENT#${timestamp}`,
    };

    const params = {
      TableName: INVESTMENTS_TABLE,
      Item: item,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    };

    try {
      await dynamodb.send(new PutCommand(params));
        ('✅ Investment created:', investmentId);
      return item;
    } catch (error) {
      console.error('❌ Error creating investment:', error);
      throw error;
    }
  }

  /**
   * Récupérer un investissement par ID
   * @param {string} investmentId - ID de l'investissement
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Investissement
   */
  static async getById(investmentId, userId) {
    const params = {
      TableName: INVESTMENTS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `INVESTMENT#${investmentId}`
      }
    };

    try {
      const result = await dynamodb.send(new GetCommand(params));
      return result.Item;
    } catch (error) {
      console.error('❌ Error getting investment:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les investissements d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des investissements
   */
  static async getByUserId(userId) {
    const params = {
      TableName: INVESTMENTS_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'INVESTMENT#'
      }
    };

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return result.Items;
    } catch (error) {
      console.error('❌ Error getting user investments:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les investissements d'une propriété
   * @param {string} propertyId - ID de la propriété
   * @returns {Promise<Array>} Liste des investissements
   */
  static async getByPropertyId(propertyId) {
    const params = {
      TableName: INVESTMENTS_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `PROPERTY#${propertyId}`,
        ':sk': 'INVESTMENT#'
      }
    };

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return result.Items;
    } catch (error) {
      console.error('❌ Error getting property investments:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un investissement
   * @param {string} investmentId - ID de l'investissement
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Investissement mis à jour
   */
  static async update(investmentId, userId, updateData) {
    const timestamp = new Date().toISOString();
    
    // Construire l'expression de mise à jour
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {
      ':updatedAt': timestamp
    };

    Object.keys(updateData).forEach((key, index) => {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = updateData[key];
    });

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';

    const params = {
      TableName: INVESTMENTS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `INVESTMENT#${investmentId}`
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    try {
      const result = await dynamodb.send(new UpdateCommand(params));
      
      return result.Attributes;
    } catch (error) {
      console.error('❌ Error updating investment:', error);
      throw error;
    }
  }

  /**
   * Supprimer un investissement
   * @param {string} investmentId - ID de l'investissement
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} Succès de la suppression
   */
  static async delete(investmentId, userId) {
    const params = {
      TableName: INVESTMENTS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `INVESTMENT#${investmentId}`
      }
    };

    try {
      await dynamodb.send(new DeleteCommand(params));
        
      return true;
    } catch (error) {
      console.error('❌ Error deleting investment:', error);
      throw error;
    }
  }

  /**
   * Calculer les statistiques d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques
   */
  static async getUserStats(userId) {
    const investments = await this.getByUserId(userId);
    
    const stats = {
      totalInvested: 0,
      totalProperties: 0,
      averageReturn: 0,
      totalReturn: 0,
      properties: new Set()
    };

    investments.forEach(investment => {
      stats.totalInvested += investment.investment;
      stats.properties.add(investment.propertyId);
      stats.totalReturn += investment.estimatedYearlyReturn || 0;
    });

    stats.totalProperties = stats.properties.size;
    stats.averageReturn = stats.totalInvested > 0 ? (stats.totalReturn / stats.totalInvested) * 100 : 0;

    return stats;
  }
}

module.exports = InvestmentModel; 