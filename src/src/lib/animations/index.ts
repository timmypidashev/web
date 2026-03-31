export const ANIMATION_IDS = ["shuffle", "game-of-life", "lava-lamp", "confetti", "asciiquarium", "pipes"] as const;
export type AnimationId = (typeof ANIMATION_IDS)[number];
export const DEFAULT_ANIMATION_ID: AnimationId = "shuffle";

export const ANIMATION_LABELS: Record<AnimationId, string> = {
  "shuffle": "shuffle",
  "game-of-life": "life",
  "lava-lamp": "lava",
  "confetti": "confetti",
  "asciiquarium": "aquarium",
  "pipes": "pipes",
};
