#!/usr/bin/env node

/**
 * Script pour nettoyer les utilisateurs de test
 */

const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-3' });

async function cleanTestUsers() {
  try {
    console.log('🧹 Nettoyage des utilisateurs de test...');

    // 1. Scanner tous les utilisateurs
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: "begins_with(PK, :pk)",
      ExpressionAttributeValues: {
        ":pk": { S: "USER#" }
      }
    });

    const scanResult = await client.send(scanCommand);
    const users = scanResult.Items || [];

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // 2. Supprimer les utilisateurs de test
    const testEmails = [
      'test@example.com',
      'first@test.com',
      'admin@blockimmo.test',
      'investor@test.com',
      'professional@test.com'
    ];

    let deletedCount = 0;

    for (const user of users) {
      const userEmail = user.email?.S;
      
      if (userEmail && testEmails.includes(userEmail)) {
        console.log(`🗑️  Suppression de: ${userEmail}`);
        
        const deleteCommand = new DeleteItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            PK: user.PK,
            SK: user.SK
          }
        });

        await client.send(deleteCommand);
        deletedCount++;
      }
    }

    console.log(`✅ ${deletedCount} utilisateurs de test supprimés`);
    console.log('🧹 Nettoyage terminé !');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

cleanTestUsers(); 