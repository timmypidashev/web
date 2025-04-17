import { useEffect, useRef } from "react";

interface Cell {
  alive: boolean;
  next: boolean;
  color: [number, number, number];
  baseColor: [number, number, number]; // Original color
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  targetOpacity: number;
  scale: number;
  targetScale: number;
  elevation: number; // For 3D effect
  targetElevation: number;
  transitioning: boolean;
  transitionComplete: boolean;
  rippleEffect: number; // For ripple animation
}

interface Grid {
  cells: Cell[][];
  cols: number;
  rows: number;
  offsetX: number;
  offsetY: number;
}

interface MousePosition {
  x: number;
  y: number;
  isDown: boolean;
  lastClickTime: number;
  cellX: number;
  cellY: number;
}

interface BackgroundProps {
  layout?: 'index' | 'sidebar';
  position?: 'left' | 'right';
}

const CELL_SIZE = 25;
const TRANSITION_SPEED = 0.05;
const SCALE_SPEED = 0.05;
const CYCLE_FRAMES = 180;
const INITIAL_DENSITY = 0.15;
const SIDEBAR_WIDTH = 240;
const MOUSE_INFLUENCE_RADIUS = 150; // Radius of mouse influence in pixels
const COLOR_SHIFT_AMOUNT = 30; // Maximum color shift amount
const RIPPLE_SPEED = 0.2; // Speed of ripple propagation
const ELEVATION_FACTOR = 15; // Max height for 3D effect

