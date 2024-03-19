"use client";

import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              },
              hidden: { opacity: 0 }
            }}
            className="flex space-x-1"
          >
            {tabs.map((tab, index) => (
              <Link key={tab.id} href={`/${tab.id}`} passHref>
                <motion.a
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id ? "" : ""
                  } 
                  relative rounded-full
                  lg:px-6 md:px-5 sm:px-4 lg:py-1.5 md:py-1.5 sm:py-1.5
                  lg:mr-8 md:mr-4 sm:mr-2 lg:mb-1 md:mb-1 sm:mb-1
                  lg:text-4xl md:text-3xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground
                  transition-all focus-visible:outline-2`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                  variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: -50 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="underline"
                      className={`absolute inset-x-0 lg:bottom-0.5 md:bottom-0.5 sm:bottom-0.5 lg:h-1.5 md:h-1.5 sm:h-1 ${tabColors[tab.color]}`}
                      style={{ marginLeft: "0.75em", marginRight: "0.75em", borderRadius: 9999 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab.label}
                </motion.a>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Header;
