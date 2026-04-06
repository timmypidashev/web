import type { Theme, ThemeFamily } from "../types";

// Everforest — warm green-toned palette. Same accents across
// hard/medium/soft, only backgrounds change.

const accents = {
  red: "230 126 128", redBright: "240 155 157",
  orange: "230 152 117", orangeBright: "240 177 150",
  green: "167 192 128", greenBright: "190 210 160",
  yellow: "219 188 127", yellowBright: "233 208 163",
  blue: "127 187 179", blueBright: "160 208 200",
  purple: "214 153 182", purpleBright: "228 180 202",
  aqua: "131 192 146", aquaBright: "162 212 176",
} as const;

const palette: [number, number, number][] = [
  [230,126,128],[167,192,128],[219,188,127],[127,187,179],[214,153,182],[131,192,146],
];

const hard: Theme = {
  id: "everforest-hard",
  family: "everforest",
  label: "hard",
  name: "Everforest Hard",
  type: "dark",
  colors: {
    background: "39 46 51",
    foreground: "211 198 170",
    ...accents,
    surface: "55 65 69",
  },
  canvasPalette: palette,
};

const medium: Theme = {
  id: "everforest-medium",
  family: "everforest",
  label: "medium",
  name: "Everforest Medium",
  type: "dark",
  colors: {
    background: "45 53 59",
    foreground: "211 198 170",
    ...accents,
    surface: "61 72 77",
  },
  canvasPalette: palette,
};

const soft: Theme = {
  id: "everforest-soft",
  family: "everforest",
  label: "soft",
  name: "Everforest Soft",
  type: "dark",
  colors: {
    background: "52 63 68",
    foreground: "211 198 170",
    ...accents,
    surface: "68 80 85",
  },
  canvasPalette: palette,
};

export const everforest: ThemeFamily = {
  id: "everforest",
  name: "Everforest",
  themes: [hard, medium, soft],
  default: "everforest-medium",
};
