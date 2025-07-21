import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import Grid from '@mui/material/Grid';
import PropertyContactForm from 'components/forms/PropertyContactForm';

const ContactRealEstate = () => {
  return (
    <DashboardLayout>
      <MDBox mb={20} height="100vh">
        <Grid
          container
          justifyContent="center"
          alignItems="flex-start"
          sx={{ height: '100%', mt: 2 }}
        >
          <Grid item xs={12} lg={10}>
            <MDBox mb={3} display="flex" alignItems="center" justifyContent="space-between"></MDBox>
          </Grid>
          <Grid item xs={12} lg={12}>
            <PropertyContactForm />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ContactRealEstate;
