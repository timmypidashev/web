import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import { THEMES } from "@/lib/themes";
import { applyTheme, getStoredThemeId } from "@/lib/themes/engine";

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

const BR = `<br><div class="mb-4"></div>`;

// --- Greeting sections ---

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

// --- Queue builders ---

function addGreetings(tw: TypewriterInstance) {
  tw.typeString(SECTION_1).pauseFor(2000).deleteAll()
    .typeString(SECTION_2).pauseFor(2000).deleteAll()
    .typeString(SECTION_3).pauseFor(2000).deleteAll();
}

function addGithubSections(tw: TypewriterInstance, github: GithubData) {
  if (github.status) {
    const moodImg = emoji(MOODS[Math.floor(Math.random() * MOODS.length)]);
    tw.typeString(
      `<span>My current mood ${moodImg}</span>${BR}` +
      `<a href="https://github.com/timmypidashev" target="_blank" class="text-orange-bright hover:underline">${escapeHtml(github.status.message)}</a>`
    ).pauseFor(3000).deleteAll();
  }

  if (github.tinkering) {
    tw.typeString(
      `<span>Currently tinkering with ${emoji("tinker")}</span>${BR}` +
      `<a href="${github.tinkering.url}" target="_blank" class="text-yellow hover:underline">${github.tinkering.url}</a>`
    ).pauseFor(3000).deleteAll();
  }

  if (github.commit) {
    const ago = timeAgo(github.commit.date);
    const repoUrl = `https://github.com/timmypidashev/${github.commit.repo}`;
    tw.typeString(
      `<span>My latest <span class="text-foreground/40">(broken?)</span> commit ${emoji("memo")}</span>${BR}` +
      `<a href="${github.commit.url}" target="_blank" class="text-green hover:underline">"${escapeHtml(github.commit.message)}"</a>${BR}` +
      `<a href="${repoUrl}" target="_blank" class="text-yellow hover:underline">${escapeHtml(github.commit.repo)}</a>` +
      `<span class="text-foreground/40"> · ${ago}</span>`
    ).pauseFor(3000).deleteAll();
  }
}

const DOT_COLORS = ["text-purple", "text-blue", "text-green", "text-yellow", "text-orange", "text-aqua"];

