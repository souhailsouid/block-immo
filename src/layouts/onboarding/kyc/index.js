import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// Image
// import bgImage from 'assets/images/illustrations/illustration-real-estate.png';
import fractional_real_estate from 'assets/images/fractional_real_estate.png';
// Import the NotificationNavbar component
import NotificationNavbar from 'layouts/pages/notifications/NotificationNavbar';
import kycOnboarding from 'assets/images/onboarding/kyc_onboarding.png';
import { SimpleModal } from 'layouts/onboarding/kyc/modal';

const OnBoardingKYC = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleDoLater = () => {
    navigate('/dashboards/market-place');
  };

  return (
    <MDBox>
      {showSuccessMessage && (
        <NotificationNavbar
          color="customBlue"
          title="Account created successfully!"
          description="Please check your email for verification."
          fontSize="medium"
          dismissible={true}
          onClose={() => setShowSuccessMessage(false)}
          showSuccessMessage={showSuccessMessage}
        />
      )}
      <IllustrationLayout
        title="Upload your passport"
        description="Financial regulations require us to verify your identity before you can invest. This helps protect your investment and allows us to register you as the legal owner of each property you invest in."
        illustration={fractional_real_estate}
        isNotification={showSuccessMessage}
        message="Account created successfully, please check your email for verification."
        setNotification={setShowSuccessMessage}
      >
        <MDBox component="form" role="form">
          {/* Exemples de passeport avec l'image complète */}
          <MDBox mb={4} textAlign="center">
            <MDBox
              sx={{
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={kycOnboarding}
                alt="Passport verification examples"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </MDBox>
          </MDBox>

          {/* Boutons d'action */}
          <MDBox mt={4} mb={2} textAlign="center">
            <SimpleModal onClose={() => setShowSuccessMessage(false)} />

            <MDButton
              variant="text"
              color="success"
              onClick={handleDoLater}
              sx={{ textTransform: 'none' }}
            >
              Do this later
            </MDButton>
          </MDBox>

          {/* Footer avec IDWise */}
          <MDBox mt={4} textAlign="center">
            <MDTypography
              variant="caption"
              color="text"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
            >
              Powered by
              <MDBox
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                <MDBox
                  component="span"
                  sx={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'inline-block',
                  }}
                />
                IDWise
              </MDBox>
            </MDTypography>
          </MDBox>
        </MDBox>
      </IllustrationLayout>
    </MDBox>
  );
};

export default OnBoardingKYC;
