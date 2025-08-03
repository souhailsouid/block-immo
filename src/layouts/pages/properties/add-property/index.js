import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Services
import { createOrUpdateProperty } from 'services/api/modules/properties/propertyService';

// Context
import { useNotification } from 'context/NotificationContext';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Dashboard layout
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

// Route protection
import RouteProtection from 'components/RouteProtection';

// Form
import AddPropertyBasicForm from 'components/forms/AddPropertyBasicForm';

// Icons
import { ArrowBack } from '@mui/icons-material';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (propertyData) => {
    setIsSubmitting(true);
    
    try {
      console.log('🔄 Création de la propriété:', propertyData);
      
      const response = await createOrUpdateProperty({
        step: 'basic',
        data: propertyData
      });
      
      console.log('✅ Propriété créée avec succès:', response);
      
      // Afficher une notification de succès
      showNotification('success', 'Property created successfully! You can now add more details.');
      
      // Rediriger vers la propriété créée pour continuer
      const propertyId = response.data.propertyId;
      navigate(`/properties/${propertyId}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      showNotification('error', 'Error creating property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboards/market-place');
  };

  return (
    <RouteProtection allowedRoles={['PROFESSIONAL', 'ADMIN']}>
      <DashboardLayout>
        <MDBox mt={6} mb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <MDBox display="flex" alignItems="center" mb={3}>
                <MDBox
                  component="button"
                  variant="text"
                  color="info"
                  onClick={handleCancel}
                  sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
                >
                  <ArrowBack sx={{ mr: 1 }} />
                  Back to Properties
                </MDBox>
              </MDBox>
              
              <AddPropertyBasicForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    </RouteProtection>
  );
};

export default AddPropertyPage; 