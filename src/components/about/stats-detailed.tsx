import { useState, useEffect, useRef } from "react";
import { Clock, CalendarClock, CodeXml, Computer } from "lucide-react";
import { ActivityGrid } from "@/components/about/stats-activity";

const DetailedStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [skipAnim, setSkipAnim] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/wakatime/detailed")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setStats(data.data))
      .catch(() => setError(true));

    fetch("/api/wakatime/activity")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setActivity(data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const isReload = performance.getEntriesByType?.("navigation")?.[0]?.type === "reload";
    const isSpaNav = !!(window as any).__astroNavigation;

    if (inView && (isReload || isSpaNav)) {
      setSkipAnim(true);
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
      { threshold: 0.1, rootMargin: "-15% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stats]);

  if (error) return null;

  const progressColors = [
    "bg-red-bright",
    "bg-orange-bright",
    "bg-yellow-bright",
    "bg-green-bright",
    "bg-blue-bright",
    "bg-purple-bright",
    "bg-aqua-bright",
  ];

  const statCards = stats
    ? [
        {
          title: "Total Time",
          value: `${Math.round((stats.total_seconds / 3600) * 10) / 10}`,
          unit: "hours",
          subtitle: "this week",
          color: "text-yellow-bright",
          borderHover: "hover:border-yellow-bright/50",
          icon: Clock,
          iconColor: "stroke-yellow-bright",
        },
        {
          title: "Daily Average",
          value: `${Math.round((stats.daily_average / 3600) * 10) / 10}`,
          unit: "hours",
          subtitle: "per day",
          color: "text-orange-bright",
          borderHover: "hover:border-orange-bright/50",
          icon: CalendarClock,
          iconColor: "stroke-orange-bright",
        },
        {
          title: "Primary Editor",
          value: stats.editors?.[0]?.name || "None",
          unit: `${Math.round(stats.editors?.[0]?.percent || 0)}%`,
          subtitle: "of the time",
          color: "text-blue-bright",
          borderHover: "hover:border-blue-bright/50",
          icon: CodeXml,
          iconColor: "stroke-blue-bright",
        },
        {
          title: "Operating System",
          value: stats.operating_systems?.[0]?.name || "None",
          unit: `${Math.round(stats.operating_systems?.[0]?.percent || 0)}%`,
          subtitle: "of the time",
          color: "text-green-bright",
          borderHover: "hover:border-green-bright/50",
          icon: Computer,
          iconColor: "stroke-green-bright",
        },
      ]
    : [];

  const languages =
    stats?.languages?.slice(0, 7).map((lang: any, index: number) => ({
      name: lang.name,
      percent: Math.round(lang.percent),
      time: Math.round((lang.total_seconds / 3600) * 10) / 10 + " hrs",
      color: progressColors[index % progressColors.length],
    })) || [];

  return (
    <div ref={containerRef} className="flex flex-col gap-10 md:py-32 w-full max-w-[1200px] mx-auto px-4 min-h-[50vh]">
      {!stats ? null : (
        <>
          {/* Header */}
          <h2
            className={`text-2xl md:text-4xl font-bold text-center text-yellow-bright ${skipAnim ? "" : "transition-[opacity,transform] duration-700 ease-out"}`}
            style={skipAnim ? {} : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Weekly Statistics
          </h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`bg-background/50 border border-foreground/10 rounded-lg p-6 ${card.borderHover} ${skipAnim ? "" : "transition-[opacity,transform] duration-500 ease-out"}`}
                  style={skipAnim ? {} : {
                    transitionDelay: `${150 + i * 100}ms`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(24px)",
                  }}
                >
                  <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-lg bg-foreground/5">
                      <Icon className={`w-6 h-6 ${card.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <div className={`${card.color} text-sm mb-1`}>{card.title}</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">{card.value}</div>
                        <div className="text-lg opacity-80">{card.unit}</div>
                      </div>
                      <div className="text-xs opacity-50 mt-0.5">{card.subtitle}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Languages */}
          <div
            className={`bg-background/50 border border-foreground/10 rounded-lg p-6 hover:border-purple-bright/50 ${skipAnim ? "" : "transition-[opacity,transform] duration-700 ease-out"}`}
            style={skipAnim ? {} : {
              transitionDelay: "550ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <div className="text-purple-bright mb-6 text-lg">Languages</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              {languages.map((lang: any, i: number) => (
                <div key={lang.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-sm opacity-70 tabular-nums">{lang.time}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex-grow h-2 bg-foreground/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${lang.color} rounded-full`}
                        style={{
                          width: `${lang.percent}%`,
                          opacity: 0.85,
                          transform: visible ? "scaleX(1)" : "scaleX(0)",
                          transformOrigin: "left",
                          transition: skipAnim ? "none" : `transform 1s ease-out ${700 + i * 80}ms`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-foreground/50 min-w-[36px] text-right tabular-nums">
                      {lang.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Grid */}
          {activity && (
            <div
              className={skipAnim ? "" : "transition-[opacity,transform] duration-700 ease-out"}
              style={skipAnim ? {} : {
                transitionDelay: "750ms",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <ActivityGrid data={activity} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailedStats;
