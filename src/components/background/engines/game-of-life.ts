import type { AnimationEngine } from "@/lib/animations/types";

interface Cell {
  alive: boolean;
  next: boolean;
  color: [number, number, number];
  baseColor: [number, number, number];
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  targetOpacity: number;
  scale: number;
  targetScale: number;
  elevation: number;
  targetElevation: number;
  transitioning: boolean;
  transitionComplete: boolean;
  rippleEffect: number;
  rippleStartTime: number;
  rippleDistance: number;
}

interface Grid {
  cells: Cell[][];
  cols: number;
  rows: number;
  offsetX: number;
  offsetY: number;
}

const CELL_SIZE_MOBILE = 15;
const CELL_SIZE_DESKTOP = 25;
const TARGET_FPS = 60;
const CYCLE_TIME = 3000;
const TRANSITION_SPEED = 0.05;
const SCALE_SPEED = 0.05;
const INITIAL_DENSITY = 0.15;
const MOUSE_INFLUENCE_RADIUS = 150;
const COLOR_SHIFT_AMOUNT = 30;
const RIPPLE_ELEVATION_FACTOR = 4;
const ELEVATION_FACTOR = 8;

export class GameOfLifeEngine implements AnimationEngine {
  id = "game-of-life";
  name = "Game of Life";

  private grid: Grid | null = null;
  private palette: [number, number, number][] = [];
  private bgColor = "rgb(0, 0, 0)";
  private mouseX = -1000;
  private mouseY = -1000;
  private mouseIsDown = false;
  private mouseCellX = -1;
  private mouseCellY = -1;
  private lastCycleTime = 0;
  private timeAccumulator = 0;
  private pendingTimeouts: ReturnType<typeof setTimeout>[] = [];
  private canvasWidth = 0;
  private canvasHeight = 0;
  private exiting = false;

  init(
    width: number,
    height: number,
    palette: [number, number, number][],
    bgColor: string
  ): void {
    this.palette = palette;
    this.bgColor = bgColor;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.lastCycleTime = 0;
    this.timeAccumulator = 0;
    this.grid = this.initGrid(width, height);
  }

  cleanup(): void {
    for (const id of this.pendingTimeouts) {
      clearTimeout(id);
    }
    this.pendingTimeouts = [];
    this.grid = null;
  }

  private getCellSize(): number {
    return this.canvasWidth <= 768 ? CELL_SIZE_MOBILE : CELL_SIZE_DESKTOP;
  }

  private randomColor(): [number, number, number] {
    return this.palette[Math.floor(Math.random() * this.palette.length)];
  }

