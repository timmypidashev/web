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
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.yellow.bright'),
            '--tw-prose-links': theme('colors.blue.bright'),
            '--tw-prose-bold': theme('colors.orange.bright'),
            '--tw-prose-quotes': theme('colors.green.bright'),
            '--tw-prose-code': theme('colors.purple.bright'),
            '--tw-prose-hr': theme('colors.foreground'),
            '--tw-prose-bullets': theme('colors.foreground'),

            // Base text color
            color: theme('colors.foreground'),

            // Headings
            h1: {
              color: theme('colors.yellow.bright'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.yellow.bright'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.yellow.bright'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.yellow.bright'),
              fontWeight: '600',
            },

            // Links
            a: {
              color: theme('colors.blue.bright'),
              '&:hover': {
                color: theme('colors.blue.DEFAULT'),
              },
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.blue.bright')}`,
              transition: 'all 0.2s ease-in-out',
            },

            // Bold
            strong: {
              color: theme('colors.orange.bright'),
              fontWeight: '600',
            },

            // Lists
            ul: {
              li: {
                '&::before': {
                  backgroundColor: theme('colors.foreground'),
                },
              },
            },

            // Blockquotes
            blockquote: {
              borderLeftColor: theme('colors.green.bright'),
              color: theme('colors.green.bright'),
              fontStyle: 'italic',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              p: {
                '&::before': { content: 'none' },
                '&::after': { content: 'none' },
              },
            },

            // Code
            code: {
              color: theme('colors.purple.bright'),
              backgroundColor: '#282828', // A dark gray that works with black
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
              '&::before': {
                content: '""',
              },
              '&::after': {
                content: '""',
              },
            },

            // Inline code
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },

            // Pre
            pre: {
              backgroundColor: '#282828',
              color: theme('colors.foreground'),
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                '&::before': { content: 'none' },
                '&::after': { content: 'none' },
              },
            },

            // Horizontal rules
            hr: {
              borderColor: theme('colors.foreground'),
              opacity: '0.2',
            },

            // Table
            table: {
              thead: {
                borderBottomColor: theme('colors.foreground'),
                th: {
                  color: theme('colors.yellow.bright'),
                },
              },
              tbody: {
                tr: {
                  borderBottomColor: theme('colors.foreground'),
                },
              },
            },

            // Images
            img: {
              borderRadius: '0.375rem',
            },

            // Figures
            figcaption: {
              color: theme('colors.foreground'),
              opacity: '0.8',
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
