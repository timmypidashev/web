import type { AnimationEngine } from "@/lib/animations/types";

// --- Directions ---

type Dir = 0 | 1 | 2 | 3; // up, right, down, left
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

// Box-drawing characters
const HORIZONTAL = "\u2501"; // ━
const VERTICAL = "\u2503"; // ┃
// Corner pieces: [oldDir]-[newDir]
// oldDir determines entry side (opposite), newDir determines exit side
// ┏ = RIGHT+BOTTOM, ┓ = LEFT+BOTTOM, ┗ = RIGHT+TOP, ┛ = LEFT+TOP
const CORNER: Record<string, string> = {
  "0-1": "\u250F", // ┏  enter BOTTOM, exit RIGHT
  "0-3": "\u2513", // ┓  enter BOTTOM, exit LEFT
  "1-0": "\u251B", // ┛  enter LEFT, exit TOP
  "1-2": "\u2513", // ┓  enter LEFT, exit BOTTOM
  "2-1": "\u2517", // ┗  enter TOP, exit RIGHT
  "2-3": "\u251B", // ┛  enter TOP, exit LEFT
  "3-0": "\u2517", // ┗  enter RIGHT, exit TOP
  "3-2": "\u250F", // ┏  enter RIGHT, exit BOTTOM
};

function getStraightChar(dir: Dir): string {
  return dir === 0 || dir === 2 ? VERTICAL : HORIZONTAL;
}

function getCornerChar(fromDir: Dir, toDir: Dir): string {
  return CORNER[`${fromDir}-${toDir}`] || HORIZONTAL;
}

// --- Grid Cell ---

interface PipeCell {
  char: string;
  pipeId: number;
  placedAt: number;
  color: [number, number, number];
  baseColor: [number, number, number];
  opacity: number;
  elevation: number;
  targetElevation: number;
  fadeOut: boolean;
}

// --- Active Pipe ---

interface ActivePipe {
  id: number;
  x: number;
  y: number;
  dir: Dir;
  color: [number, number, number];
  spawnDelay: number;
}

// --- Constants ---

const CELL_SIZE_DESKTOP = 20;
const CELL_SIZE_MOBILE = 14;
const MAX_ACTIVE_PIPES = 4;
const GROW_INTERVAL = 80;
const TURN_CHANCE = 0.3;
const TARGET_FPS = 60;
const PIPE_LIFETIME = 12_000; // ms before a pipe's segments start fading
const FADE_IN_SPEED = 0.06;
const FADE_OUT_SPEED = 0.02;

const MOUSE_INFLUENCE_RADIUS = 150;
const ELEVATION_FACTOR = 6;
const ELEVATION_LERP_SPEED = 0.05;
const COLOR_SHIFT_AMOUNT = 30;
const SHADOW_OFFSET_RATIO = 1.1;

const BURST_PIPE_COUNT = 4;

// --- Helpers ---

function range(a: number, b: number): number {
  return (b - a) * Math.random() + a;
}

// --- Engine ---

export class PipesEngine implements AnimationEngine {
  id = "pipes";
  name = "Pipes";

