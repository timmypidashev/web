import { useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";
import type { TypewriterInstance } from "./types";
import { addVoidPhase } from "./phases";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface VoidTypewriterProps {
  startSegment: number;
  onPhaseComplete: () => void;
  onSegmentChange: (index: number) => void;
  visitCount: number;
  corruption: number;
  glitchClass: string;
}

function getTextNodes(node: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let current: Node | null;
  while ((current = walker.nextNode())) {
    if (current.textContent && current.textContent.trim().length > 0) {
      nodes.push(current as Text);
    }
  }
  return nodes;
}

export default function VoidTypewriter({ startSegment, onPhaseComplete, onSegmentChange, visitCount, corruption, glitchClass }: VoidTypewriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const corruptionRef = useRef(corruption);
  corruptionRef.current = corruption;

  const handleInit = (tw: TypewriterInstance): void => {
    addVoidPhase(tw, onPhaseComplete, startSegment, onSegmentChange, visitCount);
    tw.start();
  };

  // 404-style character replacement glitch — intensity scales with corruption
  useEffect(() => {
    const pendingResets: ReturnType<typeof setTimeout>[] = [];

    const interval = setInterval(() => {
      const c = corruptionRef.current;
      if (c <= 0 || !containerRef.current) return;

      const triggerChance = c * 0.4;
      if (Math.random() > triggerChance) return;

      const textNodes = getTextNodes(containerRef.current);
      if (textNodes.length === 0) return;

      const originals = textNodes.map(n => n.textContent || "");
      const charChance = c * 0.4;

      textNodes.forEach((node, i) => {
        const text = originals[i];
        const glitched = text.split("").map(char => {
          if (char === " ") return char;
          if (Math.random() < charChance) {
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
          return char;
        }).join("");
        node.textContent = glitched;
      });

      const resetMs = Math.max(40, 120 - c * 80);
      const id = setTimeout(() => {
        textNodes.forEach((node, i) => {
          if (node.parentNode) {
            node.textContent = originals[i];
          }
        });
      }, resetMs);
      pendingResets.push(id);
    }, 60);

    return () => {
      clearInterval(interval);
      pendingResets.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[50] flex justify-center items-center pointer-events-none">
      <div
        ref={containerRef}
        className={`text-xl md:text-3xl font-bold text-center max-w-[85vw] md:max-w-[70vw] break-words text-white leading-relaxed ${glitchClass}`}
      >
        <Typewriter
          key={`void-${startSegment}-${visitCount}`}
          options={{
            delay: 35,
            deleteSpeed: 15,
            cursor: "",
            autoStart: true,
            loop: false,
          }}
          onInit={handleInit}
        />
      </div>
    </div>
  );
}
