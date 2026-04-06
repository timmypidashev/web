import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/reduced-motion";

const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

function typeInHeading(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const text = el.textContent || "";
    const textLength = text.length;
    if (textLength === 0) { resolve(); return; }

    // Preserve height
    const rect = el.getBoundingClientRect();
    el.style.minHeight = `${rect.height}px`;

    // Speed scales with length
    const speed = Math.max(8, Math.min(25, 600 / textLength));

    // Store original HTML, clear visible text but keep element structure
    const originalHTML = el.innerHTML;
    el.textContent = "";
    el.style.opacity = "1";
    el.style.transform = "translate3d(0,0,0)";

    let i = 0;
    const step = () => {
      if (i >= text.length) {
        el.innerHTML = originalHTML;
        el.style.minHeight = "";
        resolve();
        return;
      }
      i++;
      el.textContent = text.slice(0, i);
      setTimeout(step, speed);
    };
    step();
  });
}

export function StreamContent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || prefersReducedMotion()) {
      if (container) container.classList.remove("stream-hidden");
      return;
    }

    const prose = container.querySelector(".prose") || container;
    const blocks = Array.from(prose.querySelectorAll(":scope > *")) as HTMLElement[];

    if (blocks.length === 0) {
      container.classList.remove("stream-hidden");
      return;
    }

    // Set inline opacity:0 on every block BEFORE removing the CSS class
    // This prevents the flash of visible content between class removal and style application
    blocks.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translate3d(0,16px,0)";
    });

    // Now safe to remove the CSS class — inline styles keep everything hidden
    container.classList.remove("stream-hidden");

    // Add transition properties in the next frame so the initial state is set first
    requestAnimationFrame(() => {
      blocks.forEach((el) => {
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        el.style.willChange = "transform, opacity";
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);

            if (HEADING_TAGS.has(el.tagName)) {
              typeInHeading(el);
            } else {
              el.style.opacity = "1";
              el.style.transform = "translate3d(0,0,0)";
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    blocks.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="stream-hidden">
      {children}
    </div>
  );
}
