import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useModal } from 'context/ModalContext';

const LogoutPage = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    // Ouvrir automatiquement la modal de confirmation
    openModal('logout-confirmation', {
      onClose: () => {
        // Rediriger vers le dashboard si l'utilisateur annule
        navigate('/dashboards/market-place', { replace: true });
      }
    });
  }, [openModal, navigate]);

  // Ce composant ne rend rien car la modal s'affiche automatiquement
  return null;
};

export default LogoutPage; 