import React, { useEffect, useRef, useState } from "react";
import { Check, Code, GitBranch, Star, Rocket } from "lucide-react";

const timelineItems = [
  {
    year: "2026",
    title: "Present",
    description: "Building domain-specific languages, diving deep into the Salesforce ecosystem, and writing production Java and Python daily. The craft keeps evolving.",
    technologies: ["Java", "Python", "Salesforce", "DSLs"],
    icon: <Rocket className="text-red-bright" size={20} />,
  },
  {
    year: "2024",
    title: "Shipping & Scaling",
    description: "The wisdom of past ventures now flows through my work, whether crafting elegant CRUD applications or embarking on bold projects that expand my limits.",
    technologies: ["Rust", "Typescript", "Go", "Postgres"],
    icon: <Code className="text-yellow-bright" size={20} />,
  },
  {
    year: "2022",
    title: "Diving Deeper",
    description: "The worlds of systems programming and scalable infrastructure collided as I explored low-level C++ graphics programming and containerization with Docker.",
    technologies: ["C++", "Cmake", "Docker", "Docker Compose"],
    icon: <GitBranch className="text-green-bright" size={20} />,
  },
  {
    year: "2020",
    title: "Exploring the Stack",
    description: "Starting with pure HTML and CSS, I explored the foundations of web development, gradually venturing into JavaScript and React to bring my static pages to life.",
    technologies: ["Javascript", "Tailwind", "React", "Express"],
    icon: <Star className="text-blue-bright" size={20} />,
  },
  {
    year: "2018",
    title: "Starting the Journey",
    description: "An elective Python class in 8th grade transformed my keen interest in programming into a relentless obsession, one that drove me to constantly explore new depths.",
    technologies: ["Python", "Discord.py", "Asyncio", "Sqlite"],
    icon: <Check className="text-purple-bright" size={20} />,
  },
];

function TimelineCard({ item, index }: { item: (typeof timelineItems)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";
    const isSpaNav = !!(window as any).__astroNavigation;

    if (inView && (isReload || isSpaNav)) {
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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative mb-8 md:mb-12 last:mb-0">
      <div className={`flex flex-col sm:flex-row items-start ${isLeft ? "sm:flex-row-reverse" : ""}`}>
        {/* Node */}
        <div
          className={`
            absolute -left-8 sm:left-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-background
            rounded-full border-2 border-yellow-bright sm:-translate-x-1/2
            flex items-center justify-center z-10
            ${skip ? "" : "transition-[opacity,transform] duration-500"}
            ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
        >
          {item.icon}
        </div>

        {/* Card */}
        <div
          className={`
            w-full sm:w-[calc(50%-32px)]
            ${isLeft ? "sm:pr-8 md:pr-12" : "sm:pl-8 md:pl-12"}
            ${skip ? "" : "transition-[opacity,transform] duration-700 ease-out"}
            ${visible
              ? "opacity-100 translate-x-0"
              : `opacity-0 ${isLeft ? "sm:translate-x-8" : "sm:-translate-x-8"} translate-y-4 sm:translate-y-0`
            }
          `}
        >
          <div
            className="p-4 sm:p-6 bg-background/50 rounded-lg border border-foreground/10
                        hover:border-yellow-bright/50 transition-colors duration-300"
          >
            <span className="text-xs sm:text-sm font-mono text-yellow-bright">{item.year}</span>
            <h3 className="text-lg sm:text-xl font-bold text-foreground/90 mt-2">{item.title}</h3>
            <p className="text-sm sm:text-base text-foreground/70 mt-2">{item.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {item.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs sm:text-sm rounded-full bg-foreground/5
                             text-foreground/60 hover:text-yellow-bright transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate line to full height over time
          const el = lineRef.current;
          if (el) {
            setLineHeight(100);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-6xl px-4 py-8 relative z-0">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-bright mb-8 md:mb-12">
        My Journey Through Code
      </h2>
      <div ref={containerRef} className="relative">
        {/* Animated vertical line */}
        <div className="absolute left-4 sm:left-1/2 h-full w-0.5 -translate-x-1/2">
          <div
            ref={lineRef}
            className="w-full h-full bg-foreground/10 transition-transform duration-[1500ms] ease-out origin-top"
            style={{ transform: `scaleY(${lineHeight / 100})` }}
          />
        </div>

        <div className="ml-8 sm:ml-0">
          {timelineItems.map((item, index) => (
            <TimelineCard key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
