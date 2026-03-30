import React, { useEffect, useRef, useState } from "react";
import { Cross, Fish, Mountain, Book } from "lucide-react";

function AnimateIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";

    if (inView && isReload) {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={skip ? "" : "transition-all duration-700 ease-out"}
      style={skip ? {} : {
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      }}
    >
      {children}
    </div>
  );
}

const interests = [
  {
    icon: <Cross className="text-red-bright" size={20} />,
    title: "Faith",
    description: "My walk with Jesus is the foundation of everything I do, guiding my purpose and perspective",
  },
  {
    icon: <Fish className="text-blue-bright" size={20} />,
    title: "Fishing",
    description: "Finding peace and adventure on the water, always looking for the next great fishing spot",
  },
  {
    icon: <Mountain className="text-green-bright" size={20} />,
    title: "Hiking",
    description: "Exploring trails with friends and seeking out scenic viewpoints in nature",
  },
  {
    icon: <Book className="text-purple-bright" size={20} />,
    title: "Reading",
    description: "Deep diving into novels & technical books that expand my horizons & captivate my mind",
  },
];

export default function OutsideCoding() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-4xl px-4 py-8">
        <AnimateIn>
          <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-bright mb-8">
            Outside of Programming
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {interests.map((interest, i) => (
            <AnimateIn key={interest.title} delay={100 + i * 100}>
              <div
                className="flex flex-col items-center text-center p-4 rounded-lg border border-foreground/10
                           hover:border-yellow-bright/50 transition-all duration-300 bg-background/50 h-full"
              >
                <div className="mb-3">{interest.icon}</div>
                <h3 className="font-bold text-foreground/90 mb-2">{interest.title}</h3>
                <p className="text-sm text-foreground/70">{interest.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={500}>
          <p className="text-center text-foreground/80 mt-8 max-w-2xl mx-auto text-sm md:text-base italic">
            When I'm not writing code, you'll find me
            <span className="text-red-bright"> walking with Christ,</span>
            <span className="text-blue-bright"> out on the water,</span>
            <span className="text-green-bright"> hiking trails,</span>
            <span className="text-purple-bright"> or reading books.</span>
          </p>
        </AnimateIn>
      </div>
    </div>
  );
}
