import type { AnimationEngine } from "@/lib/animations/types";
import { GameOfLifeEngine } from "@/components/background/engines/game-of-life";
import { LavaLampEngine } from "@/components/background/engines/lava-lamp";
import { ConfettiEngine } from "@/components/background/engines/confetti";
import { AsciiquariumEngine } from "@/components/background/engines/asciiquarium";
import { PipesEngine } from "@/components/background/engines/pipes";

type ChildId = "game-of-life" | "lava-lamp" | "confetti" | "asciiquarium" | "pipes";

const CHILD_IDS: ChildId[] = [
  "game-of-life",
  "lava-lamp",
  "confetti",
  "asciiquarium",
  "pipes",
];

const PLAY_DURATION = 30_000;
const STATE_KEY = "shuffle-state";

interface StoredState {
  childId: ChildId;
  startedAt: number;
}

function createChild(id: ChildId): AnimationEngine {
  switch (id) {
    case "game-of-life":
      return new GameOfLifeEngine();
    case "lava-lamp":
      return new LavaLampEngine();
    case "confetti":
      return new ConfettiEngine();
    case "asciiquarium":
      return new AsciiquariumEngine();
    case "pipes":
      return new PipesEngine();
  }
}

function pickDifferent(current: ChildId | null): ChildId {
  const others = current
    ? CHILD_IDS.filter((id) => id !== current)
    : CHILD_IDS;
  return others[Math.floor(Math.random() * others.length)];
}

function save(state: StoredState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {}
}

function load(): StoredState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as StoredState;
    if (CHILD_IDS.includes(state.childId)) return state;
    return null;
  } catch {
    return null;
  }
}

export class ShuffleEngine implements AnimationEngine {
  id = "shuffle";
  name = "Shuffle";

  private child: AnimationEngine | null = null;
  private currentChildId: ChildId | null = null;
  private startedAt = 0;
  private phase: "playing" | "exiting" = "playing";

  private width = 0;
  private height = 0;
  private palette: [number, number, number][] = [];
  private bgColor = "";

  init(
    width: number,
    height: number,
    palette: [number, number, number][],
    bgColor: string
  ): void {
    this.width = width;
    this.height = height;
    this.palette = palette;
    this.bgColor = bgColor;

    const stored = load();

    if (stored && Date.now() - stored.startedAt < PLAY_DURATION) {
      // Animation still within its play window — continue it
      // Covers: Astro nav, sidebar mount, layout switch, quick refresh
      this.currentChildId = stored.childId;
    } else {
      // No recent state (first visit, hard refresh after timer expired) — game-of-life
      this.currentChildId = "game-of-life";
    }

    this.startedAt = Date.now();

    this.phase = "playing";
    this.child = createChild(this.currentChildId);
    this.child.init(this.width, this.height, this.palette, this.bgColor);
    save({ childId: this.currentChildId, startedAt: this.startedAt });
  }

  private switchTo(childId: ChildId, startedAt: number): void {
    if (this.child) this.child.cleanup();
    this.currentChildId = childId;
    this.startedAt = startedAt;
    this.phase = "playing";
    this.child = createChild(childId);
    this.child.init(this.width, this.height, this.palette, this.bgColor);
  }

  private advance(): void {
    // Check if another instance already advanced
    const stored = load();
    if (stored && stored.childId !== this.currentChildId) {
      this.switchTo(stored.childId, stored.startedAt);
    } else {
      const next = pickDifferent(this.currentChildId);
      const now = Date.now();
      save({ childId: next, startedAt: now });
      this.switchTo(next, now);
    }
  }

  update(deltaTime: number): void {
    if (!this.child) return;

    // Sync: if another instance (sidebar, tab) switched, follow
    const stored = load();
    if (stored && stored.childId !== this.currentChildId) {
      this.switchTo(stored.childId, stored.startedAt);
      return;
    }

    this.child.update(deltaTime);

    const elapsed = Date.now() - this.startedAt;

    if (this.phase === "playing" && elapsed >= PLAY_DURATION) {
      this.child.beginExit();
      this.phase = "exiting";
    }

    if (this.phase === "exiting" && this.child.isExitComplete()) {
      this.child.cleanup();
      this.advance();
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    if (this.child) this.child.render(ctx, width, height);
  }

  handleResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.child) this.child.handleResize(width, height);
  }

  handleMouseMove(x: number, y: number, isDown: boolean): void {
    if (this.child) this.child.handleMouseMove(x, y, isDown);
  }

  handleMouseDown(x: number, y: number): void {
    if (this.child) this.child.handleMouseDown(x, y);
  }

  handleMouseUp(): void {
    if (this.child) this.child.handleMouseUp();
  }

  handleMouseLeave(): void {
    if (this.child) this.child.handleMouseLeave();
  }

  updatePalette(palette: [number, number, number][], bgColor: string): void {
    this.palette = palette;
    this.bgColor = bgColor;
    if (this.child) this.child.updatePalette(palette, bgColor);
  }

  beginExit(): void {
    if (this.child) this.child.beginExit();
  }

  isExitComplete(): boolean {
    return this.child ? this.child.isExitComplete() : true;
  }

  cleanup(): void {
    if (this.child) {
      this.child.cleanup();
      this.child = null;
    }
  }
}
