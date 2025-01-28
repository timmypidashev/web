import React, { useState, useEffect } from "react";

const GlitchText = () => {
  const originalText = 'Error 404';
  const [characters, setCharacters] = useState(
    originalText.split("").map(char => ({ char, isGlitched: false }))
  );
  const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance to trigger glitch
        setCharacters(prev => {
          return originalText.split('').map((originalChar, index) => {
            if (Math.random() < 0.3) { // 30% chance to glitch each character
              return {
                char: glitchChars[Math.floor(Math.random() * glitchChars.length)],
                isGlitched: true
              };
            }
            return { char: originalChar, isGlitched: false };
          });
        });

        // Reset after short delay
        setTimeout(() => {
          setCharacters(originalText.split('').map(char => ({
            char,
            isGlitched: false
          })));
        }, 100);
      }
    }, 50);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative">
      <h1 className="text-6xl font-bold mb-4 relative">
        <span className="relative inline-block">
          {characters.map((charObj, index) => (
            <span 
              key={index} 
              className={charObj.isGlitched ? "text-red" : "text-purple"}
            >
              {charObj.char}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
};

export default GlitchText;
