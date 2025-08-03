
// @mui material components
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";

import MasterCard from "examples/Cards/MasterCard";

import PaymentMethod from "layouts/pages/account/billing/components/PaymentMethod";



const Billing = (
{
  userProfile
}
) => {
  
  return (
    <MDBox mt={4} >
      <MDBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <PaymentMethod />
          </Grid>
          <Grid item xs={12} lg={6} ml='auto'>
            <MasterCard number={4562112245947852} holder={userProfile?.fullName} expires="11/22" />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
Billing.propTypes = {
  userProfile: PropTypes.object.isRequired,
};
export default Billing;
