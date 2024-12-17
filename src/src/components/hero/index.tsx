import React from "react";
import Typewriter from "typewriter-effect";

const html = (strings: TemplateStringsArray, ...values: any[]) => {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }
  return result.replace(/\n\s*/g, "").replace(/\s+/g, " ").trim();
};

interface TypewriterOptions {
  autoStart: boolean;
  loop: boolean;
  delay: number;
  deleteSpeed: number;
  cursor: string;
}

interface TypewriterInstance {
  typeString: (str: string) => TypewriterInstance;
  pauseFor: (ms: number) => TypewriterInstance;
  deleteAll: () => TypewriterInstance;
  start: () => TypewriterInstance;
}

export default function Hero() {
  const SECTION_1 = html`
    <span>Hello, I'm</span>
    <br><div class="mb-4"></div>
    <span><a href="/about" class="text-aqua hover:underline"><strong>Timothy Pidashev</strong></a></span>
  `;

  const SECTION_2 = html`
    <span>I've been turning</span>
    <br><div class="mb-4"></div>
    <span><a href="/projects" class="text-green hover:underline"><strong>coffee</strong></a> into 
    <a href="/projects" class="text-yellow hover:underline"><strong>code</strong></a></span>
    <br><div class="mb-4"></div>
    <span>since <a href="/about" class="text-blue hover:underline"><strong>2018</strong></a>!</span>
  `;

  const SECTION_3 = html`
    <span>Check out my</span>
    <br><div class="mb-4"></div>
    <span><a href="/blog" class="text-purple hover:underline"><strong>blog</strong></a>/
    <a href="/projects" class="text-blue hover:underline"><strong>projects</strong></a> or</span>
    <br><div class="mb-4"></div>
    <span><a href="/contact" class="text-green hover:underline"><strong>contact</strong></a> me below!</span>
  `;

  const handleInit = (typewriter: TypewriterInstance): void => {
    typewriter
      .typeString(SECTION_1)
      .pauseFor(2000)
      .deleteAll()
      .typeString(SECTION_2)
      .pauseFor(2000)
      .deleteAll()
      .typeString(SECTION_3)
      .pauseFor(2000)
      .deleteAll()
      .start();
  };

  const typewriterOptions: TypewriterOptions = {
    autoStart: true,
    loop: true,
    delay: 50,
    deleteSpeed: 800,
    cursor: '|'
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-4xl font-bold text-center">
        <Typewriter
          options={typewriterOptions}
          onInit={handleInit}
        />
      </div>
    </div>
  );
}
