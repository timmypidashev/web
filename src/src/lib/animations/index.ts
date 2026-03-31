export const ANIMATION_IDS = ["game-of-life", "lava-lamp", "confetti"] as const;
export type AnimationId = (typeof ANIMATION_IDS)[number];
export const DEFAULT_ANIMATION_ID: AnimationId = "game-of-life";

export const ANIMATION_LABELS: Record<AnimationId, string> = {
  "game-of-life": "life",
  "lava-lamp": "lava",
  "confetti": "confetti",
};
