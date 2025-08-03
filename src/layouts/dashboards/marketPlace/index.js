import { useState, useEffect } from 'react';
// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDNavTabs from 'components/MDNavTabs';
import MDButton from 'components/MDButton';
import { formatCurrencyWithLocale } from 'utils/currencyMapping';

// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardKYC from 'examples/Navbars/DashboardKYC';
import Footer from 'examples/Footer';

import BookingCard from 'examples/Cards/BookingCard';

// Nouveaux composants
import PropertyListStates from 'components/PropertyListStates';

// Hook personnalisé
import { useProperties } from 'hooks/useProperties';

// Images par défaut
import booking1 from 'assets/images/products/product-1-min.jpg';
import booking2 from 'assets/images/products/product-2-min.jpg';
import booking3 from 'assets/images/products/product-3-min.jpg';
import authService from 'services/authService';

// Constants
import {  PROPERTY_STATUSES_PROPERTY } from 'constants/propertyConstants';

// Material Dashboard 3 PRO React context
import { useMaterialUIController, setLayout } from 'context';

const MarketPlace = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Debug: Vérifier le layout
  const [controller, dispatch] = useMaterialUIController();
  const { layout } = controller;
  
  // Forcer le layout dashboard au chargement
  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [dispatch]);

  // Configuration des onglets selon les status
  const tabs = [
    { label: 'Commercialized', status: PROPERTY_STATUSES_PROPERTY.COMMERCIALIZED },
    { label: 'Funded', status: PROPERTY_STATUSES_PROPERTY.FUNDED },
    { label: 'In Progress', status: PROPERTY_STATUSES_PROPERTY.IN_PROGRESS }
  ];

  // Utilisation du hook personnalisé pour gérer les propriétés
  const {
    properties,
    loading: hookLoading,
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
    filters: {}, // Pas de filtre initial, on charge tout
    pagination: { page: 1, limit: 50 }, // Plus de propriétés
    autoFetch: true
  });

  // Fonction pour obtenir une image par défaut
  const getDefaultImage = (index) => {
    const images = [booking1, booking2, booking3];
    return images[index % images.length];
  };

  // Vérification de l'utilisateur
  useEffect(() => {
    async function checkUser() {
      try {
        const userData = await authService.getCurrentUser();
        if (userData && userData.isAuthenticated) {
          // Utilisateur connecté, on peut charger les propriétés
        }
      } catch (e) {
        // Pas d'utilisateur connecté, on affiche le formulaire
      }
    }
    checkUser();
  }, []);

  // Mettre à jour les propriétés quand le hook change
  useEffect(() => {
    if (properties && properties.length > 0) {
      setAllProperties(properties);
      setLoading(false);
    } else {
      // Données de test temporaires si aucune propriété n'est chargée
      const testProperties = [
        {
          propertyId: '1',
          title: 'Luxury Apartment',
          description: 'Beautiful luxury apartment in the city center',
          propertyPrice: 500000,
          currency: 'USD',
          city: 'New York',
          status: 'commercialized'
        },
        {
          propertyId: '2',
          title: 'Modern Villa',
          description: 'Spacious modern villa with garden',
          propertyPrice: 800000,
          currency: 'USD',
          city: 'Los Angeles',
          status: 'funded'
        },
        {
          propertyId: '3',
          title: 'Downtown Loft',
          description: 'Contemporary loft in downtown area',
          propertyPrice: 350000,
          currency: 'USD',
          city: 'Chicago',
          status: 'in_progress'
        }
      ];
      setAllProperties(testProperties);
      setLoading(false);
    }
  }, [properties]);

  // Fonction pour filtrer les propriétés par catégorie (comme dans My Properties)
  const getPropertiesByCategory = (category) => {
    
    let filtered;
    switch (category) {
      case PROPERTY_STATUSES_PROPERTY.COMMERCIALIZED:
        // Inclure COMMERCIALIZED et l'ancien statut ACTIVE
        filtered = allProperties.filter(p => p.status === PROPERTY_STATUSES_PROPERTY.COMMERCIALIZED || p.status === 'ACTIVE');
        break;
      case PROPERTY_STATUSES_PROPERTY.FUNDED:
        filtered = allProperties.filter(p => p.status === PROPERTY_STATUSES_PROPERTY.FUNDED);
        break;
      case PROPERTY_STATUSES_PROPERTY.IN_PROGRESS:
        // Inclure IN_PROGRESS et l'ancien statut DRAFT
        filtered = allProperties.filter(p => p.status === PROPERTY_STATUSES_PROPERTY.IN_PROGRESS || p.status === 'DRAFT');
        break;
      default:
        filtered = allProperties;
    }
    
    return filtered;
  };

  // Gestion du changement d'onglet
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  // Fonction pour obtenir le nombre de propriétés par status
  const getPropertyCount = (status) => {
    const filtered = getPropertiesByCategory(status);
    return filtered.length;
  };

  // Obtenir les propriétés de l'onglet actuel
  const currentTabProperties = getPropertiesByCategory(tabs[activeTab]?.status);

  return (
    <DashboardLayout>
      <DashboardKYC />
      <MDBox pb={2}>
        <MDBox mb={2} ml={1}>
          <MDTypography variant="h4" fontWeight="bold" color="customBlue">
            Market Place
          </MDTypography>

          <MDBox my={2}>
            <MDNavTabs
              tabs={tabs.map((tab, index) => ({
                label: `${tab.label} (${getPropertyCount(tab.status)})`,
                value: index
              }))}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </MDBox>
        </MDBox>

        {/* Statistiques */}
        {!loading && !error && (
          <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6" color="text">
              {tabs[activeTab]?.label} Properties ({getPropertyCount(tabs[activeTab]?.status)})
            </MDTypography>
            {hasMore && (
              <MDButton
                variant="outlined"
                color="primary"
                size="small"
                onClick={loadMore}
                disabled={loading}
              >
                Charger plus
              </MDButton>
            )}
          </MDBox>
        )}

        {/* Liste des propriétés avec gestion d'état */}
        <PropertyListStates
          loading={loading || hookLoading}
          error={error}
          isEmpty={currentTabProperties.length === 0}
          onRetry={refetch}
          onRefresh={refetch}
        >
          <Grid container spacing={3}>
            {currentTabProperties.map((property, index) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={property.propertyId || index}>
                  <MDBox mt={3}>
                    <BookingCard
                      image={getDefaultImage(index)}
                      title={property.title || `Property ${index + 1}`}
                      description={property.description || ''}
                      price={formatCurrencyWithLocale(property.propertyPrice, property.currency)}
                      location={property.city || 'Location not available'}
                      link={`/properties/${property.propertyId || index}`}
                      status={property.status}
                    />
                  </MDBox>
                </Grid>
              );
            })}
          </Grid>
        </PropertyListStates>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MarketPlace;