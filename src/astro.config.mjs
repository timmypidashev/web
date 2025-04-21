import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    port: 3000,
  },
  adapter: node({
    mode: "standalone",
  }),
  site: "https://timmypidashev.dev",
  build: {
    // Enable build-time optimizations
    inlineStylesheets: "auto",
    // Split large components into smaller chunks
    splitComponents: true,
  },
  integrations: [
    tailwind(), 
    react(), 
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        /**
         * Adds ids to headings
         */
        rehypeSlug,
        [
          /**
           * Enhances code blocks with syntax highlighting, line numbers,
           * titles, and allows highlighting specific lines and words
           */

          rehypePrettyCode,
          {
            theme: {
              "name": "Darkbox",
              "type": "dark",
              "colors": {
                "editor.background": "#000000",
                "editor.foreground": "#ebdbb2"
              },
              "tokenColors": [
                {
                  "scope": ["comment", "punctuation.definition.comment"],
                  "settings": {
                    "foreground": "#928374",
                    "fontStyle": "italic"
                  }
                },
                {
                  "scope": ["constant", "variable.other.constant"],
                  "settings": {
                    "foreground": "#d3869b"
                  }
                },
                {
                  "scope": "variable",
                  "settings": {
                    "foreground": "#ebdbb2"
                  }
                },
                {
                  "scope": ["keyword", "storage.type", "storage.modifier"],
                  "settings": {
                    "foreground": "#fb4934"
                  }
                },
                {
                  "scope": ["string", "punctuation.definition.string"],
                  "settings": {
                    "foreground": "#b8bb26"
                  }
                },
                {
                  "scope": ["entity.name.function", "support.function"],
                  "settings": {
                    "foreground": "#b8bb26"
                  }
                },
                {
                  "scope": "entity.name.type",
                  "settings": {
                    "foreground": "#fabd2f"
                  }
                },
                {
                  "scope": ["entity.name.tag", "punctuation.definition.tag"],
                  "settings": {
                    "foreground": "#83a598"
                  }
                },
                {
                  "scope": ["entity.other.attribute-name"],
                  "settings": {
                    "foreground": "#8ec07c"
                  }
                },
                {
                  "scope": ["punctuation", "meta.brace"],
                  "settings": {
                    "foreground": "#ebdbb2"
                  }
                },
                {
                  "scope": "markup.inline.raw",
                  "settings": {
                    "foreground": "#fe8019"
                  }
                },
                {
                  "scope": ["markup.heading"],
                  "settings": {
                    "foreground": "#b8bb26",
                    "fontStyle": "bold"
                  }
                },
                {
                  "scope": ["markup.bold"],
                  "settings": {
                    "foreground": "#fe8019",
                    "fontStyle": "bold"
                  }
                },
                {
                  "scope": ["markup.italic"],
                  "settings": {
                    "foreground": "#fe8019",
                    "fontStyle": "italic"
                  }
                },
                {
                  "scope": ["markup.list"],
                  "settings": {
                    "foreground": "#83a598"
                  }
                },
                {
                  "scope": ["markup.quote"],
                  "settings": {
                    "foreground": "#928374",
                    "fontStyle": "italic"
                  }
                },
                {
                  "scope": ["markup.link"],
                  "settings": {
                    "foreground": "#8ec07c"
                  }
                },
                {
                  "scope": "support.class",
                  "settings": {
                    "foreground": "#fabd2f"
                  }
                },
                {
                  "scope": "number",
                  "settings": {
                    "foreground": "#d3869b"
                  }
                }
              ],
            },
            keepBackground: true,
          },
        ],
      ],
    }),
    sitemap({
      filter: (page) => {
        return !page.includes("/drafts/") && !page.includes("/private/");
      },
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
