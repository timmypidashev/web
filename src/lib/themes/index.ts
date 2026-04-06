import type { Theme, ThemeFamily } from "./types";
import { darkbox } from "./families/darkbox";
import { gruvbox } from "./families/gruvbox";
import { everforest } from "./families/everforest";
import { catppuccin } from "./families/catppuccin";
import { rosepine } from "./families/rosepine";
import { kanagawa } from "./families/kanagawa";
import { nord } from "./families/nord";
import { tokyonight } from "./families/tokyonight";
import { dracula } from "./families/dracula";
import { solarized } from "./families/solarized";
import { onedark } from "./families/onedark";
import { monokai } from "./families/monokai";

export const DEFAULT_THEME_ID = "darkbox-retro";

export const FAMILIES: ThemeFamily[] = [
  darkbox,
  gruvbox,
  everforest,
  catppuccin,
  rosepine,
  kanagawa,
  nord,
  tokyonight,
  dracula,
  solarized,
  onedark,
  monokai,
];

// Flat lookup — backward compatible with all existing consumers
export const THEMES: Record<string, Theme> = {};
for (const family of FAMILIES) {
  for (const theme of family.themes) {
    THEMES[theme.id] = theme;
  }
}
