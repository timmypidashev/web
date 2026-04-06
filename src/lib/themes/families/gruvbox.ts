import type { Theme, ThemeFamily } from "../types";

// Original gruvbox palette — same accents across hard/medium/soft,
// only background and surface change.

const accents = {
  red: "204 36 29", redBright: "251 73 52",
  orange: "214 93 14", orangeBright: "254 128 25",
  green: "152 151 26", greenBright: "184 187 38",
  yellow: "215 153 33", yellowBright: "250 189 47",
  blue: "69 133 136", blueBright: "131 165 152",
  purple: "177 98 134", purpleBright: "211 134 155",
  aqua: "104 157 106", aquaBright: "142 192 124",
} as const;

const palette: [number, number, number][] = [
  [204,36,29],[152,151,26],[215,153,33],[69,133,136],[177,98,134],[104,157,106],
];

const hard: Theme = {
  id: "gruvbox-hard",
  family: "gruvbox",
  label: "hard",
  name: "Gruvbox Hard",
  type: "dark",
  colors: {
    background: "29 32 33",
    foreground: "235 219 178",
    ...accents,
    surface: "60 56 54",
  },
  canvasPalette: palette,
};

const medium: Theme = {
  id: "gruvbox-medium",
  family: "gruvbox",
  label: "medium",
  name: "Gruvbox Medium",
  type: "dark",
  colors: {
    background: "40 40 40",
    foreground: "235 219 178",
    ...accents,
    surface: "60 56 54",
  },
  canvasPalette: palette,
};

const soft: Theme = {
  id: "gruvbox-soft",
  family: "gruvbox",
  label: "soft",
  name: "Gruvbox Soft",
  type: "dark",
  colors: {
    background: "50 48 47",
    foreground: "235 219 178",
    ...accents,
    surface: "80 73 69",
  },
  canvasPalette: palette,
};

export const gruvbox: ThemeFamily = {
  id: "gruvbox",
  name: "Gruvbox",
  themes: [hard, medium, soft],
  default: "gruvbox-medium",
};