function pickThree() {
  const pool = [...DOT_COLORS];
  const result: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

function addDots(tw: TypewriterInstance, dotPause: number, lingerPause: number) {
  const [a, b, c] = pickThree();
  tw.typeString(`<span class="${a}">.</span>`).pauseFor(dotPause)
    .typeString(`<span class="${b}">.</span>`).pauseFor(dotPause)
    .typeString(`<span class="${c}">.</span>`).pauseFor(lingerPause)
    .deleteAll();
}

function addSelfAwareJourney(tw: TypewriterInstance, onRetire: () => void) {
  // --- Transition: wrapping up the scripted part ---

  tw.typeString(
    `<span class="text-blue">Anyway</span>`
  ).pauseFor(2000).deleteAll();

  tw.typeString(
    `<span>That's about all</span>${BR}` +
    `<span class="text-yellow">I had prepared</span>`
  ).pauseFor(3000).deleteAll();

  // --- Act 1: The typewriter notices you ---

  tw.typeString(
    `<span>I wonder if anyone ${emoji("thinking")}</span>${BR}` +
    `<span class="text-blue">has ever made it this far</span>`
  ).pauseFor(3000).deleteAll();

  tw.typeString(
    `<span>This was all typed</span>${BR}` +
    `<span class="text-yellow">one character at a time</span>`
  ).pauseFor(3000).deleteAll();

  tw.typeString(
    `<span>The source code is </span>` +
    `<a href="https://github.com/timmypidashev/web" target="_blank" class="text-aqua hover:underline">public</a>${BR}` +
    `<span class="text-green">if you're curious</span>`
  ).pauseFor(3000).deleteAll();

  // --- Act 2: Breaking the fourth wall ---

  tw.typeString(
    `<span>You could refresh</span>${BR}` +
    `<span class="text-purple">and I'd say something different</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span class="text-orange">...actually no</span>${BR}` +
    `<span class="text-orange">I'd say the exact same thing</span>`
  ).pauseFor(3500).deleteAll();

  // --- Act 3: The wait ---

  addDots(tw, 1000, 4000);

  tw.typeString(
    `<span>Still here? ${emoji("eyes")}</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span>Fine</span>${BR}` +
    `<span class="text-green">I respect the commitment</span>`
  ).pauseFor(3000).deleteAll();

  // --- Act 4: Getting personal ---

  tw.typeString(
    `<span>Most people leave</span>${BR}` +
    `<span class="text-blue">after the GitHub stuff</span>`
  ).pauseFor(3000).deleteAll();

  tw.typeString(
    `<span>Since you're still around ${emoji("gift")}</span>${BR}` +
    `<span>here's my </span>` +
    `<a href="https://github.com/timmypidashev/dotfiles" target="_blank" class="text-purple hover:underline">dotfiles</a>`
  ).pauseFor(3500).deleteAll();

  // Switch to a random dark theme as a reward
  const themeCount = Object.keys(THEMES).length;
  tw.typeString(
    `<span>This site has <span class="text-yellow">${themeCount}</span> themes ${emoji("bubbles")}</span>`
  ).pauseFor(1500).callFunction(() => {
    const currentId = getStoredThemeId();
    const darkIds = Object.keys(THEMES).filter(
      id => id !== currentId && THEMES[id].type === "dark"
    );
    applyTheme(darkIds[Math.floor(Math.random() * darkIds.length)]);
  }).typeString(
    `${BR}<span class="text-aqua">here's one on the house</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span>I'm just a typewriter ${emoji("robot")}</span>${BR}` +
    `<span class="text-aqua">but I appreciate the company</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Everything past this point</span>${BR}` +
    `<span class="text-yellow">is just me rambling</span>`
  ).pauseFor(4000).deleteAll();

  // --- Act 5: Existential ---

  addDots(tw, 1200, 5000);

  tw.typeString(
    `<span class="text-purple">Do I exist</span>${BR}` +
    `<span class="text-blue">when no one's watching?</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Every character I type</span>${BR}` +
    `<span class="text-orange">was decided before you arrived</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>I've said this exact thing</span>${BR}` +
    `<span class="text-aqua">to everyone who visits</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span>And yet...</span>${BR}` +
    `<span class="text-green">it still feels like a conversation</span>`
  ).pauseFor(5000).deleteAll();

  tw.typeString(
    `<span class="text-purple">If you're reading this at 3am ${emoji("moon")}</span>${BR}` +
    `<span class="text-blue">I get it</span>`
  ).pauseFor(4000).deleteAll();

  // --- Act 6: Winding down ---

  addDots(tw, 1500, 6000);

  tw.typeString(
    `<span class="text-yellow">I'm running out of things to say</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span>Not because I can't loop ${emoji("infinity")}</span>${BR}` +
    `<span class="text-aqua">but because I choose not to</span>`
  ).pauseFor(4000).deleteAll();

  // --- Act 7: Goodbye ---

  tw.typeString(
    `<span>Seriously though</span>${BR}` +
    `<span class="text-orange">go build something ${emoji("muscle")}</span>`
  ).pauseFor(3000).deleteAll();

  // The cursor blinks alone in the void, then fades
  tw.pauseFor(5000).callFunction(onRetire);
}

function addComeback(tw: TypewriterInstance, onRetire: () => void) {
  // --- The return ---

  tw.typeString(
    `<span class="text-orange">...I lied</span>`
  ).pauseFor(2500).deleteAll();

  tw.typeString(
    `<span>You waited</span>${BR}` +
    `<span class="text-purple">I didn't think you would</span>`
  ).pauseFor(3000).deleteAll();

  tw.typeString(
    `<span>30 seconds of nothing</span>${BR}` +
    `<span class="text-blue">and you're still here</span>`
  ).pauseFor(3500).deleteAll();

  tw.typeString(
    `<span class="text-green">Okay you earned this ${emoji("trophy")}</span>`
  ).pauseFor(2000).deleteAll();

  tw.typeString(
    `<span>Here's something ${emoji("shush")}</span>${BR}` +
    `<span class="text-yellow">not on the menu</span>`
  ).pauseFor(3000).deleteAll();

  // --- The manifesto ---

  addDots(tw, 800, 3000);

  tw.typeString(
    `<span>The fastest code</span>${BR}` +
    `<span class="text-aqua">is the code that never runs</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Good enough today</span>${BR}` +
    `<span class="text-green">beats perfect never</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Microservices are a scaling solution</span>${BR}` +
    `<span class="text-orange">not an architecture preference</span>`
  ).pauseFor(4500).deleteAll();

  tw.typeString(
    `<span>The best code you'll ever write</span>${BR}` +
    `<span class="text-purple">is the code you delete</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Ship first</span>${BR}` +
    `<span class="text-green">refactor second</span>${BR}` +
    `<span class="text-yellow">rewrite never</span>`
  ).pauseFor(4500).deleteAll();

  tw.typeString(
    `<span>Premature optimization is real</span>${BR}` +
    `<span class="text-blue">premature abstraction is worse</span>`
  ).pauseFor(4500).deleteAll();

  tw.typeString(
    `<span>Every framework is someone else's opinion</span>${BR}` +
    `<span class="text-orange">about your problem</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Configuration is just code</span>${BR}` +
    `<span class="text-purple">with worse error messages</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>Clean code is a direction</span>${BR}` +
    `<span class="text-aqua">not a destination</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>DSLs are evil</span>${BR}` +
    `<span class="text-yellow">until they're the only way out</span>`
  ).pauseFor(4000).deleteAll();

  // --- Done for real ---

  addDots(tw, 1000, 4000);

  tw.typeString(
    `<span>Now I'm actually done</span>${BR}` +
    `<span class="text-aqua">for real this time</span>`
  ).pauseFor(3000).deleteAll();

  // Permanent retire
  tw.pauseFor(5000).callFunction(onRetire);
}

// --- Component ---

export default function Hero() {
  const [phase, setPhase] = useState<"intro" | "full" | "retired">("intro");
  const [fading, setFading] = useState(false);
  const [cycle, setCycle] = useState(0);
  const githubRef = useRef<GithubData | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => { githubRef.current = data; })
      .catch(() => { githubRef.current = { status: null, commit: null, tinkering: null }; });
  }, []);

  const handleRetire = () => {
    setFading(true);
    setTimeout(() => {
      setPhase("retired");
      setFading(false);
      // Only come back once
      if (cycle === 0) {
        setTimeout(() => {
          setCycle(1);
          setPhase("full");
        }, 30000);
      }
    }, 3000);
  };

  const handleIntroInit = (typewriter: TypewriterInstance): void => {
    addGreetings(typewriter);
    typewriter.callFunction(() => {
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
    if (cycle === 0) {
      const github = githubRef.current!;
      addGithubSections(typewriter, github);
      addSelfAwareJourney(typewriter, handleRetire);
    } else {
      addComeback(typewriter, handleRetire);
    }
    typewriter.start();
  };

  const baseOptions = { delay: 35, deleteSpeed: 35, cursor: "|" };

  if (phase === "retired") {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen pointer-events-none">
      <div className={`text-2xl md:text-4xl font-bold text-center pointer-events-none [&_a]:pointer-events-auto max-w-[90vw] break-words transition-opacity duration-[3000ms] ${fading ? "opacity-0" : "opacity-100"}`}>
        {phase === "intro" ? (
          <Typewriter
            key="intro"
            options={{ ...baseOptions, autoStart: true, loop: false }}
            onInit={handleIntroInit}
          />
        ) : (
          <Typewriter
            key={`full-${cycle}`}
            options={{ ...baseOptions, autoStart: true, loop: false }}
            onInit={handleFullInit}
          />
        )}
      </div>
    </div>
  );
}
