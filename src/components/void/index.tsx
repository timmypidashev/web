import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import VoidTypewriter from "./typewriter";
import VoidWater from "./scenes/void-water";

// Canvas glitch: transforms + filters (physical shake + color corruption)
// Text glitch: filters only (color corruption, no position shift)
const GLITCH_CSS = `
  .void-glitch-subtle {
    animation: void-glitch-subtle 2s ease-in-out infinite;
  }
  .void-glitch-intense {
    animation: void-glitch-intense 1.2s ease-in-out infinite;
  }
  .void-glitch-dissolve {
    animation: void-glitch-dissolve 2s ease-in forwards;
  }
  .void-text-glitch-subtle {
    animation: void-text-glitch-subtle 2s ease-in-out infinite;
  }
  .void-text-glitch-intense {
    animation: void-text-glitch-intense 1.2s ease-in-out infinite;
  }
  .void-text-glitch-dissolve {
    animation: void-text-glitch-dissolve 2s ease-in forwards;
  }

  @keyframes void-glitch-subtle {
    0%, 100% { transform: none; filter: none; }
    3% { transform: skewX(0.5deg); filter: hue-rotate(15deg); }
    6% { transform: none; filter: none; }
    15% { transform: translateX(1px) skewX(-0.2deg); }
    17% { transform: none; }
    30% { transform: skewX(-0.3deg) translateY(0.5px); filter: saturate(1.5); }
    32% { transform: none; filter: none; }
    50% { transform: translateY(-1px); }
    52% { transform: none; }
    70% { transform: skewX(0.2deg) translateX(-0.5px); filter: hue-rotate(-10deg); }
    72% { transform: none; filter: none; }
    85% { transform: translateX(-1px) skewY(0.1deg); }
    87% { transform: none; }
  }
  @keyframes void-text-glitch-subtle {
    0%, 100% { filter: none; }
    3% { filter: hue-rotate(15deg); }
    6% { filter: none; }
    30% { filter: saturate(1.5); }
    32% { filter: none; }
    70% { filter: hue-rotate(-10deg); }
    72% { filter: none; }
  }

  @keyframes void-glitch-intense {
    0%, 100% { transform: none; filter: none; }
    2% { transform: skewX(2deg) translateX(2px); filter: hue-rotate(60deg) saturate(3); }
    5% { transform: skewX(-1.5deg) translateY(-1px); filter: none; }
    8% { transform: none; }
    12% { transform: translateY(-3px) skewX(0.5deg); filter: hue-rotate(-90deg); }
    15% { transform: none; filter: none; }
    25% { transform: skewX(1.5deg) scale(1.005) translateX(-2px); filter: saturate(4); }
    28% { transform: none; filter: none; }
    40% { transform: skewX(-2deg) translateY(2px); filter: hue-rotate(120deg) saturate(2); }
    42% { transform: none; filter: none; }
    55% { transform: translateX(-3px) skewY(0.3deg); }
    58% { transform: none; }
    70% { transform: scale(1.01) skewX(1deg); filter: hue-rotate(-45deg) saturate(3); }
    73% { transform: none; filter: none; }
    85% { transform: skewX(-1deg) translateX(2px) translateY(-1px); filter: saturate(5); }
    88% { transform: none; filter: none; }
  }
  @keyframes void-text-glitch-intense {
    0%, 100% { filter: none; }
    2% { filter: hue-rotate(60deg) saturate(3); }
    5% { filter: none; }
    12% { filter: hue-rotate(-90deg); }
    15% { filter: none; }
    25% { filter: saturate(4); }
    28% { filter: none; }
    40% { filter: hue-rotate(120deg) saturate(2); }
    42% { filter: none; }
    70% { filter: hue-rotate(-45deg) saturate(3); }
    73% { filter: none; }
    85% { filter: saturate(5); }
    88% { filter: none; }
  }

  @keyframes void-glitch-dissolve {
    0% { transform: none; filter: none; opacity: 1; }
    3% { transform: skewX(3deg) translateX(4px); filter: hue-rotate(90deg) saturate(4); }
    6% { transform: skewX(-2deg) translateY(-3px); opacity: 0.95; }
    10% { filter: hue-rotate(-120deg) saturate(3); opacity: 0.9; }
    15% { transform: translateX(-5px) skewX(2deg); filter: none; opacity: 0.85; }
    20% { transform: skewX(-3deg) scale(1.02); filter: hue-rotate(180deg) saturate(5); opacity: 0.8; }
    25% { transform: translateY(4px) skewX(1deg); opacity: 0.75; }
    30% { filter: saturate(6) hue-rotate(60deg); opacity: 0.7; }
    40% { transform: skewX(2deg) translateX(-3px); filter: hue-rotate(-90deg); opacity: 0.55; }
    50% { transform: skewX(-4deg) translateY(2px); filter: saturate(3); opacity: 0.4; }
    60% { filter: hue-rotate(150deg); opacity: 0.3; }
    70% { transform: scale(1.03) skewX(2deg); opacity: 0.2; }
    80% { transform: translateX(-2px); opacity: 0.1; }
    100% { transform: none; filter: none; opacity: 0; }
  }
  @keyframes void-text-glitch-dissolve {
    0% { filter: none; opacity: 1; }
    3% { filter: hue-rotate(90deg) saturate(4); }
    10% { filter: hue-rotate(-120deg) saturate(3); opacity: 0.9; }
    20% { filter: hue-rotate(180deg) saturate(5); opacity: 0.8; }
    30% { filter: saturate(6) hue-rotate(60deg); opacity: 0.7; }
    40% { filter: hue-rotate(-90deg); opacity: 0.55; }
    50% { filter: saturate(3); opacity: 0.4; }
    60% { filter: hue-rotate(150deg); opacity: 0.3; }
    80% { filter: none; opacity: 0.1; }
    100% { filter: none; opacity: 0; }
  }
`;

