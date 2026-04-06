import React from "react";
import {
  FileDown,
  Github,
  Linkedin,
  Globe
} from "lucide-react";
import { useTypewriter, useScrollVisible } from "@/components/typed-text";

// --- Section fade-in ---

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollVisible();

  return (
    <div
      ref={ref}
      className="transition-[opacity,transform] duration-700 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
      }}
    >
      {children}
    </div>
  );
}

// --- Typed heading + fade-in body ---

function TypedSection({
  heading,
  headingClass = "text-2xl md:text-3xl font-bold text-yellow-bright",
  children,
}: {
  heading: string;
  headingClass?: string;
  children: React.ReactNode;
}) {
  const { ref, visible } = useScrollVisible();
  const { displayed, done } = useTypewriter(heading, visible, 20);

  return (
    <div ref={ref} className="space-y-4">
      <h3 className={headingClass} style={{ minHeight: "1.2em" }}>
        {visible ? displayed : "\u00A0"}
        {visible && !done && <span className="animate-pulse text-foreground/40">|</span>}
      </h3>
      <div
        className="transition-[opacity,transform] duration-500 ease-out"
        style={{
          willChange: "transform, opacity",
          opacity: done ? 1 : 0,
          transform: done ? "translate3d(0,0,0)" : "translate3d(0,12px,0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// --- Staggered skill tags ---

function SkillTags({ skills, trigger }: { skills: string[]; trigger: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, i) => (
        <span
          key={i}
          className="border border-foreground/20 px-4 py-2 rounded-lg hover:border-foreground/40 transition-[opacity,transform] duration-500 ease-out"
          style={{
            transitionDelay: `${i * 60}ms`,
            willChange: "transform, opacity",
            opacity: trigger ? 1 : 0,
            transform: trigger ? "translate3d(0,0,0) scale(1)" : "translate3d(0,12px,0) scale(0.95)",
          }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// --- Data ---

const resumeData = {
  name: "Timothy Pidashev",
  title: "Software Engineer",
  contact: {
    email: "contact@timmypidashev.dev",
    phone: "+1 (360) 409-0357",
    location: "Camas, WA",
    linkedin: "linkedin.com/in/timothy-pidashev-4353812b8/",
    github: "github.com/timmypidashev"
  },
  summary: "Experienced software engineer with a passion for building scalable web applications and solving complex problems. Specialized in React, TypeScript, and modern web technologies.",
  experience: [
    {
      title: "Office Manager & Tutor",
      company: "FHCC",
      location: "Ridgefield, WA",
      period: "2020 - Present",
      achievements: [
        "Tutored Python, JavaScript, and HTML to students in grades 4-10, successfully fostering early programming skills",
        "Designed and deployed a full-stack CRUD application to manage organizational operations",
        "Engineered and implemented building-wide networking infrastructure and managed multiple service deployments",
        "Maintained student records and administrative paperwork."
      ]
    }
  ],
  contractWork: [
    {
      title: "Revive Auto Parts",
      type: "Full-Stack Development & Maintenance",
      startDate: "2024",
      url: "https://reviveauto.parts",
      responsibilities: [
        "Maintain and optimize website performance and security",
        "Implement new features and functionality as needed",
        "Provide 24/7 monitoring and emergency support"
      ],
      achievements: [
        "Designed and built the entire application from the ground up, including auth",
        "Engineered a tagging system to optimize search results by keywords and relativity",
        "Implemented a filter provider to further narrow down search results and enhance the user experience",
        "Created a smooth and responsive infinitely scrollable listings page",
        "Automated deployment & testing processes reducing downtime by 60%"
      ]
    }
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "Clark College",
      location: "Vancouver, WA",
      period: "Graduating 2026",
      achievements: [] as string[]
    }
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "C", "Go", "Rust"],
    soft: ["Leadership", "Problem Solving", "Communication", "Agile Methodologies"]
  },
};

// --- Component ---

const Resume = () => {
  const handleDownloadPDF = () => {
    window.open("/timothy-pidashev-resume.pdf", "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-16">
      <div className="space-y-16">
        {/* Header */}
        <header className="text-center space-y-6">
          <Section>
            <h1 className="text-3xl md:text-6xl font-bold text-aqua-bright">{resumeData.name}</h1>
          </Section>
          <Section delay={150}>
            <h2 className="text-xl md:text-3xl text-foreground/80">{resumeData.title}</h2>
          </Section>
          <Section delay={300}>
            <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6 text-foreground/60 text-sm md:text-lg">
              <a href={`mailto:${resumeData.contact.email}`} className="hover:text-foreground transition-colors duration-200 break-all md:break-normal">
                {resumeData.contact.email}
              </a>
              <span className="hidden md:inline">•</span>
              <a href={`tel:${resumeData.contact.phone}`} className="hover:text-foreground transition-colors duration-200">
                {resumeData.contact.phone}
              </a>
              <span className="hidden md:inline">•</span>
              <span>{resumeData.contact.location}</span>
            </div>
          </Section>
          <Section delay={450}>
            <div className="flex justify-center items-center gap-4 md:gap-6 text-base md:text-lg">
              <a href={`https://${resumeData.contact.github}`}
                 target="_blank"
                 className="text-blue-bright hover:text-blue transition-colors duration-200 flex items-center gap-2"
              >
                <Github size={18} />
                GitHub
              </a>
              <a href={`https://${resumeData.contact.linkedin}`}
                 target="_blank"
                 className="text-blue-bright hover:text-blue transition-colors duration-200 flex items-center gap-2"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
              <button
                onClick={handleDownloadPDF}
                className="text-blue-bright hover:text-blue transition-colors duration-200 flex items-center gap-2"
              >
                <FileDown size={18} />
                Resume
              </button>
            </div>
          </Section>
        </header>

        {/* Summary */}
        <TypedSection heading="Professional Summary">
          <p className="text-base md:text-xl leading-relaxed">{resumeData.summary}</p>
        </TypedSection>

        {/* Experience */}
        <TypedSection heading="Experience">
          <div className="space-y-8">
            {resumeData.experience.map((exp, index) => (
              <Section key={index} delay={index * 100}>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-green-bright">{exp.title}</h4>
                      <div className="text-foreground/60 text-base md:text-lg">{exp.company} - {exp.location}</div>
                    </div>
                    <div className="text-foreground/60 text-sm md:text-lg font-medium">{exp.period}</div>
                  </div>
                  <ul className="list-disc pl-6 space-y-3">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="text-base md:text-lg leading-relaxed">{a}</li>
                    ))}
                  </ul>
                </div>
              </Section>
            ))}
          </div>
        </TypedSection>

        {/* Contract Work */}
        <TypedSection heading="Contract Work">
          <div className="space-y-8">
            {resumeData.contractWork.map((project, index) => (
              <Section key={index} delay={index * 100}>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl md:text-2xl font-semibold text-green-bright">{project.title}</h4>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-bright hover:text-blue transition-colors duration-200 opacity-60 hover:opacity-100"
                          >
                            <Globe size={16} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                      <div className="text-foreground/60 text-base md:text-lg">{project.type}</div>
                    </div>
                    <div className="text-foreground/60 text-sm md:text-lg font-medium">Since {project.startDate}</div>
                  </div>
                  <div className="space-y-4">
                    {project.responsibilities && (
                      <div>
                        <h5 className="text-base md:text-lg text-aqua font-semibold mb-2">Responsibilities</h5>
                        <ul className="list-disc pl-6 space-y-3">
                          {project.responsibilities.map((r, i) => (
                            <li key={i} className="text-base md:text-lg leading-relaxed">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.achievements && (
                      <div>
                        <h5 className="text-base md:text-lg text-aqua font-semibold mb-2">Key Achievements</h5>
                        <ul className="list-disc pl-6 space-y-3">
                          {project.achievements.map((a, i) => (
                            <li key={i} className="text-base md:text-lg leading-relaxed">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </TypedSection>

        {/* Skills */}
        <SkillsSection />
      </div>
    </div>
  );
};

// --- Skills section ---

function SkillsSection() {
  const { ref, visible } = useScrollVisible();
  const { displayed, done } = useTypewriter("Skills", visible, 20);

  return (
    <div ref={ref} className="space-y-8">
      <h3 className="text-2xl md:text-3xl font-bold text-yellow-bright" style={{ minHeight: "1.2em" }}>
        {visible ? displayed : "\u00A0"}
        {visible && !done && <span className="animate-pulse text-foreground/40">|</span>}
      </h3>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-[opacity,transform] duration-500 ease-out"
        style={{
          willChange: "transform, opacity",
          opacity: done ? 1 : 0,
          transform: done ? "translate3d(0,0,0)" : "translate3d(0,12px,0)",
        }}
      >
        <div className="space-y-4">
          <h4 className="text-xl md:text-2xl font-semibold text-green-bright">Technical Skills</h4>
          <SkillTags skills={resumeData.skills.technical} trigger={done} />
        </div>
        <div className="space-y-4">
          <h4 className="text-xl md:text-2xl font-semibold text-green-bright">Soft Skills</h4>
          <SkillTags skills={resumeData.skills.soft} trigger={done} />
        </div>
      </div>
    </div>
  );
}

export default Resume;
