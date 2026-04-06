module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Desktop = wide screen + non-touch pointer. Used for mobile/desktop layout split.
      desk: { raw: "(min-width: 1024px) and (hover: hover) and (pointer: fine)" },
    },
    extend: {
      fontFamily: {
        "comic-code": ["Comic Code", "monospace"],
      },
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        red: {
          DEFAULT: "rgb(var(--color-red) / <alpha-value>)",
          bright: "rgb(var(--color-red-bright) / <alpha-value>)"
        },
        orange: {
          DEFAULT: "rgb(var(--color-orange) / <alpha-value>)",
          bright: "rgb(var(--color-orange-bright) / <alpha-value>)"
        },
        green: {
          DEFAULT: "rgb(var(--color-green) / <alpha-value>)",
          bright: "rgb(var(--color-green-bright) / <alpha-value>)"
        },
        yellow: {
          DEFAULT: "rgb(var(--color-yellow) / <alpha-value>)",
          bright: "rgb(var(--color-yellow-bright) / <alpha-value>)"
        },
        blue: {
          DEFAULT: "rgb(var(--color-blue) / <alpha-value>)",
          bright: "rgb(var(--color-blue-bright) / <alpha-value>)"
        },
        purple: {
          DEFAULT: "rgb(var(--color-purple) / <alpha-value>)",
          bright: "rgb(var(--color-purple-bright) / <alpha-value>)"
        },
        aqua: {
          DEFAULT: "rgb(var(--color-aqua) / <alpha-value>)",
          bright: "rgb(var(--color-aqua-bright) / <alpha-value>)"
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
      typography: () => ({
        DEFAULT: {
          css: {
            color: "rgb(var(--color-foreground))",
            "--tw-prose-body": "rgb(var(--color-foreground))",
            "--tw-prose-headings": "rgb(var(--color-yellow-bright))",
            "--tw-prose-links": "rgb(var(--color-blue-bright))",
            "--tw-prose-bold": "rgb(var(--color-orange-bright))",
            "--tw-prose-quotes": "rgb(var(--color-green-bright))",
            "--tw-prose-code": "rgb(var(--color-purple-bright))",
            "--tw-prose-hr": "rgb(var(--color-foreground))",
            "--tw-prose-bullets": "rgb(var(--color-foreground))",

            // Headings
            h1: {
              color: "rgb(var(--color-yellow-bright))",
              fontWeight: "700",
            },
            h2: {
              color: "rgb(var(--color-yellow-bright))",
              fontWeight: "600",
            },
            h3: {
              color: "rgb(var(--color-yellow-bright))",
              fontWeight: "600",
            },
            h4: {
              color: "rgb(var(--color-yellow-bright))",
              fontWeight: "600",
            },

            // Links
            a: {
              color: "rgb(var(--color-blue-bright))",
              "&:hover": {
                color: "rgb(var(--color-blue))",
              },
              textDecoration: "none",
              borderBottom: "1px solid rgb(var(--color-blue-bright))",
              transition: "all 0.2s ease-in-out",
            },

            // Code
            'code:not([data-language])': {
              color: "rgb(var(--color-purple-bright))",
              backgroundColor: "rgb(var(--color-surface))",
              padding: '0',
              borderRadius: '0.25rem',
              fontFamily: 'Comic Code, monospace',
              fontWeight: '400',
              fontSize: 'inherit',
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },

            'pre': {
              backgroundColor: "rgb(var(--color-surface))",
              color: "rgb(var(--color-foreground))",
              borderRadius: '0.5rem',
              overflow: 'visible',
              position: 'relative',
              marginTop: '1.5rem',
              fontSize: 'inherit',
            },

            'pre code': {
              display: 'block',
              fontFamily: 'Comic Code, monospace',
              fontSize: '1em',
              padding: '0',
              overflow: 'auto',
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
              color: "rgb(var(--color-orange-bright))",
              fontWeight: "600",
            },

            // Lists
            ul: {
              li: {
                "&::before": {
                  backgroundColor: "rgb(var(--color-foreground))",
                },
              },
            },

            // Blockquotes
            blockquote: {
              borderLeftColor: "rgb(var(--color-green-bright))",
              color: "rgb(var(--color-green-bright))",
              fontStyle: "italic",
              quotes: "\"\\201C\"\"\\201D\"\"\\2018\"\"\\2019\"",
              p: {
                "&::before": { content: "none" },
                "&::after": { content: "none" },
              },
            },

            // Horizontal rules
            hr: {
              borderColor: "rgb(var(--color-foreground))",
              opacity: "0.2",
            },

            // Table
            table: {
              thead: {
                borderBottomColor: "rgb(var(--color-foreground))",
                th: {
                  color: "rgb(var(--color-yellow-bright))",
                },
              },
              tbody: {
                tr: {
                  borderBottomColor: "rgb(var(--color-foreground))",
                },
              },
            },

            // Images
            img: {
              borderRadius: "0.375rem",
            },

            // Figures
            figcaption: {
              color: "rgb(var(--color-foreground))",
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
