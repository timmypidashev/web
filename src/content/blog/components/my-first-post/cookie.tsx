import { useState } from "react";

const Cookie = () => {
  const [hasBite, setHasBite] = useState(false);

  const handleClick = () => {
    setHasBite((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Click for a cookie bite"
      className="inline-flex items-center justify-center p-0 bg-transparent hover:scale-110 transition-transform"
      style={{
        verticalAlign: "middle",
        lineHeight: 0, // Ensure the button doesn't affect the text spacing
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="w-6 h-6" // Adjust size to align better with text
        fill="none"
      >
        {/* Base cookie */}
        <circle cx="32" cy="32" r="30" fill="#D2691E" />

        {/* Bite area: uses a mask */}
        <mask id="biteMask">
          {/* Full circle mask */}
          <rect width="64" height="64" fill="white" />
          {hasBite && <circle cx="48" cy="16" r="12" fill="black" />}
        </mask>

        {/* Cookie with bite mask applied */}
        <circle cx="32" cy="32" r="30" fill="#D2691E" mask="url(#biteMask)" />

        {/* Chocolate chips */}
        <circle cx="20" cy="24" r="3" fill="#3E2723" />
        <circle cx="40" cy="18" r="3" fill="#3E2723" />
        <circle cx="28" cy="40" r="3" fill="#3E2723" />
        <circle cx="44" cy="36" r="3" fill="#3E2723" />
        <circle cx="24" cy="48" r="3" fill="#3E2723" />
      </svg>
    </button>
  );
};

const App = () => {
  return (
    <p className="text-lg">
      On your way out, don't forget to grab a cookie!{" "}
      <Cookie />
    </p>
  );
};

export default App;
