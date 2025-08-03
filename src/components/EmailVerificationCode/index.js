import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Services
import authService from 'services/authService';

const EmailVerificationCode = ({ challengeData, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const schema = Yup.object().shape({
    verificationCode: Yup.string()
      .required('The verification code is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleVerification = async (data) => {
    try {
      setLoading(true);
      setError('root', null); // Clear previous errors
      
      // Appeler le service pour compléter le challenge
      const result = await authService.completePasswordChallenge({
        username: challengeData.USERNAME,
        verificationCode: data.verificationCode,
        challengeResponses: challengeData.ChallengeResponses,
        session: challengeData.Session
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (error) {
      // Gestion spécifique des erreurs AWS
      let errorMessage = 'Erreur lors de la vérification du code';
      
      if (error.message?.includes('CodeMismatchException')) {
        errorMessage = 'Verification code incorrect. Please check your email.';
      } else if (error.message?.includes('ExpiredCodeException')) {
        errorMessage = 'The code has expired. Please request a new code.';
      } else if (error.message?.includes('LimitExceededException')) {
        errorMessage = 'Too many attempts. Please wait a few minutes.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError('root', { 
        type: 'manual', 
        message: errorMessage 
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendSuccess(false);
      
      // Pour PASSWORD_VERIFIER, nous ne pouvons pas renvoyer le code
      // car c'est un challenge de session, pas d'inscription
      // Nous devons informer l'utilisateur de se reconnecter
      setError('root', { 
        type: 'manual', 
        message: 'For PASSWORD_VERIFIER challenge, please try signing in again with your credentials.' 
      });
      
    } catch (error) {
      setError('root', { 
        type: 'manual', 
        message: 'Error resending code. Please try again.' 
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <MDBox 
      p={4} 
      bgcolor="info.light" 
      borderRadius={3}
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
        border: '1px solid rgba(33, 150, 243, 0.2)'
      }}
    >
      <MDBox textAlign="center" mb={3}>
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={60}
          height={60}
          borderRadius="50%"
          bgcolor="info.main"
          mx="auto"
          mb={2}
        >
          <MDTypography variant="h4" color="white">
            📧
          </MDTypography>
        </MDBox>
        
        <MDTypography variant="h5" color="info.dark" fontWeight="bold" mb={1}>
          Vérification par Email
        </MDTypography>
        
        <MDTypography variant="body2" color="text.secondary">
          Nous avons envoyé un code de vérification à :
        </MDTypography>
        
        <MDTypography variant="body1" color="info.dark" fontWeight="600" mt={1}>
          {challengeData?.USERNAME}
        </MDTypography>
      </MDBox>

      <MDBox component="form" onSubmit={handleSubmit(handleVerification)}>
        <MDBox mb={3}>
          <MDInput
            type="text"
            label="Code de vérification"
            fullWidth
            placeholder="123456"
            {...register('verificationCode')}
            error={!!errors.verificationCode}
            helperText={errors.verificationCode?.message}
            inputProps={{
              maxLength: 6,
              style: { 
                textAlign: 'center',
                fontSize: '1.2rem',
                letterSpacing: '0.5rem',
                fontWeight: 'bold'
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                textAlign: 'center',
                fontSize: '1.2rem',
                letterSpacing: '0.5rem',
                fontWeight: 'bold'
              }
            }}
          />
        </MDBox>

        {errors.root && (
          <MDBox mb={3} p={2} bgcolor="error.light" borderRadius={2}>
            <MDTypography variant="body2" color="error" textAlign="center">
              ⚠️ {errors.root.message}
            </MDTypography>
          </MDBox>
        )}

        {resendSuccess && (
          <MDBox mb={3} p={2} bgcolor="success.light" borderRadius={2}>
            <MDTypography variant="body2" color="success.dark" textAlign="center">
              ✅ Nouveau code envoyé avec succès !
            </MDTypography>
          </MDBox>
        )}

        <MDBox mt={4}>
          <MDButton
            variant="gradient"
            color="info"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5
            }}
          >
            {loading ? 'Vérification...' : '✅ Vérifier le code'}
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox mt={3} textAlign="center">
        <MDTypography variant="body2" color="text.secondary" mb={2}>
          Having trouble with the verification?
        </MDTypography>
        
        <MDButton
          variant="outlined"
          color="info"
          size="medium"
          onClick={handleResendCode}
          disabled={resendLoading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {resendLoading ? 'Processing...' : '🔄 Try Again'}
        </MDButton>
      </MDBox>

      <MDBox mt={2} textAlign="center">
        <MDTypography variant="caption" color="text.secondary">
          Le code expire dans 10 minutes
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default EmailVerificationCode; 