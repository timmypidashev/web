import React from "react";

export default function Footer({ fixed = false }) {
  return (
    <footer className={`w-full ${fixed ? 'fixed bottom-0 left-0 right-0' : ''}`}>
      footer
    </footer>
  );
}
