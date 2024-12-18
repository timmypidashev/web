import React from "react";
import { ChevronDownIcon } from "@/components/icons";

export default function Intro() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };
  
  return (
    <div className="w-full max-w-4xl px-4">
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-8 sm:gap-16">
          <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0">
            <img
              src="/me.jpeg"
              alt="Timothy Pidashev"
              className="rounded-lg object-cover w-full h-full ring-2 ring-yellow-bright hover:ring-orange-bright transition-all duration-300"
            />
          </div>
          <div className="text-center sm:text-left space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-5xl font-bold text-yellow-bright">
              Timothy Pidashev
            </h2>
            <div className="text-sm sm:text-xl text-foreground/70 space-y-2 sm:space-y-3">
              <p className="flex items-center justify-center font-bold sm:justify-start gap-2">
                <span className="text-blue">Software Systems Engineer</span>
              </p>
              <p className="flex items-center justify-center font-bold sm:justify-start gap-2">
                <span className="text-green">Open Source Enthusiast</span>
              </p>
              <p className="flex items-center justify-center font-bold sm:justify-start gap-2">
                <span className="text-yellow">Coffee Connoisseur</span>
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <p className="text-foreground/80 text-center text-base sm:text-2xl italic max-w-3xl mx-auto font-medium">
            "Turning coffee into code" isn't just a clever phrase – 
            <span className="text-aqua-bright"> it's how I approach each project:</span>
            <span className="text-purple-bright"> methodically,</span>
            <span className="text-blue-bright"> with attention to detail,</span>
            <span className="text-green-bright"> and a refined process.</span>
          </p>
          <div className="flex justify-center">
            <button 
              onClick={scrollToNext}
              className="text-foreground/50 hover:text-yellow-bright transition-colors duration-300"
              aria-label="Scroll to next section"
            >
              <ChevronDownIcon size={40} className="animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
