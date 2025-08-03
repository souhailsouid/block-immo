import  { useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { getCurrentUser } from '@aws-amplify/auth';

const UserInfo = () => {
  const { user, token, isAuthenticated, logout, login } = useAuth();
const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
        }
  };

  useEffect(() => {
    const getCurrentUserWithAmplify = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
       
          return user;
        }
      } catch (error) {
          throw error;
      }
    }
  getCurrentUserWithAmplify();
  }, []);
  
    const handleLogin = async () => {
      try {
        const user =   await login({ email: 'souhailsouidpro@gmail.com', password: 'Ad&bgjk456o' });
          } catch (error) {
    
        }
    };
  if (!isAuthenticated) {
    return (
      <MDBox p={2} bgcolor="grey.100" borderRadius={1}>
        <MDTypography variant="body2" color="text.secondary">
          Non connecté
            </MDTypography>
          <MDButton 
        variant="gradient" 
        color="error" 
        size="small"
        onClick={handleLogin}
      >
        Connexion
      </MDButton>
      </MDBox>
    );
  }

  return (
    <MDBox p={2} bgcolor="success.light" borderRadius={1}>
      <MDTypography variant="h6" color="success.dark" mb={2}>
        ✅ Utilisateur Connecté
      </MDTypography>
      
      <MDBox mb={2}>
        <MDTypography variant="body2" color="text.primary">
          <strong>Username:</strong> {user?.username || 'N/A'}
        </MDTypography>
        <MDTypography variant="body2" color="text.primary">
          <strong>Email:</strong> {user?.attributes?.email || 'N/A'}
        </MDTypography>
        <MDTypography variant="body2" color="text.primary">
          <strong>User ID:</strong> {user?.userId || user?.sub || 'N/A'}
        </MDTypography>
        <MDTypography variant="body2" color="text.primary">
          <strong>Token:</strong> {token ? `${token.substring(0, 30)}...` : 'N/A'}
        </MDTypography>
      </MDBox>

      <MDButton 
        variant="gradient" 
        color="error" 
        size="small"
        onClick={handleLogout}
      >
        Déconnexion
      </MDButton>
    </MDBox>
  );
};

export default UserInfo; 