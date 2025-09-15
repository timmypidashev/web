module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "comic-code": ["Comic Code", "monospace"],
      },
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
      },
      keyframes: {
        "draw-line": {
          "0%": { "stroke-dashoffset": "100" },
          "100%": { "stroke-dashoffset": "0" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "draw-line": "draw-line 0.6s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-in-out forwards"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            "--tw-prose-body": theme("colors.foreground"),
            "--tw-prose-headings": theme("colors.yellow.bright"),
            "--tw-prose-links": theme("colors.blue.bright"),
            "--tw-prose-bold": theme("colors.orange.bright"),
            "--tw-prose-quotes": theme("colors.green.bright"),
            "--tw-prose-code": theme("colors.purple.bright"),
            "--tw-prose-hr": theme("colors.foreground"),
            "--tw-prose-bullets": theme("colors.foreground"),

            // Base text color
            color: theme("colors.foreground"),

            // Headings
            h1: {
              color: theme("colors.yellow.bright"),
              fontWeight: "700",
            },
            h2: {
              color: theme("colors.yellow.bright"),
              fontWeight: "600",
            },
            h3: {
              color: theme("colors.yellow.bright"),
              fontWeight: "600",
            },
            h4: {
              color: theme("colors.yellow.bright"),
              fontWeight: "600",
            },

            // Links
            a: {
              color: theme("colors.blue.bright"),
              "&:hover": {
                color: theme("colors.blue.DEFAULT"),
              },
              textDecoration: "none",
              borderBottom: `1px solid ${theme("colors.blue.bright")}`,
              transition: "all 0.2s ease-in-out",
            },

            // Code
            'code:not([data-language])': {
              color: theme('colors.purple.bright'),
              backgroundColor: '#282828',
              padding: '0',
              borderRadius: '0.25rem',
              fontFamily: 'Comic Code, monospace',
              fontWeight: '400',
              fontSize: 'inherit', // Match the parent text size
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },

            'pre': {
              backgroundColor: '#282828',
              color: theme("colors.foreground"),
              borderRadius: '0.5rem',
              overflow: 'visible', // This allows the copy button to be positioned outside
              position: 'relative', // For the copy button positioning
              marginTop: '1.5rem', // Space for the copy button and language label
              fontSize: 'inherit', // Match the parent font size
            },

            'pre code': {
              display: 'block',
              fontFamily: 'Comic Code, monospace',
              fontSize: '1em', // This will inherit from the prose-lg setting
              padding: '0',
              overflow: 'auto', // Enable horizontal scrolling
              whiteSpace: 'pre',
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },


            '[data-rehype-pretty-code-fragment]:nth-of-type(2) pre': {
              '[data-line]::before': {
                content: 'counter(line)',
                counterIncrement: 'line',
                display: 'inline-block',
                width: '1rem',
                marginRight: '1rem',
                textAlign: 'right',
                color: '#86e1fc',
              },
              '[data-highlighted-line]::before': {
                color: '#86e1fc',
              },
            },

            // Bold
            strong: {
              color: theme("colors.orange.bright"),
              fontWeight: "600",
            },

            // Lists
            ul: {
              li: {
                "&::before": {
                  backgroundColor: theme("colors.foreground"),
                },
              },
            },

            // Blockquotes
            blockquote: {
              borderLeftColor: theme("colors.green.bright"),
              color: theme("colors.green.bright"),
              fontStyle: "italic",
              quotes: "\"\\201C\"\"\\201D\"\"\\2018\"\"\\2019\"",
              p: {
                "&::before": { content: "none" },
                "&::after": { content: "none" },
              },
            },

            // Horizontal rules
            hr: {
              borderColor: theme("colors.foreground"),
              opacity: "0.2",
            },

            // Table
            table: {
              thead: {
                borderBottomColor: theme("colors.foreground"),
                th: {
                  color: theme("colors.yellow.bright"),
                },
              },
              tbody: {
                tr: {
                  borderBottomColor: theme("colors.foreground"),
                },
              },
            },

            // Images
            img: {
              borderRadius: "0.375rem",
            },

            // Figures
            figcaption: {
              color: theme("colors.foreground"),
              opacity: "0.8",
            },
          },
        },
        lg: {
          css: {
            "pre code": {
              fontSize: "1rem",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
