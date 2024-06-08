// theme.js

// Define the light theme colors
const lightColors = {
  text: '#000000',
  background: '#ffffff',
  foreground: '#ebdbb2',
  red: {
    1: '#cc241d',
    2: '#fb4934',
  },
  orange: {
    1: '#d65d0e',
    2: '#fe8019',
  },
  green: {
    1: '#98971a',
    2: '#b8bb26',
  },
  yellow: {
    1: '#d79921',
    2: '#fabd2f',
  },
  blue: {
    1: '#458588',
    2: '#83a598',
  },
  purple: {
    1: '#b16286',
    2: '#d3869b',
  },
  aqua: {
    1: '#689d6a',
    2: '#8ec07c',
  },
};

// Define the dark theme colors
const darkColors = {
  text: '#ebdbb2',
  background: '#000000',
  foreground: '#ebdbb2',
  red: {
    1: '#cc241d',
    2: '#fb4934',
  },
  orange: {
    1: '#d65d0e',
    2: '#fe8019',
  },
  green: {
    1: '#98971a',
    2: '#b8bb26',
  },
  yellow: {
    1: '#d79921',
    2: '#fabd2f',
  },
  blue: {
    1: '#458588',
    2: '#83a598',
  },
  purple: {
    1: '#b16286',
    2: '#d3869b',
  },
  aqua: {
    1: '#689d6a',
    2: '#8ec07c',
  },
};

// Define the common styles for both light and dark themes
const commonStyles = {
  fonts: {
    body: "ComicCode",
    heading: "ComicCode",
  },
  fontWeights: {
    heading: 700,
  },
  // Add other common styles as needed
};

// Combine the light and dark themes
const theme = {
  light: {
    colors: lightColors,
    ...commonStyles,
  },
  dark: {
    colors: darkColors,
    ...commonStyles,
  },
};

export default theme;

