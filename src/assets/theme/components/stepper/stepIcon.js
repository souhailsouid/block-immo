// Material Dashboard 3 PRO React base styles
import colors from "assets/theme/base/colors";

// Material Dashboard 3 PRO React helper functions
import pxToRem from "assets/theme/functions/pxToRem";
import boxShadow from "assets/theme/functions/boxShadow";

const { white } = colors;

const stepIcon = {
  styleOverrides: {
    root: {
      background: "#ffffffa0",
      fill: "#ffffffa0",
      stroke: "#ffffffa0",
      strokeWidth: pxToRem(10),
      width: pxToRem(13),
      height: pxToRem(13),
      borderRadius: "50%",
      zIndex: 99,
      transition: "all 200ms linear",

      "&.Mui-active": {
        background: white.main,
        fill: white.main,
        stroke: white.main,
        borderColor: white.main,
        boxShadow: boxShadow([0, 0], [0, 2], white.main, 1),
      },

      "&.Mui-completed": {
        background: white.main,
        fill: white.main,
        stroke: white.main,
        borderColor: white.main,
        boxShadow: boxShadow([0, 0], [0, 2], white.main, 1),
      },
    },
  },
};

export default stepIcon;
