// Material Dashboard 3 PRO React Base Styles
import borders from "assets/theme-dark/base/borders";

// Material Dashboard 3 PRO React Helper Functions
import pxToRem from "assets/theme-dark/functions/pxToRem";

const { borderRadius } = borders;

const cardMedia = {
  styleOverrides: {
    root: {
      borderRadius: borderRadius.lg,
      margin: `${pxToRem(16)} ${pxToRem(16)} 0`,
    },

    media: {
      width: "auto",
    },
  },
};

export default cardMedia;
