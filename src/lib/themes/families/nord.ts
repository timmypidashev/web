import type { Theme, ThemeFamily } from "../types";

// Nord — arctic, bluish clean aesthetic.
// Polar Night (dark bg), Snow Storm (light bg), Frost (blues), Aurora (accents).

const dark: Theme = {
  id: "nord-dark",
  family: "nord",
  label: "dark",
  name: "Nord Dark",
  type: "dark",
  colors: {
    background: "46 52 64",
    foreground: "216 222 233",
    red: "191 97 106", redBright: "210 130 138",
    orange: "208 135 112", orangeBright: "224 165 145",
    green: "163 190 140", greenBright: "185 210 168",
    yellow: "235 203 139", yellowBright: "242 220 175",
    blue: "94 129 172", blueBright: "129 161 193",
    purple: "180 142 173", purpleBright: "200 170 195",
    aqua: "143 188 187", aquaBright: "136 192 208",
    surface: "59 66 82",
  },
  canvasPalette: [[191,97,106],[163,190,140],[235,203,139],[94,129,172],[180,142,173],[143,188,187]],
};

const light: Theme = {
  id: "nord-light",
  family: "nord",
  label: "light",
  name: "Nord Light",
  type: "light",
  colors: {
    background: "236 239 244",
    foreground: "46 52 64",
    red: "191 97 106", redBright: "170 75 85",
    orange: "208 135 112", orangeBright: "185 110 88",
    green: "163 190 140", greenBright: "135 162 110",
    yellow: "235 203 139", yellowBright: "200 170 100",
    blue: "94 129 172", blueBright: "75 108 150",
    purple: "180 142 173", purpleBright: "155 115 148",
    aqua: "143 188 187", aquaBright: "110 160 162",
    surface: "229 233 240",
  },
  canvasPalette: [[191,97,106],[163,190,140],[235,203,139],[94,129,172],[180,142,173],[143,188,187]],
};

export const nord: ThemeFamily = {
  id: "nord",
  name: "Nord",
  themes: [dark, light],
  default: "nord-dark",
};
