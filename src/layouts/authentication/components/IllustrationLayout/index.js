// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';


// Material Dashboard 3 PRO React examples
import PageLayout from 'examples/LayoutContainers/PageLayout';
import NotificationNavbar from 'layouts/pages/notifications/NotificationNavbar';

// Material Dashboard 3 PRO React context
import { useMaterialUIController } from 'context';

const IllustrationLayout = ({
  header = '',
  title = '',
  description = '',
  illustration = '',
  children,
  isNotification = false,
  message = '',
  color = 'customBlue',
  fontSize = 'medium',
  setNotification = () => {},
}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <PageLayout background="white">
      {/* <DefaultNavbar
        routes={pageRoutes}
        action={{
          type: "external",
          route: "https://creative-tim.com/product/material-dashboard-pro-react",
          label: "buy now",
        }}
      /> */}

      {/* {isNotification && (
        <NotificationNavbar
          message={message}
          setNotification={setNotification}
          color={color}
          fontSize={fontSize}
        />
      )} */}
      <Grid
        container
        sx={{
          backgroundColor: ({ palette: { background, white } }) =>
            darkMode ? background.default : white.main,
        }}
      >
        <Grid item xs={12} lg={6}>
          <MDBox
            display={{ xs: 'none', lg: 'flex' }}
            alignItems="center"
            justifyContent="center"
            style={{
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
            width="calc(100% - 2rem)"
            padding="2rem"
            height="calc(100vh)"
            borderRadius="lg"
            ml={2}
            mb={2}
            sx={{ backgroundImage: `url(${illustration})` }}
          />
        </Grid>
        <Grid item xs={11} sm={8} md={6} lg={6} xl={6} sx={{ mx: 'auto', px: 2, pt: 3 }}>
          <Grid item xs={11} sm={8} md={6} lg={6} xl={6} sx={{ mx: 'auto' }}>
            <MDBox display="flex" flexDirection="column" justifyContent="center" height="100vh">
              <MDBox py={3} px={3} textAlign="center">
                {!header ? (
                  <>
                    <MDBox mb={1} textAlign="center">
                      <MDTypography variant="h4" fontWeight="bold">
                        {title}
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="body2" color="text">
                      {description}
                    </MDTypography>
                  </>
                ) : (
                  header
                )}
              </MDBox>
              <MDBox p={3}>{children}</MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.string,
};

export default IllustrationLayout;
