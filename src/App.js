import { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Material Dashboard 3 PRO React examples
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

// Material Dashboard 3 PRO React themes
import theme from 'assets/theme';
import themeRTL from 'assets/theme/theme-rtl';

// Material Dashboard 3 PRO React Dark Mode themes
import themeDark from 'assets/theme-dark';
import themeDarkRTL from 'assets/theme-dark/theme-rtl';

// RTL plugins
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Material Dashboard 3 PRO React routes
import routes from 'routes';

// Material Dashboard 3 PRO React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from 'context';

// Modal context and manager
import { ModalProvider } from 'context/ModalContext';
import ModalManager from 'components/ModalManager';
import { NotificationProvider } from 'context/NotificationContext';
import NotificationManager from 'components/NotificationManager';
// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// Authentication and Route Protection
import { AuthProvider } from 'hooks/useAuth';
import { RoleProvider } from 'context/RoleContext';
import { InvestmentProvider } from 'context/InvestmentContext';
import PrivateApp from 'components/PrivateApp';
import { AuthRoute } from 'components/RouteProtection';
import AuthDebug from 'components/AuthDebug';

// Pages
import PropertiesPage from 'layouts/properties';
import OnBoardingKYC from 'layouts/onboarding/kyc';
import PropertyPage from 'layouts/ecommerce/properties/property-page';
import AddPropertyPage from 'layouts/pages/properties/add-property';
import MyProperties from 'layouts/pages/properties/my-properties';
import LogoutPage from 'layouts/authentication/logout';
import EmailVerificationPage from 'layouts/authentication/email-verification';
import RoleTest from 'components/RoleTest';
import Cover from 'layouts/authentication/reset-password/cover';
import ConfirmResetPassword from 'layouts/authentication/reset-password/confirm';
import SignInIllustration from 'layouts/authentication/sign-in/illustration';
import SignUpIllustration from 'layouts/authentication/sign-up/illustration';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [userName, setUserName] = useState('');


  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: 'rtl',
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);


  const getRoutes = (allRoutes) => {
    const routes = [];

    const processRoutes = (routesArray) => {
      routesArray.forEach((route) => {
        if (route.collapse) {
          processRoutes(route.collapse);
        }

        if (route.route) {
          routes.push(<Route exact path={route.route} element={route.component} key={route.key} />);
        }
      });
    };

    processRoutes(allRoutes);
    return routes;
  };

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === 'rtl' ? (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <CssBaseline />
          <AuthProvider>
            <RoleProvider>
              <InvestmentProvider>
                <NotificationProvider>
                  <ModalProvider>
                    <Routes>
                      {/* Routes d'authentification (publiques) */}
                      <Route path="/authentication/sign-in/illustration" element={
                        <AuthRoute>
                          <SignInIllustration />
                        </AuthRoute>
                      } />
                      <Route path="/authentication/sign-up/illustration" element={
                        <AuthRoute>
                          <SignUpIllustration />
                        </AuthRoute>
                      } />
                      <Route path="/authentication/email-verification" element={
                        <AuthRoute>
                          <EmailVerificationPage />
                        </AuthRoute>
                      } />
                      <Route path="/authentication/reset-password" element={
                        <AuthRoute>
                          <Cover />
                        </AuthRoute>
                      } />
                      <Route path="/authentication/reset-password/confirm" element={
                        <AuthRoute>
                          <ConfirmResetPassword />
                        </AuthRoute>
                      } />
                      
                      {/* Application privée - Routes protégées directement */}
                      <Route path="/*" element={
                        <PrivateApp>
                          {layout === 'dashboard' && (
                            <>
                              <Sidenav
                                color={sidenavColor}
                                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                                brandName="Souhail"
                                routes={routes}
                                onMouseEnter={handleOnMouseEnter}
                                onMouseLeave={handleOnMouseLeave}
                              />
                              <Configurator />
                              {configsButton}
                            </>
                          )}
                          {layout === 'vr' && <Configurator />}
                          
                          {/* Routes internes avec wrapper Routes */}
                          <Routes>
                            {getRoutes(routes())}
                            <Route path="/properties/:propertyId/images" element={<PropertiesPage />} />
                            <Route path="/properties/:propertyId" element={<PropertyPage />} />
                            <Route path="/properties/add" element={<AddPropertyPage />} />
                            <Route path="/properties/my-properties" element={<MyProperties />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            <Route path="/onboarding/kyc/identity-verification" element={<OnBoardingKYC />} />
                            <Route path="/dashboards/*" element={<Navigate to="/dashboards/market-place" />} />
                            <Route path="/" element={<Navigate to="/dashboards/market-place" />} />
                          </Routes>
                          
                          <ModalManager />
                          <NotificationManager />
                          <RoleTest />
                        </PrivateApp>
                      } />
                    </Routes>
                    <AuthDebug />
                  </ModalProvider>
                </NotificationProvider>
              </InvestmentProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  ) : (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <AuthProvider>
          <RoleProvider>
            <InvestmentProvider>
              <NotificationProvider>
                <ModalProvider>
                  <Routes>
                    {/* Routes d'authentification (publiques) */}
                    <Route path="/authentication/sign-in/illustration" element={
                      <AuthRoute>
                        <SignInIllustration />
                      </AuthRoute>
                    } />
                    <Route path="/authentication/sign-up/illustration" element={
                      <AuthRoute>
                        <SignUpIllustration />
                      </AuthRoute>
                    } />
                    <Route path="/authentication/email-verification" element={
                      <AuthRoute>
                        <EmailVerificationPage />
                      </AuthRoute>
                    } />
                    <Route path="/authentication/reset-password" element={
                      <AuthRoute>
                        <Cover />
                      </AuthRoute>
                    } />
                    <Route path="/authentication/reset-password/confirm" element={
                      <AuthRoute>
                        <ConfirmResetPassword />
                      </AuthRoute>
                    } />
                    
                    {/* Application privée - Routes protégées directement */}
                    <Route path="/*" element={
                      <PrivateApp>
                        {layout === 'dashboard' && (
                          <>
                            <Sidenav
                              color={sidenavColor}
                              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                              brandName="Souhail"
                              routes={routes}
                              onMouseEnter={handleOnMouseEnter}
                              onMouseLeave={handleOnMouseLeave}
                            />
                            <Configurator />
                            {configsButton}
                          </>
                        )}
                        {layout === 'vr' && <Configurator />}
                        
                        {/* Routes internes avec wrapper Routes */}
                        <Routes>
                          {getRoutes(routes())}
                          <Route path="/properties/:propertyId/images" element={<PropertiesPage />} />
                          <Route path="/properties/:propertyId" element={<PropertyPage />} />
                          <Route path="/properties/add" element={<AddPropertyPage />} />
                          <Route path="/properties/my-properties" element={<MyProperties />} />
                          <Route path="/logout" element={<LogoutPage />} />
                          <Route path="/onboarding/kyc/identity-verification" element={<OnBoardingKYC />} />
                          <Route path="/dashboards/*" element={<Navigate to="/dashboards/market-place" />} />
                          <Route path="/" element={<Navigate to="/dashboards/market-place" />} />
                        </Routes>
                        
                        <ModalManager />
                        <NotificationManager />
                      </PrivateApp>
                    } />
                  </Routes>
                  <AuthDebug />
                </ModalProvider>
              </NotificationProvider>
            </InvestmentProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
