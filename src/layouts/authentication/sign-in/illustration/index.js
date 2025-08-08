/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Material-UI components
import { InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// Image
import bgImage from 'assets/images/illustrations/illustration-real-estate.png';

// Hooks
import { useAuth } from 'hooks/useAuth';
import { useNotification } from 'context/NotificationContext';

// Components
import ConfirmationCode from 'components/ConfirmationCode';

const SignInIllustration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();
  const [showSuccessNotification, setShowSuccessNotification] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [emailToConfirm, setEmailToConfirm] = useState('');
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleConfirmationSuccess = () => {
    showNotification('Account confirmed successfully! You can now sign in.', 'success');
    setShowConfirmation(false);
    setEmailToConfirm('');
  };

  const handleConfirmationError = (error) => {
    showNotification(error.message || 'Error during confirmation', 'error');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email required'),
        password: Yup.string().required('Password required'),
      })
    ),
  });

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboards/market-place';
         
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location.state]);

  const handleSignIn = async (data) => {
    if (isSubmitting) return; // Éviter les doubles soumissions
    
    setIsSubmitting(true);
    
    try {  
      
      // Utiliser le hook useAuth
     await login({
        email: data.email,
        password: data.password
      });
      
      
  
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      let errorMessage = 'Connection error. Please try again.';
      
      // Messages d'erreur spécifiques
      if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your account by email before signing in.';
        showNotification('Please confirm your account with the code sent to your email.', 'warning');
        setEmailToConfirm(data.email);
        setShowConfirmation(true);
        return;
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur
      setError('root', { 
        type: 'manual', 
        message: errorMessage 
      });
      
      // Notification d'erreur
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher loading si authentification en cours
  if (authLoading) {
    return (
      <IllustrationLayout
        title="Join BlockImmo"
        description="Create your account to start investing in real estate"
        illustration={bgImage}
      >
        <MDBox 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="300px"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress color="primary" />
          <MDTypography variant="body2" color="text">
            Authentication verification...
          </MDTypography>
        </MDBox>
      </IllustrationLayout>
    );
  }

  const handleSuccess = () => {
    setShowSuccessNotification(true);
    showNotification('Account confirmed successfully! You can now sign in.', 'success');
  }



  return (
    <IllustrationLayout
      title="Join BlockImmo"
      description="Create your account to start investing in real estate"
      illustration={bgImage}
    >
      {showConfirmation ? (
        <ConfirmationCode 
          email={emailToConfirm}
          onSuccess={handleConfirmationSuccess}
          onError={handleConfirmationError}
          handleSuccess={handleSuccess}
        />
      ) : (
        <MDBox component="form" role="form" onSubmit={handleSubmit(handleSignIn)}>
        {/* Affichage d'erreur */}
        {errors?.root && (
          <MDBox mb={3} p={2} bgcolor="error.light" borderRadius={1}>
            <MDTypography variant="body2" color="error">
               {errors.root.message}
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
            disabled={isSubmitting}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            fullWidth
            name="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MDBox>

        <MDBox minHeight="10px" mb={2} />
        
        <MDBox mt={4} mb={1}>
          <MDButton 
            variant="gradient" 
            color="customBlue" 
            size="large" 
            fullWidth 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <MDBox display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                Sign in in progress...
              </MDBox>
            ) : (
              'Sign in'
            )}
          </MDButton>
        </MDBox>
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
             Forgot your password ?{' '}
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
            No account ?{' '}
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
      )}
    </IllustrationLayout>
  );
};

export default SignInIllustration;
