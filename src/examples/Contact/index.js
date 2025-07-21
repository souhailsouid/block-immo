import { useState } from 'react';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Card from '@mui/material/Card';
import MDButton from 'components/MDButton';

// @mui material components
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';

import ContactUsTwo from 'examples/Contact/ContactUs';
import NotificationModal from 'examples/Notifications/NotificationModal';

export const SimpleModal = () => {
  const [show, setShow] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  
  const toggleModal = () => setShow(!show);
  
  // Fonction appelée quand le formulaire est envoyé avec succès
  const handleFormSuccess = () => {
    setShow(false); // Ferme la modal du formulaire
    setIsMessageSent(true);
    setShowSuccessModal(true); // Ouvre la modal de succès
  };

  // Fonction pour fermer la modal de succès
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsMessageSent(false);
  };

  return (
    <MDBox component="section">
      <MDButton variant="contained" color="customBlue" onClick={toggleModal}>
        Contact us
      </MDButton>
      <Modal 
        open={show} 
        onClose={toggleModal} 
        sx={{ 
          display: 'grid', 
          placeItems: 'center',
          zIndex: 1300
        }}
        disableScrollLock={false}
        keepMounted={false}
      >
        <Slide direction="down" in={show} timeout={500}>
          <MDBox sx={{ 
            width: '90%', 
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <ContactUsTwo 
              toggleModal={toggleModal} 
              onFormSuccess={handleFormSuccess}
            />
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
          zIndex: 1400 // Plus élevé que la modal du formulaire
        }}
        disableScrollLock={false}
        keepMounted={false}
      >
        <Slide direction="down" in={showSuccessModal} timeout={500}>
          <MDBox sx={{ width: '90%', maxWidth: '500px' }}>
            <NotificationModal 
              isMessageSent={isMessageSent}
              onClose={handleCloseSuccessModal}
            />
          </MDBox>
        </Slide>
      </Modal>
    </MDBox>
  );
}

const Contact = () => {
  return (
    <Card sx={{ border: 'none', borderRadius: '10px', boxShadow: 'none' }}>
      <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MDBox pt={3} px={3}>
          <MDBox display="flex" alignItems="center" gap={1} mb={1}>
            <MDTypography variant="h5" color="dark" sx={{ alignSelf: 'center' }}>
              Have more questions about this property?
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDTypography variant="body1" sx={{ fontSize: '14px', mb: 1 }}>
              Contact our real estate experts
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center">
            <SimpleModal />
          </MDBox>

        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Contact;
