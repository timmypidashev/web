import type { Theme, ThemeFamily } from "../types";

// One Dark / One Light — the Atom editor classics.

const dark: Theme = {
  id: "onedark-dark",
  family: "onedark",
  label: "dark",
  name: "One Dark",
  type: "dark",
  colors: {
    background: "40 44 52",
    foreground: "171 178 191",
    red: "224 108 117", redBright: "240 140 148",
    orange: "209 154 102", orangeBright: "228 180 135",
    green: "152 195 121", greenBright: "180 215 155",
    yellow: "229 192 123", yellowBright: "240 212 162",
    blue: "97 175 239", blueBright: "135 198 245",
    purple: "198 120 221", purpleBright: "218 158 238",
    aqua: "86 182 194", aquaBright: "120 202 212",
    surface: "62 68 81",
  },
  canvasPalette: [[224,108,117],[152,195,121],[229,192,123],[97,175,239],[198,120,221],[86,182,194]],
};

const light: Theme = {
  id: "onedark-light",
  family: "onedark",
  label: "light",
  name: "One Light",
  type: "light",
  colors: {
    background: "250 250 250",
    foreground: "56 58 66",
    red: "228 86 73", redBright: "240 115 100",
    orange: "152 104 1", orangeBright: "180 130 30",
    green: "80 161 79", greenBright: "105 185 104",
    yellow: "193 132 1", yellowBright: "215 160 35",
    blue: "64 120 242", blueBright: "100 148 248",
    purple: "166 38 164", purpleBright: "192 75 190",
    aqua: "1 132 188", aquaBright: "40 162 210",
    surface: "229 229 230",
  },
  canvasPalette: [[228,86,73],[80,161,79],[193,132,1],[64,120,242],[166,38,164],[1,132,188]],
};

export const onedark: ThemeFamily = {
  id: "onedark",
  name: "One Dark",
  themes: [dark, light],
  default: "onedark-dark",
};
