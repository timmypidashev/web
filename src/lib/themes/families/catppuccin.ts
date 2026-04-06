import type { Theme, ThemeFamily } from "../types";

// Catppuccin — warm pastel palette. Each flavor has its own accent colors.

const mocha: Theme = {
  id: "catppuccin-mocha",
  family: "catppuccin",
  label: "mocha",
  name: "Catppuccin Mocha",
  type: "dark",
  colors: {
    background: "30 30 46",
    foreground: "205 214 244",
    red: "243 139 168", redBright: "246 166 190",
    orange: "250 179 135", orangeBright: "252 200 170",
    green: "166 227 161", greenBright: "190 236 186",
    yellow: "249 226 175", yellowBright: "251 235 200",
    blue: "137 180 250", blueBright: "172 202 251",
    purple: "203 166 247", purpleBright: "220 192 249",
    aqua: "148 226 213", aquaBright: "180 236 228",
    surface: "49 50 68",
  },
  canvasPalette: [[243,139,168],[166,227,161],[249,226,175],[137,180,250],[203,166,247],[148,226,213]],
};

const macchiato: Theme = {
  id: "catppuccin-macchiato",
  family: "catppuccin",
  label: "macchiato",
  name: "Catppuccin Macchiato",
  type: "dark",
  colors: {
    background: "36 39 58",
    foreground: "202 211 245",
    red: "237 135 150", redBright: "242 167 180",
    orange: "245 169 127", orangeBright: "248 192 165",
    green: "166 218 149", greenBright: "190 232 180",
    yellow: "238 212 159", yellowBright: "243 226 190",
    blue: "138 173 244", blueBright: "170 198 247",
    purple: "198 160 246", purpleBright: "218 190 249",
    aqua: "139 213 202", aquaBright: "175 228 220",
    surface: "54 58 79",
  },
  canvasPalette: [[237,135,150],[166,218,149],[238,212,159],[138,173,244],[198,160,246],[139,213,202]],
};

const frappe: Theme = {
  id: "catppuccin-frappe",
  family: "catppuccin",
  label: "frappé",
  name: "Catppuccin Frappé",
  type: "dark",
  colors: {
    background: "48 52 70",
    foreground: "198 208 245",
    red: "231 130 132", redBright: "238 160 162",
    orange: "239 159 118", orangeBright: "244 185 158",
    green: "166 209 137", greenBright: "190 222 172",
    yellow: "229 200 144", yellowBright: "237 216 178",
    blue: "140 170 238", blueBright: "172 196 242",
    purple: "202 158 230", purpleBright: "218 186 238",
    aqua: "129 200 190", aquaBright: "168 216 208",
    surface: "65 69 89",
  },
  canvasPalette: [[231,130,132],[166,209,137],[229,200,144],[140,170,238],[202,158,230],[129,200,190]],
};

const latte: Theme = {
  id: "catppuccin-latte",
  family: "catppuccin",
  label: "latte",
  name: "Catppuccin Latte",
  type: "light",
  colors: {
    background: "239 241 245",
    foreground: "76 79 105",
    red: "210 15 57", redBright: "228 50 82",
    orange: "254 100 11", orangeBright: "254 135 60",
    green: "64 160 43", greenBright: "85 180 65",
    yellow: "223 142 29", yellowBright: "236 170 60",
    blue: "30 102 245", blueBright: "70 130 248",
    purple: "136 57 239", purpleBright: "162 95 244",
    aqua: "23 146 153", aquaBright: "55 168 175",
    surface: "204 208 218",
  },
  canvasPalette: [[210,15,57],[64,160,43],[223,142,29],[30,102,245],[136,57,239],[23,146,153]],
};

export const catppuccin: ThemeFamily = {
  id: "catppuccin",
  name: "Catppuccin",
  themes: [mocha, macchiato, frappe, latte],
  default: "catppuccin-mocha",
};
