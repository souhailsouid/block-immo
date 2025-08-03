// src/hooks/useFractionalProfile.js
import { useState, useEffect } from 'react';
import { fractionalProfileService } from 'services/api/modules/auth/fractionalProfileService';

export const useFractionalProfile = () => {
  const [fractionalProfile, setFractionalProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFractionalProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fractionalProfileService.getFractionalProfile();
      if (response.success) {
        setFractionalProfile(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch fractional profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFractionalProfile = async (profileData) => {
    try {
      const response = await fractionalProfileService.updateFractionalProfile(profileData);
      
      if (response.success) {
        setFractionalProfile(response.data);
        return { success: true, message: response.message };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshProfile = () => {
    fetchFractionalProfile();
  };

  useEffect(() => {
    fetchFractionalProfile();
  }, []);

  return {
    fractionalProfile,
    isLoading,
    error,
    updateFractionalProfile,
    refreshProfile
  };
};