import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/reduced-motion";

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
}

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

export function AnimateIn({ children, delay = 0, threshold = 0.15 }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setSkip(true);
      setVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = (performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming)?.type === "reload";
    const isSpaNav = !!(window as any).__astroNavigation;

    // On mobile: skip animation for anything already in view (prevents flicker on navigation)
    // On desktop: only skip on reload or SPA nav
    if (inView && (isMobile() || isReload || isSpaNav)) {
      setSkip(true);
      setVisible(true);
      return;
    }
    if (inView) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={skip ? "" : "transition-[opacity,transform] duration-700 ease-out"}
      style={skip ? {} : {
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
      }}
    >
      {children}
    </div>
  );
}
