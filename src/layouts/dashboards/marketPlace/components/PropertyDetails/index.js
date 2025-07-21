// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDProgress from 'components/MDProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Tooltip from '@mui/material/Tooltip';

// Material Dashboard 3 PRO React examples
import PropertyDetailsTable from 'examples/Tables/PropertyDetailsTable';
import Divider from '@mui/material/Divider';
// Data
import propertyDetailsTableData from 'layouts/dashboards/marketPlace/components/PropertyDetails/data/propertyDetailsTableData';
import { formatCurrency } from 'utils';
import CalculatorInvestmentsChart from  "examples/Charts/CalculatorChart";
import Timeline from 'layouts/pages/projects/timeline';
import PropertyLocation from 'examples/Locations/PropertyLocation';
import Contact from 'examples/Contact';
import PropertyBuy from 'layouts/dashboards/marketPlace/components/PropertyDetails/buy';
// Modal context
import { useModal } from 'context/ModalContext';

const PropertyDetails = ({
  title = '1 Bed in Botanica Tower, Dubai Marina',
  propertyType = 'Villa',
  bedrooms = 1,
  status = 'Available',
  surface = 1000,
  energyClass = 'A',
  yearBuilt = 2020,
  bathrooms = 1,
  city = 'Dubai',
  country = 'United Arab Emirates',
  countryCode = 'AE',
  brutYield = 7.24,
  netYield = 5.52,
  pricePerSquareFoot = 2000,
  address = 'Jumeirah Village Circle',
  description = 'JVC is a sought-after community for family-living in Dubai, offering over 33 parks and a host of recreational activities. The district provides residents with a village-like living, while being a short distance from large commercial hubs in the Emirate. With over 2,000 residential units, from towers to villas and townhouses, JVC is a hub for comfortable living, offering schools, fitness and healthcare centers, clinics. It is also host to Nakheel’s Circle Mall, with over 200 retail and F&B options.',
  // lat = 25.2048,
  // lng = 55.2708,
  
  lat=43.422478, 
  lng=5.280622

}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      {/* Colonne 1 - Contenu principal */}
      <Box
        sx={{
          flex: { lg: 1 },
          order: { xs: 2, lg: 1 },
          width: '100%',
        }}
      >
        <PropertyDetailsCard
          title={title}
          propertyType={propertyType}
          bedrooms={bedrooms}
          status={status}
          surface={surface}
          energyClass={energyClass}
          yearBuilt={yearBuilt}
          bathrooms={bathrooms}
          city={city}
          country={country}
          countryCode={countryCode}
          brutYield={brutYield}
          netYield={netYield}
          pricePerSquareFoot={pricePerSquareFoot}
          address={address}
          description={description}
          lat={lat}
          lng={lng}
        />
      </Box>

      {/* Colonne 2 - Détails de prix */}
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
            funded={100}
            investmentReturn={10}
            currentValuation={1010000}
            propertyType={propertyType}
            bedrooms={bedrooms}
            status={status}
            surface={surface}
            energyClass={energyClass}
            yearBuilt={yearBuilt}
            bathrooms={bathrooms}
          />
          <PropertyBuy
            value={formatCurrency(1000000, 'USD', 'en-US')}
            investors={134}
            date={new Date()}
            funded={100}
            investmentReturn={10}
            currentValuation={1010000}
            propertyType={propertyType}
          />
        </Box>
      </Box>
    </Box>
  );
};
const PropertyDetailsCard = ({
  title,
  propertyType,
  bedrooms,
  status,
  surface,
  energyClass,
  yearBuilt,
  bathrooms,
  city,
  country,
  countryCode,
  brutYield,
  netYield,
  pricePerSquareFoot,
  address,
  description,
  lat,
  lng,
}) => {
  const { openModal } = useModal();

  return (
    <Card
      sx={{
        width: '100%',
        position: 'relative',
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: '0 4px 12px rgba(0,0,0,0.15)' },
      }}
    >
      {/* Action Button */}
      <MDBox
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 10,
        }}
      >
        <Tooltip title="Edit Property Details" placement="bottom">
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
              openModal('property-details', {
                title,
                propertyType,
                bedrooms,
                status,
                surface,
                energyClass,
                yearBuilt,
                bathrooms,
                city,
                country,
                countryCode,
                brutYield,
                netYield,
                pricePerSquareFoot,
              })
            }
          >
            <Icon sx={{ color: '#4472c4', fontSize: { xs: 18, sm: 20, md: 22 } }}>edit</Icon>
          </MDBox>
        </Tooltip>
      </MDBox>

      <MDBox sx={{ p: { xs: 2, sm: 3 } }}>
        <MDTypography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            lineHeight: { xs: 1.2, sm: 1.3 },
            mb: 1,
          }}
        >
          {title}
        </MDTypography>
        <MDTypography
          variant="body2"
          color="text"
          sx={{
            fontSize: { xs: '12px', sm: '14px' },
            mb: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 1 },
            alignItems: 'center',
          }}
        >
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            {propertyType}
          </Box>
          <Box component="span">•</Box>
          <Box component="span">{bedrooms} rooms</Box>
          <Box component="span">•</Box>
          <Box component="span" sx={{ color: 'success.main' }}>
            {status}
          </Box>
          <Box component="span">•</Box>
          <Box component="span">{surface} sq.ft</Box>
          <Box component="span">•</Box>
          <Box component="span">Class {energyClass}</Box>
          <Box component="span">•</Box>
          <Box component="span">{yearBuilt}</Box>
          <Box component="span">•</Box>
          <Box component="span">{bathrooms} bathrooms</Box>
        </MDTypography>
      </MDBox>

      <Divider />

      <MDBox sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sx={{ position: 'relative' }}>
            {/* Action Button pour PropertyDetailsTable */}
            <MDBox
              sx={{
                position: 'absolute',
                top: { xs: 4, sm: 8 },
                right: { xs: 4, sm: 8 },
                zIndex: 10,
              }}
            >
              <Tooltip title="Edit Property Details" placement="bottom">
                <MDBox
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
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
                    openModal('property-details-table', {
                      city,
                      country,
                      countryCode,
                      brutYield,
                      netYield,
                      pricePerSquareFoot,
                    })
                  }
                >
                  <Icon sx={{ color: '#4472c4', fontSize: { xs: 16, sm: 18 } }}>edit</Icon>
                </MDBox>
              </Tooltip>
            </MDBox>
            <PropertyDetailsTable
              rows={propertyDetailsTableData(
                city,
                country,
                countryCode,
                brutYield,
                netYield,
                pricePerSquareFoot
              )}
              shadow={false}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ position: 'relative' }}>
            {/* Action Button pour Timeline */}
            <MDBox
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Tooltip title="Edit Timeline" placement="bottom">
                <MDBox
                  sx={{
                    width: 32,
                    height: 32,
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
                  onClick={() => openModal('property-timeline', { title })}
                >
                  <Icon sx={{ color: '#4472c4', fontSize: 18 }}>edit</Icon>
                </MDBox>
              </Tooltip>
            </MDBox>
            <Timeline />
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ position: 'relative' }}>
            {/* Action Button pour CalculatorInvestmentsCharts */}
            <MDBox
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Tooltip title="Edit Investment Calculator" placement="bottom">
                <MDBox
                  sx={{
                    width: 32,
                    height: 32,
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
                  onClick={() => openModal('property-calculator', { title })}
                >
                  <Icon sx={{ color: '#4472c4', fontSize: 18 }}>edit</Icon>
                </MDBox>
              </Tooltip>
            </MDBox>
            <CalculatorInvestmentsChart />
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ position: 'relative' }}>
            {/* Action Button pour PropertyLocation */}
            <MDBox
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Tooltip title="Edit Property Location" placement="bottom">
                <MDBox
                  sx={{
                    width: 32,
                    height: 32,
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
                    openModal('property-location', {
                      title,
                      city,
                      country,
                      address,
                      description,
                      lat,
                      lng
                    })
                  }
                >
                  <Icon sx={{ color: '#4472c4', fontSize: 18 }}>edit</Icon>
                </MDBox>
              </Tooltip>
            </MDBox>
            <PropertyLocation
              city={city}
              country={country}
              address={address}
              description={description}
              lat={lat}
              lng={lng}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ mb: 2, position: 'relative' }}>
            {/* Action Button pour Contact */}
            <MDBox
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Tooltip title="Edit Contact Information" placement="bottom">
                <MDBox
                  sx={{
                    width: 32,
                    height: 32,
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
                  onClick={() => openModal('property-contact', { title })}
                >
                  <Icon sx={{ color: '#4472c4', fontSize: 18 }}>edit</Icon>
                </MDBox>
              </Tooltip>
            </MDBox>
            {/* contact info */}
            <Contact />
          </Grid>
        </Grid>
      </MDBox>
    </Card>
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

      <MDBox>
        <MDTypography variant="body2" sx={{ fontSize: '14px', mt: 2, ml: 2, textAlign: 'center' }}>
          Property price
        </MDTypography>
        <MDTypography variant="h4" color="customBlue" sx={{ mb: 1, ml: 2, textAlign: 'center' }}>
          {value}
        </MDTypography>
      </MDBox>
      <Grid container sx={{ gap: 2, flexDirection: 'row', flexGrow: 1, px: 2 }}>
        <Grid item xs={12} md={12} lg={12}>
          <MDProgress value="100" variant="gradient" color="customBlue" />
          <MDTypography variant="body2" color="text" sx={{ fontSize: '13px', mt: 0.5, mb: 2 }}>
            {funded}% funded
          </MDTypography>
          <Grid container>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'space-between',
              }}
            >
              <MDTypography variant="body2" sx={{ fontSize: '13px', mt: 0.5 }}>
                {investors} investors
              </MDTypography>

              <MDTypography variant="body2" color="error" sx={{ fontSize: '13px', mt: 0.5 }}>
                <AccessTimeIcon sx={{ fontWeight: 'bold' }} /> Closed on{' '}
                {date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>
        {/* card grey */}
        <Card sx={{ width: '100%', backgroundColor: 'grey.100', mt: 2, mb: 2, border: 'none' }}>
          <Grid
            container
            sx={{
              gap: 2,
              mt: 2,
              mb: 2,
              flexDirection: 'row',
              flexGrow: 1,
              px: 2,
            }}
          >
            <PropertyDetailsSubCard
              title="Yearly investment return"
              value={`${investmentReturn}%`}
            />
            <PropertyDetailsSubCard
              title="Funded date"
              value={date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            />
            <PropertyDetailsSubCard
              title="Current valuation"
              value={formatCurrency(currentValuation, 'USD', 'en-US')}
            />
          </Grid>
        </Card>
      </Grid>
    </Card>
  );
};
const actionButtons = (
  <Tooltip title="Edit" placement="bottom">
    <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: 'pointer', mx: 3 }}>
      <Icon color="inherit">edit</Icon>
    </MDTypography>
  </Tooltip>
);
const PropertyDetailsSubCard = ({ action, title, value }) => {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
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
export default PropertyDetails;
