import { useState } from 'react';
// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDNavTabs from 'components/MDNavTabs';

// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
// import DashboardNavbar from '^';
import DashboardKYC from 'examples/Navbars/DashboardKYC';
import Footer from 'examples/Footer';

import BookingCard from 'examples/Cards/BookingCard';

// Images
import booking1 from 'assets/images/products/product-1-min.jpg';
import booking2 from 'assets/images/products/product-2-min.jpg';
import booking3 from 'assets/images/products/product-3-min.jpg';

const MarketPlace = () => {
  const [activeTab, setActiveTab] = useState(0);
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
              tabs={[{ label: 'Available' }, { label: 'Funded' }]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </MDBox>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking1}
                  title="Cozy 5 Stars Apartment"
                  description='The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.'
                  price="$399.999"
                  location="Marbella, Spain"
                  link="/properties/1"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking2}
                  title="Office Studio"
                  description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.'
                  price="$799.999"
                  location="London, UK"
                  link="/properties/2"
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mt={3}>
                <BookingCard
                  image={booking3}
                  title="Beautiful Castle"
                  description='The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.'
                  price="$199.999"
                  location="Bali, Indonesia"
                  link="/properties/3"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MarketPlace;
