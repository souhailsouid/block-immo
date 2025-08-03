import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { jwtDecode } from 'jwt-decode';
import { profileService } from 'services/api/modules/auth/profileService';

/**
 * Hook pour récupérer les informations de l'utilisateur connecté
 * @returns {Object} Les informations utilisateur et l'état de chargement
 */
export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer l'utilisateur actuel
        const currentUser = await getCurrentUser();
        
        // Récupérer la session pour obtenir le token
        const { tokens } = await fetchAuthSession();
        
        if (tokens?.idToken) {
          const idToken = tokens.idToken.toString();
          const decoded = jwtDecode(idToken);
          
                  // Extraire les informations utilisateur du token
        const baseProfile = {
          username: currentUser.username,
          userId: decoded.sub,
          email: decoded.email,
          firstName: decoded.given_name || '',
          lastName: decoded.family_name || '',
          fullName: `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim(),
          emailVerified: decoded.email_verified || false,
          groups: decoded["cognito:groups"] || [],
          // Photo de profil (si disponible dans les attributs)
          profilePicture: decoded.picture || null,
          // Rôle principal
          primaryRole: getPrimaryRole(decoded["cognito:groups"] || []),
          // Informations supplémentaires
          authTime: decoded.auth_time,
          tokenExp: decoded.exp
        };

        // Récupérer les données complètes depuis DynamoDB
        try {
          const dbProfile = await profileService.getUserProfile();
          if (dbProfile && dbProfile.success) {
            // Parser l'avatar s'il est une chaîne JSON
            let parsedAvatar = null;
            if (dbProfile.data?.avatar) {
              try {
                parsedAvatar = typeof dbProfile.data.avatar === 'string' 
                  ? JSON.parse(dbProfile.data.avatar) 
                  : dbProfile.data.avatar;
              } catch (parseError) {
                 
                console.log('Erreur parsing avatar:', parseError);
                parsedAvatar = null;
              }
            }

            // Fusionner les données Cognito avec les données DynamoDB
            const completeProfile = {
              ...baseProfile,
              ...dbProfile.data,
              // Remplacer l'avatar par l'objet parsé
              avatar: parsedAvatar,
              // Garder les données Cognito en priorité pour certains champs
              username: baseProfile.username,
              userId: baseProfile.userId,
              email: baseProfile.email,
              emailVerified: baseProfile.emailVerified,
              groups: baseProfile.groups,
              primaryRole: baseProfile.primaryRole,
              authTime: baseProfile.authTime,
              tokenExp: baseProfile.tokenExp
            };
                        setUserProfile(completeProfile);
            
             
            console.log('Propriétés récupérées:', completeProfile);
          } else {
            setUserProfile(baseProfile);
          }
        } catch (dbError) {
           
          console.log('Erreur récupération DynamoDB:', dbError);
          setUserProfile(baseProfile);
        }
        
        // Stocker dans localStorage pour un accès rapide
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
          
        } else {
          throw new Error('Token non disponible');
        }
        
      } catch (error) {
        setError(error.message);
        
        // Essayer de récupérer depuis localStorage
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          try {
            setUserProfile(JSON.parse(storedProfile));
          } catch (parseError) {
            }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fonction pour déterminer le rôle principal
  const getPrimaryRole = (groups) => {
    if (groups.includes('admin')) return 'ADMIN';
    if (groups.includes('professional')) return 'PROFESSIONAL';
    return 'INVESTOR'; // Rôle par défaut
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = (newData) => {
    const updatedProfile = { ...userProfile, ...newData };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  // Fonction pour rafraîchir le profil
  const refreshProfile = async () => {
    setIsLoading(true);
    try {
      const { tokens } = await fetchAuthSession();
      if (tokens?.idToken) {
        const idToken = tokens.idToken.toString();
        const decoded = jwtDecode(idToken);
        
        const profile = {
          username: userProfile?.username || '',
          userId: decoded.sub,
          email: decoded.email,
          firstName: decoded.given_name || '',
          lastName: decoded.family_name || '',
          fullName: `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim(),
          emailVerified: decoded.email_verified || false,
          groups: decoded["cognito:groups"] || [],
          profilePicture: decoded.picture || null,
          primaryRole: getPrimaryRole(decoded["cognito:groups"] || []),
          authTime: decoded.auth_time,
          tokenExp: decoded.exp
        };

        setUserProfile(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProfile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
    // Propriétés dérivées pour faciliter l'accès
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    fullName: userProfile?.fullName || '',
    email: userProfile?.email || '',
    profilePicture: userProfile?.profilePicture || null,
    primaryRole: userProfile?.primaryRole || 'INVESTOR',
    groups: userProfile?.groups || [],
    isAuthenticated: !!userProfile
  };
}; 