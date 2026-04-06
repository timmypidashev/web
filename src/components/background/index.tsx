import { useEffect, useRef } from "react";
import { GameOfLifeEngine } from "@/components/background/engines/game-of-life";
import { LavaLampEngine } from "@/components/background/engines/lava-lamp";
import { ConfettiEngine } from "@/components/background/engines/confetti";
import { AsciiquariumEngine } from "@/components/background/engines/asciiquarium";
import { PipesEngine } from "@/components/background/engines/pipes";
import { ShuffleEngine } from "@/components/background/engines/shuffle";
import { getStoredAnimationId } from "@/lib/animations/engine";
import type { AnimationEngine } from "@/lib/animations/types";
import type { AnimationId } from "@/lib/animations";

const SIDEBAR_WIDTH = 240;

const FALLBACK_PALETTE: [number, number, number][] = [
  [204, 36, 29], [152, 151, 26], [215, 153, 33],
  [69, 133, 136], [177, 98, 134], [104, 157, 106],
  [251, 73, 52], [184, 187, 38], [250, 189, 47],
  [131, 165, 152], [211, 134, 155], [142, 192, 124],
];

function createEngine(id: AnimationId): AnimationEngine {
  switch (id) {
    case "lava-lamp":
      return new LavaLampEngine();
    case "confetti":
      return new ConfettiEngine();
    case "asciiquarium":
      return new AsciiquariumEngine();
    case "pipes":
      return new PipesEngine();
    case "shuffle":
      return new ShuffleEngine();
    case "game-of-life":
    default:
      return new GameOfLifeEngine();
  }
}

function readPaletteFromCSS(): [number, number, number][] {
  try {
    const style = getComputedStyle(document.documentElement);
    const keys = [
      "--color-red", "--color-green", "--color-yellow",
      "--color-blue", "--color-purple", "--color-aqua",
      "--color-red-bright", "--color-green-bright", "--color-yellow-bright",
      "--color-blue-bright", "--color-purple-bright", "--color-aqua-bright",
    ];
    const palette: [number, number, number][] = [];
    for (const key of keys) {
      const val = style.getPropertyValue(key).trim();
      if (val) {
        const parts = val.split(" ").map(Number);
        if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
          palette.push([parts[0], parts[1], parts[2]]);
        }
      }
    }
    return palette.length > 0 ? palette : FALLBACK_PALETTE;
  } catch {
    return FALLBACK_PALETTE;
  }
}

function readBgFromCSS(): string {
  try {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim();
    if (val) {
      const [r, g, b] = val.split(" ");
      return `rgb(${r}, ${g}, ${b})`;
    }
  } catch {}
  return "rgb(0, 0, 0)";
}

interface BackgroundProps {
  layout?: "index" | "sidebar" | "content";
  position?: "left" | "right";
  mobileOnly?: boolean;
}