const Background: React.FC<BackgroundProps> = ({ 
  layout = 'index',
  position = 'left' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>();
  const animationFrameRef = useRef<number>();
  const frameCount = useRef(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const mouseRef = useRef<MousePosition>({
    x: -1000,
    y: -1000,
    isDown: false,
    lastClickTime: 0,
    cellX: -1,
    cellY: -1
  });

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
      Array(rows).fill(0).map((_, j) => {
        const baseColor = randomColor();
        return {
          alive: Math.random() < INITIAL_DENSITY,
          next: false,
          color: [...baseColor] as [number, number, number],
          baseColor: baseColor,
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
          rippleEffect: 0
        };
      })
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
          neighbors.colors.push(grid.cells[col][row].baseColor);
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
    // First, calculate the next state for all cells based on standard rules
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        const { count, colors } = countNeighbors(grid, i, j);

        // Standard Conway's Game of Life rules
        if (cell.alive) {
          cell.next = count === 2 || count === 3;
        } else {
          cell.next = count === 3;
          if (cell.next) {
            cell.baseColor = averageColors(colors);
            cell.color = [...cell.baseColor];
          }
        }
      }
    }
    
    // Then, set up animations for cells that need to change state
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        
        if (cell.alive !== cell.next && !cell.transitioning) {
          cell.transitioning = true;
          cell.transitionComplete = false;
          
          // Random delay for staggered animation effect
          const delay = Math.random() * 800;
          
          setTimeout(() => {
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
        }
      }
    }
  };

  const createRippleEffect = (grid: Grid, centerX: number, centerY: number) => {
    const maxDistance = Math.max(grid.cols, grid.rows) / 2;
    
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        
        // Calculate distance from cell to ripple center
        const dx = i - centerX;
        const dy = j - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only apply ripple to visible cells
        if (cell.opacity > 0.1) {
          // Delayed animation based on distance from center
          setTimeout(() => {
            cell.rippleEffect = 1; // Start ripple
            
            // After a short time, reset ripple
            setTimeout(() => {
              cell.rippleEffect = 0;
            }, 300 + distance * 50);
          }, distance * 100);
        }
      }
    }
  };

  const spawnCellAtPosition = (grid: Grid, x: number, y: number) => {
    if (x >= 0 && x < grid.cols && y >= 0 && y < grid.rows) {
      const cell = grid.cells[x][y];
      
      if (!cell.alive && !cell.transitioning) {
        cell.alive = true;
        cell.next = true;
        cell.transitioning = true;
        cell.transitionComplete = false;
        cell.baseColor = randomColor();
        cell.color = [...cell.baseColor];
        cell.targetScale = 1;
        cell.targetOpacity = 1;
        cell.targetElevation = 0;
        
        // Create a small ripple from the new cell
        createRippleEffect(grid, x, y);
      }
    }
  };

  const updateCellAnimations = (grid: Grid) => {
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        const cell = grid.cells[i][j];
        
        // Smooth transitions
        cell.opacity += (cell.targetOpacity - cell.opacity) * TRANSITION_SPEED;
        cell.scale += (cell.targetScale - cell.scale) * SCALE_SPEED;
        cell.elevation += (cell.targetElevation - cell.elevation) * SCALE_SPEED;
        
        // Apply mouse interaction
        const cellCenterX = grid.offsetX + i * CELL_SIZE + CELL_SIZE / 2;
        const cellCenterY = grid.offsetY + j * CELL_SIZE + CELL_SIZE / 2;
        const dx = cellCenterX - mouseX;
        const dy = cellCenterY - mouseY;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Color wave effect based on mouse position
        if (distanceToMouse < MOUSE_INFLUENCE_RADIUS && cell.opacity > 0.1) {
          // Calculate color adjustment based on distance
          const influenceFactor = 1 - (distanceToMouse / MOUSE_INFLUENCE_RADIUS);
          
          // Wave effect with sine function
          const waveOffset = (frameCount.current * 0.05 + distanceToMouse * 0.05) % (Math.PI * 2);
          const waveFactor = (Math.sin(waveOffset) * 0.5 + 0.5) * influenceFactor;
          
          // Adjust color based on wave
          cell.color = [
            Math.min(255, Math.max(0, cell.baseColor[0] + COLOR_SHIFT_AMOUNT * waveFactor)),
            Math.min(255, Math.max(0, cell.baseColor[1] - COLOR_SHIFT_AMOUNT * waveFactor)),
            Math.min(255, Math.max(0, cell.baseColor[2] + COLOR_SHIFT_AMOUNT * waveFactor))
          ] as [number, number, number];
          
          // 3D elevation effect when mouse is close
          cell.targetElevation = ELEVATION_FACTOR * influenceFactor;
        } else {
          // Gradually return to base color when mouse is away
          cell.color[0] += (cell.baseColor[0] - cell.color[0]) * 0.1;
          cell.color[1] += (cell.baseColor[1] - cell.color[1]) * 0.1;
          cell.color[2] += (cell.baseColor[2] - cell.color[2]) * 0.1;
          
          // Reset elevation when mouse moves away
          cell.targetElevation = 0;
        }
        
        // Handle cell state transitions
        if (cell.transitioning) {
          // When a cell is completely faded out, update its alive state
          if (!cell.next && cell.opacity < 0.01 && cell.scale < 0.01) {
            cell.alive = false;
            cell.transitioning = false;
            cell.transitionComplete = true;
            cell.opacity = 0;
            cell.scale = 0;
            cell.elevation = 0;
          }
          // When a new cell is born
          else if (cell.next && !cell.alive && !cell.transitionComplete) {
            cell.alive = true;
            cell.transitioning = false;
            cell.transitionComplete = true;
          }
        }
        
        // Gradually decrease ripple effect
        if (cell.rippleEffect > 0) {
          cell.rippleEffect = Math.max(0, cell.rippleEffect - RIPPLE_SPEED);
        }
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!gridRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    mouseRef.current.isDown = true;
    mouseRef.current.lastClickTime = Date.now();
    
    const grid = gridRef.current;
    
    // Calculate which cell was clicked
    const cellX = Math.floor((mouseX - grid.offsetX) / CELL_SIZE);
    const cellY = Math.floor((mouseY - grid.offsetY) / CELL_SIZE);
    
    if (cellX >= 0 && cellX < grid.cols && cellY >= 0 && cellY < grid.rows) {
      mouseRef.current.cellX = cellX;
      mouseRef.current.cellY = cellY;
      
      const cell = grid.cells[cellX][cellY];
      
      if (cell.alive) {
        // Create ripple effect from existing cell
        createRippleEffect(grid, cellX, cellY);
      } else {
        // Spawn new cell at empty position
        spawnCellAtPosition(grid, cellX, cellY);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleMouseLeave = () => {
    mouseRef.current.isDown = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
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

    // Add mouse event listeners
    canvas.addEventListener('mousedown', handleMouseDown, { signal });
    canvas.addEventListener('mousemove', handleMouseMove, { signal });
    canvas.addEventListener('mouseup', handleMouseUp, { signal });
    canvas.addEventListener('mouseleave', handleMouseLeave, { signal });

    const animate = () => {
      if (signal.aborted) return;
      
      frameCount.current++;
      
      if (gridRef.current) {
        // Every CYCLE_FRAMES, compute the next state
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
            // Draw all transitioning cells, even if they're fading out
            if ((cell.alive || cell.targetOpacity > 0) && cell.opacity > 0.01) {
              const [r, g, b] = cell.color;
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              
              // Apply ripple and elevation effects to opacity
              const rippleBoost = cell.rippleEffect * 0.4; // Boost opacity during ripple
              ctx.globalAlpha = Math.min(1, cell.opacity * 0.8 + rippleBoost);

              const scaledSize = cellSize * cell.scale;
              const xOffset = (cellSize - scaledSize) / 2;
              const yOffset = (cellSize - scaledSize) / 2;
              
              // Apply 3D elevation effect
              const elevationOffset = cell.elevation;
              
              const x = grid.offsetX + i * CELL_SIZE + (CELL_SIZE - cellSize) / 2 + xOffset;
              const y = grid.offsetY + j * CELL_SIZE + (CELL_SIZE - cellSize) / 2 + yOffset - elevationOffset;
              const scaledRoundness = roundness * cell.scale;

              // Draw shadow for 3D effect if cell has elevation
              if (elevationOffset > 1) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.moveTo(x + scaledRoundness, y + elevationOffset + 5);
                ctx.lineTo(x + scaledSize - scaledRoundness, y + elevationOffset + 5);
                ctx.quadraticCurveTo(x + scaledSize, y + elevationOffset + 5, x + scaledSize, y + elevationOffset + 5 + scaledRoundness);
                ctx.lineTo(x + scaledSize, y + elevationOffset + 5 + scaledSize - scaledRoundness);
                ctx.quadraticCurveTo(x + scaledSize, y + elevationOffset + 5 + scaledSize, x + scaledSize - scaledRoundness, y + elevationOffset + 5 + scaledSize);
                ctx.lineTo(x + scaledRoundness, y + elevationOffset + 5 + scaledSize);
                ctx.quadraticCurveTo(x, y + elevationOffset + 5 + scaledSize, x, y + elevationOffset + 5 + scaledSize - scaledRoundness);
                ctx.lineTo(x, y + elevationOffset + 5 + scaledRoundness);
                ctx.quadraticCurveTo(x, y + elevationOffset + 5, x + scaledRoundness, y + elevationOffset + 5);
                ctx.fill();
                
                // Draw side of elevated cell
                const sideHeight = elevationOffset;
                ctx.fillStyle = `rgba(${r*0.7}, ${g*0.7}, ${b*0.7}, ${ctx.globalAlpha})`;
                
                // Left side
                ctx.beginPath();
                ctx.moveTo(x, y + scaledRoundness);
                ctx.lineTo(x, y + scaledSize - scaledRoundness + sideHeight);
                ctx.lineTo(x + scaledRoundness, y + scaledSize + sideHeight);
                ctx.lineTo(x + scaledRoundness, y + scaledSize);
                ctx.lineTo(x, y + scaledSize - scaledRoundness);
                ctx.fill();
                
                // Right side
                ctx.beginPath();
                ctx.moveTo(x + scaledSize, y + scaledRoundness);
                ctx.lineTo(x + scaledSize, y + scaledSize - scaledRoundness + sideHeight);
                ctx.lineTo(x + scaledSize - scaledRoundness, y + scaledSize + sideHeight);
                ctx.lineTo(x + scaledSize - scaledRoundness, y + scaledSize);
                ctx.lineTo(x + scaledSize, y + scaledSize - scaledRoundness);
                ctx.fill();
                
                // Bottom side
                ctx.fillStyle = `rgba(${r*0.5}, ${g*0.5}, ${b*0.5}, ${ctx.globalAlpha})`;
                ctx.beginPath();
                ctx.moveTo(x + scaledRoundness, y + scaledSize);
                ctx.lineTo(x + scaledSize - scaledRoundness, y + scaledSize);
                ctx.lineTo(x + scaledSize - scaledRoundness, y + scaledSize + sideHeight);
                ctx.lineTo(x + scaledRoundness, y + scaledSize + sideHeight);
                ctx.fill();
              }
              
              // Draw main cell with original color
              ctx.fillStyle = `rgb(${r},${g},${b})`;
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
              
              // Draw highlight on top for 3D effect
              if (elevationOffset > 1) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * elevationOffset / ELEVATION_FACTOR})`;
                ctx.beginPath();
                ctx.moveTo(x + scaledRoundness, y);
                ctx.lineTo(x + scaledSize - scaledRoundness, y);
                ctx.quadraticCurveTo(x + scaledSize, y, x + scaledSize, y + scaledRoundness);
                ctx.lineTo(x + scaledSize, y + scaledSize/3);
                ctx.lineTo(x, y + scaledSize/3);
                ctx.lineTo(x, y + scaledRoundness);
                ctx.quadraticCurveTo(x, y, x + scaledRoundness, y);
                ctx.fill();
              }
              
              // Draw ripple effect
              if (cell.rippleEffect > 0) {
                const rippleRadius = cell.rippleEffect * cellSize * 2;
                const rippleAlpha = (1 - cell.rippleEffect) * 0.5;
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAlpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(
                  x + scaledSize / 2, 
                  y + scaledSize / 2, 
                  rippleRadius, 
                  0, 
                  Math.PI * 2
                );
                ctx.stroke();
              }
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
  }, [layout]); // Added layout as a dependency since it's used in the effect

  const getContainerClasses = () => {
    if (layout === 'index') {
      return 'fixed inset-0 -z-10';
    }
    
    const baseClasses = 'fixed top-0 bottom-0 hidden lg:block -z-10';
    return position === 'left' 
      ? `${baseClasses} left-0` 
      : `${baseClasses} right-0`;
  };

  return (
    <div className={getContainerClasses()}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-black cursor-pointer"
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />
    </div>
  );
};

export default Background;
