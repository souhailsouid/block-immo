/** 
  All of the routes for the page layout of Material Dashboard 3 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the DefaultNavbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `name` key is used for the name of the route on the DefaultNavbar.
  3. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  4. The `icon` key is used for the icon of the route on the DefaultNavbar, you have to add a node.
  5. The `collapse` key is used for making a collapsible item on the DefaultNavbar that contains other routes inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  6. The `route` key is used to store the route location which is used for the react router.
  7. The `href` key is used to store the external links location.
*/

// @mui material components
import Icon from "@mui/material/Icon";

const pageRoutes = [
  {
    name: "pages",
    columns: 3,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "dashboards",
        icon: <Icon>dashboard</Icon>,
        route: "/dashboards/market-place",
      },
      {
        name: "account",
        icon: <Icon>account_balance</Icon>,
        collapse: [
          {
            name: "settings",
            route: "/pages/account/settings",
          },
        ],
      },
      {
        name: "profile",
        icon: <Icon>badge</Icon>,
        collapse: [
          {
            name: "profile overview",
            route: "/pages/profile/profile-overview",
          },
        ],
      },
    ],
  },
  {
    name: "authentication",
    collapse: [
      {
        name: "sign in",
        dropdown: true,
        icon: <Icon>login</Icon>,
        collapse: [
          {
            name: "illustration",
            route: "/authentication/sign-in/illustration",
          },
        ],
      },
      {
        name: "sign up",
        dropdown: true,
        icon: <Icon>assignment</Icon>,
        collapse: [
          {
            name: "illustration",
            route: "/authentication/sign-up/illustration",
          },
        ],
      },
      {
        name: "reset password",
        dropdown: true,
        icon: <Icon>restart_alt</Icon>,
        collapse: [
          {
            name: "cover",
            route: "/authentication/reset-password/cover",
          },
        ],
      },
    ],
  },
  {
    name: "onboarding",
    collapse: [
      {
        name: "kyc",
        route: "/onboarding/kyc/identity-verification",
      },
    ],
  },
  {
    name: "real estate",
    collapse: [
      {
        name: "properties",
        icon: <Icon>home</Icon>,
        collapse: [
          {
            name: "add property",
            route: "/properties/add",
          },
          {
            name: "my properties",
            route: "/properties/my-properties",
          },
        ],
      },
  {
        name: "contact",
        icon: <Icon>contact_support</Icon>,
        route: "/real-estate/contact",
      },
    ],
  },
];

export default pageRoutes;
