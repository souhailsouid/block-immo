import { useState, useEffect } from 'react';

export const useAvatar = () => {
  const [currentAvatar, setCurrentAvatar] = useState(null);

  useEffect(() => {
    // Charger l'avatar depuis localStorage au montage
    try {
      const savedAvatar = window?.localStorage?.getItem('userAvatar');
      if (savedAvatar) {
        const parsed = JSON.parse(savedAvatar);
        setCurrentAvatar(parsed);
      }
    } catch (error) {
      // Ignorer les erreurs de parsing
    }
  }, []);

  const updateAvatar = (newAvatar) => {
    setCurrentAvatar(newAvatar);
    // Sauvegarder dans localStorage
    try {
      window?.localStorage?.setItem('userAvatar', JSON.stringify(newAvatar));
    } catch (error) {
      // Ignorer les erreurs de localStorage
    }
  };

  return {
    currentAvatar,
    updateAvatar,
  };
}; 