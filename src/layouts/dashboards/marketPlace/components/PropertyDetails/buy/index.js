import PropTypes from 'prop-types';
// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDProgress from 'components/MDProgress';
import MDButton from 'components/MDButton';

import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { formatCurrency } from 'utils';

// Modal context
import { useModal } from 'context/ModalContext';

const PropertyBuy = ({
  propertyType,
  bedrooms,
  status,
  surface,
  energyClass,
  yearBuilt,
  bathrooms,
}) => {
  return (
    <Box
      sx={{
        flex: { lg: '0 0 400px' },
        order: { xs: 1, lg: 2 },
        width: '100%',
        mb: { xs: 2, lg: 0 },
      }}
    >
      <Box
        sx={{
          position: { xs: 'static', lg: 'sticky' },
          top: { lg: 80 },
          zIndex: 10,
        }}
      >
        <PropertyPriceDetails
          value={formatCurrency(1000000, 'USD', 'en-US')}
          investors={534}
          date={new Date()}
          funded={34}
          investmentReturn={10}
          currentValuation={1010000}
          propertyType={propertyType}
          bedrooms={bedrooms}
          status={status}
          surface={surface}
          energyClass={energyClass}
          yearBuilt={yearBuilt}
          bathrooms={bathrooms}
          isProjectActive={true}
          userHasShares={false}
        />
      </Box>
    </Box>
  );
};

const PropertyPriceDetails = ({
  value,
  investors,
  date,
  funded,
  investmentReturn,
  currentValuation,
}) => {
  const { openModal } = useModal();

  const getInvestmentButton = () => {
    return (
      <MDButton
        variant="contained"
        color="customBlue"
        startIcon={<ShoppingCartIcon />}
        fullWidth
        sx={{
          mt: 2,
          mb: 2,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(68, 114, 196, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(68, 114, 196, 0.4)',
            transform: 'translateY(-1px)',
          },
        }}
        onClick={() => openModal('buy-shares', { value, funded, investmentReturn })}
      >
        Buy Shares
      </MDButton>
    );
  };

  return (
    <Card sx={{ width: '100%', position: 'relative' }}>
      {/* Action Button */}
      <MDBox
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 10,
        }}
      >
        <Tooltip title="Edit Property Price Details" placement="bottom">
          <MDBox
            sx={{
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              borderRadius: '50%',
              background: 'rgba(68, 114, 196, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(68, 114, 196, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
            onClick={() =>
              openModal('property-price', {
                value,
                investors,
                date,
                funded,
                investmentReturn,
                currentValuation,
              })
            }
          >
            <Icon sx={{ color: '#4472c4', fontSize: { xs: 18, sm: 20, md: 22 } }}>edit</Icon>
          </MDBox>
        </Tooltip>
      </MDBox>

      <MDBox sx={{ p: 2 }}>
        <MDTypography variant="body2" sx={{ fontSize: '14px', textAlign: 'center', mb: 1 }}>
          Property Price
        </MDTypography>
        <MDTypography variant="h4" color="customBlue" sx={{ mb: 2, textAlign: 'center' }}>
          {value}
        </MDTypography>

        {/* Status Chip */}
        <MDBox sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip
            label={'Funding in Progress'}
            color={'warning'}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </MDBox>

        {/* Progress Bar */}
        <MDBox sx={{ mb: 2 }}>
          <MDBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <MDTypography variant="body2" color="text" sx={{ fontSize: '13px' }}>
              Funding
            </MDTypography>
            <MDTypography
              variant="body2"
              color="text"
              sx={{ fontSize: '13px', fontWeight: 'bold' }}
            >
              {funded}%
            </MDTypography>
          </MDBox>
          <MDProgress
            value={funded}
            variant="gradient"
            color={funded >= 100 ? 'success' : 'customBlue'}
            sx={{ height: '8px', borderRadius: '4px' }}
          />
        </MDBox>

        {/* Investment Stats */}
        <MDBox sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text" sx={{ fontSize: '12px' }}>
                Investors
              </MDTypography>
              <MDTypography variant="h6" sx={{ fontWeight: 'bold' }}>
                {investors}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text" sx={{ fontSize: '12px' }}>
                Annual Return
              </MDTypography>
              <MDTypography variant="h6" color="success" sx={{ fontWeight: 'bold' }}>
                {investmentReturn}%
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>

        {/* Investment Button */}
        {getInvestmentButton()}

        {/* Additional Info */}
        <Card sx={{ width: '100%', backgroundColor: 'grey.100', border: 'none' }}>
          <MDBox sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <PropertyDetailsSubCard
                title="Closing Date"
                value={date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              />
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
    </Card>
  );
};
PropertyPriceDetails.propTypes = {
  value: PropTypes.string.isRequired,
  investors: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  funded: PropTypes.number.isRequired,
  investmentReturn: PropTypes.number.isRequired,
  currentValuation: PropTypes.number.isRequired,
};

const PropertyDetailsSubCard = ({ title, value }) => {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        p={2}
        pb={0}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <MDTypography variant="body2" color="text">
          {title}
        </MDTypography>

        <MDTypography variant="body2" sx={{ fontWeight: 'bold' }}>
          {value}
        </MDTypography>
      </Grid>
    </Grid>
  );
};
PropertyDetailsSubCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

PropertyBuy.propTypes = {
  propertyType: PropTypes.string.isRequired,
  bedrooms: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  surface: PropTypes.number.isRequired,
  energyClass: PropTypes.string.isRequired,
  yearBuilt: PropTypes.number.isRequired,
  bathrooms: PropTypes.number.isRequired,
};

export default PropertyBuy;
