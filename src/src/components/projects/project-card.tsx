import React from "react"
import type { CollectionEntry } from "astro:content";

interface ProjectCardProps {
  project: CollectionEntry<"projects">;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasLinks = project.data.githubUrl || project.data.demoUrl;

  return (
    <article className="group relative h-full">
      <a 
        href={`/projects/${project.slug}`}
        className="block rounded-lg border-2 border-foreground/20 
                 hover:border-blue transition-all duration-300 
                 bg-background overflow-hidden h-full flex flex-col"
      >
        <div className="aspect-video w-full border-b border-foreground/20 bg-foreground/5 overflow-hidden flex-shrink-0">
          {project.data.image ? (
            <img 
              src={project.data.image} 
              alt={`${project.data.title} preview`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/30">
              <span className="text-sm">No preview available</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 space-y-3 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-bold group-hover:text-blue transition-colors">
            {project.data.title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {project.data.techStack.map(tech => (
              <span key={tech} className="text-xs px-2 py-1 rounded-full bg-purple-bright/10 text-purple-bright">
                {tech}
              </span>
            ))}
          </div>

          <p className="text-foreground/70 text-sm sm:text-base flex-grow">
            {project.data.description}
          </p>
          
          {hasLinks && (
            <div className="flex gap-4 pt-3 border-t border-foreground/10 mt-auto">
              {project.data.githubUrl && (
                <a 
                  href={project.data.githubUrl}
                  className="text-sm text-blue hover:text-blue-bright 
                           transition-colors z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Source
                </a>
              )}
              {project.data.demoUrl && (
                <a 
                  href={project.data.demoUrl}
                  className="text-sm text-green hover:text-green-bright 
                           transition-colors z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Link
                </a>
              )}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
