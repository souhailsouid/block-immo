import React from 'react';
import RoleProtectedRoute from 'components/RoleProtectedRoute';
import UserRoleBadge from 'components/UserRoleBadge';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 3 PRO React examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const Analytics = () => {
  return (
    <RoleProtectedRoute 
      requiredSection="analytics"
      showUnauthorizedMessage={true}
    >
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={6} mb={3}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h3" fontWeight="bold">
              Analytics Dashboard
            </MDTypography>
            <UserRoleBadge showIcon={true} showLabel={true} size="medium" />
          </MDBox>
          
          <MDTypography variant="body1" color="text.secondary">
            Welcome to the Analytics Dashboard. This section is accessible to Professionals and Administrators.
          </MDTypography>
        </MDBox>
        
        {/* Contenu de la page analytics */}
        <MDBox>
          <MDTypography variant="h5" mb={2}>
            Analytics Content
          </MDTypography>
          <MDTypography variant="body2" color="text.secondary">
            This is the analytics dashboard content. Only users with the appropriate role can see this.
          </MDTypography>
        </MDBox>
      </DashboardLayout>
    </RoleProtectedRoute>
  );
};

export default Analytics; 