"use client";

import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";


let tabs = [
  { id: "/", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "blog", label: "Blog" },
  { id: "shop", label: "Shop" },
];

function Header() {
  const [mounted, setMounted] = useState(false);
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <div key={tab.id} className="invisible">
            {/* Placeholder for each tab */}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <Link key={tab.id} href={`/${tab.id}`} passHref>
          <motion.a
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id ? "" : "hover:text-white/60"
            } relative rounded-full px-3 py-1.5 text-sm font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 bg-white mix-blend-difference"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </motion.a>
        </Link>
      ))}
    </div>
  );
}
export default Header;
