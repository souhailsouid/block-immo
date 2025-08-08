const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-3' });
const dynamodb = DynamoDBDocumentClient.from(client);

const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || 'transactions-table';

/**
 * Modèle pour les transactions
 */
class TransactionModel {
  /**
   * Créer une nouvelle transaction
   * @param {Object} transactionData - Données de la transaction
   * @returns {Promise<Object>} Transaction créée
   */
  static async create(transactionData) {
    const {
      transactionId,
      investmentId,
      propertyId,
      userId,
      amount,
      blocks,
      type,
      status = 'PENDING',
      currency,
      paymentMethod,
      returnRate,
      propertyTitle,
      propertyLocation
    } = transactionData;

    const timestamp = new Date().toISOString();
    
    const item = {
      // Clés primaires
      PK: `USER#${userId}`,
      SK: `TRANSACTION#${transactionId}`,
      
      // Données de la transaction
      transactionId,
      investmentId,
      propertyId,
      userId,
      amount,
      blocks,
      type,
      status,
      currency,
      paymentMethod,
      returnRate,
      
      // Données de la propriété
      propertyTitle,
      propertyLocation,
      
      // Métadonnées
      timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      
      // Index secondaires
      GSI1PK: `PROPERTY#${propertyId}`,
      GSI1SK: `TRANSACTION#${timestamp}`,
      GSI2PK: `TYPE#${type}`,
      GSI2SK: `TRANSACTION#${timestamp}`,
      GSI3PK: `STATUS#${status}`,
      GSI3SK: `TRANSACTION#${timestamp}`,
    };

    const params = {
      TableName: TRANSACTIONS_TABLE,
      Item: item,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    };

    try {
      await dynamodb.send(new PutCommand(params));
        
      return item;
    } catch (error) {
      console.error('❌ Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Récupérer une transaction par ID
   * @param {string} transactionId - ID de la transaction
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Transaction
   */
  static async getById(transactionId, userId) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `TRANSACTION#${transactionId}`
      }
    };

    try {
      const result = await dynamodb.send(new GetCommand(params));
      return result.Item;
    } catch (error) {
      console.error('❌ Error getting transaction:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les transactions d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {number} limit - Nombre de transactions à récupérer
   * @param {string} startKey - Clé de pagination
   * @returns {Promise<Object>} Liste des transactions et clé de pagination
   */
  static async getByUserId(userId, limit = 50, startKey = null) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'TRANSACTION#'
      },
      ScanIndexForward: false, // Plus récent en premier
      Limit: limit
    };

    if (startKey) {
      params.ExclusiveStartKey = startKey;
    }

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return {
        transactions: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey
      };
    } catch (error) {
      console.error('❌ Error getting user transactions:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les transactions d'une propriété
   * @param {string} propertyId - ID de la propriété
   * @returns {Promise<Array>} Liste des transactions
   */
  static async getByPropertyId(propertyId) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `PROPERTY#${propertyId}`,
        ':sk': 'TRANSACTION#'
      },
      ScanIndexForward: false
    };

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return result.Items;
    } catch (error) {
      console.error('❌ Error getting property transactions:', error);
      throw error;
    }
  }

  /**
   * Récupérer les transactions par type
   * @param {string} type - Type de transaction (PURCHASE, SALE, etc.)
   * @param {string} userId - ID de l'utilisateur (optionnel)
   * @returns {Promise<Array>} Liste des transactions
   */
  static async getByType(type, userId = null) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk AND begins_with(GSI2SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `TYPE#${type}`,
        ':sk': 'TRANSACTION#'
      },
      ScanIndexForward: false
    };

    if (userId) {
      params.FilterExpression = 'userId = :userId';
      params.ExpressionAttributeValues[':userId'] = userId;
    }

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return result.Items;
    } catch (error) {
      console.error('❌ Error getting transactions by type:', error);
      throw error;
    }
  }

  /**
   * Récupérer les transactions par statut
   * @param {string} status - Statut de la transaction
   * @param {string} userId - ID de l'utilisateur (optionnel)
   * @returns {Promise<Array>} Liste des transactions
   */
  static async getByStatus(status, userId = null) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      IndexName: 'GSI3',
      KeyConditionExpression: 'GSI3PK = :pk AND begins_with(GSI3SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `STATUS#${status}`,
        ':sk': 'TRANSACTION#'
      },
      ScanIndexForward: false
    };

    if (userId) {
      params.FilterExpression = 'userId = :userId';
      params.ExpressionAttributeValues[':userId'] = userId;
    }

    try {
      const result = await dynamodb.send(new QueryCommand(params));
      return result.Items;
    } catch (error) {
      console.error('❌ Error getting transactions by status:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une transaction
   * @param {string} transactionId - ID de la transaction
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Transaction mise à jour
   */
  static async update(transactionId, userId, updateData) {
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
      TableName: TRANSACTIONS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `TRANSACTION#${transactionId}`
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
      console.error('❌ Error updating transaction:', error);
      throw error;
    }
  }

  /**
   * Supprimer une transaction
   * @param {string} transactionId - ID de la transaction
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} Succès de la suppression
   */
  static async delete(transactionId, userId) {
    const params = {
      TableName: TRANSACTIONS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `TRANSACTION#${transactionId}`
      }
    };

    try {
      await dynamodb.send(new DeleteCommand(params));
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
      throw error;
    }
  }

  /**
   * Calculer les statistiques de transactions d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques
   */
  static async getUserTransactionStats(userId) {
    const { transactions } = await this.getByUserId(userId, 1000);
    
    const stats = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      totalPurchases: 0,
      totalSales: 0,
      pendingTransactions: 0,
      confirmedTransactions: 0,
      failedTransactions: 0,
      averageTransactionAmount: 0
    };

    transactions.forEach(transaction => {
      stats.totalAmount += transaction.amount;
      
      if (transaction.type === 'PURCHASE') {
        stats.totalPurchases++;
      } else if (transaction.type === 'SALE') {
        stats.totalSales++;
      }
      
      if (transaction.status === 'PENDING') {
        stats.pendingTransactions++;
      } else if (transaction.status === 'CONFIRMED') {
        stats.confirmedTransactions++;
      } else if (transaction.status === 'FAILED') {
        stats.failedTransactions++;
      }
    });

    stats.averageTransactionAmount = stats.totalTransactions > 0 
      ? stats.totalAmount / stats.totalTransactions 
      : 0;

    return stats;
  }
}

module.exports = TransactionModel; 