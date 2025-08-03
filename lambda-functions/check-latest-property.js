const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-west-3" });

async function checkLatestProperty() {
  console.log("🔍 Vérification de la dernière propriété créée...");
  
  try {
    // Scanner toutes les propriétés
    console.log("📊 Scan de toutes les propriétés...");
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: "begins_with(PK, :pk)",
      ExpressionAttributeValues: {
        ":pk": { S: "PROPERTY#" }
      }
    });

    const { Items } = await client.send(scanCommand);
    console.log(`📊 Nombre total de propriétés: ${Items.length}`);

    if (Items.length === 0) {
      console.log("❌ Aucune propriété trouvée");
      return;
    }

    // Trier par date de création (createdAt)
    const sortedProperties = Items.sort((a, b) => {
      const dateA = a.createdAt?.S || a.updatedAt?.S || "1970-01-01";
      const dateB = b.createdAt?.S || b.updatedAt?.S || "1970-01-01";
      return new Date(dateB) - new Date(dateA);
    });

    // Afficher les 5 dernières propriétés
    console.log("\n🏆 Les 5 dernières propriétés créées:");
    console.log("=".repeat(80));
    
    sortedProperties.slice(0, 5).forEach((property, index) => {
      const propertyId = property.PK?.S?.replace("PROPERTY#", "");
      const title = property.title?.S || "Sans titre";
      const status = property.status?.S || "Statut inconnu";
      const createdAt = property.createdAt?.S || property.updatedAt?.S || "Date inconnue";
      const createdBy = property.createdBy?.S || property.createdByUserId?.S || "Utilisateur inconnu";
      const propertyType = property.propertyType?.S || "Type inconnu";
      const surface = property.surface?.N || "Surface inconnue";
      const city = property.city?.S || "Ville inconnue";
      const country = property.country?.S || "Pays inconnu";

      console.log(`\n${index + 1}. 📋 PROPRIÉTÉ: ${propertyId}`);
      console.log(`   📝 Titre: ${title}`);
      console.log(`   🏷️  Statut: ${status}`);
      console.log(`   🏠 Type: ${propertyType}`);
      console.log(`   📏 Surface: ${surface} m²`);
      console.log(`   🌍 Localisation: ${city}, ${country}`);
      console.log(`   👤 Créé par: ${createdBy}`);
      console.log(`   📅 Créé le: ${createdAt}`);
      
      // Afficher tous les champs pour debug
      console.log(`   🔍 Tous les champs:`);
      Object.keys(property).forEach(key => {
        const value = property[key];
        if (value && (value.S || value.N)) {
          console.log(`      ${key}: ${value.S || value.N}`);
        }
      });
    });

    // Vérifier spécifiquement les propriétés IN_PROGRESS
    const inProgressProperties = sortedProperties.filter(p => p.status?.S === "IN_PROGRESS");
    console.log(`\n🔄 Propriétés IN_PROGRESS: ${inProgressProperties.length}`);
    
    if (inProgressProperties.length > 0) {
      console.log("📋 Liste des propriétés IN_PROGRESS:");
      inProgressProperties.forEach((property, index) => {
        const propertyId = property.PK?.S?.replace("PROPERTY#", "");
        const title = property.title?.S || "Sans titre";
        const createdBy = property.createdBy?.S || property.createdByUserId?.S || "Utilisateur inconnu";
        console.log(`   ${index + 1}. ${propertyId} - "${title}" (par ${createdBy})`);
      });
    }

    // Vérifier les propriétés par utilisateur
    const userProperties = {};
    sortedProperties.forEach(property => {
      const user = property.createdBy?.S || property.createdByUserId?.S || "unknown";
      if (!userProperties[user]) {
        userProperties[user] = [];
      }
      userProperties[user].push({
        id: property.PK?.S?.replace("PROPERTY#", ""),
        title: property.title?.S || "Sans titre",
        status: property.status?.S || "Statut inconnu"
      });
    });

    console.log(`\n👥 Propriétés par utilisateur:`);
    Object.keys(userProperties).forEach(user => {
      console.log(`   ${user}: ${userProperties[user].length} propriétés`);
      userProperties[user].forEach(prop => {
        console.log(`     - ${prop.id}: "${prop.title}" (${prop.status})`);
      });
    });

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

checkLatestProperty(); 