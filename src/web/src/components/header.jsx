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
    <div className="flex justify-center items-center">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/${tab.id}`} passHref>
            <motion.a
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id ? "" : "hover:text-white/60"
              } relative rounded-full px-3 py-1.5 text-sm font-medium text-light-foreground dark:text-dark-foreground outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute inset-x-0 bottom-0 h-1 bg-light-green-1 dark:bg-dark-green-1"
                  style={{ marginLeft: "0.75em", marginRight: "0.75em", borderRadius: 9999  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </motion.a>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Header;
