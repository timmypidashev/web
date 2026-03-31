import { useRef, useState, useEffect } from "react";
import { getStoredThemeId, getNextTheme, applyTheme } from "@/lib/themes/engine";

const FADE_DURATION = 300;

const LABELS: Record<string, string> = {
  darkbox: "classic",
  "darkbox-retro": "retro",
  "darkbox-dim": "dim",
};

export default function ThemeSwitcher() {
  const [hovering, setHovering] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");

  const maskRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const committedRef = useRef("");

  useEffect(() => {
    committedRef.current = getStoredThemeId();
    setCurrentLabel(LABELS[committedRef.current] ?? "");

    const handleSwap = () => {
      const id = getStoredThemeId();
      applyTheme(id);
      committedRef.current = id;
      setCurrentLabel(LABELS[id] ?? "");
    };

    document.addEventListener("astro:after-swap", handleSwap);
    return () => {
      document.removeEventListener("astro:after-swap", handleSwap);
    };
  }, []);

  const handleClick = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const mask = maskRef.current;
    if (!mask) return;

    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim();
    const [r, g, b] = v.split(" ").map(Number);

    mask.style.backgroundColor = `rgb(${r},${g},${b})`;
    mask.style.opacity = "1";
    mask.style.visibility = "visible";
    mask.style.transition = "none";

    const next = getNextTheme(committedRef.current);
    applyTheme(next.id);
    committedRef.current = next.id;
    setCurrentLabel(LABELS[next.id] ?? "");

    mask.offsetHeight;

    mask.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
    mask.style.opacity = "0";

    const onEnd = () => {
      mask.removeEventListener("transitionend", onEnd);
      mask.style.visibility = "hidden";
      mask.style.transition = "none";
      animatingRef.current = false;
    };

    mask.addEventListener("transitionend", onEnd);
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-4 z-[101] pointer-events-auto hidden md:block"
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

      <div
        ref={maskRef}
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ visibility: "hidden", opacity: 0 }}
      />
    </>
  );
}
