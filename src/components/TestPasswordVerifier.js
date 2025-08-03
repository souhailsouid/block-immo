import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import authService from 'services/authService';

const TestPasswordVerifier = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const handlePasswordVerification = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      // Simuler les données du challenge
      const challengeData = {
        USERNAME: 'souhailsouidpro@gmail.com',
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeResponses: { 
          USERNAME: 'souhailsouidpro@gmail.com',
          NEW_PASSWORD: data.newPassword
        },
        password: data.newPassword
      };
      
      // Appeler le service pour compléter le challenge
      const result = await authService.completePasswordChallenge(challengeData);
      
      setResult(result);
      
    } catch (error) {
      setError(error.message);
      setFormError('root', { 
        type: 'manual', 
        message: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBox p={3} bgcolor="info.light" borderRadius={2}>
      <MDTypography variant="h6" color="info.dark" mb={3}>
        🔐 Test Challenge PASSWORD_VERIFIER
      </MDTypography>
      
      <MDTypography variant="body2" color="text.secondary" mb={3}>
        Simule le challenge PASSWORD_VERIFIER de Cognito avec un nouveau mot de passe :
      </MDTypography>

      <MDBox component="form" onSubmit={handleSubmit(handlePasswordVerification)}>
        <MDBox mb={2}>
          <MDInput
            type="password"
            label="Nouveau mot de passe"
            fullWidth
            placeholder="NouveauMotDePasse123!"
            {...register('newPassword', { required: 'Le nouveau mot de passe est requis' })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
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
            {loading ? 'Test en cours...' : '🔐 Tester PASSWORD_VERIFIER'}
          </MDButton>
        </MDBox>
      </MDBox>

      {result && (
        <MDBox mt={3} p={2} bgcolor="success.light" borderRadius={1}>
          <MDTypography variant="h6" color="success.dark" mb={2}>
            ✅ Challenge réussi !
          </MDTypography>
          <MDTypography variant="body2" color="text.primary" mb={1}>
            <strong>Utilisateur:</strong> {result.user?.username || 'N/A'}
          </MDTypography>
          <MDTypography variant="body2" color="text.primary" mb={1}>
            <strong>Token:</strong> {result.token ? `${result.token.substring(0, 30)}...` : 'N/A'}
          </MDTypography>
          <MDTypography variant="body2" color="text.primary" mb={1}>
            <strong>Authentifié:</strong> {result.isAuthenticated ? 'Oui' : 'Non'}
          </MDTypography>
        </MDBox>
      )}

      {error && (
        <MDBox mt={3} p={2} bgcolor="error.light" borderRadius={1}>
          <MDTypography variant="h6" color="error.dark" mb={2}>
            ❌ Erreur Challenge
          </MDTypography>
          <MDTypography variant="body2" color="error">
            {error}
          </MDTypography>
        </MDBox>
      )}

      <MDBox mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
        <MDTypography variant="body2" color="text.secondary">
          <strong>Challenge simulé:</strong>
        </MDTypography>
        <pre style={{ fontSize: '12px', marginTop: '10px' }}>
{`{
  "ChallengeName": "PASSWORD_VERIFIER",
  "ChallengeResponses": {
    "USERNAME": "souhailsouidpro@gmail.com",
    "NEW_PASSWORD": "[votre nouveau mot de passe]"
  },
  "ClientId": "19j4bu74qppk83kf3sfhui24hq"
}`}
        </pre>
      </MDBox>
    </MDBox>
  );
};

export default TestPasswordVerifier; 