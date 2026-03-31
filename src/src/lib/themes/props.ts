import type { ThemeColors } from "./types";

export const CSS_PROPS: [keyof ThemeColors, string][] = [
  ["background", "--color-background"],
  ["foreground", "--color-foreground"],
  ["red", "--color-red"],
  ["redBright", "--color-red-bright"],
  ["orange", "--color-orange"],
  ["orangeBright", "--color-orange-bright"],
  ["green", "--color-green"],
  ["greenBright", "--color-green-bright"],
  ["yellow", "--color-yellow"],
  ["yellowBright", "--color-yellow-bright"],
  ["blue", "--color-blue"],
  ["blueBright", "--color-blue-bright"],
  ["purple", "--color-purple"],
  ["purpleBright", "--color-purple-bright"],
  ["aqua", "--color-aqua"],
  ["aquaBright", "--color-aqua-bright"],
  ["surface", "--color-surface"],
];
