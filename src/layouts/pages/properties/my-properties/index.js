import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Services
import { getProperties, deleteProperty } from 'services/api/modules/properties/propertyService';

// Context
import { useNotification } from 'context/NotificationContext';
import { useUserProfile } from 'hooks/useUserProfile';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDNavTabs from 'components/MDNavTabs';

// Dashboard layout
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Route protection
import RouteProtection from 'components/RouteProtection';

// Property card component
import PropertyCardWithActions from 'components/PropertyCardWithActions';

// Status change modal
import StatusChangeModal from 'components/StatusChangeModal';

// Icons
import { Add, Visibility, Edit, Delete, Settings } from '@mui/icons-material';

// Images par défaut (comme dans la marketplace)
import booking1 from 'assets/images/products/product-1-min.jpg';
import booking2 from 'assets/images/products/product-2-min.jpg';
import booking3 from 'assets/images/products/product-3-min.jpg';

const MyPropertiesPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { userProfile } = useUserProfile();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // États pour le modal de changement de statut
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Catégories de propriétés
  const categories = [
    { key: "COMMERCIALIZED", label: 'Commercialized' },
    { key: 'FUNDED', label: 'Funded' },
    { key: 'IN_PROGRESS', label: 'In Progress' }
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getProperties();
    
      
      // Filtrer les propriétés du professionnel connecté
      const userProperties = response.filter(property => {
        // Essayer d'abord par userId, puis par email comme fallback
        return property.createdByUserId === userProfile?.userId || property.createdBy === userProfile?.email;
      });
            
      setProperties(userProperties);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des propriétés:', error);
      showNotification('error', 'Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const getPropertiesByCategory = (category) => {
  
    let filtered;
    switch (category) {
      case 'COMMERCIALIZED':
        // Inclure COMMERCIALIZED et l'ancien statut ACTIVE
        filtered = properties.filter(p => p.status === 'COMMERCIALIZED' || p.status === 'ACTIVE');
        break;
      case 'FUNDED':
        filtered = properties.filter(p => p.status === 'FUNDED');
        break;
      case 'IN_PROGRESS':
        // Inclure IN_PROGRESS et l'ancien statut DRAFT
        filtered = properties.filter(p => p.status === 'IN_PROGRESS' || p.status === 'DRAFT');
        break;
      default:
        filtered = properties;
    }
  
    return filtered;
  };

  // Fonction pour obtenir une image par défaut (comme dans la marketplace)
  const getDefaultImage = (index) => {
    const images = [booking1, booking2, booking3];
    return images[index % images.length];
  };

  // Fonction pour formater le prix (comme dans la marketplace)
  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleAddProperty = () => {
    navigate('/properties/add');
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      // Demander confirmation avant la suppression
      const confirmed = window.confirm('Are you sure you want to delete this property? This action cannot be undone.');
      if (!confirmed) return;

      showNotification('info', 'Deleting property...');
      
      await deleteProperty(propertyId);
      
      showNotification('success', 'Property deleted successfully');
      
      // Recharger la liste des propriétés
      loadProperties();
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      showNotification('error', 'Error deleting property. Please try again.');
    }
  };

  const handleStatusChange = (propertyId, newStatus) => {
    // Mettre à jour la propriété dans l'état local
    setProperties(prevProperties => 
      prevProperties.map(property => 
        property.propertyId === propertyId 
          ? { ...property, status: newStatus }
          : property
      )
    );
  };

  const handleOpenStatusModal = (property) => {
    setSelectedProperty(property);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <RouteProtection allowedRoles={['PROFESSIONAL', 'ADMIN']}>
      <DashboardLayout>
        <MDBox mt={6} mb={3}>
          {/* Header */}
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h4" fontWeight="bold" color="customBlue">
              My Properties
            </MDTypography>
            <MDButton
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddProperty}
            >
              Add New Property
            </MDButton>
          </MDBox>

          {/* Tabs (comme dans la marketplace) */}
          <MDBox my={2}>
            <MDNavTabs
              tabs={categories.map(cat => ({ 
                label: `${cat.label} (${getPropertiesByCategory(cat.key).length})` 
              }))}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </MDBox>

          {/* Content */}
          {loading ? (
            <MDBox display="flex" justifyContent="center" p={4}>
              <MDTypography variant="body1" color="textSecondary">
                Loading properties...
              </MDTypography>
            </MDBox>
          ) : (
            <Grid container spacing={3}>
                             {getPropertiesByCategory(categories[activeTab].key).map((property, index) => (
                 <Grid item xs={12} md={6} lg={4} key={property.propertyId}>
                   <MDBox mt={3}>
                     <PropertyCardWithActions
                       image={property.mainPhoto || getDefaultImage(index)}
                       title={property.title || `Property ${index + 1}`}
                       description={property.description || 'Description not available'}
                       price={formatPrice(property.propertyPrice)}
                       location={property.city ? `${property.city}, ${property.country}` : 'Location not available'}
                       link={`/properties/${property.propertyId}`}
                       onView={() => handleViewProperty(property.propertyId)}
                       onEdit={() => handleEditProperty(property.propertyId)}
                       onDelete={() => handleDeleteProperty(property.propertyId)}
                       onStatusChange={() => handleOpenStatusModal(property)}
                       showActions={true}
                     />
                   </MDBox>
                 </Grid>
               ))}
              
              {getPropertiesByCategory(categories[activeTab].key).length === 0 && (
                <Grid item xs={12}>
                  <Card sx={{ p: 4, textAlign: 'center' }}>
                    <MDTypography variant="h6" color="textSecondary" mb={2}>
                      No {categories[activeTab].label.toLowerCase()} properties
                    </MDTypography>
                    <MDTypography variant="body2" color="textSecondary" mb={3}>
                      {activeTab === 0 && "Start by creating your first property to commercialize it."}
                      {activeTab === 1 && "Funded properties will appear here once they are fully funded."}
                      {activeTab === 2 && "Properties in progress and draft properties will appear here."}
                    </MDTypography>
                    {activeTab === 0 && (
                      <MDButton
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddProperty}
                      >
                        Create Your First Property
                      </MDButton>
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </MDBox>

        {/* Status Change Modal */}
        <StatusChangeModal
          open={statusModalOpen}
          onClose={handleCloseStatusModal}
          property={selectedProperty}
          onStatusChanged={handleStatusChange}
        />
      </DashboardLayout>
    </RouteProtection>
  );
};

export default MyPropertiesPage; 