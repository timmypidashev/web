import type { AnimationEngine } from "@/lib/animations/types";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radiusScale: number;
  targetRadiusScale: number;
  color: [number, number, number];
  targetColor: [number, number, number];
  phase: number;
  phaseSpeed: number;
  staggerDelay: number; // -1 means already revealed
}

const BLOB_COUNT = 26;
const BASE_MAX_BLOBS = 80; // at 1080p; scales with canvas area
const MIN_SPEED = 0.1;
const MAX_SPEED = 0.35;
const RESOLUTION_SCALE = 5; // render at 1/5 resolution (was 1/4)
const FIELD_THRESHOLD = 1.0;
const SMOOTHSTEP_RANGE = 0.25;
const MOUSE_REPEL_RADIUS = 150;
const MOUSE_REPEL_FORCE = 0.2;
const COLOR_LERP_SPEED = 0.02;
const DRIFT_AMPLITUDE = 0.2;
const RADIUS_LERP_SPEED = 0.06;
const STAGGER_INTERVAL = 60;
const CYCLE_MIN_MS = 2000; // min time between natural spawn/despawn
const CYCLE_MAX_MS = 5000; // max time

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export class LavaLampEngine implements AnimationEngine {
  id = "lava-lamp";
  name = "Lava Lamp";

  private blobs: Blob[] = [];
  private palette: [number, number, number][] = [];
  private bgRgb: [number, number, number] = [0, 0, 0];
  private width = 0;
  private height = 0;
  private mouseX = -1000;
  private mouseY = -1000;
  private offCanvas: HTMLCanvasElement | null = null;
  private offCtx: CanvasRenderingContext2D | null = null;
  private shadowCanvas: HTMLCanvasElement | null = null;
  private shadowCtx: CanvasRenderingContext2D | null = null;
  private elapsed = 0;
  private nextCycleTime = 0;

  // Pre-allocated typed arrays for the inner render loop (avoid per-frame GC)
  private blobX: Float64Array = new Float64Array(0);
  private blobY: Float64Array = new Float64Array(0);
  private blobR: Float64Array = new Float64Array(0);
  private blobCR: Float64Array = new Float64Array(0);
  private blobCG: Float64Array = new Float64Array(0);
  private blobCB: Float64Array = new Float64Array(0);
  private activeBlobCount = 0;

  init(
    width: number,
    height: number,
    palette: [number, number, number][],
    bgColor: string
  ): void {
    this.width = width;
    this.height = height;
    this.palette = palette;
    this.parseBgColor(bgColor);
    this.elapsed = 0;
    this.nextCycleTime = CYCLE_MIN_MS + Math.random() * (CYCLE_MAX_MS - CYCLE_MIN_MS);
    this.initBlobs();
    this.initOffscreenCanvas();
  }

  private parseBgColor(bgColor: string): void {
    const match = bgColor.match(/(\d+)/g);
    if (match && match.length >= 3) {
      this.bgRgb = [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
    }
  }

  private getMaxBlobs(): number {
    const area = this.width * this.height;
    const scale = area / 2_073_600; // normalize to 1080p
    return Math.max(BASE_MAX_BLOBS, Math.round(BASE_MAX_BLOBS * scale));
  }

  private getRadiusRange(): { min: number; max: number } {
    const area = this.width * this.height;
    const scale = Math.sqrt(area / 2_073_600);
    const min = Math.max(8, Math.round(25 * scale));
    const max = Math.max(15, Math.round(65 * scale));
    return { min, max };
  }

  private makeBlob(x: number, y: number, radiusOverride?: number): Blob {
    const { min, max } = this.getRadiusRange();
    const color = this.palette[
      Math.floor(Math.random() * this.palette.length)
    ] || [128, 128, 128];
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2 * MAX_SPEED,
      vy: (Math.random() - 0.5) * 2 * MAX_SPEED,
      baseRadius: radiusOverride ?? (min + Math.random() * (max - min)),
      radiusScale: 0,
      targetRadiusScale: 1,
      color: [...color],
      targetColor: [...color],
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.0005 + Math.random() * 0.001,
      staggerDelay: -1,
    };
  }

  private initBlobs(): void {
    this.blobs = [];
    const { max } = this.getRadiusRange();
    const minDist = max * 2.5; // minimum distance between blob centers

    for (let i = 0; i < BLOB_COUNT; i++) {
      let x: number, y: number;
      let attempts = 0;

      // Try to find a position that doesn't overlap existing blobs
      do {
        x = Math.random() * this.width;
        y = Math.random() * this.height;
        attempts++;
      } while (attempts < 50 && this.tooCloseToExisting(x, y, minDist));

      const blob = this.makeBlob(x, y);
      blob.targetRadiusScale = 0;
      blob.staggerDelay = i * STAGGER_INTERVAL + Math.random() * STAGGER_INTERVAL;
      this.blobs.push(blob);
    }
  }

  private tooCloseToExisting(x: number, y: number, minDist: number): boolean {
    for (const blob of this.blobs) {
      const dx = blob.x - x;
      const dy = blob.y - y;
      if (dx * dx + dy * dy < minDist * minDist) return true;
    }
    return false;
  }

  private initOffscreenCanvas(): void {
    const rw = Math.ceil(this.width / RESOLUTION_SCALE);
    const rh = Math.ceil(this.height / RESOLUTION_SCALE);

    this.offCanvas = document.createElement("canvas");
    this.offCanvas.width = rw;
    this.offCanvas.height = rh;
    this.offCtx = this.offCanvas.getContext("2d", { willReadFrequently: true });

    this.shadowCanvas = document.createElement("canvas");
    this.shadowCanvas.width = rw;
    this.shadowCanvas.height = rh;
    this.shadowCtx = this.shadowCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  cleanup(): void {
    this.blobs = [];
    this.offCanvas = null;
    this.offCtx = null;
    this.shadowCanvas = null;
    this.shadowCtx = null;
  }

  /** Snapshot active blob data into flat typed arrays for fast inner-loop access */
  private syncBlobArrays(): void {
    const blobs = this.blobs;
    const n = blobs.length;

    // Grow arrays if needed
    if (this.blobX.length < n) {
      const cap = n + 32;
      this.blobX = new Float64Array(cap);
      this.blobY = new Float64Array(cap);
      this.blobR = new Float64Array(cap);
      this.blobCR = new Float64Array(cap);
      this.blobCG = new Float64Array(cap);
      this.blobCB = new Float64Array(cap);
    }

    let count = 0;
    for (let i = 0; i < n; i++) {
      const b = blobs[i];
      const r = b.baseRadius * b.radiusScale;
      if (r < 1) continue; // skip invisible blobs entirely
      this.blobX[count] = b.x;
      this.blobY[count] = b.y;
      this.blobR[count] = r;
      this.blobCR[count] = b.color[0];
      this.blobCG[count] = b.color[1];
      this.blobCB[count] = b.color[2];
      count++;
    }
    this.activeBlobCount = count;
  }

  update(deltaTime: number): void {
    const dt = deltaTime / (1000 / 60);
    this.elapsed += deltaTime;

    for (const blob of this.blobs) {
      // Staggered load-in
      if (blob.staggerDelay >= 0) {
        if (this.elapsed >= blob.staggerDelay) {
          blob.targetRadiusScale = 1;
          blob.staggerDelay = -1;
        }
      }

      blob.radiusScale +=
        (blob.targetRadiusScale - blob.radiusScale) * RADIUS_LERP_SPEED * dt;

      blob.phase += blob.phaseSpeed * deltaTime;
      const driftX = Math.sin(blob.phase) * DRIFT_AMPLITUDE;
      const driftY = Math.cos(blob.phase * 0.7) * DRIFT_AMPLITUDE;

      blob.vx += driftX * dt * 0.01;
      blob.vy += driftY * dt * 0.01;
      blob.vx += (Math.random() - 0.5) * 0.008 * dt;
      blob.vy += (Math.random() - 0.5) * 0.008 * dt;

      const speed = Math.sqrt(blob.vx * blob.vx + blob.vy * blob.vy);
      if (speed > MAX_SPEED) {
        blob.vx = (blob.vx / speed) * MAX_SPEED;
        blob.vy = (blob.vy / speed) * MAX_SPEED;
      }
      if (speed < MIN_SPEED) {
        const angle = Math.atan2(blob.vy, blob.vx);
        blob.vx = Math.cos(angle) * MIN_SPEED;
        blob.vy = Math.sin(angle) * MIN_SPEED;
      }

      blob.x += blob.vx * dt;
      blob.y += blob.vy * dt;

      const pad = blob.baseRadius * 0.3;
      if (blob.x < -pad) { blob.x = -pad; blob.vx = Math.abs(blob.vx) * 0.8; }
      if (blob.x > this.width + pad) { blob.x = this.width + pad; blob.vx = -Math.abs(blob.vx) * 0.8; }
      if (blob.y < -pad) { blob.y = -pad; blob.vy = Math.abs(blob.vy) * 0.8; }
      if (blob.y > this.height + pad) { blob.y = this.height + pad; blob.vy = -Math.abs(blob.vy) * 0.8; }

      // Mouse repulsion
      const dx = blob.x - this.mouseX;
      const dy = blob.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_REPEL_RADIUS) * MOUSE_REPEL_FORCE * dt;
        blob.vx += (dx / dist) * force;
        blob.vy += (dy / dist) * force;
      }

      for (let c = 0; c < 3; c++) {
        blob.color[c] += (blob.targetColor[c] - blob.color[c]) * COLOR_LERP_SPEED * dt;
      }
    }

    // Remove blobs that have fully shrunk away (but not ones still waiting to stagger in)
    for (let i = this.blobs.length - 1; i >= 0; i--) {
      const b = this.blobs[i];
      if (b.targetRadiusScale === 0 && b.radiusScale < 0.01 && b.staggerDelay < 0) {
        this.blobs.splice(i, 1);
      }
    }

    // Natural spawn/despawn cycle — keeps the scene alive
    if (this.elapsed >= this.nextCycleTime) {
      // Pick a random visible blob to fade out (skip ones still staggering in)
      const visible = [];
      for (let i = 0; i < this.blobs.length; i++) {
        if (this.blobs[i].radiusScale > 0.5 && this.blobs[i].staggerDelay < 0) {
          visible.push(i);
        }
      }
      if (visible.length > 0) {
        const killIdx = visible[Math.floor(Math.random() * visible.length)];
        this.blobs[killIdx].targetRadiusScale = 0;
      }

      // Spawn a fresh one at a random position
      const blob = this.makeBlob(
        Math.random() * this.width,
        Math.random() * this.height
      );
      this.blobs.push(blob);

      // Schedule next cycle
      this.nextCycleTime = this.elapsed + CYCLE_MIN_MS + Math.random() * (CYCLE_MAX_MS - CYCLE_MIN_MS);
    }

    // Prune excess blobs (keep the initial set, drop oldest user-spawned ones)
    const maxBlobs = this.getMaxBlobs();
    if (this.blobs.length > maxBlobs) {
      this.blobs.splice(BLOB_COUNT, this.blobs.length - maxBlobs);
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    if (!this.offCtx || !this.offCanvas || !this.shadowCtx || !this.shadowCanvas)
      return;

    // Snapshot blob positions/radii into typed arrays for fast pixel loop
    this.syncBlobArrays();

    const rw = this.offCanvas.width;
    const rh = this.offCanvas.height;

    // Render shadow layer
    const shadowData = this.shadowCtx.createImageData(rw, rh);
    this.renderField(shadowData, rw, rh, true);
    this.shadowCtx.putImageData(shadowData, 0, 0);

    // Render main layer
    const imageData = this.offCtx.createImageData(rw, rh);
    this.renderField(imageData, rw, rh, false);
    this.offCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    ctx.globalAlpha = 0.2;
    ctx.drawImage(this.shadowCanvas, 0, 4, width, height);

    ctx.globalAlpha = 1;
    ctx.drawImage(this.offCanvas, 0, 0, width, height);
  }

  private renderField(
    imageData: ImageData,
    rw: number,
    rh: number,
    isShadow: boolean
  ): void {
    const data = imageData.data;
    const threshold = isShadow ? FIELD_THRESHOLD * 0.75 : FIELD_THRESHOLD;
    const bgR = this.bgRgb[0];
    const bgG = this.bgRgb[1];
    const bgB = this.bgRgb[2];
    const scale = RESOLUTION_SCALE;
    const n = this.activeBlobCount;
    const bx = this.blobX;
    const by = this.blobY;
    const br = this.blobR;
    const bcr = this.blobCR;
    const bcg = this.blobCG;
    const bcb = this.blobCB;
    const threshLow = threshold - SMOOTHSTEP_RANGE;

    for (let py = 0; py < rh; py++) {
      const wy = py * scale;
      for (let px = 0; px < rw; px++) {
        const wx = px * scale;

        let fieldSum = 0;
        let weightedR = 0;
        let weightedG = 0;
        let weightedB = 0;

        for (let i = 0; i < n; i++) {
          const dx = wx - bx[i];
          const dy = wy - by[i];
          const distSq = dx * dx + dy * dy;
          const ri = br[i];
          const rSq = ri * ri;
          // Raw metaball field
          const raw = rSq / (distSq + rSq * 0.1);
          // Cap per-blob contribution so color stays flat inside the blob
          const contribution = raw > 2 ? 2 : raw;

          fieldSum += contribution;

          if (contribution > 0.01) {
            weightedR += bcr[i] * contribution;
            weightedG += bcg[i] * contribution;
            weightedB += bcb[i] * contribution;
          }
        }

        const idx = (py * rw + px) << 2;

        if (fieldSum > threshLow) {
          const alpha = smoothstep(threshLow, threshold, fieldSum);

          if (isShadow) {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = (alpha * 150) | 0;
          } else {
            const invField = 1 / fieldSum;
            const r = Math.min(255, (weightedR * invField) | 0);
            const g = Math.min(255, (weightedG * invField) | 0);
            const b = Math.min(255, (weightedB * invField) | 0);

            data[idx] = bgR + (r - bgR) * alpha;
            data[idx + 1] = bgG + (g - bgG) * alpha;
            data[idx + 2] = bgB + (b - bgB) * alpha;
            data[idx + 3] = 255;
          }
        } else {
          if (isShadow) {
            // data stays 0 (already zeroed by createImageData)
          } else {
            data[idx] = bgR;
            data[idx + 1] = bgG;
            data[idx + 2] = bgB;
            data[idx + 3] = 255;
          }
        }
      }
    }
  }

  handleResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.initOffscreenCanvas();

    const { min, max } = this.getRadiusRange();
    for (const blob of this.blobs) {
      blob.baseRadius = min + Math.random() * (max - min);
    }
  }

  private sampleColorAt(x: number, y: number): [number, number, number] | null {
    let closest: Blob | null = null;
    let closestDist = Infinity;

    for (const blob of this.blobs) {
      const dx = blob.x - x;
      const dy = blob.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < blob.baseRadius * 1.5 && dist < closestDist) {
        closestDist = dist;
        closest = blob;
      }
    }

    return closest ? ([...closest.color] as [number, number, number]) : null;
  }

  private spawnAt(x: number, y: number): void {
    const { max } = this.getRadiusRange();
    const blob = this.makeBlob(x, y, max * (0.8 + Math.random() * 0.4));
    const nearby = this.sampleColorAt(x, y);
    if (nearby) {
      blob.color = nearby;
      blob.targetColor = [...nearby];
    }
    this.blobs.push(blob);
  }

  handleMouseMove(x: number, y: number, _isDown: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseDown(x: number, y: number): void {
    this.spawnAt(x, y);
  }

  handleMouseUp(): void {}

  handleMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  updatePalette(palette: [number, number, number][], bgColor: string): void {
    this.palette = palette;
    this.parseBgColor(bgColor);

    for (let i = 0; i < this.blobs.length; i++) {
      this.blobs[i].targetColor = [
        ...palette[i % palette.length],
      ] as [number, number, number];
    }
  }
}
