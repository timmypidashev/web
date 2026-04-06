import type { CollectionEntry } from "astro:content";
import { AnimateIn } from "@/components/animate-in";

interface ProjectListProps {
  projects: CollectionEntry<"projects">[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="w-full max-w-6xl mx-auto pt-12 md:pt-24 lg:pt-32 px-4">
      <AnimateIn>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue mb-12 text-center leading-relaxed">
          Here's what I've been building lately
        </h1>
      </AnimateIn>

      <ul className="space-y-6 md:space-y-10">
        {projects.map((project, i) => (
          <AnimateIn key={project.id} delay={i * 80}>
            <li className="group">
              <a href={`/projects/${project.id}`} className="block">
                <article className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-2 md:p-4 border-b border-foreground/20 last:border-b-0 rounded-lg group-hover:outline group-hover:outline-2 group-hover:outline-blue transition-[outline-color] duration-200">
                  {/* Image */}
                  <div className="w-full md:w-1/3 aspect-[16/9] overflow-hidden rounded-lg bg-foreground/5 flex-shrink-0">
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

                  {/* Content */}
                  <div className="w-full md:w-2/3 flex flex-col gap-2 md:gap-3">
                    <h2 className="text-lg md:text-2xl font-semibold text-yellow group-hover:text-blue transition-colors duration-200 line-clamp-2">
                      {project.data.title}
                    </h2>

                    <p className="text-foreground/90 text-sm md:text-lg leading-relaxed line-clamp-2">
                      {project.data.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
                      {project.data.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs md:text-sm px-2 py-0.5 rounded-full bg-purple-bright/10 text-purple-bright"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    {(project.data.githubUrl || project.data.demoUrl) && (
                      <div className="flex gap-4 mt-1">
                        {project.data.githubUrl && (
                          <span
                            className="text-sm text-foreground/50 hover:text-blue-bright transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.data.githubUrl, "_blank");
                            }}
                          >
                            Source
                          </span>
                        )}
                        {project.data.demoUrl && (
                          <span
                            className="text-sm text-foreground/50 hover:text-green-bright transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.data.demoUrl, "_blank");
                            }}
                          >
                            Live
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </a>
            </li>
          </AnimateIn>
        ))}
      </ul>
    </div>
  );
}
