import type { Theme, ThemeFamily } from "../types";

// Tokyo Night — modern, popular blue/purple-toned palette.
// Three variants: Night (deep), Storm (slightly lighter), Day (light).

const night: Theme = {
  id: "tokyonight-night",
  family: "tokyonight",
  label: "night",
  name: "Tokyo Night",
  type: "dark",
  colors: {
    background: "26 27 38",
    foreground: "169 177 214",
    red: "247 118 142", redBright: "250 150 170",
    orange: "255 158 100", orangeBright: "255 185 140",
    green: "158 206 106", greenBright: "185 222 140",
    yellow: "224 175 104", yellowBright: "238 200 140",
    blue: "122 162 247", blueBright: "155 185 250",
    purple: "187 154 247", purpleBright: "208 180 250",
    aqua: "125 207 255", aquaBright: "165 222 255",
    surface: "41 46 66",
  },
  canvasPalette: [[247,118,142],[158,206,106],[224,175,104],[122,162,247],[187,154,247],[125,207,255]],
};

const storm: Theme = {
  id: "tokyonight-storm",
  family: "tokyonight",
  label: "storm",
  name: "Tokyo Night Storm",
  type: "dark",
  colors: {
    background: "36 40 59",
    foreground: "169 177 214",
    red: "247 118 142", redBright: "250 150 170",
    orange: "255 158 100", orangeBright: "255 185 140",
    green: "158 206 106", greenBright: "185 222 140",
    yellow: "224 175 104", yellowBright: "238 200 140",
    blue: "122 162 247", blueBright: "155 185 250",
    purple: "187 154 247", purpleBright: "208 180 250",
    aqua: "125 207 255", aquaBright: "165 222 255",
    surface: "59 66 97",
  },
  canvasPalette: [[247,118,142],[158,206,106],[224,175,104],[122,162,247],[187,154,247],[125,207,255]],
};

const day: Theme = {
  id: "tokyonight-day",
  family: "tokyonight",
  label: "day",
  name: "Tokyo Night Day",
  type: "light",
  colors: {
    background: "225 226 231",
    foreground: "55 96 191",
    red: "245 42 101", redBright: "248 80 130",
    orange: "177 92 0", orangeBright: "200 120 30",
    green: "88 117 57", greenBright: "110 140 78",
    yellow: "140 108 62", yellowBright: "165 135 85",
    blue: "46 125 233", blueBright: "80 150 240",
    purple: "152 84 241", purpleBright: "175 115 245",
    aqua: "0 113 151", aquaBright: "30 140 175",
    surface: "196 200 218",
  },
  canvasPalette: [[245,42,101],[88,117,57],[140,108,62],[46,125,233],[152,84,241],[0,113,151]],
};

export const tokyonight: ThemeFamily = {
  id: "tokyonight",
  name: "Tokyo Night",
  themes: [night, storm, day],
  default: "tokyonight-night",
};
