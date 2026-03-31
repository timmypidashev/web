/**
 * Generates the inline <script> content for theme loading.
 * Called at build time in Astro frontmatter.
 * The script reads "theme" from localStorage, looks up colors, injects a <style> tag.
 */
import { THEMES } from "@/lib/themes";
import { CSS_PROPS } from "@/lib/themes/props";

// Pre-build a { prop: value } map for each theme at build time
const themeVars: Record<string, Record<string, string>> = {};
for (const [id, theme] of Object.entries(THEMES)) {
  const vars: Record<string, string> = {};
  for (const [key, prop] of CSS_PROPS) {
    vars[prop] = theme.colors[key];
  }
  themeVars[id] = vars;
}

// Sets inline styles on <html> — highest specificity, beats any stylesheet
const APPLY = `var v=t[id];if(!v)return;var s=document.documentElement.style;for(var k in v)s.setProperty(k,v[k])`;
const LOOKUP = `var id=localStorage.getItem("theme");if(!id)return;var t=${JSON.stringify(themeVars)};`;

export const THEME_LOADER_SCRIPT = `(function(){${LOOKUP}${APPLY}})();`;

export const THEME_NAV_SCRIPT = `document.addEventListener("astro:after-navigation",function(){${LOOKUP}${APPLY}});`;
