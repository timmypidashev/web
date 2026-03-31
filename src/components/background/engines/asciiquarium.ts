import type { AnimationEngine } from "@/lib/animations/types";

// --- ASCII Art ---

interface AsciiPattern {
  lines: string[];
  width: number;
  height: number;
}

function pat(lines: string[]): AsciiPattern {
  return {
    lines,
    width: Math.max(...lines.map((l) => l.length)),
    height: lines.length,
  };
}

const FISH_DEFS: {
  size: "small" | "medium";
  weight: number;
  right: AsciiPattern;
  left: AsciiPattern;
}[] = [
  { size: "small", weight: 30, right: pat(["><>"]), left: pat(["<><"]) },
  {
    size: "small",
    weight: 30,
    right: pat(["><(('>"]),
    left: pat(["<'))><"]),
  },
  {
    size: "medium",
    weight: 20,
    right: pat(["><((o>"]),
    left: pat(["<o))><"]),
  },
  {
    size: "medium",
    weight: 10,
    right: pat(["><((('>"]),
    left: pat(["<')))><"]),
  },
];

const TOTAL_FISH_WEIGHT = FISH_DEFS.reduce((s, d) => s + d.weight, 0);

const BUBBLE_CHARS = [".", "o", "O"];

// --- Entity Interfaces ---

interface FishEntity {
  kind: "fish";
  x: number;
  y: number;
  vx: number;
  pattern: AsciiPattern;
  size: "small" | "medium";
  color: [number, number, number];
  baseColor: [number, number, number];
  opacity: number;
  elevation: number;
  targetElevation: number;
  staggerDelay: number;
}

interface BubbleEntity {
  kind: "bubble";
  x: number;
  y: number;
  vy: number;
  wobblePhase: number;
  wobbleAmplitude: number;
  char: string;
  color: [number, number, number];
  baseColor: [number, number, number];
  opacity: number;
  elevation: number;
  targetElevation: number;
  staggerDelay: number;
  burst: boolean;
}

type AquariumEntity = FishEntity | BubbleEntity;

// --- Constants ---

const BASE_AREA = 1920 * 1080;
const BASE_FISH = 16;
const BASE_BUBBLES = 12;

const TARGET_FPS = 60;
const FONT_SIZE_MIN = 24;
const FONT_SIZE_MAX = 36;
const FONT_SIZE_REF_WIDTH = 1920;
const LINE_HEIGHT_RATIO = 1.15;
const STAGGER_INTERVAL = 15;
const PI_2 = Math.PI * 2;

const MOUSE_INFLUENCE_RADIUS = 150;
const ELEVATION_FACTOR = 6;
const ELEVATION_LERP_SPEED = 0.05;
const COLOR_SHIFT_AMOUNT = 30;
const SHADOW_OFFSET_RATIO = 1.1;

const FISH_SPEED: Record<string, { min: number; max: number }> = {
  small: { min: 0.8, max: 1.4 },
  medium: { min: 0.5, max: 0.9 },
};

const BUBBLE_SPEED_MIN = 0.3;
const BUBBLE_SPEED_MAX = 0.7;
const BUBBLE_WOBBLE_MIN = 0.3;
const BUBBLE_WOBBLE_MAX = 1.0;

const BURST_BUBBLE_COUNT = 10;

// --- Helpers ---

function range(a: number, b: number): number {
  return (b - a) * Math.random() + a;
}

function pickFishDef() {
  let r = Math.random() * TOTAL_FISH_WEIGHT;
  for (const def of FISH_DEFS) {
    r -= def.weight;
    if (r <= 0) return def;
  }
  return FISH_DEFS[0];
}

// --- Engine ---

export class AsciiquariumEngine implements AnimationEngine {
  id = "asciiquarium";
  name = "Asciiquarium";

  private fish: FishEntity[] = [];
  private bubbles: BubbleEntity[] = [];
  private exiting = false;
  private palette: [number, number, number][] = [];
  private width = 0;
  private height = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private elapsed = 0;
  private charWidth = 0;
  private fontSize = FONT_SIZE_MAX;
  private lineHeight = FONT_SIZE_MAX * LINE_HEIGHT_RATIO;
  private font = `bold ${FONT_SIZE_MAX}px monospace`;

