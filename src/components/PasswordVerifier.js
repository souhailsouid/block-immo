import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import authService from 'services/authService';

const PasswordVerifier = ({ challengeData, onSuccess, onError }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Le mot de passe est requis'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handlePasswordVerification = async (data) => {
    try {
      setLoading(true);
      
      // Appeler le service pour compléter le challenge
      const result = await authService.completePasswordChallenge({
        username: challengeData.USERNAME,
        password: data.password,
        challengeResponses: challengeData.ChallengeResponses,
        session: challengeData.Session
      });
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        // Redirection par défaut
        navigate('/dashboard');
      }
      
    } catch (error) {
      setError('root', { 
        type: 'manual', 
        message: error.message || 'Erreur lors de la vérification du mot de passe' 
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBox p={3} bgcolor="info.light" borderRadius={2}>
      <MDTypography variant="h5" color="info.dark" mb={3} textAlign="center">
        🔐 Vérification du mot de passe
      </MDTypography>
      
      <MDTypography variant="body2" color="text.secondary" mb={3}>
        Pour finaliser votre inscription, veuillez entrer votre mot de passe :
      </MDTypography>

      <MDBox component="form" onSubmit={handleSubmit(handlePasswordVerification)}>
        <MDBox mb={2}>
          <MDInput
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <MDButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </MDButton>
              ),
            }}
          />
        </MDBox>

        {errors.root && (
          <MDBox mb={2} p={2} bgcolor="error.light" borderRadius={1}>
            <MDTypography variant="body2" color="error">
              {errors.root.message}
            </MDTypography>
          </MDBox>
        )}

        <MDBox mt={3}>
          <MDButton
            variant="gradient"
            color="info"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? 'Vérification...' : '✅ Confirmer le mot de passe'}
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox mt={2} textAlign="center">
        <MDTypography variant="body2" color="text.secondary">
          Email: {challengeData?.USERNAME}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default PasswordVerifier; 