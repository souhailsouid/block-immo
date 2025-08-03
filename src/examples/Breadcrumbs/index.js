// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const Breadcrumbs = ({
  icon = "home",
  title = "",
  route = ["", ""],
  light = false
}) => {
  // 🔄 Construire les liens correctement
  const buildPath = (index) => {
    return "/" + route.slice(0, index + 1).join("/");
  };

  return (
    <MDBox ml={{ xs: 0, xl: 1 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) =>
              light ? white.main : grey[600],
          },
        }}
      >
        {/* 🏠 Lien Home */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <MDTypography
            component="span"
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Icon fontSize="small">{icon}</Icon>
            Home
          </MDTypography>
        </Link>

        {/* 📍 Liens intermédiaires */}
        {route.map((el, index) => {
          if (index === route.length - 1) return null; // Dernier élément = titre actuel
          
          return (
            <Link to={buildPath(index)} key={el} style={{ textDecoration: 'none' }}>
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color={light ? "white" : "dark"}
                opacity={light ? 0.8 : 0.5}
                sx={{ lineHeight: 0 }}
              >
                {el.replace("-", " ")}
              </MDTypography>
            </Link>
          );
        })}

        {/* 🎯 Titre actuel (non cliquable) */}
        <MDTypography
          variant="button"
          fontWeight="bold"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>
    </MDBox>
  );
}

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;