import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material-UI components
import { Card, Grid } from '@mui/material';

const InvestmentSuccessModal = ({ investmentData, onClose }) => {
  const navigate = useNavigate();

  const handleViewPortfolio = () => {
    navigate('/investor');
    onClose();
  };

  const handleViewProperty = () => {
    navigate(`/properties/${investmentData.propertyId}`);
    onClose();
  };

  return (
    <MDBox px={3} py={2}>
      <MDBox textAlign="center" mb={3}>
        <MDBox
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2
          }}
        >
          <MDTypography variant="h3" color="white">
            ✅
          </MDTypography>
        </MDBox>
        
        <MDTypography variant="h5" fontWeight="bold" mb={2} color="success.main">
          Investment Successful!
        </MDTypography>
        
        <MDTypography variant="body1" color="text" mb={3}>
          Congratulations! Your investment has been processed successfully.
        </MDTypography>
      </MDBox>

      {/* Détails de l'investissement */}
      <Card sx={{ mb: 3 }}>
        <MDBox p={3}>
          <MDTypography variant="h6" fontWeight="bold" mb={3} color="customBlue">
            📊 Investment Details
          </MDTypography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Transaction ID
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold">
                {investmentData.transactionId}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Investment ID
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold">
                {investmentData.investmentId}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Amount Invested
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold" color="success">
                €{investmentData.investment.toLocaleString()}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Blocks Purchased
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold">
                {investmentData.blocks.toLocaleString()}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Ownership Percentage
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold">
                {investmentData.ownershipPercentage}%
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Status
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold" color="success">
                {investmentData.status}
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </Card>

      {/* Estimations de rendement */}
      <Card sx={{ mb: 3 }}>
        <MDBox p={3}>
          <MDTypography variant="h6" fontWeight="bold" mb={3} color="customBlue">
            📈 Return Estimates
          </MDTypography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Annual Return
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold" color="success">
                €{investmentData.estimatedReturnYear}
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="body2" color="text">
                Quarterly Return
              </MDTypography>
              <MDTypography variant="body1" fontWeight="bold" color="success">
                €{investmentData.estimatedReturnQuarter}
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </Card>

      {/* Prochaines étapes */}
      <MDBox mb={3} py={2} px={3} borderRadius="md" sx={{ 
        backgroundColor: 'info.light', 
        border: '1px solid #2196f3' 
      }}>
        <MDTypography variant="h6" fontWeight="bold" mb={2} color="info.dark">
          🎯 Next Steps
        </MDTypography>
        
        <MDTypography variant="body2" color="info.dark" mb={1}>
          📧 A confirmation email has been sent to your registered email address.
        </MDTypography>
        <MDTypography variant="body2" color="info.dark" mb={1}>
          📱 You can track your investment in your portfolio dashboard.
        </MDTypography>
        <MDTypography variant="body2" color="info.dark">
          💰 Returns will be distributed quarterly to your registered bank account.
        </MDTypography>
      </MDBox>

      {/* Boutons d'action */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <MDButton variant="outlined" color="secondary" onClick={onClose}>
          Close
        </MDButton>
        <MDBox display="flex" gap={2}>
          <MDButton
            variant="outlined"
            color="customBlue"
            onClick={handleViewProperty}
          >
            View Property
          </MDButton>
          <MDButton
            variant="contained"
            color="customBlue"
            onClick={handleViewPortfolio}
          >
            View Portfolio
          </MDButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

InvestmentSuccessModal.propTypes = {
  investmentData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InvestmentSuccessModal; 