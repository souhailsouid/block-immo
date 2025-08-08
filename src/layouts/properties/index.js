import { useState, useEffect } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDNavTabs from 'components/MDNavTabs';

// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

import RealEstateGrid from 'layouts/ecommerce/properties/property-page/components/Properties/RealEstateGrid';
import { useParams } from 'react-router-dom';

// Photos service
import { propertyPhotosService } from 'services/api/modules/properties/propertyPhotosService';

const PropertiesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { propertyId } = useParams();
  const [photoCount, setPhotoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔄 Charger le compteur de photos
  useEffect(() => {
    const loadPhotoCount = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await propertyPhotosService.getPropertyPhotos(propertyId);
        
        if (response.success && response.photos) {
          setPhotoCount(response.photos.length);
        } else {
          setPhotoCount(0);
        }
      } catch (err) {
        console.error('❌ Error loading photo count:', err);
        setPhotoCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoCount();

    // 🎧 ÉCOUTER L'ÉVÉNEMENT DE MISE À JOUR DES PHOTOS
    const handlePhotosUpdate = (event) => {
      if (event.detail.propertyId === propertyId) {
      
        loadPhotoCount(); // Recharger le compteur
      }
    };

    window.addEventListener('propertyPhotosUpdated', handlePhotosUpdate);

    // 🧹 Nettoyer l'event listener
    return () => {
      window.removeEventListener('propertyPhotosUpdated', handlePhotosUpdate);
    };
  }, [propertyId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDNavTabs tabs={[{ label: 'Photos' }, { label: 'Videos' }]} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MDBox py={3}>
        <Card sx={{ overflow: 'visible' }}>
          <MDBox p={3}>
            <MDBox mb={3}>
              <MDTypography variant="h5" fontWeight="medium">
                {loading ? 'Chargement...' : `${photoCount} photo${photoCount !== 1 ? 's' : ''}`}
              </MDTypography>
            </MDBox>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={12} xl={12}>
                <RealEstateGrid propertyId={propertyId} />
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PropertiesPage;
