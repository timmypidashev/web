import React from "react";
import { 
  FileDown, 
  Github, 
  Linkedin, 
  Globe 
} from "lucide-react";

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
        "Implemented a filter provider to further narrow down search results and enchance the user experience",
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
      achievements: []
    }
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "C", "Go", "Rust"],
    soft: ["Leadership", "Problem Solving", "Communication", "Agile Methodologies"]
  },
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022"
    }
  ]
};

const Resume = () => {
  const handleDownloadPDF = () => {
    window.open("/timothy-pidashev-resume.pdf", "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 pt-24 pb-16">
      <div className="space-y-16">
        {/* Header */}
        <header className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-aqua-bright">{resumeData.name}</h1>
          <h2 className="text-3xl text-foreground/80">{resumeData.title}</h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-foreground/60 text-lg">
            <a href={`mailto:${resumeData.contact.email}`} className="hover:text-foreground transition-colors duration-200">
              {resumeData.contact.email}
            </a>
            <span className="hidden md:inline">•</span>
            <a href={`tel:${resumeData.contact.phone}`} className="hover:text-foreground transition-colors duration-200">
              {resumeData.contact.phone}
            </a>
            <span className="hidden md:inline">•</span>
            <span>{resumeData.contact.location}</span>
          </div>
          <div className="flex justify-center items-center gap-6 text-lg">
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
        </header>

        {/* Summary */}
        <section className="space-y-4">
          <h3 className="text-3xl font-bold text-yellow-bright">Professional Summary</h3>
          <p className="text-xl leading-relaxed">{resumeData.summary}</p>
        </section>

        {/* Experience */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-yellow-bright">Experience</h3>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <h4 className="text-2xl font-semibold text-green-bright">{exp.title}</h4>
                  <div className="text-foreground/60 text-lg">{exp.company} - {exp.location}</div>
                </div>
                <div className="text-foreground/60 text-lg font-medium">{exp.period}</div>
              </div>
              <ul className="list-disc pl-6 space-y-3">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="text-lg leading-relaxed">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Contract Work */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-yellow-bright">Contract Work</h3>
          {resumeData.contractWork.map((project, index) => (
            <div key={index} className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-semibold text-green-bright">{project.title}</h4>
                    {project.url && (
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-bright hover:text-blue transition-colors duration-200 opacity-60 hover:opacity-100"
                        aria-label={`Visit ${project.title}`}
                      >
                        <Globe size={16} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                  <div className="text-foreground/60 text-lg">{project.type}</div>
                </div>
                <div className="text-foreground/60 text-lg font-medium">Since {project.startDate}</div>
              </div>
              <div className="space-y-4">
                {project.responsibilities && (
                  <div>
                    <h5 className="text-lg text-aqua font-semibold mb-2">Responsibilities</h5>
                    <ul className="list-disc pl-6 space-y-3">
                      {project.responsibilities.map((responsibility, i) => (
                        <li key={i} className="text-lg leading-relaxed">{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.achievements && (
                  <div>
                    <h5 className="text-lg text-aqua font-semibold mb-2">Key Achievements</h5>
                    <ul className="list-disc pl-6 space-y-3">
                      {project.achievements.map((achievement, i) => (
                        <li key={i} className="text-lg leading-relaxed">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-yellow-bright">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <h4 className="text-2xl font-semibold text-green-bright">{edu.degree}</h4>
                  <div className="text-foreground/60 text-lg">{edu.school} - {edu.location}</div>
                </div>
                <div className="text-foreground/60 text-lg font-medium">{edu.period}</div>
              </div>
              <ul className="list-disc pl-6 space-y-3">
                {edu.achievements.map((achievement, i) => (
                  <li key={i} className="text-lg leading-relaxed">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="space-y-8">
          <h3 className="text-3xl font-bold text-yellow-bright">Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-green-bright">Technical Skills</h4>
              <div className="flex flex-wrap gap-3">
                {resumeData.skills.technical.map((skill, index) => (
                  <span key={index} 
                        className="border border-foreground/20 px-4 py-2 rounded-lg hover:border-foreground/40 transition-colors duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-green-bright">Soft Skills</h4>
              <div className="flex flex-wrap gap-3">
                {resumeData.skills.soft.map((skill, index) => (
                  <span key={index} 
                        className="border border-foreground/20 px-4 py-2 rounded-lg hover:border-foreground/40 transition-colors duration-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        {/* Temporarily Hidden
        <section className="space-y-6 mb-16">
          <h3 className="text-3xl font-bold text-yellow-bright">Certifications</h3>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-2xl font-semibold text-green-bright">{cert.name}</h4>
              <div className="text-foreground/60 text-lg">{cert.issuer} - {cert.date}</div>
            </div>
          ))}
        </section>
        */}
      </div>
    </div>
  );
};

export default Resume;
