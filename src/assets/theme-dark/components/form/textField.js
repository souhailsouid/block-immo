// Material Dashboard 3 PRO React Base Styles
import colors from "assets/theme-dark/base/colors";

const { transparent, white } = colors;

const textField = {
  styleOverrides: {
    root: {
      backgroundColor: transparent.main,

      "& .MuiFormHelperText-root": {
        color: `${white.main} !important`,
      },
    },
  },
};

export default textField;
