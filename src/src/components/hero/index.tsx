import React from "react";
import Typewriter from "typewriter-effect";

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
  const handleInit = (typewriter: TypewriterInstance): void => {
    typewriter
      .typeString("<center><span class='inline-block mb-4'>Hello, I'm</span><br><span class='inline-block mb-4'><strong class='text-aqua'>Timothy Pidashev</strong></span></center>")
      .pauseFor(2500)
      .deleteAll()
      .start();

    typewriter
      .typeString("<center><span class='inline-block mb-4'>I've been turning</span><br><span class='inline-block mb-4'><strong class='text-green'>coffee</strong> into <strong class='text-yellow'>code</strong></span><br><span class='inline-block mb-4'>since <strong class='text-blue'>2018</strong>!</span></center>")
      .pauseFor(2500)
      .deleteAll()
      .start();

    typewriter
      .typeString("<center><span class=''>Check out my <strong class='text-purple'>blog</strong> and <strong class='text-aqua'>shop</strong></span><br></span><br><span class=''>or <strong class='text-green'>contact</strong> me below!</span></center>")
      .pauseFor(2500)
      .deleteAll()
      .start();
  };

  const typewriterOptions: TypewriterOptions = {
    autoStart: true,
    loop: true,
    delay: 50,
    deleteSpeed: 800,
    cursor: ''
  };

  return (
    <>
      <div className="flex justify-center items-center h-full font-bold text-4xl">
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="flex items-center justify-center relative h-58 overflow-y-auto">
            <Typewriter
              options={typewriterOptions}
              onInit={handleInit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
