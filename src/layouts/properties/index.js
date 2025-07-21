import { useState } from 'react';

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

const PropertiesPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDNavTabs tabs={[{ label: 'Photos' }, { label: 'Videos' }]} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MDBox py={3}>
        <Card sx={{ overflow: 'visible' }}>
          <MDBox p={3}>
            <MDBox mb={3}>
              <MDTypography variant="h5" fontWeight="medium">
                7 photos
              </MDTypography>
            </MDBox>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={12} xl={12}>
                <RealEstateGrid />
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