const Background: React.FC<BackgroundProps> = ({
  layout = "index",
  position = "left",
  mobileOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AnimationEngine | null>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const setupCanvas = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) => {
    const ctx = canvas.getContext("2d");
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

    const controller = new AbortController();
    const signal = controller.signal;

    const displayWidth =
      layout === "index" ? window.innerWidth : SIDEBAR_WIDTH;
    const displayHeight = window.innerHeight;
    dimensionsRef.current = { width: displayWidth, height: displayHeight };

    const ctx = setupCanvas(canvas, displayWidth, displayHeight);
    if (!ctx) return;

    const palette = readPaletteFromCSS();
    const bgColor = readBgFromCSS();

    // Initialize engine
    if (!engineRef.current) {
      const animId = getStoredAnimationId();
      engineRef.current = createEngine(animId);
      engineRef.current.init(displayWidth, displayHeight, palette, bgColor);
    }

    // Handle animation switching
    const handleAnimationChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.id) return;

      if (engineRef.current) {
        engineRef.current.cleanup();
      }

      const w = layout === "index" ? window.innerWidth : SIDEBAR_WIDTH;
      const h = window.innerHeight;
      engineRef.current = createEngine(detail.id);
      engineRef.current.init(w, h, readPaletteFromCSS(), readBgFromCSS());
    };

    document.addEventListener("animation-changed", handleAnimationChanged, {
      signal,
    });

    // Handle theme changes — only update if palette actually changed
    let currentPalette = palette;
    const handleThemeChanged = () => {
      const newPalette = readPaletteFromCSS();
      const newBg = readBgFromCSS();
      const same =
        newPalette.length === currentPalette.length &&
        newPalette.every(
          (c, i) =>
            c[0] === currentPalette[i][0] &&
            c[1] === currentPalette[i][1] &&
            c[2] === currentPalette[i][2]
        );
      if (!same && engineRef.current) {
        currentPalette = newPalette;
        engineRef.current.updatePalette(newPalette, newBg);
      }
    };

    document.addEventListener("theme-changed", handleThemeChanged, { signal });

    // Handle resize
    const handleResize = () => {
      if (signal.aborted) return;

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (signal.aborted) return;

        const w = layout === "index" ? window.innerWidth : SIDEBAR_WIDTH;
        const h = window.innerHeight;

        const newCtx = setupCanvas(canvas, w, h);
        if (!newCtx) return;

        lastUpdateTimeRef.current = 0;
        dimensionsRef.current = { width: w, height: h };

        if (engineRef.current) {
          engineRef.current.handleResize(w, h);
        }
      }, 250);
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      if (!engineRef.current || !canvas) return;

      // Don't spawn when clicking interactive elements
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, select, textarea, label, [onclick], [tabindex]")) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX < 0 ||
        mouseX > rect.width ||
        mouseY < 0 ||
        mouseY > rect.height
      )
        return;

      e.preventDefault();
      engineRef.current.handleMouseDown(mouseX, mouseY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!engineRef.current || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      engineRef.current.handleMouseMove(mouseX, mouseY, e.buttons === 1);
    };

    const handleMouseUp = () => {
      if (engineRef.current) {
        engineRef.current.handleMouseUp();
      }
    };

    const handleMouseLeave = () => {
      if (engineRef.current) {
        engineRef.current.handleMouseLeave();
      }
    };

    window.addEventListener("mousedown", handleMouseDown, { signal });
    window.addEventListener("mousemove", handleMouseMove, { signal });
    window.addEventListener("mouseup", handleMouseUp, { signal });

    // Visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
      } else {
        if (!animationFrameRef.current) {
          lastUpdateTimeRef.current = performance.now();
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    // Animation loop
    const animate = (currentTime: number) => {
      if (signal.aborted) return;

      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastUpdateTimeRef.current;
      const clampedDeltaTime = Math.min(deltaTime, 100);
      lastUpdateTimeRef.current = currentTime;

      const engine = engineRef.current;
      if (engine) {
        engine.update(clampedDeltaTime);

        // Clear canvas
        const bg = readBgFromCSS();
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const { width: rw, height: rh } = dimensionsRef.current;
        engine.render(ctx, rw, rh);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      signal,
    });
    window.addEventListener("resize", handleResize, { signal });
    animate(performance.now());

    return () => {
      controller.abort();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [layout]);

  const isIndex = layout === "index";
  const isSidebar = !isIndex;

  const getContainerStyle = (): React.CSSProperties => {
    if (isIndex) return {};
    // Fade the inner edge so blobs don't hard-cut at the content boundary
    return {
      maskImage:
        position === "left"
          ? "linear-gradient(to right, black 60%, transparent 100%)"
          : "linear-gradient(to left, black 60%, transparent 100%)",
      WebkitMaskImage:
        position === "left"
          ? "linear-gradient(to right, black 60%, transparent 100%)"
          : "linear-gradient(to left, black 60%, transparent 100%)",
    };
  };

  const getContainerClasses = () => {
    if (isIndex) {
      return mobileOnly
        ? "fixed inset-0 -z-10 lg:hidden"
        : "fixed inset-0 -z-10";
    }

    const baseClasses = "fixed top-0 bottom-0 hidden lg:block -z-10";
    return position === "left"
      ? `${baseClasses} left-0`
      : `${baseClasses} right-0`;
  };

  return (
    <div className={getContainerClasses()} style={getContainerStyle()}>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-background"
        style={{ cursor: "default" }}
      />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm pointer-events-none" />
      <div className="crt-scanlines absolute inset-0 pointer-events-none" />
      <div className="crt-bloom absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default Background;