  private computeFont(width: number): void {
    const t = Math.sqrt(Math.min(1, width / FONT_SIZE_REF_WIDTH));
    this.fontSize = Math.round(FONT_SIZE_MIN + (FONT_SIZE_MAX - FONT_SIZE_MIN) * t);
    this.lineHeight = Math.round(this.fontSize * LINE_HEIGHT_RATIO);
    this.font = `bold ${this.fontSize}px monospace`;
    this.charWidth = 0;
  }

  init(
    width: number,
    height: number,
    palette: [number, number, number][],
    _bgColor: string
  ): void {
    this.width = width;
    this.height = height;
    this.palette = palette;
    this.elapsed = 0;
    this.computeFont(width);
    this.initEntities();
  }

  beginExit(): void {
    if (this.exiting) return;
    this.exiting = true;

    // Stagger fade-out over 3 seconds
    for (const f of this.fish) {
      const delay = Math.random() * 3000;
      setTimeout(() => {
        f.staggerDelay = -2; // signal: fading out
      }, delay);
    }
    for (const b of this.bubbles) {
      const delay = Math.random() * 3000;
      setTimeout(() => {
        b.staggerDelay = -2;
      }, delay);
    }
  }

  isExitComplete(): boolean {
    if (!this.exiting) return false;
    for (const f of this.fish) {
      if (f.opacity > 0.01) return false;
    }
    for (const b of this.bubbles) {
      if (b.opacity > 0.01) return false;
    }
    return true;
  }

  cleanup(): void {
    this.fish = [];
    this.bubbles = [];
  }

