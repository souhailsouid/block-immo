// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDProgress from 'components/MDProgress';
import MDButton from 'components/MDButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

// Material Dashboard 3 PRO React examples
import PropertyDetailsTable from 'examples/Tables/PropertyDetailsTable';
import Divider from '@mui/material/Divider';
// Data
import propertyDetailsTableData from 'layouts/dashboards/marketPlace/components/PropertyDetails/data/propertyDetailsTableData';
import { formatCurrencyWithLocale } from 'utils/currencyMapping';
import {
  canBuyStatus,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  shouldShowClosingDate,
} from 'constants/propertyStatus';
import { useRole } from 'context/RoleContext';
import CalculatorInvestmentsChart from "examples/Charts/CalculatorChart";
import Timeline from 'layouts/pages/projects/timeline';
import PropertyLocation from 'examples/Locations/PropertyLocation';
import Contact from 'examples/Contact';

// Modal context
import { useModal } from 'context/ModalContext';
// Hook personnalisé
import { usePropertyDetails } from 'hooks/usePropertyDetails';
// Protection des rôles
import { PropertyEditButtons, ForceUpdatePropertyEditButtons } from 'components/RoleBasedActionButtons';

// Material Dashboard 2 React Components
import MDBadge from "components/MDBadge";
import { useState, useEffect } from 'react';



