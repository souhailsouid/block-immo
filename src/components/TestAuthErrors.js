import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from 'services/authService';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

const TestAuthErrors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const testLogin = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await authService.login({
        email: data.email,
        password: data.password
      });
      
      setSuccess('Connexion réussie !');
      
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

  const testRegister = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name
      });
      
      setSuccess('Inscription réussie !');
      
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
    <MDBox p={3} bgcolor="warning.light" borderRadius={2}>
      <MDTypography variant="h6" color="warning.dark" mb={3}>
        🧪 Test Affichage Erreurs Auth
      </MDTypography>

      {/* Test de connexion */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="text.primary" mb={2}>
          Test Connexion (erreur attendue)
        </MDTypography>
        
        <MDBox component="form" onSubmit={handleSubmit(testLogin)}>
          <MDBox mb={2}>
            <MDInput
              type="email"
              label="Email"
              fullWidth
              placeholder="test@example.com"
              {...register('email', { required: 'Email requis' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </MDBox>
          
          <MDBox mb={2}>
            <MDInput
              type="password"
              label="Mot de passe"
              fullWidth
              placeholder="motdepasse"
              {...register('password', { required: 'Mot de passe requis' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </MDBox>

          <MDButton
            variant="gradient"
            color="error"
            size="medium"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Test...' : '🔐 Tester Connexion (erreur)'}
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Test d'inscription */}
      <MDBox mb={3}>
        <MDTypography variant="h6" color="text.primary" mb={2}>
          Test Inscription (erreur attendue)
        </MDTypography>
        
        <MDBox component="form" onSubmit={handleSubmit(testRegister)}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Nom"
              fullWidth
              placeholder="Test User"
              {...register('name', { required: 'Nom requis' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </MDBox>
          
          <MDBox mb={2}>
            <MDInput
              type="email"
              label="Email"
              fullWidth
              placeholder="test@example.com"
              {...register('email', { required: 'Email requis' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </MDBox>
          
          <MDBox mb={2}>
            <MDInput
              type="password"
              label="Mot de passe"
              fullWidth
              placeholder="motdepasse"
              {...register('password', { required: 'Mot de passe requis' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </MDBox>

          <MDButton
            variant="gradient"
            color="warning"
            size="medium"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Test...' : '📝 Tester Inscription (erreur)'}
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Affichage des erreurs */}
      {error && (
        <MDBox mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <MDTypography variant="h6" color="error.dark" mb={2}>
            ❌ Erreur détectée
          </MDTypography>
          <MDTypography variant="body2" color="error" mb={1}>
            <strong>Message:</strong> {error}
          </MDTypography>
          <MDTypography variant="body2" color="text.secondary">
            Cette erreur devrait s'afficher dans le frontend
          </MDTypography>
        </MDBox>
      )}

      {/* Affichage des succès */}
      {success && (
        <MDBox mb={3} p={2} bgcolor="success.light" borderRadius={1}>
          <MDTypography variant="h6" color="success.dark" mb={2}>
            ✅ Succès
          </MDTypography>
          <MDTypography variant="body2" color="text.primary">
            {success}
          </MDTypography>
        </MDBox>
      )}

      {/* Erreurs de formulaire */}
      {errors.root && (
        <MDBox mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <MDTypography variant="h6" color="error.dark" mb={2}>
            ❌ Erreur de formulaire
          </MDTypography>
          <MDTypography variant="body2" color="error">
            {errors.root.message}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
};

export default TestAuthErrors; 