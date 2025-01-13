import { useEffect, useRef } from "react";

interface Cell {
  alive: boolean;
  next: boolean;
  color: [number, number, number];
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  targetOpacity: number;
  scale: number;
  targetScale: number;
  transitioning: boolean;
  transitionComplete: boolean;
}

interface Grid {
  cells: Cell[][];
  cols: number;
  rows: number;
  offsetX: number;
  offsetY: number;
}

interface BackgroundProps {
  layout?: 'index' | 'sidebar';
  position?: 'left' | 'right';
}

const CELL_SIZE = 25;
const TRANSITION_SPEED = 0.1;
const SCALE_SPEED = 0.15;
const CYCLE_FRAMES = 120;
const INITIAL_DENSITY = 0.15;
const SIDEBAR_WIDTH = 240;

const Background: React.FC<BackgroundProps> = ({ 
  layout = 'index',
  position = 'left' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>();
  const animationFrameRef = useRef<number>();
  const frameCount = useRef(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  const randomColor = (): [number, number, number] => {
    const colors = [
      [204, 36, 29],   // red
      [152, 151, 26],  // green
      [215, 153, 33],  // yellow
      [69, 133, 136],  // blue
      [177, 98, 134],  // purple
      [104, 157, 106]  // aqua
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculateGridDimensions = (width: number, height: number) => {
    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);
    const offsetX = Math.floor((width - (cols * CELL_SIZE)) / 2);
    const offsetY = Math.floor((height - (rows * CELL_SIZE)) / 2);
    return { cols, rows, offsetX, offsetY };
  };

  const initGrid = (width: number, height: number): Grid => {
    const { cols, rows, offsetX, offsetY } = calculateGridDimensions(width, height);
    
    const cells = Array(cols).fill(0).map((_, i) => 
      Array(rows).fill(0).map((_, j) => ({
        alive: Math.random() < INITIAL_DENSITY,
        next: false,
        color: randomColor(),
        currentX: i,
        currentY: j,
        targetX: i,
        targetY: j,
        opacity: 0,
        targetOpacity: 0,
        scale: 0,
        targetScale: 0,
        transitioning: false,
        transitionComplete: false
      }))
    );

    const grid = { cells, cols, rows, offsetX, offsetY };
    computeNextState(grid);
    
    // Initialize cells with staggered animation
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = cells[i][j];
        if (cell.next) {
          cell.alive = true;
          setTimeout(() => {
            cell.targetOpacity = 1;
            cell.targetScale = 1;
          }, Math.random() * 1000);
        } else {
          cell.alive = false;
        }
      }
    }

    return grid;
  };

  const countNeighbors = (grid: Grid, x: number, y: number): { count: number, colors: [number, number, number][] } => {
    const neighbors = { count: 0, colors: [] as [number, number, number][] };
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const col = (x + i + grid.cols) % grid.cols;
        const row = (y + j + grid.rows) % grid.rows;
        
        if (grid.cells[col][row].alive) {
          neighbors.count++;
          neighbors.colors.push(grid.cells[col][row].color);
        }
      }
    }
    
    return neighbors;
  };

  const averageColors = (colors: [number, number, number][]): [number, number, number] => {
    if (colors.length === 0) return [0, 0, 0];
    const sum = colors.reduce((acc, color) => [
      acc[0] + color[0],
      acc[1] + color[1],
      acc[2] + color[2]
    ], [0, 0, 0]);
    return [
      Math.round(sum[0] / colors.length),
      Math.round(sum[1] / colors.length),
      Math.round(sum[2] / colors.length)
    ];
  };

  const computeNextState = (grid: Grid) => {
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        const { count, colors } = countNeighbors(grid, i, j);

        if (cell.alive) {
          cell.next = count === 2 || count === 3;
        } else {
          cell.next = count === 3;
          if (cell.next) {
            cell.color = averageColors(colors);
          }
        }
        
        if (cell.alive !== cell.next && !cell.transitioning) {
          cell.transitioning = true;
          cell.transitionComplete = false;
          if (!cell.next) {
            cell.targetScale = 0;
            cell.targetOpacity = 0;
          }
        }
      }
    }
  };

  const updateCellAnimations = (grid: Grid) => {
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        
        cell.opacity += (cell.targetOpacity - cell.opacity) * TRANSITION_SPEED;
        cell.scale += (cell.targetScale - cell.scale) * SCALE_SPEED;
        
        if (cell.transitioning) {
          if (!cell.next && cell.scale < 0.05) {
            cell.alive = false;
            cell.transitioning = false;
            cell.transitionComplete = true;
            cell.scale = 0;
            cell.opacity = 0;
          }
          else if (cell.next && !cell.alive && !cell.transitionComplete) {
            cell.alive = true;
            cell.transitioning = false;
            cell.transitionComplete = true;
            cell.targetScale = 1;
            cell.targetOpacity = 1;
          }
          else if (cell.next && !cell.alive && cell.transitionComplete) {
            cell.transitioning = true;
            cell.targetScale = 1;
            cell.targetOpacity = 1;
          }
        }
      }
    }
  };

  const setupCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    return ctx;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create an AbortController for cleanup
    const controller = new AbortController();
    const signal = controller.signal;

    const handleResize = () => {
      if (signal.aborted) return;
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (signal.aborted) return;
        
        const displayWidth = layout === 'index' ? window.innerWidth : SIDEBAR_WIDTH;
        const displayHeight = window.innerHeight;

        const ctx = setupCanvas(canvas, displayWidth, displayHeight);
        if (!ctx) return;

        frameCount.current = 0;
        
        // Only initialize new grid if one doesn't exist or dimensions changed
        if (!gridRef.current || 
            gridRef.current.cols !== Math.floor(displayWidth / CELL_SIZE) || 
            gridRef.current.rows !== Math.floor(displayHeight / CELL_SIZE)) {
          gridRef.current = initGrid(displayWidth, displayHeight);
        }
      }, 250);
    };

    const displayWidth = layout === 'index' ? window.innerWidth : SIDEBAR_WIDTH;
    const displayHeight = window.innerHeight;
    
    const ctx = setupCanvas(canvas, displayWidth, displayHeight);
    if (!ctx) return;

    // Only initialize grid if it doesn't exist
    if (!gridRef.current) {
      gridRef.current = initGrid(displayWidth, displayHeight);
    }

    const animate = () => {
      if (signal.aborted) return;
      
      frameCount.current++;
      
      if (gridRef.current) {
        if (frameCount.current % CYCLE_FRAMES === 0) {
          computeNextState(gridRef.current);
        }
        
        updateCellAnimations(gridRef.current);
      }
      
      // Draw frame
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gridRef.current) {
        const grid = gridRef.current;
        const cellSize = CELL_SIZE * 0.8;
        const roundness = cellSize * 0.2;

        for (let i = 0; i < grid.cols; i++) {
          for (let j = 0; j < grid.rows; j++) {
            const cell = grid.cells[i][j];
            if (cell.opacity > 0.01) {
              const [r, g, b] = cell.color;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              ctx.globalAlpha = cell.opacity * 0.8;

              const scaledSize = cellSize * cell.scale;
              const xOffset = (cellSize - scaledSize) / 2;
              const yOffset = (cellSize - scaledSize) / 2;
              
              const x = grid.offsetX + i * CELL_SIZE + (CELL_SIZE - cellSize) / 2 + xOffset;
              const y = grid.offsetY + j * CELL_SIZE + (CELL_SIZE - cellSize) / 2 + yOffset;
              const scaledRoundness = roundness * cell.scale;

              ctx.beginPath();
              ctx.moveTo(x + scaledRoundness, y);
              ctx.lineTo(x + scaledSize - scaledRoundness, y);
              ctx.quadraticCurveTo(x + scaledSize, y, x + scaledSize, y + scaledRoundness);
              ctx.lineTo(x + scaledSize, y + scaledSize - scaledRoundness);
              ctx.quadraticCurveTo(x + scaledSize, y + scaledSize, x + scaledSize - scaledRoundness, y + scaledSize);
              ctx.lineTo(x + scaledRoundness, y + scaledSize);
              ctx.quadraticCurveTo(x, y + scaledSize, x, y + scaledSize - scaledRoundness);
              ctx.lineTo(x, y + scaledRoundness);
              ctx.quadraticCurveTo(x, y, x + scaledRoundness, y);
              ctx.fill();
            }
          }
        }
        
        ctx.globalAlpha = 1;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize, { signal });
    animate();

    return () => {
      controller.abort();
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array since we're managing state internally

  const getContainerClasses = () => {
    if (layout === 'index') {
      return 'fixed inset-0 -z-10';
    }
    
    const baseClasses = 'fixed top-0 bottom-0 hidden lg:block -z-10 pointer-events-none';
    return position === 'left' 
      ? `${baseClasses} left-0` 
      : `${baseClasses} right-0`;
  };

  return (
    <div className={getContainerClasses()}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-black"
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    </div>
  );
};

export default Background;
