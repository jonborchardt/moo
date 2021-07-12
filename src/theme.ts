const factor = 3.75;
export const Theme = {
  sceneWidth: 1024 * factor,
  sceneHeight: 576 * factor,
  cardWidth: 110 * factor,
  font: {
    family: "Calibri",
    size: 16 * factor,
  },
  palette: {
    common: {
      black: "black",
      white: "white",
      transparent: "transparent",
    },
    background: {
      light: "#F8F9FA",
      dark: "#223367",
      default: "#FFFFFF",
    },
    border: {
      light: "#F8F9FA",
      dark: "#8C96A3",
      default: "#E8ECF2",
    },
    primary: {
      light: "#2376E5",
      default: "#265ED4",
      dark: "#1A4CAE",
      veryDark: "#1B4596",
    },
    secondary: {
      light: "#FFC72E",
      default: "#FFBB00",
      dark: "#FFA200",
    },
    text: {
      heading: "#303945",
      primary: "#47515C",
      secondary: "#8C96A3",
      disabled: "#AEB7C4",
      contrast: "#FFFFFF",
    },
  },
  spacing: {
    xxs: 4 * factor,
    xs2: 4 * factor,
    xs: 8 * factor,
    sm: 12 * factor,
    md: 16 * factor,
    lg: 24 * factor,
    xl: 36 * factor,
    xl2: 48 * factor,
    xl3: 64 * factor,
    xl4: 96 * factor,
    xl5: 128 * factor,
  },
  textStyles: {
    jumbo: 1.5 * 16 * factor,
    big: 1.125 * 16 * factor,
    normal: 1 * 16 * factor,
    small: 0.875 * 16 * factor,
    micro: 0.8125 * 16 * factor,
  },
  zindex: {
    backTop: 10,
    modal: 1000,
    popover: 1030,
    dropdown: 1050,
    tooltip: 1070,
  },
};
