import type { Theme, ThemeFamily } from "../types";

// GitHub — the familiar look from github.com.
// Dark (default dark), Dark Dimmed (softer), Light (classic white).

const dark: Theme = {
  id: "github-dark",
  family: "github",
  label: "dark",
  name: "GitHub Dark",
  type: "dark",
  colors: {
    background: "13 17 23",
    foreground: "230 237 243",
    red: "255 123 114", redBright: "255 166 158",
    orange: "217 156 90", orangeBright: "240 183 122",
    green: "126 231 135", greenBright: "168 242 175",
    yellow: "224 194 133", yellowBright: "240 215 168",
    blue: "121 192 255", blueBright: "165 214 255",
    purple: "210 153 255", purpleBright: "226 187 255",
    aqua: "118 214 198", aquaBright: "160 230 218",
    surface: "22 27 34",
  },
  canvasPalette: [[255,123,114],[126,231,135],[224,194,133],[121,192,255],[210,153,255],[118,214,198]],
};

const dimmed: Theme = {
  id: "github-dimmed",
  family: "github",
  label: "dimmed",
  name: "GitHub Dark Dimmed",
  type: "dark",
  colors: {
    background: "34 39 46",
    foreground: "173 186 199",
    red: "255 123 114", redBright: "255 166 158",
    orange: "219 171 127", orangeBright: "236 195 158",
    green: "87 196 106", greenBright: "130 218 144",
    yellow: "224 194 133", yellowBright: "240 215 168",
    blue: "108 182 255", blueBright: "152 206 255",
    purple: "195 145 243", purpleBright: "218 180 248",
    aqua: "96 200 182", aquaBright: "140 220 208",
    surface: "45 51 59",
  },
  canvasPalette: [[255,123,114],[87,196,106],[224,194,133],[108,182,255],[195,145,243],[96,200,182]],
};

const light: Theme = {
  id: "github-light",
  family: "github",
  label: "light",
  name: "GitHub Light",
  type: "light",
  colors: {
    background: "255 255 255",
    foreground: "31 35 40",
    red: "207 34 46", redBright: "227 70 80",
    orange: "191 135 0", orangeBright: "212 160 30",
    green: "26 127 55", greenBright: "45 155 78",
    yellow: "159 115 0", yellowBright: "182 140 22",
    blue: "9 105 218", blueBright: "48 132 238",
    purple: "130 80 223", purpleBright: "158 112 238",
    aqua: "18 130 140", aquaBright: "42 158 168",
    surface: "246 248 250",
  },
  canvasPalette: [[207,34,46],[26,127,55],[159,115,0],[9,105,218],[130,80,223],[18,130,140]],
};

export const github: ThemeFamily = {
  id: "github",
  name: "GitHub",
  themes: [dark, dimmed, light],
  default: "github-dark",
};
