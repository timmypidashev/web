import type { Theme, ThemeFamily } from "../types";

// Monokai — the Sublime Text classic, plus Monokai Pro filter variants.

const classic: Theme = {
  id: "monokai-classic",
  family: "monokai",
  label: "classic",
  name: "Monokai Classic",
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

const pro: Theme = {
  id: "monokai-pro",
  family: "monokai",
  label: "pro",
  name: "Monokai Pro",
  type: "dark",
  colors: {
    background: "45 42 46",
    foreground: "252 252 250",
    red: "255 97 136", redBright: "255 140 170",
    orange: "252 152 103", orangeBright: "253 182 142",
    green: "169 220 118", greenBright: "195 234 155",
    yellow: "255 216 102", yellowBright: "255 230 155",
    blue: "120 220 232", blueBright: "160 234 242",
    purple: "171 157 242", purpleBright: "198 188 248",
    aqua: "140 228 200", aquaBright: "175 240 220",
    surface: "64 62 65",
  },
  canvasPalette: [[255,97,136],[169,220,118],[255,216,102],[120,220,232],[171,157,242],[140,228,200]],
};

const octagon: Theme = {
  id: "monokai-octagon",
  family: "monokai",
  label: "octagon",
  name: "Monokai Octagon",
  type: "dark",
  colors: {
    background: "40 42 58",
    foreground: "234 242 241",
    red: "255 101 122", redBright: "255 142 158",
    orange: "255 155 94", orangeBright: "255 185 138",
    green: "186 215 97", greenBright: "210 230 140",
    yellow: "255 215 109", yellowBright: "255 230 160",
    blue: "156 209 187", blueBright: "185 225 208",
    purple: "195 154 201", purpleBright: "218 182 222",
    aqua: "130 212 200", aquaBright: "165 228 218",
    surface: "58 61 75",
  },
  canvasPalette: [[255,101,122],[186,215,97],[255,215,109],[156,209,187],[195,154,201],[130,212,200]],
};

const ristretto: Theme = {
  id: "monokai-ristretto",
  family: "monokai",
  label: "ristretto",
  name: "Monokai Ristretto",
  type: "dark",
  colors: {
    background: "44 37 37",
    foreground: "255 241 243",
    red: "253 104 131", redBright: "254 145 165",
    orange: "243 141 112", orangeBright: "248 175 150",
    green: "173 218 120", greenBright: "198 232 158",
    yellow: "249 204 108", yellowBright: "252 222 155",
    blue: "133 218 204", blueBright: "168 232 222",
    purple: "168 169 235", purpleBright: "195 196 242",
    aqua: "150 222 195", aquaBright: "180 235 215",
    surface: "64 56 56",
  },
  canvasPalette: [[253,104,131],[173,218,120],[249,204,108],[133,218,204],[168,169,235],[150,222,195]],
};

const machine: Theme = {
  id: "monokai-machine",
  family: "monokai",
  label: "machine",
  name: "Monokai Machine",
  type: "dark",
  colors: {
    background: "39 49 54",
    foreground: "242 255 252",
    red: "255 109 126", redBright: "255 148 162",
    orange: "255 178 112", orangeBright: "255 202 155",
    green: "162 229 123", greenBright: "192 240 160",
    yellow: "255 237 114", yellowBright: "255 244 168",
    blue: "124 213 241", blueBright: "162 228 246",
    purple: "186 160 248", purpleBright: "210 188 251",
    aqua: "142 225 200", aquaBright: "175 238 220",
    surface: "58 68 73",
  },
  canvasPalette: [[255,109,126],[162,229,123],[255,237,114],[124,213,241],[186,160,248],[142,225,200]],
};

const spectrum: Theme = {
  id: "monokai-spectrum",
  family: "monokai",
  label: "spectrum",
  name: "Monokai Spectrum",
  type: "dark",
  colors: {
    background: "34 34 34",
    foreground: "247 241 255",
    red: "252 97 141", redBright: "253 140 172",
    orange: "253 147 83", orangeBright: "254 180 125",
    green: "123 216 143", greenBright: "162 232 175",
    yellow: "252 229 102", yellowBright: "253 238 155",
    blue: "90 212 230", blueBright: "135 226 240",
    purple: "148 138 227", purpleBright: "180 172 238",
    aqua: "108 218 190", aquaBright: "148 232 212",
    surface: "54 53 55",
  },
  canvasPalette: [[252,97,141],[123,216,143],[252,229,102],[90,212,230],[148,138,227],[108,218,190]],
};

export const monokai: ThemeFamily = {
  id: "monokai",
  name: "Monokai",
  themes: [classic, pro, octagon, ristretto, machine, spectrum],
  default: "monokai-pro",
};
