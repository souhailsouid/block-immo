// Material Dashboard 3 PRO React Base Styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

// Material Dashboard 3 PRO React Helper Function
import rgba from "assets/theme/functions/rgba";

const { grey, white } = colors;
const { borderWidth, borderRadius } = borders;
const { xs } = boxShadows;

const card = {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: 0,
      wordWrap: "break-word",
      backgroundColor: white.main,
      backgroundClip: "border-box",
      border: `${borderWidth[1]} solid ${grey[200]}`,
      borderRadius: borderRadius.lg,
      boxShadow: xs,
      overflow: "visible",
    },
  },
};

export default card;
