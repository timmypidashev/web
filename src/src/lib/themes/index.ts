import type { Theme } from "./types";

export const DEFAULT_THEME_ID = "darkbox";

function theme(
  id: string,
  name: string,
  type: "dark" | "light",
  colors: Theme["colors"],
  palette: [number, number, number][]
): Theme {
  return { id, name, type, colors, canvasPalette: palette };
}

// Three darkbox variants from darkbox.nvim
// Classic (vivid) → Retro (muted) → Dim (deep)
// Each variant's "bright" is the next level up's base.

export const THEMES: Record<string, Theme> = {
  darkbox: theme("darkbox", "Darkbox Classic", "dark", {
    background: "0 0 0",
    foreground: "235 219 178",
    red: "251 73 52", redBright: "255 110 85",
    orange: "254 128 25", orangeBright: "255 165 65",
    green: "184 187 38", greenBright: "210 215 70",
    yellow: "250 189 47", yellowBright: "255 215 85",
    blue: "131 165 152", blueBright: "165 195 180",
    purple: "211 134 155", purpleBright: "235 165 180",
    aqua: "142 192 124", aquaBright: "175 220 160",
    surface: "60 56 54",
  }, [[251,73,52],[184,187,38],[250,189,47],[131,165,152],[211,134,155],[142,192,124]]),

  "darkbox-retro": theme("darkbox-retro", "Darkbox Retro", "dark", {
    background: "0 0 0",
    foreground: "189 174 147",
    red: "204 36 29", redBright: "251 73 52",
    orange: "214 93 14", orangeBright: "254 128 25",
    green: "152 151 26", greenBright: "184 187 38",
    yellow: "215 153 33", yellowBright: "250 189 47",
    blue: "69 133 136", blueBright: "131 165 152",
    purple: "177 98 134", purpleBright: "211 134 155",
    aqua: "104 157 106", aquaBright: "142 192 124",
    surface: "60 56 54",
  }, [[204,36,29],[152,151,26],[215,153,33],[69,133,136],[177,98,134],[104,157,106]]),

  "darkbox-dim": theme("darkbox-dim", "Darkbox Dim", "dark", {
    background: "0 0 0",
    foreground: "168 153 132",
    red: "157 0 6", redBright: "204 36 29",
    orange: "175 58 3", orangeBright: "214 93 14",
    green: "121 116 14", greenBright: "152 151 26",
    yellow: "181 118 20", yellowBright: "215 153 33",
    blue: "7 102 120", blueBright: "69 133 136",
    purple: "143 63 113", purpleBright: "177 98 134",
    aqua: "66 123 88", aquaBright: "104 157 106",
    surface: "60 56 54",
  }, [[157,0,6],[121,116,14],[181,118,20],[7,102,120],[143,63,113],[66,123,88]]),
};
