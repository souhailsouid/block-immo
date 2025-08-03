const InvestmentModel = require('../models/investment');
const TransactionModel = require('../models/transaction');

/**
 * Lambda pour récupérer le portfolio d'un utilisateur
 */
exports.handler = async (event) => {
  try {
    console.log('🔄 Get portfolio event:', JSON.stringify(event, null, 2));

    // Vérifier la méthode HTTP
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Extraire l'userId depuis les paramètres de requête
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        body: JSON.stringify({ error: 'Missing userId parameter' })
      };
    }

    // Récupérer les investissements de l'utilisateur
    const investments = await InvestmentModel.getByUserId(userId);
    
    // Récupérer les transactions récentes
    const { transactions } = await TransactionModel.getByUserId(userId, 10);
    
    // Calculer les statistiques
    const investmentStats = await InvestmentModel.getUserStats(userId);
    const transactionStats = await TransactionModel.getUserTransactionStats(userId);

    // Formater les propriétés pour le portfolio
    const properties = investments.map(investment => ({
      propertyId: investment.propertyId,
      propertyTitle: investment.propertyTitle,
      propertyLocation: investment.propertyLocation,
      propertyImage: investment.propertyImage,
      investedAmount: investment.investment,
      currentValue: investment.investment + (investment.estimatedYearlyReturn || 0), // Simplifié
      return: investment.estimatedYearlyReturn || 0,
      returnRate: investment.returnRate,
      blocks: investment.blocks,
      ownership: investment.ownershipPercentage,
      status: investment.status,
      estimatedMonthlyReturn: investment.estimatedMonthlyReturn,
      estimatedYearlyReturn: investment.estimatedYearlyReturn,
    }));

    // Calculer les totaux du portfolio
    const totalInvested = properties.reduce((sum, prop) => sum + prop.investedAmount, 0);
    const totalValue = properties.reduce((sum, prop) => sum + prop.currentValue, 0);
    const totalReturn = properties.reduce((sum, prop) => sum + prop.return, 0);

    // Construire la réponse
    const portfolio = {
      totalInvested,
      totalValue,
      totalReturn,
      properties,
      transactions: transactions.map(tx => ({
        transactionId: tx.transactionId,
        investmentId: tx.investmentId,
        propertyId: tx.propertyId,
        propertyTitle: tx.propertyTitle,
        amount: tx.amount,
        blocks: tx.blocks,
        status: tx.status,
        timestamp: tx.timestamp,
        type: tx.type,
        returnRate: tx.returnRate,
      })),
      stats: {
        ...investmentStats,
        ...transactionStats,
        portfolioGrowth: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
        diversificationScore: properties.length > 0 ? Math.min(properties.length * 20, 100) : 0, // Simplifié
      }
    };

    console.log('✅ Portfolio retrieved successfully for user:', userId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify(portfolio)
    };

  } catch (error) {
    console.error('❌ Error in get-portfolio:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}; 