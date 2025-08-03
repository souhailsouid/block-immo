// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

const BookingCard = ({
  image = '',
  title = '',
  description = '',
  price = '',
  location = '',
  link = '',
  status = '',
}) => {
  const descriptionProperties = [
    {
      title: 'Number of blocks',
      value: 100,
    },
    {
      title: 'Yearly investment return',
      value: '10.30%',
    },
    {
      title: 'Funded date',
      value: new Date().toLocaleDateString(),
    },
    {
      title: 'Current valuation',
      value: price?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    },
  ];
  return (
    <Card
      sx={{
        transition: 'all 0.3s ease-in-out',
        transform: 'translateY(0)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        },
        '&:hover .card-header': {
          transform: 'scale(1.02)',
        },
        '&:hover .card-content': {
          transform: 'translateY(-4px)',
        },
        '&:hover .card-footer': {
          transform: 'translateY(-2px)',
        },
        '&:hover .card-properties': {
          transform: 'translateY(-3px)',
          backgroundColor: '#f0f2f5',
        },
      }}
    >
      <CardActionArea component={Link} to={link || '#'} sx={{ borderRadius: 'inherit' }}>
        <MDBox
          position="relative"
          borderRadius="md"
          mx={1}
          mt={1}
          className="card-header"
          sx={{ transition: 'all 0.3s ease-in-out' }}
        >
          <MDBox
            component="img"
            src={image}
            alt={title}
            borderRadius="md"
            shadow="md"
            width="100%"
            height="100%"
            position="relative"
            zIndex={1}
            sx={{ transition: 'all 0.3s ease-in-out' }}
          />
          {/* Badge de status */}
          {status && (
            <MDBox
              position="absolute"
              top={8}
              right={8}
              zIndex={2}
              sx={{
                backgroundColor: status === 'COMMERCIALIZED' ? '#4caf50' : 
                              status === 'FUNDED' ? '#2196f3' : 
                              status === 'IN_PROGRESS' ? '#ff9800' : '#757575',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {status === 'COMMERCIALIZED' ? 'Available' : 
               status === 'FUNDED' ? 'Funded' : 
               status === 'IN_PROGRESS' ? 'In Progress' : status}
            </MDBox>
          )}
          <MDBox
            borderRadius="md"
            shadow="md"
            width="100%"
            height="100%"
            position="absolute"
            left={0}
            top="0"
            sx={{
              backgroundImage: `url(${image})`,
              transform: 'scale(0.94)',
              filter: 'blur(12px)',
              backgroundSize: 'cover',
            }}
          />
        </MDBox>
        <MDBox pt={3} px={3} className="card-content" sx={{ transition: 'all 0.3s ease-in-out' }}>
          <MDTypography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              mt: 4,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            {title}
          </MDTypography>
          <MDTypography
            variant="body2"
            fontWeight="regular"
            color="text"
            sx={{ mt: 1.5, mb: 1, fontSize: '14px' }}
          >
            {description.slice(0, 120)}...
          </MDTypography>
        </MDBox>
        <Divider />
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pb={1.5}
          lineHeight={1}
          className="card-footer"
          sx={{ transition: 'all 0.3s ease-in-out' }}
        >
          <MDBox color="text" display="flex" alignItems="center">
            <Icon color="inherit" sx={{ m: 0.5 }}>
              place
            </Icon>
            <MDTypography variant="button" fontWeight="light" color="text">
              {location}
            </MDTypography>
          </MDBox>
          <MDTypography variant="body1" fontWeight="medium" color="customBlue">
            {price}
          </MDTypography>
        </MDBox>
        {/*description properties  */}
        <MDBox
          pt={3}
          px={3}
          className="card-properties"
          sx={{
            borderRadius: '10px',
            padding: '10px',
            margin: '30px',
            backgroundColor: '#f6f7f9',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {/* funded date */}
          {descriptionProperties.map((item, index) => (
            <MDBox
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={2}
              pb={1.5}
              lineHeight={1}
            >
              <MDBox color="text" display="flex" alignItems="center">
                <MDTypography
                  variant="button"
                  fontWeight="light"
                  color="text"
                  style={{ fontSize: '14px' }}
                >
                  {item.title}
                </MDTypography>
              </MDBox>
              <MDTypography variant="body2" fontWeight="medium">
                {item.value}
              </MDTypography>
            </MDBox>
          ))}
        </MDBox>
      </CardActionArea>
    </Card>
  );
};

// Typechecking props for the BookingCard
BookingCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  status: PropTypes.string,
};

export default BookingCard;