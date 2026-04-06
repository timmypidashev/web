export interface ThemeColors {
  background: string;
  foreground: string;
  red: string;
  redBright: string;
  orange: string;
  orangeBright: string;
  green: string;
  greenBright: string;
  yellow: string;
  yellowBright: string;
  blue: string;
  blueBright: string;
  purple: string;
  purpleBright: string;
  aqua: string;
  aquaBright: string;
  surface: string;
}

export interface Theme {
  id: string;
  family: string;
  label: string;
  name: string;
  type: "dark" | "light";
  colors: ThemeColors;
  canvasPalette: [number, number, number][];
}

export interface ThemeFamily {
  id: string;
  name: string;
  themes: Theme[];
  default: string;
}
