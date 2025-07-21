import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// react-router-dom components
import { Link, useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from '@aws-amplify/auth';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Authentication layout components
import IllustrationLayout from 'layouts/authentication/components/IllustrationLayout';

// Image
import bgImage from 'assets/images/illustrations/illustration-real-estate.png';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Illustration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          navigate('/dashboard'); // ou la page de ton choix
        }
      } catch (e) {
        // Pas d'utilisateur connecté, on affiche le formulaire
      }
    }
    checkUser();
  }, [navigate]);

  async function handleSignIn(data) {
    try {
      const user = await signIn({ username: data.email, password: data.password });
      navigate('/dashboard');
      return user;
    } catch (error) {
      setError('root', { type: 'manual', message: error.message });
    }
  }

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={bgImage}
      isNotification={errors?.root}
      message={ errors?.root?.message}
      color="error"
      setNotification={setError}
   
    >
      <MDBox component="form" role="form" onSubmit={handleSubmit(handleSignIn)}>
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

export default Illustration;
