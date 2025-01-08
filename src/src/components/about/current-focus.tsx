import React from 'react';
import { Code2, BookOpen, RocketIcon, Compass } from 'lucide-react';

export default function CurrentFocus() {
  const recentProjects = [
    {
      title: "Darkbox",
      description: "My gruvbox theme, with a pure black background",
      href: "/projects/darkbox",
      tech: ["Neovim", "Lua"]
    },
    {
      title: "Revive Auto Parts",
      description: "A car parts listing site built for a client",
      href: "/projects/reviveauto",
      tech: ["Tanstack", "React Query", "Fastapi"]
    },
    {
      title: "Fhccenter",
      description: "Website made for a private school",
      href: "/projects/fhccenter",
      tech: ["Nextjs", "Typescript", "Prisma"]
    }
  ];

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-6xl p-4 sm:px-6 py-6 sm:py-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-yellow-bright mb-8 sm:mb-12">
          Current Focus
        </h2>

        {/* Recent Projects Section */}
        <div className="mb-8 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Code2 className="text-yellow-bright" size={24} />
            <h3 className="text-xl font-bold text-foreground/90">Recent Projects</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {recentProjects.map((project) => (
              <a 
                href={project.href}
                key={project.title}
                className="p-4 sm:p-6 rounded-lg border border-foreground/10 hover:border-yellow-bright/50 
                         transition-all duration-300 group bg-background/50"
              >
                <h4 className="font-bold text-lg group-hover:text-yellow-bright transition-colors">
                  {project.title}
                </h4>
                <p className="text-foreground/70 mt-2 text-sm sm:text-base">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded-full bg-foreground/5 text-foreground/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Current Learning & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* What I'm Learning */}
          <div className="space-y-4 p-4 sm:p-6 rounded-lg border border-foreground/10 bg-background/50">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="text-green-bright" size={24} />
              <h3 className="text-lg sm:text-xl font-bold text-foreground/90">Currently Learning</h3>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-bright flex-shrink-0" />
                <span>Rust Programming</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-bright flex-shrink-0" />
                <span>WebAssembly with Rust</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-bright flex-shrink-0" />
                <span>HTTP/3 & WebTransport</span>
              </li>
            </ul>
          </div>

          {/* Project Interests */}
          <div className="space-y-4 p-4 sm:p-6 rounded-lg border border-foreground/10 bg-background/50">
            <div className="flex items-center justify-center gap-2">
              <RocketIcon className="text-blue-bright" size={24} />
              <h3 className="text-lg sm:text-xl font-bold text-foreground/90">Project Interests</h3>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-bright flex-shrink-0" />
                <span>AI Model Integration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-bright flex-shrink-0" />
                <span>Rust Systems Programming</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-bright flex-shrink-0" />
                <span>Cross-platform WASM Apps</span>
              </li>
            </ul>
          </div>

          {/* Areas to Explore */}
          <div className="space-y-4 p-4 sm:p-6 rounded-lg border border-foreground/10 bg-background/50">
            <div className="flex items-center justify-center gap-2">
              <Compass className="text-purple-bright" size={24} />
              <h3 className="text-lg sm:text-xl font-bold text-foreground/90">Want to Explore</h3>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-bright flex-shrink-0" />
                <span>LLM Fine-tuning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-bright flex-shrink-0" />
                <span>Rust 2024 Edition</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-bright flex-shrink-0" />
                <span>Real-time Web Transport</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
