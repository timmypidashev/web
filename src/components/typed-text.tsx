import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/reduced-motion";

export function useTypewriter(text: string, trigger: boolean, speed = 12) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    if (prefersReducedMotion()) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let i = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return { displayed, done };
}

export function useScrollVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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

  return { ref, visible };
}

interface TypedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  speed?: number;
  cursor?: boolean;
}

export function TypedText({
  text,
  as: Tag = "span",
  className = "",
  speed = 12,
  cursor = true,
}: TypedTextProps) {
  const { ref, visible } = useScrollVisible();
  const { displayed, done } = useTypewriter(text, visible, speed);

  return (
    <div ref={ref}>
      <Tag className={className} style={{ minHeight: "1.2em" }}>
        {visible ? displayed : "\u00A0"}
        {cursor && visible && !done && (
          <span className="animate-pulse text-foreground/40">|</span>
        )}
      </Tag>
    </div>
  );
}
