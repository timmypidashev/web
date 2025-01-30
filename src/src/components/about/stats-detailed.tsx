import { useState, useEffect } from "react";
import { Clock, CalendarClock, CodeXml, Computer } from "lucide-react";

import { ActivityGrid } from "@/components/about/stats-activity";

const DetailedStats = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch("/api/wakatime/detailed")
      .then(res => res.json())
      .then(data => {
        setStats(data.data);
        setIsVisible(true);
      })
      .catch(error => {
        console.error("Error fetching stats:", error);
      });

     fetch("/api/wakatime/activity")
      .then(res => res.json())
      .then(data => {
        setActivity(data.data);
      })
      .catch(error => {
        console.error("Error fetching activity:", error);
      });
  }, []);

  if (!stats) return null;

  const progressColors = [
    "bg-red-bright",
    "bg-orange-bright",
    "bg-yellow-bright",
    "bg-green-bright",
    "bg-blue-bright",
    "bg-purple-bright",
    "bg-aqua-bright"
  ];

  return (
    <div className="flex flex-col gap-10 md:py-32 w-full max-w-[1200px] mx-auto px-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-bright">
        Weekly Statistics
      </h2>

      {/* Top Stats Grid */}
      <div className={`
        grid grid-cols-1 md:grid-cols-2 gap-8
        transition-all duration-700 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        {/* Total Time */}
        <StatsCard
          title="Total Time"
          value={`${Math.round(stats.total_seconds / 3600 * 10) / 10}`}
          unit="hours"
          subtitle="this week"
          color="text-yellow-bright"
          icon={Clock}
          iconColor="stroke-yellow-bright"
        />

        {/* Daily Average */}
        <StatsCard
          title="Daily Average"
          value={`${Math.round(stats.daily_average / 3600 * 10) / 10}`}
          unit="hours"
          subtitle="per day"
          color="text-orange-bright"
          icon={CalendarClock}
          iconColor="stroke-orange-bright"
        />

        {/* Editors */}
        <StatsCard
          title="Primary Editor"
          value={stats.editors?.[0]?.name || "None"}
          unit={`${Math.round(stats.editors?.[0]?.percent || 0)}%`}
          subtitle="of the time"
          color="text-blue-bright"
          icon={CodeXml}
          iconColor="stroke-blue-bright"
        />

        {/* OS */}
        <StatsCard
          title="Operating System"
          value={stats.operating_systems?.[0]?.name || "None"}
          unit={`${Math.round(stats.operating_systems?.[0]?.percent || 0)}%`}
          subtitle="of the time"
          color="text-green-bright"
          icon={Computer}
          iconColor="stroke-green-bright"
        />
      </div>

      {/* Languages */}
      <div className={`
        transition-all duration-700 delay-200 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <DetailCard
          title="Languages"
          items={stats.languages?.slice(0, 7).map((lang, index) => ({
            name: lang.name,
            value: Math.round(lang.percent) + '%',
            time: Math.round(lang.total_seconds / 3600 * 10) / 10 + ' hrs',
            color: progressColors[index % progressColors.length]
          })) || []}
          titleColor="text-purple-bright"
        />
        
        {/* Activity Grid */}
        {activity && (
        <div className={`
          transition-all duration-700 delay-300 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <ActivityGrid data={activity} />
        </div>
      )}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, unit, subtitle, color, icon: Icon, iconColor }) => (
  <div className="bg-background border border-foreground/10 rounded-lg p-6 hover:border-yellow transition-colors flex items-center justify-center">
    <div className="flex gap-3 items-center">
      <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={1.5} />
      <div className="flex flex-col items-center">
        <div className={`${color} text-lg mb-1`}>{title}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-lg opacity-80">{unit}</div>
        </div>
        <div className="text-sm opacity-60 mt-1">{subtitle}</div>
      </div>
    </div>
  </div>
);

const DetailCard = ({ title, items, titleColor }) => (
  <div className="bg-background border border-foreground/10 rounded-lg p-6 hover:border-yellow transition-colors">
    <div className={`${titleColor} mb-6 text-lg`}>{title}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">{item.name}</span>
            <span className="text-base opacity-80">{item.value}</span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex-grow h-2 bg-foreground/5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                style={{ 
                  width: item.value,
                  opacity: '0.8'
                }}
              />
            </div>
            <span className="text-sm text-foreground/60 min-w-[70px] text-right">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DetailedStats;
