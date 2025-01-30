import { useState, useEffect } from "react";

const Stats = () => {
  const [stats, setStats] = useState<any>(null);
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/wakatime/alltime");
        const data = await res.json();
        setStats(data.data);
        startCounting(data.data.total_seconds);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const startCounting = (totalSeconds: number) => {
    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      
      if (currentStep >= steps) {
        setCount(totalSeconds);
        setIsFinished(true);
        clearInterval(timer);
        return;
      }

      const progress = 1 - Math.pow(1 - currentStep / steps, 4);
      setCount(Math.floor(totalSeconds * progress));
    }, duration / steps);

    return () => clearInterval(timer);
  };

  if (!stats) return null;

  const hours = Math.floor(count / 3600);
  const formattedHours = hours.toLocaleString("en-US", {
    minimumIntegerDigits: 4,
    useGrouping: true
  });
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className={`
        text-2xl opacity-0
        ${isVisible ? "animate-fade-in-first" : ""}
      `}>
        I've spent
      </div>

      <div className="relative">
        <div className="text-8xl text-center relative z-10">
          <span className="font-bold relative">
            <span className={`
              bg-gradient-text opacity-0
              ${isVisible ? "animate-fade-in-second" : ""}
            `}>
              {formattedHours}
            </span>
          </span>
          <span className={`
            text-4xl opacity-0
            ${isVisible ? "animate-slide-in-hours" : ""}
          `}>
            hours
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`
          text-xl opacity-0
          ${isVisible ? "animate-fade-in-third" : ""}
        `}>
          writing code & building apps
        </div>
        
        <div className={`
          flex items-center gap-3 text-lg opacity-0
          ${isVisible ? "animate-fade-in-fourth" : ""}
        `}>
          <span>since</span>
          <span className="text-green-bright font-bold">{stats.range.start_text}</span>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-text {
          background: linear-gradient(
            90deg,
            #fbbf24,
            #f59e0b,
            #d97706,
            #b45309,
            #f59e0b,
            #fbbf24
          );
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .animate-gradient {
          animation: gradient 4s linear infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes fadeInFirst {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 0.8;
            transform: translateY(0);
          }
        }

        @keyframes fadeInSecond {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInHours {
          0% { 
            opacity: 0;
            transform: translateX(20px);
            margin-left: 0;
          }
          100% { 
            opacity: 0.6;
            transform: translateX(0);
            margin-left: 1rem;
          }
        }

        @keyframes fadeInThird {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 0.8;
            transform: translateY(0);
          }
        }

        @keyframes fadeInFourth {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 0.6;
            transform: translateY(0);
          }
        }

        .animate-fade-in-first {
          animation: fadeInFirst 0.7s ease-out forwards;
        }

        .animate-fade-in-second {
          animation: fadeInSecond 0.7s ease-out forwards;
          animation-delay: 0.4s;
        }

        .animate-slide-in-hours {
          animation: slideInHours 0.7s ease-out forwards;
          animation-delay: 0.6s;
        }

        .animate-fade-in-third {
          animation: fadeInThird 0.7s ease-out forwards;
          animation-delay: 0.8s;
        }

        .animate-fade-in-fourth {
          animation: fadeInFourth 0.7s ease-out forwards;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Stats;
