import type { Theme, ThemeFamily } from "../types";

// Solarized — Ethan Schoonover's precision-engineered color scheme.
// Same accent colors in both dark and light — that's the whole point.

const accents = {
  red: "220 50 47", redBright: "238 85 80",
  orange: "203 75 22", orangeBright: "225 110 60",
  yellow: "181 137 0", yellowBright: "210 168 40",
  green: "133 153 0", greenBright: "165 185 35",
  blue: "38 139 210", blueBright: "75 165 228",
  purple: "108 113 196", purpleBright: "140 145 215",
  aqua: "42 161 152", aquaBright: "80 190 182",
} as const;

const palette: [number, number, number][] = [
  [220,50,47],[133,153,0],[181,137,0],[38,139,210],[108,113,196],[42,161,152],
];

const dark: Theme = {
  id: "solarized-dark",
  family: "solarized",
  label: "dark",
  name: "Solarized Dark",
  type: "dark",
  colors: {
    background: "0 43 54",
    foreground: "131 148 150",
    ...accents,
    surface: "7 54 66",
  },
  canvasPalette: palette,
};

const light: Theme = {
  id: "solarized-light",
  family: "solarized",
  label: "light",
  name: "Solarized Light",
  type: "light",
  colors: {
    background: "253 246 227",
    foreground: "101 123 131",
    ...accents,
    surface: "238 232 213",
  },
  canvasPalette: palette,
};

export const solarized: ThemeFamily = {
  id: "solarized",
  name: "Solarized",
  themes: [dark, light],
  default: "solarized-dark",
};
