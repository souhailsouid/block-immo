import React from 'react';
import { useRole } from 'context/RoleContext';
import { checkUserGroups } from 'utils/cognitoUtils';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const RoleDebug = () => {
  const { userRole, isLoading, forceUpdateRole } = useRole();

  const handleForceUpdate = async () => {
    await forceUpdateRole();
  };

  const handleDirectCheck = async () => {
    const userData = await checkUserGroups();
    };

  const clearLocalStorage = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userGroups');
    };

  return (
    <MDBox p={2} bgcolor="grey.100" borderRadius={1}>
      <MDTypography variant="h6" mb={2}>
        🔍 Debug Rôle
      </MDTypography>
      
      <MDBox mb={2}>
        <MDTypography variant="body2">
          Rôle actuel: <strong>{userRole}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          Loading: <strong>{isLoading ? 'Oui' : 'Non'}</strong>
        </MDTypography>
      </MDBox>

      <MDBox display="flex" gap={1}>
        <MDButton 
          variant="contained" 
          color="info" 
          size="small"
          onClick={handleForceUpdate}
        >
          🔄 Forcer Update
        </MDButton>
        
        <MDButton 
          variant="contained" 
          color="warning" 
          size="small"
          onClick={handleDirectCheck}
        >
          🔍 Check Direct
        </MDButton>
        
        <MDButton 
          variant="contained" 
          color="error" 
          size="small"
          onClick={clearLocalStorage}
        >
          🗑️ Clear Storage
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default RoleDebug; 