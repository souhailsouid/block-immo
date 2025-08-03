/**
 * Transformation des données DynamoDB vers le format API
 * @param {Object} dynamoItem - Item DynamoDB
 * @returns {Object} Propriété formatée
 */
const transformDynamoItemToProperty = (dynamoItem) => {
    return {
      propertyId: dynamoItem.PK.S.split("#")[1],
      title: dynamoItem.title?.S || '',
      city: dynamoItem.city?.S || '',
      country: dynamoItem.country?.S || '',
      countryCode: dynamoItem.countryCode?.S || 'XX',
      price: Number(dynamoItem.price?.N) || 0,
      bedrooms: Number(dynamoItem.bedrooms?.N) || 0,
      bathrooms: Number(dynamoItem.bathrooms?.N) || 0,
      surface: Number(dynamoItem.surface?.N) || 0,
      propertyType: dynamoItem.propertyType?.S || 'Apartment',
      status: dynamoItem.status?.S || 'available',
      description: dynamoItem.description?.S || '',
      address: dynamoItem.address?.S || '',
      energyClass: dynamoItem.energyClass?.S || 'N/A',
      yearBuilt: Number(dynamoItem.yearBuilt?.N) || 0,
      brutYield: Number(dynamoItem.brutYield?.N) || 0,
      netYield: Number(dynamoItem.netYield?.N) || 0,
      pricePerSquareFoot: Number(dynamoItem.pricePerSquareFoot?.N) || 0,
      agentId: dynamoItem.agentId?.S,
      createdAt: dynamoItem.createdAt?.S,
      updatedAt: dynamoItem.updatedAt?.S,
      // Champs optionnels
      images: dynamoItem.images?.S ? JSON.parse(dynamoItem.images.S) : [],
      location: dynamoItem.location?.S ? JSON.parse(dynamoItem.location.S) : null,
      // Champs d'investissement
      funded: Number(dynamoItem.funded?.N) || 0,

      // Timeline data
      timelineData: dynamoItem.timelineData?.L ? dynamoItem.timelineData.L.map(item => ({
        status: item.M.status?.S || 'pending',
        icon: item.M.icon?.S || 'event',
        title: item.M.title?.S || '',
        date: item.M.date?.S || '',
        description: item.M.description?.S || '',
        color: item.M.color?.S || 'info',
        dateTime: item.M.dateTime?.S || '',
        lastItem: item.M.lastItem?.BOOL || false,
        badges: item.M.badges?.L ? item.M.badges.L.map(badge => badge.S) : []
      })) : [],
      // Location data
      address: dynamoItem.address?.S || '',
      latitude: Number(dynamoItem.latitude?.N) || null,
      longitude: Number(dynamoItem.longitude?.N) || null,
      locationDescription: dynamoItem.locationDescription?.S || '',
      // Price data
      propertyPrice: Number(dynamoItem.propertyPrice?.N) || null,
      // numberOfInvestors: Number(dynamoItem.numberOfInvestors?.N) || null,
      status: dynamoItem.status?.S || 'open',
      fundingDate: dynamoItem.fundingDate?.S || null,
      closingDate: dynamoItem.closingDate?.S || null,
      yearlyInvestmentReturn: Number(dynamoItem.yearlyInvestmentReturn?.N) || null,
      currency: dynamoItem.currency?.S || 'USD',
    };
  };
  
  /**
   * Transformer une liste d'items DynamoDB
   * @param {Array} dynamoItems - Liste d'items DynamoDB
   * @returns {Array} Liste de propriétés formatées
   */
  const transformDynamoItemsToProperties = (dynamoItems) => {
    return dynamoItems.map(transformDynamoItemToProperty);
  };
  
  module.exports = {
    transformDynamoItemToProperty,
    transformDynamoItemsToProperties
  };