  private grid: (PipeCell | null)[][] = [];
  private cols = 0;
  private rows = 0;
  private activePipes: ActivePipe[] = [];
  private palette: [number, number, number][] = [];
  private width = 0;
  private height = 0;
  private cellSize = CELL_SIZE_DESKTOP;
  private fontSize = CELL_SIZE_DESKTOP;
  private font = `bold ${CELL_SIZE_DESKTOP}px monospace`;
  private mouseX = -1000;
  private mouseY = -1000;
  private elapsed = 0;
  private growTimer = 0;
  private exiting = false;
  private nextPipeId = 0;
  private offsetX = 0;
  private offsetY = 0;

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
    this.growTimer = 0;
    this.exiting = false;
    this.computeGrid();
    this.spawnInitialPipes();
  }

  private computeGrid(): void {
    this.cellSize = this.width <= 768 ? CELL_SIZE_MOBILE : CELL_SIZE_DESKTOP;
    this.fontSize = this.cellSize;
    this.font = `bold ${this.fontSize}px monospace`;
    this.cols = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);
    this.offsetX = Math.floor((this.width - this.cols * this.cellSize) / 2);
    this.offsetY = Math.floor((this.height - this.rows * this.cellSize) / 2);
    this.grid = Array.from({ length: this.cols }, () =>
      Array.from({ length: this.rows }, () => null)
    );
  }

  private randomColor(): [number, number, number] {
    // Prefer bright variants (second half of palette) if available
    const brightStart = Math.floor(this.palette.length / 2);
    if (brightStart > 0 && this.palette.length > brightStart) {
      return this.palette[brightStart + Math.floor(Math.random() * (this.palette.length - brightStart))];
    }
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  private spawnInitialPipes(): void {
    this.activePipes = [];
    for (let i = 0; i < MAX_ACTIVE_PIPES; i++) {
      this.activePipes.push(this.makeEdgePipe(i * 400));
    }
  }

  private makeEdgePipe(delay: number): ActivePipe {
    const color = this.randomColor();
    // Pick a random edge and inward-facing direction
    const edge = Math.floor(Math.random() * 4) as Dir;
    let x: number, y: number, dir: Dir;

    switch (edge) {
      case 0: // top edge, face down
        x = Math.floor(Math.random() * this.cols);
        y = 0;
        dir = 2;
        break;
      case 1: // right edge, face left
        x = this.cols - 1;
        y = Math.floor(Math.random() * this.rows);
        dir = 3;
        break;
      case 2: // bottom edge, face up
        x = Math.floor(Math.random() * this.cols);
        y = this.rows - 1;
        dir = 0;
        break;
      default: // left edge, face right
        x = 0;
        y = Math.floor(Math.random() * this.rows);
        dir = 1;
        break;
    }

    return { id: this.nextPipeId++, x, y, dir, color: [...color], spawnDelay: delay };
  }

  private placeSegment(x: number, y: number, char: string, color: [number, number, number], pipeId: number): void {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    this.grid[x][y] = {
      char,
      pipeId,
      placedAt: this.elapsed,
      color: [...color],
      baseColor: [...color],
      opacity: 0,
      elevation: 0,
      targetElevation: 0,
      fadeOut: false,
    };
  }

  private isOccupied(x: number, y: number): boolean {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return true;
    return this.grid[x][y] !== null;
  }

  private pickTurn(currentDir: Dir): Dir {
    // Turn left or right relative to current direction
    const leftDir = ((currentDir + 3) % 4) as Dir;
    const rightDir = ((currentDir + 1) % 4) as Dir;
    return Math.random() < 0.5 ? leftDir : rightDir;
  }

  private growPipe(pipe: ActivePipe): boolean {
    // Decide direction
    let newDir = pipe.dir;
    let turned = false;
    if (Math.random() < TURN_CHANCE) {
      newDir = this.pickTurn(pipe.dir);
      turned = true;
    }

    const nx = pipe.x + DX[newDir];
    const ny = pipe.y + DY[newDir];

    // Check if destination is valid
    if (this.isOccupied(nx, ny)) {
      // If we tried to turn, try going straight instead
      if (turned) {
        const sx = pipe.x + DX[pipe.dir];
        const sy = pipe.y + DY[pipe.dir];
        if (!this.isOccupied(sx, sy)) {
          // Continue straight — place straight piece at destination
          this.placeSegment(sx, sy, getStraightChar(pipe.dir), pipe.color, pipe.id);
          pipe.x = sx;
          pipe.y = sy;
          return true;
        }
      }
      return false; // dead end
    }

    if (turned) {
      // Replace current head cell with corner piece (turn happens HERE)
      const cell = this.grid[pipe.x]?.[pipe.y];
      if (cell) {
        cell.char = getCornerChar(pipe.dir, newDir);
      }
    }

    // Place straight piece at destination
    this.placeSegment(nx, ny, getStraightChar(newDir), pipe.color, pipe.id);
    pipe.dir = newDir;
    pipe.x = nx;
    pipe.y = ny;
    return true;
  }

  // --- Interface Methods ---

  beginExit(): void {
    if (this.exiting) return;
    this.exiting = true;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if (cell) {
          setTimeout(() => {
            cell.fadeOut = true;
          }, Math.random() * 3000);
        }
      }
    }
  }

  isExitComplete(): boolean {
    if (!this.exiting) return false;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if (cell && cell.opacity > 0.01) return false;
      }
    }
    return true;
  }

  cleanup(): void {
    this.grid = [];
    this.activePipes = [];
  }

  update(deltaTime: number): void {
    const dt = deltaTime / (1000 / TARGET_FPS);
    this.elapsed += deltaTime;

    // Grow pipes
    if (!this.exiting) {
      this.growTimer += deltaTime;
      while (this.growTimer >= GROW_INTERVAL) {
        this.growTimer -= GROW_INTERVAL;

        for (let i = this.activePipes.length - 1; i >= 0; i--) {
          const pipe = this.activePipes[i];

          if (pipe.spawnDelay > 0) {
            pipe.spawnDelay -= GROW_INTERVAL;
            continue;
          }

          // Place starting segment if this is the first step
          if (!this.isOccupied(pipe.x, pipe.y)) {
            this.placeSegment(pipe.x, pipe.y, getStraightChar(pipe.dir), pipe.color, pipe.id);
            continue;
          }

          if (!this.growPipe(pipe)) {
            // Pipe is dead, replace it
            this.activePipes[i] = this.makeEdgePipe(0);
          }
        }
      }
    }

    // Update cells: fade in/out, mouse influence
    const mouseX = this.mouseX;
    const mouseY = this.mouseY;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if (!cell) continue;

        // Age-based fade: old segments start dissolving
        if (!cell.fadeOut && !this.exiting && this.elapsed - cell.placedAt > PIPE_LIFETIME) {
          cell.fadeOut = true;
        }

        // Fade in/out
        if (cell.fadeOut) {
          cell.opacity -= FADE_OUT_SPEED * dt;
          if (cell.opacity <= 0) {
            cell.opacity = 0;
            this.grid[i][j] = null; // free the cell for new pipes
            continue;
          }
        } else if (cell.opacity < 1) {
          cell.opacity = Math.min(1, cell.opacity + FADE_IN_SPEED * dt);
        }

        // Mouse influence
        const cx = this.offsetX + i * this.cellSize + this.cellSize / 2;
        const cy = this.offsetY + j * this.cellSize + this.cellSize / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_INFLUENCE_RADIUS && cell.opacity > 0.1) {
          const inf = Math.cos((dist / MOUSE_INFLUENCE_RADIUS) * (Math.PI / 2));
          cell.targetElevation = ELEVATION_FACTOR * inf * inf;

          const shift = inf * COLOR_SHIFT_AMOUNT * 0.5;
          cell.color = [
            Math.min(255, Math.max(0, cell.baseColor[0] + shift)),
            Math.min(255, Math.max(0, cell.baseColor[1] + shift)),
            Math.min(255, Math.max(0, cell.baseColor[2] + shift)),
          ];
        } else {
          cell.targetElevation = 0;
          cell.color[0] += (cell.baseColor[0] - cell.color[0]) * 0.1;
          cell.color[1] += (cell.baseColor[1] - cell.color[1]) * 0.1;
          cell.color[2] += (cell.baseColor[2] - cell.color[2]) * 0.1;
        }

        cell.elevation +=
          (cell.targetElevation - cell.elevation) * ELEVATION_LERP_SPEED * dt;
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    _width: number,
    _height: number
  ): void {
    ctx.font = this.font;
    ctx.textBaseline = "top";

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if (!cell || cell.opacity <= 0.01) continue;

        const x = this.offsetX + i * this.cellSize;
        const y = this.offsetY + j * this.cellSize - cell.elevation;
        const [r, g, b] = cell.color;

        // Shadow
        if (cell.elevation > 0.5) {
          const shadowAlpha = 0.2 * (cell.elevation / ELEVATION_FACTOR) * cell.opacity;
          ctx.globalAlpha = shadowAlpha;
          ctx.fillStyle = "rgb(0,0,0)";
          ctx.fillText(cell.char, x, y + cell.elevation * SHADOW_OFFSET_RATIO);
        }

        // Main
        ctx.globalAlpha = cell.opacity;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(cell.char, x, y);

        // Highlight
        if (cell.elevation > 0.5) {
          const highlightAlpha = 0.1 * (cell.elevation / ELEVATION_FACTOR) * cell.opacity;
          ctx.globalAlpha = highlightAlpha;
          ctx.fillStyle = "rgb(255,255,255)";
          ctx.fillText(cell.char, x, y);
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  handleResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.elapsed = 0;
    this.growTimer = 0;
    this.exiting = false;
    this.computeGrid();
    this.spawnInitialPipes();
  }

  handleMouseMove(x: number, y: number, _isDown: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  handleMouseDown(x: number, y: number): void {
    if (this.exiting) return;

    // Convert to grid coords
    const gx = Math.floor((x - this.offsetX) / this.cellSize);
    const gy = Math.floor((y - this.offsetY) / this.cellSize);

    // Spawn pipes in all 4 directions from click point
    for (let d = 0; d < BURST_PIPE_COUNT; d++) {
      const dir = d as Dir;
      const color = this.randomColor();
      this.activePipes.push({
        id: this.nextPipeId++,
        x: gx,
        y: gy,
        dir,
        color: [...color],
        spawnDelay: 0,
      });
    }
  }

  handleMouseUp(): void {}

  handleMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  updatePalette(palette: [number, number, number][], _bgColor: string): void {
    this.palette = palette;
    // Assign by pipeId so all segments of the same pipe get the same color
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cell = this.grid[i][j];
        if (cell) {
          cell.baseColor = palette[cell.pipeId % palette.length];
        }
      }
    }
  }
}