  private initGrid(width: number, height: number): Grid {
    const cellSize = this.getCellSize();
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    const offsetX = Math.floor((width - cols * cellSize) / 2);
    const offsetY = Math.floor((height - rows * cellSize) / 2);

    const cells = Array(cols)
      .fill(0)
      .map((_, i) =>
        Array(rows)
          .fill(0)
          .map((_, j) => {
            const baseColor = this.randomColor();
            return {
              alive: Math.random() < INITIAL_DENSITY,
              next: false,
              color: [...baseColor] as [number, number, number],
              baseColor,
              currentX: i,
              currentY: j,
              targetX: i,
              targetY: j,
              opacity: 0,
              targetOpacity: 0,
              scale: 0,
              targetScale: 0,
              elevation: 0,
              targetElevation: 0,
              transitioning: false,
              transitionComplete: false,
              rippleEffect: 0,
              rippleStartTime: 0,
              rippleDistance: 0,
            };
          })
      );

    const grid = { cells, cols, rows, offsetX, offsetY };
    this.computeNextState(grid);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = cells[i][j];
        if (cell.next) {
          cell.alive = true;
          const tid = setTimeout(() => {
            cell.targetOpacity = 1;
            cell.targetScale = 1;
          }, Math.random() * 1000);
          this.pendingTimeouts.push(tid);
        } else {
          cell.alive = false;
        }
      }
    }

    return grid;
  }

  private countNeighbors(
    grid: Grid,
    x: number,
    y: number
  ): { count: number; colors: [number, number, number][] } {
    const neighbors = { count: 0, colors: [] as [number, number, number][] };

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const col = (x + i + grid.cols) % grid.cols;
        const row = (y + j + grid.rows) % grid.rows;

        if (grid.cells[col][row].alive) {
          neighbors.count++;
          neighbors.colors.push(grid.cells[col][row].baseColor);
        }
      }
    }

    return neighbors;
  }

  private averageColors(
    colors: [number, number, number][]
  ): [number, number, number] {
    if (colors.length === 0) return [0, 0, 0];
    const sum = colors.reduce(
      (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
      [0, 0, 0]
    );
    return [
      Math.round(sum[0] / colors.length),
      Math.round(sum[1] / colors.length),
      Math.round(sum[2] / colors.length),
    ];
  }

  private computeNextState(grid: Grid): void {
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        const { count, colors } = this.countNeighbors(grid, i, j);

        if (cell.alive) {
          cell.next = count === 2 || count === 3;
        } else {
          cell.next = count === 3;
          if (cell.next) {
            cell.baseColor = this.averageColors(colors);
            cell.color = [...cell.baseColor];
          }
        }
      }
    }

    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];

        if (cell.alive !== cell.next && !cell.transitioning) {
          cell.transitioning = true;
          cell.transitionComplete = false;

          const delay = Math.random() * 800;
          const tid = setTimeout(() => {
            if (!cell.next) {
              cell.targetScale = 0;
              cell.targetOpacity = 0;
              cell.targetElevation = 0;
            } else {
              cell.targetScale = 1;
              cell.targetOpacity = 1;
              cell.targetElevation = 0;
            }
          }, delay);
          this.pendingTimeouts.push(tid);
        }
      }
    }
  }

  private createRippleEffect(
    grid: Grid,
    centerX: number,
    centerY: number
  ): void {
    const currentTime = Date.now();

    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];

        const dx = i - centerX;
        const dy = j - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (cell.opacity > 0.1) {
          cell.rippleStartTime = currentTime + distance * 100;
          cell.rippleDistance = distance;
          cell.rippleEffect = 0;
        }
      }
    }
  }

  private spawnCellAtPosition(grid: Grid, x: number, y: number): void {
    if (x >= 0 && x < grid.cols && y >= 0 && y < grid.rows) {
      const cell = grid.cells[x][y];

      if (!cell.alive && !cell.transitioning) {
        cell.alive = true;
        cell.next = true;
        cell.transitioning = true;
        cell.transitionComplete = false;
        cell.baseColor = this.randomColor();
        cell.color = [...cell.baseColor];
        cell.targetScale = 1;
        cell.targetOpacity = 1;
        cell.targetElevation = 0;

        this.createRippleEffect(grid, x, y);
      }
    }
  }

  beginExit(): void {
    if (this.exiting || !this.grid) return;
    this.exiting = true;

    // Cancel all pending GOL transitions so they don't revive cells
    for (const id of this.pendingTimeouts) {
      clearTimeout(id);
    }
    this.pendingTimeouts = [];

    const grid = this.grid;
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        // Force cell into dying state, clear any pending transition
        cell.next = false;
        cell.transitioning = false;
        cell.transitionComplete = false;

        if (cell.opacity > 0.01) {
          const delay = Math.random() * 3000;
          const tid = setTimeout(() => {
            cell.targetOpacity = 0;
            cell.targetScale = 0;
            cell.targetElevation = 0;
          }, delay);
          this.pendingTimeouts.push(tid);
        }
      }
    }
  }

  isExitComplete(): boolean {
    if (!this.exiting) return false;
    if (!this.grid) return true;

    const grid = this.grid;
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        if (grid.cells[i][j].opacity > 0.01) return false;
      }
    }
    return true;
  }

  update(deltaTime: number): void {
    if (!this.grid) return;

    if (!this.exiting) {
      this.timeAccumulator += deltaTime;
      if (this.timeAccumulator >= CYCLE_TIME) {
        this.computeNextState(this.grid);
        this.timeAccumulator -= CYCLE_TIME;
      }
    }

    this.updateCellAnimations(this.grid, deltaTime);
  }

  private updateCellAnimations(grid: Grid, deltaTime: number): void {
    const mouseX = this.mouseX;
    const mouseY = this.mouseY;
    const cellSize = this.getCellSize();

    const transitionFactor =
      TRANSITION_SPEED * (deltaTime / (1000 / TARGET_FPS));
    const scaleFactor = SCALE_SPEED * (deltaTime / (1000 / TARGET_FPS));

    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];

        cell.opacity += (cell.targetOpacity - cell.opacity) * transitionFactor;
        cell.scale += (cell.targetScale - cell.scale) * scaleFactor;
        cell.elevation +=
          (cell.targetElevation - cell.elevation) * scaleFactor;

        const cellCenterX = grid.offsetX + i * cellSize + cellSize / 2;
        const cellCenterY = grid.offsetY + j * cellSize + cellSize / 2;
        const dx = cellCenterX - mouseX;
        const dy = cellCenterY - mouseY;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < MOUSE_INFLUENCE_RADIUS && cell.opacity > 0.1) {
          const influenceFactor = Math.cos(
            (distanceToMouse / MOUSE_INFLUENCE_RADIUS) * (Math.PI / 2)
          );
          cell.targetElevation =
            ELEVATION_FACTOR * influenceFactor * influenceFactor;

          const colorShift = influenceFactor * COLOR_SHIFT_AMOUNT * 0.5;
          cell.color = [
            Math.min(255, Math.max(0, cell.baseColor[0] + colorShift)),
            Math.min(255, Math.max(0, cell.baseColor[1] + colorShift)),
            Math.min(255, Math.max(0, cell.baseColor[2] + colorShift)),
          ] as [number, number, number];
        } else {
          cell.color[0] += (cell.baseColor[0] - cell.color[0]) * 0.1;
          cell.color[1] += (cell.baseColor[1] - cell.color[1]) * 0.1;
          cell.color[2] += (cell.baseColor[2] - cell.color[2]) * 0.1;

          cell.targetElevation = 0;
        }

        // During exit: snap to zero once close enough
        if (this.exiting) {
          if (cell.opacity < 0.05) {
            cell.opacity = 0;
            cell.scale = 0;
            cell.elevation = 0;
            cell.alive = false;
          }
        } else if (cell.transitioning) {
          if (!cell.next && cell.opacity < 0.01 && cell.scale < 0.01) {
            cell.alive = false;
            cell.transitioning = false;
            cell.transitionComplete = true;
            cell.opacity = 0;
            cell.scale = 0;
            cell.elevation = 0;
          } else if (cell.next && !cell.alive && !cell.transitionComplete) {
            cell.alive = true;
            cell.transitioning = false;
            cell.transitionComplete = true;
          }
        }

        if (cell.rippleStartTime > 0) {
          const elapsedTime = Date.now() - cell.rippleStartTime;
          if (elapsedTime > 0) {
            const rippleProgress = elapsedTime / 1000;

            if (rippleProgress < 1) {
              const wavePhase = rippleProgress * Math.PI * 2;
              const waveHeight =
                Math.sin(wavePhase) * Math.exp(-rippleProgress * 4);

              if (distanceToMouse >= MOUSE_INFLUENCE_RADIUS) {
                cell.rippleEffect = waveHeight;
                cell.targetElevation = RIPPLE_ELEVATION_FACTOR * waveHeight;
              } else {
                cell.rippleEffect = waveHeight * 0.3;
              }
            } else {
              cell.rippleEffect = 0;
              cell.rippleStartTime = 0;
              if (distanceToMouse >= MOUSE_INFLUENCE_RADIUS) {
                cell.targetElevation = 0;
              }
            }
          }
        }
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    if (!this.grid) return;

    const grid = this.grid;
    const cellSize = this.getCellSize();
    const displayCellSize = cellSize * 0.8;
    const roundness = displayCellSize * 0.2;

    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        if (
          (cell.alive || cell.targetOpacity > 0) &&
          cell.opacity > 0.01
        ) {
          const [r, g, b] = cell.color;

          ctx.globalAlpha = cell.opacity * 0.9;

          const scaledSize = displayCellSize * cell.scale;
          const xOffset = (displayCellSize - scaledSize) / 2;
          const yOffset = (displayCellSize - scaledSize) / 2;

          const elevationOffset = cell.elevation;

          const x =
            grid.offsetX +
            i * cellSize +
            (cellSize - displayCellSize) / 2 +
            xOffset;
          const y =
            grid.offsetY +
            j * cellSize +
            (cellSize - displayCellSize) / 2 +
            yOffset -
            elevationOffset;
          const scaledRoundness = roundness * cell.scale;

          // Shadow for 3D effect
          if (elevationOffset > 0.5) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * (elevationOffset / ELEVATION_FACTOR)})`;
            ctx.beginPath();
            ctx.moveTo(x + scaledRoundness, y + elevationOffset * 1.1);
            ctx.lineTo(
              x + scaledSize - scaledRoundness,
              y + elevationOffset * 1.1
            );
            ctx.quadraticCurveTo(
              x + scaledSize,
              y + elevationOffset * 1.1,
              x + scaledSize,
              y + elevationOffset * 1.1 + scaledRoundness
            );
            ctx.lineTo(
              x + scaledSize,
              y + elevationOffset * 1.1 + scaledSize - scaledRoundness
            );
            ctx.quadraticCurveTo(
              x + scaledSize,
              y + elevationOffset * 1.1 + scaledSize,
              x + scaledSize - scaledRoundness,
              y + elevationOffset * 1.1 + scaledSize
            );
            ctx.lineTo(
              x + scaledRoundness,
              y + elevationOffset * 1.1 + scaledSize
            );
            ctx.quadraticCurveTo(
              x,
              y + elevationOffset * 1.1 + scaledSize,
              x,
              y + elevationOffset * 1.1 + scaledSize - scaledRoundness
            );
            ctx.lineTo(x, y + elevationOffset * 1.1 + scaledRoundness);
            ctx.quadraticCurveTo(
              x,
              y + elevationOffset * 1.1,
              x + scaledRoundness,
              y + elevationOffset * 1.1
            );
            ctx.fill();
          }

          // Main cell
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.moveTo(x + scaledRoundness, y);
          ctx.lineTo(x + scaledSize - scaledRoundness, y);
          ctx.quadraticCurveTo(x + scaledSize, y, x + scaledSize, y + scaledRoundness);
          ctx.lineTo(x + scaledSize, y + scaledSize - scaledRoundness);
          ctx.quadraticCurveTo(
            x + scaledSize,
            y + scaledSize,
            x + scaledSize - scaledRoundness,
            y + scaledSize
          );
          ctx.lineTo(x + scaledRoundness, y + scaledSize);
          ctx.quadraticCurveTo(x, y + scaledSize, x, y + scaledSize - scaledRoundness);
          ctx.lineTo(x, y + scaledRoundness);
          ctx.quadraticCurveTo(x, y, x + scaledRoundness, y);
          ctx.fill();

          // Highlight on elevated cells
          if (elevationOffset > 0.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * (elevationOffset / ELEVATION_FACTOR)})`;
            ctx.beginPath();
            ctx.moveTo(x + scaledRoundness, y);
            ctx.lineTo(x + scaledSize - scaledRoundness, y);
            ctx.quadraticCurveTo(
              x + scaledSize,
              y,
              x + scaledSize,
              y + scaledRoundness
            );
            ctx.lineTo(x + scaledSize, y + scaledSize / 3);
            ctx.lineTo(x, y + scaledSize / 3);
            ctx.lineTo(x, y + scaledRoundness);
            ctx.quadraticCurveTo(x, y, x + scaledRoundness, y);
            ctx.fill();
          }
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  handleResize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    const cellSize = this.getCellSize();
    if (
      !this.grid ||
      this.grid.cols !== Math.floor(width / cellSize) ||
      this.grid.rows !== Math.floor(height / cellSize)
    ) {
      for (const id of this.pendingTimeouts) {
        clearTimeout(id);
      }
      this.pendingTimeouts = [];
      this.grid = this.initGrid(width, height);
    }
  }

  handleMouseMove(x: number, y: number, isDown: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
    this.mouseIsDown = isDown;

    if (isDown && this.grid && !this.exiting) {
      const grid = this.grid;
      const cellSize = this.getCellSize();
      const cellX = Math.floor((x - grid.offsetX) / cellSize);
      const cellY = Math.floor((y - grid.offsetY) / cellSize);

      if (cellX !== this.mouseCellX || cellY !== this.mouseCellY) {
        this.mouseCellX = cellX;
        this.mouseCellY = cellY;

        if (
          cellX >= 0 &&
          cellX < grid.cols &&
          cellY >= 0 &&
          cellY < grid.rows
        ) {
          const cell = grid.cells[cellX][cellY];
          if (!cell.alive && !cell.transitioning) {
            this.spawnCellAtPosition(grid, cellX, cellY);
          }
        }
      }
    }
  }

  handleMouseDown(x: number, y: number): void {
    this.mouseIsDown = true;

    if (!this.grid || this.exiting) return;
    const grid = this.grid;
    const cellSize = this.getCellSize();

    const cellX = Math.floor((x - grid.offsetX) / cellSize);
    const cellY = Math.floor((y - grid.offsetY) / cellSize);

    if (
      cellX >= 0 &&
      cellX < grid.cols &&
      cellY >= 0 &&
      cellY < grid.rows
    ) {
      this.mouseCellX = cellX;
      this.mouseCellY = cellY;

      const cell = grid.cells[cellX][cellY];
      if (cell.alive) {
        this.createRippleEffect(grid, cellX, cellY);
      } else {
        this.spawnCellAtPosition(grid, cellX, cellY);
      }
    }
  }

  handleMouseUp(): void {
    this.mouseIsDown = false;
  }

  handleMouseLeave(): void {
    this.mouseIsDown = false;
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  updatePalette(palette: [number, number, number][], bgColor: string): void {
    this.palette = palette;
    this.bgColor = bgColor;

    if (this.grid) {
      const grid = this.grid;
      for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {
          const cell = grid.cells[i][j];
          if (cell.alive && cell.opacity > 0.01) {
            cell.baseColor = palette[(i * grid.rows + j) % palette.length];
          }
        }
      }
    }
  }
}
