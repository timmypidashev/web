import type { AnimationEngine } from "@/lib/animations/types";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: [number, number, number];
  baseColor: [number, number, number];
  opacity: number;
  dop: number;
  elevation: number;
  targetElevation: number;
  staggerDelay: number;
  burst: boolean;
}

const BASE_CONFETTI = 350;
const BASE_AREA = 1920 * 1080;
const PI_2 = 2 * Math.PI;
const TARGET_FPS = 60;
const SPEED_FACTOR = 0.15;
const STAGGER_INTERVAL = 12;
const COLOR_LERP_SPEED = 0.02;
const MOUSE_INFLUENCE_RADIUS = 150;
const ELEVATION_FACTOR = 6;
const ELEVATION_LERP_SPEED = 0.05;
const COLOR_SHIFT_AMOUNT = 30;
const SHADOW_OFFSET_RATIO = 1.1;

function range(a: number, b: number): number {
  return (b - a) * Math.random() + a;
}

export class ConfettiEngine implements AnimationEngine {
  id = "confetti";
  name = "Confetti";

  private particles: ConfettiParticle[] = [];
  private palette: [number, number, number][] = [];
  private width = 0;
  private height = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private mouseXNorm = 0.5;
  private elapsed = 0;

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
    this.mouseXNorm = 0.5;
    this.initParticles();
  }

  cleanup(): void {
    this.particles = [];
  }

  private randomColor(): [number, number, number] {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  private getParticleCount(): number {
    const area = this.width * this.height;
    return Math.max(20, Math.round(BASE_CONFETTI * (area / BASE_AREA)));
  }

  private initParticles(): void {
    this.particles = [];
    const count = this.getParticleCount();
    for (let i = 0; i < count; i++) {
      const baseColor = this.randomColor();
      const r = ~~range(3, 8);
      this.particles.push({
        x: range(-r * 2, this.width - r * 2),
        y: range(-20, this.height - r * 2),
        vx: (range(0, 2) + 8 * 0.5 - 5) * SPEED_FACTOR,
        vy: (0.7 * r + range(-1, 1)) * SPEED_FACTOR,
        r,
        color: [...baseColor],
        baseColor,
        opacity: 0,
        dop: 0.03 * range(1, 4) * SPEED_FACTOR,
        elevation: 0,
        targetElevation: 0,
        staggerDelay: i * STAGGER_INTERVAL + range(0, STAGGER_INTERVAL),
        burst: false,
      });
    }
  }

  private replaceParticle(p: ConfettiParticle): void {
    p.opacity = 0;
    p.dop = 0.03 * range(1, 4) * SPEED_FACTOR;
    p.x = range(-p.r * 2, this.width - p.r * 2);
    p.y = range(-20, -p.r * 2);
    p.vx = (range(0, 2) + 8 * this.mouseXNorm - 5) * SPEED_FACTOR;
    p.vy = (0.7 * p.r + range(-1, 1)) * SPEED_FACTOR;
    p.elevation = 0;
    p.targetElevation = 0;
    p.baseColor = this.randomColor();
    p.color = [...p.baseColor];
    p.burst = false;
  }

  update(deltaTime: number): void {
    const dt = deltaTime / (1000 / TARGET_FPS);
    this.elapsed += deltaTime;

    const mouseX = this.mouseX;
    const mouseY = this.mouseY;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Stagger gate
      if (p.staggerDelay >= 0) {
        if (this.elapsed >= p.staggerDelay) {
          p.staggerDelay = -1;
        } else {
          continue;
        }
      }

      // Gravity (capped so falling particles don't accelerate)
      const maxVy = (0.7 * p.r + 1) * SPEED_FACTOR;
      if (p.vy < maxVy) {
        p.vy = Math.min(p.vy + 0.02 * dt, maxVy);
      }

      // Position update
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Fade in only (no fade-out cycle)
      if (p.opacity < 1) {
        p.opacity += Math.abs(p.dop) * dt;
        if (p.opacity > 1) p.opacity = 1;
      }

      // Past the bottom: burst particles get removed, base particles recycle
      if (p.y > this.height + p.r) {
        if (p.burst) {
          this.particles.splice(i, 1);
          i--;
        } else {
          this.replaceParticle(p);
        }
        continue;
      }

      // Horizontal wrap
      const xmax = this.width - p.r;
      if (p.x < 0 || p.x > xmax) {
        p.x = ((p.x % xmax) + xmax) % xmax;
      }

      // Mouse proximity elevation
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_INFLUENCE_RADIUS && p.opacity > 0.1) {
        const influenceFactor = Math.cos(
          (dist / MOUSE_INFLUENCE_RADIUS) * (Math.PI / 2)
        );
        p.targetElevation =
          ELEVATION_FACTOR * influenceFactor * influenceFactor;

        const shift = influenceFactor * COLOR_SHIFT_AMOUNT * 0.5;
        p.color = [
          Math.min(255, Math.max(0, p.baseColor[0] + shift)),
          Math.min(255, Math.max(0, p.baseColor[1] + shift)),
          Math.min(255, Math.max(0, p.baseColor[2] + shift)),
        ];
      } else {
        p.targetElevation = 0;
        p.color[0] += (p.baseColor[0] - p.color[0]) * 0.1;
        p.color[1] += (p.baseColor[1] - p.color[1]) * 0.1;
        p.color[2] += (p.baseColor[2] - p.color[2]) * 0.1;
      }

      // Elevation lerp
      p.elevation +=
        (p.targetElevation - p.elevation) * ELEVATION_LERP_SPEED * dt;
    }

  }

  render(
    ctx: CanvasRenderingContext2D,
    _width: number,
    _height: number
  ): void {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.opacity <= 0.01 || p.staggerDelay >= 0) continue;

      const drawX = ~~p.x;
      const drawY = ~~p.y - p.elevation;
      const [r, g, b] = p.color;

      // Shadow
      if (p.elevation > 0.5) {
        const shadowAlpha =
          0.2 * (p.elevation / ELEVATION_FACTOR) * p.opacity;
        ctx.globalAlpha = shadowAlpha;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.arc(
          drawX,
          drawY + p.elevation * SHADOW_OFFSET_RATIO,
          p.r,
          0,
          PI_2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      // Main circle
      ctx.globalAlpha = p.opacity * 0.9;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.r, 0, PI_2);
      ctx.fill();

      // Highlight on elevated particles
      if (p.elevation > 0.5) {
        const highlightAlpha =
          0.1 * (p.elevation / ELEVATION_FACTOR) * p.opacity;
        ctx.globalAlpha = highlightAlpha;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, Math.PI, 0);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  handleResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    const target = this.getParticleCount();
    while (this.particles.length < target) {
      const baseColor = this.randomColor();
      const r = ~~range(3, 8);
      this.particles.push({
        x: range(-r * 2, width - r * 2),
        y: range(-20, height - r * 2),
        vx: (range(0, 2) + 8 * 0.5 - 5) * SPEED_FACTOR,
        vy: (0.7 * r + range(-1, 1)) * SPEED_FACTOR,
        r,
        color: [...baseColor],
        baseColor,
        opacity: 0,
        dop: 0.03 * range(1, 4) * SPEED_FACTOR,
        elevation: 0,
        targetElevation: 0,
        staggerDelay: -1,
        burst: false,
      });
    }
    if (this.particles.length > target) {
      this.particles.length = target;
    }
  }

  handleMouseMove(x: number, y: number, _isDown: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
    if (this.width > 0) {
      this.mouseXNorm = Math.max(0, Math.min(1, x / this.width));
    }
  }

  handleMouseDown(x: number, y: number): void {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const baseColor = this.randomColor();
      const r = ~~range(3, 8);
      const angle = (i / count) * PI_2 + range(-0.3, 0.3);
      const speed = range(0.3, 1.2);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r,
        color: [...baseColor],
        baseColor,
        opacity: 1,
        dop: 0,
        elevation: 0,
        targetElevation: 0,
        staggerDelay: -1,
        burst: true,
      });
    }
  }

  handleMouseUp(): void {}

  handleMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.mouseXNorm = 0.5;
  }

  updatePalette(palette: [number, number, number][], _bgColor: string): void {
    this.palette = palette;
    for (const p of this.particles) {
      p.baseColor = palette[Math.floor(Math.random() * palette.length)];
    }
  }
}
