import React from "react";
import type { CollectionEntry } from "astro:content";
import { ProjectCard } from "@/components/projects/project-card";

interface ProjectListProps {
  projects: CollectionEntry<"projects">[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const latestProjects = projects.slice(0, 3);
  const otherProjects = projects.slice(3);

  return (
    <div className="w-full max-w-6xl mx-auto pt-24 sm:pt-32"> 
      <h1 className="text-2xl sm:text-3xl font-bold text-blue mb-12 text-center px-4 leading-relaxed">
        Here's what I've been <br className="sm:hidden" />
        building lately
      </h1>
      
      <div className="px-4 mb-16">
        <h2 className="text-xl font-bold text-foreground/90 mb-6">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr justify-items-center">
          {latestProjects.map(project => (
            <div key={project.slug} className="w-full max-w-md">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {otherProjects.length > 0 && (
        <div className="px-4 pb-8">
          <h2 className="text-xl font-bold text-foreground/90 mb-6">
            All Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr justify-items-center">
            {otherProjects.map(project => (
              <div key={project.slug} className="w-full max-w-md">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
