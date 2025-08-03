const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

async function deleteAllProperties() {
  console.log("🗑️ Début de la suppression de toutes les propriétés...");
  
  try {
    // 1. Scanner toutes les propriétés
    console.log("🔍 Scan de toutes les propriétés...");
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: "begins_with(PK, :pk)",
      ExpressionAttributeValues: {
        ":pk": { S: "PROPERTY#" }
      }
    });

    const { Items } = await client.send(scanCommand);
    console.log(`📊 Nombre total de propriétés à supprimer: ${Items.length}`);

    if (Items.length === 0) {
      console.log("✅ Aucune propriété à supprimer");
      return;
    }

    // 2. Supprimer chaque propriété
    console.log("🗑️ Suppression en cours...");
    let deletedCount = 0;
    let errorCount = 0;

    for (const item of Items) {
      try {
        const propertyId = item.PK?.S?.replace("PROPERTY#", "");
        const title = item.title?.S || "Sans titre";
        const status = item.status?.S || "Statut inconnu";
        
        console.log(`🗑️ Suppression: ${propertyId} - "${title}" (${status})`);
        
        const deleteCommand = new DeleteItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Key: { 
            PK: { S: item.PK.S }, 
            SK: { S: item.SK.S } 
          }
        });
        
        await client.send(deleteCommand);
        deletedCount++;
        console.log(`✅ Supprimé: ${propertyId}`);
        
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${item.PK?.S}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n📊 Résumé de la suppression:");
    console.log(`✅ Propriétés supprimées avec succès: ${deletedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total traité: ${Items.length}`);

  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
  }
}

deleteAllProperties(); 
 