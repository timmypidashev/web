module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ebdbb2",
        red: {
          DEFAULT: "#cc241d",
          bright: "#fb4934"
        },
        orange: {
          DEFAULT: "#d65d0e",
          bright: "#fe8019"
        },
        green: {
          DEFAULT: "#98971a",
          bright: "#b8bb26"
        },
        yellow: {
          DEFAULT: "#d79921",
          bright: "#fabd2f"
        },
        blue: {
          DEFAULT: "#458588",
          bright: "#83a598"
        },
        purple: {
          DEFAULT: "#b16286",
          bright: "#d3869b"
        },
        aqua: {
          DEFAULT: "#689d6a",
          bright: "#8ec07c"
        }
      }
    }
  },
  plugins: [],
};
