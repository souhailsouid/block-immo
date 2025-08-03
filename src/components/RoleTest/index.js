import React from 'react';
import { useRole } from 'context/RoleContext';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

const RoleTest = () => {
  const { 
    userRole, 
    userProfile, 
    loading, 
    hasPermission, 
    canAccess, 
    getRoleConfig,
    getDefaultDashboard 
  } = useRole();

  if (loading) {
    return (
      <MDBox p={3} bgcolor="info.light" borderRadius={2}>
        <MDTypography variant="body2" color="info.dark">
          Loading role information...
        </MDTypography>
      </MDBox>
    );
  }

  const roleConfig = getRoleConfig();

  return (
    <MDBox
      position="fixed"
      bottom={20}
      right={20}
      zIndex={9999}
      p={3}
      bgcolor="success.light"
      borderRadius={2}
      boxShadow="0 4px 20px rgba(0,0,0,0.1)"
      border="1px solid"
      borderColor="success.main"
      maxWidth={300}
    >
      <MDTypography variant="h6" color="success.dark" mb={2}>
        🧪 Role System Test
      </MDTypography>
      
      <MDBox mb={2}>
        <MDTypography variant="body2" color="text.secondary">
          <strong>Current Role:</strong> {userRole || 'None'}
        </MDTypography>
      </MDBox>
      
      {roleConfig && (
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text.secondary">
            <strong>Role Label:</strong> {roleConfig.label}
          </MDTypography>
          <MDTypography variant="body2" color="text.secondary">
            <strong>Role Icon:</strong> {roleConfig.icon}
          </MDTypography>
          <MDTypography variant="body2" color="text.secondary">
            <strong>Default Dashboard:</strong> {getDefaultDashboard()}
          </MDTypography>
        </MDBox>
      )}
      
      <MDBox mb={2}>
        <MDTypography variant="body2" color="text.secondary">
          <strong>Can access analytics:</strong> {canAccess('analytics') ? '✅ Yes' : '❌ No'}
        </MDTypography>
        <MDTypography variant="body2" color="text.secondary">
          <strong>Can manage properties:</strong> {hasPermission('manage_properties') ? '✅ Yes' : '❌ No'}
        </MDTypography>
      </MDBox>
      
      {userProfile && (
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text.secondary">
            <strong>Profile loaded:</strong> ✅ Yes
          </MDTypography>
        </MDBox>
      )}
      
      <MDButton
        variant="outlined"
        color="success"
        size="small"
        onClick={() => window.location.reload()}
        fullWidth
      >
        🔄 Refresh
      </MDButton>
    </MDBox>
  );
};

export default RoleTest; 