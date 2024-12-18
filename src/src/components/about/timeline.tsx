import React from "react";
import { Check, Code, GitBranch, Star } from "lucide-react";

export default function Timeline() {
  const timelineItems = [
    {
      year: "2024",
      title: "Present",
      description: "The wisdom of past ventures now flows through my work, whether crafting elegant CRUD applications or embarking on bold projects that expand my limits.",
      technologies: ["Rust", "Typescript", "Go", "Postgres"],
      icon: <Code className="text-yellow-bright" size={20} />
    },
    {
      year: "2022",
      title: "Diving Deeper",
      description: "The worlds of systems programming and scalable infrastructure collided as I explored low-level C++ graphics programming and containerization with Docker.",
      technologies: ["C++", "Cmake", "Docker", "Docker Compose"],
      icon: <GitBranch className="text-green-bright" size={20} />
    },
    {
      year: "2020",
      title: "Exploring the Stack",
      description: "Starting with pure HTML and CSS, I explored the foundations of web development, gradually venturing into JavaScript and React to bring my static pages to life.",
      technologies: ["Javascript", "Tailwind", "React", "Express"],
      icon: <Star className="text-blue-bright" size={20} />
    },
    {
      year: "2018",
      title: "Starting the Journey",
      description: "An elective Python class in 8th grade transformed my keen interest in programming into a relentless obsession, one that drove me to constantly explore new depths.",
      technologies: ["Python", "Discord.py", "Asyncio", "Sqlite"],
      icon: <Check className="text-purple-bright" size={20} />
    }
  ];

  return (
    <div className="w-full max-w-6xl px-4 py-8 relative z-0">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-bright mb-8 md:mb-12">
        Journey Through Code
      </h2>
      <div className="relative">
        <div className="absolute left-4 sm:left-1/2 h-full w-0.5 bg-foreground/10 -translate-x-1/2" />
        
        <div className="ml-8 sm:ml-0">
          {timelineItems.map((item, index) => (
            <div key={item.year} className="relative mb-8 md:mb-12 last:mb-0">
              <div className={`flex flex-col sm:flex-row items-start ${
                index % 2 === 0 ? 'sm:flex-row-reverse' : ''
              }`}>
                <div className="absolute -left-8 sm:left-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-background 
                              rounded-full border-2 border-yellow-bright sm:-translate-x-1/2
                              flex items-center justify-center z-10">
                  {item.icon}
                </div>
                <div className={`w-full sm:w-[calc(50%-32px)] ${
                  index % 2 === 0 ? 'sm:pr-8 md:pr-12' : 'sm:pl-8 md:pl-12'
                }`}>
                  <div className="p-4 sm:p-6 bg-background/50 rounded-lg border border-foreground/10 
                                hover:border-yellow-bright/50 transition-colors duration-300">
                    <span className="text-xs sm:text-sm font-mono text-yellow-bright">{item.year}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground/90 mt-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-foreground/70 mt-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.technologies.map((tech) => (
                        <span key={tech} 
                              className="px-2 py-1 text-xs sm:text-sm rounded-full bg-foreground/5 
                                       text-foreground/60 hover:text-yellow-bright transition-colors duration-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
