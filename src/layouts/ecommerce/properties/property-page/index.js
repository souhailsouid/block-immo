// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import Box from '@mui/material/Box';
// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import DashboardKYC from 'examples/Navbars/DashboardKYC';

// Data
import PropertiesPreviews from 'layouts/ecommerce/properties/property-page/components/Properties/PropertiesPreviews';
import PropertyDetails from 'layouts/dashboards/marketPlace/components/PropertyDetails';

const PropertyPage = () => {
  return (
    <DashboardLayout>
      <DashboardKYC />
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={{ overflow: 'visible' }}>
          <MDBox p={3}>
            <Grid container>
              <PropertiesPreviews propertyId={1} />

              <Box sx={{ flexGrow: 1, px: 2, cursor: 'pointer' }}>
                <Grid container>
                  <Grid item xs={12} md={6} lg={12}>
                    <PropertyDetails />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PropertyPage;
