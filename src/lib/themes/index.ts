import type { Theme, ThemeFamily } from "./types";
import { darkbox } from "./families/darkbox";
import { gruvbox } from "./families/gruvbox";
import { everforest } from "./families/everforest";
import { catppuccin } from "./families/catppuccin";
import { rosepine } from "./families/rosepine";
import { kanagawa } from "./families/kanagawa";

export const DEFAULT_THEME_ID = "darkbox-retro";

export const FAMILIES: ThemeFamily[] = [
  darkbox,
  gruvbox,
  everforest,
  catppuccin,
  rosepine,
  kanagawa,
];

// Flat lookup — backward compatible with all existing consumers
export const THEMES: Record<string, Theme> = {};
for (const family of FAMILIES) {
  for (const theme of family.themes) {
    THEMES[theme.id] = theme;
  }
}
