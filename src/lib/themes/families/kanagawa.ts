import type { Theme, ThemeFamily } from "../types";

// Kanagawa — inspired by Katsushika Hokusai's paintings.
// Each variant has its own distinct palette.

const wave: Theme = {
  id: "kanagawa-wave",
  family: "kanagawa",
  label: "wave",
  name: "Kanagawa Wave",
  type: "dark",
  colors: {
    background: "31 31 40",
    foreground: "220 215 186",
    red: "195 64 67", redBright: "255 93 98",
    orange: "255 160 102", orangeBright: "255 184 140",
    green: "118 148 106", greenBright: "152 187 108",
    yellow: "192 163 110", yellowBright: "230 195 132",
    blue: "126 156 216", blueBright: "127 180 202",
    purple: "149 127 184", purpleBright: "175 158 206",
    aqua: "106 149 137", aquaBright: "122 168 159",
    surface: "42 42 55",
  },
  canvasPalette: [[195,64,67],[118,148,106],[192,163,110],[126,156,216],[149,127,184],[106,149,137]],
};

const dragon: Theme = {
  id: "kanagawa-dragon",
  family: "kanagawa",
  label: "dragon",
  name: "Kanagawa Dragon",
  type: "dark",
  colors: {
    background: "24 22 22",
    foreground: "197 201 197",
    red: "196 116 110", redBright: "195 64 67",
    orange: "182 146 123", orangeBright: "255 160 102",
    green: "135 169 135", greenBright: "152 187 108",
    yellow: "196 178 138", yellowBright: "230 195 132",
    blue: "139 164 176", blueBright: "126 156 216",
    purple: "162 146 163", purpleBright: "149 127 184",
    aqua: "142 164 162", aquaBright: "122 168 159",
    surface: "40 39 39",
  },
  canvasPalette: [[196,116,110],[135,169,135],[196,178,138],[139,164,176],[162,146,163],[142,164,162]],
};

const lotus: Theme = {
  id: "kanagawa-lotus",
  family: "kanagawa",
  label: "lotus",
  name: "Kanagawa Lotus",
  type: "light",
  colors: {
    background: "242 236 188",
    foreground: "84 84 100",
    red: "200 64 83", redBright: "215 71 75",
    orange: "233 138 0", orangeBright: "245 160 30",
    green: "111 137 78", greenBright: "130 158 98",
    yellow: "222 152 0", yellowBright: "240 178 40",
    blue: "77 105 155", blueBright: "93 87 163",
    purple: "98 76 131", purpleBright: "118 100 155",
    aqua: "89 123 117", aquaBright: "110 145 138",
    surface: "228 215 148",
  },
  canvasPalette: [[200,64,83],[111,137,78],[222,152,0],[77,105,155],[98,76,131],[89,123,117]],
};

export const kanagawa: ThemeFamily = {
  id: "kanagawa",
  name: "Kanagawa",
  themes: [wave, dragon, lotus],
  default: "kanagawa-wave",
};
