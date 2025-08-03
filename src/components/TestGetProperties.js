import React, { useState, useEffect } from 'react';
import { getProperties } from 'services/api/modules/properties/propertyService';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';

const TestGetProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getProperties();
      setProperties(result.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <MDBox p={3}>
      <MDTypography variant="h4" mb={3}>
        🧪 Test Get Properties (Fonction simple)
      </MDTypography>

      {/* État de chargement */}
      {loading && (
        <MDAlert color="info" dismissible={false}>
          🔄 Chargement des propriétés depuis le cloud...
        </MDAlert>
      )}

      {/* Erreur */}
      {error && (
        <MDAlert color="error" dismissible={false}>
          ❌ Erreur: {error}
        </MDAlert>
      )}

      {/* Liste des propriétés */}
      <MDBox>
        <MDTypography variant="h6" mb={2}>
          Propriétés ({properties.length})
        </MDTypography>
        
        {properties.length === 0 && !loading && !error && (
          <MDAlert color="warning">
            Aucune propriété trouvée dans le cloud
          </MDAlert>
        )}
        
        {properties.map((property, index) => (
          <MDBox
            key={property.id || property.propertyId || index}
            p={2}
            mb={2}
            border={1}
            borderColor="grey.300"
            borderRadius={1}
            bgcolor="white"
          >
            <MDTypography variant="h6" color="primary">
              {property.title || property.name || `Propriété ${index + 1}`}
            </MDTypography>
            
            <MDTypography variant="body2" color="text.secondary" mb={1}>
              {property.description || 'Aucune description disponible'}
            </MDTypography>
            
            <MDBox display="flex" gap={3} flexWrap="wrap">
              <MDTypography variant="body2">
                🏠 {property.bedrooms || 0} chambres, {property.bathrooms || 0} sdb
              </MDTypography>
              
              <MDTypography variant="body2">
                📏 {property.surface || property.area || 0}m²
              </MDTypography>
              
              <MDTypography variant="body2" color="success.main">
                💰 {property.price ? property.price.toLocaleString() : 'N/A'}€
              </MDTypography>
              
              <MDTypography variant="body2" color="info.main">
                📍 {property.city || property.location || 'Localisation inconnue'}
              </MDTypography>
              
              <MDTypography 
                variant="body2" 
                color={property.status === 'available' ? 'success.main' : 'error.main'}
              >
                {property.status === 'available' ? '✅ Disponible' : '❌ Vendu'}
              </MDTypography>
            </MDBox>
          </MDBox>
        ))}
      </MDBox>

      {/* Bouton de test */}
      <MDBox mt={3} textAlign="center">
        <MDButton
          variant="contained"
          color="primary"
          onClick={loadProperties}
          disabled={loading}
        >
          🔄 Recharger depuis le cloud
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default TestGetProperties; 