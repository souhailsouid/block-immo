import MDBox from 'components/MDBox';
import { useNavigate } from 'react-router-dom';
import MDAlert from 'components/MDAlert';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

const DashboardKYC = () => {
  const navigate = useNavigate();
  return (
    <MDAlert
      color="warning"
      sx={{
        width: '100%',
        '& .MuiAlert-action': {
          padding: 0,
          margin: 0,
        },
      }}
    >
      {/* Messages à gauche */}
      <MDBox
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        <MDTypography variant="h6" color="white" mb={0.5}>
          Passport and address proof required
        </MDTypography>
        <MDTypography variant="caption" color="white">
          Local regulations require us to verify your passport and address before you can invest.
        </MDTypography>
      </MDBox>

      {/* Bouton à la place de l'icône de fermeture */}
      <MDButton
        variant="contained"
        color="warning"
        onClick={() => navigate('/onboarding/kyc/identity-verification')}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          whiteSpace: 'nowrap',
          minWidth: '120px',
        }}
      >
        <MDTypography variant="button" color="white" fontWeight="bold">
          Verify now
        </MDTypography>
      </MDButton>
    </MDAlert>
  );
};

export default DashboardKYC;
