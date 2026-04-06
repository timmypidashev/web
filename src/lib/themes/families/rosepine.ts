import type { Theme, ThemeFamily } from "../types";

// Rosé Pine — soft muted palette inspired by the natural world.
// Only 6 accent hues; aqua is derived between pine and foam.

const main: Theme = {
  id: "rosepine-main",
  family: "rosepine",
  label: "main",
  name: "Rosé Pine",
  type: "dark",
  colors: {
    background: "25 23 36",
    foreground: "224 222 244",
    red: "235 111 146", redBright: "241 145 174",
    orange: "235 188 186", orangeBright: "240 208 206",
    green: "49 116 143", greenBright: "78 140 165",
    yellow: "246 193 119", yellowBright: "249 212 160",
    blue: "156 207 216", blueBright: "180 222 229",
    purple: "196 167 231", purpleBright: "214 190 239",
    aqua: "100 170 185", aquaBright: "135 192 205",
    surface: "38 35 58",
  },
  canvasPalette: [[235,111,146],[49,116,143],[246,193,119],[156,207,216],[196,167,231],[235,188,186]],
};

const moon: Theme = {
  id: "rosepine-moon",
  family: "rosepine",
  label: "moon",
  name: "Rosé Pine Moon",
  type: "dark",
  colors: {
    background: "35 33 54",
    foreground: "224 222 244",
    red: "235 111 146", redBright: "241 145 174",
    orange: "234 154 151", orangeBright: "241 186 184",
    green: "62 143 176", greenBright: "90 165 195",
    yellow: "246 193 119", yellowBright: "249 212 160",
    blue: "156 207 216", blueBright: "180 222 229",
    purple: "196 167 231", purpleBright: "214 190 239",
    aqua: "110 178 196", aquaBright: "140 196 210",
    surface: "57 53 82",
  },
  canvasPalette: [[235,111,146],[62,143,176],[246,193,119],[156,207,216],[196,167,231],[234,154,151]],
};

const dawn: Theme = {
  id: "rosepine-dawn",
  family: "rosepine",
  label: "dawn",
  name: "Rosé Pine Dawn",
  type: "light",
  colors: {
    background: "250 244 237",
    foreground: "87 82 121",
    red: "180 99 122", redBright: "200 120 142",
    orange: "215 130 126", orangeBright: "230 155 152",
    green: "40 105 131", greenBright: "60 125 150",
    yellow: "234 157 52", yellowBright: "242 180 85",
    blue: "86 148 159", blueBright: "110 168 178",
    purple: "144 122 169", purpleBright: "168 148 188",
    aqua: "62 128 146", aquaBright: "85 150 165",
    surface: "242 233 225",
  },
  canvasPalette: [[180,99,122],[40,105,131],[234,157,52],[86,148,159],[144,122,169],[215,130,126]],
};

export const rosepine: ThemeFamily = {
  id: "rosepine",
  name: "Rosé Pine",
  themes: [main, moon, dawn],
  default: "rosepine-main",
};
