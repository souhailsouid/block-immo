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

// Material Dashboard 3 PRO React layouts
import Settings from 'layouts/pages/account/settings';

import SignInBasic from 'layouts/authentication/sign-in/basic';
import SignInIllustration from 'layouts/authentication/sign-in/illustration';

import ResetCover from 'layouts/authentication/reset-password/cover';
import SignUpIllustration from 'layouts/authentication/sign-up/illustration';
import MarketPlace from 'layouts/dashboards/marketPlace';
import AddPropertyPage from 'layouts/pages/properties/add-property';
import ContactRealEstate from 'layouts/realEstate/contact';
// Material Dashboard 3 PRO React components
import MDAvatar from 'components/MDAvatar';

// @mui icons
import Icon from '@mui/material/Icon';

// Images
import profilePicture from 'assets/images/team-3.jpg';

const routes = (name) => {
  return [
    {
      type: 'collapse',
      name: name,
      key: 'brooklyn-alice',
      icon: <MDAvatar src={profilePicture} alt="doisoid" size="sm" />,
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
          route: '/authentication/sign-in/basic',
          component: <SignInBasic />,
        },
      ],
    },
    { type: 'divider', key: 'divider-0' },
    {
      type: 'collapse',
      name: 'Market Place',
      key: 'market-place',
      route: '/dashboards/market-place',
      component: <MarketPlace />,
      icon: <Icon fontSize="small">dashboard</Icon>,
      noCollapse: true,
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
        },
        {
          name: 'My Properties',
          key: 'my-properties',
          route: '/properties/my-properties',
          component: <MarketPlace />,
        },
        {
          name: 'Settings',
          key: 'settings',
          route: '/real-estate/contact',
          component: <ContactRealEstate />,
        },
      ],
    },

    {
      type: 'collapse',
      name: 'Authentication',
      key: 'authentication',
      icon: <Icon fontSize="small">content_paste</Icon>,
      collapse: [
        {
          name: 'Sign In',
          key: 'sign-in',
          collapse: [
            {
              name: 'Illustration',
              key: 'illustration',
              route: '/authentication/sign-in/illustration',
              component: <SignInIllustration />,
            },
          ],
        },
        {
          name: 'Sign Up',
          key: 'sign-up',
          collapse: [
            {
              name: 'Illustration',
              key: 'illustration',
              route: '/authentication/sign-up/illustration',
              component: <SignUpIllustration />,
            },
          ],
        },
        {
          name: 'Reset Password',
          key: 'reset-password',
          collapse: [
            {
              name: 'Cover',
              key: 'cover',
              route: '/authentication/reset-password/cover',
              component: <ResetCover />,
            },
          ],
        },
      ],
    },
  ];
};

export default routes;
