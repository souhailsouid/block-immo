// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Card from '@mui/material/Card';

import PropertyLocationMap from 'examples/Locations/PropertyLocation/PropertyLocationMap';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PropTypes from 'prop-types';

const PropertyLocation = ({ city, country, address, description, lat, lng }) => {
  return (
    <Card sx={{ border: 'none', borderRadius: '10px', boxShadow: 'none' }}>
      <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MDBox pt={3} px={3}>
          <MDBox display="flex" alignItems="center" gap={1} mb={1}>
            <MDBox
              width="2.25rem"
              height="2.25rem"
              bgColor={'customBlue'}
              variant="gradient"
              borderRadius="xl"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="white"
              mt={0}
              mr={1}
            >
              <LocationOnIcon fontSize="medium" />
            </MDBox>

            <MDTypography variant="h5" color="dark" sx={{ alignSelf: 'center' }}>
              Location
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" gap={1}>
            <LocationOnIcon sx={{ color: 'dark', fontSize: '1.5rem' }} />
            <MDTypography variant="body1" color="dark" sx={{ fontSize: '14px', mb: 1, mt: 2 }}>
              <b>{`${address}, ${city}, ${country}`}</b>
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <PropertyLocationMap lat={lat} lng={lng} />
        </MDBox>
      </MDBox>
      {/* description */}
      <MDTypography variant="body2" sx={{ fontSize: '14px', mb: 1, ml: 2 }}>
        {description}
      </MDTypography>
    </Card>
  );
};

PropertyLocation.defaultProps = {
  city: PropTypes.string,
  country: PropTypes.string,
  address: PropTypes.string,
  description: PropTypes.string,
};

export default PropertyLocation;
