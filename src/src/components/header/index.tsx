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
    <header className={`fixed top-0 left-0 right-0 transition-transform duration-300 ${
      visible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="hidden md:flex flex-row pt-2 md:text-3xl items-center justify-center lg:space-x-20 md:space-x-10">
        {headerLinks}
      </div>
      <div className="flex md:hidden">
       {headerLinks}
      </div>
    </header>
  );
};
