// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Settings page components
import BaseLayout from 'layouts/pages/account/components/BaseLayout';
import Sidenav from 'layouts/pages/account/settings/components/Sidenav';
import Header from 'layouts/pages/account/settings/components/Header';
import BasicInfo from 'layouts/pages/account/settings/components/BasicInfo';
import ChangePassword from 'layouts/pages/account/settings/components/ChangePassword';
import DeleteAccount from 'layouts/pages/account/settings/components/DeleteAccount';
import ProfessionalInfo from 'layouts/pages/account/settings/components/ProfessionalInfo';
import Billing from 'layouts/pages/account/billing';
import { useUserProfile } from 'hooks/useUserProfile';

const Settings = () => {
  const { userProfile } = useUserProfile();
  

  return (
    <BaseLayout>
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Header />
                </Grid>
                <Grid item xs={12}>
                  <BasicInfo />
                </Grid>
                {userProfile?.primaryRole === 'PROFESSIONAL' && (
                  <Grid item xs={12}>
                    <ProfessionalInfo />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <ChangePassword />
                </Grid>
                <Grid item xs={12}>
                  <Billing userProfile={userProfile} />
                </Grid>
                <Grid item xs={12}>
                  <DeleteAccount />
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
};

export default Settings;