const PropertyDetails = ({ propertyId }) => {
  const [forceUpdate, setForceUpdate] = useState(0);
  const { forceUpdateRole } = useRole();

  const {
    property,
    isLoading,
    error,
  } = usePropertyDetails(propertyId);

  // Écouter les changements d'authentification pour forcer la mise à jour
  useEffect(() => {
    const handleAuthStateChanged = () => {
      // Forcer la mise à jour des rôles et du composant
      setTimeout(() => {
        forceUpdateRole();
        setForceUpdate(prev => prev + 1);
      }, 300);
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [forceUpdateRole]);

  // Gestion des erreurs

  if (error) return <Alert severity="error">{error.message}</Alert>;

  // État de chargement
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} color="customBlue" />
        <MDTypography variant="body1" color="text.secondary">
          Loading property details...
        </MDTypography>
      </Box>
    );
  }

  // Si pas de propriété sélectionnée
  if (!property) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No property selected or property not found.
        </Alert>
      </Box>
    );
  }

  // Extraire les données de la propriété


  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2, md: 2 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        py: { xs: 1, sm: 2, md: 3, lg: 3 },
        maxWidth: '100%',
        minWidth: 0,
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // Media queries pour éviter les débordements
        '@media (max-width: 600px)': {
          px: 1,
          py: 1,
          gap: 1,
        },
        '@media (min-width: 601px) and (max-width: 900px)': {
          px: 1,
          py: 1,
          gap: 1,
        },
        '@media (min-width: 901px)': {
          px: 1,
          py: 1,
          gap: 1,
        },
        // Media queries spécifiques pour 767px à 1000px
        '@media (min-width: 767px) and (max-width: 1000px)': {
          px: 1,
          py: 1,
          gap: 1,
          flexDirection: 'column',
        },
      }}
    >
      {/* Container principal avec Grid Material-UI */}
      <Grid 
        container 
        spacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          alignItems: 'flex-start',
          // Media queries spécifiques pour 767px à 1000px
          '@media (min-width: 767px) and (max-width: 1000px)': {
            flexDirection: 'column',
            width: '100%',
            gap: 2,
            flex: '1 1 100%', // Force la prise de toute la largeur
          },
        }}
      >
        
        {/* Colonne 1 - Contenu principal */}
        <Grid 
          item 
          xs={12} 
          sm={12}
          md={8} 
          lg={8}
          xl={8}
          sx={{
            order: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            alignSelf: 'flex-start',
            mt: 0,
            pt: 0,
            // Media queries spécifiques pour 767px à 1000px
            '@media (min-width: 767px) and (max-width: 1000px)': {
              width: '100%',
              maxWidth: '100%',
              order: 2, // Force l'ordre pour cette plage
              flex: '1 1 100%', // Force la prise de toute la largeur
            },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <PropertyDetailsCard
              property={property}
            />
          </Box>
        </Grid>

        {/* Colonne 2 - Détails de prix */}
        <Grid 
          item 
          xs={12} 
          sm={10}
          md={4} 
          lg={4}
          xl={4}
          sx={{
            order: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            // Media queries spécifiques pour 767px à 1000px
            '@media (min-width: 767px) and (max-width: 1000px)': {
              width: '100%',
              maxWidth: '100%',
              order: 1, // Force l'ordre pour cette plage
              mb: 2, // Ajoute une marge en bas
              flex: '1 1 100%', // Force la prise de toute la largeur
            },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <PropertyPriceDetails key={`property-${property.propertyId}-${property.status}`} property={property} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
PropertyDetails.propTypes = {
  propertyId: PropTypes.string.isRequired,
};


const PropertyDetailsCard = ({
  property
}) => {
  const { openModal } = useModal();
  const {
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
    latitude,
    longitude,
    propertyId,
    locationDescription,
    currency,
    description,

  } = property;


  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        position: 'relative',
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: '0 4px 12px rgba(0,0,0,0.15)' },
        overflow: 'hidden', // Empêche les débordements
        boxSizing: 'border-box',
        // Media queries pour éviter les débordements
        '@media (max-width: 600px)': {
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        '@media (min-width: 601px) and (max-width: 900px)': {
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        '@media (min-width: 901px)': {
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        // Media queries spécifiques pour 767px à 1000px
        '@media (min-width: 767px) and (max-width: 1000px)': {
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
        },
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
        <PropertyEditButtons>
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
              onClick={() => {
                if (!propertyId) {
                  // Gérer l'erreur silencieusement
                  return;
                }
                openModal('property-details', {
                  title,
                  propertyType,
                  bedrooms,
                  status,
                  surface,
                  energyClass,
                  yearBuilt,
                  bathrooms,
                  propertyId,
                  description
                });
              }}
            >
              <Icon sx={{ color: '#4472c4', fontSize: { xs: 18, sm: 20, md: 22 } }}>edit</Icon>
            </MDBox>
          </Tooltip>
        </PropertyEditButtons>
      </MDBox>

      <MDBox sx={{ 
        p: { xs: 2, sm: 3, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <MDTypography
          variant="h4"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2.125rem' },
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.3, lg: 1.3 },
            mb: { xs: 1, sm: 1, md: 1, lg: 1 },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          {title}
        </MDTypography>
        <MDTypography
          variant="body2"
          color="text"
          sx={{
            fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '14px' },
            mb: { xs: 1.5, sm: 2, md: 2, lg: 2 },
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 0.75, md: 1, lg: 1 },
            alignItems: 'center',
            lineHeight: { xs: 1.3, sm: 1.4, md: 1.4, lg: 1.4 },
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            {propertyType}
          </Box>
          <Box component="span">•</Box>
          <Box component="span">{bedrooms} rooms</Box>
          <Box component="span">•</Box>
          <Box component="span" >
            {getStatusLabel(status)}
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

      <MDBox sx={{ 
        p: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          
          {/* Section Property Details Table */}
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <ForceUpdatePropertyEditButtons key="edit-details">
              <MDBox
                sx={{
                  position: 'absolute',
                  top: { xs: 4, sm: 6, md: 8, lg: 8 },
                  right: { xs: 4, sm: 6, md: 8, lg: 8 },
                  zIndex: 10,
                }}
              >
                <Tooltip title="Edit Property Details" placement="bottom">
                  <MDBox
                    sx={{
                      width: { xs: 24, sm: 28, md: 32, lg: 32 },
                      height: { xs: 24, sm: 28, md: 32, lg: 32 },
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
                    onClick={() => {
                      if (!propertyId) {
                        return;
                      }
                      openModal('property-details-table', {
                        city,
                        country,
                        countryCode,
                        brutYield,
                        netYield,
                        pricePerSquareFoot,
                        propertyId
                      });
                    }}
                  >
                    <Icon sx={{ color: '#4472c4', fontSize: { xs: 14, sm: 16, md: 18, lg: 18 } }}>edit</Icon>
                  </MDBox>
                </Tooltip>
              </MDBox>
            </ForceUpdatePropertyEditButtons>
            <PropertyDetailsTable
              rows={propertyDetailsTableData(
                city,
                country,
                countryCode,
                brutYield,
                netYield,
                pricePerSquareFoot,
                currency,
                propertyId,
              )}
              shadow={false}
            />
          </Grid>

          {/* Section Timeline */}
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <ForceUpdatePropertyEditButtons key="edit-timeline">
              <MDBox
                sx={{
                  position: 'absolute',
                  top: { xs: 4, sm: 6, md: 8, lg: 8 },
                  right: { xs: 4, sm: 6, md: 8, lg: 8 },
                  zIndex: 10,
                }}
              >
                <Tooltip title="Edit Timeline" placement="bottom">
                  <MDBox
                    sx={{
                      width: { xs: 24, sm: 28, md: 32, lg: 32 },
                      height: { xs: 24, sm: 28, md: 32, lg: 32 },
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
                    onClick={() => {
                      if (!propertyId) {
                        return;
                      }
                      openModal('property-timeline', { propertyId, timelineData: property.timelineData });
                    }}
                  >
                    <Icon sx={{ color: '#4472c4', fontSize: { xs: 14, sm: 16, md: 18, lg: 18 } }}>edit</Icon>
                  </MDBox>
                </Tooltip>
              </MDBox>
            </ForceUpdatePropertyEditButtons>
            <Timeline timelineData={property.timelineData} />
          </Grid>

          {/* Section Calculator Chart */}
          <Grid item xs={12}>
            <CalculatorInvestmentsChart property={property} />
          </Grid>

          {/* Section Property Location */}
          <Grid item xs={12} sx={{ position: 'relative' }}>
            <ForceUpdatePropertyEditButtons key="edit-location">
              <MDBox
                sx={{
                  position: 'absolute',
                  top: { xs: 4, sm: 6, md: 8, lg: 8 },
                  right: { xs: 4, sm: 6, md: 8, lg: 8 },
                  zIndex: 10,
                }}
              >
                <Tooltip title="Edit Property Location" placement="bottom">
                  <MDBox
                    sx={{
                      width: { xs: 24, sm: 28, md: 32, lg: 32 },
                      height: { xs: 24, sm: 28, md: 32, lg: 32 },
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
                    onClick={() => {
                      if (!propertyId) {
                        return;
                      }
                      openModal('property-location', {
                        city,
                        country,
                        address,
                        description: locationDescription,
                        lat: latitude,
                        lng: longitude,
                        propertyId
                      });
                    }}
                  >
                    <Icon sx={{ color: '#4472c4', fontSize: { xs: 14, sm: 16, md: 18, lg: 18 } }}>edit</Icon>
                  </MDBox>
                </Tooltip>
              </MDBox>
            </ForceUpdatePropertyEditButtons>
            <PropertyLocation
              city={city}
              country={country}
              address={address}
              description={locationDescription}
              lat={latitude}
              lng={longitude}
            />
          </Grid>

          {/* Section Contact */}
          <Grid item xs={12} sx={{ mb: { xs: 1, sm: 2, md: 2, lg: 2 } }}>
            <Contact />
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
};
PropertyDetailsCard.propTypes = {
  property: PropTypes.object.isRequired,
};

const PropertyPriceDetails = ({
  property,
}) => {
  const {
    propertyPrice,
    numberOfInvestors,
    status,
    fundingDate,
    closingDate,
    yearlyInvestmentReturn,
    currency,
    propertyId,
    country,
  } = property;

  const { openModal } = useModal();
  const { userRole } = useRole();
  // Validation sécurisée du statut avec fallback
  const validatedStatus = status;
  const handleBuyShares = () => {
    openModal('buy-shares', {
      propertyId,
      propertyPrice,
      numberOfInvestors,
      status,
      yearlyInvestmentReturn,
      currency,
      fundingDate,
      closingDate,
    });
  };
  const isInvestor = userRole === 'INVESTOR';
  return (
    <Card sx={{ 
      width: '100%', 
      maxWidth: '100%',
      minWidth: 0,
      position: 'relative',
      borderRadius: { xs: 2, sm: 3 },
      boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: '0 4px 12px rgba(0,0,0,0.15)' },
      overflow: 'hidden',
      boxSizing: 'border-box',
      alignSelf: 'flex-start',
      mt: 0,
      pt: 0,
      // Media queries pour éviter les débordements
      '@media (max-width: 600px)': {
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      '@media (min-width: 601px) and (max-width: 900px)': {
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      '@media (min-width: 901px)': {
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      // Media queries spécifiques pour 767px à 1000px
      '@media (min-width: 767px) and (max-width: 1000px)': {
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        position: 'static', // Pas de sticky sur cette plage
      },
    }}>
      {/* Action Button */}
      <MDBox
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 10,
        }}
      >
        <ForceUpdatePropertyEditButtons key="edit-price">
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
              onClick={() => {
                if (!propertyId) {
                  return;
                }
                openModal('property-price', {
                  propertyId,
                  propertyPrice,
                  numberOfInvestors,
                  status,
                  fundingDate,
                  closingDate,
                  yearlyInvestmentReturn,
                  country, // Envoyer le pays au lieu de la devise
                });
              }}
            >
              <Icon sx={{ color: '#4472c4', fontSize: { xs: 18, sm: 20, md: 22 } }}>edit</Icon>
            </MDBox>
          </Tooltip>
        </ForceUpdatePropertyEditButtons>
      </MDBox>

      <MDBox sx={{ p: 2 }}>
        {/* Prix de la propriété */}
        <MDTypography variant="body2" sx={{ 
          fontSize: '14px', 
          textAlign: 'center', 
          mb: 1,
          color: 'text.secondary',
          fontWeight: 'medium'
        }}>
          Property Price
        </MDTypography>
        <MDTypography variant="h4" color="info" sx={{ 
          mb: 2, 
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.125rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          // Amélioration de l'affichage du prix
          '&::before': {
            content: '""',
            display: 'block',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(68, 114, 196, 0.3), transparent)',
            marginBottom: '8px',
            borderRadius: '1px'
          }
        }}>
          {formatCurrencyWithLocale(propertyPrice, currency)}
        </MDTypography>

        {/* Badge de statut */}
        <MDBox sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 2,
          '& .MuiBadge-badge': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 'bold',
            padding: { xs: '4px 8px', sm: '6px 12px' }
          }
        }}>
          <MDBadge
            badgeContent={getStatusLabel(validatedStatus)}
            container
            color={getStatusColor(validatedStatus)}
            icon={<Icon>{getStatusIcon(validatedStatus)}</Icon>}
          />
        </MDBox>

        {/* Barre de progression - pour les statuts avec progression */}
        {(validatedStatus === 'FUNDING' || validatedStatus === 'FUNDED' || validatedStatus === 'CANCELLED') && (
          <MDBox sx={{ mb: 2 }}>
            <MDBox sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <MDTypography variant="body2" color="text" sx={{ 
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                fontWeight: 'medium'
              }}>
                {validatedStatus === 'FUNDED' ? 'Fully Funded' : validatedStatus === 'CANCELLED' ? 'Cancelled' : 'Funding Progress'}
              </MDTypography>
              <MDTypography
                variant="body2"
                color="text"
                sx={{ 
                  fontSize: { xs: '11px', sm: '12px', md: '13px' }, 
                  fontWeight: 'bold',
                  color: validatedStatus === 'FUNDED' ? 'success.main' : validatedStatus === 'CANCELLED' ? 'error.main' : 'info.main'
                }}
              >
                {validatedStatus === 'FUNDED' ? '100%' : validatedStatus === 'CANCELLED' ? '0%' : '75%'}
              </MDTypography>
            </MDBox>
            <MDProgress
              value={validatedStatus === 'FUNDED' ? 100 : validatedStatus === 'CANCELLED' ? 0 : 75}
              variant="gradient"
              color={validatedStatus === 'FUNDED' ? 'success' : validatedStatus === 'CANCELLED' ? 'error' : 'info'}
              sx={{ 
                height: { xs: '6px', sm: '7px', md: '8px' }, 
                borderRadius: '4px',
                '& .MuiLinearProgress-bar': {
                  borderRadius: '4px'
                }
              }}
            />
          </MDBox>
        )}

        {/* Statistiques d'investissement */}
        <MDBox sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text" sx={{ 
                fontSize: { xs: '10px', sm: '11px', md: '12px' },
                fontWeight: 'medium',
                color: 'text.secondary'
              }}>
                Annual Return
              </MDTypography>
              <MDTypography variant="h6" color="success" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.01em'
              }}>
                {yearlyInvestmentReturn}%
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>

        {/* Bouton d'achat - selon le statut */}
        {canBuyStatus(validatedStatus) && isInvestor && (
          <MDButton
            variant="contained"
            color="customBlue"
            startIcon={<Icon>shopping_cart</Icon>}
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
            onClick={handleBuyShares}
          >
            {validatedStatus === 'FUNDING' ? 'Invest Now' : 'Buy Shares'}
          </MDButton>
        )}

        {/* Message d'information pour les statuts non-achetables */}
        {!canBuyStatus(validatedStatus) && (
          <MDBox sx={{
            mt: 2,
            mb: 2,
            p: 2,
            backgroundColor: 'grey.100',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <MDTypography variant="body2" color="text.secondary">
              {validatedStatus === 'FUNDED' && 'This property is fully funded and no longer accepting investments'}
              {validatedStatus === 'PENDING' && 'This property will be available for investment soon'}
              {validatedStatus === 'CANCELLED' && 'This property investment has been cancelled'}
              {validatedStatus === 'SOLD' && 'This property has been sold'}
            </MDTypography>
          </MDBox>
        )}

        {/* Informations supplémentaires */}
        <Card sx={{ 
          width: '100%', 
          backgroundColor: 'grey.50', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <MDBox sx={{ 
            p: { xs: 1.5, sm: 2, md: 2, lg: 2 },
            background: 'linear-gradient(135deg, rgba(68, 114, 196, 0.05) 0%, rgba(68, 114, 196, 0.02) 100%)'
          }}>
            <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2 }}>
              {yearlyInvestmentReturn && (
                <PropertyDetailsSubCard
                  title="Yearly investment return"
                  value={`${yearlyInvestmentReturn}%`}
                />
              )}

              {fundingDate && (
                <PropertyDetailsSubCard
                  title="Funded date"
                  value={new Date(fundingDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                />
              )}

              {shouldShowClosingDate(validatedStatus) && closingDate && (
                <PropertyDetailsSubCard
                  title="Closing Date"
                  value={new Date(closingDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                />
              )}
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
    </Card>
  );
};

PropertyPriceDetails.propTypes = {
  property: PropTypes.object.isRequired,
};
const PropertyDetailsSubCard = ({ title, value }) => {
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
          alignItems: 'center',
          py: { xs: 0.5, sm: 0.75, md: 1, lg: 1 },
          px: { xs: 0.5, sm: 0.75, md: 1, lg: 1 },
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(68, 114, 196, 0.05)',
            transform: 'translateX(2px)'
          }
        }}
      >
        <MDTypography variant="body2" color="text" sx={{
          fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px' },
          fontWeight: 'medium',
          color: 'text.secondary',
          lineHeight: 1.3,
          flex: '1 1 auto',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
          {title}
        </MDTypography>

        <MDTypography variant="body2" sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '12px' },
          color: 'text.primary',
          lineHeight: 1.3,
          textAlign: 'right',
          flex: '0 0 auto',
          minWidth: 'fit-content',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
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

export default PropertyDetails;

