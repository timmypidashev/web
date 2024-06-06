/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light:{
          background: "#282828",
          foreground: "#ebdbb2",
          red: {
            1: "#cc241d",
            2: "#fb4934"
          },
          orange: {
            1: "#d65d0e", 
            2: "#fe8019"
          },
          green: {
            1: "#98971a",
            2: "#b8bb26"
          },
          yellow: {
            1: "#d79921",
            2: "#fabd2f"
          },
          blue: {
            1: "#458588",
            2: "#83a598"
          },
          purple: {
            1: "#b16286",
            2: "#d3869b"
          },
          aqua: {
            1: "#689d6a",
            2: "#8ec07c"
          },
        },
        dark: {
          background: "#000000",
          foreground: "#ebdbb2",
          red: {
            1: "#cc241d",
            2: "#fb4934"
          },
          orange: {
            1: "#d65d0e",
            2: "#fe8019"
          },
          green: {
            1: "#98971a",
            2: "#b8bb26"
          },
          yellow: {
            1: "#d79921",
            2: "#fabd2f"
          },
          blue: {
            1: "#458588",
            2: "#83a598"
          },
          purple: {
            1: "#b16286",
            2: "#d3869b"
          },
          aqua: {
            1: "#689d6a",
            2: "#8ec07c"
          },
        },
      },
    },
  },
  plugins: [],
};
