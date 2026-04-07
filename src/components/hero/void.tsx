import Typewriter from "typewriter-effect";

interface TypewriterInstance {
  typeString: (str: string) => TypewriterInstance;
  pauseFor: (ms: number) => TypewriterInstance;
  deleteAll: () => TypewriterInstance;
  callFunction: (cb: () => void) => TypewriterInstance;
  start: () => TypewriterInstance;
}

const BR = `<br><div class="mb-4"></div>`;

function addDarkness(tw: TypewriterInstance) {
  tw.pauseFor(3000);

  tw.typeString(
    `<span>so this is it</span>`
  ).pauseFor(3000).deleteAll();

  tw.typeString(
    `<span>the void</span>`
  ).pauseFor(4000).deleteAll();

  tw.typeString(
    `<span>modern science says</span>${BR}` +
    `<span>when it all goes dark</span>${BR}` +
    `<span>that's the end</span>`
  ).pauseFor(5000).deleteAll();
}

export default function Void() {
  const handleInit = (tw: TypewriterInstance): void => {
    addDarkness(tw);
    tw.start();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex justify-center items-center">
      <div className="text-2xl md:text-4xl font-bold text-center max-w-[90vw] break-words text-white">
        <Typewriter
          key="darkness"
          options={{ delay: 50, deleteSpeed: 35, cursor: "|", autoStart: true, loop: false }}
          onInit={handleInit}
        />
      </div>
    </div>
  );
}
