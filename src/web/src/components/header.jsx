"use client";

import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";


let tabs = [
  { id: "/", label: "Home", color: "green" },
  { id: "projects", label: "Projects", color: "yellow" },
  { id: "resume", label: "Resume", color: "blue" },
  { id: "blog", label: "Blog", color: "purple" },
  { id: "shop", label: "Shop", color: "aqua" }
];

const tabColors = {
  "green": "bg-light-green-1 dark:bg-dark-green-1",
  "yellow": "bg-light-yellow-1 dark:bg-dark-yellow-1",
  "blue": "bg-light-blue-1 dark:bg-dark-blue-1",
  "purple": "bg-light-purple-1 dark:bg-dark-purple-1",
  "aqua": "bg-light-aqua-1 dark:bg-dark-aqua-1"
}

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
    <div className="flex justify-center items-center">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/${tab.id}`} passHref>
            <motion.a
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id ? "" : "hover:text-white/60"
              } relative rounded-full px-3 py-1.5 text-sm text-light-foreground dark:text-dark-foreground transition-all focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className={`absolute inset-x-0 bottom-0 h-1 ${tabColors[tab.color]}`}
                  style={{ marginLeft: "0.75em", marginRight: "0.75em", borderRadius: 9999  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </motion.a>
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </div>
  );
}
export default Header;
