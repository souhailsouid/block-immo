// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';


// Material Dashboard 3 PRO React examples
import PageLayout from 'examples/LayoutContainers/PageLayout';

// Material Dashboard 3 PRO React context
import { useMaterialUIController } from 'context';

const IllustrationLayout = ({
  title = '',
  description = '',
  illustration = '',
  backgroundSize = 'cover',
  children,

}) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

    

  return (
    <PageLayout background="white">
      <Grid
        container
        sx={{
          backgroundColor: ({ palette: { background, white } }) =>
            darkMode ? background.default : white.main,
          minHeight: '100vh',
        }}
      >
        {/* Section Image - Gauche */}
        <Grid 
          item 
          xs={12} 
          lg={6}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${illustration})`,
            backgroundPosition: 'center',
            backgroundSize: backgroundSize,
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
        
          
          {/* Contenu informatif sur l'image */}
       
        </Grid>

        {/* Section Formulaire - Droite */}
        <Grid 
          item 
          xs={12} 
          lg={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: { xs: 2, sm: 4, lg: 6 },
          }}
        >
          <MDBox
            width="100%"
            maxWidth={500}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Titre et description */}
            <MDBox textAlign="center" mb={4}>
              <MDTypography variant="h3" fontWeight="bold" mb={2}>
                {title}
              </MDTypography>
              <MDTypography variant="body1" color="text.secondary">
                {description}
              </MDTypography>
            </MDBox>

            {/* Contenu du formulaire */}
            <MDBox width="100%">
              {children}
            </MDBox>
          </MDBox>
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
