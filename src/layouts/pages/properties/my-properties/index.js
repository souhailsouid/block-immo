import React, { useState } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Chip from '@mui/material/Chip';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Images
import property1 from 'assets/images/products/product-1-min.jpg';
import property2 from 'assets/images/products/product-2-min.jpg';
import property3 from 'assets/images/products/product-3-min.jpg';

const MyProperties = () => {
  const [properties] = useState([
    {
      id: 1,
      title: 'Cozy 5 Stars Apartment',
      description: 'The place is close to Barceloneta Beach and bus stop just 2 min by walk.',
      price: '$399,999',
      location: 'Marbella, Spain',
      status: 'Active',
      type: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 m²',
      image: property1,
      views: 245,
      inquiries: 12,
    },
    {
      id: 2,
      title: 'Office Studio',
      description: 'The place is close to Metro Station and bus stop just 2 min by walk.',
      price: '$799,999',
      location: 'London, UK',
      status: 'Pending',
      type: 'Office',
      bedrooms: 2,
      bathrooms: 1,
      area: '80 m²',
      image: property2,
      views: 189,
      inquiries: 8,
    },
    {
      id: 3,
      title: 'Beautiful Castle',
      description: 'The place is close to Metro Station and bus stop just 2 min by walk.',
      price: '$199,999',
      location: 'Bali, Indonesia',
      status: 'Sold',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 3,
      area: '250 m²',
      image: property3,
      views: 567,
      inquiries: 23,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Sold':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        {/* Header */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="bold" color="customBlue" mb={1}>
            Mes Propriétés
          </MDTypography>
          <MDTypography variant="body1" color="text" mb={3}>
            Gérez vos propriétés et suivez leurs performances
          </MDTypography>
          
          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <MDTypography variant="h3" fontWeight="bold" color="success">
                    {properties.length}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Total Propriétés
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <MDTypography variant="h3" fontWeight="bold" color="info">
                    {properties.filter(p => p.status === 'Active').length}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Actives
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <MDTypography variant="h3" fontWeight="bold" color="warning">
                    {properties.filter(p => p.status === 'Pending').length}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    En Attente
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <MDTypography variant="h3" fontWeight="bold" color="success">
                    {properties.reduce((sum, p) => sum + p.inquiries, 0)}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Demandes Total
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Properties List */}
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} md={6} lg={4} key={property.id}>
              <Card
                sx={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <MDBox position="relative">
                  <MDBox
                    component="img"
                    src={property.image}
                    alt={property.title}
                    width="100%"
                    height="200px"
                    sx={{ objectFit: 'cover' }}
                  />
                  <MDBox
                    position="absolute"
                    top={16}
                    right={16}
                  >
                    <Chip
                      label={property.status}
                      color={getStatusColor(property.status)}
                      size="small"
                    />
                  </MDBox>
                </MDBox>

                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={1}>
                    {property.title}
                  </MDTypography>
                  
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <Icon color="primary" sx={{ mr: 1, fontSize: '1rem' }}>
                      location_on
                    </Icon>
                    <MDTypography variant="body2" color="text">
                      {property.location}
                    </MDTypography>
                  </MDBox>

                  <MDTypography variant="h5" fontWeight="bold" color="success" mb={2}>
                    {property.price}
                  </MDTypography>

                  {/* Property Details */}
                  <Grid container spacing={1} mb={3}>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDTypography variant="body2" fontWeight="bold" color="primary">
                          {property.bedrooms}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Chambres
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDTypography variant="body2" fontWeight="bold" color="primary">
                          {property.bathrooms}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          SDB
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={4}>
                      <MDBox textAlign="center">
                        <MDTypography variant="body2" fontWeight="bold" color="primary">
                          {property.area}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">
                          Surface
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>

                  {/* Stats */}
                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDBox textAlign="center">
                      <MDTypography variant="body2" fontWeight="bold" color="info">
                        {property.views}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Vues
                      </MDTypography>
                    </MDBox>
                    <MDBox textAlign="center">
                      <MDTypography variant="body2" fontWeight="bold" color="warning">
                        {property.inquiries}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Demandes
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  {/* Action Buttons */}
                  <MDBox display="flex" gap={1}>
                    <MDButton variant="gradient" color="info" size="small" fullWidth>
                      <Icon sx={{ mr: 1, fontSize: '1rem' }}>edit</Icon>
                      Modifier
                    </MDButton>
                    <MDButton variant="outlined" color="info" size="small" fullWidth>
                      <Icon sx={{ mr: 1, fontSize: '1rem' }}>visibility</Icon>
                      Voir
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MyProperties; 
 