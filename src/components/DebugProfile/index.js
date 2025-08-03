import React from 'react';
import { useUserProfileDynamo } from 'hooks/useUserProfileDynamo';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const DebugProfile = () => {
  const { userProfile, isLoading, error, firstName, lastName, email } = useUserProfileDynamo();

  return (
    <MDBox p={2} bgcolor="grey.100" borderRadius={1}>
      <MDTypography variant="h6" mb={2}>
        🔍 Debug Profile
      </MDTypography>
      
      <MDBox mb={2}>
        <MDTypography variant="body2">
          Loading: <strong>{isLoading ? 'Oui' : 'Non'}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          Error: <strong>{error || 'Aucune'}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          userProfile type: <strong>{typeof userProfile}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          userProfile value: <strong>{JSON.stringify(userProfile)}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          firstName: <strong>{firstName}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          lastName: <strong>{lastName}</strong>
        </MDTypography>
        <MDTypography variant="body2">
          email: <strong>{email}</strong>
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default DebugProfile; 