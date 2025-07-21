import { useState } from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';

import KYCSteps from 'layouts/onboarding/kyc/steps';
import NotificationModal from 'examples/Notifications/NotificationModal';
export const SimpleModal = () => {
  const [show, setShow] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const toggleModal = () => setShow(!show);

  // Fonction pour fermer la modal de succès
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsMessageSent(false);
  };

  return (
    <MDBox component="section">
      <MDButton
        variant="contained"
        color="customBlue"
        size="large"
        fullWidth
        onClick={toggleModal}
        sx={{
          borderRadius: '10px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          textTransform: 'none',
          mb: 2,
        }}
      >
        Start Verification
      </MDButton>
      <Modal
        open={show}
        onClose={toggleModal}
        sx={{
          display: 'grid',
          placeItems: 'center',
          zIndex: 1300,
        }}
        disableScrollLock={false}
        keepMounted={false}
      >
        <Slide direction="down" in={show} timeout={500}>
          <MDBox
            sx={{
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <KYCSteps onClose={toggleModal} setShowSuccessModal={setShowSuccessModal} setShow={setShow} />
          </MDBox>
        </Slide>
      </Modal>

      {/* Modal de succès */}
      <Modal
        open={showSuccessModal}
        onClose={handleCloseSuccessModal}
        sx={{
          display: 'grid',
          placeItems: 'center',
          zIndex: 1400, // Plus élevé que la modal du formulaire
        }}
        disableScrollLock={false}
        keepMounted={false}
      >
        <Slide direction="down" in={showSuccessModal} timeout={500}>
          <MDBox sx={{ width: '90%', maxWidth: '500px' }}>
            <NotificationModal isMessageSent={isMessageSent} onClose={handleCloseSuccessModal}
            title="KYC Verification"
            message="Your KYC verification is in progress. We will get back to you within 24 hours."
            />
          </MDBox>
        </Slide>
      </Modal>
    </MDBox>
  );
};
