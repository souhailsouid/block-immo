export const getCoordinatesFromAddress = async (address, city, country) => {
    try {
      // Nettoyer et normaliser l'adresse
      const cleanAddress = address ? address.replace(/[^\w\s\-.,]/g, ' ').trim() : '';
      const cleanCity = city ? city.replace(/[^\w\s\-.,]/g, ' ').trim() : '';
      const cleanCountry = country ? country.replace(/[^\w\s\-.,]/g, ' ').trim() : '';
      
      // Essayer différentes combinaisons d'adresse
      const addressCombinations = [
        `${cleanAddress}, ${cleanCity}, ${cleanCountry}`,
        `${cleanCity}, ${cleanCountry}`,
        `${cleanAddress}, ${cleanCity}`,
        `${cleanCity}`,
        `${cleanCountry}`
      ];
      
      for (const addressToTry of addressCombinations) {
        if (!addressToTry.trim()) continue;
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressToTry)}&limit=1&addressdetails=1`
        );
        
        if (!response.ok) {
          continue;
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            displayName: result.display_name,
            confidence: result.importance
          };
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };