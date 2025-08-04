import React from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';

const InvestmentPreferences = ({ profile }) => {
  const preferences = profile?.investmentPreferences || {};
  
  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getRiskLevelText = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'Faible';
      case 'medium': return 'Modéré';
      case 'high': return 'Élevé';
      default: return 'Non défini';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getPropertyTypes = () => {
    if (!preferences.propertyTypes || preferences.propertyTypes.length === 0) {
      return ['Aucune préférence définie'];
    }
    return preferences.propertyTypes;
  };

  const InfoItem = ({ icon, label, children }) => (
    <MDBox mb={3}>
      <MDBox display="flex" alignItems="center" mb={1}>
        {icon}
        <MDTypography variant="body2" fontWeight="medium" ml={1} color="text">
          {label}
        </MDTypography>
      </MDBox>
      <MDBox ml={3}>
        {children}
      </MDBox>
    </MDBox>
  );

  return (
    <Card>
      <MDBox p={3}>
        <MDBox mb={3}>
          <MDTypography variant="h6" fontWeight="medium">
            Préférences d'investissement
          </MDTypography>
        </MDBox>
        
        <MDBox>
          <InfoItem
            icon={<HomeIcon fontSize="small" color="primary" />}
            label="Types de propriétés"
          >
            <MDBox display="flex" flexWrap="wrap" gap={1}>
              {getPropertyTypes().map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </MDBox>
          </InfoItem>
          
          <InfoItem
            icon={<SecurityIcon fontSize="small" color="primary" />}
            label="Niveau de risque"
          >
            <Chip
              label={getRiskLevelText(preferences.riskLevel)}
              size="small"
              color={getRiskLevelColor(preferences.riskLevel)}
            />
          </InfoItem>
          
          <InfoItem
            icon={<MonetizationOnIcon fontSize="small" color="primary" />}
            label="Budget d&apos;investissement"
          >
            <MDTypography variant="body1" color="dark">
              {formatCurrency(preferences.minInvestment)} - {formatCurrency(preferences.maxInvestment)}
            </MDTypography>
          </InfoItem>
          
          <InfoItem
            icon={<TrendingUpIcon fontSize="small" color="primary" />}
            label="Rendement attendu"
          >
            <MDTypography variant="body1" color="dark">
              {preferences.expectedReturn ? `${preferences.expectedReturn}%` : 'Non défini'}
            </MDTypography>
          </InfoItem>
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default InvestmentPreferences; 