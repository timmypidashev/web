import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/reduced-motion";

const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

function typeInHeading(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const text = el.textContent || "";
    const textLength = text.length;
    if (textLength === 0) { resolve(); return; }

    const speed = Math.max(8, Math.min(25, 600 / textLength));
    const originalHTML = el.innerHTML;

    // Wrap each character in a span with opacity:0
    // The full text stays in the DOM so layout/wrapping is correct from the start
    el.innerHTML = "";
    const chars: HTMLSpanElement[] = [];
    for (const char of text) {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      chars.push(span);
      el.appendChild(span);
    }

    el.style.opacity = "1";
    el.style.transform = "translate3d(0,0,0)";

    let i = 0;
    const step = () => {
      if (i >= chars.length) {
        // Restore original HTML to clean up spans
        el.innerHTML = originalHTML;
        resolve();
        return;
      }
      chars[i].style.opacity = "1";
      i++;
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
