import { THEMES, DEFAULT_THEME_ID } from "./index";
import { CSS_PROPS } from "./props";
import type { Theme } from "./types";

export function getStoredThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return localStorage.getItem("theme") || DEFAULT_THEME_ID;
}

export function saveTheme(id: string): void {
  localStorage.setItem("theme", id);
}

export function getNextTheme(currentId: string): Theme {
  const list = Object.values(THEMES);
  const idx = list.findIndex((t) => t.id === currentId);
  return list[(idx + 1) % list.length];
}

/** Sets CSS vars and notifies canvas, but does NOT persist to localStorage. */
export function previewTheme(id: string): void {
  const theme = THEMES[id];
  if (!theme) return;

  const root = document.documentElement;
  for (const [key, prop] of CSS_PROPS) {
    root.style.setProperty(prop, theme.colors[key]);
  }


  document.dispatchEvent(new CustomEvent("theme-changed", { detail: { id } }));
}

export function applyTheme(id: string): void {
  const theme = THEMES[id];
  if (!theme) return;

  // Set CSS vars on :root for immediate visual update
  const root = document.documentElement;
  for (const [key, prop] of CSS_PROPS) {
    root.style.setProperty(prop, theme.colors[key]);
  }

  // Update <style id="theme-vars"> so Astro view transitions don't revert
  let el = document.getElementById("theme-vars") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "theme-vars";
    document.head.appendChild(el);
  }
  let css = ":root{";
  for (const [key, prop] of CSS_PROPS) {
    css += `${prop}:${theme.colors[key]};`;
  }
  css += "}";
  el.textContent = css;

  saveTheme(id);

  document.dispatchEvent(new CustomEvent("theme-changed", { detail: { id } }));
}
