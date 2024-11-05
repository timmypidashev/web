import React from "react";
import { Links } from "@/components/footer/links";

export default function Footer({ fixed = false }) {
  const footerLinks = Links.map((link) => (
    <div
      key={link.id}
      className={`inline-block ${link.color}`}
    >
      <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
    </div>
  ));

  return (
    <footer className={`w-full ${fixed ? "fixed bottom-0 left-0 right-0" : ""}`}>
      <div className="flex flex-row px-2 py-1 text-lg lg:px-6 lg:py-1.5 lg:text-3xl md:text-2xl justify-between md:justify-center space-x-2 md:space-x-10 lg:space-x-20">
        {footerLinks}
      </div>
    </footer>
  );
}
