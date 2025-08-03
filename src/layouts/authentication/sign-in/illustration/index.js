 
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import SuccessNotification from 'components/SuccessNotification';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Material-UI components
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';
import NotificationNavbar from 'layouts/pages/notifications/NotificationNavbar';

// Image
import bgImage from 'assets/images/illustrations/illustration-real-estate.png';

// Amplify Auth
import { signIn as amplifySignIn, getCurrentUser } from 'aws-amplify/auth';

// Utils
import { checkUserGroups } from 'utils/cognitoUtils';

const SignInIllustration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  console.log('showErrorMessage', showErrorMessage);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
      })
    ),
  });
  console.log('errors_form', errors);
  
  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        console.log('useeffect_user', user);
        if (user) {
          console.log('✅ Utilisateur déjà connecté, redirection vers le dashboard');
          // Redirection simple vers le dashboard par défaut
          navigate('/dashboards/market-place');
        }
      } catch (e) {
        console.log('checkUser, error', e);
        // Ne pas afficher d'erreur si l'utilisateur n'est pas connecté (c'est normal)
        if (e.message !== 'User needs to be authenticated to call this API.') {
          console.log('e.message', e.message);
          // Ne pas afficher d'erreur pour les utilisateurs non connectés
        }
        console.log('checkUser, e.message', e.message);
      }
    }
    checkUser();
  }, [navigate]);

  async function handleSignIn(data) {
    try {
      console.log('🔄 Attempting sign in with Amplify...', { email: data.email });
      
      // Utiliser Amplify directement pour l'authentification
      const result = await amplifySignIn({
        username: data.email,
        password: data.password
      });
      
      console.log('✅ Sign in successful with Amplify:', result);
      
      // Vérifier si l'utilisateur doit confirmer son compte
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        console.log('📧 User needs to confirm sign up');
        navigate('/authentication/email-verification', { 
          state: { email: data.email } 
        });
        return;
      }
      
      // Vérifier les groupes Cognito après connexion réussie
      try {
        const userData = await checkUserGroups();
        console.log('👤 Données utilisateur après connexion:', userData);
      } catch (error) {
        console.error('❌ Erreur lors de la vérification des groupes:', error);
      }
      
      // Redirection vers le dashboard après connexion réussie
      navigate('/dashboards/market-place');
      return result;
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      // Gestion d'erreur améliorée avec messages en anglais
      let errorMessage = 'An error occurred during sign in. Please try again.';
      
      if (error.message) {
        // Traduire les erreurs Cognito en anglais
        if (error.message.includes('NotAuthorizedException')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('UserNotFoundException')) {
          errorMessage = 'User not found. Please check your email address.';
        } else if (error.message.includes('UserNotConfirmedException')) {
          errorMessage = 'Account not confirmed. Please check your email for verification.';
        } else if (error.message.includes('TooManyFailedAttemptsException')) {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (error.message.includes('Network error') || error.message.includes('Connection error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          // Utiliser le message d'erreur original si c'est déjà en anglais
          errorMessage = error.message;
        }
      }
      
      setShowErrorMessage(true);
      setError('root', { type: 'manual', message: errorMessage });
    }
  }

console.log('errors?.root?.message', errors?.root?.message);
  return (
    <IllustrationLayout
      title="Join BlockImmo"
      description="Create your account to start investing in real estate"
      illustration={bgImage}
    >
      <MDBox component="form" role="form" onSubmit={handleSubmit(handleSignIn)}>
        {/* Affichage d'erreur direct */}
        {errors?.root && (
          <MDBox mb={3} p={2} bgcolor="error.light" borderRadius={1}>
            <MDTypography variant="body2" color="error">
              <strong>Error:</strong> {errors.root.message}
            </MDTypography>
          </MDBox>
        )}
        
        <MDBox mb={2}>  
          <MDInput
            type="email"
            label="Email"
            fullWidth
            name="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type={showPassword ? 'text' : 'password'}
            label="Password"
            fullWidth
            name="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MDBox>
        <MDBox minHeight="10px" mb={2}>
          
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton variant="gradient" color="customBlue" size="large" fullWidth type="submit">
            sign in
          </MDButton>
        </MDBox>
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Forgot password?{' '}
            <MDTypography
              component={Link}
              to="/authentication/reset-password"
              variant="button"
              color="customBlue"
              fontWeight="medium"
              textGradient
            >
              Reset password
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox textAlign="center">
          <MDTypography variant="button" color="text">
            Don&apos;t have an account?{' '}
            <MDTypography
              component={Link}
              to="/authentication/sign-up/illustration"
              variant="button"
              color="customBlue"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </IllustrationLayout>
  );
}

export default SignInIllustration;
