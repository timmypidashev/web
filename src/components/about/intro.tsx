import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Intro() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";
    const isSpaNav = !!(window as any).__astroNavigation;
    if (inView && (isReload || isSpaNav)) {
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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector("section")?.nextElementSibling;
    if (nextSection) {
      const offset = (nextSection as HTMLElement).offsetTop - (window.innerHeight - (nextSection as HTMLElement).offsetHeight) / 2;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const anim = (delay: number) =>
    ({
      opacity: visible ? 1 : 0,
      transform: visible ? "translate3d(0,0,0)" : "translate3d(0,20px,0)",
      transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      willChange: "transform, opacity",
    }) as React.CSSProperties;

  return (
    <div ref={ref} className="w-full max-w-4xl px-4">
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div
            className="w-44 h-44 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shrink-0"
            style={anim(0)}
          >
            <img
              src="/me.jpeg"
              alt="Timothy Pidashev"
              className="rounded-lg object-cover w-full h-full ring-2 ring-yellow-bright hover:ring-orange-bright transition-colors duration-300"
            />
          </div>
          <div className="text-center sm:text-left space-y-4 sm:space-y-6" style={anim(150)}>
            <h2 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-yellow-bright">
              Timothy Pidashev
            </h2>
            <div className="text-base sm:text-lg lg:text-xl text-foreground/70 space-y-2 sm:space-y-3">
              <p className="flex items-center justify-center sm:justify-start font-bold gap-2" style={anim(300)}>
                <span className="text-blue">Software Systems Engineer</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start font-bold gap-2" style={anim(450)}>
                <span className="text-green">Open Source Enthusiast</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start font-bold gap-2" style={anim(600)}>
                <span className="text-yellow">Coffee Connoisseur</span>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-8" style={anim(750)}>
          <p className="text-foreground/80 text-center text-base sm:text-2xl italic max-w-3xl mx-auto font-medium">
            "Turning coffee into code" isn't just a clever phrase –
            <span className="text-aqua-bright"> it's how I approach each project:</span>
            <span className="text-purple-bright"> methodically,</span>
            <span className="text-blue-bright"> with attention to detail,</span>
            <span className="text-green-bright"> and a refined process.</span>
          </p>
          <div className="flex justify-center" style={anim(900)}>
            <button
              onClick={scrollToNext}
              className="text-foreground/50 hover:text-yellow-bright transition-colors duration-300"
              aria-label="Scroll to next section"
            >
              <ChevronDown size={40} className="animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
