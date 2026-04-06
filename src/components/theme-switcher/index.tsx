import { useRef, useState, useEffect } from "react";
import { THEMES, FAMILIES } from "@/lib/themes";
import { getStoredThemeId, getNextFamily, getNextVariant, applyTheme } from "@/lib/themes/engine";

const FADE_DURATION = 300;

export default function ThemeSwitcher() {
  const [hovering, setHovering] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [variantLabel, setVariantLabel] = useState("");

  const maskRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const committedRef = useRef("");

  function syncLabels(id: string) {
    const theme = THEMES[id];
    if (!theme) return;
    const family = FAMILIES.find((f) => f.id === theme.family);
    setFamilyName(family?.name.toLowerCase() ?? theme.family);
    setVariantLabel(theme.label);
  }

  useEffect(() => {
    committedRef.current = getStoredThemeId();
    syncLabels(committedRef.current);

    const handleSwap = () => {
      const id = getStoredThemeId();
      applyTheme(id);
      committedRef.current = id;
      syncLabels(id);
    };

    document.addEventListener("astro:after-swap", handleSwap);
    return () => {
      document.removeEventListener("astro:after-swap", handleSwap);
    };
  }, []);

  function animateTransition(nextId: string) {
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

    applyTheme(nextId);
    committedRef.current = nextId;
    syncLabels(nextId);

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
  }

  const handleFamilyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = getNextFamily(committedRef.current);
    animateTransition(next.id);
  };

  const handleVariantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = getNextVariant(committedRef.current);
    animateTransition(next.id);
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-4 z-[101] pointer-events-auto hidden lg:block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <span
          className="text-foreground font-bold text-sm select-none transition-opacity duration-200 inline-flex items-center gap-0"
          style={{ opacity: hovering ? 0.8 : 0.15 }}
        >
          <button
            onClick={handleFamilyClick}
            className="hover:text-yellow-bright transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 font-bold text-sm text-inherit"
          >
            {familyName}
          </button>
          <span className="mx-1 opacity-40">·</span>
          <button
            onClick={handleVariantClick}
            className="hover:text-blue-bright transition-colors duration-150 cursor-pointer bg-transparent border-none p-0 font-bold text-sm text-inherit"
          >
            {variantLabel}
          </button>
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