  private randomColor(): [number, number, number] {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  private getCounts(): { fish: number; bubbles: number } {
    const ratio = (this.width * this.height) / BASE_AREA;
    return {
      fish: Math.max(5, Math.round(BASE_FISH * ratio)),
      bubbles: Math.max(5, Math.round(BASE_BUBBLES * ratio)),
    };
  }

  private initEntities(): void {
    this.fish = [];
    this.bubbles = [];

    const counts = this.getCounts();
    let idx = 0;

    for (let i = 0; i < counts.fish; i++) {
      this.fish.push(this.spawnFish(idx++));
    }

    for (let i = 0; i < counts.bubbles; i++) {
      this.bubbles.push(this.spawnBubble(idx++, false));
    }
  }

  private spawnFish(staggerIdx: number): FishEntity {
    const def = pickFishDef();
    const goRight = Math.random() > 0.5;
    const speed = range(FISH_SPEED[def.size].min, FISH_SPEED[def.size].max);
    const pattern = goRight ? def.right : def.left;
    const baseColor = this.randomColor();
    const cw = this.charWidth || 9.6;
    const pw = pattern.width * cw;

    // Start off-screen on the side they swim from
    const startX = goRight
      ? -pw - range(0, this.width * 0.5)
      : this.width + range(0, this.width * 0.5);

    return {
      kind: "fish",
      x: startX,
      y: range(this.height * 0.05, this.height * 0.9),
      vx: goRight ? speed : -speed,
      pattern,
      size: def.size,
      color: [...baseColor],
      baseColor,
      opacity: 1,
      elevation: 0,
      targetElevation: 0,
      staggerDelay: -1,
    };
  }

  private spawnBubble(staggerIdx: number, burst: boolean): BubbleEntity {
    const baseColor = this.randomColor();
    return {
      kind: "bubble",
      x: range(0, this.width),
      y: burst ? 0 : this.height + range(10, this.height * 0.5),
      vy: -range(BUBBLE_SPEED_MIN, BUBBLE_SPEED_MAX),
      wobblePhase: range(0, PI_2),
      wobbleAmplitude: range(BUBBLE_WOBBLE_MIN, BUBBLE_WOBBLE_MAX),
      char: BUBBLE_CHARS[Math.floor(Math.random() * BUBBLE_CHARS.length)],
      color: [...baseColor],
      baseColor,
      opacity: 1,
      elevation: 0,
      targetElevation: 0,
      staggerDelay: -1,
      burst,
    };
  }

  // --- Update ---

  update(deltaTime: number): void {
    const dt = deltaTime / (1000 / TARGET_FPS);
    this.elapsed += deltaTime;

    const mouseX = this.mouseX;
    const mouseY = this.mouseY;
    const cw = this.charWidth || 9.6;

    // Fish
    for (let i = this.fish.length - 1; i >= 0; i--) {
      const f = this.fish[i];
      if (f.staggerDelay >= 0) {
        if (this.elapsed >= f.staggerDelay) f.staggerDelay = -1;
        else continue;
      }

      // Fade out during exit
      if (f.staggerDelay === -2) {
        f.opacity -= 0.02 * dt;
        if (f.opacity <= 0) { f.opacity = 0; continue; }
      } else if (f.opacity < 1) {
        f.opacity = Math.min(1, f.opacity + 0.03 * dt);
      }

      f.x += f.vx * dt;

      const pw = f.pattern.width * cw;
      if (f.vx > 0 && f.x > this.width + pw) {
        f.x = -pw;
      } else if (f.vx < 0 && f.x < -pw) {
        f.x = this.width + pw;
      }

      const cx = f.x + (f.pattern.width * cw) / 2;
      const cy = f.y + (f.pattern.height * this.lineHeight) / 2;
      this.applyMouseInfluence(f, cx, cy, mouseX, mouseY, dt);
    }

    // Bubbles (reverse iteration for safe splice)
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];

      if (b.staggerDelay >= 0) {
        if (this.elapsed >= b.staggerDelay) b.staggerDelay = -1;
        else continue;
      }

      // Fade out during exit
      if (b.staggerDelay === -2) {
        b.opacity -= 0.02 * dt;
        if (b.opacity <= 0) { b.opacity = 0; continue; }
      } else if (b.opacity < 1) {
        b.opacity = Math.min(1, b.opacity + 0.03 * dt);
      }

      b.y += b.vy * dt;
      b.x +=
        Math.sin(this.elapsed * 0.003 + b.wobblePhase) *
        b.wobbleAmplitude *
        dt;

      if (b.y < -20) {
        if (b.burst) {
          this.bubbles.splice(i, 1);
          continue;
        } else {
          b.y = this.height + range(10, 40);
          b.x = range(0, this.width);
        }
      }

      this.applyMouseInfluence(b, b.x, b.y, mouseX, mouseY, dt);
    }
  }

  private applyMouseInfluence(
    entity: AquariumEntity,
    cx: number,
    cy: number,
    mouseX: number,
    mouseY: number,
    dt: number
  ): void {
    const dx = cx - mouseX;
    const dy = cy - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_INFLUENCE_RADIUS && entity.opacity > 0.1) {
      const inf = Math.cos((dist / MOUSE_INFLUENCE_RADIUS) * (Math.PI / 2));
      entity.targetElevation = ELEVATION_FACTOR * inf * inf;

      const shift = inf * COLOR_SHIFT_AMOUNT * 0.5;
      entity.color = [
        Math.min(255, Math.max(0, entity.baseColor[0] + shift)),
        Math.min(255, Math.max(0, entity.baseColor[1] + shift)),
        Math.min(255, Math.max(0, entity.baseColor[2] + shift)),
      ];
    } else {
      entity.targetElevation = 0;
      entity.color[0] += (entity.baseColor[0] - entity.color[0]) * 0.1;
      entity.color[1] += (entity.baseColor[1] - entity.color[1]) * 0.1;
      entity.color[2] += (entity.baseColor[2] - entity.color[2]) * 0.1;
    }

    entity.elevation +=
      (entity.targetElevation - entity.elevation) * ELEVATION_LERP_SPEED * dt;
  }

  // --- Render ---

  render(
    ctx: CanvasRenderingContext2D,
    _width: number,
    _height: number
  ): void {
    if (!this.charWidth) {
      ctx.font = this.font;
      this.charWidth = ctx.measureText("M").width;
    }

    ctx.font = this.font;
    ctx.textBaseline = "top";

    // Fish
    for (const f of this.fish) {
      if (f.opacity <= 0.01 || f.staggerDelay >= 0) continue;
      this.renderPattern(
        ctx,
        f.pattern,
        f.x,
        f.y,
        f.color,
        f.opacity,
        f.elevation
      );
    }

    // Bubbles
    for (const b of this.bubbles) {
      if (b.opacity <= 0.01 || b.staggerDelay >= 0) continue;
      this.renderChar(ctx, b.char, b.x, b.y, b.color, b.opacity, b.elevation);
    }

    ctx.globalAlpha = 1;
  }

  private renderPattern(
    ctx: CanvasRenderingContext2D,
    pattern: AsciiPattern,
    x: number,
    y: number,
    color: [number, number, number],
    opacity: number,
    elevation: number
  ): void {
    const drawY = y - elevation;
    const [r, g, b] = color;

    // Shadow
    if (elevation > 0.5) {
      const shadowAlpha = 0.2 * (elevation / ELEVATION_FACTOR) * opacity;
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = "rgb(0,0,0)";
      for (let line = 0; line < pattern.height; line++) {
        ctx.fillText(
          pattern.lines[line],
          x,
          drawY + line * this.lineHeight + elevation * SHADOW_OFFSET_RATIO
        );
      }
    }

    // Main text
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    for (let line = 0; line < pattern.height; line++) {
      ctx.fillText(pattern.lines[line], x, drawY + line * this.lineHeight);
    }

    // Highlight (top half of lines)
    if (elevation > 0.5) {
      const highlightAlpha = 0.1 * (elevation / ELEVATION_FACTOR) * opacity;
      ctx.globalAlpha = highlightAlpha;
      ctx.fillStyle = "rgb(255,255,255)";
      const topLines = Math.ceil(pattern.height / 2);
      for (let line = 0; line < topLines; line++) {
        ctx.fillText(pattern.lines[line], x, drawY + line * this.lineHeight);
      }
    }
  }

  private renderChar(
    ctx: CanvasRenderingContext2D,
    char: string,
    x: number,
    y: number,
    color: [number, number, number],
    opacity: number,
    elevation: number
  ): void {
    const drawY = y - elevation;
    const [r, g, b] = color;

    // Shadow
    if (elevation > 0.5) {
      const shadowAlpha = 0.2 * (elevation / ELEVATION_FACTOR) * opacity;
      ctx.globalAlpha = shadowAlpha;
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillText(char, x, drawY + elevation * SHADOW_OFFSET_RATIO);
    }

    // Main
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillText(char, x, drawY);

    // Highlight
    if (elevation > 0.5) {
      const highlightAlpha = 0.1 * (elevation / ELEVATION_FACTOR) * opacity;
      ctx.globalAlpha = highlightAlpha;
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillText(char, x, drawY);
    }
  }

  // --- Events ---

  handleResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.elapsed = 0;
    this.exiting = false;
    this.computeFont(width);
    this.initEntities();
  }

  handleMouseMove(x: number, y: number, _isDown: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseDown(x: number, y: number): void {
    for (let i = 0; i < BURST_BUBBLE_COUNT; i++) {
      const baseColor = this.randomColor();
      const angle = (i / BURST_BUBBLE_COUNT) * PI_2 + range(-0.3, 0.3);
      const speed = range(0.3, 1.0);
      this.bubbles.push({
        kind: "bubble",
        x,
        y,
        vy: -Math.abs(Math.sin(angle) * speed) - 0.3,
        wobblePhase: range(0, PI_2),
        wobbleAmplitude: Math.cos(angle) * speed * 0.5,
        char: BUBBLE_CHARS[Math.floor(Math.random() * BUBBLE_CHARS.length)],
        color: [...baseColor],
        baseColor,
        opacity: 1,
        elevation: 0,
        targetElevation: 0,
        staggerDelay: this.exiting ? -2 : -1,
        burst: true,
      });
    }
  }

  handleMouseUp(): void {}

  handleMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  updatePalette(
    palette: [number, number, number][],
    _bgColor: string
  ): void {
    this.palette = palette;
    for (let i = 0; i < this.fish.length; i++) {
      this.fish[i].baseColor = palette[i % palette.length];
    }
    for (let i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].baseColor = palette[i % palette.length];
    }
  }
}
