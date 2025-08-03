import { useState, useEffect } from 'react';
import { profileService } from 'services/api/modules/auth/profileService';
import { checkUserGroups } from 'utils/cognitoUtils';

/**
 * Hook pour récupérer et gérer le profil utilisateur depuis DynamoDB
 */
export const useUserProfileDynamo = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer le profil
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await profileService.getUserProfile();
      
      if (response.success) {
        // Récupérer le rôle depuis Cognito plutôt que DynamoDB
        const cognitoResult = await checkUserGroups();
        const cognitoGroups = cognitoResult.groups || [];
        const cognitoRole = cognitoGroups.includes('professional') ? 'PROFESSIONAL' : 
                           cognitoGroups.includes('admin') ? 'ADMIN' : 'INVESTOR';
        
        const profileWithCorrectRole = {
          ...response.data,
          role: cognitoRole // Utiliser le rôle de Cognito
        };
        
        setUserProfile(profileWithCorrectRole);
        } else {
        setError(response.error || 'Erreur lors de la récupération du profil');
        }
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération du profil');
      } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour le profil local
  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
  };

  // Fonction pour rafraîchir le profil
  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  // Charger le profil au montage du composant
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Extraire les propriétés communes
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const email = userProfile?.email || '';
  const fullName = userProfile ? `${firstName} ${lastName}`.trim() : '';
  const role = userProfile?.role || 'INVESTOR';

  return {
    userProfile: userProfile || null,
    isLoading,
    error,
    firstName,
    lastName,
    email,
    fullName,
    role,
    updateProfile,
    refreshProfile,
    fetchUserProfile
  };
}; 