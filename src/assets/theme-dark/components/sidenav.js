// Material Dashboard 3 PRO React base styles
import colors from "assets/theme-dark/base/colors";
import borders from "assets/theme-dark/base/borders";

// Material Dashboard 3 PRO React helper functions
import pxToRem from "assets/theme-dark/functions/pxToRem";

const { background } = colors;
const { borderRadius } = borders;

const sidenav = {
  styleOverrides: {
    root: {
      width: pxToRem(222),
      whiteSpace: "nowrap",
      border: "none",
    },

    paper: {
      width: pxToRem(222),
      backgroundColor: background.sidenav,
      height: `calc(100vh - ${pxToRem(16)})`,
      margin: pxToRem(8),
      borderRadius: borderRadius.lg,
      border: "none",
    },

    paperAnchorDockedLeft: {
      borderRight: "none",
    },
  },
};

export default sidenav;
