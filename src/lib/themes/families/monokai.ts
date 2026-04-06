import type { Theme, ThemeFamily } from "../types";

// Monokai — the iconic Sublime Text theme. Vibrant neons on dark olive.

const classic: Theme = {
  id: "monokai",
  family: "monokai",
  label: "classic",
  name: "Monokai",
  type: "dark",
  colors: {
    background: "39 40 34",
    foreground: "248 248 242",
    red: "249 38 114", redBright: "252 85 145",
    orange: "253 151 31", orangeBright: "254 182 85",
    green: "166 226 46", greenBright: "195 240 95",
    yellow: "230 219 116", yellowBright: "240 232 160",
    blue: "102 217 239", blueBright: "145 230 245",
    purple: "174 129 255", purpleBright: "200 165 255",
    aqua: "161 239 228", aquaBright: "192 245 238",
    surface: "73 72 62",
  },
  canvasPalette: [[249,38,114],[166,226,46],[230,219,116],[102,217,239],[174,129,255],[161,239,228]],
};

export const monokai: ThemeFamily = {
  id: "monokai",
  name: "Monokai",
  themes: [classic],
  default: "monokai",
};
