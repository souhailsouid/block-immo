import { useState, useEffect, useMemo } from 'react';

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

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

import { getCurrentUser } from 'aws-amplify/auth';
import PropertiesPage from 'layouts/properties';
import OnBoardingKYC from 'layouts/onboarding/kyc';
import PropertyPage from 'layouts/ecommerce/properties/property-page';
import AddPropertyPage from 'layouts/pages/properties/add-property';
import MyProperties from 'layouts/pages/properties/my-properties';

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
  const [role, setRole] = useState('basic_user');
  const [userName, setUserName] = useState('basic_user');

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

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        const groups = user?.signInUserSession?.accessToken?.payload['cognito:groups'];
        if (groups?.includes('admin')) setRole('admin');
        else if (groups?.includes('investor')) setRole('investor');
        else setRole('basic_user');
        setUserName(user?.username);
      })
      .catch(() => setRole('basic_user'));
  }, []);

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
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <ModalProvider>
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
        <Routes>
          {getRoutes(routes(userName))}
          <Route path="/properties/:propertyId/images" element={<PropertiesPage />} />
          <Route path="/properties/:propertyId" element={<ProductPage />} />
          <Route path="/properties/add" element={<AddPropertyPage />} />
          <Route path="/properties/my-properties" element={<MyProperties />} />
          <Route path="/onboarding/kyc/identity-verification" element={<OnBoardingKYC />} />
          <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
        </Routes>
          <ModalManager />
        </ModalProvider>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <ModalProvider>
      {layout === 'dashboard' && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Creative Tim"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            username={userName}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === 'vr' && <Configurator />}
      <Routes>
        {getRoutes(routes(userName))}
        <Route path="/properties/:propertyId/images" element={<PropertiesPage />} />
        <Route path="/properties/:propertyId" element={<PropertyPage />} />
        <Route path="*" element={<Navigate to="/dashboards/market-place" />} />
        <Route path="/onboarding/kyc/identity-verification" element={<OnBoardingKYC />} />
      </Routes>
        <ModalManager />
      </ModalProvider>
    </ThemeProvider>
  );
}
