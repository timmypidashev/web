import { useState, useEffect, useRef } from "react";
import {
  getStoredAnimationId,
  getNextAnimation,
  saveAnimation,
} from "@/lib/animations/engine";
import { ANIMATION_LABELS } from "@/lib/animations";

export default function AnimationSwitcher() {
  const [hovering, setHovering] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const committedRef = useRef("");

  useEffect(() => {
    committedRef.current = getStoredAnimationId();
    setCurrentLabel(ANIMATION_LABELS[committedRef.current]);

    const handleSwap = () => {
      const id = getStoredAnimationId();
      committedRef.current = id;
      setCurrentLabel(ANIMATION_LABELS[id]);
    };

    document.addEventListener("astro:after-swap", handleSwap);
    return () => {
      document.removeEventListener("astro:after-swap", handleSwap);
    };
  }, []);

  const handleClick = () => {
    const nextId = getNextAnimation(
      committedRef.current as Parameters<typeof getNextAnimation>[0]
    );
    saveAnimation(nextId);
    committedRef.current = nextId;
    setCurrentLabel(ANIMATION_LABELS[nextId]);
    document.dispatchEvent(
      new CustomEvent("animation-changed", { detail: { id: nextId } })
    );
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[101] pointer-events-auto hidden lg:block"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <span
        className="text-foreground font-bold text-sm select-none transition-opacity duration-200"
        style={{ opacity: hovering ? 0.8 : 0.15 }}
      >
        {currentLabel}
      </span>
    </div>
  );
}
