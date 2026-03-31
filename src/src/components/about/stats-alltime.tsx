import { useState, useEffect, useRef } from "react";

const Stats = () => {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [skipAnim, setSkipAnim] = useState(false);
  const hasAnimated = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
  useEffect(() => {
    fetch("/api/wakatime/alltime")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setStats(data.data))
      .catch(() => setError(true));
  }, []);

  // Observe visibility — skip animation if already in view on mount
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";

    if (inView && isReload) {
      setSkipAnim(true);
      setIsVisible(true);
      return;
    }
    if (inView) {
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Start counter when both visible and data is ready
  useEffect(() => {
    if (!isVisible || !stats || hasAnimated.current) return;
    hasAnimated.current = true;

    const totalSeconds = stats.total_seconds;
    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        setCount(totalSeconds);
        clearInterval(timer);
        return;
      }
      const progress = 1 - Math.pow(1 - currentStep / steps, 4);
      setCount(Math.floor(totalSeconds * progress));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, stats]);

  if (error) return null;
  if (!stats) return <div ref={sectionRef} className="min-h-[50vh]" />;

  const hours = Math.floor(count / 3600);
  const formattedHours = hours.toLocaleString("en-US", {
    minimumIntegerDigits: 4,
    useGrouping: true,
  });

  return (
    <div ref={sectionRef} className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className={skipAnim ? "text-2xl opacity-80" : `text-2xl opacity-0 ${isVisible ? "animate-fade-in-first" : ""}`}>
        I've spent
      </div>

      <div className="relative">
        <div className="text-8xl text-center relative z-10">
          <span className="font-bold relative">
            <span className={skipAnim ? "bg-gradient-text" : `bg-gradient-text opacity-0 ${isVisible ? "animate-fade-in-second" : ""}`}>
              {formattedHours}
            </span>
          </span>
          <span className={skipAnim ? "text-4xl opacity-60 ml-4" : `text-4xl opacity-0 ${isVisible ? "animate-slide-in-hours" : ""}`}>
            hours
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className={skipAnim ? "text-xl opacity-80" : `text-xl opacity-0 ${isVisible ? "animate-fade-in-third" : ""}`}>
          writing code & building apps
        </div>
        <div className={skipAnim ? "flex items-center gap-3 text-lg opacity-60" : `flex items-center gap-3 text-lg opacity-0 ${isVisible ? "animate-fade-in-fourth" : ""}`}>
          <span>since</span>
          <span className="text-green-bright font-bold">{stats.range.start_text}</span>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-text {
          background: linear-gradient(90deg,
            rgb(var(--color-yellow-bright)),
            rgb(var(--color-orange-bright)),
            rgb(var(--color-orange)),
            rgb(var(--color-yellow)),
            rgb(var(--color-orange-bright)),
            rgb(var(--color-yellow-bright))
          );
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes fadeInFirst {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
        @keyframes fadeInSecond {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInHours {
          from { opacity: 0; transform: translateX(20px); margin-left: 0; }
          to { opacity: 0.6; transform: translateX(0); margin-left: 1rem; }
        }
        @keyframes fadeInThird {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
        @keyframes fadeInFourth {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 0.6; transform: translateY(0); }
        }

        .animate-fade-in-first { animation: fadeInFirst 0.7s ease-out forwards; }
        .animate-fade-in-second { animation: fadeInSecond 0.7s ease-out 0.4s forwards; }
        .animate-slide-in-hours { animation: slideInHours 0.7s ease-out 0.6s forwards; }
        .animate-fade-in-third { animation: fadeInThird 0.7s ease-out 0.8s forwards; }
        .animate-fade-in-fourth { animation: fadeInFourth 0.7s ease-out 1s forwards; }
      `}</style>
    </div>
  );
};

export default Stats;
