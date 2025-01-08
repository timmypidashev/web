// components/header/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { Links } from "@/components/header/links";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentPath, setCurrentPath] = useState("");
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    setCurrentPath(document.location.pathname);
    // Trigger initial animation after a brief delay
    setTimeout(() => setShouldAnimate(true), 50);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const currentScrollY = document.documentElement.scrollTop;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isClient]);

  const checkIsActive = (linkHref: string): boolean => {
    if (!isClient) return false;
    
    const path = document.location.pathname;
    if (linkHref === "/") return path === "/";
    
    return linkHref !== "/" && path.startsWith(linkHref);
  };

  const headerLinks = Links.map((link) => {
    const isActive = checkIsActive(link.href);
    
    return (
      <div
        key={link.id}
        className={`relative inline-block ${link.color}`}
      >
        <a 
          href={link.href}
          className="relative inline-block"
        >
          {link.label}
          <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
            {isClient && isActive && (
              <svg 
                className="w-full h-3 opacity-100"
                preserveAspectRatio="none"
                viewBox="0 0 100 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="stroke-current transition-[stroke-dashoffset] duration-[600ms] ease-out"
                  d="M0,6 
                    C25,4 35,8 50,6 
                    S75,4 100,6"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: shouldAnimate ? 0 : 100
                  }}
                />
              </svg>
            )}
          </div>
        </a>
      </div>
    );
  });
  
  return (
    <header 
      className={`
        fixed z-50 top-0 left-0 right-0 
        bg-black font-bold 
        transition-transform duration-300
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="flex flex-row pt-1 px-2 text-lg lg:pt-2 lg:text-3xl md:text-2xl items-center justify-between md:justify-center space-x-2 md:space-x-10 lg:space-x-20">
        {headerLinks}
      </div>
    </header>
  );
}
