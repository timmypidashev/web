import { ANIMATION_IDS, DEFAULT_ANIMATION_ID } from "./index";
import type { AnimationId } from "./index";

export function getStoredAnimationId(): AnimationId {
  if (typeof window === "undefined") return DEFAULT_ANIMATION_ID;
  const stored = localStorage.getItem("animation");
  if (stored && (ANIMATION_IDS as readonly string[]).includes(stored)) {
    return stored as AnimationId;
  }
  return DEFAULT_ANIMATION_ID;
}

export function saveAnimation(id: AnimationId): void {
  localStorage.setItem("animation", id);
}

export function getNextAnimation(currentId: AnimationId): AnimationId {
  const idx = ANIMATION_IDS.indexOf(currentId);
  return ANIMATION_IDS[(idx + 1) % ANIMATION_IDS.length];
}
