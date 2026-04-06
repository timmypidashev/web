import { THEMES, FAMILIES, DEFAULT_THEME_ID } from "@/lib/themes";
import { CSS_PROPS } from "@/lib/themes/props";
import type { Theme } from "@/lib/themes/types";

export function getStoredThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return localStorage.getItem("theme") || DEFAULT_THEME_ID;
}

export function saveTheme(id: string): void {
  localStorage.setItem("theme", id);
}

/** Cycle to the next theme family, jumping to its default variant. */
export function getNextFamily(currentId: string): Theme {
  const current = THEMES[currentId];
  const familyId = current?.family ?? FAMILIES[0].id;
  const idx = FAMILIES.findIndex((f) => f.id === familyId);
  const next = FAMILIES[(idx + 1) % FAMILIES.length];
  return THEMES[next.default];
}

/** Cycle to the next variant within the current family. */
export function getNextVariant(currentId: string): Theme {
  const current = THEMES[currentId];
  if (!current) return Object.values(THEMES)[0];
  const family = FAMILIES.find((f) => f.id === current.family);
  if (!family) return current;
  const idx = family.themes.findIndex((t) => t.id === currentId);
  return family.themes[(idx + 1) % family.themes.length];
}

// Keep for backward compat (cycles all themes linearly)
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
