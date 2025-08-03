import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import { useNotification } from 'context/NotificationContext';
// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// Image
import bgImage from 'assets/images/illustrations/illustration-real-estate.png';

// Services
import authService from 'services/authService';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const schema = Yup.object().shape({
    verificationCode: Yup.string()
      .required('Verification code is required'),
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
  const { showNotification } = useNotification();
  useEffect(() => {
    // Récupérer l'email depuis l'état de navigation ou les paramètres
    const stateEmail = location.state?.email;
    const urlEmail = new URLSearchParams(location.search).get('email');
    const userEmail = stateEmail || urlEmail || '';

    if (userEmail) {
      setEmail(userEmail);
    } else {
      // Si pas d'email, rediriger vers la page de connexion
      navigate('/authentication/sign-in/illustration');
    }
  }, [location, navigate]);

  const handleVerification = async (data) => {
    try {
      setLoading(true);
      setError('root', null);

      console.log('🔐 Verifying email code...');

      // Appeler le service pour confirmer l'inscription
      const result = await authService.confirmRegistration(email, data.verificationCode);

      console.log('✅ Email verification successful:', result);

      // Utiliser showNotification pour le succès
      showNotification(
        "Email Verified Successfully!",
        "You can now sign in to your account.",
        'success',
        { duration: 3000, autoHide: true, position: 'top-right' }
      );

      // Rediriger après un délai
      setTimeout(() => {
        navigate('/authentication/sign-in/illustration', {
          state: {
            message: 'Email verified successfully! You can now sign in.',
            messageType: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      console.error('❌ Email verification error:', error);

      // Gestion spécifique des erreurs AWS
      let errorMessage = 'Error verifying email code';

      if (error.message?.includes('CodeMismatchException')) {
        errorMessage = 'Incorrect verification code. Please check your email.';
      } else if (error.message?.includes('ExpiredCodeException')) {
        errorMessage = 'The verification code has expired. Please request a new one.';
      } else if (error.message?.includes('LimitExceededException')) {
        errorMessage = 'Too many attempts. Please wait a few minutes.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      // Utiliser showNotification pour les erreurs
      showNotification(
        "Verification Error",
        errorMessage,
        'error',
        { duration: 5000, autoHide: true, position: 'top-right' }
      );

      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendSuccess(false);

      console.log('📧 Resending verification code to:', email);

      // Appeler le service pour renvoyer le code
      const result = await authService.resendConfirmationCode(email);

      console.log('✅ Code resent successfully:', result);

      // Utiliser showNotification au lieu de setResendSuccess
      showNotification(
        "Code resent successfully!",
        "Check your email.",
        'success',
        { duration: 3000, autoHide: true, position: 'top-right' }
      );

      // Reset du formulaire
      reset();

    } catch (error) {
      console.error('❌ Error resending code:', error);

      // Gestion spécifique des erreurs AWS
      let errorMessage = 'Error resending code. Please try again.';

      if (error.message?.includes('LimitExceededException')) {
        errorMessage = 'Too many resend attempts. Please wait a few minutes.';
      } else if (error.message?.includes('UserNotFoundException')) {
        errorMessage = 'User not found. Please check your email address.';
      } else if (error.message?.includes('InvalidParameterException')) {
        errorMessage = 'Invalid email format. Please check your email address.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      // Utiliser showNotification pour les erreurs
      showNotification(
        "Error resending code",
        errorMessage,
        'error',
        { duration: 5000, autoHide: true, position: 'top-right' }
      );

      setError('root', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/authentication/sign-in/illustration');
  };

  if (!email) {
    return null; // En cours de chargement ou redirection
  }

  return (
    <IllustrationLayout
      illustration={bgImage}
      padding={0}
      paddingx={0}
    >
      <MDBox
        p={4}
        borderRadius={4}
        sx={{

          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <MDBox textAlign="center" mb={4} position="relative" zIndex={1}>




          <MDTypography
            variant="body1"
            color="rgba(255,255,255,0.9)"
            mb={3}
            sx={{

              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            To complete your registration, please enter the verification code sent to your email address.
          </MDTypography>

          <MDBox
            p={2}
            borderRadius={2}
            bgcolor="rgba(255,255,255,0.1)"

          >
            <MDTypography
              variant="h6"
              color="customBlue"
              fontWeight="600"
              sx={{
                wordBreak: 'break-all',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {email}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox component="form" onSubmit={handleSubmit(handleVerification)} position="relative" zIndex={1}>
          <MDBox mb={4}>
            <MDInput
              type="text"
              label="Verification Code"
              fullWidth
              placeholder="123456"
              {...register('verificationCode')}
              error={!!errors.verificationCode}
              helperText={errors.verificationCode?.message}
              shrink={true}
              sx={{
                '& .MuiOutlinedInput-root': {

                  borderRadius: 3,

                },

              }}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.8rem',
                  fontWeight: 'bold',
                  color: '#333'
                }
              }}
            />
          </MDBox>




          <MDBox mt={5}>
            <MDButton
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={loading}
              color="customBlue"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                py: 2,
                fontSize: '1.1rem',
                '&:disabled': {
                  background: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.7)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Verifying...' : 'Verify account'}
            </MDButton>
          </MDBox>

          {/* Bouton Resend Code */}
          <MDBox mt={2}>
            <MDButton
              variant="outlined"
              size="medium"
              fullWidth
              onClick={handleResendCode}
              disabled={resendLoading}
              color="info"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                fontSize: '1rem',



              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </MDButton>
          </MDBox>





          {/* Bouton retour à la connexion */}
          <MDBox mt={3} textAlign="center">
            <MDButton
              variant="text"
              onClick={handleBackToSignIn}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              ← Back to Sign In
            </MDButton>
          </MDBox>
        </MDBox>



      </MDBox>
    </IllustrationLayout>
  );
};

export default EmailVerificationPage; 