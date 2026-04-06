import type { APIRoute } from "astro";
import { THEMES, DEFAULT_THEME_ID } from "@/lib/themes";

function rgbToHex(rgb: string): string {
  return "#" + rgb.split(" ").map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
}

function rgbToRgba(rgb: string, alpha: number): string {
  return `rgba(${rgb.replaceAll(" ", ", ")}, ${alpha})`;
}

export const GET: APIRoute = ({ url }) => {
  const themeId = url.searchParams.get("theme") || DEFAULT_THEME_ID;
  const theme = THEMES[themeId];
  if (!theme) {
    return new Response("Unknown theme", { status: 404 });
  }

  const c = theme.colors;
  const isLight = theme.type === "light";
  const fg = rgbToHex(c.foreground);
  const fgMuted = rgbToRgba(c.foreground, 0.6);
  const fgSubtle = rgbToRgba(c.foreground, 0.4);
  const blue = rgbToHex(c.blue);
  const blueBright = rgbToHex(c.blueBright);
  const green = rgbToHex(c.green);
  const yellow = rgbToHex(c.yellow);
  const red = rgbToHex(c.red);
  const purple = rgbToHex(c.purple);
  const orange = rgbToHex(c.orange);
  const surface = rgbToHex(c.surface);
  const surfaceAlpha = rgbToRgba(c.surface, 0.3);
  const surfaceBorder = rgbToRgba(c.surface, 0.5);
  const surfaceHover = rgbToRgba(c.surface, 0.6);
  const bgTransparent = isLight ? rgbToRgba(c.foreground, 0.06) : rgbToRgba(c.foreground, 0.08);
  const bgSubtle = isLight ? rgbToRgba(c.foreground, 0.04) : rgbToRgba(c.foreground, 0.05);

  const css = `
main {
  --color-prettylights-syntax-comment: ${fgSubtle};
  --color-prettylights-syntax-constant: ${blueBright};
  --color-prettylights-syntax-entity: ${purple};
  --color-prettylights-syntax-storage-modifier-import: ${fg};
  --color-prettylights-syntax-entity-tag: ${green};
  --color-prettylights-syntax-keyword: ${red};
  --color-prettylights-syntax-string: ${blueBright};
  --color-prettylights-syntax-variable: ${orange};
  --color-prettylights-syntax-brackethighlighter-unmatched: ${red};
  --color-prettylights-syntax-invalid-illegal-text: ${fg};
  --color-prettylights-syntax-invalid-illegal-bg: ${red};
  --color-prettylights-syntax-carriage-return-text: ${fg};
  --color-prettylights-syntax-carriage-return-bg: ${red};
  --color-prettylights-syntax-string-regexp: ${green};
  --color-prettylights-syntax-markup-list: ${yellow};
  --color-prettylights-syntax-markup-heading: ${blueBright};
  --color-prettylights-syntax-markup-italic: ${fg};
  --color-prettylights-syntax-markup-bold: ${orange};
  --color-prettylights-syntax-markup-deleted-text: ${red};
  --color-prettylights-syntax-markup-deleted-bg: transparent;
  --color-prettylights-syntax-markup-inserted-text: ${green};
  --color-prettylights-syntax-markup-inserted-bg: transparent;
  --color-prettylights-syntax-markup-changed-text: ${yellow};
  --color-prettylights-syntax-markup-changed-bg: transparent;
  --color-prettylights-syntax-markup-ignored-text: ${fg};
  --color-prettylights-syntax-markup-ignored-bg: transparent;
  --color-prettylights-syntax-meta-diff-range: ${purple};
  --color-prettylights-syntax-brackethighlighter-angle: ${fgSubtle};
  --color-prettylights-syntax-sublimelinter-gutter-mark: ${fgSubtle};
  --color-prettylights-syntax-constant-other-reference-link: ${blueBright};

  --color-btn-text: ${fg};
  --color-btn-bg: ${bgTransparent};
  --color-btn-border: ${surfaceBorder};
  --color-btn-shadow: 0 0 transparent;
  --color-btn-inset-shadow: 0 0 transparent;
  --color-btn-hover-bg: ${surfaceAlpha};
  --color-btn-hover-border: ${surfaceHover};
  --color-btn-active-bg: ${bgSubtle};
  --color-btn-active-border: ${surfaceHover};
  --color-btn-selected-bg: ${bgTransparent};

  --color-btn-primary-text: ${fg};
  --color-btn-primary-bg: ${blue};
  --color-btn-primary-border: transparent;
  --color-btn-primary-shadow: 0 0 transparent;
  --color-btn-primary-inset-shadow: 0 0 transparent;
  --color-btn-primary-hover-bg: ${blueBright};
  --color-btn-primary-hover-border: transparent;
  --color-btn-primary-selected-bg: ${blue};
  --color-btn-primary-selected-shadow: 0 0 transparent;
  --color-btn-primary-disabled-text: ${fgMuted};
  --color-btn-primary-disabled-bg: ${rgbToRgba(c.blue, 0.6)};
  --color-btn-primary-disabled-border: transparent;

  --color-action-list-item-default-hover-bg: ${surfaceAlpha};
  --color-segmented-control-bg: ${surfaceAlpha};
  --color-segmented-control-button-bg: ${bgTransparent};
  --color-segmented-control-button-selected-border: ${surfaceBorder};

  --color-fg-default: ${fg};
  --color-fg-muted: ${fgMuted};
  --color-fg-subtle: ${fgSubtle};

  --color-canvas-default: transparent;
  --color-canvas-overlay: ${bgTransparent};
  --color-canvas-inset: ${bgSubtle};
  --color-canvas-subtle: ${bgSubtle};

  --color-border-default: ${surfaceBorder};
  --color-border-muted: ${surfaceAlpha};
  --color-neutral-muted: ${rgbToRgba(c.surface, 0.25)};

  --color-accent-fg: ${blueBright};
  --color-accent-emphasis: ${blue};
  --color-accent-muted: ${rgbToRgba(c.blue, 0.4)};
  --color-accent-subtle: ${rgbToRgba(c.blue, 0.1)};

  --color-success-fg: ${green};
  --color-attention-fg: ${yellow};
  --color-attention-muted: ${rgbToRgba(c.yellow, 0.4)};
  --color-attention-subtle: ${rgbToRgba(c.yellow, 0.15)};
  --color-danger-fg: ${red};
  --color-danger-muted: ${rgbToRgba(c.red, 0.4)};
  --color-danger-subtle: ${rgbToRgba(c.red, 0.1)};

  --color-primer-shadow-inset: 0 0 transparent;
  --color-scale-gray-7: ${surface};
  --color-scale-blue-8: ${blue};
  --color-social-reaction-bg-hover: ${surfaceAlpha};
  --color-social-reaction-bg-reacted-hover: ${rgbToRgba(c.blue, 0.3)};
}

main .pagination-loader-container {
  background-image: url(https://github.com/images/modules/pulls/progressive-disclosure-line${isLight ? "" : "-dark"}.svg);
}

.gsc-reactions-count { display: none; }
.gsc-timeline { flex-direction: column-reverse; }

.gsc-header {
  padding-bottom: 1rem;
  font-family: "Comic Code", monospace;
  border-bottom: none;
}

.gsc-comments > .gsc-header { order: 1; }
.gsc-comments > .gsc-comment-box {
  margin-bottom: 1rem;
  order: 2;
  font-family: "Comic Code", monospace;
  background-color: ${bgTransparent};
  border-radius: 0.5rem;
  border: 1px solid ${surfaceBorder};
}
.gsc-comments > .gsc-timeline { order: 3; }
.gsc-homepage-bg { background-color: transparent; }

main .gsc-loading-image {
  background-image: url(https://github.githubassets.com/images/mona-loading-${isLight ? "default" : "dimmed"}.gif);
}

.gsc-comment {
  border: 1px solid ${surfaceBorder};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background-color: ${bgTransparent};
  transition: border-color 0.2s ease;
}

.gsc-comment-header {
  background-color: ${bgSubtle};
  padding: 0.75rem;
  border-bottom: 1px solid ${rgbToRgba(c.surface, 0.2)};
  font-family: "Comic Code", monospace;
}

.gsc-comment-content {
  padding: 1rem;
  font-family: "Comic Code", monospace;
}

.gsc-comment-author { color: var(--color-fg-default); font-weight: 600; }
.gsc-comment-author-avatar img { border-radius: 50%; }
.gsc-comment-reactions { border-top: none; padding-top: 0.5rem; }

.gsc-reply-box {
  background-color: ${bgTransparent};
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
  font-family: "Comic Code", monospace;
  border: 1px solid ${rgbToRgba(c.surface, 0.25)};
}

.gsc-comment-box-textarea {
  background-color: ${bgSubtle};
  border: 1px solid ${surfaceBorder};
  border-radius: 0.5rem;
  color: var(--color-fg-default);
  font-family: "Comic Code", monospace;
  padding: 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.gsc-comment-box-textarea:focus {
  border-color: ${blueBright};
  box-shadow: 0 0 0 2px ${rgbToRgba(c.blue, 0.2)};
  outline: none;
}

.gsc-comment-box-buttons button {
  font-family: "Comic Code", monospace;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.gsc-comment pre {
  background-color: ${bgSubtle};
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid ${rgbToRgba(c.surface, 0.25)};
}

.gsc-comment code {
  font-family: "Comic Code", monospace;
  background-color: ${bgSubtle};
  color: ${purple};
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}

.gsc-comment:hover { border-color: ${surfaceHover}; }
.gsc-social-reaction-summary-item:hover { background-color: ${surfaceAlpha}; }

.gsc-timeline::-webkit-scrollbar { width: 8px; height: 8px; }
.gsc-timeline::-webkit-scrollbar-track { background: transparent; border-radius: 4px; }
.gsc-timeline::-webkit-scrollbar-thumb { background: ${surfaceBorder}; border-radius: 4px; }
.gsc-timeline::-webkit-scrollbar-thumb:hover { background: ${surface}; }

.gsc-comment-footer, .gsc-comment-footer-separator,
.gsc-reactions-button, .gsc-social-reaction-summary-item:not(:hover) { border: none; }

.gsc-upvote svg { fill: ${blueBright}; }
.gsc-downvote svg { fill: ${red}; }

.gsc-comment-box, .gsc-comment, .gsc-comment-reactions, button, .gsc-reply-box {
  transition: all 0.2s ease-in-out;
}

.gsc-main { border: none !important; }
.gsc-left-header { background-color: transparent !important; }
.gsc-right-header { background-color: transparent !important; }
.gsc-header-status { background-color: transparent !important; }

.gsc-comment-box, .gsc-comment-box-md-toolbar, .gsc-comment-box-buttons { border: none !important; }
.gsc-comment-box-md-toolbar-item { color: ${blueBright} !important; }

.gsc-comment-box-md-toolbar {
  background-color: ${bgSubtle} !important;
  padding: 0.5rem !important;
}

.gsc-comments .gsc-powered-by { display: none !important; }
.gsc-comments footer { display: none !important; }
.gsc-comments .gsc-powered-by a { visibility: hidden !important; }
`;

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
