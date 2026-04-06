import type { Theme, ThemeFamily } from "../types";

// Dracula — iconic dark theme with vibrant purple, pink, and cyan.
// The 7th accent color (pink) maps to aqua since Dracula has no traditional aqua.

const classic: Theme = {
  id: "dracula",
  family: "dracula",
  label: "classic",
  name: "Dracula",
  type: "dark",
  colors: {
    background: "40 42 54",
    foreground: "248 248 242",
    red: "255 85 85", redBright: "255 130 130",
    orange: "255 184 108", orangeBright: "255 207 155",
    green: "80 250 123", greenBright: "130 255 165",
    yellow: "241 250 140", yellowBright: "248 253 185",
    blue: "139 233 253", blueBright: "175 241 254",
    purple: "189 147 249", purpleBright: "212 180 252",
    aqua: "255 121 198", aquaBright: "255 160 215",
    surface: "68 71 90",
  },
  canvasPalette: [[255,85,85],[80,250,123],[241,250,140],[139,233,253],[189,147,249],[255,121,198]],
};

export const dracula: ThemeFamily = {
  id: "dracula",
  name: "Dracula",
  themes: [classic],
  default: "dracula",
};
