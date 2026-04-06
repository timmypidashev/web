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
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLElement>(null);
  const { ref, visible } = useScrollVisible();
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible || started) return;
    setStarted(true);

    if (prefersReducedMotion()) {
      setDone(true);
      return;
    }

    const el = tagRef.current;
    if (!el) return;

    // Wrap each character in an invisible span — layout stays correct
    el.textContent = "";
    const chars: HTMLSpanElement[] = [];
    for (const char of text) {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      chars.push(span);
      el.appendChild(span);
    }

    const textLength = text.length;
    const charSpeed = Math.max(8, Math.min(speed, 600 / textLength));

    let i = 0;
    const step = () => {
      if (i >= chars.length) {
        el.textContent = text;
        setDone(true);
        return;
      }
      chars[i].style.opacity = "1";
      i++;
      setTimeout(step, charSpeed);
    };
    step();
  }, [visible, started, text, speed]);

  return (
    <div ref={ref}>
      <Tag
        ref={tagRef as any}
        className={className}
        style={{ minHeight: "1.2em" }}
      >
        {!started ? "\u00A0" : done ? text : null}
      </Tag>
      {cursor && started && !done && (
        <span className="animate-pulse text-foreground/40">|</span>
      )}
    </div>
  );
}
