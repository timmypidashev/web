import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";

interface GithubData {
  status: { message: string } | null;
  commit: { message: string; repo: string; date: string; url: string } | null;
  tinkering: { repo: string; url: string } | null;
}

const html = (strings: TemplateStringsArray, ...values: any[]) => {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }
  return result.replace(/\n\s*/g, "").replace(/\s+/g, " ").trim();
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface TypewriterInstance {
  typeString: (str: string) => TypewriterInstance;
  pauseFor: (ms: number) => TypewriterInstance;
  deleteAll: () => TypewriterInstance;
  callFunction: (cb: () => void) => TypewriterInstance;
  start: () => TypewriterInstance;
}

const emoji = (name: string) =>
  `<img src="/emoji/${name}.webp" alt="" style="display:inline;height:1em;width:1em;vertical-align:middle">`;

const SECTION_1 = html`
  <span>Hello, I'm</span>
  <br><div class="mb-4"></div>
  <span><a href="/about" class="text-aqua hover:underline"><strong>Timothy Pidashev</strong></a> ${emoji("wave")}</span>
`;

const SECTION_2 = html`
  <span>I've been turning</span>
  <br><div class="mb-4"></div>
  <span><a href="/projects" class="text-green hover:underline"><strong>coffee</strong></a> into <a href="/projects" class="text-yellow hover:underline"><strong>code</strong></a></span>
  <br><div class="mb-4"></div>
  <span>since <a href="/about" class="text-blue hover:underline"><strong>2018</strong></a> ${emoji("sparkles")}</span>
`;

const SECTION_3 = html`
  <span>Check out my</span>
  <br><div class="mb-4"></div>
  <span><a href="/blog" class="text-purple hover:underline"><strong>blog</strong></a>/
  <a href="/projects" class="text-blue hover:underline"><strong>projects</strong></a> or</span>
  <br><div class="mb-4"></div>
  <span><a href="/contact" class="text-green hover:underline"><strong>contact</strong></a> me below ${emoji("point-down")}</span>
`;

const MOODS = [
  "mood-cool", "mood-nerd", "mood-think", "mood-starstruck",
  "mood-fire", "mood-cold", "mood-salute",
  "mood-dotted", "mood-expressionless", "mood-neutral",
  "mood-nomouth", "mood-nod", "mood-melting",
];

function addGreetings(tw: TypewriterInstance) {
  tw.typeString(SECTION_1).pauseFor(2000).deleteAll()
    .typeString(SECTION_2).pauseFor(2000).deleteAll()
    .typeString(SECTION_3).pauseFor(2000).deleteAll();
}

function addGithubSections(tw: TypewriterInstance, github: GithubData) {
  if (github.status) {
    const moodImg = emoji(MOODS[Math.floor(Math.random() * MOODS.length)]);
    const statusStr =
      `<span>My current mood ${moodImg}</span>` +
      `<br><div class="mb-4"></div>` +
      `<a href="https://github.com/timmypidashev" target="_blank" class="text-orange-bright hover:underline">${escapeHtml(github.status.message)}</a>`;
    tw.typeString(statusStr).pauseFor(3000).deleteAll();
  }

  if (github.tinkering) {
    const tinkerImg = emoji("tinker");
    const tinkerStr =
      `<span>Currently tinkering with ${tinkerImg}</span>` +
      `<br><div class="mb-4"></div>` +
      `<a href="${github.tinkering.url}" target="_blank" class="text-yellow hover:underline">${github.tinkering.url}</a>`;
    tw.typeString(tinkerStr).pauseFor(3000).deleteAll();
  }

  if (github.commit) {
    const ago = timeAgo(github.commit.date);
    const memoImg = emoji("memo");
    const repoUrl = `https://github.com/timmypidashev/${github.commit.repo}`;
    const commitStr =
      `<span>My latest <span class="text-foreground/40">(unbroken?)</span> commit ${memoImg}</span>` +
      `<br><div class="mb-4"></div>` +
      `<a href="${github.commit.url}" target="_blank" class="text-green hover:underline">"${escapeHtml(github.commit.message)}"</a>` +
      `<br><div class="mb-4"></div>` +
      `<a href="${repoUrl}" target="_blank" class="text-yellow hover:underline">${escapeHtml(github.commit.repo)}</a>` +
      `<span class="text-foreground/40"> · ${ago}</span>`;
    tw.typeString(commitStr).pauseFor(3000).deleteAll();
  }
}

export default function Hero() {
  const [phase, setPhase] = useState<"intro" | "full">("intro");
  const githubRef = useRef<GithubData | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => { githubRef.current = data; })
      .catch(() => { githubRef.current = { status: null, commit: null, tinkering: null }; });
  }, []);

  const handleIntroInit = (typewriter: TypewriterInstance): void => {
    addGreetings(typewriter);
    typewriter.callFunction(() => {
      // Greetings done — data is almost certainly ready (API ~500ms, greetings ~20s)
      const check = () => {
        if (githubRef.current) {
          setPhase("full");
        } else {
          setTimeout(check, 200);
        }
      };
      check();
    }).start();
  };

  const handleFullInit = (typewriter: TypewriterInstance): void => {
    const github = githubRef.current!;
    // GitHub sections first (greetings just played in intro phase)
    addGithubSections(typewriter, github);
    // Then greetings for the loop
    addGreetings(typewriter);
    typewriter.start();
  };

  const baseOptions = { delay: 35, deleteSpeed: 35, cursor: "|" };

  return (
    <div className="flex justify-center items-center min-h-screen pointer-events-none">
      <div className="text-2xl md:text-4xl font-bold text-center pointer-events-none [&_a]:pointer-events-auto">
        {phase === "intro" ? (
          <Typewriter
            key="intro"
            options={{ ...baseOptions, autoStart: true, loop: false }}
            onInit={handleIntroInit}
          />
        ) : (
          <Typewriter
            key="full"
            options={{ ...baseOptions, autoStart: true, loop: true }}
            onInit={handleFullInit}
          />
        )}
      </div>
    </div>
  );
}
