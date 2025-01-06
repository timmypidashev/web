import React, { useState, useEffect } from "react";

import { Links } from "@/components/header/links";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
    setLastScrollY(currentScrollY);
  };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const headerLinks = Links.map((link) => (
    <div
      key={link.id}
      className={`inline-block ${link.color}`}
    >
      <a href={link.href}>{link.label}</a>
    </div>
   ));
  
  return (
    <header className={`fixed z-50 top-0 left-0 right-0 font-bold transition-transform duration-300 ${
      visible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="flex flex-row pt-1 px-2 bg-black text-lg lg:pt-2 lg:text-3xl md:text-2xl items-center justify-between md:justify-center space-x-2 md:space-x-10 lg:space-x-20">
        {headerLinks}
      </div>
    </header>
  );
};
