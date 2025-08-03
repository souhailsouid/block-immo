// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

import { useUserProfileDynamo } from "hooks/useUserProfileDynamo";

const Authentication = () => {
  const {userProfile} = useUserProfileDynamo();
  const phoneNumber = userProfile?.phone;
  return (
    <Card id="2fa" sx={{ overflow: "visible" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h5">Two-factor authentication</MDTypography>
        <MDBadge variant="contained" color="error" badgeContent="disabled" container />
      </MDBox>
      <MDBox p={3}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <MDTypography variant="body2" color="text">
            Security keys
          </MDTypography>
          <MDBox
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <MDBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              <MDTypography variant="button" color="text" fontWeight="regular">
                No Security keys
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="dark" size="small" disabled>
              add
            </MDButton>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <MDTypography variant="body2" color="text">
            SMS number
          </MDTypography>
          <MDBox
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <MDBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {phoneNumber}
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="dark" size="small" disabled>
              edit
            </MDButton>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <MDTypography variant="body2" color="text">
            Authenticator app
          </MDTypography>
          <MDBox
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <MDBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              <MDTypography variant="button" color="text" fontWeight="regular">
                Not Configured
              </MDTypography>
            </MDBox>
            <MDButton variant="outlined" color="dark" size="small" disabled>
              set up
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Authentication;
