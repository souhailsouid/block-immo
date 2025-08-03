const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

async function cleanTestProperties() {
  console.log("🧹 Début du nettoyage des propriétés de test...");
  
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
    console.log(`📊 Nombre total de propriétés trouvées: ${Items.length}`);

    // 2. Filtrer les propriétés avec statut IN_PROGRESS ou DRAFT
    const propertiesToDelete = Items.filter(item => {
      const status = item.status?.S;
      return status === 'IN_PROGRESS' || status === 'DRAFT';
    });

    console.log(`🗑️ Propriétés à supprimer: ${propertiesToDelete.length}`);
    
    if (propertiesToDelete.length === 0) {
      console.log("✅ Aucune propriété à supprimer");
      return;
    }

    // 3. Afficher les détails des propriétés à supprimer
    console.log("\n📋 Détails des propriétés à supprimer:");
    propertiesToDelete.forEach((item, index) => {
      console.log(`${index + 1}. ID: ${item.propertyId?.S}`);
      console.log(`   Titre: ${item.title?.S || 'N/A'}`);
      console.log(`   Statut: ${item.status?.S}`);
      console.log(`   Créé par: ${item.createdBy?.S || 'N/A'}`);
      console.log(`   Créé le: ${item.createdAt?.S || 'N/A'}`);
      console.log("   ---");
    });

    // 4. Demander confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  Êtes-vous sûr de vouloir supprimer ${propertiesToDelete.length} propriétés ? (oui/non): `, resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'oui') {
      console.log("❌ Suppression annulée");
      return;
    }

    // 5. Supprimer les propriétés
    console.log("\n🗑️ Suppression en cours...");
    let deletedCount = 0;
    let errorCount = 0;

    for (const item of propertiesToDelete) {
      try {
        const deleteCommand = new DeleteItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            PK: item.PK,
            SK: item.SK
          }
        });

        await client.send(deleteCommand);
        console.log(`✅ Supprimé: ${item.propertyId?.S}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${item.propertyId?.S}:`, error.message);
        errorCount++;
      }
    }

    // 6. Résumé
    console.log("\n📊 Résumé du nettoyage:");
    console.log(`✅ Propriétés supprimées: ${deletedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total traité: ${propertiesToDelete.length}`);

  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
  }
}

// Exécuter le script
cleanTestProperties()
  .then(() => {
    console.log("🏁 Nettoyage terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erreur fatale:", error);
    process.exit(1);
  }); 
 