import React, { useState, useEffect } from 'react';

export const ActivityGrid = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/wakatime');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get intensity based on coding hours (0-4 for different shades)
  const getIntensity = (hours) => {
    if (hours === 0) return 0;
    if (hours < 2) return 1;
    if (hours < 4) return 2;
    if (hours < 6) return 3;
    return 4;
  };

  // Get color class based on intensity
  const getColorClass = (intensity) => {
    if (intensity === 0) return 'bg-foreground/5';
    if (intensity === 1) return 'bg-green-DEFAULT/30';
    if (intensity === 2) return 'bg-green-DEFAULT/60';
    if (intensity === 3) return 'bg-green-DEFAULT/80';
    return 'bg-green-bright';
  };

  // Group data by week
  const weeks = [];
  let currentWeek = [];
  
  if (data.length > 0) {
    data.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === data.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  }

  if (loading) {
    return (
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <div className="text-lg text-aqua-bright mb-6">Loading activity data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <div className="text-lg text-red-bright mb-6">Error loading activity: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-colors">
      <div className="text-lg text-aqua-bright mb-6">Activity</div>
      
      <div className="flex gap-4">
        {/* Days labels */}
        <div className="flex flex-col gap-2 pt-6 text-xs">
          {days.map((day, i) => (
            <div key={day} className="h-3 text-foreground/60">{i % 2 === 0 ? day : ''}</div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex-grow overflow-x-auto">
          <div className="flex gap-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-2">
                {week.map((day, dayIndex) => {
                  const hours = day.grand_total.total_seconds / 3600;
                  const intensity = getIntensity(hours);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getColorClass(intensity)} 
                        hover:ring-1 hover:ring-foreground/30 transition-all cursor-pointer
                        group relative`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 
                        bg-background border border-foreground/10 rounded-md opacity-0 
                        group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap text-xs">
                        {hours.toFixed(1)} hours on {day.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Months labels */}
          <div className="flex text-xs text-foreground/60 mt-2">
            {weeks.map((week, i) => {
              const date = new Date(week[0].date);
              const isFirstOfMonth = date.getDate() <= 7;
              return (
                <div 
                  key={i} 
                  className="w-3 mx-1"
                  style={{ marginLeft: i === 0 ? '0' : undefined }}
                >
                  {isFirstOfMonth && months[date.getMonth()]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-foreground/60">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((intensity) => (
          <div
            key={intensity}
            className={`w-3 h-3 rounded-sm ${getColorClass(intensity)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityGrid;