function getCorruption(segment: number): number {
  if (segment < 8) return 0;
  if (segment === 8) return 0.05;
  if (segment === 9) return 0.08;
  if (segment === 10) return 0.1;
  if (segment === 11) return 0.13;
  if (segment === 12) return 0.1;
  if (segment === 13) return 0.3;
  if (segment === 14) return 0.6;
  if (segment === 15) return 0.75;
  if (segment === 16) return 0.9;
  return 1.0;
}

function getCanvasGlitch(segment: number, dissolving: boolean): string {
  if (dissolving) return "void-glitch-dissolve";
  if (segment < 8) return "";
  if (segment <= 14) return "void-glitch-subtle";
  return "void-glitch-intense";
}

function getTextGlitch(segment: number, dissolving: boolean): string {
  if (dissolving) return "void-text-glitch-dissolve";
  if (segment < 8) return "";
  if (segment <= 14) return "void-text-glitch-subtle";
  return "void-text-glitch-intense";
}

interface VoidExperienceProps {
  token: string;
}

export default function VoidExperience({ token }: VoidExperienceProps) {
  const [activeSegment, setActiveSegment] = useState(0);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [dissolving, setDissolving] = useState(false);

  // Inject CSS + hide cursor + force fullscreen feel on mobile
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLITCH_CSS;
    document.head.appendChild(style);
    document.body.style.cursor = "none";

    // Push mobile tab bar off-screen by making the page taller than viewport
    const meta = document.querySelector('meta[name="viewport"]');
    const origContent = meta?.getAttribute("content") || "";
    meta?.setAttribute("content", "width=device-width, initial-scale=1, interactive-widget=resizes-content");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // Scroll down slightly to trigger mobile browsers hiding the tab bar
    window.scrollTo(0, 1);

    return () => {
      style.remove();
      document.body.style.cursor = "";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (meta) meta.setAttribute("content", origContent);
    };
  }, []);

  // Fetch + increment visit count on mount (with token verification)
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("/api/void-visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => setVisitCount(data.count ?? 1))
      .catch(() => setVisitCount(1))
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const handlePhaseComplete = useCallback(() => {
    setDissolving(true);
    setTimeout(() => {
      window.location.href = "/about";
    }, 2000);
  }, []);

  const handleSegmentChange = useCallback((index: number) => {
    setActiveSegment(index);
  }, []);

  const corruption = getCorruption(activeSegment);

  return (
    <div className="fixed inset-0 bg-black" style={{ height: "100dvh" }}>
      {/* 3D Canvas — full glitch (transforms + filters) */}
      <div className={`fixed inset-0 z-[10] ${getCanvasGlitch(activeSegment, dissolving)}`}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <VoidWater segment={activeSegment} corruption={corruption} />
        </Canvas>
      </div>

      {/* Typewriter — filter-only glitch (no transform shift) */}
      {visitCount !== null && (
        <div className={getTextGlitch(activeSegment, dissolving)}>
          <VoidTypewriter
            startSegment={0}
            onPhaseComplete={handlePhaseComplete}
            onSegmentChange={handleSegmentChange}
            visitCount={visitCount}
            corruption={corruption}
          />
        </div>
      )}
    </div>
  );
}
