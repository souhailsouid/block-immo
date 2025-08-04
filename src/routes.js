/** 
  All of the routes for the Material Dashboard 3 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/


import Settings from 'layouts/pages/account/settings';
import PropTypes from 'prop-types';
import LogoutPage from 'layouts/authentication/logout';
import MarketPlace from 'layouts/dashboards/marketPlace';
import InvestorDashboard from 'layouts/dashboards/investor';
import AddPropertyPage from 'layouts/pages/properties/add-property';
import MyPropertiesPage from 'layouts/pages/properties/my-properties';

// Material Dashboard 3 PRO React components
import MDAvatar from 'components/MDAvatar';

// Custom components
import DiceBearAvatar from 'components/DiceBearAvatar';

// @mui icons
import Icon from '@mui/material/Icon';

// Images
import defaultProfilePicture from 'assets/images/team-3.jpg';

// Hook pour obtenir les infos utilisateur
import { useAuth } from 'hooks/useAuth';


// Composant personnalisé pour l'avatar de la sidenav
const SidenavAvatar = ({ userInfo }) => {
  // Gestion sûre des props - s'assurer que userInfo est un objet
  const safeUserInfo = (userInfo && typeof userInfo === 'object') ? userInfo : {
    profilePicture: null,
    fullName: 'User',
    userProfile: {
      avatar: {
        seed: 'default',
        style: 'pixelArt'
      }
    }
  };
  
  const { profilePicture, fullName } = safeUserInfo;

  // Fonction pour déterminer si c'est un avatar DiceBear
  const isDiceBearAvatar = safeUserInfo?.userProfile?.avatar?.seed && safeUserInfo?.userProfile?.avatar?.style;

  if (isDiceBearAvatar) {
    return (
      <DiceBearAvatar
        seed={safeUserInfo?.userProfile?.avatar?.seed || 'default'}
        style={safeUserInfo?.userProfile?.avatar?.style || 'pixelArt'}
        size="sm"
        sx={{
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    );
  }

  return (
    <MDAvatar 
      src={profilePicture || defaultProfilePicture} 
      alt={fullName || 'User'} 
      size="sm" 
    />
  );
};
SidenavAvatar.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

// Fonction pour les routes (compatible avec l'ancienne API)
const routes = (userInfo = null) => {
  // Extraire les informations utilisateur avec des valeurs par défaut sûres
  const firstName = userInfo?.given_name || userInfo?.firstName || 'User';
  const lastName = userInfo?.family_name || userInfo?.lastName || '';
  const fullName = userInfo?.name || `${firstName} ${lastName}`.trim() || 'User';

  // S'assurer que fullName est une chaîne
  const displayName = typeof fullName === 'string' ? fullName : 'User';

  // Créer un objet userInfo par défaut sûr
  const safeUserInfo = userInfo || {
    given_name: 'User',
    family_name: '',
    name: 'User',
    profilePicture: null,
    fullName: 'User'
  };

  return [
    {
      type: 'collapse',
      name: displayName,
      key: 'user-profile',
      icon: <SidenavAvatar userInfo={safeUserInfo} />,
      collapse: [
        {
          name: 'My Profile',
          key: 'profile-settings',
          route: '/pages/account/settings',
          component: <Settings />,
        },
        {
          name: 'Logout',
          key: 'logout',
          route: '/logout',
          component: <LogoutPage />,
        },
      ],
    },
    { type: 'divider', key: 'divider-0' },
    {
      type: 'collapse',
      name: 'Account & Settings',
      key: 'account-settings',
      icon: <Icon fontSize="small">person</Icon>,
      collapse: [
        {
          name: 'Profile Settings',
          key: 'profile-settings',
          route: '/pages/account/settings',
          component: <Settings />,
        },
        {
          name: 'Notifications',
          key: 'notifications',
          route: '/pages/notifications',
          component: <Settings />, // On peut créer un composant Notifications plus tard
        },
      ],
    },
    {
      type: 'collapse',
      name: 'Market Place',
      key: 'market-place',
      route: '/dashboards/market-place',
      component: <MarketPlace />,
      icon: <Icon fontSize="small">store</Icon>,
      noCollapse: true,
    },

    {
      type: 'collapse',
      name: 'Investment Portfolio',
      key: 'investment-portfolio',
      icon: <Icon fontSize="small">account_balance_wallet</Icon>,
      collapse: [
        {
          name: 'My Portfolio',
          key: 'my-portfolio',
          route: '/investor',
          component: <InvestorDashboard />,
          allowedRoles: ['INVESTOR', 'ADMIN'], // 🔒 Restreint aux investisseurs
        },
        {
          name: 'Investment History',
          key: 'investment-history',
          route: '/investor/history',
          component: <InvestorDashboard />, // On peut créer un composant séparé plus tard
          allowedRoles: ['INVESTOR', 'ADMIN'],
        },
        {
          name: 'Performance Analytics',
          key: 'performance-analytics',
          route: '/investor/analytics',
          component: <InvestorDashboard />, // On peut créer un composant séparé plus tard
          allowedRoles: ['INVESTOR', 'ADMIN'],
        },
      ],
      allowedRoles: ['INVESTOR', 'ADMIN'], // 🔒 Section entière restreinte aux investisseurs
    },

    {
      type: 'collapse',
      name: 'Real Estate',
      key: 'real-estate',
      icon: <Icon fontSize="small">home</Icon>,
      collapse: [
        {
          name: 'Add a new property',
          key: 'add-property',
          route: '/properties/add',
          component: <AddPropertyPage />,
          allowedRoles: ['PROFESSIONAL', 'ADMIN'], // 🔒 Restreint aux professionnels
        },
        {
          name: 'My Properties',
          key: 'my-properties',
          route: '/properties/my-properties',
          component: <MyPropertiesPage />,
          allowedRoles: ['PROFESSIONAL', 'ADMIN'], // 🔒 Restreint aux professionnels
        },
       
      ],
      allowedRoles: ['PROFESSIONAL', 'ADMIN'], // 🔒 Section entière restreinte
    },

    // {
    //   type: 'collapse',
    //   name: 'Authentication',
    //   key: 'authentication',
    //   icon: <Icon fontSize="small">content_paste</Icon>,
    //   collapse: [
    //     {
    //       name: 'Sign In',
    //       key: 'sign-in',
    //       collapse: [
    //         {
    //           name: 'Illustration',
    //           key: 'illustration',
    //           route: '/authentication/sign-in/illustration',
    //           component: <SignInIllustration />,
    //         },
    //       ],
    //     },
    //     {
    //       name: 'Sign Up',
    //       key: 'sign-up',
    //       collapse: [
    //         {
    //           name: 'Illustration',
    //           key: 'illustration',
    //           route: '/authentication/sign-up/illustration',
    //           component: <SignUpIllustration />,
    //         },
    //       ],
    //     },
    //     {
    //       name: 'Reset Password',
    //       key: 'reset-password',
    //       collapse: [
    //         {
    //           name: 'Cover',
    //           key: 'cover',
    //           route: '/authentication/reset-password/cover',
    //           component: <ResetCover />,
    //         },
    //       ],
    //     },
       
    //   ],
    // },
  ];
};

export default routes;
