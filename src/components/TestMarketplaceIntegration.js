import { useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Hook personnalisé
import { useProperties } from 'hooks/useProperties';

const TestMarketplaceIntegration = () => {
 const [testResults, setTestResults] = useState([]);

  // Test avec le hook useProperties
  const {
    properties,
    loading,
    error,
    totalCount,
    hasMore,
    fetchProperties,
    refetch,
    loadMore,
    filterProperties,
    isEmpty,
    isError
  } = useProperties({
    filters: {},
    pagination: { page: 1, limit: 5 },
    autoFetch: false // On ne fetch pas automatiquement pour les tests
  });

  const runTest = async (testName, testFunction) => {
    try {
      setTestResults(prev => [...prev, { name: testName, status: 'running', message: 'Test en cours...' }]);
      
      await testFunction();
      
      setTestResults(prev => 
        prev.map(test => 
          test.name === testName 
            ? { ...test, status: 'success', message: 'Test réussi' }
            : test
        )
      );
    } catch (err) {
      setTestResults(prev => 
        prev.map(test => 
          test.name === testName 
            ? { ...test, status: 'error', message: err.message }
            : test
        )
      );
    }
  };

  const tests = [
    {
      name: 'Fetch des propriétés',
      function: () => fetchProperties()
    },
    {
      name: 'Refetch des propriétés',
      function: () => refetch()
    },
    {
      name: 'Filtrage par ville (Paris)',
      function: () => filterProperties({ city: 'Paris' })
    },
    {
      name: 'Filtrage par prix (100000-500000)',
      function: () => filterProperties({ minPrice: 100000, maxPrice: 500000 })
    },
    {
      name: 'Chargement de plus de propriétés',
      function: () => loadMore()
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'running': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <MDTypography variant="h6" fontWeight="bold" mb={2}>
        🧪 Test d'intégration Marketplace
      </MDTypography>

      {/* État actuel */}
      <MDBox mb={3}>
        <MDTypography variant="body2" color="text.secondary" mb={1}>
          État actuel:
        </MDTypography>
        <MDBox display="flex" gap={2} flexWrap="wrap">
          <MDTypography variant="caption" color={loading ? 'warning' : 'success'}>
            {loading ? '⏳ Chargement...' : '✅ Prêt'}
          </MDTypography>
          <MDTypography variant="caption" color={isError ? 'error' : 'success'}>
            {isError ? '❌ Erreur' : '✅ Pas d\'erreur'}
          </MDTypography>
          <MDTypography variant="caption" color={isEmpty ? 'warning' : 'success'}>
            {isEmpty ? '📭 Vide' : '📦 Données'}
          </MDTypography>
          <MDTypography variant="caption" color="info">
            📊 {properties.length} propriétés
          </MDTypography>
          {hasMore && (
            <MDTypography variant="caption" color="success">
              ➕ Plus de données disponibles
            </MDTypography>
          )}
        </MDBox>
      </MDBox>

      {/* Boutons de test */}
      <MDBox mb={3}>
        <MDTypography variant="body2" color="text.secondary" mb={2}>
          Tests disponibles:
        </MDTypography>
        <MDBox display="flex" gap={1} flexWrap="wrap">
          {tests.map((test) => (
            <Button
              key={test.name}
              variant="outlined"
              size="small"
              onClick={() => runTest(test.name, test.function)}
              disabled={loading}
            >
              {test.name}
            </Button>
          ))}
        </MDBox>
      </MDBox>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <MDBox>
          <MDTypography variant="body2" color="text.secondary" mb={2}>
            Résultats des tests:
          </MDTypography>
          {testResults.map((test, index) => (
            <Alert 
              key={index}
              severity={getStatusColor(test.status)}
              sx={{ mb: 1 }}
            >
              <strong>{test.name}:</strong> {test.message}
            </Alert>
          ))}
        </MDBox>
      )}

      {/* Affichage des propriétés de test */}
      {properties.length > 0 && (
        <MDBox mt={3}>
          <MDTypography variant="body2" color="text.secondary" mb={2}>
            Propriétés récupérées ({properties.length}):
          </MDTypography>
          {properties.slice(0, 3).map((property, index) => (
            <MDBox 
              key={property.propertyId || index}
              p={2} 
              mb={1} 
              bgcolor="grey.100" 
              borderRadius={1}
            >
              <MDTypography variant="body2" fontWeight="medium">
                {property.title || `Propriété ${index + 1}`}
              </MDTypography>
              <MDTypography variant="caption" color="text.secondary">
                {property.city} - {property.price ? `${property.price}€` : 'Prix non disponible'}
              </MDTypography>
            </MDBox>
          ))}
          {properties.length > 3 && (
            <MDTypography variant="caption" color="text.secondary">
              ... et {properties.length - 3} autres propriétés
            </MDTypography>
          )}
        </MDBox>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <strong>Erreur:</strong> {error}
        </Alert>
      )}
    </Card>
  );
};

export default TestMarketplaceIntegration; 